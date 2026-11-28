import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";
import PostBody from "@/components/PostBody.jsx";
import PostCard from "@/components/PostCard.jsx";
import PostEngagement from "@/components/PostEngagement.jsx";
import CategoryNav from "@/components/CategoryNav.jsx";
import {
  getPostBySlug,
  getRecentPosts,
  getCategories,
} from "@/lib/content";
import { formatDate, formatReadTime } from "@/lib/format";

// rendered on request so views, likes and comments are always live
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return { title: `${post.title} - The Human Perspective`, description: post.subtitle };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [recent, categories] = await Promise.all([
    getRecentPosts(post.slug, 2),
    getCategories(),
  ]);

  const authorName = post.author?.name || "Admin";

  const blogPostSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://amitdhangar.in{post.slug}`,
  },

  author: {
    '@type': 'Person',
    name: 'Amit Dhangar',
    url: 'https://amitdhangar.in',
    sameAs: [
      'https://youtube.com',
      'https://linkedin.com',
    ],
  },
  publisher: {
    '@type': 'Organization',
    name: 'The Human Perspective',
    logo: {
      '@type': 'ImageObject',
      url: 'https://amitdhangar.in',
    },
  },
};


  return (
    <div>
      <Header />
      <main>
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostSchema).replace(/</g, '\\u003c'),
        }}
      />
        {/* categories nav */}
        <div className="mx-auto max-w-3xl px-5 pt-6 md:px-8">
          <CategoryNav categories={categories} active={post.category?.slug} />
        </div>

        <article className="mx-auto max-w-3xl px-5 pb-12 pt-10 md:px-8 md:pt-14">
          {/* author bar */}
          <div
            data-anim="fade-up"
            className="flex items-center gap-3 font-label text-xs text-neutral-600"
          >
            {post.author?.image ? (
              <Image
                src={post.author.image}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-[11px] text-white"
              >
                {authorName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="flex flex-wrap items-center gap-x-2">
              <span className="text-black">{authorName}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              {post.readTime && (
                <>
                  <span aria-hidden>·</span>
                  <span>{formatReadTime(post.readTime)}</span>
                </>
              )}
            </span>
          </div>

          <h1
            data-anim="fade-up"
            data-delay="0.1"
            className="mt-6 font-display text-3xl leading-tight md:text-5xl"
          >
            {post.title}
          </h1>

          {post.updatedAt && (
            <p
              data-anim="fade-up"
              data-delay="0.15"
              className="mt-4 text-xs text-neutral-600"
            >
              Updated: <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </p>
          )}

          {post.subtitle && (
            <p
              data-anim="fade-up"
              data-delay="0.2"
              className="mt-6 text-base leading-7 text-neutral-800"
            >
              {post.subtitle}
            </p>
          )}

          {/* main image */}
          <div
            data-anim="image"
            className="relative mt-8 aspect-[4/3] w-full overflow-hidden bg-neutral-100 sm:aspect-[16/9]"
          >
            <Image
              src={post.image.src}
              alt={post.image.alt || ""}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>

          {/* body */}
          <div className="mt-8">
            <PostBody blocks={post.body} />
          </div>

          {/* like / save / share, stats and comments - all stored in Supabase */}
          <PostEngagement
            slug={post.slug}
            title={post.title}
            initial={{
              views: post.views,
              likes: post.likes,
              saves: post.saves,
              comments: post.comments,
              shares: post.shares,
            }}
          />
        </article>

        {/* recent posts */}
        {recent.length > 0 && (
          <section className="mx-auto max-w-5xl px-5 pb-20 pt-6 md:px-8">
            <div className="flex items-baseline justify-between">
              <h2 data-anim="fade-up" className="font-display text-lg">
                Recent Posts
              </h2>
              <Link
                href="/blog"
                className="font-label text-xs underline underline-offset-4"
              >
                See All
              </Link>
            </div>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {recent.map((p, i) => (
                <PostCard key={p._id} post={p} variant="compact" index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
