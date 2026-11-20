import Image from "next/image";
import { formatEpisodeLabel } from "@/lib/format";

// Full-width episode banner. `text` picks which description is shown:
// "summary" on the home page, "description" on the podcast page.
export default function EpisodeCard({ episode, text = "description" }) {
  const body = (text === "summary" ? episode.summary : episode.description) ||
    episode.description ||
    episode.summary;

  return (
    <article className="relative">
      <div
        data-anim="parallax"
        className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900 sm:aspect-[16/10] lg:aspect-[1280/700]"
      >
        <Image
          src={episode.image.src}
          alt={episode.image.alt || ""}
          fill
          sizes="100vw"
          className="scale-[1.15] object-cover"
        />
      </div>
      {/* readable text over any photo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div
        data-anim="fade-up"
        className="absolute inset-x-0 bottom-0 max-w-2xl p-6 text-white sm:p-8 lg:p-12"
      >
        <h3 className="text-xl font-semibold sm:text-2xl">{episode.title}</h3>
        <p className="mt-1 font-label text-sm">
          {formatEpisodeLabel(episode.number, episode.duration)}
        </p>
        <p className="mt-3 text-sm leading-relaxed sm:text-base">{body}</p>
        {episode.listenUrl && (
          <a
            href={episode.listenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block underline underline-offset-4"
          >
            Watch on YouTube
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
