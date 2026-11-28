import { createClient } from "next-sanity";
import * as fallback from "./fallback-data";
import { calcReadTime } from "./format";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});



// fetch, refreshed every 60s; falls back to placeholders if Sanity is empty/unreachable
async function load(query, params, fallbackValue) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return fallbackValue;
  try {
    const data = await client.fetch(query, params, { next: { revalidate: 60 } });
    return data && (!Array.isArray(data) || data.length) ? data : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

// Sanity rich text -> the simple blocks PostBody already understands
const toBlocks = (body = []) =>
  body.map((b) => {
    if (b._type === "image") return { _type: "image", _key: b._key, src: b.src, alt: b.alt };
    const text = (b.children || []).map((c) => c.text).join("");
    if (b.style === "blockquote") return { _type: "quote", _key: b._key, text };
    if (/^h\d$/.test(b.style)) return { _type: "heading", _key: b._key, text };
    return { _type: "paragraph", _key: b._key, text };
  });

const POST = `{
  _id, title, "slug": slug.current, subtitle,
  "image": { "src": mainImage.asset->url + "?w=1600&auto=format", "alt": mainImage.alt },
  "author": { "name": author->name },
  "category": { "title": category->title, "slug": category->slug.current },
  publishedAt, "updatedAt": _updatedAt, readTime,
  body[]{ ..., _type == "image" => { "src": asset->url, alt } }
}`;

const withBlocks = (p) => {
  if (!p) return p;
  const body = toBlocks(p.body);
  return { ...p, body, readTime: calcReadTime(body) };
};

export async function getCategories() {
  return load(`*[_type=="category"]|order(title){title,"slug":slug.current}`, {}, fallback.categories);
}

export async function getPosts({ category, limit } = {}) {
  const list = await load(
    `*[_type=="post" && (!defined($category) || category->slug.current==$category)]|order(publishedAt desc)${POST}`,
    { category: category ?? null },
    null
  );
  if (!list) return (await fallbackPosts({ category, limit }));
  return (limit ? list.slice(0, limit) : list).map(withBlocks);
}

export async function getPostBySlug(slug) {
  const p = await load(`*[_type=="post" && slug.current==$slug][0]${POST}`, { slug }, null);
  return p ? withBlocks(p) : fallback.posts.find((x) => x.slug === slug) ?? null;
}

export async function getRecentPosts(excludeSlug, limit = 2) {
  return (await getPosts()).filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export async function getEpisodes({ limit } = {}) {
  const list = await load(
    `*[_type=="podcastEpisode"]|order(number asc){
      _id, number, duration, title, summary, description, listenUrl,
      "image": { "src": image.asset->url + "?w=1600&auto=format", "alt": image.alt }
    }`,
    {},
    fallback.episodes
  );
  return limit ? list.slice(0, limit) : list;
}

function fallbackPosts({ category, limit }) {
  let l = [...fallback.posts];
  if (category) l = l.filter((p) => p.category?.slug === category);
  return limit ? l.slice(0, limit) : l;
}


export async function getPodcast({ limit } = {}) {
  const list = await load(
    `*[_type=="podcastEpisode"]|order(number asc){
      _id, number, duration, title, summary, description, listenUrl,
      "image": { "src": image.asset->url + "?w=1600&auto=format", "alt": image.alt }
    }`,
    {},
    fallback.episodes
  );
  return limit ? list.slice(0, limit) : list;
}
