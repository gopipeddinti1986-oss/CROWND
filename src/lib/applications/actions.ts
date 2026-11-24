"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ApplicationStatus } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

export interface ApplicationResponse {
  success: boolean;
  error?: string;
  applicationId?: string;
}

export async function applyToCampaignAction(params: {
  campaignId: string;
  pitch: string;
  proposedContentPlan?: string;
  portfolioLinks?: string[];
  socialLinks?: Record<string, string>;
}): Promise<ApplicationResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  // 1. Fetch Creator Profile
  const { data: creator } = await admin
    .from("creators")
    .select("id, handle, audience_size, onboarding_completed, verified, profiles!inner(full_name)")
    .eq("profile_id", user.id)
    .single();

  if (!creator) {
    return { success: false, error: "Only registered creators can apply to campaigns." };
  }

  if (!creator.onboarding_completed) {
    return {
      success: false,
      error: "Please complete your creator onboarding before applying to campaigns.",
    };
  }

  // 2. Fetch Campaign
  const { data: campaign } = await admin
    .from("campaigns")
    .select(
      "id, title, brand_id, status, min_followers, max_followers, application_deadline, brands!inner(profile_id)"
    )
    .eq("id", params.campaignId)
    .single();

  if (!campaign) {
    return { success: false, error: "Campaign not found." };
  }

  if (campaign.status !== "active") {
    return { success: false, error: "This campaign is not currently accepting applications." };
  }

  // Prevent brand applying to their own campaign
  if (campaign.brands.profile_id === user.id) {
    return { success: false, error: "Brands cannot apply to their own campaigns." };
  }

  // Deadline check
  if (campaign.application_deadline && new Date() > new Date(campaign.application_deadline)) {
    return { success: false, error: "The application cutoff date for this campaign has passed." };
  }

  // Follower requirement verification
  if (creator.audience_size < (campaign.min_followers || 0)) {
    return {
      success: false,
      error: `This campaign requires a minimum audience reach of ${(campaign.min_followers || 0).toLocaleString()} followers.`,
    };
  }

  if (campaign.max_followers && creator.audience_size > campaign.max_followers) {
    return {
      success: false,
      error: `This campaign is reserved for micro-creators under ${campaign.max_followers.toLocaleString()} followers.`,
    };
  }

  // Pitch validation
  if (!params.pitch || params.pitch.trim().length < 20) {
    return {
      success: false,
      error: "Please provide a pitch of at least 20 characters explaining your vision.",
    };
  }

  // Check duplicate application
  const { data: existingApp } = await admin
    .from("campaign_applications")
    .select("id, status")
    .eq("campaign_id", params.campaignId)
    .eq("creator_id", creator.id)
    .maybeSingle();

  if (existingApp) {
    return {
      success: false,
      error: `You have already applied to this campaign (Status: ${existingApp.status}).`,
    };
  }

  // Insert application
  const { data: inserted, error: insertError } = await admin
    .from("campaign_applications")
    .insert({
      campaign_id: params.campaignId,
      creator_id: creator.id,
      pitch: params.pitch.trim(),
      proposed_content_plan: params.proposedContentPlan?.trim() || null,
      portfolio_links: params.portfolioLinks || [],
      social_links: params.socialLinks || {},
      status: "pending",
      applied_at: new Date().toISOString(),
    } as never)
    .select()
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // Notify Brand
  await admin.from("notifications").insert({
    user_id: campaign.brands.profile_id,
    type: "new_application",
    title: "New Creator Application",
    message: `@${creator.handle} submitted an application for "${campaign.title}".`,
    action_url: `/dashboard/campaigns/${campaign.id}/applications`,
    is_read: false,
    metadata: { applicationId: inserted.id, campaignId: campaign.id, creatorId: creator.id },
  } as never);

  revalidatePath(`/dashboard/campaigns/${params.campaignId}`);
  revalidatePath("/dashboard/applications");

  return { success: true, applicationId: inserted.id };
}

export async function reviewApplicationAction(
  applicationId: string,
  decision: "approved" | "rejected",
  reviewNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  // Fetch application with campaign and brand profile verification
  const { data: app } = await admin
    .from("campaign_applications")
    .select(
      `
      *,
      campaigns!inner(
        id,
        title,
        brand_id,
        return_window_days,
        commission_rate,
        commission_type,
        brands!inner(id, profile_id, company_name)
      ),
      creators!inner(id, handle, profile_id)
    `
    )
    .eq("id", applicationId)
    .single();

  if (!app || app.campaigns.brands.profile_id !== user.id) {
    return { success: false, error: "Application not found or unauthorized." };
  }

  if (app.status === decision) {
    return { success: true };
  }

  const status: ApplicationStatus = decision;

  // 1. Update Application status
  const { error: updateError } = await admin
    .from("campaign_applications")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      review_notes: reviewNotes?.trim() || null,
    } as never)
    .eq("id", applicationId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // 2. If approved, create Collaboration record and generate Referral Link
  if (decision === "approved") {
    // Upsert Collaboration
    const { data: collab, error: collabErr } = await admin
      .from("collaborations")
      .upsert(
        {
          campaign_id: app.campaigns.id,
          brand_id: app.campaigns.brands.id,
          creator_id: app.creators.id,
          application_id: app.id,
          status: "active",
          deliverables_status: { content_submitted: false, content_approved: false },
          updated_at: new Date().toISOString(),
        } as never,
        { onConflict: "campaign_id,creator_id" }
      )
      .select()
      .single();

    if (!collabErr && collab) {
      // Generate Unique Referral Code
      const safeHandle = app.creators.handle
        .replace(/[^a-z0-9]/gi, "")
        .substring(0, 10)
        .toLowerCase();
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const referralCode = `CW-${safeHandle}-${randomSuffix}`;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crownd.com";
      const trackingUrl = `${siteUrl}/r/${referralCode}`;

      await admin.from("referral_links").upsert(
        {
          campaign_id: app.campaigns.id,
          creator_id: app.creators.id,
          collaboration_id: collab.id,
          code: referralCode,
          tracking_url: trackingUrl,
          destination_url: `${siteUrl}/campaigns/${app.campaigns.id}`,
          is_active: true,
        } as never,
        { onConflict: "campaign_id,creator_id" }
      );
    }

    // Notify Creator of Approval
    await admin.from("notifications").insert({
      user_id: app.creators.profile_id,
      type: "application_approved",
      title: "Application Approved!",
      message: `${app.campaigns.brands.company_name} accepted your application for "${app.campaigns.title}". Your tracking link is now active.`,
      action_url: `/dashboard/collaborations`,
      is_read: false,
      metadata: { applicationId, campaignId: app.campaigns.id },
    } as never);
  } else {
    // Notify Creator of Rejection
    await admin.from("notifications").insert({
      user_id: app.creators.profile_id,
      type: "application_rejected",
      title: "Application Update",
      message: `Your application for "${app.campaigns.title}" was not selected at this time.`,
      action_url: `/dashboard/applications`,
      is_read: false,
      metadata: { applicationId, campaignId: app.campaigns.id },
    } as never);
  }

  revalidatePath(`/dashboard/campaigns/${app.campaigns.id}/applications`);
  revalidatePath(`/dashboard/collaborations`);

  return { success: true };
}

export async function getCampaignApplicationsAction(campaignId: string): Promise<{
  success: boolean;
  applications?: any[];
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

  const { data: campaign } = await admin
    .from("campaigns")
    .select("id, brands!inner(profile_id)")
    .eq("id", campaignId)
    .single();

  if (!campaign || campaign.brands.profile_id !== user.id) {
    return { success: false, error: "Unauthorized." };
  }

  const { data: apps, error } = await admin
    .from("campaign_applications")
    .select(
      `
      *,
      creators!inner(
        id,
        handle,
        display_name,
        profile_photo_url,
        audience_size,
        primary_platform,
        primary_niche,
        verified
      )
    `
    )
    .eq("campaign_id", campaignId)
    .order("applied_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, applications: apps || [] };
}

export async function getCreatorApplicationsAction(): Promise<{
  success: boolean;
  applications?: any[];
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

  const { data: creator } = await admin
    .from("creators")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!creator) {
    return { success: false, error: "Creator not found." };
  }

  const { data: apps, error } = await admin
    .from("campaign_applications")
    .select(
      `
      *,
      campaigns!inner(
        id,
        title,
        slug,
        status,
        commission_rate,
        commission_type,
        return_window_days,
        brands!inner(company_name, logo_url)
      )
    `
    )
    .eq("creator_id", creator.id)
    .order("applied_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, applications: apps || [] };
}

export async function withdrawApplicationAction(
  applicationId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  const { data: app } = await admin
    .from("campaign_applications")
    .select("*, creators!inner(profile_id)")
    .eq("id", applicationId)
    .single();

  if (!app || app.creators.profile_id !== user.id) {
    return { success: false, error: "Application not found or unauthorized." };
  }

  if (app.status !== "pending") {
    return { success: false, error: "Only pending applications can be withdrawn." };
  }

  const { error } = await admin
    .from("campaign_applications")
    .update({ status: "withdrawn", reviewed_at: new Date().toISOString() } as never)
    .eq("id", applicationId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/applications");
  return { success: true };
}
