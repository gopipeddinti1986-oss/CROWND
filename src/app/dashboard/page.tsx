import React from "react";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    return null;
  }

  const isBrand = profile.role === "brand";

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="accent">Stage A Account Initialized</Badge>
          {profile.is_verified ? (
            <Badge variant="success">Verified Account</Badge>
          ) : (
            <Badge variant="warning">Verification Pending</Badge>
          )}
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back, {profile.full_name || user.email.split("@")[0]}
        </h1>
        <p className="text-xs text-muted">
          Logged in as <strong className="text-foreground">{user.email}</strong> • Role:{" "}
          <strong className="capitalize text-foreground">{profile.role}</strong>
        </p>
      </div>

      {/* Role-Specific Metrics / Overview */}
      {isBrand ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Active Campaigns
            </span>
            <div className="font-serif text-2xl font-bold text-foreground">0</div>
            <p className="text-[11px] text-muted">Campaign creation engine unlocks in Stage B</p>
          </div>

          <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Attributed Orders
            </span>
            <div className="font-serif text-2xl font-bold text-foreground">0</div>
            <p className="text-[11px] text-muted">Verified post-delivery tracking</p>
          </div>

          <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Return Clearance Window
            </span>
            <div className="font-serif text-2xl font-bold text-foreground">14 Days</div>
            <p className="text-[11px] text-muted">Guaranteed return protection</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Active Referral Links
            </span>
            <div className="font-serif text-2xl font-bold text-foreground">0</div>
            <p className="text-[11px] text-muted">Link generation unlocks in Stage B</p>
          </div>

          <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Pending Commissions
            </span>
            <div className="font-serif text-2xl font-bold text-foreground">$0.00</div>
            <p className="text-[11px] text-muted">Awaiting delivery &amp; return window</p>
          </div>

          <div className="space-y-1 rounded border border-border bg-surface p-4 shadow-hairline">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Eligible Rewards
            </span>
            <div className="font-serif text-2xl font-bold text-foreground">$0.00</div>
            <p className="text-[11px] text-muted">Available for verified payout</p>
          </div>
        </div>
      )}

      {/* Primary Work Area */}
      <div className="space-y-4 rounded border border-border bg-surface p-6 shadow-hairline">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              {isBrand ? "Brand Campaign Center" : "Creator Opportunities"}
            </h2>
            <p className="text-xs text-muted">
              {isBrand
                ? "Browse verified micro-creators and prepare performance-based product offerings."
                : "Explore verified campaigns and review performance-based reward structures."}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={isBrand ? "/creators" : "/campaigns"}>
              <Button variant="primary" size="sm">
                {isBrand ? "Explore Creators" : "Explore Campaigns"}
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Informational Guidance Notice */}
        <div className="space-y-2 rounded border border-border-subtle bg-surface-subtle p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
            Stage A Platform Architecture Active
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Your account credentials, server session, and database profile have been successfully
            initialized with Row Level Security. Campaign creation, link tracking, checkout
            attribution, and payout disbursements will activate in Stage B.
          </p>
        </div>
      </div>
    </div>
  );
}
