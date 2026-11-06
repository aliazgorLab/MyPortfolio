"use server";

import { certificationSchema } from "@/lib/validations/certifications";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function getCertificationsAction() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true })
      .order("issue_date", { ascending: false });

    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createCertificationAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = certificationSchema.parse(payload);

    const { data, error } = await supabase
      .from("certifications")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/certifications");
    return successResponse(data, "Certification created.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateCertificationAction(id, payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = certificationSchema.parse(payload);

    const { data, error } = await supabase
      .from("certifications")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/certifications");
    return successResponse(data, "Certification updated.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteCertificationAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/certifications");
    return successResponse(null, "Certification deleted.");
  } catch (err) {
    return errorResponse(err);
  }
}

