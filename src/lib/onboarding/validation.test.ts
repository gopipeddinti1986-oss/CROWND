import { describe, it, expect } from "vitest";
import {
  validateCompanyName,
  validateWebsite,
  validateDescription,
  validateCreatorHandle,
  validateDisplayName,
  validateCategories,
  validateAudienceSize,
  validateUploadedFile,
} from "./validation";
import { calculateBrandCompletion, calculateCreatorCompletion } from "./completion";

describe("Stage B1 Onboarding Validation", () => {
  describe("validateCompanyName", () => {
    it("rejects empty names", () => {
      expect(validateCompanyName("").valid).toBe(false);
      expect(validateCompanyName("   ").valid).toBe(false);
    });

    it("rejects names under 2 characters", () => {
      expect(validateCompanyName("A").valid).toBe(false);
    });

    it("rejects names over 100 characters", () => {
      expect(validateCompanyName("A".repeat(101)).valid).toBe(false);
    });

    it("accepts valid company names", () => {
      expect(validateCompanyName("Acme Corp").valid).toBe(true);
      expect(validateCompanyName("Studio 42").valid).toBe(true);
    });
  });

  describe("validateWebsite", () => {
    it("accepts empty or undefined values as optional", () => {
      expect(validateWebsite("").valid).toBe(true);
      expect(validateWebsite(undefined).valid).toBe(true);
      expect(validateWebsite(null).valid).toBe(true);
    });

    it("accepts standard URLs", () => {
      expect(validateWebsite("https://example.com").valid).toBe(true);
      expect(validateWebsite("example.com").valid).toBe(true);
      expect(validateWebsite("http://store.acme.co/shop").valid).toBe(true);
    });

    it("rejects invalid domains or non-web protocols", () => {
      expect(validateWebsite("ftp://example.com").valid).toBe(false);
      expect(validateWebsite("not-a-domain").valid).toBe(false);
    });
  });

  describe("validateDescription", () => {
    it("enforces minimum character length", () => {
      expect(validateDescription("Short").valid).toBe(false);
      expect(
        validateDescription(
          "This is a sufficiently long description that satisfies the requirement."
        ).valid
      ).toBe(true);
    });

    it("enforces maximum length", () => {
      expect(validateDescription("A".repeat(1001)).valid).toBe(false);
    });
  });

  describe("validateCreatorHandle", () => {
    it("rejects short or empty handles", () => {
      expect(validateCreatorHandle("").valid).toBe(false);
      expect(validateCreatorHandle("ab").valid).toBe(false);
    });

    it("rejects handles with special characters other than underscore", () => {
      expect(validateCreatorHandle("handle-with-dashes").valid).toBe(false);
      expect(validateCreatorHandle("handle with spaces").valid).toBe(false);
      expect(validateCreatorHandle("handle@name").valid).toBe(false);
    });

    it("accepts valid alphanumeric handles", () => {
      expect(validateCreatorHandle("alex_creator").valid).toBe(true);
      expect(validateCreatorHandle("creator123").valid).toBe(true);
    });
  });

  describe("validateDisplayName", () => {
    it("validates length bounds", () => {
      expect(validateDisplayName("A").valid).toBe(false);
      expect(validateDisplayName("Alex Morgan").valid).toBe(true);
      expect(validateDisplayName("A".repeat(51)).valid).toBe(false);
    });
  });

  describe("validateCategories", () => {
    it("requires at least one category", () => {
      expect(validateCategories([]).valid).toBe(false);
    });

    it("allows up to 5 categories", () => {
      expect(validateCategories(["Tech", "Gaming"]).valid).toBe(true);
      expect(validateCategories(["1", "2", "3", "4", "5"]).valid).toBe(true);
      expect(validateCategories(["1", "2", "3", "4", "5", "6"]).valid).toBe(false);
    });
  });

  describe("validateAudienceSize", () => {
    it("validates positive audience counts", () => {
      expect(validateAudienceSize(0).valid).toBe(true);
      expect(validateAudienceSize(15000).valid).toBe(true);
      expect(validateAudienceSize(-10).valid).toBe(false);
      expect(validateAudienceSize("invalid").valid).toBe(false);
    });
  });

  describe("validateUploadedFile", () => {
    it("rejects empty files", () => {
      expect(validateUploadedFile({ size: 0, type: "image/png" }).valid).toBe(false);
    });

    it("enforces avatar file size limits (5MB)", () => {
      expect(
        validateUploadedFile({ size: 6 * 1024 * 1024, type: "image/png" }, "avatar").valid
      ).toBe(false);
      expect(
        validateUploadedFile({ size: 2 * 1024 * 1024, type: "image/png" }, "avatar").valid
      ).toBe(true);
    });

    it("enforces logo file size limits (10MB)", () => {
      expect(validateUploadedFile({ size: 8 * 1024 * 1024, type: "image/png" }, "logo").valid).toBe(
        true
      );
      expect(
        validateUploadedFile({ size: 11 * 1024 * 1024, type: "image/png" }, "logo").valid
      ).toBe(false);
    });

    it("enforces MIME type restrictions", () => {
      expect(validateUploadedFile({ size: 1000, type: "application/pdf" }, "avatar").valid).toBe(
        false
      );
      expect(validateUploadedFile({ size: 1000, type: "image/svg+xml" }, "avatar").valid).toBe(
        false
      );
      expect(validateUploadedFile({ size: 1000, type: "image/svg+xml" }, "logo").valid).toBe(true);
      expect(validateUploadedFile({ size: 1000, type: "image/webp" }, "avatar").valid).toBe(true);
    });
  });

  describe("Profile Completion Calculations", () => {
    it("computes 0% for empty profiles", () => {
      expect(calculateBrandCompletion(null).percentage).toBe(0);
      expect(calculateCreatorCompletion(null).percentage).toBe(0);
    });

    it("computes progressive completion for brands", () => {
      const partial = calculateBrandCompletion({
        company_name: "Acme",
        industry: "Fashion & Apparel",
      });
      expect(partial.percentage).toBe(35);
      expect(partial.completedFields).toContain("Company Name");
      expect(partial.completedFields).toContain("Industry");
      expect(partial.missingFields).toContain("Website");

      const complete = calculateBrandCompletion({
        company_name: "Acme",
        website: "https://acme.com",
        industry: "Fashion & Apparel",
        description: "A premium sustainable apparel brand for conscious creators.",
        location: "New York, USA",
        logo_url: "https://cdn.example.com/logo.png",
        social_links: { instagram: "https://instagram.com/acme" },
      });
      expect(complete.percentage).toBe(100);
      expect(complete.missingFields.length).toBe(0);
    });

    it("computes progressive completion for creators", () => {
      const partial = calculateCreatorCompletion({
        display_name: "Alex",
        handle: "alex_travels",
      });
      expect(partial.percentage).toBe(20);

      const complete = calculateCreatorCompletion({
        display_name: "Alex",
        handle: "alex_travels",
        primary_niche: "Travel & Adventure",
        categories: ["Travel", "Photography"],
        bio: "Full-time travel photographer and storyteller across Europe.",
        primary_platform: "Instagram",
        profile_photo_url: "https://cdn.example.com/avatar.jpg",
        location: "Berlin, Germany",
        languages: ["English", "German"],
      });
      expect(complete.percentage).toBe(100);
      expect(complete.missingFields.length).toBe(0);
    });
  });
});
