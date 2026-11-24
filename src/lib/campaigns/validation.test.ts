import { describe, it, expect } from "vitest";
import {
  generateSlug,
  validateCampaignTitle,
  validateCampaignDescription,
  validateCampaignBudget,
  validateCommissionRate,
  validateReturnWindow,
  validateCampaignDates,
  validateFollowerBounds,
  validateCampaignStatusTransition,
} from "./validation";

describe("Campaign Validation Suite", () => {
  describe("generateSlug", () => {
    it("generates a clean URL slug from title", () => {
      const slug = generateSlug("Winter Single-Origin Launch 2026!");
      expect(slug).toMatch(/^winter-single-origin-launch-2026-[a-z0-9]{5}$/);
    });

    it("handles multiple special characters and extra spaces", () => {
      const slug = generateSlug("  Ergonomic & Split --- Keyboard @ Night!  ");
      expect(slug).toMatch(/^ergonomic-split-keyboard-night-[a-z0-9]{5}$/);
    });
  });

  describe("validateCampaignTitle", () => {
    it("accepts valid title between 5 and 100 characters", () => {
      const res = validateCampaignTitle("Spring Specialty Coffee Showcase");
      expect(res.valid).toBe(true);
    });

    it("rejects too short title", () => {
      const res = validateCampaignTitle("Hey");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("at least 5");
    });

    it("rejects excessively long title", () => {
      const res = validateCampaignTitle("A".repeat(105));
      expect(res.valid).toBe(false);
      expect(res.error).toContain("exceed 100");
    });
  });

  describe("validateCampaignDescription", () => {
    it("accepts valid description with at least 20 chars", () => {
      const res = validateCampaignDescription(
        "This is an authentic product collaboration for creators passionate about craft brew."
      );
      expect(res.valid).toBe(true);
    });

    it("rejects description shorter than 20 characters", () => {
      const res = validateCampaignDescription("Short bio");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("at least 20");
    });
  });

  describe("validateCampaignBudget", () => {
    it("accepts valid positive budget", () => {
      expect(validateCampaignBudget(5000).valid).toBe(true);
      expect(validateCampaignBudget(100).valid).toBe(true);
    });

    it("rejects zero or negative budget", () => {
      expect(validateCampaignBudget(0).valid).toBe(false);
      expect(validateCampaignBudget(-50).valid).toBe(false);
    });

    it("rejects non-numeric budget", () => {
      expect(validateCampaignBudget(NaN).valid).toBe(false);
    });
  });

  describe("validateCommissionRate", () => {
    it("validates percentage commission between 1% and 100%", () => {
      expect(validateCommissionRate(15, "percentage").valid).toBe(true);
      expect(validateCommissionRate(0.5, "percentage").valid).toBe(false);
      expect(validateCommissionRate(101, "percentage").valid).toBe(false);
    });

    it("validates fixed flat fee commission", () => {
      expect(validateCommissionRate(25, "fixed").valid).toBe(true);
      expect(validateCommissionRate(0, "fixed").valid).toBe(false);
      expect(validateCommissionRate(-10, "fixed").valid).toBe(false);
    });
  });

  describe("validateReturnWindow", () => {
    it("accepts window between 14 and 90 days", () => {
      expect(validateReturnWindow(14).valid).toBe(true);
      expect(validateReturnWindow(30).valid).toBe(true);
      expect(validateReturnWindow(90).valid).toBe(true);
    });

    it("rejects windows shorter than 14 days or longer than 90 days", () => {
      expect(validateReturnWindow(7).valid).toBe(false);
      expect(validateReturnWindow(120).valid).toBe(false);
    });
  });

  describe("validateFollowerBounds", () => {
    it("accepts valid min and max follower thresholds", () => {
      expect(validateFollowerBounds(1000, 50000).valid).toBe(true);
      expect(validateFollowerBounds(0, null).valid).toBe(true);
    });

    it("rejects negative follower values", () => {
      expect(validateFollowerBounds(-5, null).valid).toBe(false);
    });

    it("rejects min followers higher than max followers", () => {
      expect(validateFollowerBounds(10000, 5000).valid).toBe(false);
    });
  });

  describe("validateCampaignDates", () => {
    it("accepts application deadline before content deadline", () => {
      const res = validateCampaignDates({
        application_deadline: "2026-03-01",
        content_deadline: "2026-03-15",
      });
      expect(res.valid).toBe(true);
    });

    it("rejects application deadline after content deadline", () => {
      const res = validateCampaignDates({
        application_deadline: "2026-03-20",
        content_deadline: "2026-03-10",
      });
      expect(res.valid).toBe(false);
      expect(res.error).toContain("cannot be after content deadline");
    });
  });

  describe("validateCampaignStatusTransition", () => {
    it("allows standard valid transitions", () => {
      expect(validateCampaignStatusTransition("draft", "active").allowed).toBe(true);
      expect(validateCampaignStatusTransition("active", "paused").allowed).toBe(true);
      expect(validateCampaignStatusTransition("paused", "active").allowed).toBe(true);
      expect(validateCampaignStatusTransition("active", "completed").allowed).toBe(true);
      expect(validateCampaignStatusTransition("completed", "archived").allowed).toBe(true);
    });

    it("blocks illegal transitions", () => {
      expect(validateCampaignStatusTransition("draft", "completed").allowed).toBe(false);
      expect(validateCampaignStatusTransition("archived", "active").allowed).toBe(false);
      expect(validateCampaignStatusTransition("completed", "draft").allowed).toBe(false);
    });
  });
});
