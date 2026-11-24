/**
 * Privacy-preserving tracking, bot filtering, and redirect validation utilities.
 */

import crypto from "node:crypto";

const SALT = process.env.TRACKING_SALT || "crownd-secure-attribution-salt-2026";

/**
 * Anonymizes an IP address by hashing with salt.
 * Raw IP addresses are NEVER stored in the database.
 */
export function hashIp(ip?: string | null): string {
  if (!ip || ip === "::1" || ip === "127.0.0.1") {
    return "localhost-hashed";
  }
  return crypto.createHmac("sha256", SALT).update(ip).digest("hex").substring(0, 32);
}

/**
 * Classifies device category from User-Agent string.
 */
export function detectDeviceCategory(userAgent?: string | null): "mobile" | "tablet" | "desktop" {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

/**
 * Detects search engine crawlers and automated scraper bots.
 */
export function detectBot(userAgent?: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();

  const botPatterns = [
    "bot",
    "crawl",
    "spider",
    "slurp",
    "mediapartners",
    "headless",
    "preview",
    "googlebot",
    "bingbot",
    "yandex",
    "duckduckbot",
    "baiduspider",
    "curl",
    "wget",
    "python-requests",
  ];

  return botPatterns.some((pattern) => ua.includes(pattern));
}

/**
 * Validates and sanitizes destination URLs to prevent open-redirect vulnerabilities.
 */
export function sanitizeDestinationUrl(
  url?: string | null,
  fallback = "https://crownd.com"
): string {
  if (!url || !url.trim()) return fallback;

  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return fallback;
    }
    // Disallow javascript:, data:, file:, etc.
    return parsed.toString();
  } catch {
    return fallback;
  }
}
