import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GUIDES } from "@/lib/content/guides";

export const metadata: Metadata = {
  title: "Creator & Brand Guides — Performance Commerce Strategy",
  description:
    "Original, practical guides on micro-creator partnerships, post-delivery attribution, audience trust preservation, and performance marketing for independent brands.",
};

export default function GuidesHubPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Educational Resources</Badge>
              <span className="text-xs text-muted">Original Analysis &amp; Field Guides</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              CROWND Guides &amp; Insights
            </h1>
            <p className="text-xs leading-relaxed text-muted sm:text-sm">
              In-depth research and actionable strategies on performance creator commerce, return
              clearance windows, community trust, and sustainable acquisition.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-content space-y-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {GUIDES.map((guide) => (
              <div
                key={guide.slug}
                className="hover:border-accent/40 flex flex-col justify-between rounded border border-border bg-surface p-6 shadow-hairline transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <Badge variant="neutral" size="sm">
                      {guide.category}
                    </Badge>
                    <span>{guide.readTime}</span>
                  </div>

                  <h2 className="font-serif text-base font-bold leading-snug text-foreground">
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {guide.title}
                    </Link>
                  </h2>

                  <p className="text-xs leading-relaxed text-muted">{guide.summary}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-[11px] text-muted-subtle">{guide.date}</span>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    Read Guide
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
