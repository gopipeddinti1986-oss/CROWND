"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { submitContentAction, reviewContentAction } from "@/lib/collaborations/actions";
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface CollaborationCardProps {
  collaboration: any;
  userRole: "brand" | "creator" | "admin";
}

export function CollaborationCard({ collaboration, userRole }: CollaborationCardProps) {
  const [copied, setCopied] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Content submission state (Creator)
  const [contentUrl, setContentUrl] = useState(collaboration.content_url || "");
  const [caption, setCaption] = useState(collaboration.content_caption || "");
  const [submissionNotes, setSubmissionNotes] = useState(collaboration.submission_notes || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Review state (Brand)
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const isBrand = userRole === "brand";
  const link = collaboration.referral_link;

  const handleCopyLink = () => {
    if (link?.tracking_url) {
      navigator.clipboard.writeText(link.tracking_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitContentAction({
        collaborationId: collaboration.id,
        contentUrl,
        caption,
        submissionNotes,
      });
      if (res.success) {
        setShowSubmitModal(false);
      } else {
        setSubmitError(res.error || "Failed to submit content.");
      }
    } catch {
      setSubmitError("An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewContent = async (decision: "approved" | "revision_requested") => {
    setReviewing(true);
    setReviewError(null);
    try {
      const res = await reviewContentAction({
        collaborationId: collaboration.id,
        decision,
        feedback: reviewFeedback,
      });
      if (res.success) {
        setShowReviewModal(false);
      } else {
        setReviewError(res.error || "Failed to review content.");
      }
    } catch {
      setReviewError("An unexpected network error occurred.");
    } finally {
      setReviewing(false);
    }
  };

  const statusVariant =
    collaboration.status === "approved" || collaboration.status === "completed"
      ? "success"
      : collaboration.status === "content_submitted"
        ? "accent"
        : collaboration.status === "revision_requested"
          ? "warning"
          : "neutral";

  return (
    <div className="space-y-5 rounded border border-border bg-surface p-6 shadow-hairline">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant} size="sm">
              {collaboration.status.replace("_", " ").toUpperCase()}
            </Badge>
            <span className="text-xs text-muted">
              {isBrand
                ? `Creator: @${collaboration.creators?.handle}`
                : `Brand: ${collaboration.brands?.company_name}`}
            </span>
          </div>
          <h2 className="mt-1 font-serif text-lg font-bold text-foreground">
            {collaboration.campaigns?.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {!isBrand && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="gap-1.5 text-xs"
            >
              <Send className="h-3 w-3" />
              {collaboration.content_url ? "Update Submission" : "Submit Content"}
            </Button>
          )}

          {isBrand && collaboration.status === "content_submitted" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowReviewModal(true)}
              className="gap-1.5 text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Review Content
            </Button>
          )}
        </div>
      </div>

      {/* Referral Tracking Link Bar */}
      {link ? (
        <div className="border-accent/20 bg-accent/5 dark:bg-accent/10 flex flex-col items-start justify-between gap-3 rounded border p-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-2">
            <Link2 className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-accent">
                Active Referral Attribution Link
              </span>
              <span className="block truncate font-mono text-xs text-foreground">
                {link.tracking_url}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy Link
                </>
              )}
            </Button>
            <a
              href={link.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted hover:text-foreground"
              aria-label="Test redirect link"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded border border-dashed border-border p-3 text-center text-xs text-muted">
          Tracking link being generated...
        </div>
      )}

      {/* Performance Summary Metrics */}
      <div className="grid grid-cols-2 gap-3 border-y border-border py-3 text-xs sm:grid-cols-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Clicks
          </span>
          <div className="font-serif text-base font-bold text-foreground">
            {link?.clicks_count ?? 0}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Orders
          </span>
          <div className="font-serif text-base font-bold text-foreground">
            {link?.sales_count ?? 0}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Revenue Generated
          </span>
          <div className="font-serif text-base font-bold text-foreground">
            ${Number(link?.revenue_generated || 0).toLocaleString()}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Commissions
          </span>
          <div className="font-serif text-base font-bold text-accent">
            ${Number(link?.commissions_earned || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Submitted Content Display */}
      {collaboration.content_url && (
        <div className="border-border/80 space-y-2 rounded border bg-stone-50 p-4 text-xs dark:bg-stone-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Content Submission
            </span>
            <span className="text-[11px] text-muted">
              Submitted {new Date(collaboration.submitted_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={collaboration.content_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 truncate font-medium text-accent underline"
            >
              {collaboration.content_url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {collaboration.content_caption && (
            <p className="leading-relaxed text-foreground">
              <strong>Caption:</strong> {collaboration.content_caption}
            </p>
          )}

          {collaboration.revision_feedback && (
            <div className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
              <strong>Revision Feedback:</strong> {collaboration.revision_feedback}
            </div>
          )}
        </div>
      )}

      {/* Creator Content Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded border border-border bg-surface p-6 shadow-xl">
            <h3 className="font-serif text-base font-bold text-foreground">
              Submit Collaboration Content
            </h3>
            <p className="text-xs text-muted">
              Provide the live URL of your published post, Reel, or video for brand review.
            </p>

            {submitError && (
              <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitContent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted">Content URL *</label>
                <Input
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://instagram.com/reel/..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted">Post Caption</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Paste your caption..."
                  className="mt-1 flex w-full rounded border border-border bg-surface p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted">Notes for Brand</label>
                <textarea
                  rows={2}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Optional notes or details for the brand..."
                  className="mt-1 flex w-full rounded border border-border bg-surface p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded border border-border bg-surface p-6 shadow-xl">
            <h3 className="font-serif text-base font-bold text-foreground">
              Review Creator Content
            </h3>
            <p className="text-xs text-muted">
              Confirm whether the submitted content meets your campaign guidelines.
            </p>

            {reviewError && (
              <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-muted">
                Feedback / Revision Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder="Specify any changes needed if requesting revision..."
                className="mt-1 flex w-full rounded border border-border bg-surface p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={reviewing}
                onClick={() => handleReviewContent("revision_requested")}
                className="text-amber-700 dark:text-amber-400"
              >
                Request Revision
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={reviewing}
                onClick={() => handleReviewContent("approved")}
              >
                {reviewing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve Content"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
