import { createClient } from "@supabase/supabase-js";

// Server-side read-only client (anon key). Used for public counters only;
// everything is protected by RLS / security-definer functions in the database.
export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (u, o) => fetch(u, { ...o, cache: "no-store" }) },
  });
}
