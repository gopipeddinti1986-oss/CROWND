"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

export function Alert({
  variant = "info",
  title,
  children,
  className,
  dismissible = false,
  onDismiss,
  ...props
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const config = {
    info: {
      bg: "bg-surface-subtle text-foreground border-border",
      icon: <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />,
      label: "Information",
    },
    success: {
      bg: "bg-success-surface text-success-text border-success-border",
      icon: <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />,
      label: "Success",
    },
    warning: {
      bg: "bg-warning-surface text-warning-text border-warning-border",
      icon: <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />,
      label: "Warning",
    },
    danger: {
      bg: "bg-danger-surface text-danger-text border-danger-border",
      icon: <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />,
      label: "Error",
    },
  };

  const current = config[variant];

  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded border p-3 text-sm", current.bg, className)}
      {...props}
    >
      {current.icon}
      <div className="flex-1">
        {title && (
          <h4 className="mb-0.5 text-xs font-semibold uppercase tracking-wider">{title}</h4>
        )}
        <div className="text-xs leading-relaxed">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded p-0.5 text-current opacity-70 hover:opacity-100 focus-visible:outline-accent"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
