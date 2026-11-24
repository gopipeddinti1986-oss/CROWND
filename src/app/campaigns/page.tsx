"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getActiveCampaignsAction } from "@/lib/campaigns/actions";

// Sample active campaigns fallback for Stage preview demonstration
const SAMPLE_CAMPAIGNS = [
  {
    id: "camp-1",
    brand: "Aura Roasters",
    title: "Winter Single-Origin Ethiopian Beans Launch",
    niche: "Specialty Coffee",
    commission: "15% per sale",
    commissionType: "percentage",
    returnWindow: 14,
    budget: "$5,000",
    description:
      "Showcase our direct-trade Ethiopian Yirgacheffe harvest. We are seeking manual brewing creators who appreciate floral notes and complex acidity.",
    requirements: "Focus on morning routine or pour-over preparation; authentic honest review.",
  },
  {
    id: "camp-2",
    brand: "ErgoForm Works",
    title: "Split Mechanical Keyboard & Desk Mat Showcase",
    niche: "Ergonomic Tech",
    commission: "18% per sale",
    commissionType: "percentage",
    returnWindow: 30,
    budget: "$8,500",
    description:
      "Introducing our CNC-anodized split ergonomic mechanical keyboard. 30-day money-back guarantee for customers.",
    requirements: "Desk setup, programming workflow, or ergonomics review.",
  },
  {
    id: "camp-3",
    brand: "Terra Pure Goods",
    title: "Solid Dish Soap & Natural Loofah Household Kit",
    niche: "Sustainable Living",
    commission: "20% per sale",
    commissionType: "percentage",
    returnWindow: 14,
    budget: "$3,000",
    description:
      "Zero-plastic concentrated kitchen cleaning bar with compostable cellulose sponges. High repeat purchase rate.",
    requirements: "Eco-friendly lifestyle, low-waste home tips, or practical kitchen hacks.",
  },
  {
    id: "camp-4",
    brand: "Komorebi Tea Labs",
    title: "Ceremonial Grade Uji Matcha Spring Harvest",
    niche: "Specialty Coffee",
    commission: "$12.00 flat per tin",
    commissionType: "fixed",
    returnWindow: 14,
    budget: "$4,200",
    description:
      "First-harvest ceremonial matcha stone-ground in Kyoto. Vibrant emerald color and rich umami without bitterness.",
    requirements: "Whisking technique, iced matcha latte recipes, or mindfulness morning rituals.",
  },
  {
    id: "camp-5",
    brand: "Aether Sound",
    title: "Open-Ear Wireless Conduction Headphones",
    niche: "Wellness",
    commission: "16% per sale",
    commissionType: "percentage",
    returnWindow: 30,
    budget: "$12,000",
    description:
      "Lightweight bone-conduction headphones designed for outdoor runners and cyclists prioritizing situational awareness.",
    requirements: "Outdoor running, cycling commute, or active sports lifestyle.",
  },
];

export default function CampaignsListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [liveCampaigns, setLiveCampaigns] = useState<any[]>([]);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await getActiveCampaignsAction();
        if (res.success && res.campaigns && res.campaigns.length > 0) {
          const mapped = res.campaigns.map((c: any) => ({
            id: c.id,
            brand: c.brands?.company_name || "Verified Brand",
            title: c.title,
            niche: c.category || "General",
            commission:
              c.commission_type === "percentage"
                ? `${c.commission_rate}% per sale`
                : `$${c.commission_rate} flat per sale`,
            commissionType: c.commission_type,
            returnWindow: c.return_window_days || 14,
            budget: `$${Number(c.budget || 0).toLocaleString()}`,
            description: c.description,
            requirements: c.deliverable_guidelines || "Authentic content alignment.",
            isLive: true,
          }));
          setLiveCampaigns(mapped);
        }
      } catch (e) {
        console.error("Failed to load live campaigns", e);
      }
    }
    loadCampaigns();
  }, []);

  const displayedList = useMemo(() => {
    const source = liveCampaigns.length > 0 ? liveCampaigns : SAMPLE_CAMPAIGNS;
    return source.filter((camp) => {
      const matchesSearch =
        camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesNiche =
        selectedNiche === "all" || camp.niche.toLowerCase().includes(selectedNiche.toLowerCase());

      return matchesSearch && matchesNiche;
    });
  }, [liveCampaigns, searchQuery, selectedNiche]);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Campaign Listings</Badge>
              <span className="text-xs text-muted">Performance Brand Collaborations</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore active brand campaigns
            </h1>
            <p className="text-xs leading-relaxed text-muted sm:text-sm">
              Discover verified performance campaigns with guaranteed payouts and transparent
              commercial terms. Apply to promote products you genuinely value.
            </p>
          </div>
        </div>
      </section>

      {/* Demo / Live Notice Banner */}
      <div className="border-b border-border bg-surface-subtle py-2.5">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 text-xs text-muted sm:px-6">
          <span>
            <strong className="text-foreground">Status:</strong>{" "}
            {liveCampaigns.length > 0
              ? `Displaying ${liveCampaigns.length} live verified brand campaigns.`
              : "Displaying curated sample campaigns for preview demonstration."}
          </span>
          <span className="hidden text-[11px] text-muted-subtle sm:inline">
            Verified post-delivery return clearance active.
          </span>
        </div>
      </div>

      {/* Campaigns Area */}
      <section className="py-12">
        <div className="mx-auto max-w-content space-y-8 px-4 sm:px-6">
          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              id="search-campaigns"
              placeholder="Search by brand name, product, or campaign title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              id="filter-campaign-niche"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              options={[
                { value: "all", label: "All Categories" },
                { value: "coffee", label: "Specialty Coffee & Beverage" },
                { value: "tech", label: "Ergonomic Tech & Audio" },
                { value: "sustainable", label: "Sustainable Living" },
                { value: "wellness", label: "Wellness & Fitness" },
              ]}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted">
            <span>Showing {displayedList.length} campaigns</span>
            <span>All commissions unlock after customer return window</span>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {displayedList.map((camp) => (
              <div
                key={camp.id}
                className="hover:border-accent/40 rounded border border-border bg-surface p-6 shadow-hairline transition-colors"
              >
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-accent">{camp.brand}</span>
                      <span aria-hidden="true" className="text-muted">
                        •
                      </span>
                      <Badge variant="neutral" size="sm">
                        {camp.niche}
                      </Badge>
                      {camp.isLive && (
                        <Badge variant="success" size="sm">
                          Live
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground">{camp.title}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 text-right">
                    <span className="text-xs font-medium text-muted">Reward:</span>
                    <span className="font-serif text-base font-bold text-accent">
                      {camp.commission}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 items-center gap-6 pt-4 md:grid-cols-12">
                  <div className="space-y-2 text-xs leading-relaxed text-muted md:col-span-8">
                    <p>{camp.description}</p>
                    <p className="text-[11px] text-muted-subtle">
                      <strong>Requirements:</strong> {camp.requirements}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-end gap-4 text-xs sm:flex-row md:col-span-4">
                    <div className="hidden text-right sm:block">
                      <span className="block text-[10px] uppercase text-muted">Return Window</span>
                      <strong className="text-foreground">{camp.returnWindow} Days</strong>
                    </div>

                    <Link href={camp.isLive ? `/campaigns/${camp.id}` : "/signup"}>
                      <Button variant="primary" size="md">
                        {camp.isLive ? "View & Apply" : "Apply to Campaign"}
                        <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
