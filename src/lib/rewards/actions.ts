"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CreatorEarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  eligibleEarnings: number;
  paidEarnings: number;
  rewards: any[];
}

/**
 * Fetch creator's rewards ledger and financial breakdown.
 */
export async function getCreatorRewardsAction(): Promise<{
  success: boolean;
  data?: CreatorEarningsSummary;
  error?: string;
}> {
  try {
    const { user, profile } = await getAuthenticatedUser();
    if (!user || !profile) {
      return { success: false, error: "Unauthorized" };
    }

    const admin = createAdminClient() as any;

    // Get creator record
    const { data: creator } = await admin
      .from("creators")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!creator) {
      return { success: false, error: "Creator profile not found" };
    }

    // Get rewards for this creator
    const { data: rewards, error } = await admin
      .from("rewards")
      .select("*, campaigns(title), orders(order_number, total_amount, currency)")
      .eq("creator_id", creator.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const now = new Date();
    let totalEarnings = 0;
    let pendingEarnings = 0;
    let eligibleEarnings = 0;
    let paidEarnings = 0;

    const list = rewards || [];
    for (const r of list) {
      const amt = Number(r.amount) || 0;
      // Auto-check if pending reward has passed eligible_at maturity date
      if (r.status === "pending" && r.eligible_at && new Date(r.eligible_at) <= now) {
        r.status = "eligible";
        // Asynchronously update to eligible
        await admin
          .from("rewards")
          .update({ status: "eligible", updated_at: now.toISOString() })
          .eq("id", r.id);
      }

      if (r.status === "paid") {
        paidEarnings += amt;
        totalEarnings += amt;
      } else if (r.status === "eligible") {
        eligibleEarnings += amt;
        totalEarnings += amt;
      } else if (r.status === "pending") {
        pendingEarnings += amt;
      }
    }

    return {
      success: true,
      data: {
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        pendingEarnings: Math.round(pendingEarnings * 100) / 100,
        eligibleEarnings: Math.round(eligibleEarnings * 100) / 100,
        paidEarnings: Math.round(paidEarnings * 100) / 100,
        rewards: list,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch rewards" };
  }
}

/**
 * Fetch rewards ledger for a brand's campaign.
 */
export async function getCampaignRewardsAction(campaignId: string) {
  try {
    const { user, profile } = await getAuthenticatedUser();
    if (!user || !profile) {
      return { success: false, error: "Unauthorized" };
    }

    const admin = createAdminClient() as any;

    // Verify brand ownership
    const { data: campaign } = await admin
      .from("campaigns")
      .select("id, brand_id, brands(profile_id)")
      .eq("id", campaignId)
      .single();

    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }

    const brandOwnerId = (campaign.brands as any)?.profile_id;
    if (brandOwnerId !== user.id && profile.role !== "admin") {
      return { success: false, error: "Forbidden: Not campaign owner" };
    }

    const { data: rewards, error } = await admin
      .from("rewards")
      .select("*, creators(display_name, handle), orders(order_number, total_amount)")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: rewards || [] };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch campaign rewards" };
  }
}

/**
 * Mark an eligible reward as paid.
 */
export async function markRewardPaidAction(rewardId: string) {
  try {
    const { user, profile } = await getAuthenticatedUser();
    if (!user || !profile) {
      return { success: false, error: "Unauthorized" };
    }

    const admin = createAdminClient() as any;

    const { data: reward } = await admin
      .from("rewards")
      .select("*, brands(profile_id)")
      .eq("id", rewardId)
      .single();

    if (!reward) {
      return { success: false, error: "Reward not found" };
    }

    const brandOwnerId = (reward.brands as any)?.profile_id;
    if (brandOwnerId !== user.id && profile.role !== "admin") {
      return { success: false, error: "Forbidden: Only campaign brand owner can disburse rewards" };
    }

    if (reward.status !== "eligible") {
      return { success: false, error: `Reward cannot be paid from status '${reward.status}'` };
    }

    const now = new Date().toISOString();

    const { error: updateError } = await admin
      .from("rewards")
      .update({
        status: "paid",
        paid_at: now,
        updated_at: now,
      })
      .eq("id", rewardId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Record transaction
    const { data: creator } = await admin
      .from("creators")
      .select("profile_id")
      .eq("id", reward.creator_id)
      .single();

    if (creator?.profile_id) {
      await admin.from("transactions").insert({
        user_id: creator.profile_id,
        amount: reward.amount,
        type: "payout",
        reference_id: reward.id,
        status: "completed",
        created_at: now,
      });

      // Notify creator
      await admin.from("notifications").insert({
        user_id: creator.profile_id,
        type: "payout_received",
        title: "Commission Paid!",
        message: `Your reward of $${reward.amount.toFixed(2)} has been disbursed.`,
        action_url: "/dashboard/collaborations",
        is_read: false,
        metadata: { reward_id: reward.id, amount: reward.amount },
        created_at: now,
      });
    }

    revalidatePath("/dashboard/collaborations");
    revalidatePath(`/dashboard/campaigns/${reward.campaign_id}`);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to mark reward paid" };
  }
}
