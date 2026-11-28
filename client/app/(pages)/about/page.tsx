import Image from "next/image";
import { Metadata } from "next";
import closelookMan from "@/app/assests/about/desktop-about-hero-img.avif";
import sheepAnimal from "@/app/assests/about/desktop-about-img-1.avif";
import widelookMan from "@/app/assests/about/desktop-about-img-2.avif";
import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";

export const metadata: Metadata = {
  title: "About us - let's know us more betterly",
  description: "a brief introduction about our work,goals and future plans",
};

const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: '2026-01-01T00:00:00+05:30',
    dateModified: '2026-11-28T00:00:00+05:30',
    mainEntity: {
      '@type': 'Person',
      '@id': 'https://amitdhangar.in',
      name: 'Amit Dhangar',
      url: 'https://amitdhangar.in',
      image: 'https://amitdhangar.in',
      jobTitle: 'Author & Podcast Host',
      description:
        'Writer and host of The Human Perspective, exploring spiritual contemplation, faith, and quieter currents of everyday life.',
      worksFor: {
        '@type': 'Organization',
        name: 'The Human Perspective',
        url: 'https://thehumanperspective.amitdhangar.in/',
      },
      knowsAbout: [
        'Spirituality',
        'Contemplative Practices',
        'Faith',
        'Mindfulness',
      ],
      sameAs: [
        'https://amitdhangar.in',
        'https://youtube.com/amitdhangar',
        'https://linkedin.com/digitalamitdhangar',
        'https://x.com/AmitDhangar',
      ],
    },
  };

function About() {
  return (
    <div>
      <Header overlay />
      <main>
          <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema).replace(/</g, '\\u003c'),
        }}
      />

        {/* hero-section */}
        <section className="relative">
          <div
            data-anim="parallax"
            className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900 sm:aspect-[16/10] lg:aspect-[1800/773]"
          >
            <Image
              className="scale-[1.15] object-cover"
              src={closelookMan}
              alt="a_man_close_to_mic_talking_about_something"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div
            data-anim="fade-up"
            className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl px-6 pb-8 md:pb-12"
          >
            <h1 className="font-display text-4xl leading-tight text-white md:text-6xl">
              Illuminating the Path Within
            </h1>
            <p className="mt-3 font-label text-sm text-white md:text-base">
              The Human Perspective began as a quiet corner of the internet, a personal
              project by founder Bastien Lefevre
            </p>
          </div>
        </section>

        {/* section - 1 */}
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 text-center md:px-10 lg:flex-row lg:justify-between lg:gap-12 lg:py-20 lg:text-left">
          <h3
            data-anim="fade-up"
            className="font-display text-2xl md:text-3xl lg:flex-1"
          >
            Creating a Gentle, Inclusive Space for the Spiritually Curious
          </h3>
          <div
            data-anim="image"
            className="relative h-40 w-52 shrink-0 lg:h-48 lg:w-62"
          >
            <Image
              className="object-contain"
              src={sheepAnimal}
              alt="a_sheep_animal_sketched"
              fill
              sizes="248px"
            />
          </div>
          <p
            data-anim="fade-up"
            className="font-label text-base leading-relaxed lg:flex-1"
          >
            Through essays and conversations, we explore the timeless questions
            of the human heart. <br /> Seeking not to provide easy answers, but
            to share in the beauty of the search itself
          </p>
        </section>

        {/* section - 2 */}
        <section>
          <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-10 text-center md:py-14">
            <p data-anim="fade-up" className="p-2 font-label">
              The Author
            </p>
            <h3
              data-anim="fade-up"
              className="p-2 font-display text-2xl md:text-3xl"
            >
              About Amit Dhangar
            </h3>
            <p data-anim="fade-up" className="p-1">
              Amit Dhangar is a SEO Specialist with a  strong passion for
              philosophy & related Subjects.
            </p>
          </div>
          <div
            data-anim="parallax"
            className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 sm:aspect-[16/9] lg:aspect-[1800/855]"
          >
            <Image
              className="scale-[1.15] object-cover"
              src={widelookMan}
              alt="a_man_sitting_on_chair_beside_window_and_facing_towards_camera"
              fill
              sizes="100vw"
            />
          </div>
          <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-14 text-center md:py-20">
            <h3
              data-anim="fade-up"
              className="font-display text-2xl leading-snug md:text-4xl"
            >
              Amit Dhangar's work is inspired by the <br className="hidden md:block" />{" "}
              belief that every life holds a sacred{" "}
              <br className="hidden md:block" /> story waiting to be told
            </h3>
            <p data-anim="fade-up" className="mt-6 md:mt-8">
              He lives in the countryside with his family and a large
              collection of books
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
