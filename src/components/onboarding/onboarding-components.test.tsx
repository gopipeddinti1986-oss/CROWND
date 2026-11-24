import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandOnboarding } from "./brand-onboarding";
import { CreatorOnboarding } from "./creator-onboarding";
import { AssetUpload } from "./asset-upload";

describe("Stage B1 Onboarding Components", () => {
  describe("BrandOnboarding", () => {
    it("renders step 1 inputs for company basics", () => {
      render(
        <BrandOnboarding
          initialBrand={{
            id: "b1",
            profile_id: "p1",
            company_name: "Acme Atelier",
            website: "https://acme.com",
            industry: "Fashion & Apparel",
            company_size: "1-10",
            description: null,
            logo_url: null,
            location: null,
            country: "United States",
            social_links: {},
            business_contact: {},
            onboarding_completed: false,
            onboarding_step: 1,
            verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }}
        />
      );

      expect(screen.getByText("Brand Onboarding • Step 1 of 4")).toBeInTheDocument();
      expect(screen.getByLabelText(/Company \/ Brand Name/i)).toHaveValue("Acme Atelier");
      expect(screen.getByLabelText(/Website \/ Online Store/i)).toHaveValue("https://acme.com");
      expect(screen.getByRole("button", { name: /Continue/i })).toBeInTheDocument();
    });
  });

  describe("CreatorOnboarding", () => {
    it("renders step 1 inputs for creator identity", () => {
      render(
        <CreatorOnboarding
          initialCreator={{
            id: "c1",
            profile_id: "p2",
            handle: "maya_style",
            display_name: "Maya Style",
            profile_photo_url: null,
            primary_niche: "Fashion & Style",
            categories: ["Fashion & Style"],
            bio: "Curating high-end sustainable aesthetic pieces.",
            location: "New York",
            primary_platform: "Instagram",
            platforms: {},
            portfolio_items: [],
            collaboration_preferences: {},
            languages: ["English"],
            audience_size: 25000,
            engagement_rate: 4.5,
            onboarding_completed: false,
            onboarding_step: 1,
            verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }}
        />
      );

      expect(screen.getByText("Creator Onboarding • Step 1 of 4")).toBeInTheDocument();
      expect(screen.getByLabelText(/Display Name/i)).toHaveValue("Maya Style");
      expect(screen.getByLabelText(/Creator Handle/i)).toHaveValue("maya_style");
      expect(screen.getByLabelText(/Creator Bio/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continue/i })).toBeInTheDocument();
    });
  });

  describe("AssetUpload", () => {
    it("renders drag-and-drop upload zone and guidelines", () => {
      const handleComplete = vi.fn();
      render(
        <AssetUpload
          label="Profile Photo"
          description="Upload avatar"
          bucket="avatars"
          onUploadComplete={handleComplete}
        />
      );

      expect(screen.getByText("Profile Photo")).toBeInTheDocument();
      expect(screen.getByText(/Click to upload or drag & drop/i)).toBeInTheDocument();
      expect(screen.getByText(/PNG, JPG, WebP up to 5MB/i)).toBeInTheDocument();
    });
  });
});
