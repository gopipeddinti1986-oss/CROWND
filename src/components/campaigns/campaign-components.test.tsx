import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CampaignStatusControl } from "./campaign-status-control";
import { BrandApplicationCard } from "./brand-application-card";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/dashboard/campaigns",
}));

describe("Stage B2 Campaign UI Components", () => {
  describe("CampaignStatusControl", () => {
    it("renders Publish button for draft campaigns", () => {
      render(<CampaignStatusControl campaignId="c-123" currentStatus="draft" />);
      expect(screen.getByRole("button", { name: /Publish Campaign/i })).toBeInTheDocument();
    });

    it("renders Pause and Complete buttons for active campaigns", () => {
      render(<CampaignStatusControl campaignId="c-123" currentStatus="active" />);
      expect(screen.getByRole("button", { name: /Pause/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Complete/i })).toBeInTheDocument();
    });

    it("renders Resume button for paused campaigns", () => {
      render(<CampaignStatusControl campaignId="c-123" currentStatus="paused" />);
      expect(screen.getByRole("button", { name: /Resume/i })).toBeInTheDocument();
    });

    it("renders Archive button for completed campaigns", () => {
      render(<CampaignStatusControl campaignId="c-123" currentStatus="completed" />);
      expect(screen.getByRole("button", { name: /Archive/i })).toBeInTheDocument();
    });
  });

  describe("BrandApplicationCard", () => {
    const mockApplication = {
      id: "app-1",
      campaign_id: "c-123",
      creator_id: "cr-1",
      status: "pending",
      pitch: "I love your specialty coffee and produce weekly pour-over reels.",
      proposed_content_plan: "3 Instagram Reels and 1 TikTok video.",
      portfolio_links: ["https://instagram.com/coffee_creator"],
      applied_at: new Date().toISOString(),
      creators: {
        id: "cr-1",
        display_name: "Alex Brewer",
        handle: "alex_brews",
        profile_photo_url: null,
        primary_niche: "Specialty Coffee",
        primary_platform: "Instagram",
        audience_size: 45000,
        bio: "Specialty coffee enthusiast and home brewer.",
      },
    };

    it("renders creator details and pitch accurately", () => {
      render(<BrandApplicationCard application={mockApplication} />);

      expect(screen.getByText("Alex Brewer")).toBeInTheDocument();
      expect(screen.getByText("@alex_brews")).toBeInTheDocument();
      expect(screen.getByText(/45,000 reach/)).toBeInTheDocument();
      expect(screen.getByText("Specialty Coffee")).toBeInTheDocument();
      expect(screen.getByText(/I love your specialty coffee/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Accept & Generate Link/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Decline/i })).toBeInTheDocument();
    });
  });
});
