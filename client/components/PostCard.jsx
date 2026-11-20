import Link from "next/link";
import Image from "next/image";
import PostStats from "@/components/PostStats.jsx";

/*
  variant="grid"    square image, centred title  (home + blog list)
  variant="compact" landscape image, left title, stats row (recent posts)
  index is only used to stagger the reveal of cards that sit in the same row.
*/
export default function PostCard({ post, variant = "grid", index = 0 }) {
  const delay = (index % 3) * 0.12;
  const compact = variant === "compact";

  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div
          data-anim="image"
          data-delay={delay}
          className={`relative w-full overflow-hidden bg-neutral-100 ${
            compact ? "aspect-[16/9]" : "aspect-square"
          }`}
        >
          {/* hover zoom lives on its own layer so it never fights the reveal */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <Image
              src={post.image.src}
              alt={post.image.alt || ""}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <p
          data-anim="fade-up"
          data-delay={delay}
          className={
            compact
              ? "mt-4 font-display text-base leading-snug group-hover:underline"
              : "mt-4 px-2 text-center group-hover:underline"
          }
        >
          {post.title}
        </p>
      </Link>
      {compact && (
        <PostStats
          views={post.views}
          comments={post.comments}
          className="mt-4 border-t border-black/20 pt-4"
        />
      )}
    </article>
  );
}
