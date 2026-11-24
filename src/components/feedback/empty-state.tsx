import React from "react";
import { cn } from "@/lib/utils/cn";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-surface/50 flex flex-col items-center justify-center rounded border border-dashed border-border p-8 text-center",
        className
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle text-muted">
        {icon || <Inbox className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />}
      </div>
      <h3 className="mb-1 font-serif text-base font-semibold text-foreground">{title}</h3>
      <p className="mb-4 max-w-sm text-xs leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
