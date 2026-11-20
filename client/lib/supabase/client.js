import { createClient } from "@supabase/supabase-js";

// Browser client (one instance). Returns null when env vars are missing so the
// site still renders before Supabase is connected.
let client;
export function getBrowserSupabase() {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        })
      : null;
  return client;
}
