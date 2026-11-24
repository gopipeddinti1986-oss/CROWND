"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetUpload } from "./asset-upload";
import {
  BRAND_INDUSTRIES,
  COMPANY_SIZES,
  validateCompanyName,
  validateWebsite,
  validateDescription,
} from "@/lib/onboarding/validation";
import { saveBrandStepAction, completeOnboardingAction } from "@/lib/onboarding/actions";
import type { Database } from "@/lib/types/database";
import {
  Building2,
  Globe,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

type BrandRow = Database["public"]["Tables"]["brands"]["Row"];

interface BrandOnboardingProps {
  initialBrand?: BrandRow | null;
  initialStep?: number;
}

export function BrandOnboarding({ initialBrand, initialStep = 1 }: BrandOnboardingProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(initialStep || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState(initialBrand?.company_name || "");
  const [website, setWebsite] = useState(initialBrand?.website || "");
  const [industry, setIndustry] = useState(initialBrand?.industry || BRAND_INDUSTRIES[0]);
  const [companySize, setCompanySize] = useState(initialBrand?.company_size || COMPANY_SIZES[0]);

  const [description, setDescription] = useState(initialBrand?.description || "");
  const [location, setLocation] = useState(initialBrand?.location || "");
  const [country, setCountry] = useState(initialBrand?.country || "United States");
  const [logoUrl, setLogoUrl] = useState(initialBrand?.logo_url || "");

  const [instagram, setInstagram] = useState(initialBrand?.social_links?.instagram || "");
  const [twitter, setTwitter] = useState(initialBrand?.social_links?.twitter || "");
  const [linkedin, setLinkedin] = useState(initialBrand?.social_links?.linkedin || "");
  const [businessEmail, setBusinessEmail] = useState(initialBrand?.business_contact?.email || "");

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps = [
    { num: 1, title: "Company Basics", icon: Building2 },
    { num: 2, title: "Brand Identity", icon: FileText },
    { num: 3, title: "Channels & Contact", icon: Globe },
    { num: 4, title: "Review & Launch", icon: CheckCircle2 },
  ];

  const handleNext = async () => {
    setError(null);

    if (step === 1) {
      const vName = validateCompanyName(companyName);
      if (!vName.valid) {
        setError(vName.error || "Invalid company name");
        return;
      }
      const vWeb = validateWebsite(website);
      if (!vWeb.valid) {
        setError(vWeb.error || "Invalid website");
        return;
      }

      setLoading(true);
      const res = await saveBrandStepAction(1, {
        company_name: companyName.trim(),
        website: website.trim() || null,
        industry,
        company_size: companySize,
      });
      setLoading(false);

      if (!res.success) {
        setError(res.error || "Failed to save company information.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const vDesc = validateDescription(description);
      if (!vDesc.valid) {
        setError(vDesc.error || "Invalid description");
        return;
      }

      setLoading(true);
      const res = await saveBrandStepAction(2, {
        description: description.trim(),
        location: location.trim() || null,
        country: country.trim() || null,
        logo_url: logoUrl || null,
      });
      setLoading(false);

      if (!res.success) {
        setError(res.error || "Failed to save brand identity.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setLoading(true);
      const res = await saveBrandStepAction(3, {
        social_links: {
          ...(instagram.trim() ? { instagram: instagram.trim() } : {}),
          ...(twitter.trim() ? { twitter: twitter.trim() } : {}),
          ...(linkedin.trim() ? { linkedin: linkedin.trim() } : {}),
        },
        business_contact: {
          ...(businessEmail.trim() ? { email: businessEmail.trim() } : {}),
        },
      });
      setLoading(false);

      if (!res.success) {
        setError(res.error || "Failed to save channel details.");
        return;
      }
      setStep(4);
    }
  };

  const handleComplete = async () => {
    if (!agreedToTerms) {
      setError("Please agree to the platform partnership standards to proceed.");
      return;
    }

    setLoading(true);
    const res = await completeOnboardingAction();
    setLoading(false);

    if (res.success) {
      router.push("/dashboard?onboarded=true");
    } else {
      setError(res.error || "Failed to finalize onboarding.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      {/* Step Indicator Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Brand Onboarding • Step {step} of 4
          </span>
          <span className="text-xs text-muted">Auto-saving progress</span>
        </div>

        {/* Step dots / tabs */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = s.num === step;
            const isCompleted = s.num < step;
            return (
              <div
                key={s.num}
                className={`flex flex-col gap-1 rounded border p-2.5 transition-colors ${
                  isCurrent
                    ? "bg-accent/5 dark:bg-accent/10 border-accent"
                    : isCompleted
                      ? "border-stone-300 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/50"
                      : "border-border bg-surface opacity-60"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isCurrent
                        ? "text-accent"
                        : isCompleted
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted"
                    }`}
                  />
                  <span className="truncate text-xs font-semibold text-foreground">{s.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Company Basics */}
      {step === 1 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Tell us about your brand
            </h2>
            <p className="mt-1 text-xs text-muted">
              Basic company information for creator discovery and campaign contracts.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Company / Brand Name *
              </label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Studio"
                className="mt-1"
                required
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Website / Online Store
              </label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="industry"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Primary Industry
                </label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {BRAND_INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="companySize"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Company Size
                </label>
                <select
                  id="companySize"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {COMPANY_SIZES.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz} team members
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Identity & Location */}
      {step === 2 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Brand Identity &amp; Story
            </h2>
            <p className="mt-1 text-xs text-muted">
              Give creators a clear sense of what your brand stands for.
            </p>
          </div>

          <div className="space-y-4">
            <AssetUpload
              label="Brand Logo"
              description="Upload your high-resolution brand logo (SVG, PNG, JPG up to 10MB)."
              bucket="brand-assets"
              currentUrl={logoUrl}
              onUploadComplete={(url) => setLogoUrl(url)}
            />

            <div>
              <label
                htmlFor="description"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Brand Description * (Min 20 characters)
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what your brand offers, your design philosophy, and what makes your products unique..."
                className="placeholder:text-muted/60 mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
              <span className="text-[11px] text-muted">{description.length} / 1000 characters</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="location"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  City / Headquarters
                </label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Country
                </label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Channels & Contact */}
      {step === 3 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Social Presence &amp; Contact
            </h2>
            <p className="mt-1 text-xs text-muted">
              Connect your channels so creators can explore your existing social media aesthetic.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="instagram"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Instagram Handle / URL
              </label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourbrand or https://instagram.com/yourbrand"
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="twitter"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Twitter / X Handle
              </label>
              <Input
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@yourbrand"
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="linkedin"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                LinkedIn Company URL
              </label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/yourbrand"
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="businessEmail"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Business Partnerships Email
              </label>
              <Input
                id="businessEmail"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="partners@yourbrand.com"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review & Launch */}
      {step === 4 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">Review &amp; Launch</h2>
            <p className="mt-1 text-xs text-muted">
              Confirm your brand details before entering the CROWND platform.
            </p>
          </div>

          <div className="space-y-3 rounded border border-border bg-stone-50 p-4 text-xs dark:bg-stone-900/40">
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Company Name:</span>
              <span className="font-medium text-foreground">{companyName}</span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Website:</span>
              <span className="font-medium text-foreground">{website || "Not provided"}</span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Industry:</span>
              <span className="font-medium text-foreground">{industry}</span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Location:</span>
              <span className="font-medium text-foreground">
                {location ? `${location}, ${country}` : country}
              </span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="font-semibold text-muted">Logo:</span>
              <span className="font-medium text-foreground">
                {logoUrl ? "Uploaded" : "Pending"}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-xs text-muted">
                I agree to the CROWND Brand Collaboration Standards, Return Clearance Protection,
                and performance payout terms.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={loading}
          >
            <ChevronLeft className="mr-1 h-3.5 w-3.5" />
            Previous
          </Button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <Button type="button" variant="primary" size="sm" onClick={handleNext} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleComplete}
            disabled={loading || !agreedToTerms}
          >
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Launching...
              </>
            ) : (
              <>
                Launch Brand Portal
                <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
