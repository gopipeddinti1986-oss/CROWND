import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { CampaignApplicationModal } from "@/components/campaigns/campaign-application-modal";
import { ArrowLeft, ShieldCheck, Layers, CheckCircle2 } from "lucide-react";

interface PublicCampaignDetailProps {
  params: Promise<{ id: string }>;
}

export default async function PublicCampaignDetailPage({ params }: PublicCampaignDetailProps) {
  const { id } = await params;
  const admin = createAdminClient() as any;

  const { data: campaign } = await admin
    .from("campaigns")
    .select("*, brands!inner(company_name, logo_url, website, location)")
    .eq("id", id)
    .single();

  if (!campaign || (campaign.status !== "active" && campaign.status !== "completed")) {
    notFound();
  }

  const commissionDisplay =
    campaign.commission_type === "percentage"
      ? `${campaign.commission_rate}% of verified sales`
      : `$${campaign.commission_rate} per delivered order`;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-content space-y-8 px-4 sm:px-6">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link href="/campaigns" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-3 w-3" />
            All Campaigns
          </Link>
          <span>/</span>
          <span className="max-w-xs truncate font-semibold text-foreground">{campaign.title}</span>
        </div>

        {/* Hero Banner */}
        <div className="space-y-6 rounded border border-border bg-surface p-6 shadow-hairline sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  {campaign.category}
                </Badge>
                <Badge variant="success" size="sm">
                  ACTIVE OPPORTUNITY
                </Badge>
                <span className="text-xs text-muted">by {campaign.brands?.company_name}</span>
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {campaign.title}
              </h1>
              <p className="text-xs leading-relaxed text-muted sm:text-sm">
                {campaign.description}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2">
              <CampaignApplicationModal
                campaignId={campaign.id}
                campaignTitle={campaign.title}
                brandName={campaign.brands?.company_name}
                commission={commissionDisplay}
                returnWindowDays={campaign.return_window_days}
              />
            </div>
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs sm:grid-cols-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Commission
              </span>
              <div className="mt-0.5 font-serif text-lg font-bold text-accent">
                {commissionDisplay}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Return Window
              </span>
              <div className="mt-0.5 font-serif text-lg font-bold text-foreground">
                {campaign.return_window_days} Days
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Target Channels
              </span>
              <div className="mt-0.5 font-serif text-lg font-bold text-foreground">
                {(campaign.target_platforms || []).join(", ")}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Min Reach
              </span>
              <div className="mt-0.5 font-serif text-lg font-bold text-foreground">
                {campaign.min_followers?.toLocaleString()} followers
              </div>
            </div>
          </div>
        </div>

        {/* Content & Requirements Breakdown */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Deliverables */}
          <div className="space-y-4 rounded border border-border bg-surface p-6 shadow-hairline">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Layers className="h-4 w-4 text-muted" />
              <h2 className="font-serif text-base font-bold text-foreground">
                Content Deliverables
              </h2>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {(campaign.required_deliverables || []).map((deliv: string) => (
                  <Badge key={deliv} variant="neutral" size="sm">
                    {deliv}
                  </Badge>
                ))}
              </div>
              {campaign.deliverable_guidelines && (
                <div className="border-border/50 border-t pt-3">
                  <span className="font-semibold text-muted">Creative Guidelines:</span>
                  <p className="mt-1 leading-relaxed text-muted">
                    {campaign.deliverable_guidelines}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Safety & Performance Protection */}
          <div className="space-y-4 rounded border border-border bg-surface p-6 shadow-hairline">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="h-4 w-4 text-muted" />
              <h2 className="font-serif text-base font-bold text-foreground">
                Performance Assurance
              </h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-muted">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>Post-Delivery Attribution:</strong> Commissions are held in escrow until
                  the customer return window of {campaign.return_window_days} days expires with zero
                  chargebacks.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>Dedicated Tracking Code:</strong> Accepted creators receive a unique,
                  tamper-proof tracking URL with real-time click and conversion attribution.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
