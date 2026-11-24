"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateEmail, validatePassword, sanitizeRole, sanitizeRedirect } from "./validation";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole, Database } from "@/lib/types/database";

export interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
  redirectUrl?: string;
}

export async function signUpAction(formData: FormData): Promise<AuthResponse> {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const fullName = (formData.get("fullName") as string) || "";
  const rawRole = (formData.get("role") as string) || "creator";

  // Validate inputs
  const emailVal = validateEmail(email);
  if (!emailVal.valid) {
    return { success: false, error: emailVal.error };
  }

  const passVal = validatePassword(password);
  if (!passVal.valid) {
    return { success: false, error: passVal.error };
  }

  const role: "brand" | "creator" = sanitizeRole(rawRole);
  const trimmedName = fullName.trim() || (role === "brand" ? "Brand Partner" : "Creator");

  const headerList = await headers();
  const origin =
    headerList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: trimmedName,
        role: role,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Ensure user profile in public.profiles table exists (fallback if DB trigger has delay)
  if (data.user) {
    try {
      const admin = createAdminClient();
      const profileData: Database["public"]["Tables"]["profiles"]["Insert"] = {
        id: data.user.id,
        email: email.trim(),
        role: role,
        full_name: trimmedName,
        is_verified: false,
      };

      await admin.from("profiles").upsert(profileData as never, { onConflict: "id" });

      // If user registered as brand or creator, initialize corresponding relation
      if (role === "brand") {
        const brandData: Database["public"]["Tables"]["brands"]["Insert"] = {
          profile_id: data.user.id,
          company_name: trimmedName,
          industry: "General Commerce",
        };
        await admin.from("brands").upsert(brandData as never, { onConflict: "profile_id" });
      } else {
        const baseHandle = (data.user.email?.split("@")[0] || "creator")
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "");
        const uniqueHandle = `${baseHandle}_${Math.random().toString(36).substring(2, 6)}`;
        const creatorData: Database["public"]["Tables"]["creators"]["Insert"] = {
          profile_id: data.user.id,
          handle: uniqueHandle,
          primary_niche: "Lifestyle",
          primary_platform: "Instagram",
        };
        await admin.from("creators").upsert(creatorData as never, { onConflict: "profile_id" });
      }
    } catch {
      // Non-fatal if DB trigger handles it
    }
  }

  // Check if session was returned or email verification is required
  if (data.session) {
    return { success: true, redirectUrl: "/dashboard" };
  }

  return {
    success: true,
    redirectUrl: `/verify-email?email=${encodeURIComponent(email.trim())}`,
  };
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const redirectParam = formData.get("redirect") as string | null;

  const emailVal = validateEmail(email);
  if (!emailVal.valid) {
    return { success: false, error: emailVal.error };
  }

  if (!password) {
    return { success: false, error: "Password is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const target = sanitizeRedirect(redirectParam);
  return { success: true, redirectUrl: target };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(formData: FormData): Promise<AuthResponse> {
  const email = (formData.get("email") as string) || "";

  const emailVal = validateEmail(email);
  if (!emailVal.valid) {
    return { success: false, error: emailVal.error };
  }

  const headerList = await headers();
  const origin =
    headerList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message:
      "If an account with that email exists, we have sent instructions to reset your password.",
  };
}

export async function resetPasswordAction(formData: FormData): Promise<AuthResponse> {
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";

  const passVal = validatePassword(password);
  if (!passVal.valid) {
    return { success: false, error: passVal.error };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Your password has been successfully reset. You may now log in.",
    redirectUrl: "/dashboard",
  };
}

export async function getAuthenticatedUser(): Promise<{
  user: { id: string; email: string } | null;
  profile: {
    role: UserRole;
    full_name: string | null;
    is_verified: boolean;
    onboarding_completed: boolean;
  } | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { user: null, profile: null };
  }

  // Retrieve validated role and status from database, not client token
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, is_verified, onboarding_completed")
    .eq("id", user.id)
    .single();

  const typedProfile = profile as {
    role: UserRole;
    full_name: string | null;
    is_verified: boolean;
    onboarding_completed: boolean;
  } | null;

  return {
    user: { id: user.id, email: user.email },
    profile: typedProfile || {
      role: (user.user_metadata?.role as UserRole) || "creator",
      full_name: user.user_metadata?.full_name || null,
      is_verified: false,
      onboarding_completed: false,
    },
  };
}
