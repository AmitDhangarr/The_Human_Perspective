// ---------------------------------------------------------------------------
// The ONLY place pages read content from.
// Posts come from the placeholder data / Sanity; live counters (views, likes,
// comments) are merged in from Supabase by attachStats().
// Right now it returns the placeholder data. In the next step these functions
// will fetch from Sanity instead, and no page needs to change.
// ---------------------------------------------------------------------------
import { posts, episodes, categories, podcast } from "./fallback-data";
import { attachStats } from "./stats";

const byNewest = (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt);

export async function getCategories() {
  return categories;
}

export async function getPosts({ category, limit } = {}) {
  let list = [...posts].sort(byNewest);
  if (category) list = list.filter((p) => p.category?.slug === category);
  return attachStats(limit ? list.slice(0, limit) : list);
}

export async function getPostBySlug(slug) {
  const post = posts.find((p) => p.slug === slug);
  return post ? attachStats(post) : null;
}

export async function getRecentPosts(excludeSlug, limit = 2) {
  return attachStats(
    [...posts]
      .sort(byNewest)
      .filter((p) => p.slug !== excludeSlug)
      .slice(0, limit)
  );
}

export async function getEpisodes({ limit } = {}) {
  const list = [...episodes].sort((a, b) => a.number - b.number);
  return limit ? list.slice(0, limit) : list;
}

export async function getPodcast() {
  return podcast;
}
