import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import heroBanner from "@/app/assests/home/desktop-hero-img.avif";
import banayanTree from "@/app/assests/home/desktop-home-img-1.avif";
import pengionBird from "@/app/assests/home/desktop-home-img-2.avif";
import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";
import NewsletterForm from "@/components/NewsletterForm.jsx";
import PostCard from "@/components/PostCard.jsx";
import EpisodeCard from "@/components/EpisodeCard.jsx";
import { getPosts, getEpisodes } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Human Perspective - Finding peace in a world of noise",
};

export const dynamic = "force-dynamic"; // live counters

export default async function Home() {
  const [posts, episodes] = await Promise.all([
    getPosts({ limit: 3 }),
    getEpisodes({ limit: 3 }),
  ]);

  return (
    <div>
      <Header overlay />
      <main>
        {/* hero section */}
        <section className="relative">
          <div
            data-anim="parallax"
            className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 sm:aspect-[16/10] lg:aspect-[2200/912]"
          >
            <Image
              src={heroBanner}
              alt="mountains_landscape"
              fill
              priority
              sizes="100vw"
              className="scale-[1.15] object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center md:gap-8">
            <h1
              data-anim="mist"
              data-delay="0.7"
              className="max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-7xl xl:text-[80px]"
            >
              Finding Peace in a world of Noise
            </h1>
            <p
              data-anim="mist"
              data-delay="1.1"
              className="max-w-xl font-body text-base text-white md:text-lg"
            >
              Explore our latest reflection on contemplative practices for
              everyday life.
            </p>
            <Link
              data-anim="mist"
              data-delay="1.5"
              href={"/blog"}
              className="font-label text-white underline underline-offset-4"
            >
              Read More
            </Link>
          </div>
        </section>

        {/*section - 1 */}
        <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center md:py-24">
          <h2
            data-anim="fade-up"
            className="font-display text-3xl leading-snug md:text-4xl"
          >
            Your Space for Spiritual Contemplation
          </h2>
          <div data-anim="float">
          <div
            data-anim="image"
            className="relative my-8 h-44 w-44 md:h-54 md:w-54"
          >
            <Image
              className="object-contain"
              src={banayanTree}
              alt={"banayan_tree"}
              fill
              sizes="216px"
            />
          </div>
          </div>
          <p data-anim="fade-up" className="text-lg leading-relaxed">
            The Human Perspective is a collection of writings and conversations
            dedicated to exploring the quieter,deeper currents of faith
          </p>
          <Link
            data-anim="fade-up"
            href={"/podcasts"}
            className="mt-5 font-semibold underline underline-offset-4"
          >
            Learn More
          </Link>
        </section>

        {/* section - 2  */}
        <section className="mx-auto max-w-6xl px-5 pb-16 text-center md:px-8 md:pb-24">
          <p data-anim="fade-up" className="font-label text-lg">
            Meditations on Grace
          </p>
          <h2
            data-anim="fade-up"
            className="mt-2 font-display text-3xl md:text-4xl"
          >
            From the Journal
          </h2>
          <p data-anim="fade-up" className="mx-auto mt-3 max-w-xl">
            A collection of reflections on faith,life,and the spaces in between
          </p>
          {/* blog posts */}
          <div className="mt-10 grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}
          </div>
          <Link
            href={"/blog"}
            className="mt-10 inline-block underline underline-offset-4"
          >
            Read More
          </Link>
        </section>

        {/* section-3 */}
        <section className="pb-16 md:pb-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
            <h1
              data-anim="fade-up"
              className="font-display text-3xl md:text-4xl"
            >
              Latest Episodes
            </h1>
            <div data-anim="float">
            <div
              data-anim="image"
              className="relative my-8 h-44 w-44 md:h-54 md:w-54"
            >
              <Image
                src={pengionBird}
                alt="a_pengion_bird_sketched_"
                fill
                sizes="216px"
                className="object-contain"
              />
            </div>
            </div>
            <p data-anim="fade-up" className="leading-relaxed">
              Tune into conversations that nourish the spirit. We believe in
              the power of stories to illuminate the soul and connect us to the
              divine in our daily lives.
            </p>
            <Link
              data-anim="fade-up"
              href={"/podcasts"}
              className="my-8 font-display text-2xl underline-offset-4 hover:underline"
            >
              All Episodes
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {episodes.map((ep) => (
              <EpisodeCard key={ep._id} episode={ep} text="summary" />
            ))}
          </div>
        </section>

        {/* section -4 */}
        <section className="mx-auto flex w-full max-w-md flex-col items-center px-6 pb-16 text-center md:pb-24">
          <h3 data-anim="fade-up" className="font-display text-3xl md:text-4xl">
            Join Our Community
          </h3>
          <p data-anim="fade-up" className="my-5">
            Receive new reflections and podcast episodes directly in your inbox
          </p>
          <NewsletterForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}

// step by step approach of doing developement

// 1. understand structure of website of design - done
// 2. break down its structure into html - done
// 3. develop it -- in progress
// 4. look styling
// 5. break down
// 6. implement
// 7. responsiveness
// 8. hover effects and animation
// 9. testing -> mobile friendliness and loading speed
// 10. try to improve performance of the website by using different optimization techniques.c
