import { describe, it, expect } from "vitest";
import { normalizeUrl } from "./env";

describe("Supabase Environment Utilities", () => {
  it("normalizes clean URLs correctly", () => {
    expect(normalizeUrl("https://example.supabase.co")).toBe("https://example.supabase.co");
  });

  it("trims surrounding whitespace and quotes", () => {
    expect(normalizeUrl(' "https://example.supabase.co" ')).toBe("https://example.supabase.co");
    expect(normalizeUrl(" 'https://example.supabase.co' ")).toBe("https://example.supabase.co");
  });

  it("fixes accidental duplicate https: prefix", () => {
    expect(normalizeUrl("https:https://example.supabase.co")).toBe("https://example.supabase.co");
  });

  it("handles empty or undefined values safely", () => {
    expect(normalizeUrl("")).toBe("");
    expect(normalizeUrl(undefined)).toBe("");
  });

  it("strips trailing /rest/v1 and trailing slashes", () => {
    expect(normalizeUrl("https://example.supabase.co/rest/v1/")).toBe(
      "https://example.supabase.co"
    );
    expect(normalizeUrl("https://example.supabase.co/rest/v1")).toBe("https://example.supabase.co");
    expect(normalizeUrl("https://example.supabase.co/")).toBe("https://example.supabase.co");
  });
});
