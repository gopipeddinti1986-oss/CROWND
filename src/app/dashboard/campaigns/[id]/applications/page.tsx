import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { BrandApplicationCard } from "@/components/campaigns/brand-application-card";
import { ArrowLeft, Users } from "lucide-react";

interface ApplicationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignApplicationsPage({ params }: ApplicationsPageProps) {
  const { id } = await params;
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect(`/login?redirect=/dashboard/campaigns/${id}/applications`);
  }

  const admin = createAdminClient() as any;

  const { data: campaign } = await admin
    .from("campaigns")
    .select("id, title, status, brands!inner(profile_id, company_name)")
    .eq("id", id)
    .single();

  if (!campaign) {
    notFound();
  }

  if (campaign.brands.profile_id !== user.id && profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: appData } = await admin
    .from("campaign_applications")
    .select(
      `
      *,
      creators!inner(
        id,
        handle,
        display_name,
        profile_photo_url,
        audience_size,
        primary_platform,
        primary_niche,
        verified
      )
    `
    )
    .eq("campaign_id", id)
    .order("applied_at", { ascending: false });

  const applications = appData || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link
          href={`/dashboard/campaigns/${campaign.id}`}
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Campaign
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">Creator Applications</span>
      </div>

      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Creator Applications ({applications.length})
        </h1>
        <p className="mt-1 text-xs text-muted">
          Review pitches, audience metrics, and approve collaborations for &quot;{campaign.title}
          &quot;.
        </p>
      </div>

      {/* Application List */}
      {applications.length === 0 ? (
        <div className="rounded border border-dashed border-border bg-surface p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-muted" />
          <h3 className="mt-3 font-serif text-base font-bold text-foreground">
            No applications yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
            Once creators discover your active campaign on the marketplace, their submissions and
            pitches will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any) => (
            <BrandApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
