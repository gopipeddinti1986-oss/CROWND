"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CollaborationStatus } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

export async function getCollaborationsAction(params?: {
  campaignId?: string;
}): Promise<{ success: boolean; collaborations?: any[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  // Find user profile role
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();

  const isBrand = profile?.role === "brand";

  let query = admin.from("collaborations").select(`
    *,
    campaigns!inner(id, title, status, return_window_days, commission_rate, commission_type, required_deliverables, deliverable_guidelines),
    brands!inner(id, company_name, profile_id),
    creators!inner(id, handle, display_name, profile_photo_url, profile_id)
  `);

  if (isBrand) {
    query = query.eq("brands.profile_id", user.id);
  } else {
    query = query.eq("creators.profile_id", user.id);
  }

  if (params?.campaignId) {
    query = query.eq("campaign_id", params.campaignId);
  }

  const { data: collabs, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  // Fetch corresponding referral links
  const collabsWithLinks = await Promise.all(
    (collabs || []).map(async (c: any) => {
      const { data: link } = await admin
        .from("referral_links")
        .select("*")
        .eq("campaign_id", c.campaign_id)
        .eq("creator_id", c.creator_id)
        .maybeSingle();

      return {
        ...c,
        referral_link: link || null,
      };
    })
  );

  return { success: true, collaborations: collabsWithLinks };
}

export async function submitContentAction(params: {
  collaborationId: string;
  contentUrl: string;
  caption?: string;
  contentPlatform?: string;
  submissionNotes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  // Verify creator ownership
  const { data: collab } = await admin
    .from("collaborations")
    .select(
      "*, creators!inner(profile_id, handle), brands!inner(profile_id), campaigns!inner(title)"
    )
    .eq("id", params.collaborationId)
    .single();

  if (!collab || collab.creators.profile_id !== user.id) {
    return { success: false, error: "Collaboration not found or unauthorized." };
  }

  if (!params.contentUrl || !params.contentUrl.trim().startsWith("http")) {
    return {
      success: false,
      error: "Please provide a valid public URL to your published content.",
    };
  }

  const { error: updateError } = await admin
    .from("collaborations")
    .update({
      content_url: params.contentUrl.trim(),
      content_caption: params.caption?.trim() || null,
      content_platform: params.contentPlatform || "Instagram",
      submission_notes: params.submissionNotes?.trim() || null,
      status: "content_submitted",
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", params.collaborationId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Notify Brand
  await admin.from("notifications").insert({
    user_id: collab.brands.profile_id,
    type: "content_submitted",
    title: "Content Submitted for Review",
    message: `@${collab.creators.handle} submitted content for "${collab.campaigns.title}".`,
    action_url: `/dashboard/collaborations`,
    is_read: false,
    metadata: { collaborationId: collab.id, contentUrl: params.contentUrl },
  } as never);

  revalidatePath("/dashboard/collaborations");
  return { success: true };
}

export async function reviewContentAction(params: {
  collaborationId: string;
  decision: "approved" | "revision_requested";
  feedback?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  const { data: collab } = await admin
    .from("collaborations")
    .select(
      "*, brands!inner(profile_id, company_name), creators!inner(profile_id), campaigns!inner(title)"
    )
    .eq("id", params.collaborationId)
    .single();

  if (!collab || collab.brands.profile_id !== user.id) {
    return { success: false, error: "Collaboration not found or unauthorized." };
  }

  const targetStatus: CollaborationStatus =
    params.decision === "approved" ? "approved" : "revision_requested";

  const { error: updateError } = await admin
    .from("collaborations")
    .update({
      status: targetStatus,
      revision_feedback: params.feedback?.trim() || null,
      approved_at: params.decision === "approved" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", params.collaborationId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Notify Creator
  await admin.from("notifications").insert({
    user_id: collab.creators.profile_id,
    type: params.decision === "approved" ? "content_approved" : "revision_requested",
    title: params.decision === "approved" ? "Content Approved!" : "Content Revision Requested",
    message:
      params.decision === "approved"
        ? `${collab.brands.company_name} approved your content submission for "${collab.campaigns.title}".`
        : `${collab.brands.company_name} requested a revision: ${params.feedback || "Please review notes."}`,
    action_url: `/dashboard/collaborations`,
    is_read: false,
    metadata: { collaborationId: collab.id, decision: params.decision },
  } as never);

  revalidatePath("/dashboard/collaborations");
  return { success: true };
}
