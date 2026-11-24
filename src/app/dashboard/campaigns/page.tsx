import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { getBrandCampaignsAction } from "@/lib/campaigns/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Sparkles, BarChart3, Users, Eye, AlertCircle } from "lucide-react";

export default async function BrandCampaignsPage() {
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect("/login?redirect=/dashboard/campaigns");
  }

  if (profile.role !== "brand") {
    redirect("/dashboard");
  }

  const { campaigns = [], error } = await getBrandCampaignsAction();

  const totalBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const totalApps = campaigns.reduce((acc, c) => acc + (c.applications_count || 0), 0);
  const totalCreators = campaigns.reduce((acc, c) => acc + (c.active_creators || 0), 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Campaign Center
          </h1>
          <p className="mt-1 text-xs text-muted">
            Create, monitor, and manage your creator-commerce performance campaigns.
          </p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Total Campaigns
          </span>
          <div className="font-serif text-2xl font-bold text-foreground">{campaigns.length}</div>
          <span className="text-[11px] text-muted">{activeCount} currently active</span>
        </div>

        <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Campaign Budget
          </span>
          <div className="font-serif text-2xl font-bold text-foreground">
            ${totalBudget.toLocaleString()}
          </div>
          <span className="text-[11px] text-muted">Across all campaigns</span>
        </div>

        <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Total Applicants
          </span>
          <div className="font-serif text-2xl font-bold text-foreground">{totalApps}</div>
          <span className="text-[11px] text-muted">Creator submissions</span>
        </div>

        <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Active Creators
          </span>
          <div className="font-serif text-2xl font-bold text-foreground">{totalCreators}</div>
          <span className="text-[11px] text-muted">Approved collaborations</span>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-foreground">Your Campaigns</h2>

        {campaigns.length === 0 ? (
          <div className="rounded border border-dashed border-border bg-surface p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-muted" />
            <h3 className="mt-3 font-serif text-base font-bold text-foreground">
              No campaigns created yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
              Launch your first performance campaign to connect with authentic micro-creators and
              pay only for verified sales.
            </p>
            <div className="mt-5">
              <Link href="/dashboard/campaigns/new">
                <Button variant="primary" size="sm">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Launch Your First Campaign
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded border border-border bg-surface shadow-hairline">
            {campaigns.map((camp) => {
              const statusVariant =
                camp.status === "active"
                  ? "success"
                  : camp.status === "paused"
                    ? "warning"
                    : camp.status === "completed"
                      ? "accent"
                      : "neutral";

              return (
                <div
                  key={camp.id}
                  className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/30 sm:flex-row sm:items-center"
                >
                  <div className="max-w-lg space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant} size="sm">
                        {camp.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted">• {camp.category}</span>
                      <span className="text-xs text-muted">
                        • Return: {camp.return_window_days}d
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/campaigns/${camp.id}`}
                      className="font-serif text-base font-bold text-foreground transition-colors hover:text-accent"
                    >
                      {camp.title}
                    </Link>
                    <p className="line-clamp-1 text-xs text-muted">{camp.description}</p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-muted">
                      <span>
                        Commission:{" "}
                        <strong className="text-foreground">
                          {camp.commission_rate}
                          {camp.commission_type === "percentage" ? "%" : "$"}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Budget:{" "}
                        <strong className="text-foreground">
                          ${camp.budget?.toLocaleString()}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {camp.applications_count} apps
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BarChart3 className="h-3.5 w-3.5" />
                        {camp.active_creators} active
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/campaigns/${camp.id}`}>
                        <Button variant="outline" size="sm" className="gap-1 text-xs">
                          <Eye className="h-3.5 w-3.5" />
                          Manage
                        </Button>
                      </Link>
                      <Link href={`/dashboard/campaigns/${camp.id}/applications`}>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          Applications ({camp.applications_count})
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
