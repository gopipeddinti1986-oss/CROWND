"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/creators", label: "Creators" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/pricing", label: "Pricing" },
    { href: "/guides", label: "Guides" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="bg-surface/95 supports-[backdrop-filter]:bg-surface/80 sticky top-0 z-40 w-full border-b border-border backdrop-blur">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground focus-visible:outline-accent"
          >
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              CROWND<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-5 text-xs font-medium text-muted md:flex"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground focus-visible:outline-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-2 py-1 text-xs font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-accent"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 rounded bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-accent"
          >
            Get Started
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-1.5 text-foreground hover:bg-surface-subtle focus-visible:outline-accent"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="space-y-3 border-b border-border bg-surface px-4 py-4 md:hidden">
          <nav
            className="flex flex-col space-y-2 text-sm font-medium"
            aria-label="Mobile Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 border-t border-border pt-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full rounded border border-border py-2 text-center text-xs font-medium text-foreground hover:bg-surface-subtle"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full rounded bg-accent py-2 text-center text-xs font-medium text-accent-foreground hover:bg-accent-hover"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
