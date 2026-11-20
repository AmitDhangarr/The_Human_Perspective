import { getServerSupabase } from "@/lib/supabase/server";

const empty = { views: 0, likes: 0, saves: 0, comments: 0, shares: 0 };

// slug -> { views, likes, saves, comments, shares } straight from Postgres
export async function getPostStats(slugs = []) {
  const map = {};
  slugs.forEach((s) => (map[s] = { ...empty }));
  const sb = getServerSupabase();
  if (!sb || slugs.length === 0) return map;
  try {
    const { data } = await sb.rpc("post_stats", { p_slugs: slugs });
    (data || []).forEach((r) => {
      map[r.post_slug] = {
        views: Number(r.views),
        likes: Number(r.likes),
        saves: Number(r.saves),
        comments: Number(r.comments),
        shares: Number(r.shares),
      };
    });
  } catch {
    /* keep zeros - the page must never fail because of counters */
  }
  return map;
}

export async function attachStats(posts) {
  const list = Array.isArray(posts) ? posts : [posts];
  const stats = await getPostStats(list.map((p) => p.slug));
  const merged = list.map((p) => ({ ...p, ...stats[p.slug] }));
  return Array.isArray(posts) ? merged : merged[0];
}
