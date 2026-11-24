/**
 * Validation rules and schemas for Stage B1 Onboarding and Profiles.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const BRAND_INDUSTRIES = [
  "Fashion & Apparel",
  "Beauty & Cosmetics",
  "Health & Wellness",
  "Consumer Electronics",
  "Food & Beverage",
  "Home & Living",
  "SaaS & Digital Products",
  "Jewelry & Accessories",
  "Fitness & Sports",
  "General Retail",
] as const;

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;

export const CREATOR_NICHES = [
  "Lifestyle",
  "Fashion & Style",
  "Beauty & Skincare",
  "Fitness & Wellness",
  "Tech & Gadgets",
  "Food & Cooking",
  "Travel & Adventure",
  "Gaming & Esports",
  "Business & Finance",
  "Parenting & Family",
  "Home & Interior",
  "Art & Design",
] as const;

export const CREATOR_PLATFORMS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Twitter / X",
  "Twitch",
  "Substack / Newsletter",
  "Blog / Website",
] as const;

export const COMMON_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Portuguese",
  "Japanese",
  "Korean",
  "Italian",
  "Arabic",
] as const;

export function validateCompanyName(name: string): ValidationResult {
  const trimmed = (name || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Company name is required." };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Company name must be at least 2 characters." };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Company name cannot exceed 100 characters." };
  }
  return { valid: true };
}

export function validateWebsite(website?: string | null): ValidationResult {
  if (!website || !website.trim()) {
    return { valid: true }; // optional
  }
  const trimmed = website.trim();
  try {
    const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "Website must use HTTP or HTTPS." };
    }
    if (!parsed.hostname.includes(".")) {
      return { valid: false, error: "Website must have a valid domain." };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Please enter a valid website URL." };
  }
}

export function validateDescription(
  description?: string | null,
  min = 20,
  max = 1000
): ValidationResult {
  const trimmed = (description || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Description is required." };
  }
  if (trimmed.length < min) {
    return { valid: false, error: `Description must be at least ${min} characters.` };
  }
  if (trimmed.length > max) {
    return { valid: false, error: `Description cannot exceed ${max} characters.` };
  }
  return { valid: true };
}

export function validateCreatorHandle(handle: string): ValidationResult {
  const trimmed = (handle || "").trim().toLowerCase();
  if (!trimmed) {
    return { valid: false, error: "Creator handle is required." };
  }
  if (trimmed.length < 3) {
    return { valid: false, error: "Handle must be at least 3 characters." };
  }
  if (trimmed.length > 30) {
    return { valid: false, error: "Handle cannot exceed 30 characters." };
  }
  if (!/^[a-z0-9_]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "Handle can only contain lowercase letters, numbers, and underscores.",
    };
  }
  return { valid: true };
}

export function validateDisplayName(name: string): ValidationResult {
  const trimmed = (name || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Display name is required." };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Display name must be at least 2 characters." };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: "Display name cannot exceed 50 characters." };
  }
  return { valid: true };
}

export function validateCategories(categories: string[]): ValidationResult {
  if (!Array.isArray(categories) || categories.length === 0) {
    return { valid: false, error: "Please select at least one category." };
  }
  if (categories.length > 5) {
    return { valid: false, error: "You can select up to 5 categories." };
  }
  return { valid: true };
}

export function validateAudienceSize(size: number | string): ValidationResult {
  const num = typeof size === "string" ? parseInt(size, 10) : size;
  if (isNaN(num) || num < 0) {
    return { valid: false, error: "Audience reach must be a positive number." };
  }
  return { valid: true };
}

// File upload validation (5MB max for avatars, 10MB max for logos)
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export function validateUploadedFile(
  file: { size: number; type: string; name?: string },
  context: "avatar" | "logo" = "avatar"
): ValidationResult {
  const maxBytes = context === "avatar" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  const allowed = context === "avatar" ? ALLOWED_IMAGE_TYPES : ALLOWED_LOGO_TYPES;

  if (file.size <= 0) {
    return { valid: false, error: "File cannot be empty." };
  }

  if (file.size > maxBytes) {
    const mbLimit = context === "avatar" ? 5 : 10;
    return { valid: false, error: `File exceeds maximum allowed size of ${mbLimit}MB.` };
  }

  if (!allowed.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file type. Allowed formats: ${context === "avatar" ? "JPG, PNG, WebP, GIF" : "JPG, PNG, WebP, SVG"}.`,
    };
  }

  return { valid: true };
}
