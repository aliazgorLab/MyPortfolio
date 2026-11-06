"use server";

import { siteSettingSchema } from "@/lib/validations/settings";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function getSiteSettingsAction() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*, media(*)")
      .order("key", { ascending: true });

    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateSiteSettingAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = siteSettingSchema.parse(payload);

    const { data, error } = await supabase
      .from("site_settings")
      .upsert(
        {
          key: validated.key,
          value: validated.value,
          description: validated.description,
          is_public: validated.is_public,
          media_id: validated.media_id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      )
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return successResponse(data, `Setting '${validated.key}' updated.`);
  } catch (err) {
    return errorResponse(err);
  }
}

