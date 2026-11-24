import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      primary:
        "bg-accent text-accent-foreground hover:bg-accent-hover active:opacity-90 border border-transparent shadow-hairline",
      secondary:
        "bg-surface text-foreground hover:bg-surface-subtle border border-border shadow-hairline",
      outline: "bg-transparent text-foreground hover:bg-surface-subtle border border-border",
      ghost: "bg-transparent text-muted hover:text-foreground hover:bg-surface-subtle",
      danger:
        "bg-danger text-white hover:opacity-90 active:opacity-95 border border-transparent shadow-hairline",
      link: "bg-transparent text-accent hover:underline p-0 h-auto font-normal rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5 min-h-[30px]",
      md: "text-sm px-4 py-2 gap-2 min-h-[38px]",
      lg: "text-base px-5 py-2.5 gap-2.5 min-h-[44px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          variant !== "link" && sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
