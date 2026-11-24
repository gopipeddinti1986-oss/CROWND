import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface text-muted">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="font-serif text-lg font-bold text-foreground">
              CROWND<span className="text-accent">.</span>
            </Link>
            <p className="text-xs leading-relaxed text-muted">
              Performance-based creator-commerce. Micro-creators drive authentic sales; brands pay
              strictly for verified results.
            </p>
            <p className="font-serif text-xs italic text-accent">
              &ldquo;From Followers to Real Results.&rdquo;
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="transition-colors hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/creators" className="transition-colors hover:text-foreground">
                  Creators Directory
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="transition-colors hover:text-foreground">
                  Explore Campaigns
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-foreground">
                  Pricing & Fees
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/guides" className="transition-colors hover:text-foreground">
                  Creator & Brand Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-foreground">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground">
                  About CROWND
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-foreground">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <span className="block pt-1 text-[11px] text-muted-subtle">
                  Verified post-delivery attribution. Zero upfront risk.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs sm:flex-row">
          <p>© {currentYear} CROWND Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>WCAG 2.2 AA Compliant</span>
            <span aria-hidden="true">•</span>
            <span>Server-side Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
