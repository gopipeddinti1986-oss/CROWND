/**
 * Campaign Validation and Lifecycle Transition Engine
 */

import type {
  CampaignStatus,
  CompensationModel,
  CampaignObjective,
  CampaignType,
} from "@/lib/types/database";

export interface CampaignValidationResult {
  valid: boolean;
  error?: string;
  field?: string;
}

export const CAMPAIGN_OBJECTIVES: { value: CampaignObjective; label: string }[] = [
  { value: "sales", label: "Direct Sales & Conversions" },
  { value: "awareness", label: "Brand Awareness" },
  { value: "traffic", label: "Traffic Generation" },
  { value: "promotion", label: "New Product Launch" },
  { value: "leads", label: "Qualified Lead Generation" },
  { value: "community", label: "Community & UGC Growth" },
];

export const CAMPAIGN_TYPES: { value: CampaignType; label: string }[] = [
  { value: "performance", label: "Performance-Based (Pay on cleared delivery)" },
  { value: "affiliate", label: "Standard Affiliate" },
  { value: "sponsored", label: "Sponsored Content" },
  { value: "gifting", label: "Product Gifting" },
  { value: "paid_collab", label: "Fixed Fee + Commission Hybrid" },
];

export const COMPENSATION_MODELS: { value: CompensationModel; label: string }[] = [
  { value: "commission", label: "Commission Percentage" },
  { value: "fixed", label: "Fixed Payment per Deliverable" },
  { value: "hybrid", label: "Fixed Fee + Commission" },
  { value: "gifting", label: "Product Gifting" },
];

export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return `${base}-${Math.random().toString(36).substring(2, 7)}`;
}

export function validateCampaignTitle(title: string): CampaignValidationResult {
  const trimmed = (title || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Campaign title is required.", field: "title" };
  }
  if (trimmed.length < 5) {
    return { valid: false, error: "Campaign title must be at least 5 characters.", field: "title" };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Campaign title cannot exceed 100 characters.", field: "title" };
  }
  return { valid: true };
}

export function validateCampaignDescription(description: string): CampaignValidationResult {
  const trimmed = (description || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Campaign description is required.", field: "description" };
  }
  if (trimmed.length < 20) {
    return {
      valid: false,
      error: "Campaign description must be at least 20 characters.",
      field: "description",
    };
  }
  if (trimmed.length > 3000) {
    return {
      valid: false,
      error: "Campaign description cannot exceed 3,000 characters.",
      field: "description",
    };
  }
  return { valid: true };
}

export function validateCampaignBudget(budget: number | string): CampaignValidationResult {
  const num = typeof budget === "string" ? parseFloat(budget) : budget;
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: "Campaign budget must be a positive amount.", field: "budget" };
  }
  if (num > 1000000) {
    return { valid: false, error: "Campaign budget cannot exceed $1,000,000.", field: "budget" };
  }
  return { valid: true };
}

export function validateCommissionRate(
  rate: number | string,
  type: "percentage" | "fixed" = "percentage"
): CampaignValidationResult {
  const num = typeof rate === "string" ? parseFloat(rate) : rate;
  if (isNaN(num) || num <= 0) {
    return {
      valid: false,
      error: "Commission must be a positive number.",
      field: "commission_rate",
    };
  }
  if (type === "percentage" && (num < 1 || num > 100)) {
    return {
      valid: false,
      error: "Percentage commission must be between 1% and 100%.",
      field: "commission_rate",
    };
  }
  if (type === "fixed" && num > 10000) {
    return {
      valid: false,
      error: "Fixed commission cannot exceed $10,000 per order.",
      field: "commission_rate",
    };
  }
  return { valid: true };
}

export function validateReturnWindow(days: number | string): CampaignValidationResult {
  const num = typeof days === "string" ? parseInt(days, 10) : days;
  if (isNaN(num) || num < 14) {
    return {
      valid: false,
      error: "Return clearance window must be at least 14 days.",
      field: "return_window_days",
    };
  }
  if (num > 90) {
    return {
      valid: false,
      error: "Return clearance window cannot exceed 90 days.",
      field: "return_window_days",
    };
  }
  return { valid: true };
}

export function validateCampaignDates(dates: {
  starts_at?: string | null;
  ends_at?: string | null;
  application_deadline?: string | null;
  content_deadline?: string | null;
}): CampaignValidationResult {
  let start: Date | null = null;
  let end: Date | null = null;
  let appDeadline: Date | null = null;
  let contentDeadline: Date | null = null;

  if (dates.starts_at) start = new Date(dates.starts_at);
  if (dates.ends_at) end = new Date(dates.ends_at);
  if (dates.application_deadline) appDeadline = new Date(dates.application_deadline);
  if (dates.content_deadline) contentDeadline = new Date(dates.content_deadline);

  if (start && end && start > end) {
    return {
      valid: false,
      error: "Campaign start date cannot be after end date.",
      field: "ends_at",
    };
  }

  if (appDeadline && end && appDeadline > end) {
    return {
      valid: false,
      error: "Application deadline cannot be after campaign end date.",
      field: "application_deadline",
    };
  }

  if (contentDeadline && end && contentDeadline > end) {
    return {
      valid: false,
      error: "Content submission deadline cannot be after campaign end date.",
      field: "content_deadline",
    };
  }

  if (appDeadline && contentDeadline && appDeadline > contentDeadline) {
    return {
      valid: false,
      error: "Application deadline cannot be after content deadline.",
      field: "content_deadline",
    };
  }

  return { valid: true };
}

export function validateFollowerBounds(min: number, max?: number | null): CampaignValidationResult {
  if (min < 0) {
    return {
      valid: false,
      error: "Minimum follower count cannot be negative.",
      field: "min_followers",
    };
  }
  if (max !== null && max !== undefined && max > 0 && max < min) {
    return {
      valid: false,
      error: "Maximum followers cannot be less than minimum followers.",
      field: "max_followers",
    };
  }
  return { valid: true };
}

/**
 * Validates allowed status transitions in the campaign lifecycle.
 */
export function validateCampaignStatusTransition(
  currentStatus: CampaignStatus,
  targetStatus: CampaignStatus
): { allowed: boolean; reason?: string } {
  if (currentStatus === targetStatus) {
    return { allowed: true };
  }

  const allowedTransitions: Record<CampaignStatus, CampaignStatus[]> = {
    draft: ["active", "archived", "cancelled"],
    active: ["paused", "completed", "cancelled"],
    paused: ["active", "completed", "cancelled"],
    completed: ["archived"],
    cancelled: ["archived"],
    archived: [], // Terminal state
  };

  const allowed = allowedTransitions[currentStatus]?.includes(targetStatus) || false;

  if (!allowed) {
    return {
      allowed: false,
      reason: `Cannot transition campaign from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  return { allowed: true };
}
