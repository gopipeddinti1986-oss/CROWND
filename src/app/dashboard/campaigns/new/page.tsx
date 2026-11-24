import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { CampaignWizard } from "@/components/campaigns/campaign-wizard";
import { ArrowLeft } from "lucide-react";

export default async function NewCampaignPage() {
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect("/login?redirect=/dashboard/campaigns/new");
  }

  if (profile.role !== "brand") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Campaigns
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">Create Campaign</span>
      </div>

      <div className="border-b border-border pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Launch a New Creator Campaign
        </h1>
        <p className="mt-1 text-xs text-muted">
          Define terms, target channels, deliverable guidelines, and return clearance rules.
        </p>
      </div>

      <CampaignWizard mode="create" />
    </div>
  );
}
