"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reviewApplicationAction } from "@/lib/applications/actions";
import { Check, X, Loader2, User, Globe, AlertCircle } from "lucide-react";

interface BrandApplicationCardProps {
  application: any;
  onStatusChange?: () => void;
}

export function BrandApplicationCard({ application, onStatusChange }: BrandApplicationCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(application.status);
  const [reviewNotes, setReviewNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const creator = application.creators;

  const handleReview = async (decision: "approved" | "rejected") => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewApplicationAction(application.id, decision, reviewNotes);
      if (res.success) {
        setStatus(decision);
        if (onStatusChange) onStatusChange();
      } else {
        setError(res.error || "Failed to update application.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const statusVariant =
    status === "approved"
      ? "success"
      : status === "rejected"
        ? "neutral"
        : status === "pending"
          ? "warning"
          : "neutral";

  return (
    <div className="space-y-4 rounded border border-border bg-surface p-5 shadow-hairline">
      {/* Creator Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-stone-100 dark:bg-stone-800">
            {creator.profile_photo_url ? (
              <Image
                src={creator.profile_photo_url}
                alt={creator.handle}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                <User className="h-6 w-6" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-foreground">
                {creator.display_name || creator.handle}
              </span>
              <span className="text-xs text-muted">@{creator.handle}</span>
              {creator.verified && (
                <Badge variant="success" size="sm">
                  Verified
                </Badge>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted">
              <span>{creator.primary_niche}</span>
              <span>•</span>
              <span>
                {creator.primary_platform} (~{Number(creator.audience_size || 0).toLocaleString()}{" "}
                reach)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={statusVariant} size="sm">
            {status.toUpperCase()}
          </Badge>
          <span className="text-[11px] text-muted">
            Applied {new Date(application.applied_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Creator Pitch & Proposal */}
      <div className="border-border/60 space-y-2 rounded border bg-stone-50 p-4 text-xs dark:bg-stone-900/40">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Creator Pitch:
          </span>
          <p className="mt-1 whitespace-pre-line leading-relaxed text-foreground">
            {application.pitch}
          </p>
        </div>

        {application.proposed_content_plan && (
          <div className="border-border/50 mt-2 border-t pt-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Content Plan:
            </span>
            <p className="mt-0.5 text-foreground">{application.proposed_content_plan}</p>
          </div>
        )}

        {application.portfolio_links && application.portfolio_links.length > 0 && (
          <div className="border-border/50 mt-2 flex items-center gap-2 border-t pt-2">
            <Globe className="h-3.5 w-3.5 text-muted" />
            <span className="font-semibold text-muted">Portfolio:</span>
            {application.portfolio_links.map((link: string, idx: number) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-xs truncate text-accent underline"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Action Controls for Brand */}
      {status === "pending" && (
        <div className="space-y-3 pt-2">
          {showNotes ? (
            <div>
              <label
                htmlFor={`notes-${application.id}`}
                className="block text-xs font-semibold text-muted"
              >
                Review Feedback (Optional, sent to creator)
              </label>
              <textarea
                id={`notes-${application.id}`}
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add welcome notes or guidance..."
                className="mt-1 flex w-full rounded border border-border bg-surface p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNotes(true)}
              className="text-xs text-accent underline hover:opacity-80"
            >
              + Add review notes
            </button>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleReview("rejected")}
              className="gap-1 text-xs text-rose-700 hover:text-rose-800 dark:text-rose-400"
            >
              <X className="h-3.5 w-3.5" />
              Decline
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={loading}
              onClick={() => handleReview("approved")}
              className="gap-1 text-xs"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Accept &amp; Generate Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
