"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/types/database";
import {
  validateCompanyName,
  validateWebsite,
  validateDescription,
  validateDisplayName,
  validateCreatorHandle,
  validateCategories,
  validateAudienceSize,
  validateUploadedFile,
} from "./validation";

export interface OnboardingStateResponse {
  success: boolean;
  error?: string;
  role?: "brand" | "creator" | "admin";
  onboardingCompleted?: boolean;
  currentStep?: number;
  profile?: Database["public"]["Tables"]["profiles"]["Row"] | null;
  brand?: Database["public"]["Tables"]["brands"]["Row"] | null;
  creator?: Database["public"]["Tables"]["creators"]["Row"] | null;
}

export async function getOnboardingDataAction(): Promise<OnboardingStateResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  // Fetch base profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as Database["public"]["Tables"]["profiles"]["Row"] | null;
  const role = (profile?.role || user.user_metadata?.role || "creator") as
    "brand" | "creator" | "admin";

  if (role === "brand") {
    const { data: brandData } = await supabase
      .from("brands")
      .select("*")
      .eq("profile_id", user.id)
      .single();

    const brand = brandData as Database["public"]["Tables"]["brands"]["Row"] | null;

    return {
      success: true,
      role,
      onboardingCompleted: brand?.onboarding_completed || profile?.onboarding_completed || false,
      currentStep: brand?.onboarding_step || 1,
      profile,
      brand,
    };
  } else {
    const { data: creatorData } = await supabase
      .from("creators")
      .select("*")
      .eq("profile_id", user.id)
      .single();

    const creator = creatorData as Database["public"]["Tables"]["creators"]["Row"] | null;

    return {
      success: true,
      role,
      onboardingCompleted: creator?.onboarding_completed || profile?.onboarding_completed || false,
      currentStep: creator?.onboarding_step || 1,
      profile,
      creator,
    };
  }
}

export async function saveBrandStepAction(
  step: number,
  data: Partial<Database["public"]["Tables"]["brands"]["Update"]>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  // Validate step specific fields
  if (step === 1) {
    if (data.company_name !== undefined) {
      const v = validateCompanyName(data.company_name);
      if (!v.valid) return { success: false, error: v.error };
    }
    if (data.website !== undefined) {
      const v = validateWebsite(data.website);
      if (!v.valid) return { success: false, error: v.error };
    }
  } else if (step === 2) {
    if (data.description !== undefined) {
      const v = validateDescription(data.description);
      if (!v.valid) return { success: false, error: v.error };
    }
  }

  const admin = createAdminClient();
  const updatePayload = {
    ...data,
    onboarding_step: Math.max(step, data.onboarding_step || step),
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from("brands")
    .update(updatePayload as never)
    .eq("profile_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function saveCreatorStepAction(
  step: number,
  data: Partial<Database["public"]["Tables"]["creators"]["Update"]>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  // Validate step specific fields
  if (step === 1) {
    if (data.display_name !== undefined) {
      const v = validateDisplayName(data.display_name || "");
      if (!v.valid) return { success: false, error: v.error };
    }
    if (data.handle !== undefined) {
      const v = validateCreatorHandle(data.handle || "");
      if (!v.valid) return { success: false, error: v.error };
    }
    if (data.bio !== undefined) {
      const v = validateDescription(data.bio || "", 10, 500);
      if (!v.valid) return { success: false, error: v.error };
    }
  } else if (step === 2) {
    if (data.categories !== undefined) {
      const v = validateCategories(data.categories);
      if (!v.valid) return { success: false, error: v.error };
    }
  } else if (step === 3) {
    if (data.audience_size !== undefined) {
      const v = validateAudienceSize(data.audience_size);
      if (!v.valid) return { success: false, error: v.error };
    }
  }

  const admin = createAdminClient();
  const updatePayload = {
    ...data,
    onboarding_step: Math.max(step, data.onboarding_step || step),
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from("creators")
    .update(updatePayload as never)
    .eq("profile_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function completeOnboardingAction(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const admin = createAdminClient();

  // Mark profile completed
  await admin
    .from("profiles")
    .update({ onboarding_completed: true, updated_at: new Date().toISOString() } as never)
    .eq("id", user.id);

  // Mark role table completed
  await admin
    .from("brands")
    .update({ onboarding_completed: true, updated_at: new Date().toISOString() } as never)
    .eq("profile_id", user.id);

  await admin
    .from("creators")
    .update({ onboarding_completed: true, updated_at: new Date().toISOString() } as never)
    .eq("profile_id", user.id);

  return { success: true };
}

export async function uploadAssetAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const file = formData.get("file") as File | null;
  const bucket = (formData.get("bucket") as string) || "avatars";

  if (!file) {
    return { success: false, error: "No file provided." };
  }

  const context = bucket === "brand-assets" ? "logo" : "avatar";
  const validation = validateUploadedFile(
    { size: file.size, type: file.type, name: file.name },
    context
  );

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "png";
  const sanitizedExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${sanitizedExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await admin.storage.from(bucket).upload(filePath, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = admin.storage.from(bucket).getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}
