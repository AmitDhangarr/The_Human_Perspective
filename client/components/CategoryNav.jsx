import Link from "next/link";

// "All Posts" + one link per category. Links go to /blog?category=<slug>.
export default function CategoryNav({ categories = [], active }) {
  const item = "py-1 hover:underline underline-offset-4";
  return (
    <nav aria-label="Blog categories">
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-label text-sm">
        <li>
          <Link
            href="/blog"
            className={`${item} ${!active ? "underline" : ""}`}
            aria-current={!active ? "page" : undefined}
          >
            All Posts
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/blog?category=${c.slug}`}
              className={`${item} ${active === c.slug ? "underline" : ""}`}
              aria-current={active === c.slug ? "page" : undefined}
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
