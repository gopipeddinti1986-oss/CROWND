import type { Database } from "@/lib/types/database";

type BrandRow = Database["public"]["Tables"]["brands"]["Row"];
type CreatorRow = Database["public"]["Tables"]["creators"]["Row"];

export interface ProfileCompletion {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
}

export function calculateBrandCompletion(brand?: Partial<BrandRow> | null): ProfileCompletion {
  if (!brand) {
    return {
      percentage: 0,
      completedFields: [],
      missingFields: [
        "Company Name",
        "Website",
        "Industry",
        "Description",
        "Location",
        "Brand Logo",
        "Social Channels",
      ],
    };
  }

  const completed: string[] = [];
  const missing: string[] = [];
  let score = 0;

  if (brand.company_name?.trim()) {
    score += 20;
    completed.push("Company Name");
  } else {
    missing.push("Company Name");
  }

  if (brand.website?.trim()) {
    score += 15;
    completed.push("Website");
  } else {
    missing.push("Website");
  }

  if (brand.industry?.trim() && brand.industry !== "General") {
    score += 15;
    completed.push("Industry");
  } else {
    missing.push("Industry");
  }

  if (brand.description?.trim() && brand.description.length >= 20) {
    score += 20;
    completed.push("Description");
  } else {
    missing.push("Description");
  }

  if (brand.location?.trim() || brand.country?.trim()) {
    score += 10;
    completed.push("Location");
  } else {
    missing.push("Location");
  }

  if (brand.logo_url?.trim()) {
    score += 10;
    completed.push("Brand Logo");
  } else {
    missing.push("Brand Logo");
  }

  if (
    brand.social_links &&
    typeof brand.social_links === "object" &&
    Object.keys(brand.social_links).length > 0
  ) {
    score += 10;
    completed.push("Social Channels");
  } else {
    missing.push("Social Channels");
  }

  return {
    percentage: Math.min(100, score),
    completedFields: completed,
    missingFields: missing,
  };
}

export function calculateCreatorCompletion(
  creator?: Partial<CreatorRow> | null
): ProfileCompletion {
  if (!creator) {
    return {
      percentage: 0,
      completedFields: [],
      missingFields: [
        "Display Name & Handle",
        "Niche & Categories",
        "Creator Bio",
        "Primary Platform",
        "Profile Photo",
        "Location & Languages",
      ],
    };
  }

  const completed: string[] = [];
  const missing: string[] = [];
  let score = 0;

  if (creator.display_name?.trim() && creator.handle?.trim()) {
    score += 20;
    completed.push("Display Name & Handle");
  } else {
    missing.push("Display Name & Handle");
  }

  if (
    creator.primary_niche?.trim() &&
    Array.isArray(creator.categories) &&
    creator.categories.length > 0
  ) {
    score += 20;
    completed.push("Niche & Categories");
  } else {
    missing.push("Niche & Categories");
  }

  if (creator.bio?.trim() && creator.bio.length >= 10) {
    score += 20;
    completed.push("Creator Bio");
  } else {
    missing.push("Creator Bio");
  }

  if (creator.primary_platform?.trim()) {
    score += 15;
    completed.push("Primary Platform");
  } else {
    missing.push("Primary Platform");
  }

  if (creator.profile_photo_url?.trim()) {
    score += 15;
    completed.push("Profile Photo");
  } else {
    missing.push("Profile Photo");
  }

  if (
    creator.location?.trim() ||
    (Array.isArray(creator.languages) && creator.languages.length > 0)
  ) {
    score += 10;
    completed.push("Location & Languages");
  } else {
    missing.push("Location & Languages");
  }

  return {
    percentage: Math.min(100, score),
    completedFields: completed,
    missingFields: missing,
  };
}
