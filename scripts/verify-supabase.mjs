import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local safely
const envPath = path.resolve(process.cwd(), ".env.local");

if (!fs.existsSync(envPath)) {
  console.log(JSON.stringify({ error: ".env.local file not found at " + envPath }));
  process.exit(1);
}

try {
  process.loadEnvFile(envPath);
} catch (e) {
  console.log(JSON.stringify({ error: "Failed to load .env.local: " + e.message }));
  process.exit(1);
}

function normalizeUrl(url) {
  if (!url) return "";
  let trimmed = url.trim().replace(/^['"]|['"]$/g, "");
  if (trimmed.startsWith("https:https://")) {
    trimmed = trimmed.replace("https:https://", "https://");
  } else if (trimmed.startsWith("http:http://")) {
    trimmed = trimmed.replace("http:http://", "http://");
  }
  trimmed = trimmed.replace(/\/rest\/v1\/?$/, "");
  trimmed = trimmed.replace(/\/+$/, "");
  return trimmed;
}

const supabaseUrl = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
  .trim()
  .replace(/^['"]|['"]$/g, "");
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim().replace(/^['"]|['"]$/g, "");

const envCheck = {
  hasUrl: Boolean(supabaseUrl),
  isValidUrl: false,
  urlDomain: "",
  hasAnonKey: Boolean(anonKey),
  anonKeyFormat: "none",
  hasServiceKey: Boolean(serviceKey),
  serviceKeyFormat: "none",
};

if (supabaseUrl) {
  try {
    const parsed = new URL(supabaseUrl);
    envCheck.isValidUrl = parsed.protocol === "https:" || parsed.protocol === "http:";
    envCheck.urlDomain = parsed.hostname;
  } catch {
    envCheck.isValidUrl = false;
  }
}

if (anonKey) {
  if (anonKey.startsWith("sb_publishable_")) {
    envCheck.anonKeyFormat = "sb_publishable (modern publishable)";
  } else if (anonKey.startsWith("sbp_")) {
    envCheck.anonKeyFormat = "sbp (publishable token)";
  } else if (anonKey.startsWith("ey")) {
    envCheck.anonKeyFormat = "jwt (classic anon JWT)";
  } else {
    envCheck.anonKeyFormat = "other (length: " + anonKey.length + ")";
  }
}

if (serviceKey) {
  if (serviceKey.startsWith("sb_secret_")) {
    envCheck.serviceKeyFormat = "sb_secret (modern service secret)";
  } else if (serviceKey.startsWith("sbs_")) {
    envCheck.serviceKeyFormat = "sbs (service token)";
  } else if (serviceKey.startsWith("ey")) {
    envCheck.serviceKeyFormat = "jwt (classic service role JWT)";
  } else {
    envCheck.serviceKeyFormat = "other (length: " + serviceKey.length + ")";
  }
}

console.log("ENVIRONMENT_CHECK:", JSON.stringify(envCheck, null, 2));

// Test client connectivity with anon key and service key
async function testConnection() {
  const results = {
    anonClient: {
      connected: false,
      error: null,
    },
    serviceClient: {
      connected: false,
      error: null,
    },
    tablesStatus: {},
  };

  // Test anon client
  try {
    const anonClient = createClient(supabaseUrl, anonKey);
    // Ping auth or public table
    const { data, error } = await anonClient
      .from("profiles")
      .select("id", { count: "exact", head: true });
    if (error) {
      results.anonClient.connected = false;
      results.anonClient.error = {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      };
    } else {
      results.anonClient.connected = true;
    }
  } catch (err) {
    results.anonClient.connected = false;
    results.anonClient.error = { message: err.message };
  }

  // Test service role client
  if (serviceKey) {
    try {
      const adminClient = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Check key tables
      const tablesToCheck = [
        "profiles",
        "brands",
        "creators",
        "campaigns",
        "campaign_applications",
        "products",
        "referral_links",
        "clicks",
        "orders",
        "rewards",
        "transactions",
        "audit_logs",
        "risk_flags",
      ];

      let anySuccess = false;
      for (const table of tablesToCheck) {
        const { error, count } = await adminClient.from(table).select("id").limit(1);
        if (error) {
          results.tablesStatus[table] = {
            exists: false,
            code: error.code,
            message: error.message,
          };
        } else {
          anySuccess = true;
          results.tablesStatus[table] = {
            exists: true,
            count: count ?? 0,
          };
        }
      }

      results.serviceClient.connected = true;
    } catch (err) {
      results.serviceClient.connected = false;
      results.serviceClient.error = { message: err.message };
    }
  }

  console.log("CONNECTIVITY_CHECK:", JSON.stringify(results, null, 2));
}

testConnection().catch((e) => {
  console.error("FATAL_TEST_ERROR:", e.message);
});
