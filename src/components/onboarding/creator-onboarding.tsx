"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetUpload } from "./asset-upload";
import {
  CREATOR_NICHES,
  CREATOR_PLATFORMS,
  COMMON_LANGUAGES,
  validateDisplayName,
  validateCreatorHandle,
  validateDescription,
  validateCategories,
  validateAudienceSize,
} from "@/lib/onboarding/validation";
import { saveCreatorStepAction, completeOnboardingAction } from "@/lib/onboarding/actions";
import type { Database } from "@/lib/types/database";
import {
  User,
  Sparkles,
  Share2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

type CreatorRow = Database["public"]["Tables"]["creators"]["Row"];

interface CreatorOnboardingProps {
  initialCreator?: CreatorRow | null;
  initialStep?: number;
}

export function CreatorOnboarding({ initialCreator, initialStep = 1 }: CreatorOnboardingProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(initialStep || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [displayName, setDisplayName] = useState(initialCreator?.display_name || "");
  const [handle, setHandle] = useState(initialCreator?.handle || "");
  const [bio, setBio] = useState(initialCreator?.bio || "");
  const [photoUrl, setPhotoUrl] = useState(initialCreator?.profile_photo_url || "");

  const [primaryNiche, setPrimaryNiche] = useState(
    initialCreator?.primary_niche || CREATOR_NICHES[0]
  );
  const [categories, setCategories] = useState<string[]>(
    initialCreator?.categories || [CREATOR_NICHES[0]]
  );
  const [location, setLocation] = useState(initialCreator?.location || "");
  const [languages, setLanguages] = useState<string[]>(initialCreator?.languages || ["English"]);

  const [primaryPlatform, setPrimaryPlatform] = useState(
    initialCreator?.primary_platform || CREATOR_PLATFORMS[0]
  );
  const [platformHandle, setPlatformHandle] = useState("");
  const [audienceSize, setAudienceSize] = useState(
    initialCreator?.audience_size?.toString() || "1000"
  );

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps = [
    { num: 1, title: "Identity & Handle", icon: User },
    { num: 2, title: "Niche & Topics", icon: Sparkles },
    { num: 3, title: "Platforms & Reach", icon: Share2 },
    { num: 4, title: "Review & Launch", icon: CheckCircle2 },
  ];

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      if (categories.length < 5) {
        setCategories([...categories, cat]);
      }
    }
  };

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter((l) => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleNext = async () => {
    setError(null);

    if (step === 1) {
      const vName = validateDisplayName(displayName);
      if (!vName.valid) {
        setError(vName.error || "Invalid display name");
        return;
      }
      const vHandle = validateCreatorHandle(handle);
      if (!vHandle.valid) {
        setError(vHandle.error || "Invalid handle");
        return;
      }
      const vBio = validateDescription(bio, 10, 500);
      if (!vBio.valid) {
        setError(vBio.error || "Invalid bio");
        return;
      }

      setLoading(true);
      const res = await saveCreatorStepAction(1, {
        display_name: displayName.trim(),
        handle: handle.trim().toLowerCase(),
        bio: bio.trim(),
        profile_photo_url: photoUrl || null,
      });
      setLoading(false);

      if (!res.success) {
        setError(res.error || "Failed to save creator identity.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const vCats = validateCategories(categories);
      if (!vCats.valid) {
        setError(vCats.error || "Please select valid categories");
        return;
      }

      setLoading(true);
      const res = await saveCreatorStepAction(2, {
        primary_niche: primaryNiche,
        categories,
        location: location.trim() || null,
        languages,
      });
      setLoading(false);

      if (!res.success) {
        setError(res.error || "Failed to save niche information.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const vAud = validateAudienceSize(audienceSize);
      if (!vAud.valid) {
        setError(vAud.error || "Invalid audience count");
        return;
      }

      setLoading(true);
      const res = await saveCreatorStepAction(3, {
        primary_platform: primaryPlatform,
        audience_size: parseInt(audienceSize, 10) || 0,
        platforms: {
          [primaryPlatform.toLowerCase().replace(/[^a-z]/g, "")]: {
            handle: platformHandle || handle,
          },
        },
      });
      setLoading(false);

      if (!res.success) {
        setError(res.error || "Failed to save platform reach.");
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
            Creator Onboarding • Step {step} of 4
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

      {/* Step 1: Creator Identity & Handle */}
      {step === 1 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">Your Creator Identity</h2>
            <p className="mt-1 text-xs text-muted">
              Choose how you will appear to premium brands and audience shoppers.
            </p>
          </div>

          <div className="space-y-4">
            <AssetUpload
              label="Profile Photo"
              description="Upload a clean, high-resolution portrait or creator avatar (PNG, JPG, WebP up to 5MB)."
              bucket="avatars"
              currentUrl={photoUrl}
              onUploadComplete={(url) => setPhotoUrl(url)}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Display Name *
                </label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="handle"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Creator Handle * (Letters, numbers, underscores)
                </label>
                <Input
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase())}
                  placeholder="e.g. maya_curates"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Creator Bio * (Min 10 characters)
              </label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your focus, creative perspective, and the types of products your audience loves..."
                className="placeholder:text-muted/60 mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
              <span className="text-[11px] text-muted">{bio.length} / 500 characters</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Niche & Categories */}
      {step === 2 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Content Focus &amp; Categories
            </h2>
            <p className="mt-1 text-xs text-muted">
              Select your primary niche and up to 5 sub-categories to match with relevant brand
              campaigns.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="primaryNiche"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Primary Niche
              </label>
              <select
                id="primaryNiche"
                value={primaryNiche}
                onChange={(e) => setPrimaryNiche(e.target.value)}
                className="mt-1 flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {CREATOR_NICHES.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Sub-Categories (Select 1 to 5)
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CREATOR_NICHES.map((cat) => {
                  const isSelected = categories.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isSelected
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-surface text-foreground hover:bg-stone-50 dark:hover:bg-stone-900"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="location"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Location (City, Country)
                </label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Austin, Texas"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Languages
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {COMMON_LANGUAGES.slice(0, 5).map((lang) => {
                    const isSelected = languages.includes(lang);
                    return (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`rounded border px-2.5 py-1 text-[11px] ${
                          isSelected
                            ? "bg-accent/10 border-accent font-semibold text-accent"
                            : "border-border text-muted"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Platforms & Reach */}
      {step === 3 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Platforms &amp; Audience Reach
            </h2>
            <p className="mt-1 text-xs text-muted">
              Help brands understand where your core audience engages with your recommendations.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="primaryPlatform"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Primary Publishing Platform
                </label>
                <select
                  id="primaryPlatform"
                  value={primaryPlatform}
                  onChange={(e) => setPrimaryPlatform(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {CREATOR_PLATFORMS.map((plat) => (
                    <option key={plat} value={plat}>
                      {plat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="platformHandle"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Primary Channel Handle / URL
                </label>
                <Input
                  id="platformHandle"
                  value={platformHandle}
                  onChange={(e) => setPlatformHandle(e.target.value)}
                  placeholder="@handle or profile link"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="audienceSize"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Estimated Total Reach / Followers across channels
              </label>
              <Input
                id="audienceSize"
                type="number"
                min="0"
                step="100"
                value={audienceSize}
                onChange={(e) => setAudienceSize(e.target.value)}
                placeholder="e.g. 15000"
                className="mt-1"
                required
              />
              <p className="mt-1 text-[11px] text-muted">
                Micro-creators (1k - 50k) are highly favored by CROWND brands for verified authentic
                conversion.
              </p>
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
              Confirm your creator profile details before entering the creator dashboard.
            </p>
          </div>

          <div className="space-y-3 rounded border border-border bg-stone-50 p-4 text-xs dark:bg-stone-900/40">
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Creator:</span>
              <span className="font-medium text-foreground">
                {displayName} (@{handle})
              </span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Primary Niche:</span>
              <span className="font-medium text-foreground">{primaryNiche}</span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Categories:</span>
              <span className="font-medium text-foreground">{categories.join(", ")}</span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Primary Platform:</span>
              <span className="font-medium text-foreground">
                {primaryPlatform} (~{Number(audienceSize).toLocaleString()} reach)
              </span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="font-semibold text-muted">Avatar:</span>
              <span className="font-medium text-foreground">
                {photoUrl ? "Uploaded" : "Pending"}
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
                I agree to promote only authentic products I believe in, disclose affiliate
                partnerships transparently, and adhere to CROWND Performance Commerce Terms.
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
                Launch Creator Studio
                <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
