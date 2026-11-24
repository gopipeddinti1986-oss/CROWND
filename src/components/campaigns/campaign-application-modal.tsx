"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyToCampaignAction } from "@/lib/applications/actions";
import { Send, Loader2, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";

interface CampaignApplicationModalProps {
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  commission: string;
  returnWindowDays: number;
}

export function CampaignApplicationModal({
  campaignId,
  campaignTitle,
  brandName,
  commission,
  returnWindowDays,
}: CampaignApplicationModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pitch, setPitch] = useState("");
  const [contentPlan, setContentPlan] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pitch.trim().length < 20) {
      setError("Please provide a pitch of at least 20 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await applyToCampaignAction({
        campaignId,
        pitch: pitch.trim(),
        proposedContentPlan: contentPlan.trim() || undefined,
        portfolioLinks: portfolioLink.trim() ? [portfolioLink.trim()] : undefined,
        socialLinks: socialLink.trim() ? { primary: socialLink.trim() } : undefined,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          router.push("/dashboard/applications");
        }, 1500);
      } else {
        setError(res.error || "Failed to submit application.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} className="gap-1.5">
        <Send className="h-3.5 w-3.5" />
        Apply Now
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-modal-title"
        >
          <div className="animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded border border-border bg-surface p-6 shadow-xl duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 border-b border-border pb-4 pr-6">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Creator Application</span>
              </div>
              <h2 id="app-modal-title" className="font-serif text-lg font-bold text-foreground">
                Apply for {campaignTitle}
              </h2>
              <p className="text-xs text-muted">
                Partner with <strong className="text-foreground">{brandName}</strong> • {commission}{" "}
                post-delivery ({returnWindowDays}-day return window).
              </p>
            </div>

            {success ? (
              <div className="space-y-3 py-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-serif text-base font-bold text-foreground">
                  Application Submitted!
                </h3>
                <p className="mx-auto max-w-xs text-xs text-muted">
                  {brandName} has been notified. You can track your application status in your
                  Creator Dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                {error && (
                  <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="pitch"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Your Pitch &amp; Audience Fit * (Min 20 characters)
                  </label>
                  <textarea
                    id="pitch"
                    rows={4}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Describe why your audience resonates with this product, your creative angle, and recent similar collaborations..."
                    className="placeholder:text-muted/60 mt-1 flex w-full rounded border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                  <span className="text-[11px] text-muted">{pitch.length} / 1000 characters</span>
                </div>

                <div>
                  <label
                    htmlFor="contentPlan"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Proposed Content Plan (Optional)
                  </label>
                  <Input
                    id="contentPlan"
                    value={contentPlan}
                    onChange={(e) => setContentPlan(e.target.value)}
                    placeholder="e.g. 1x Reel focusing on aesthetic morning routine + 2x Stories"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="portfolioLink"
                      className="block text-xs font-semibold uppercase tracking-wider text-muted"
                    >
                      Sample Portfolio / Post Link
                    </label>
                    <Input
                      id="portfolioLink"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="https://instagram.com/p/..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="socialLink"
                      className="block text-xs font-semibold uppercase tracking-wider text-muted"
                    >
                      Primary Channel Link
                    </label>
                    <Input
                      id="socialLink"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      placeholder="https://tiktok.com/@..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
