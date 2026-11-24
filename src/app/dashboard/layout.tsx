import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser, logoutAction } from "@/lib/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { LogOut, UserCircle, LayoutDashboard, User, ArrowRight, BarChart3 } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-14rem)] bg-background">
      {/* Onboarding Notice Banner */}
      {!profile.onboarding_completed && (
        <div className="border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="mx-auto flex max-w-content items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Setup Pending:</span>
              <span>Complete your {profile.role} onboarding to enable public discovery.</span>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1 font-semibold text-accent underline hover:opacity-80"
            >
              Continue Onboarding
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Dashboard Sub-Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <UserCircle className="h-5 w-5 text-muted" aria-hidden="true" />
              <div>
                <span className="text-xs font-semibold text-foreground">
                  {profile.full_name || user.email}
                </span>
                <span className="ml-2">
                  <Badge variant={profile.role === "brand" ? "accent" : "neutral"} size="sm">
                    {profile.role.toUpperCase()}
                  </Badge>
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Dashboard navigation">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-muted" />
                Overview
              </Link>
              {profile.role === "brand" ? (
                <>
                  <Link
                    href="/dashboard/campaigns"
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Campaigns
                  </Link>
                  <Link
                    href="/dashboard/collaborations"
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Collaborations
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-muted" />
                    Analytics
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/discover"
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Discover
                  </Link>
                  <Link
                    href="/dashboard/applications"
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Applications
                  </Link>
                  <Link
                    href="/dashboard/collaborations"
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Collaborations
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-muted" />
                    Analytics
                  </Link>
                </>
              )}
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <User className="h-3.5 w-3.5 text-muted" />
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1 rounded p-1.5 text-muted hover:text-foreground sm:hidden"
              aria-label="Profile"
            >
              <User className="h-4 w-4" />
            </Link>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm" className="text-xs">
                <LogOut className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
