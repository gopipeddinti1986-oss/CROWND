"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, OrderStatus, RewardStatus } from "@/lib/types/database";
import { resolveLastClickAttribution, calculateDecimalCommission } from "@/lib/attribution/engine";
import { revalidatePath } from "next/cache";

export interface RecordOrderResponse {
  success: boolean;
  error?: string;
  orderId?: string;
  commissionAmount?: number;
  attributed?: boolean;
}

export async function recordOrderConversionAction(params: {
  campaignId: string;
  orderNumber: string;
  orderAmount: number;
  currency?: string;
  referralCode?: string;
  notes?: string;
  status?: OrderStatus;
}): Promise<RecordOrderResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  // 1. Fetch Campaign and Brand Ownership
  const { data: campaign } = await admin
    .from("campaigns")
    .select("*, brands!inner(id, profile_id, company_name)")
    .eq("id", params.campaignId)
    .single();

  if (!campaign) {
    return { success: false, error: "Campaign not found." };
  }

  // Authorization: Only the brand owner (or admin) can manually log an order
  if (campaign.brands.profile_id !== user.id) {
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, error: "Unauthorized. Only brand owners can record conversions." };
    }
  }

  // Idempotency: Check if order already recorded
  const cleanOrderNumber = params.orderNumber.trim();
  const { data: existingOrder } = await admin
    .from("orders")
    .select("id")
    .eq("order_number", cleanOrderNumber)
    .maybeSingle();

  if (existingOrder) {
    return { success: false, error: `Order #${cleanOrderNumber} has already been recorded.` };
  }

  if (params.orderAmount <= 0) {
    return { success: false, error: "Order amount must be greater than zero." };
  }

  // 2. Resolve Attribution
  let linkId: string | null = null;
  let creatorId: string | null = null;
  let clickId: string | null = null;
  let attributed = false;

  if (params.referralCode) {
    const { data: refLink } = await admin
      .from("referral_links")
      .select(
        "id, creator_id, campaign_id, clicks_count, sales_count, revenue_generated, commissions_earned"
      )
      .eq("code", params.referralCode.trim())
      .maybeSingle();

    if (refLink) {
      linkId = refLink.id;
      creatorId = refLink.creator_id;
      attributed = true;

      // Find the most recent click on this link
      const { data: recentClicks } = await admin
        .from("clicks")
        .select("id, link_id, campaign_id, creator_id, clicked_at, is_bot")
        .eq("link_id", refLink.id)
        .order("clicked_at", { ascending: false })
        .limit(10);

      const attributionResult = resolveLastClickAttribution(
        recentClicks || [],
        new Date(),
        campaign.return_window_days || 30
      );

      if (attributionResult.attributed) {
        clickId = attributionResult.clickId;
      }
    }
  }

  // 3. Compute Commission
  let commissionAmount = 0;
  if (attributed && creatorId) {
    commissionAmount = calculateDecimalCommission(
      params.orderAmount,
      campaign.commission_rate,
      campaign.commission_type
    );
  }

  const initialStatus: OrderStatus = params.status || "pending";

  // 4. Insert Order
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      campaign_id: campaign.id,
      brand_id: campaign.brands.id,
      creator_id: creatorId,
      link_id: linkId,
      click_id: clickId,
      order_number: cleanOrderNumber,
      order_amount: params.orderAmount,
      commission_amount: commissionAmount,
      currency: params.currency || "USD",
      status: initialStatus,
      attribution_model: "last_click",
      attributed_at: new Date().toISOString(),
      notes: params.notes?.trim() || null,
      delivered_at: initialStatus === "delivered" ? new Date().toISOString() : null,
    } as never)
    .select()
    .single();

  if (orderError) {
    return { success: false, error: orderError.message };
  }

  // 5. If attributed, update Referral Link stats and insert Reward record
  if (attributed && linkId && creatorId && commissionAmount > 0) {
    // Increment referral link aggregates
    const { data: linkCurrent } = await admin
      .from("referral_links")
      .select("sales_count, revenue_generated, commissions_earned")
      .eq("id", linkId)
      .single();

    if (linkCurrent) {
      await admin
        .from("referral_links")
        .update({
          sales_count: (linkCurrent.sales_count || 0) + 1,
          revenue_generated: Number(linkCurrent.revenue_generated || 0) + params.orderAmount,
          commissions_earned: Number(linkCurrent.commissions_earned || 0) + commissionAmount,
        } as never)
        .eq("id", linkId);
    }

    // Insert Reward record
    await admin
      .from("rewards")
      .insert({
        order_id: order.id,
        creator_id: creatorId,
        campaign_id: campaign.id,
        brand_id: campaign.brands.id,
        amount: commissionAmount,
        status: "pending",
        currency: params.currency || "USD",
        reward_type: "commission",
      } as never)
      .select("id")
      .single();

    // Create Transaction Ledger Record
    const { data: creatorProfile } = await admin
      .from("creators")
      .select("profile_id, handle")
      .eq("id", creatorId)
      .single();

    if (creatorProfile) {
      await admin.from("transactions").insert({
        user_id: creatorProfile.profile_id,
        amount: commissionAmount,
        type: "credit",
        reference_id: order.id,
        status: "pending",
      } as never);

      // Notify Creator of Earned Commission
      await admin.from("notifications").insert({
        user_id: creatorProfile.profile_id,
        type: "new_commission",
        title: "New Commission Earned!",
        message: `Order #${cleanOrderNumber} attributed to your link! Commission: $${commissionAmount.toFixed(2)} (clears after ${campaign.return_window_days}-day return window).`,
        action_url: `/dashboard/collaborations`,
        is_read: false,
        metadata: { orderId: order.id, amount: commissionAmount },
      } as never);
    }
  }

  // Log Audit Event
  await admin.from("audit_logs").insert({
    user_id: user.id,
    action: "record_conversion",
    entity_type: "order",
    entity_id: order.id,
    metadata: {
      orderNumber: cleanOrderNumber,
      amount: params.orderAmount,
      attributed,
      commissionAmount,
    },
  } as never);

  revalidatePath(`/dashboard/campaigns/${params.campaignId}`);
  revalidatePath("/dashboard/collaborations");
  revalidatePath("/dashboard");

  return {
    success: true,
    orderId: order.id,
    commissionAmount,
    attributed,
  };
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient() as any;

  const { data: order } = await admin
    .from("orders")
    .select("*, campaigns!inner(return_window_days), brands!inner(profile_id)")
    .eq("id", orderId)
    .single();

  if (!order || order.brands.profile_id !== user.id) {
    return { success: false, error: "Order not found or unauthorized." };
  }

  const updatePayload: Partial<Database["public"]["Tables"]["orders"]["Update"]> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === "delivered" && !order.delivered_at) {
    updatePayload.delivered_at = new Date().toISOString();
  }

  if (newStatus === "return_cleared") {
    updatePayload.return_cleared_at = new Date().toISOString();
  }

  const { error: orderUpdateErr } = await admin
    .from("orders")
    .update(updatePayload as never)
    .eq("id", orderId);

  if (orderUpdateErr) {
    return { success: false, error: orderUpdateErr.message };
  }

  // Update associated reward status accordingly
  if (order.creator_id) {
    if (newStatus === "return_cleared") {
      await admin
        .from("rewards")
        .update({
          status: "eligible" as RewardStatus,
          eligible_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as never)
        .eq("order_id", orderId);
    } else if (newStatus === "refunded") {
      await admin
        .from("rewards")
        .update({
          status: "forfeited" as RewardStatus,
          updated_at: new Date().toISOString(),
        } as never)
        .eq("order_id", orderId);
    }
  }

  revalidatePath("/dashboard/collaborations");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getBrandOrdersAction(campaignId?: string): Promise<{
  success: boolean;
  orders?: any[];
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

  let query = admin
    .from("orders")
    .select(
      `
    *,
    campaigns!inner(title, slug, return_window_days),
    creators(handle, display_name),
    brands!inner(profile_id)
  `
    )
    .eq("brands.profile_id", user.id);

  if (campaignId) {
    query = query.eq("campaign_id", campaignId);
  }

  const { data: orders, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, orders: orders || [] };
}
