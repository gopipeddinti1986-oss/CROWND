import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { getCreatorApplicationsAction } from "@/lib/applications/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Compass, AlertCircle, ExternalLink } from "lucide-react";

export default async function CreatorApplicationsPage() {
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect("/login?redirect=/dashboard/applications");
  }

  if (profile.role !== "creator") {
    redirect("/dashboard");
  }

  const { applications = [], error } = await getCreatorApplicationsAction();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Applications
          </h1>
          <p className="mt-1 text-xs text-muted">
            Track pitches, brand reviews, and active campaign acceptance.
          </p>
        </div>
        <Link href="/dashboard/discover">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Compass className="h-4 w-4" />
            Discover New Campaigns
          </Button>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="rounded border border-dashed border-border bg-surface p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted" />
          <h3 className="mt-3 font-serif text-base font-bold text-foreground">
            No applications submitted yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
            Browse active performance campaigns from vetted brands and apply to earn commission on
            verified deliveries.
          </p>
          <div className="mt-5">
            <Link href="/dashboard/discover">
              <Button variant="primary" size="sm">
                <Compass className="mr-1 h-3.5 w-3.5" />
                Explore Campaigns
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded border border-border bg-surface shadow-hairline">
          {applications.map((app) => {
            const statusVariant =
              app.status === "approved"
                ? "success"
                : app.status === "rejected"
                  ? "neutral"
                  : app.status === "pending"
                    ? "warning"
                    : "neutral";

            return (
              <div
                key={app.id}
                className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/30 sm:flex-row sm:items-center"
              >
                <div className="max-w-xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant} size="sm">
                      {app.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted">
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted">
                      • {app.campaigns.brands?.company_name}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground">
                    {app.campaigns.title}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                    <strong>Your Pitch:</strong> {app.pitch}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-xs text-muted">
                    <span>
                      Commission:{" "}
                      <strong className="text-foreground">
                        {app.campaigns.commission_rate}
                        {app.campaigns.commission_type === "percentage" ? "%" : "$"}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>Return Window: {app.campaigns.return_window_days} Days</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  {app.status === "approved" ? (
                    <Link href="/dashboard/collaborations">
                      <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                        View Workspace &amp; Link
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/campaigns/${app.campaigns.id}`}>
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        Campaign Details
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
