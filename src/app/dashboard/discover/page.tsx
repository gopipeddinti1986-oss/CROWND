import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { CampaignApplicationModal } from "@/components/campaigns/campaign-application-modal";
import { Compass, ArrowRight, ShieldCheck, Calendar, Sparkles } from "lucide-react";

export default async function CreatorDiscoverPage() {
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect("/login?redirect=/dashboard/discover");
  }

  const admin = createAdminClient() as any;

  // Fetch creator record to check applied campaigns
  const { data: creator } = await admin
    .from("creators")
    .select("id, audience_size")
    .eq("profile_id", user.id)
    .maybeSingle();

  // Fetch active campaigns
  const { data: campaigns = [] } = await admin
    .from("campaigns")
    .select(
      `
      *,
      brands!inner(id, company_name, logo_url, location),
      campaign_applications(id, creator_id, status)
    `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-accent" />
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Campaign Discovery
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted">
          Explore curated performance campaigns from verified brands. Earn guaranteed commissions on
          return-cleared orders.
        </p>
      </div>

      {/* Campaigns Listing */}
      {campaigns.length === 0 ? (
        <div className="rounded border border-dashed border-border bg-surface p-12 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-muted" />
          <h3 className="mt-3 font-serif text-base font-bold text-foreground">
            No active campaigns at the moment
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
            Check back soon! Premium brands regularly publish seasonal and performance campaigns for
            vetted creators.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((camp: any) => {
            const myApp = creator
              ? (camp.campaign_applications || []).find((a: any) => a.creator_id === creator.id)
              : null;

            const isEligible =
              !creator ||
              (creator.audience_size >= (camp.min_followers || 0) &&
                (!camp.max_followers || creator.audience_size <= camp.max_followers));

            const commissionDisplay =
              camp.commission_type === "percentage"
                ? `${camp.commission_rate}% commission`
                : `$${camp.commission_rate} fixed per order`;

            return (
              <div
                key={camp.id}
                className="hover:border-accent/40 flex flex-col justify-between rounded border border-border bg-surface p-5 shadow-hairline transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs font-semibold text-muted">
                      {camp.brands?.company_name}
                    </span>
                    <Badge variant="accent" size="sm">
                      {camp.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold leading-snug text-foreground">
                      {camp.title}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted">
                      {camp.description}
                    </p>
                  </div>

                  <div className="border-border/50 space-y-1.5 border-t pt-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Commission:</span>
                      <strong className="font-semibold text-accent">{commissionDisplay}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted">Return Window:</span>
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        <ShieldCheck className="h-3 w-3 text-accent" />
                        {camp.return_window_days} Days post-delivery
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted">Min Reach:</span>
                      <span className="font-medium text-foreground">
                        {camp.min_followers?.toLocaleString()} followers
                      </span>
                    </div>

                    {camp.application_deadline && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Cutoff:</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                          <Calendar className="h-3 w-3" />
                          {new Date(camp.application_deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <Link
                    href={`/campaigns/${camp.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground"
                  >
                    Details <ArrowRight className="h-3 w-3" />
                  </Link>

                  {myApp ? (
                    <Badge variant={myApp.status === "approved" ? "success" : "neutral"} size="sm">
                      {myApp.status.toUpperCase()}
                    </Badge>
                  ) : !isEligible ? (
                    <span className="text-[11px] italic text-muted">
                      Audience reach not matched
                    </span>
                  ) : (
                    <CampaignApplicationModal
                      campaignId={camp.id}
                      campaignTitle={camp.title}
                      brandName={camp.brands?.company_name}
                      commission={commissionDisplay}
                      returnWindowDays={camp.return_window_days}
                    />
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
