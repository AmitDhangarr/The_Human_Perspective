import pengionBird from "@/app/assests/home/desktop-home-img-2.avif";
import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";
import EpisodeCard from "@/components/EpisodeCard.jsx";
import Image from "next/image";
import { getEpisodes, getPodcast } from "@/lib/content";

export const metadata = { title: "The Human Perspective Podcast - The Human Perspective" };

async function Podcast() {
  const [episodes, podcast] = await Promise.all([getEpisodes(), getPodcast()]);
  return (
    <div>
      <Header />
      <main>
        {/* section - 1  */}
        <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-12 text-center md:py-20">
          <h1
            data-anim="fade-up"
            className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl"
          >
            The Human Perspective Podcast
          </h1>
          <div
            data-anim="image"
            className="relative my-8 h-36 w-36 md:h-44 md:w-44"
          >
            <Image
              className="object-contain"
              src={pengionBird}
              alt="a_pigeon_bird_sketched"
              fill
              sizes="176px"
            />
          </div>
          <p data-anim="fade-up">
            Conversations designed to illuminate your spiritual path
          </p>
          <a
            data-anim="fade-up"
            href={podcast.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-black px-6 py-3 font-label text-white transition-colors duration-500 hover:bg-neutral-800"
          >
            Watch on YouTube
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </section>

        {/* section - 2 */}
        <section className="pb-4">
          <h4
            data-anim="fade-up"
            className="px-6 pb-8 text-center font-display text-2xl"
          >
            All Episodes
          </h4>
          <div className="flex flex-col gap-2">
            {episodes.map((ep) => (
              <EpisodeCard key={ep._id} episode={ep} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Podcast;
