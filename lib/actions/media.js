"use server";

import { uploadIntentSchema, confirmUploadSchema } from "@/lib/validations/media";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function getMediaListAction(options = {}) {
  try {
    const { supabase } = await requireAdmin();
    let query = supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    if (options.bucket) {
      query = query.eq("bucket", options.bucket);
    }
    if (options.folder) {
      query = query.eq("folder", options.folder);
    }
    if (options.access_level) {
      query = query.eq("access_level", options.access_level);
    }

    const { data, error } = await query;
    if (error) throw error;

    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Step 1: Request a signed upload URL.
 * Draft media is strictly routed to portfolio-private under drafts/
 */
export async function createUploadIntentAction(payload) {
  try {
    await requireAdmin();
    const validated = uploadIntentSchema.parse(payload);
    const adminClient = createAdminClient();

    if (!adminClient) {
      throw new Error("Admin service client is not available.");
    }

    // Determine bucket: private settings/documents or draft media -> portfolio-private
    const isPrivateFolder = ["documents", "private_settings"].includes(validated.folder);
    const bucket = (validated.is_draft || isPrivateFolder) ? "portfolio-private" : "portfolio-media";
    const prefix = validated.is_draft ? "drafts" : validated.folder;

    const fileExt = validated.filename.split(".").pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const storagePath = `${prefix}/${uniqueFileName}`;

    // Create signed upload URL (valid for 300 seconds)
    const { data, error } = await adminClient.storage
      .from(bucket)
      .createSignedUploadUrl(storagePath);

    if (error) throw error;

    return successResponse({
      signedUrl: data.signedUrl,
      token: data.token,
      storagePath,
      bucket,
      fileName: validated.filename,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Step 2: Confirm upload after client PUT completes.
 * Inserts metadata record into public.media using service_role.
 */
export async function confirmUploadAction(payload) {
  try {
    await requireAdmin();
    const validated = confirmUploadSchema.parse(payload);
    const adminClient = createAdminClient();

    if (!adminClient) {
      throw new Error("Admin service client is not available.");
    }

    const isPublicBucket = validated.bucket === "portfolio-media";
    const accessLevel = isPublicBucket ? "public" : "private";

    let publicUrl = null;
    if (isPublicBucket) {
      const { data } = adminClient.storage
        .from(validated.bucket)
        .getPublicUrl(validated.storage_path);
      publicUrl = data?.publicUrl || null;
    }

    const { data, error } = await adminClient
      .from("media")
      .insert({
        file_name: validated.file_name,
        storage_path: validated.storage_path,
        bucket: validated.bucket,
        access_level: accessLevel,
        folder: validated.folder,
        mime_type: validated.mime_type,
        size_bytes: validated.size_bytes,
        width: validated.width || null,
        height: validated.height || null,
        alt_text: validated.alt_text || null,
        public_url: publicUrl,
        is_pending_deletion: false,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/media");
    return successResponse(data, "Media asset registered successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Concurrency-safe media deletion via request_media_deletion RPC.
 */
export async function requestMediaDeletionAction(mediaId) {
  try {
    const { supabase } = await requireAdmin();

    const { data, error } = await supabase.rpc("request_media_deletion", {
      p_media_id: mediaId,
    });

    if (error) throw error;

    revalidatePath("/admin/media");
    return successResponse(data, "Media scheduled for deletion and queued for background purge.");
  } catch (err) {
    return errorResponse(err);
  }
}

