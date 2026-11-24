import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const routes = [
    "",
    "/how-it-works",
    "/for-brands",
    "/for-creators",
    "/creators",
    "/campaigns",
    "/pricing",
    "/faq",
    "/guides",
    "/guides/performance-creator-partnerships",
    "/guides/micro-creator-audience-trust",
    "/guides/post-delivery-attribution-guide",
    "/about",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/guides") ? 0.8 : 0.7,
  }));
}
