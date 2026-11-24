"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetUpload } from "@/components/onboarding/asset-upload";
import { ProfileCompletionWidget } from "./profile-completion-widget";
import { calculateCreatorCompletion } from "@/lib/onboarding/completion";
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
import { saveCreatorStepAction } from "@/lib/onboarding/actions";
import type { Database } from "@/lib/types/database";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type CreatorRow = Database["public"]["Tables"]["creators"]["Row"];

interface CreatorProfileFormProps {
  initialCreator: CreatorRow;
}

export function CreatorProfileForm({ initialCreator }: CreatorProfileFormProps) {
  const [creator, setCreator] = useState<CreatorRow>(initialCreator);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [displayName, setDisplayName] = useState(initialCreator.display_name || "");
  const [handle, setHandle] = useState(initialCreator.handle || "");
  const [bio, setBio] = useState(initialCreator.bio || "");
  const [photoUrl, setPhotoUrl] = useState(initialCreator.profile_photo_url || "");
  const [primaryNiche, setPrimaryNiche] = useState(
    initialCreator.primary_niche || CREATOR_NICHES[0]
  );
  const [categories, setCategories] = useState<string[]>(
    initialCreator.categories || [CREATOR_NICHES[0]]
  );
  const [location, setLocation] = useState(initialCreator.location || "");
  const [languages, setLanguages] = useState<string[]>(initialCreator.languages || ["English"]);
  const [primaryPlatform, setPrimaryPlatform] = useState(
    initialCreator.primary_platform || CREATOR_PLATFORMS[0]
  );
  const [audienceSize, setAudienceSize] = useState(initialCreator.audience_size?.toString() || "0");

  const completion = calculateCreatorCompletion({
    ...creator,
    display_name: displayName,
    handle,
    bio,
    profile_photo_url: photoUrl,
    primary_niche: primaryNiche,
    categories,
    location,
    languages,
    primary_platform: primaryPlatform,
    audience_size: parseInt(audienceSize, 10) || 0,
  });

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedSuccess(false);

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

    if (bio) {
      const vBio = validateDescription(bio, 10, 500);
      if (!vBio.valid) {
        setError(vBio.error || "Invalid bio");
        return;
      }
    }

    const vCats = validateCategories(categories);
    if (!vCats.valid) {
      setError(vCats.error || "Please select valid categories");
      return;
    }

    const vAud = validateAudienceSize(audienceSize);
    if (!vAud.valid) {
      setError(vAud.error || "Invalid audience size");
      return;
    }

    setLoading(true);

    const updatedData: Partial<CreatorRow> = {
      display_name: displayName.trim(),
      handle: handle.trim().toLowerCase(),
      bio: bio.trim() || null,
      profile_photo_url: photoUrl || null,
      primary_niche: primaryNiche,
      categories,
      location: location.trim() || null,
      languages,
      primary_platform: primaryPlatform,
      audience_size: parseInt(audienceSize, 10) || 0,
    };

    const res = await saveCreatorStepAction(4, updatedData);
    setLoading(false);

    if (res.success) {
      setCreator((prev) => ({ ...prev, ...updatedData }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } else {
      setError(res.error || "Failed to update profile.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Widget */}
      <ProfileCompletionWidget completion={completion} role="creator" />

      {/* Status Alerts */}
      {savedSuccess && (
        <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Creator profile updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="space-y-6 rounded border border-border bg-surface p-6 shadow-hairline"
      >
        <div className="border-b border-border pb-4">
          <h2 className="font-serif text-lg font-bold text-foreground">
            Creator Profile &amp; Preferences
          </h2>
          <p className="text-xs text-muted">
            Update your public profile, primary platform channels, and niche categorization.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Avatar Upload */}
          <div className="sm:col-span-2">
            <AssetUpload
              label="Profile Photo"
              description="High-resolution portrait or creator photo (PNG, JPG, WebP up to 5MB)."
              bucket="avatars"
              currentUrl={photoUrl}
              onUploadComplete={(url) => setPhotoUrl(url)}
            />
          </div>

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
              className="mt-1"
              required
            />
          </div>

          <div>
            <label
              htmlFor="handle"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Handle *
            </label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase())}
              className="mt-1"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="bio"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Bio (Min 10 characters)
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <span className="text-[11px] text-muted">{bio.length} / 500 characters</span>
          </div>

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
            <label
              htmlFor="location"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Location
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Sub-Categories (1 to 5)
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

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Languages
            </label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {COMMON_LANGUAGES.map((lang) => {
                const isSelected = languages.includes(lang);
                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`rounded border px-2.5 py-1 text-xs ${
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

        {/* Platform & Reach */}
        <div className="border-t border-border pt-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Primary Platform &amp; Audience Reach
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="primaryPlatform" className="block text-xs font-semibold text-muted">
                Primary Platform
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
              <label htmlFor="audienceSize" className="block text-xs font-semibold text-muted">
                Audience Reach / Followers
              </label>
              <Input
                id="audienceSize"
                type="number"
                min="0"
                value={audienceSize}
                onChange={(e) => setAudienceSize(e.target.value)}
                className="mt-1"
                required
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
