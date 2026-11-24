import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  hashIp,
  detectDeviceCategory,
  detectBot,
  sanitizeDestinationUrl,
} from "@/lib/tracking/utils";

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code } = await params;
  const admin = createAdminClient() as any;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crownd.com";

  if (!code || !code.trim()) {
    return NextResponse.redirect(new URL("/", siteUrl));
  }

  // 1. Resolve referral link and active campaign
  const { data: link } = await admin
    .from("referral_links")
    .select("*, campaigns!inner(id, status, slug, title)")
    .eq("code", code.trim())
    .single();

  if (!link || !link.is_active || link.campaigns.status !== "active") {
    // If inactive, redirect to public campaign or home
    const fallback = link?.campaigns?.id ? `/campaigns/${link.campaigns.id}` : "/campaigns";
    return NextResponse.redirect(new URL(fallback, siteUrl));
  }

  const userAgent = request.headers.get("user-agent") || "";
  const referrer = request.headers.get("referer") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip");

  const isBot = detectBot(userAgent);
  const deviceCategory = detectDeviceCategory(userAgent);
  const ipHashed = hashIp(ip);

  // Extract query parameters for UTM tracking
  const searchParams = request.nextUrl.searchParams;
  const utmSource = searchParams.get("utm_source") || "crownd";
  const utmMedium = searchParams.get("utm_medium") || "creator";
  const utmCampaign = searchParams.get("utm_campaign") || link.campaigns.slug;

  // Visitor ID from cookie
  let visitorId = request.cookies.get("crownd_vid")?.value;
  let isNewVisitor = false;
  if (!visitorId) {
    visitorId = `vid_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    isNewVisitor = true;
  }

  // 2. Insert Click Event
  const { data: clickRecord } = await admin
    .from("clicks")
    .insert({
      link_id: link.id,
      campaign_id: link.campaign_id,
      creator_id: link.creator_id,
      ip_hash: ipHashed,
      user_agent: userAgent.substring(0, 500),
      referrer: referrer.substring(0, 500) || null,
      device_category: deviceCategory,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      is_bot: isBot,
      visitor_id: visitorId,
      clicked_at: new Date().toISOString(),
    } as never)
    .select("id")
    .single();

  // 3. Increment click counter (only for non-bots)
  if (!isBot) {
    await admin
      .from("referral_links")
      .update({
        clicks_count: (link.clicks_count || 0) + 1,
      } as never)
      .eq("id", link.id);
  }

  // 4. Safe destination URL
  const destination = sanitizeDestinationUrl(
    link.destination_url,
    `${siteUrl}/campaigns/${link.campaign_id}`
  );

  const response = NextResponse.redirect(new URL(destination));

  // Set visitor ID cookie (1 year expiration)
  if (isNewVisitor) {
    response.cookies.set("crownd_vid", visitorId, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Set Attribution Cookie (30 day expiration window)
  const attributionPayload = JSON.stringify({
    linkId: link.id,
    code: link.code,
    campaignId: link.campaign_id,
    creatorId: link.creator_id,
    clickId: clickRecord?.id || null,
    timestamp: Date.now(),
  });

  response.cookies.set("crownd_attribution", encodeURIComponent(attributionPayload), {
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
