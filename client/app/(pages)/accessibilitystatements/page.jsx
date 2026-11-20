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
        {/* section - 1 */}
        <section className="bg-black text-white">
          <div className="mx-auto max-w-5xl space-y-4 px-6 py-10 md:py-12">
            <p className="font-label text-lg leading-relaxed md:text-xl">
              The purpose of the following template is to assist you in writing
              your accessibility statement. Please note that you are
              responsible for ensuring that your site&apos;s statement meets
              the requirements of the local law in your area or region.
            </p>
            <p>
              *Note: This page currently has several sections. Once you
              complete editing the Accessibility Statement below, you need to
              delete this section.
            </p>
            <p>
              To learn more about this, check out our article “
              <Link href={"#"} className="underline">
                Accessibility: Adding an Accessibility Statement to Your Site
              </Link>
              ”.
            </p>
          </div>
        </section>

        {/* section - 2 */}
        <section className="mx-auto max-w-3xl px-6 py-10 md:py-16">
          <h1 data-anim="fade-up" className="font-display text-4xl py-3 md:text-5xl">
            Accessibility Statement
          </h1>
          <p className={p}>
            his statement was last updated on [enter relevant date]
            <br />
            <br />
            We at [enter organization / business name] are working to make our
            site [enter site name and address] accessible to people with
            disabilities.
          </p>
          <h4 className={h}>What web accessibility is</h4>
          <p className={p}>
            An accessible site allows visitors with disabilities to browse the
            site with the same or a similar level of ease and enjoyment as
            other visitors. This can be achieved with the capabilities of the
            system on which the site is operating, and through assistive
            technologies.
          </p>
          <h4 className={h}>Accessibility Adjustments on This Site</h4>
          <p className={p}>
            Accessibility Adjustments on This Site We have adapted this site in
            accordance with WCAG [2.0 / 2.1 / 2.2 - select relevant option]
            guidelines, and have made the site accessible to the level of [A /
            AA / AAA - select relevant option]. This site&apos;s contents have
            been adapted to work with assistive technologies, such as screen
            readers and keyboard use. As part of this effort, we have also
            [remove irrelevant information]:
          </p>
          <ul className="list-disc space-y-1 pl-6 leading-7 md:pl-10">
            <li>
              Used the Accessibility Wizard to find and fix potential
              accessibility issues
            </li>
            <li>Set the language of the site </li>
            <li>Set the content order of the site’s pages</li>
            <li>Defined clear heading structures on all of the site’s pages</li>
            <li>Added alternative text to images</li>
            <li>
              Implemented color combinations that meet the required color
              contrast
            </li>
            <li>Reduced the use of motion on the site</li>
            <li>
              Ensured all videos, audio, and files on the site are accessible
            </li>
          </ul>
          <h4 className={h}>
            Declaration of Partial Compliance With the Standard Due to
            Third-Party Content
          </h4>
          <p className={p}>
            The accessibility of certain pages on the site depend on contents
            that do not belong to the organization, and instead belong to
            [enter relevant third-party name]. The following pages are affected
            by this: [list the URLs of the pages]. We therefore declare partial
            compliance with the standard for these pages.
          </p>

          <h4 className={h}>
            Accessibility Arrangements in the Organization [only add if
            relevant]
          </h4>
          <p className={p}>
            Enter a description of the accessibility arrangements in the
            physical offices / branches of your site&apos;s organization or
            business. The description can include all current accessibility
            arrangements - starting from the beginning of the service (e.g.,
            the parking lot and / or public transportation stations) to the end
            (such as the service desk, restaurant table, classroom etc.). It is
            also required to specify any additional accessibility arrangements,
            such as disabled services and their location, and accessibility
            accessories (e.g. in audio inductions and elevators) available for
            use
          </p>
          <h4 className={h}>Requests, Issues, and Suggestions</h4>
          <p className={p}>
            If you find an accessibility issue on the site, or if you require
            further assistance, you are welcome to contact us through the
            organization&apos;s accessibility coordinator:
          </p>
          <ul className="space-y-1 leading-7">
            <li>[Name of the accessibility coordinator]</li>
            <li>[Telephone number of the accessibility coordinator]</li>
            <li>[Email address of the accessibility coordinator]</li>
            <li>[Enter any additional contact details if relevant / available]</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AccessibilityStatement;
