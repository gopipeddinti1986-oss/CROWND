"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, CampaignStatus, CompensationModel } from "@/lib/types/database";
import {
  generateSlug,
  validateCampaignTitle,
  validateCampaignDescription,
  validateCampaignBudget,
  validateCommissionRate,
  validateReturnWindow,
  validateCampaignDates,
  validateFollowerBounds,
  validateCampaignStatusTransition,
} from "./validation";
import { revalidatePath } from "next/cache";

export interface CampaignActionResponse {
  success: boolean;
  error?: string;
  campaignId?: string;
  slug?: string;
  campaign?: Database["public"]["Tables"]["campaigns"]["Row"] | null;
}

export async function createCampaignAction(
  data: Partial<Database["public"]["Tables"]["campaigns"]["Insert"]>
): Promise<CampaignActionResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  // Verify user is an authorized brand
  const { data: brand } = await admin
    .from("brands")
    .select("id, company_name")
    .eq("profile_id", user.id)
    .single();

  if (!brand) {
    return { success: false, error: "Only registered brands can create campaigns." };
  }

  // Field Validations
  const vTitle = validateCampaignTitle(data.title || "");
  if (!vTitle.valid) return { success: false, error: vTitle.error };

  const vDesc = validateCampaignDescription(data.description || "");
  if (!vDesc.valid) return { success: false, error: vDesc.error };

  const budget = Number(data.budget ?? 0);
  const vBudget = validateCampaignBudget(budget);
  if (!vBudget.valid) return { success: false, error: vBudget.error };

  const commissionRate = Number(data.commission_rate ?? 10);
  const commissionType = data.commission_type || "percentage";
  const vComm = validateCommissionRate(commissionRate, commissionType);
  if (!vComm.valid) return { success: false, error: vComm.error };

  const returnWindow = Number(data.return_window_days ?? 14);
  const vReturn = validateReturnWindow(returnWindow);
  if (!vReturn.valid) return { success: false, error: vReturn.error };

  const vDates = validateCampaignDates({
    starts_at: data.starts_at,
    ends_at: data.ends_at,
    application_deadline: data.application_deadline,
    content_deadline: data.content_deadline,
  });
  if (!vDates.valid) return { success: false, error: vDates.error };

  const minFollowers = Number(data.min_followers ?? 0);
  const maxFollowers = data.max_followers ? Number(data.max_followers) : null;
  const vFollowers = validateFollowerBounds(minFollowers, maxFollowers);
  if (!vFollowers.valid) return { success: false, error: vFollowers.error };

  const slug = generateSlug(data.title!.trim());
  const status: CampaignStatus = data.status || "draft";

  const insertPayload: Database["public"]["Tables"]["campaigns"]["Insert"] = {
    brand_id: brand.id,
    title: data.title!.trim(),
    slug,
    description: data.description!.trim(),
    objective: data.objective || "sales",
    campaign_type: data.campaign_type || "performance",
    category: data.category || "General",
    cover_image_url: data.cover_image_url || null,
    target_platforms: data.target_platforms || ["Instagram"],
    min_followers: minFollowers,
    max_followers: maxFollowers,
    required_deliverables: data.required_deliverables || ["1x Reel", "1x Story"],
    deliverable_guidelines: data.deliverable_guidelines || null,
    application_deadline: data.application_deadline || null,
    content_deadline: data.content_deadline || null,
    product_id: data.product_id || null,
    requirements: data.requirements || null,
    budget,
    allocated_budget: 0,
    remaining_budget: budget,
    compensation_model: (data.compensation_model as CompensationModel) || "commission",
    fixed_amount: Number(data.fixed_amount ?? 0),
    commission_rate: commissionRate,
    commission_type: commissionType,
    return_window_days: returnWindow,
    status,
    starts_at: data.starts_at || new Date().toISOString(),
    ends_at: data.ends_at || null,
    terms_and_conditions: data.terms_and_conditions || null,
    tags: data.tags || [],
  };

  const { data: inserted, error: insertError } = await admin
    .from("campaigns")
    .insert(insertPayload as never)
    .select()
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // Create audit log
  await admin.from("audit_logs").insert({
    user_id: user.id,
    action: "create_campaign",
    entity_type: "campaign",
    entity_id: inserted.id,
    metadata: { title: inserted.title, status: inserted.status },
  } as never);

  revalidatePath("/dashboard/campaigns");
  revalidatePath("/campaigns");

  return {
    success: true,
    campaignId: inserted.id,
    slug: inserted.slug,
    campaign: inserted,
  };
}

export async function updateCampaignAction(
  campaignId: string,
  data: Partial<Database["public"]["Tables"]["campaigns"]["Update"]>
): Promise<CampaignActionResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  // Verify ownership
  const { data: existing } = await admin
    .from("campaigns")
    .select("*, brands!inner(profile_id)")
    .eq("id", campaignId)
    .single();

  if (!existing || existing.brands.profile_id !== user.id) {
    return { success: false, error: "Campaign not found or unauthorized." };
  }

  if (existing.status === "archived") {
    return { success: false, error: "Archived campaigns cannot be modified." };
  }

  // Validations if provided
  if (data.title) {
    const v = validateCampaignTitle(data.title);
    if (!v.valid) return { success: false, error: v.error };
  }
  if (data.description) {
    const v = validateCampaignDescription(data.description);
    if (!v.valid) return { success: false, error: v.error };
  }
  if (data.budget !== undefined) {
    const v = validateCampaignBudget(Number(data.budget));
    if (!v.valid) return { success: false, error: v.error };
  }

  const updatePayload = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  const { data: updated, error } = await admin
    .from("campaigns")
    .update(updatePayload as never)
    .eq("id", campaignId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/campaigns/${campaignId}`);
  revalidatePath("/dashboard/campaigns");

  return { success: true, campaignId: updated.id, campaign: updated };
}

export async function updateCampaignStatusAction(
  campaignId: string,
  targetStatus: CampaignStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  const { data: existing } = await admin
    .from("campaigns")
    .select("status, title, brands!inner(profile_id)")
    .eq("id", campaignId)
    .single();

  if (!existing || existing.brands.profile_id !== user.id) {
    return { success: false, error: "Campaign not found or unauthorized." };
  }

  const transition = validateCampaignStatusTransition(
    existing.status as CampaignStatus,
    targetStatus
  );
  if (!transition.allowed) {
    return { success: false, error: transition.reason };
  }

  const { error } = await admin
    .from("campaigns")
    .update({ status: targetStatus, updated_at: new Date().toISOString() } as never)
    .eq("id", campaignId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log transition
  await admin.from("audit_logs").insert({
    user_id: user.id,
    action: "update_campaign_status",
    entity_type: "campaign",
    entity_id: campaignId,
    metadata: { previousStatus: existing.status, newStatus: targetStatus },
  } as never);

  revalidatePath(`/dashboard/campaigns/${campaignId}`);
  revalidatePath("/dashboard/campaigns");
  revalidatePath("/campaigns");

  return { success: true };
}

export async function getBrandCampaignsAction(): Promise<{
  success: boolean;
  campaigns?: Array<
    Database["public"]["Tables"]["campaigns"]["Row"] & {
      applications_count: number;
      active_creators: number;
    }
  >;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  const { data: brand } = await admin
    .from("brands")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!brand) {
    return { success: false, error: "Brand profile not found." };
  }

  const { data: campaigns, error } = await admin
    .from("campaigns")
    .select("*, campaign_applications(count), collaborations(count)")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  const formatted = (campaigns || []).map((c: any) => ({
    ...c,
    applications_count: c.campaign_applications?.[0]?.count || 0,
    active_creators: c.collaborations?.[0]?.count || 0,
  }));

  return { success: true, campaigns: formatted };
}

export async function deleteCampaignDraftAction(
  campaignId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  const { data: existing } = await admin
    .from("campaigns")
    .select("status, brands!inner(profile_id)")
    .eq("id", campaignId)
    .single();

  if (!existing || existing.brands.profile_id !== user.id) {
    return { success: false, error: "Campaign not found or unauthorized." };
  }

  if (existing.status !== "draft") {
    return { success: false, error: "Only draft campaigns can be deleted." };
  }

  const { error } = await admin.from("campaigns").delete().eq("id", campaignId);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/campaigns");
  return { success: true };
}

export async function getActiveCampaignsAction(): Promise<{
  success: boolean;
  campaigns?: any[];
  error?: string;
}> {
  try {
    const admin = createAdminClient() as any;
    const { data, error } = await admin
      .from("campaigns")
      .select("*, brands(company_name, logo_url, website)")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, campaigns: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
