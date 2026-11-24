"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Sample verified creator profiles for Stage A directory
const SAMPLE_CREATORS = [
  {
    id: "cr-1",
    handle: "@elena_brews",
    name: "Elena Rostova",
    niche: "Coffee & Food",
    platform: "Instagram",
    audience: 8400,
    engagement: 6.8,
    bio: "Manual pour-over enthusiast, specialty roaster reviews, and minimalist kitchen aesthetics.",
    verified: true,
  },
  {
    id: "cr-2",
    handle: "@marcus_minimal",
    name: "Marcus Chen",
    niche: "Tech & Gadgets",
    platform: "YouTube",
    audience: 24500,
    engagement: 5.2,
    bio: "In-depth reviews of ergonomic desk setups, mechanical keyboards, and sustainable consumer tech.",
    verified: true,
  },
  {
    id: "cr-3",
    handle: "@clara_greenhome",
    name: "Clara Vance",
    niche: "Sustainable Lifestyle",
    platform: "Instagram",
    audience: 14200,
    engagement: 7.4,
    bio: "Zero-waste living, non-toxic home goods, and seasonal organic gardening tutorials.",
    verified: true,
  },
  {
    id: "cr-4",
    handle: "@devon_moves",
    name: "Devon Miller",
    niche: "Fitness & Wellness",
    platform: "TikTok",
    audience: 32000,
    engagement: 8.1,
    bio: "Calisthenics routines, mobility training, and clean whole-food supplementation.",
    verified: true,
  },
  {
    id: "cr-5",
    handle: "@talia_reads",
    name: "Talia Washington",
    niche: "Home & Design",
    platform: "Instagram",
    audience: 5600,
    engagement: 9.3,
    bio: "Quiet morning reading corners, architectural book reviews, and warm lighting curation.",
    verified: true,
  },
  {
    id: "cr-6",
    handle: "@arthur_craft",
    name: "Arthur Pendelton",
    niche: "Coffee & Food",
    platform: "YouTube",
    audience: 18900,
    engagement: 6.1,
    bio: "Artisanal bread making, fermented foods, and heirloom kitchenware craftsmanship.",
    verified: true,
  },
];

export default function CreatorsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("engagement");

  const filteredCreators = useMemo(() => {
    return SAMPLE_CREATORS.filter((creator) => {
      const matchesSearch =
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesNiche =
        selectedNiche === "all" ||
        creator.niche.toLowerCase().includes(selectedNiche.toLowerCase());

      const matchesPlatform =
        selectedPlatform === "all" ||
        creator.platform.toLowerCase() === selectedPlatform.toLowerCase();

      return matchesSearch && matchesNiche && matchesPlatform;
    }).sort((a, b) => {
      if (sortBy === "engagement") return b.engagement - a.engagement;
      if (sortBy === "audience") return b.audience - a.audience;
      return 0;
    });
  }, [searchQuery, selectedNiche, selectedPlatform, sortBy]);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Creators Directory</Badge>
              <span className="text-xs text-muted">Curated Micro-Creators</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Discover authentic micro-creators
            </h1>
            <p className="text-xs leading-relaxed text-muted sm:text-sm">
              Explore verified creators with dedicated community trust. Partner on performance terms
              where creators earn only for confirmed customer orders.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Notice Banner */}
      <div className="border-b border-border bg-surface-subtle py-2.5">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 text-xs text-muted sm:px-6">
          <span>
            <strong className="text-foreground">Notice:</strong> Displaying curated sample creator
            profiles for Stage A demonstration.
          </span>
          <span className="hidden text-[11px] text-muted-subtle sm:inline">
            Direct creator registration is active.
          </span>
        </div>
      </div>

      {/* Directory & Filters Area */}
      <section className="py-12">
        <div className="mx-auto max-w-content space-y-8 px-4 sm:px-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Input
                id="search-creators"
                placeholder="Search by name, handle, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <Select
                id="filter-niche"
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                options={[
                  { value: "all", label: "All Niches" },
                  { value: "coffee", label: "Coffee & Food" },
                  { value: "tech", label: "Tech & Gadgets" },
                  { value: "sustainable", label: "Sustainable Lifestyle" },
                  { value: "fitness", label: "Fitness & Wellness" },
                  { value: "home", label: "Home & Design" },
                ]}
              />
            </div>

            <div>
              <Select
                id="filter-platform"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                options={[
                  { value: "all", label: "All Platforms" },
                  { value: "instagram", label: "Instagram" },
                  { value: "youtube", label: "YouTube" },
                  { value: "tiktok", label: "TikTok" },
                ]}
              />
            </div>

            <div>
              <Select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: "engagement", label: "Sort: Highest Engagement" },
                  { value: "audience", label: "Sort: Audience Size" },
                ]}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Showing {filteredCreators.length} verified creators</span>
            <span>Zero vanity metrics • Verified post-delivery attribution</span>
          </div>

          {/* Creators Cards Grid */}
          {filteredCreators.length === 0 ? (
            <div className="rounded border border-dashed border-border p-12 text-center text-xs text-muted">
              No creators found matching your criteria. Try adjusting your search query or filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex flex-col justify-between space-y-4 rounded border border-border bg-surface p-5 shadow-hairline"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-base font-bold text-foreground">
                          {creator.name}
                        </h3>
                        <span className="text-xs font-medium text-accent">{creator.handle}</span>
                      </div>
                      <Badge variant="accent" size="sm">
                        {creator.platform}
                      </Badge>
                    </div>

                    <p className="line-clamp-2 text-xs leading-relaxed text-muted">{creator.bio}</p>

                    <div className="flex items-center gap-2">
                      <Badge variant="neutral" size="sm">
                        {creator.niche}
                      </Badge>
                      {creator.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-success-text">
                          <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                    <div>
                      <span className="block text-[10px] uppercase text-muted">Audience</span>
                      <strong className="text-foreground">
                        {creator.audience.toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase text-muted">
                        Avg. Engagement
                      </span>
                      <strong className="text-accent">{creator.engagement}%</strong>
                    </div>

                    <Link href="/signup">
                      <Button variant="secondary" size="sm">
                        Invite
                        <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
