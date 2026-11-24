import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { getOnboardingDataAction } from "@/lib/onboarding/actions";
import { BrandProfileForm } from "@/components/profile/brand-profile-form";
import { CreatorProfileForm } from "@/components/profile/creator-profile-form";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
  const { user } = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/profile");
  }

  const onboardingData = await getOnboardingDataAction();

  if (!onboardingData.success) {
    redirect("/login");
  }

  const isBrand = onboardingData.role === "brand";

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Dashboard
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">Account &amp; Profile</span>
      </div>

      {/* Page Title */}
      <div className="border-b border-border pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {isBrand ? "Brand Profile & Store Settings" : "Creator Identity & Profile"}
        </h1>
        <p className="mt-1 text-xs text-muted">
          {isBrand
            ? "Manage your company profile, website, and partnership preferences visible to creators."
            : "Keep your creator niche, media links, and audience metrics up to date for premium brand invites."}
        </p>
      </div>

      {/* Form Area */}
      {isBrand && onboardingData.brand ? (
        <BrandProfileForm initialBrand={onboardingData.brand} />
      ) : !isBrand && onboardingData.creator ? (
        <CreatorProfileForm initialCreator={onboardingData.creator} />
      ) : (
        <div className="rounded border border-border bg-surface p-6 text-center text-xs text-muted">
          Profile data not initialized. Please visit{" "}
          <Link href="/onboarding" className="font-semibold text-accent underline">
            Onboarding
          </Link>{" "}
          to complete setup.
        </div>
      )}
    </div>
  );
}
