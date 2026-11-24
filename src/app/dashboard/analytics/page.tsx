import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { getBrandAnalyticsAction, getCreatorAnalyticsAction } from "@/lib/analytics/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  DollarSign,
  Percent,
  ArrowRight,
  Award,
} from "lucide-react";

interface AnalyticsPageProps {
  searchParams: Promise<{ campaignId?: string }>;
}

export default async function AnalyticsDashboardPage({ searchParams }: AnalyticsPageProps) {
  const { campaignId } = await searchParams;
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect("/login?redirect=/dashboard/analytics");
  }

  const isBrand = profile.role === "brand" || profile.role === "admin";

  let brandData: any = null;
  let creatorData: any = null;

  if (isBrand) {
    const res = await getBrandAnalyticsAction(campaignId);
    if (res.success) brandData = res.data;
  } else {
    const res = await getCreatorAnalyticsAction();
    if (res.success) creatorData = res.data;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Attribution &amp; Analytics
            </h1>
            <Badge variant="accent" size="sm">
              Last-Click 30D
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted">
            {isBrand
              ? "Track referral traffic, real-time conversion attribution, and creator commission ROI."
              : "Monitor your referral link clicks, verified conversions, and commission earnings."}
          </p>
        </div>

        {isBrand && (
          <div className="flex items-center gap-2">
            {campaignId && (
              <Link href="/dashboard/analytics">
                <Button variant="outline" size="sm" className="text-xs">
                  View All Campaigns
                </Button>
              </Link>
            )}
            <Link href="/dashboard/campaigns">
              <Button variant="primary" size="sm" className="gap-1 text-xs">
                Campaigns <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* BRAND VIEW */}
      {isBrand && brandData && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Referral Clicks
                </span>
                <MousePointerClick className="h-4 w-4" />
              </div>
              <div className="font-serif text-2xl font-bold text-foreground">
                {brandData.totalClicks.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted">
                ~{brandData.uniqueClicks.toLocaleString()} unique visitors
              </p>
            </div>

            <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold uppercase tracking-wider">Conversions</span>
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="font-serif text-2xl font-bold text-foreground">
                {brandData.totalConversions.toLocaleString()}
              </div>
              <p className="text-[11px] font-medium text-accent">Attributed Orders</p>
            </div>

            <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Conversion Rate
                </span>
                <Percent className="h-4 w-4" />
              </div>
              <div className="font-serif text-2xl font-bold text-accent">
                {brandData.conversionRate}%
              </div>
              <p className="text-[11px] text-muted">Click-to-order ratio</p>
            </div>

            <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Attributed Revenue
                </span>
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="font-serif text-2xl font-bold text-foreground">
                ${brandData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-muted">
                ${brandData.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                commission ({brandData.roas}x ROAS)
              </p>
            </div>
          </div>

          {/* Top Referrals & Orders Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Creators / Referrals */}
            <div className="space-y-4 rounded border border-border bg-surface p-5 shadow-hairline">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-serif text-base font-bold text-foreground">
                  Top Performing Creator Links
                </h2>
                <span className="text-xs text-muted">By Conversions</span>
              </div>

              {brandData.topReferrals.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted">
                  No referral links generated yet. Once creators join your campaign, their
                  performance will appear here.
                </div>
              ) : (
                <div className="divide-border/50 divide-y text-xs">
                  {brandData.topReferrals.map((ref: any) => (
                    <div key={ref.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium text-foreground">
                          {ref.creators?.display_name || "Creator"}
                        </div>
                        <div className="font-mono text-[11px] text-muted">
                          Code: {ref.code} · {ref.campaigns?.title || "Campaign"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">
                          {ref.total_conversions} orders (${ref.total_revenue?.toFixed(2) || "0.00"}
                          )
                        </div>
                        <div className="text-[11px] text-muted">{ref.total_clicks} clicks</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Attributed Orders */}
            <div className="space-y-4 rounded border border-border bg-surface p-5 shadow-hairline">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-serif text-base font-bold text-foreground">
                  Recent Attributed Orders
                </h2>
                <Badge variant="neutral" size="sm">
                  Verified
                </Badge>
              </div>

              {brandData.recentOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted">
                  No orders recorded yet. You can log manual conversions from the campaign detail
                  page or integrate via API.
                </div>
              ) : (
                <div className="divide-border/50 divide-y text-xs">
                  {brandData.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <span>#{order.order_number}</span>
                          <Badge
                            variant={
                              order.status === "confirmed"
                                ? "success"
                                : order.status === "refunded"
                                  ? "danger"
                                  : "neutral"
                            }
                            size="sm"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-muted">
                          Creator: {order.creators?.display_name || "Direct / Link"} ·{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">
                          ${Number(order.total_amount).toFixed(2)}
                        </div>
                        <div className="text-[11px] text-accent">
                          ${Number(order.commission_amount).toFixed(2)} commission
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATOR VIEW */}
      {!isBrand && creatorData && (
        <div className="space-y-8">
          {/* Creator Metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Referral Clicks
                </span>
                <MousePointerClick className="h-4 w-4" />
              </div>
              <div className="font-serif text-2xl font-bold text-foreground">
                {creatorData.totalClicks.toLocaleString()}
              </div>
              <p className="text-[11px] text-muted">Audience engagement</p>
            </div>

            <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold uppercase tracking-wider">Conversions</span>
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="font-serif text-2xl font-bold text-foreground">
                {creatorData.totalConversions.toLocaleString()}
              </div>
              <p className="text-[11px] font-medium text-accent">Orders Driven</p>
            </div>

            <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Conversion Rate
                </span>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="font-serif text-2xl font-bold text-accent">
                {creatorData.conversionRate}%
              </div>
              <p className="text-[11px] text-muted">Clicks to orders</p>
            </div>

            <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Total Commission
                </span>
                <Award className="h-4 w-4" />
              </div>
              <div className="font-serif text-2xl font-bold text-accent">
                ${creatorData.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-muted">
                Driven $
                {creatorData.totalRevenueGenerated.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}{" "}
                in sales
              </p>
            </div>
          </div>

          {/* Active Referral Links */}
          <div className="space-y-4 rounded border border-border bg-surface p-5 shadow-hairline">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-serif text-base font-bold text-foreground">
                Active Tracking Links
              </h2>
              <Link
                href="/dashboard/collaborations"
                className="inline-flex items-center gap-1 text-xs text-accent underline"
              >
                Collaborations <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {creatorData.activeLinks.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted">
                You do not have any active tracking links yet. Apply to campaigns in Discover to
                receive your tracking links.
              </div>
            ) : (
              <div className="divide-border/50 divide-y text-xs">
                {creatorData.activeLinks.map((link: any) => (
                  <div
                    key={link.id}
                    className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="font-medium text-foreground">
                        {link.campaigns?.title || "Campaign"}
                      </div>
                      <div className="font-mono text-[11px] text-muted">
                        /r/{link.code} · Commission: {link.campaigns?.commission_rate}%
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold text-foreground">{link.total_clicks} Clicks</div>
                        <div className="text-[11px] text-accent">
                          {link.total_conversions} Orders
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent">
                          ${Number(link.total_revenue || 0).toFixed(2)}
                        </div>
                        <div className="text-[11px] text-muted">GMV Driven</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
