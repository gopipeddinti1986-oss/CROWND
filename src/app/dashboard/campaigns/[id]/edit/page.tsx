import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { CampaignWizard } from "@/components/campaigns/campaign-wizard";
import { ArrowLeft } from "lucide-react";

interface EditCampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCampaignPage({ params }: EditCampaignPageProps) {
  const { id } = await params;
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect(`/login?redirect=/dashboard/campaigns/${id}/edit`);
  }

  const admin = createAdminClient() as any;

  const { data: campaign } = await admin
    .from("campaigns")
    .select("*, brands!inner(profile_id)")
    .eq("id", id)
    .single();

  if (!campaign) {
    notFound();
  }

  if (campaign.brands.profile_id !== user.id && profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link
          href={`/dashboard/campaigns/${campaign.id}`}
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Campaign
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">Edit Settings</span>
      </div>

      <div className="border-b border-border pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Edit Campaign: {campaign.title}
        </h1>
        <p className="mt-1 text-xs text-muted">
          Update campaign deliverables, commission rates, follower limits, and timeline.
        </p>
      </div>

      <CampaignWizard initialCampaign={campaign} mode="edit" />
    </div>
  );
}
