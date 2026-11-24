"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-8 w-20 rounded border border-border bg-surface ${className}`}
        aria-hidden="true"
      />
    );
  }

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const getLabel = () => {
    if (theme === "system") return "Theme: System";
    return theme === "dark" ? "Theme: Dark" : "Theme: Light";
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-accent ${className}`}
      aria-label={`${getLabel()}. Click to change.`}
      title={`${getLabel()} (Click to toggle)`}
    >
      {theme === "system" ? (
        <Laptop className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
      ) : resolvedTheme === "dark" ? (
        <Moon className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
      ) : (
        <Sun className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
      )}
      <span className="capitalize">{theme}</span>
    </button>
  );
}
