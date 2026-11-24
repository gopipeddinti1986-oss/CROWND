import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampaignStatusControl } from "@/components/campaigns/campaign-status-control";
import { RecordConversionModal } from "@/components/campaigns/record-conversion-modal";
import {
  ArrowLeft,
  Users,
  Edit,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({ params }: CampaignPageProps) {
  const { id } = await params;
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect(`/login?redirect=/dashboard/campaigns/${id}`);
  }

  const admin = createAdminClient() as any;

  const { data: campaign } = await admin
    .from("campaigns")
    .select(
      "*, brands!inner(profile_id, company_name), campaign_applications(count), collaborations(count)"
    )
    .eq("id", id)
    .single();

  if (!campaign) {
    notFound();
  }

  // Authorization check: User must be the brand owner or an admin
  if (campaign.brands.profile_id !== user.id && profile.role !== "admin") {
    redirect("/dashboard");
  }

  const appCount = (campaign.campaign_applications as any)?.[0]?.count || 0;
  const activeCollabs = (campaign.collaborations as any)?.[0]?.count || 0;

  const statusVariant =
    campaign.status === "active"
      ? "success"
      : campaign.status === "paused"
        ? "warning"
        : campaign.status === "completed"
          ? "accent"
          : "neutral";

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Campaigns
          </Link>
          <span>/</span>
          <span className="max-w-xs truncate font-semibold text-foreground">{campaign.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <Edit className="h-3 w-3" />
              Edit Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Campaign Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-start">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant} size="sm">
              {campaign.status.toUpperCase()}
            </Badge>
            <Badge variant="neutral" size="sm">
              {campaign.category}
            </Badge>
            <Badge variant="accent" size="sm">
              {campaign.objective.toUpperCase()}
            </Badge>
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {campaign.title}
          </h1>
          <p className="text-xs leading-relaxed text-muted">{campaign.description}</p>
        </div>

        {/* Lifecycle Status Action Control */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Campaign Controls
          </span>
          <CampaignStatusControl campaignId={campaign.id} currentStatus={campaign.status} />
        </div>
      </div>

      {/* KPI Performance Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Total Budget
          </span>
          <div className="font-serif text-2xl font-bold text-foreground">
            ${campaign.budget?.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted">
            Remaining: ${(campaign.remaining_budget ?? campaign.budget).toLocaleString()}
          </p>
        </div>

        <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Commission
          </span>
          <div className="font-serif text-2xl font-bold text-accent">
            {campaign.commission_rate}
            {campaign.commission_type === "percentage" ? "%" : "$"}
          </div>
          <p className="text-[11px] text-muted">Cleared after {campaign.return_window_days} days</p>
        </div>

        <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Creator Applicants
          </span>
          <div className="font-serif text-2xl font-bold text-foreground">{appCount}</div>
          <Link
            href={`/dashboard/campaigns/${campaign.id}/applications`}
            className="inline-flex items-center gap-0.5 text-[11px] text-accent underline"
          >
            Review applications <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>

        <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Active Collaborators
          </span>
          <div className="font-serif text-2xl font-bold text-foreground">{activeCollabs}</div>
          <Link
            href={`/dashboard/collaborations?campaignId=${campaign.id}`}
            className="inline-flex items-center gap-0.5 text-[11px] text-accent underline"
          >
            View workspace <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Deliverables & Channels */}
        <div className="space-y-4 rounded border border-border bg-surface p-6 shadow-hairline">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Layers className="h-4 w-4 text-muted" />
            <h2 className="font-serif text-base font-bold text-foreground">
              Deliverables &amp; Formats
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-muted">Required Content:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {(campaign.required_deliverables || []).map((deliv: string) => (
                  <Badge key={deliv} variant="neutral" size="sm">
                    {deliv}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-muted">Target Channels:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {(campaign.target_platforms || []).map((plat: string) => (
                  <Badge key={plat} variant="accent" size="sm">
                    {plat}
                  </Badge>
                ))}
              </div>
            </div>

            {campaign.deliverable_guidelines && (
              <div className="border-border/50 border-t pt-2">
                <span className="font-semibold text-muted">Brand Guidelines:</span>
                <p className="mt-1 leading-relaxed text-muted">{campaign.deliverable_guidelines}</p>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Requirements */}
        <div className="space-y-4 rounded border border-border bg-surface p-6 shadow-hairline">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Calendar className="h-4 w-4 text-muted" />
            <h2 className="font-serif text-base font-bold text-foreground">
              Timeline &amp; Creator Criteria
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Application Deadline:</span>
              <span className="font-medium text-foreground">
                {campaign.application_deadline
                  ? new Date(campaign.application_deadline).toLocaleDateString()
                  : "Open"}
              </span>
            </div>

            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Content Submission Deadline:</span>
              <span className="font-medium text-foreground">
                {campaign.content_deadline
                  ? new Date(campaign.content_deadline).toLocaleDateString()
                  : "Rolling"}
              </span>
            </div>

            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Audience Reach Range:</span>
              <span className="font-medium text-foreground">
                {campaign.min_followers?.toLocaleString()} min
                {campaign.max_followers
                  ? ` - ${campaign.max_followers.toLocaleString()} max`
                  : "+"}{" "}
                followers
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-muted">Return Clearance Window:</span>
              <span className="inline-flex items-center gap-1 font-medium font-semibold text-accent">
                <ShieldCheck className="h-3.5 w-3.5" />
                {campaign.return_window_days} Days post-delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Quick Actions */}
      <div className="flex flex-col items-center gap-4 border-t border-border pt-4 sm:flex-row">
        <Link
          href={`/dashboard/campaigns/${campaign.id}/applications`}
          className="w-full sm:w-auto"
        >
          <Button variant="primary" size="sm" className="w-full gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Review Creator Applications ({appCount})
          </Button>
        </Link>
        <Link href={`/dashboard/analytics?campaignId=${campaign.id}`} className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
            View Attribution &amp; Conversion Analytics
          </Button>
        </Link>
        <div className="w-full sm:w-auto">
          <RecordConversionModal campaignId={campaign.id} campaignTitle={campaign.title} />
        </div>
      </div>
    </div>
  );
}
