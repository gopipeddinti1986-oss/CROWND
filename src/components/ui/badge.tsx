import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-surface-subtle text-foreground border-border",
    accent: "bg-accent-subtle text-accent border-accent/30",
    success: "bg-success-surface text-success-text border-success-border",
    warning: "bg-warning-surface text-warning-text border-warning-border",
    danger: "bg-danger-surface text-danger-text border-danger-border",
  };

  const sizeStyles = {
    sm: "text-[11px] px-1.5 py-0.5",
    md: "text-xs px-2.5 py-0.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
