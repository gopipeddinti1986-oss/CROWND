/**
 * Safe environment resolution helpers for Supabase.
 * Strips accidental whitespace, surrounding quotes, or duplicate protocol prefixes.
 */

export function normalizeUrl(url?: string): string {
  if (!url) return "";
  let trimmed = url.trim().replace(/^['"]|['"]$/g, "");
  if (trimmed.startsWith("https:https://")) {
    trimmed = trimmed.replace("https:https://", "https://");
  } else if (trimmed.startsWith("http:http://")) {
    trimmed = trimmed.replace("http:http://", "http://");
  }
  // Strip trailing /rest/v1 or /rest/v1/ if pasted from Supabase API settings
  trimmed = trimmed.replace(/\/rest\/v1\/?$/, "");
  // Strip trailing slash
  trimmed = trimmed.replace(/\/+$/, "");
  return trimmed;
}

export function getSupabaseUrl(): string {
  return normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim().replace(/^['"]|['"]$/g, "");
}

export function getSupabaseServiceRoleKey(): string {
  return (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim().replace(/^['"]|['"]$/g, "");
}
