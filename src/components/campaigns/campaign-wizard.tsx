"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AssetUpload } from "@/components/onboarding/asset-upload";
import {
  CAMPAIGN_OBJECTIVES,
  CAMPAIGN_TYPES,
  COMPENSATION_MODELS,
  validateCampaignTitle,
  validateCampaignDescription,
  validateCampaignBudget,
  validateCommissionRate,
  validateReturnWindow,
  validateCampaignDates,
  validateFollowerBounds,
} from "@/lib/campaigns/validation";
import { createCampaignAction, updateCampaignAction } from "@/lib/campaigns/actions";
import type {
  Database,
  CampaignObjective,
  CampaignType,
  CompensationModel,
  CampaignStatus,
} from "@/lib/types/database";
import {
  FileText,
  ShoppingBag,
  Users,
  Film,
  DollarSign,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];

interface CampaignWizardProps {
  initialCampaign?: Partial<CampaignRow>;
  mode?: "create" | "edit";
}

export function CampaignWizard({ initialCampaign, mode = "create" }: CampaignWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialCampaign?.title || "");
  const [description, setDescription] = useState(initialCampaign?.description || "");
  const [objective, setObjective] = useState<CampaignObjective>(
    (initialCampaign?.objective as CampaignObjective) || "sales"
  );
  const [campaignType, setCampaignType] = useState<CampaignType>(
    (initialCampaign?.campaign_type as CampaignType) || "performance"
  );
  const [category, setCategory] = useState(initialCampaign?.category || "Specialty Goods");
  const [coverImageUrl, setCoverImageUrl] = useState(initialCampaign?.cover_image_url || "");
  const [tagsInput, setTagsInput] = useState((initialCampaign?.tags || []).join(", "));

  // Product & Offer
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("49.99");
  const [productUrl, setProductUrl] = useState("");

  // Creator Requirements
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(
    initialCampaign?.target_platforms || ["Instagram"]
  );
  const [minFollowers, setMinFollowers] = useState(
    initialCampaign?.min_followers?.toString() || "1000"
  );
  const [maxFollowers, setMaxFollowers] = useState(
    initialCampaign?.max_followers?.toString() || ""
  );
  const [requirements, setRequirements] = useState(initialCampaign?.requirements || "");

  // Deliverables
  const [requiredDeliverables, setRequiredDeliverables] = useState<string[]>(
    initialCampaign?.required_deliverables || ["1x Reel / TikTok", "1x Story with Link"]
  );
  const [deliverableGuidelines, setDeliverableGuidelines] = useState(
    initialCampaign?.deliverable_guidelines ||
      "Focus on natural unboxing, clear usage demonstration, and honest impressions."
  );

  // Budget & Compensation
  const [budget, setBudget] = useState(initialCampaign?.budget?.toString() || "3000");
  const [compensationModel, setCompensationModel] = useState<CompensationModel>(
    (initialCampaign?.compensation_model as CompensationModel) || "commission"
  );
  const [commissionRate, setCommissionRate] = useState(
    initialCampaign?.commission_rate?.toString() || "15"
  );
  const [commissionType, setCommissionType] = useState<"percentage" | "fixed">(
    initialCampaign?.commission_type || "percentage"
  );
  const [fixedAmount, setFixedAmount] = useState(initialCampaign?.fixed_amount?.toString() || "0");
  const [returnWindowDays, setReturnWindowDays] = useState(
    initialCampaign?.return_window_days?.toString() || "14"
  );

  // Schedule
  const [startsAt, setStartsAt] = useState(
    initialCampaign?.starts_at?.split("T")[0] || new Date().toISOString().split("T")[0]
  );
  const [endsAt, setEndsAt] = useState(initialCampaign?.ends_at?.split("T")[0] || "");
  const [applicationDeadline, setApplicationDeadline] = useState(
    initialCampaign?.application_deadline?.split("T")[0] || ""
  );
  const [contentDeadline, setContentDeadline] = useState(
    initialCampaign?.content_deadline?.split("T")[0] || ""
  );

  // Terms
  const [terms, setTerms] = useState(initialCampaign?.terms_and_conditions || "");

  const steps = [
    { num: 1, title: "Basics", icon: FileText },
    { num: 2, title: "Product", icon: ShoppingBag },
    { num: 3, title: "Creators", icon: Users },
    { num: 4, title: "Deliverables", icon: Film },
    { num: 5, title: "Budget", icon: DollarSign },
    { num: 6, title: "Schedule", icon: Calendar },
    { num: 7, title: "Publish", icon: CheckCircle2 },
  ];

  const togglePlatform = (plat: string) => {
    if (targetPlatforms.includes(plat)) {
      if (targetPlatforms.length > 1) {
        setTargetPlatforms(targetPlatforms.filter((p) => p !== plat));
      }
    } else {
      setTargetPlatforms([...targetPlatforms, plat]);
    }
  };

  const validateStep = (s: number): boolean => {
    setError(null);
    if (s === 1) {
      const vT = validateCampaignTitle(title);
      if (!vT.valid) {
        setError(vT.error || "Invalid title");
        return false;
      }
      const vD = validateCampaignDescription(description);
      if (!vD.valid) {
        setError(vD.error || "Invalid description");
        return false;
      }
    } else if (s === 3) {
      const minF = parseInt(minFollowers, 10) || 0;
      const maxF = maxFollowers ? parseInt(maxFollowers, 10) : null;
      const vF = validateFollowerBounds(minF, maxF);
      if (!vF.valid) {
        setError(vF.error || "Invalid follower requirements");
        return false;
      }
    } else if (s === 5) {
      const vB = validateCampaignBudget(budget);
      if (!vB.valid) {
        setError(vB.error || "Invalid budget");
        return false;
      }
      const vC = validateCommissionRate(commissionRate, commissionType);
      if (!vC.valid) {
        setError(vC.error || "Invalid commission rate");
        return false;
      }
      const vR = validateReturnWindow(returnWindowDays);
      if (!vR.valid) {
        setError(vR.error || "Invalid return clearance window");
        return false;
      }
    } else if (s === 6) {
      const vDates = validateCampaignDates({
        starts_at: startsAt || null,
        ends_at: endsAt || null,
        application_deadline: applicationDeadline || null,
        content_deadline: contentDeadline || null,
      });
      if (!vDates.valid) {
        setError(vDates.error || "Invalid date ordering");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((curr) => Math.min(7, curr + 1));
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!validateStep(1) || !validateStep(3) || !validateStep(5) || !validateStep(6)) {
      return;
    }

    setLoading(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      objective,
      campaign_type: campaignType,
      category: category.trim(),
      cover_image_url: coverImageUrl || null,
      target_platforms: targetPlatforms,
      min_followers: parseInt(minFollowers, 10) || 0,
      max_followers: maxFollowers ? parseInt(maxFollowers, 10) : null,
      required_deliverables: requiredDeliverables,
      deliverable_guidelines: deliverableGuidelines.trim() || null,
      requirements: requirements.trim() || null,
      budget: parseFloat(budget) || 0,
      compensation_model: compensationModel,
      commission_rate: parseFloat(commissionRate) || 10,
      commission_type: commissionType,
      fixed_amount: parseFloat(fixedAmount) || 0,
      return_window_days: parseInt(returnWindowDays, 10) || 14,
      starts_at: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      application_deadline: applicationDeadline
        ? new Date(applicationDeadline).toISOString()
        : null,
      content_deadline: contentDeadline ? new Date(contentDeadline).toISOString() : null,
      terms_and_conditions: terms.trim() || null,
      tags,
      status: (publish ? "active" : "draft") as CampaignStatus,
    };

    try {
      if (mode === "edit" && initialCampaign?.id) {
        const res = await updateCampaignAction(initialCampaign.id, payload);
        if (res.success) {
          router.push(`/dashboard/campaigns/${initialCampaign.id}`);
        } else {
          setError(res.error || "Failed to update campaign.");
        }
      } else {
        const res = await createCampaignAction(payload);
        if (res.success && res.campaignId) {
          router.push(`/dashboard/campaigns/${res.campaignId}`);
        } else {
          setError(res.error || "Failed to create campaign.");
        }
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      {/* Step Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Campaign Setup • Step {step} of 7
          </span>
          <Badge variant={step === 7 ? "success" : "neutral"} size="sm">
            {step === 7 ? "Ready to Launch" : steps[step - 1].title}
          </Badge>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-7 gap-1.5">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = s.num === step;
            const isDone = s.num < step;
            return (
              <button
                type="button"
                key={s.num}
                onClick={() => {
                  if (isDone || validateStep(step)) setStep(s.num);
                }}
                className={`flex flex-col items-center gap-1 rounded border p-2 text-center transition-colors ${
                  isCurrent
                    ? "bg-accent/10 border-accent font-semibold text-accent"
                    : isDone
                      ? "border-stone-300 bg-stone-50 text-emerald-600 dark:border-stone-800 dark:text-emerald-400"
                      : "border-border bg-surface text-muted opacity-60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden truncate text-[10px] sm:inline">{s.title}</span>
              </button>
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

      {/* STEP 1: Campaign Basics */}
      {step === 1 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">Campaign Basics</h2>
            <p className="mt-1 text-xs text-muted">
              Set the foundational narrative, primary objective, and category for your creator
              campaign.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Campaign Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Artisanal Matcha Harvest Launch"
                className="mt-1"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Campaign Description * (Min 20 characters)
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the product story, the angle creators should highlight, and why their audience will love it..."
                className="placeholder:text-muted/60 mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
              <span className="text-[11px] text-muted">{description.length} / 3000 characters</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="objective"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Primary Objective
                </label>
                <select
                  id="objective"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value as CampaignObjective)}
                  className="mt-1 flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {CAMPAIGN_OBJECTIVES.map((obj) => (
                    <option key={obj.value} value={obj.value}>
                      {obj.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="campaignType"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Campaign Type
                </label>
                <select
                  id="campaignType"
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                  className="mt-1 flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {CAMPAIGN_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>
                      {ct.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Category / Industry
                </label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Specialty Food, Sustainable Home"
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Hashtags &amp; Tags (comma separated)
                </label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="#organic, #morningroutine, #matchalover"
                  className="mt-1"
                />
              </div>
            </div>

            <AssetUpload
              label="Campaign Cover Visual"
              description="High-resolution lifestyle or product visual (PNG, JPG, WebP up to 10MB)."
              bucket="brand-assets"
              currentUrl={coverImageUrl}
              onUploadComplete={(url) => setCoverImageUrl(url)}
            />
          </div>
        </div>
      )}

      {/* STEP 2: Products & Offers */}
      {step === 2 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Featured Product &amp; Offer
            </h2>
            <p className="mt-1 text-xs text-muted">
              Provide product details for tracking attribution and creator review context.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="productTitle"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Product Name
              </label>
              <Input
                id="productTitle"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. Ceremonial Single-Origin Matcha Tin (30g)"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="productPrice"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Retail Price ($ USD)
                </label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="productUrl"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Store Product Link
                </label>
                <Input
                  id="productUrl"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://yourstore.com/products/matcha"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Creator Requirements */}
      {step === 3 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">Creator Requirements</h2>
            <p className="mt-1 text-xs text-muted">
              Specify the audience reach and channels ideal for this campaign.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Target Channels
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Instagram", "TikTok", "YouTube", "Twitter / X", "Newsletter"].map((plat) => {
                  const isSelected = targetPlatforms.includes(plat);
                  return (
                    <button
                      type="button"
                      key={plat}
                      onClick={() => togglePlatform(plat)}
                      className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isSelected
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-surface text-foreground hover:bg-stone-50 dark:hover:bg-stone-900"
                      }`}
                    >
                      {plat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="minFollowers"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Minimum Audience Reach
                </label>
                <Input
                  id="minFollowers"
                  type="number"
                  min="0"
                  step="500"
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(e.target.value)}
                  placeholder="e.g. 1000"
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="maxFollowers"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Maximum Reach (Optional cap for micro-creator focus)
                </label>
                <Input
                  id="maxFollowers"
                  type="number"
                  min="0"
                  step="5000"
                  value={maxFollowers}
                  onChange={(e) => setMaxFollowers(e.target.value)}
                  placeholder="e.g. 50000"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="requirements"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Specific Creator Expectations
              </label>
              <textarea
                id="requirements"
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Seeking creators who appreciate authentic routine integration rather than heavy sales pitches..."
                className="mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Deliverables */}
      {step === 4 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">Content Deliverables</h2>
            <p className="mt-1 text-xs text-muted">
              Define the content format and storytelling requirements creators must complete.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Required Content Formats
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "1x Reel / TikTok",
                  "1x Story with Link",
                  "Dedicated YouTube Video",
                  "Static Carousel Review",
                  "Newsletter Feature",
                ].map((item) => {
                  const isChecked = requiredDeliverables.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        if (isChecked) {
                          if (requiredDeliverables.length > 1) {
                            setRequiredDeliverables(requiredDeliverables.filter((d) => d !== item));
                          }
                        } else {
                          setRequiredDeliverables([...requiredDeliverables, item]);
                        }
                      }}
                      className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isChecked
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-surface text-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="guidelines"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Deliverable Guidelines
              </label>
              <textarea
                id="guidelines"
                rows={4}
                value={deliverableGuidelines}
                onChange={(e) => setDeliverableGuidelines(e.target.value)}
                placeholder="Include hashtags, must-mention features, FTC disclosure requirements, brand tag rules..."
                className="mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Budget & Compensation */}
      {step === 5 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Budget &amp; Compensation
            </h2>
            <p className="mt-1 text-xs text-muted">
              Configure guaranteed performance terms, commission rates, and return clearance rules.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="budget"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Total Campaign Budget ($ USD) *
                </label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="compModel"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Compensation Model
                </label>
                <select
                  id="compModel"
                  value={compensationModel}
                  onChange={(e) => setCompensationModel(e.target.value as CompensationModel)}
                  className="mt-1 flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {COMPENSATION_MODELS.map((cm) => (
                    <option key={cm.value} value={cm.value}>
                      {cm.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="commissionRate"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Commission Rate *
                </label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.5"
                  min="0"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="commissionType"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Commission Type
                </label>
                <select
                  id="commissionType"
                  value={commissionType}
                  onChange={(e) => setCommissionType(e.target.value as "percentage" | "fixed")}
                  className="mt-1 flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="percentage">% of Order Value</option>
                  <option value="fixed">$ Fixed per Order</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="returnWindow"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Return Clearance (Days) *
                </label>
                <Input
                  id="returnWindow"
                  type="number"
                  min="7"
                  max="90"
                  value={returnWindowDays}
                  onChange={(e) => setReturnWindowDays(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {compensationModel === "hybrid" && (
              <div>
                <label
                  htmlFor="fixedAmount"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Fixed Base Fee ($ USD per approved creator)
                </label>
                <Input
                  id="fixedAmount"
                  type="number"
                  min="0"
                  step="25"
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 6: Schedule */}
      {step === 6 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Timeline &amp; Deadlines
            </h2>
            <p className="mt-1 text-xs text-muted">
              Set clear application cutoffs, publishing dates, and campaign duration.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startsAt"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Campaign Start Date *
              </label>
              <Input
                id="startsAt"
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endsAt"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Campaign End Date
              </label>
              <Input
                id="endsAt"
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="appDeadline"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Application Cutoff
              </label>
              <Input
                id="appDeadline"
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="contentDeadline"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Content Submission Cutoff
              </label>
              <Input
                id="contentDeadline"
                type="date"
                value={contentDeadline}
                onChange={(e) => setContentDeadline(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: Preview & Publish */}
      {step === 7 && (
        <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Campaign Summary</h2>
              <p className="mt-1 text-xs text-muted">
                Review your campaign specifications before publishing to creator discovery.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-accent" />
          </div>

          <div className="space-y-3 rounded border border-border bg-stone-50 p-4 text-xs dark:bg-stone-900/40">
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Title:</span>
              <span className="font-medium text-foreground">{title}</span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Objective &amp; Type:</span>
              <span className="font-medium capitalize text-foreground">
                {objective} • {campaignType}
              </span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Budget:</span>
              <span className="font-medium text-foreground">
                ${parseFloat(budget || "0").toLocaleString()} USD
              </span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Creator Commission:</span>
              <span className="font-medium font-semibold text-accent">
                {commissionRate}
                {commissionType === "percentage" ? "% of sales" : "$ per order"} (after{" "}
                {returnWindowDays}-day return window)
              </span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="font-semibold text-muted">Target Channels:</span>
              <span className="font-medium text-foreground">{targetPlatforms.join(", ")}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="font-semibold text-muted">Deliverables:</span>
              <span className="font-medium text-foreground">
                {requiredDeliverables.join(" • ")}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="terms"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Special Campaign Terms &amp; Conditions (Optional)
            </label>
            <textarea
              id="terms"
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Any brand-specific non-disclosure, exclusivity, or product shipment terms..."
              className="mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
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

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Draft"}
          </Button>

          {step < 7 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={loading}
            >
              Continue
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleSave(true)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Campaign
                  <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
