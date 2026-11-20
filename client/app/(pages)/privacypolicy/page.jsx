import Link from "next/link";
import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";

export const metadata = { title: "Privacy Policy - The Human Perspective" };

const h = "font-bold font-body pb-3 pt-8 text-xl md:text-2xl";

function PrivacyPolicy() {
  return (
    <div>
      <Header />
      <main>
        <section className="mx-auto max-w-3xl px-6 py-10 md:py-16">
          <h1 data-anim="fade-up" className="font-display text-4xl py-3 md:text-5xl">
            Privacy Policy
          </h1>
          <div>
            <h4 className={h}>A legal disclaimer</h4>
            <p className="text-base leading-7 md:text-lg md:leading-8">
              The explanations and information provided on this page are only
              general and high-level explanations and information on how to
              write your own document of a Privacy Policy. You should not rely
              on this article as legal advice or as recommendations regarding
              what you should actually do, because we cannot know in advance
              what are the specific privacy policies you wish to establish
              between your business and your customers and visitors. We
              recommend that you seek legal advice to help you understand and
              to assist you in the creation of your own Privacy Policy.
            </p>
          </div>
          <div>
            <h4 className={h}>Privacy Policy - the basics</h4>
            <div className="space-y-4 text-base leading-7 md:text-lg md:leading-8">
              <p>
                Having said that, a privacy policy is a statement that
                discloses some or all of the ways a website collects, uses,
                discloses, processes, and manages the data of its visitors and
                customers. It usually also includes a statement regarding the
                website’s commitment to protecting its visitors’ or customers’
                privacy, and an explanation about the different mechanisms the
                website is implementing in order to protect privacy.
              </p>
              <p>
                Different jurisdictions have different legal obligations of
                what must be included in a Privacy Policy. You are responsible
                to make sure you are following the relevant legislation to your
                activities and location.
              </p>
            </div>
          </div>
          <div>
            <h4 className={h}>What to include in the Privacy Policy</h4>
            <div className="space-y-4 text-base leading-7 md:text-lg md:leading-8">
              <p>
                Generally speaking, a Privacy Policy often addresses these
                types of issues: the types of information the website is
                collecting and the manner in which it collects the data; an
                explanation about why is the website collecting these types of
                information; what are the website’s practices on sharing the
                information with third parties; ways in which your visitors and
                customers can exercise their rights according to the relevant
                privacy legislation; the specific practices regarding minors’
                data collection; and much, much more.
              </p>
              <p>
                To learn more about this, check out our article “
                <Link href={"#"}>
                  <span className="underline">Creating a Privacy Policy</span>
                </Link>
                ”.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
