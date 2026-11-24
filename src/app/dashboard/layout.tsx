import React from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedUser, logoutAction } from "@/lib/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getAuthenticatedUser();

  if (!user || !profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-14rem)] bg-background">
      {/* Dashboard Sub-Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
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

          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm" className="text-xs">
              <LogOut className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
