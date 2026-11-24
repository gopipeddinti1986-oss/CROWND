/**
 * Deterministic Attribution & Financial Commission Calculation Engine.
 * Implements Last-Click attribution within a strictly enforced attribution window.
 * All monetary calculations use decimal-safe minor currency units (cents).
 */

export interface ClickRecord {
  id: string;
  link_id: string;
  campaign_id: string | null;
  creator_id: string | null;
  clicked_at: string;
  is_bot?: boolean;
}

export interface AttributionResolutionResult {
  attributed: boolean;
  model: "last_click";
  clickId: string | null;
  linkId: string | null;
  creatorId: string | null;
  campaignId: string | null;
  clickTime: string | null;
  daysToConversion: number | null;
  reason?: string;
}

/**
 * Resolves attribution using the Last-Click model within a configurable attribution window (default 30 days).
 * Filters out bot traffic and clicks that occurred AFTER the conversion timestamp or BEFORE the attribution window.
 */
export function resolveLastClickAttribution(
  clicks: ClickRecord[],
  conversionTimestamp: string | Date = new Date(),
  attributionWindowDays = 30
): AttributionResolutionResult {
  const conversionDate =
    typeof conversionTimestamp === "string" ? new Date(conversionTimestamp) : conversionTimestamp;

  const windowMilliseconds = attributionWindowDays * 24 * 60 * 60 * 1000;
  const windowStartDate = new Date(conversionDate.getTime() - windowMilliseconds);

  // Filter valid candidate clicks
  const validCandidates = clicks.filter((c) => {
    if (c.is_bot) return false;
    const clickDate = new Date(c.clicked_at);
    // Click must be strictly before or at conversion, and within window
    return clickDate <= conversionDate && clickDate >= windowStartDate;
  });

  if (validCandidates.length === 0) {
    return {
      attributed: false,
      model: "last_click",
      clickId: null,
      linkId: null,
      creatorId: null,
      campaignId: null,
      clickTime: null,
      daysToConversion: null,
      reason: "No non-bot clicks found within the attribution window.",
    };
  }

  // Sort descending by clicked_at to get the most recent (last) click
  validCandidates.sort(
    (a, b) => new Date(b.clicked_at).getTime() - new Date(a.clicked_at).getTime()
  );

  const winningClick = validCandidates[0];
  const clickDate = new Date(winningClick.clicked_at);
  const diffHours = (conversionDate.getTime() - clickDate.getTime()) / (1000 * 60 * 60);
  const daysToConversion = Math.round((diffHours / 24) * 10) / 10;

  return {
    attributed: true,
    model: "last_click",
    clickId: winningClick.id,
    linkId: winningClick.link_id,
    creatorId: winningClick.creator_id,
    campaignId: winningClick.campaign_id,
    clickTime: winningClick.clicked_at,
    daysToConversion,
  };
}

/**
 * Calculates creator commission with decimal safety.
 * Converts dollars to integer cents to avoid JavaScript floating point errors (e.g. 0.1 + 0.2 !== 0.3).
 */
export function calculateDecimalCommission(
  orderAmount: number,
  rate: number,
  type: "percentage" | "fixed" = "percentage"
): number {
  if (orderAmount <= 0 || rate <= 0) return 0;

  if (type === "fixed") {
    return Math.round(rate * 100) / 100;
  }

  // Working in cents:
  const orderCents = Math.round(orderAmount * 100);
  const commissionCents = Math.round((orderCents * rate) / 100);

  return commissionCents / 100;
}
