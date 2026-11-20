import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";
import PostCard from "@/components/PostCard.jsx";
import CategoryNav from "@/components/CategoryNav.jsx";
import Link from "next/link";
import { getPosts, getCategories } from "@/lib/content";

export const dynamic = "force-dynamic"; // live counters
export const metadata = { title: "The Journal - The Human Perspective" };

async function BlogPage({ searchParams }) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getPosts({ category }),
    getCategories(),
  ]);

  return (
    <div>
      <Header />
      <main>
        <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-24">
          <div className="text-center">
            <h2
              data-anim="fade-up"
              className="font-display text-4xl md:text-6xl"
            >
              The Journal
            </h2>
            <p data-anim="fade-up" className="mx-auto mt-4 max-w-xl text-lg">
              A collection of reflections on faith,life,and the spaces in
              between
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <CategoryNav categories={categories} active={category} />
          </div>

          {/* blog posts */}
          {posts.length > 0 ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <PostCard key={post._id} post={post} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-16 text-center">
              No posts in this category yet.{" "}
              <Link href="/blog" className="underline underline-offset-4">
                See all posts
              </Link>
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default BlogPage;
