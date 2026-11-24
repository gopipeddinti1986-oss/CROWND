import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { getCollaborationsAction } from "@/lib/collaborations/actions";
import { CollaborationCard } from "@/components/collaborations/collaboration-card";
import { Button } from "@/components/ui/button";
import { Layers, Compass, Plus, AlertCircle } from "lucide-react";

export default async function CollaborationsPage() {
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect("/login?redirect=/dashboard/collaborations");
  }

  const { collaborations = [], error } = await getCollaborationsAction();
  const isBrand = profile.role === "brand";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Collaborations Workspace
          </h1>
          <p className="mt-1 text-xs text-muted">
            {isBrand
              ? "Monitor active creator deliverables, review submitted content, and track referral sales."
              : "Manage your active campaigns, copy your unique referral links, and submit your content."}
          </p>
        </div>

        <div>
          {isBrand ? (
            <Link href="/dashboard/campaigns/new">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/discover">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <Compass className="h-4 w-4" />
                Discover Campaigns
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Collaborations List */}
      {collaborations.length === 0 ? (
        <div className="rounded border border-dashed border-border bg-surface p-12 text-center">
          <Layers className="mx-auto h-8 w-8 text-muted" />
          <h3 className="mt-3 font-serif text-base font-bold text-foreground">
            No active collaborations yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
            {isBrand
              ? "Once you accept creator applications for your campaigns, active collaboration workspaces will appear here."
              : "Once your applications are accepted by brands, your tracking links and deliverable submissions will appear here."}
          </p>
          <div className="mt-5">
            <Link href={isBrand ? "/dashboard/campaigns" : "/dashboard/discover"}>
              <Button variant="primary" size="sm" className="text-xs">
                {isBrand ? "View Your Campaigns" : "Explore Active Campaigns"}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {collaborations.map((collab) => (
            <CollaborationCard
              key={collab.id}
              collaboration={collab}
              userRole={profile.role as "brand" | "creator"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
