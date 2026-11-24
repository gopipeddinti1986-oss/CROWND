import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";
import { getSupabaseUrl, getSupabaseAnonKey } from "./env";

export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    return createBrowserClient<Database>("https://placeholder.supabase.co", "placeholder-anon-key");
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
