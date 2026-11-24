"use server";

import { getAuthenticatedUser } from "@/lib/auth/actions";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getNotificationsAction() {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const admin = createAdminClient() as any;
    const { data: notifications, error } = await admin
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: notifications || [] };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load notifications" };
  }
}

export async function markNotificationReadAction(notificationId: string) {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const admin = createAdminClient() as any;
    const { error } = await admin
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const admin = createAdminClient() as any;
    const { error } = await admin
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
