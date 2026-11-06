"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Orchestrates publishing an entity and moving its referenced private draft media into portfolio-media.
 */
export async function publishEntityAction({ entityType, entityId, mediaIds = [] }) {
  try {
    const { supabase } = await requireAdmin();
    const adminClient = createAdminClient();

    if (!adminClient) {
      throw new Error("Admin service client is not available.");
    }

    const publishToken = crypto.randomUUID();

    // 1. Record journal: initiated
    const { data: journal, error: journalError } = await adminClient
      .from("publishing_journal")
      .insert({
        publish_token: publishToken,
        entity_type: entityType,
        entity_id: entityId,
        stage: "initiated",
        lease_expires_at: new Date(Date.now() + 120000).toISOString(),
      })
      .select()
      .single();

    if (journalError) throw journalError;

    // 2. Validate and stage referenced media
    if (mediaIds.length > 0) {
      const { data: mediaItems, error: mediaError } = await adminClient
        .from("media")
        .select("*")
        .in("id", mediaIds);

      if (mediaError) throw mediaError;

      // Update journal: copying_assets
      await adminClient
        .from("publishing_journal")
        .update({
          stage: "copying_assets",
          staged_media_snapshot: mediaItems,
        })
        .eq("id", journal.id);

      const publishedCopies = [];

      for (const media of mediaItems) {
        if (media.bucket === "portfolio-private") {
          // Copy from portfolio-private/drafts/... to portfolio-media/<folder>/...
          const fileName = media.storage_path.split("/").pop();
          const targetPath = `${media.folder}/${fileName}`;

          const { error: copyError } = await adminClient.storage
            .from("portfolio-media")
            .copy(media.storage_path, targetPath, {
              sourceBucket: "portfolio-private",
            });

          if (copyError) {
            // Rollback copied objects
            for (const pub of publishedCopies) {
              await adminClient.storage.from("portfolio-media").remove([pub.targetPath]);
            }

            await adminClient
              .from("publishing_journal")
              .update({ stage: "failed", error_details: { message: copyError.message } })
              .eq("id", journal.id);

            throw new Error(`Failed to copy media to public bucket: ${copyError.message}`);
          }

          const { data: publicUrlData } = adminClient.storage
            .from("portfolio-media")
            .getPublicUrl(targetPath);

          // Update media record to public
          await adminClient
            .from("media")
            .update({
              bucket: "portfolio-media",
              access_level: "public",
              storage_path: targetPath,
              public_url: publicUrlData.publicUrl,
              updated_at: new Date().toISOString(),
            })
            .eq("id", media.id);

          publishedCopies.push({ id: media.id, targetPath, publicUrl: publicUrlData.publicUrl });
        }
      }

      await adminClient
        .from("publishing_journal")
        .update({
          published_media_snapshot: publishedCopies,
          stage: "database_updating",
        })
        .eq("id", journal.id);
    }

    // 3. Update entity status to published in public table
    const table = entityType === "project" ? "projects" : entityType === "artwork" ? "artworks" : `${entityType}s`;
    const { error: updateError } = await supabase
      .from(table)
      .update({ status: "published", updated_at: new Date().toISOString() })
      .eq("id", entityId);

    if (updateError) throw updateError;

    // 4. Invalidate caches
    await adminClient
      .from("publishing_journal")
      .update({ stage: "cache_invalidating" })
      .eq("id", journal.id);

    revalidatePath("/");
    revalidateTag("projects");
    revalidatePath("/admin/projects");

    // 5. Mark completed
    await adminClient
      .from("publishing_journal")
      .update({ stage: "completed", lease_expires_at: null })
      .eq("id", journal.id);

    return successResponse({ publishToken }, "Entity published successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

