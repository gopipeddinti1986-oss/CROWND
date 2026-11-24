import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/page";
import HowItWorksPage from "@/app/how-it-works/page";
import ForBrandsPage from "@/app/for-brands/page";
import ForCreatorsPage from "@/app/for-creators/page";
import PricingPage from "@/app/pricing/page";
import FAQPage from "@/app/faq/page";
import GuidesHubPage from "@/app/guides/page";
import AboutPage from "@/app/about/page";
import PrivacyPolicyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import CreatorsDirectoryPage from "@/app/creators/page";
import CampaignsListingPage from "@/app/campaigns/page";

describe("Public Marketing Pages Verification", () => {
  it("renders HomePage with primary hero and call to action", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /from followers to verified/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
  });

  it("renders HowItWorksPage with 4-phase lifecycle", () => {
    render(<HowItWorksPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /how crownd works/i })
    ).toBeInTheDocument();
    expect(screen.getByText("PHASE 01")).toBeInTheDocument();
    expect(screen.getByText("PHASE 04")).toBeInTheDocument();
  });

  it("renders ForBrandsPage with brand value proposition", () => {
    render(<ForBrandsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /pay strictly for verified, retained sales/i })
    ).toBeInTheDocument();
  });

  it("renders ForCreatorsPage with creator value proposition", () => {
    render(<ForCreatorsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /monetize your credibility/i })
    ).toBeInTheDocument();
  });

  it("renders PricingPage with transparent 5% performance merchant terms", () => {
    render(<PricingPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /pay for net results/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/^5%$/)).toBeInTheDocument();
  });

  it("renders FAQPage with categorized questions", () => {
    render(<FAQPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /frequently asked questions/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/what does 'verified purchase' mean on crownd/i)).toBeInTheDocument();
  });

  it("renders GuidesHubPage with 3 core articles", () => {
    render(<GuidesHubPage />);
    expect(screen.getByRole("heading", { level: 1, name: /crownd guides/i })).toBeInTheDocument();
    expect(screen.getByText(/the shift from follower count/i)).toBeInTheDocument();
    expect(screen.getByText(/building authentic community trust/i)).toBeInTheDocument();
    expect(screen.getByText(/demystifying post-delivery attribution/i)).toBeInTheDocument();
  });

  it("renders CreatorsDirectoryPage and filters creators interactively", () => {
    render(<CreatorsDirectoryPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /discover authentic micro-creators/i })
    ).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search by name, handle/i);
    expect(searchInput).toBeInTheDocument();

    // Elena Rostova exists in default list
    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();

    // Type a search query that filters
    fireEvent.change(searchInput, { target: { value: "Elena" } });
    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();
    expect(screen.queryByText("Marcus Chen")).not.toBeInTheDocument();
  });

  it("renders CampaignsListingPage and searches campaigns", () => {
    render(<CampaignsListingPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /explore active brand campaigns/i })
    ).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search by brand name/i);
    expect(searchInput).toBeInTheDocument();

    expect(screen.getByText("Winter Single-Origin Ethiopian Beans Launch")).toBeInTheDocument();
  });

  it("renders AboutPage with mission and principles", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /re-aligning creator commerce/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/1\. performance over vanity/i)).toBeInTheDocument();
  });

  it("renders PrivacyPolicyPage and TermsPage with formal sections", () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();

    render(<TermsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /terms & conditions/i })
    ).toBeInTheDocument();
  });
});
