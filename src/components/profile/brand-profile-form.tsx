"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetUpload } from "@/components/onboarding/asset-upload";
import { ProfileCompletionWidget } from "./profile-completion-widget";
import { calculateBrandCompletion } from "@/lib/onboarding/completion";
import {
  BRAND_INDUSTRIES,
  COMPANY_SIZES,
  validateCompanyName,
  validateWebsite,
  validateDescription,
} from "@/lib/onboarding/validation";
import { saveBrandStepAction } from "@/lib/onboarding/actions";
import type { Database } from "@/lib/types/database";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type BrandRow = Database["public"]["Tables"]["brands"]["Row"];

interface BrandProfileFormProps {
  initialBrand: BrandRow;
}

export function BrandProfileForm({ initialBrand }: BrandProfileFormProps) {
  const [brand, setBrand] = useState<BrandRow>(initialBrand);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field states
  const [companyName, setCompanyName] = useState(initialBrand.company_name || "");
  const [website, setWebsite] = useState(initialBrand.website || "");
  const [industry, setIndustry] = useState(initialBrand.industry || BRAND_INDUSTRIES[0]);
  const [companySize, setCompanySize] = useState(initialBrand.company_size || COMPANY_SIZES[0]);
  const [description, setDescription] = useState(initialBrand.description || "");
  const [location, setLocation] = useState(initialBrand.location || "");
  const [country, setCountry] = useState(initialBrand.country || "United States");
  const [logoUrl, setLogoUrl] = useState(initialBrand.logo_url || "");
  const [instagram, setInstagram] = useState(initialBrand.social_links?.instagram || "");
  const [twitter, setTwitter] = useState(initialBrand.social_links?.twitter || "");
  const [linkedin, setLinkedin] = useState(initialBrand.social_links?.linkedin || "");
  const [businessEmail, setBusinessEmail] = useState(initialBrand.business_contact?.email || "");

  const completion = calculateBrandCompletion({
    ...brand,
    company_name: companyName,
    website,
    industry,
    description,
    location,
    country,
    logo_url: logoUrl,
    social_links: {
      ...(instagram ? { instagram } : {}),
      ...(twitter ? { twitter } : {}),
      ...(linkedin ? { linkedin } : {}),
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedSuccess(false);

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

    if (description) {
      const vDesc = validateDescription(description, 20, 1000);
      if (!vDesc.valid) {
        setError(vDesc.error || "Invalid description");
        return;
      }
    }

    setLoading(true);

    const updatedData: Partial<BrandRow> = {
      company_name: companyName.trim(),
      website: website.trim() || null,
      industry,
      company_size: companySize,
      description: description.trim() || null,
      location: location.trim() || null,
      country: country.trim() || null,
      logo_url: logoUrl || null,
      social_links: {
        ...(instagram.trim() ? { instagram: instagram.trim() } : {}),
        ...(twitter.trim() ? { twitter: twitter.trim() } : {}),
        ...(linkedin.trim() ? { linkedin: linkedin.trim() } : {}),
      },
      business_contact: {
        ...(businessEmail.trim() ? { email: businessEmail.trim() } : {}),
      },
    };

    const res = await saveBrandStepAction(4, updatedData);
    setLoading(false);

    if (res.success) {
      setBrand((prev) => ({ ...prev, ...updatedData }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } else {
      setError(res.error || "Failed to update profile.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Widget */}
      <ProfileCompletionWidget completion={completion} role="brand" />

      {/* Status Alerts */}
      {savedSuccess && (
        <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Brand profile updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form
        onSubmit={handleSave}
        className="space-y-6 rounded border border-border bg-surface p-6 shadow-hairline"
      >
        <div className="border-b border-border pb-4">
          <h2 className="font-serif text-lg font-bold text-foreground">
            Brand Details &amp; Store Information
          </h2>
          <p className="text-xs text-muted">
            Manage your company identity, store link, and public brand information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Logo Upload */}
          <div className="sm:col-span-2">
            <AssetUpload
              label="Brand Logo"
              description="High-resolution square or transparent logo (PNG, JPG, SVG up to 10MB)."
              bucket="brand-assets"
              currentUrl={logoUrl}
              onUploadComplete={(url) => setLogoUrl(url)}
            />
          </div>

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

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Brand Description (Min 20 characters)
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <span className="text-[11px] text-muted">{description.length} / 1000 characters</span>
          </div>

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
              className="mt-1"
            />
          </div>
        </div>

        {/* Channels & Contacts */}
        <div className="border-t border-border pt-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Channels &amp; Partnerships Contact
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="instagram" className="block text-xs font-semibold text-muted">
                Instagram
              </label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@brand"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-xs font-semibold text-muted">
                Twitter / X
              </label>
              <Input
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@brand"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-xs font-semibold text-muted">
                LinkedIn URL
              </label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/brand"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="businessEmail" className="block text-xs font-semibold text-muted">
                Partnerships Email
              </label>
              <Input
                id="businessEmail"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="creator-partners@brand.com"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end border-t border-border pt-4">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
