import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth/actions";
import { getOnboardingDataAction } from "@/lib/onboarding/actions";
import { BrandOnboarding } from "@/components/onboarding/brand-onboarding";
import { CreatorOnboarding } from "@/components/onboarding/creator-onboarding";

export default async function OnboardingPage() {
  const { user } = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirect=/onboarding");
  }

  const onboardingData = await getOnboardingDataAction();

  if (!onboardingData.success) {
    redirect("/login");
  }

  // If already onboarded, send straight to dashboard
  if (onboardingData.onboardingCompleted) {
    redirect("/dashboard");
  }

  const isBrand = onboardingData.role === "brand";

  return (
    <div className="min-h-screen bg-background">
      {/* Editorial Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-foreground">
            CROWND
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Logged in as</span>
            <span className="font-semibold text-foreground">{user.email}</span>
          </div>
        </div>
      </header>

      {/* Main Flow Container */}
      <main className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="mx-auto mb-6 max-w-xl text-center">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {isBrand ? "Complete Your Brand Onboarding" : "Complete Your Creator Profile"}
          </h1>
          <p className="mt-2 text-xs text-muted">
            {isBrand
              ? "Set up your brand profile, configure your store details, and unlock campaign collaboration."
              : "Tell brands about your aesthetic, audience, and the categories you champion."}
          </p>
        </div>

        {isBrand ? (
          <BrandOnboarding
            initialBrand={onboardingData.brand}
            initialStep={onboardingData.currentStep}
          />
        ) : (
          <CreatorOnboarding
            initialCreator={onboardingData.creator}
            initialStep={onboardingData.currentStep}
          />
        )}
      </main>
    </div>
  );
}
