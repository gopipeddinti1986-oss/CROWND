import { describe, it, expect } from "vitest";
import { calculateDecimalCommission } from "./engine";
import {
  hashIp,
  detectDeviceCategory,
  detectBot,
  sanitizeDestinationUrl,
} from "@/lib/tracking/utils";

describe("Attribution & Financial Precision Engine", () => {
  describe("calculateDecimalCommission", () => {
    it("calculates percentage commissions with integer-cent decimal safety", () => {
      // 15% on $100.00 = $15.00
      expect(calculateDecimalCommission(100.0, 15, "percentage")).toBe(15.0);

      // 15% on $19.99 = 2.9985 -> rounds safely to 3.00
      expect(calculateDecimalCommission(19.99, 15, "percentage")).toBe(3.0);

      // 10% on $49.95 = 4.995 -> rounds safely to 5.00
      expect(calculateDecimalCommission(49.95, 10, "percentage")).toBe(5.0);

      // 12.5% on $80.00 = 10.00
      expect(calculateDecimalCommission(80.0, 12.5, "percentage")).toBe(10.0);
    });

    it("calculates fixed commissions correctly regardless of order size", () => {
      expect(calculateDecimalCommission(150.0, 25.0, "fixed")).toBe(25.0);
      expect(calculateDecimalCommission(45.0, 12.5, "fixed")).toBe(12.5);
    });

    it("safely handles 0 order amounts or 0 commission rates", () => {
      expect(calculateDecimalCommission(0, 15, "percentage")).toBe(0);
      expect(calculateDecimalCommission(100, 0, "percentage")).toBe(0);
      expect(calculateDecimalCommission(-50, 15, "percentage")).toBe(0);
    });
  });

  describe("Tracking Utilities", () => {
    describe("hashIp", () => {
      it("creates a consistent SHA-256 hash substring without revealing raw IP", () => {
        const hash1 = hashIp("192.168.1.50");
        const hash2 = hashIp("192.168.1.50");
        const hash3 = hashIp("10.0.0.1");

        expect(hash1).toBe(hash2);
        expect(hash1).not.toBe(hash3);
        expect(hash1).toMatch(/^[a-f0-9]{32}$/);
        expect(hash1).not.toContain("192.168.1.50");
      });

      it("handles null or local loopback IP gracefully", () => {
        expect(hashIp(null)).toBe("localhost-hashed");
        expect(hashIp("127.0.0.1")).toBe("localhost-hashed");
        expect(hashIp("::1")).toBe("localhost-hashed");
      });
    });

    describe("detectDeviceCategory", () => {
      it("identifies mobile devices", () => {
        const iphoneUA =
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";
        expect(detectDeviceCategory(iphoneUA)).toBe("mobile");
      });

      it("identifies tablet devices", () => {
        const ipadUA =
          "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";
        expect(detectDeviceCategory(ipadUA)).toBe("tablet");
      });

      it("identifies desktop browsers", () => {
        const desktopUA =
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        expect(detectDeviceCategory(desktopUA)).toBe("desktop");
      });
    });

    describe("detectBot", () => {
      it("flags automated search crawlers and scrapers as bots", () => {
        expect(
          detectBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")
        ).toBe(true);
        expect(
          detectBot("Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)")
        ).toBe(true);
        expect(detectBot("python-requests/2.31.0")).toBe(true);
        expect(detectBot("HeadlessChrome/118.0.5993.88")).toBe(true);
      });

      it("does not flag legitimate human browser user agents", () => {
        const macChrome =
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
        expect(detectBot(macChrome)).toBe(false);

        const iosSafari =
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1";
        expect(detectBot(iosSafari)).toBe(false);
      });
    });

    describe("sanitizeDestinationUrl", () => {
      it("preserves valid https and http URLs", () => {
        expect(sanitizeDestinationUrl("https://example.com/product/123")).toBe(
          "https://example.com/product/123"
        );
        expect(sanitizeDestinationUrl("http://shop.example.com/item")).toBe(
          "http://shop.example.com/item"
        );
      });

      it("blocks open redirect attack vectors and falls back safely", () => {
        expect(sanitizeDestinationUrl("javascript:alert(1)")).toBe("https://crownd.com");
        expect(sanitizeDestinationUrl("data:text/html,<script>alert(1)</script>")).toBe(
          "https://crownd.com"
        );
        expect(sanitizeDestinationUrl("vbscript:msgbox(1)")).toBe("https://crownd.com");
        expect(sanitizeDestinationUrl("not-a-valid-url")).toBe("https://crownd.com");
        expect(sanitizeDestinationUrl(null)).toBe("https://crownd.com");
      });
    });
  });
});
