import React from "react";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this section. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded border border-danger-border bg-danger-surface p-8 text-center text-danger-text",
        className
      )}
    >
      <div className="bg-danger/10 mb-3 flex h-11 w-11 items-center justify-center rounded-full text-danger">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mb-1 font-serif text-base font-semibold">{title}</h3>
      <p className="mb-4 max-w-md text-xs leading-relaxed opacity-90">{message}</p>
      {onRetry && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="border-danger/30 hover:bg-danger-surface"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          Try Again
        </Button>
      )}
    </div>
  );
}
