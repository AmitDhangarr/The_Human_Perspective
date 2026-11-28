import Link from "next/link";
import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";

export const metadata = { title: "Accessibility Statement - The Human Perspective" };

const h = "font-bold font-body pb-2 pt-8 text-xl md:text-2xl";
const p = "py-2 leading-7";

function AccessibilityStatement() {
  return (
    <div>
      <Header />
      <main>
        <section className="mx-auto max-w-3xl px-6 py-10 md:py-16">
          <h1 data-anim="fade-up" className="font-display text-4xl py-3 md:text-5xl">
            Accessibility Statement
          </h1>
          <p className={p}>
            This statement was last updated on 28 November 2026.
          </p>
          <p className={p}>
            Peace and reflection should be open to everyone. We at The Human
            Perspective are working to make our site,
            thehumanperspective.amitdhangar.in, accessible to people with
            disabilities, so that every reader and listener can enjoy our
            writings and conversations.
          </p>

          <h4 className={h}>What web accessibility is</h4>
          <p className={p}>
            An accessible site allows visitors with disabilities to browse the
            site with the same or a similar level of ease and enjoyment as
            other visitors. This can be achieved with the capabilities of the
            system on which the site is operating, and through assistive
            technologies.
          </p>

          <h4 className={h}>Accessibility adjustments on this site</h4>
          <p className={p}>
            We have adapted this site in accordance with WCAG guidelines, and have made the site
            accessible to all. The
            site’s content has been adapted to work with assistive
            technologies, such as screen readers and keyboard navigation. As
            part of this effort, we have also:
          </p>
          <ul className="list-disc space-y-1 pl-6 leading-7 md:pl-10">
            <li>Set the language of the site</li>
            <li>Set a logical content order on all pages</li>
            <li>
              Defined clear heading structures on all pages, including blog
              posts and podcast pages
            </li>
            <li>
              Added alternative text to images, such as the photographs that
              accompany our reflections
            </li>
            <li>
              Used color combinations that meet the required contrast, so
              text stays readable over backgrounds and images
            </li>
            <li>
              Made the navigation, newsletter signup and contact form usable
              with a keyboard
            </li>
            <li>Reduced the use of motion on the site</li>
            {/* <li>
              Provided links to our podcast episodes with descriptive text
              [add transcripts or captions if available]
            </li> */}
          </ul>

          <h4 className={h}>
            Declaration of partial compliance due to third-party content
          </h4>
          <p className={p}>
            The accessibility of some pages depends on content that does not
            belong to us. Our podcast episodes are hosted on YouTube, which
            is operated by a third party, and we do not control the
            accessibility of its player or playlists. The affected page is:
            the Podcast page . We therefore declare partial
            compliance with the standard for these pages.
          </p>

          <h4 className={h}>Requests, issues, and suggestions</h4>
          <p className={p}>
            If you find an accessibility issue on the site, or if you require
            further assistance, you are welcome to contact us through our
            accessibility coordinator. You can also reach us through the{" "}
            <Link href="/contactus" className="underline">
              Contact page
            </Link>
            .
          </p>
          {/* <ul className="space-y-1 leading-7">
            <li>[Name of the accessibility coordinator]</li>
            <li>[Telephone number of the accessibility coordinator]</li>
            <li>[Email address of the accessibility coordinator]</li>
          </ul> */}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AccessibilityStatement;