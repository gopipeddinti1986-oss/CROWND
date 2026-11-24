"use client";

import React from "react";
import { CheckCircle2, Circle, Sparkles, ArrowRight } from "lucide-react";
import type { ProfileCompletion } from "@/lib/onboarding/completion";
import Link from "next/link";

interface ProfileCompletionWidgetProps {
  completion: ProfileCompletion;
  role: "brand" | "creator";
  editUrl?: string;
  className?: string;
}

export function ProfileCompletionWidget({
  completion,
  role,
  editUrl,
  className = "",
}: ProfileCompletionWidgetProps) {
  const isComplete = completion.percentage === 100;

  return (
    <div className={`rounded border border-border bg-surface p-5 shadow-hairline ${className}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Profile Strength
            </span>
            {isComplete ? (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Sparkles className="h-3 w-3" />
                All Set
              </span>
            ) : (
              <span className="rounded bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-300">
                In Progress
              </span>
            )}
          </div>
          <h3 className="mt-1 font-serif text-lg font-bold text-foreground">
            {completion.percentage}% Completed
          </h3>
          <p className="text-xs text-muted">
            {isComplete
              ? `Your ${role} profile is 100% complete and ready for verified marketplace discovery.`
              : `Complete the remaining items to boost your discovery and collaboration ranking.`}
          </p>
        </div>

        {editUrl && !isComplete && (
          <Link
            href={editUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            Finish setup
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${completion.percentage}%` }}
          role="progressbar"
          aria-valuenow={completion.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Checklist Grid */}
      <div className="mt-4 grid grid-cols-1 gap-2 pt-2 text-xs sm:grid-cols-2">
        {completion.completedFields.map((field) => (
          <div key={field} className="flex items-center gap-2 text-muted">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="decoration-muted/50 line-through">{field}</span>
          </div>
        ))}
        {completion.missingFields.map((field) => (
          <div key={field} className="flex items-center gap-2 font-medium text-foreground">
            <Circle className="h-3.5 w-3.5 shrink-0 text-stone-400" />
            <span>{field}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
