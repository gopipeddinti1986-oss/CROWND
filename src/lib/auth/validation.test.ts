import { describe, it, expect } from "vitest";
import { validateEmail, validatePassword, sanitizeRole, sanitizeRedirect } from "./validation";

describe("Auth Validation Utilities", () => {
  describe("validateEmail", () => {
    it("validates correct emails", () => {
      expect(validateEmail("creator@example.com").valid).toBe(true);
      expect(validateEmail("brand.partner@domain.co").valid).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(validateEmail("").valid).toBe(false);
      expect(validateEmail("invalid-email").valid).toBe(false);
      expect(validateEmail("@nodomain.com").valid).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("accepts valid passwords meeting complexity requirements", () => {
      expect(validatePassword("StrongPass123!").valid).toBe(true);
      expect(validatePassword("SecurePass2026").valid).toBe(true);
    });

    it("rejects passwords under 8 characters", () => {
      const res = validatePassword("Short1A");
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/8 characters/i);
    });

    it("rejects passwords without uppercase letter", () => {
      const res = validatePassword("lowercase123");
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/uppercase/i);
    });

    it("rejects passwords without number", () => {
      const res = validatePassword("NoNumberPass");
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/number/i);
    });
  });

  describe("sanitizeRole", () => {
    it("preserves 'brand'", () => {
      expect(sanitizeRole("brand")).toBe("brand");
    });

    it("preserves 'creator'", () => {
      expect(sanitizeRole("creator")).toBe("creator");
    });

    it("clamps 'admin' and unauthorized strings to 'creator' to prevent privilege escalation", () => {
      expect(sanitizeRole("admin")).toBe("creator");
      expect(sanitizeRole("root")).toBe("creator");
      expect(sanitizeRole("superadmin")).toBe("creator");
    });
  });

  describe("sanitizeRedirect", () => {
    it("allows valid internal relative paths", () => {
      expect(sanitizeRedirect("/dashboard")).toBe("/dashboard");
      expect(sanitizeRedirect("/campaigns/winter-launch")).toBe("/campaigns/winter-launch");
    });

    it("blocks open redirect attempts with external protocol", () => {
      expect(sanitizeRedirect("https://evil.com")).toBe("/dashboard");
      expect(sanitizeRedirect("http://attacker.org")).toBe("/dashboard");
    });

    it("blocks protocol-relative URL exploits", () => {
      expect(sanitizeRedirect("//evil.com")).toBe("/dashboard");
    });

    it("blocks javascript: and data: pseudo-protocols", () => {
      expect(sanitizeRedirect("javascript:alert(1)")).toBe("/dashboard");
    });
  });
});
