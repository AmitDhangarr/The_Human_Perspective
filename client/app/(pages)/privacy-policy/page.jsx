import Link from "next/link";
import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";

export const metadata = { title: "Privacy Policy - The Human Perspective" };

const h = "font-bold font-body pb-3 pt-8 text-xl md:text-2xl";
const body = "space-y-4 text-base leading-7 md:text-lg md:leading-8";
const list = "list-disc space-y-2 pl-6 text-base leading-7 md:pl-10 md:text-lg md:leading-8";

function PrivacyPolicy() {
  return (
    <div>
      <Header />
      <main>
        <section className="mx-auto max-w-3xl px-6 py-10 md:py-16">
          <h1 data-anim="fade-up" className="font-display text-4xl py-3 md:text-5xl">
            Privacy Policy
          </h1>
          <p className="py-2 text-base leading-7 md:text-lg md:leading-8">
            This policy was last updated on [enter relevant date].
          </p>

          <div>
            <h4 className={h}>Our promise</h4>
            <div className={body}>
              <p>
                The Human Perspective is a quiet space for reflection, and we
                want your time here to feel that way. We collect only what we
                need to share our writing and conversations with you, we never
                sell your personal information, and we will always tell you
                plainly what we do with it.
              </p>
              <p>
                This policy applies to (the “Site”),
                which is operated by Amit Dhangar.
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>Information we collect</h4>
            <div className={body}>
              <p>
                We collect information in the following ways:
              </p>
            </div>
            <ul className={list}>
              <li>
                <strong>Newsletter.</strong> When you subscribe to receive new
                reflections and podcast episodes, we collect your email
                address and your confirmation that you wish to subscribe.
              </li>
              <li>
                <strong>Contact form.</strong> When you write to us through
                the Contact page, we collect the details you provide, such as
                your name, email address and message.
              </li>
              <li>
                <strong>Usage information.</strong> Like most websites, we
                may automatically receive technical information such as your
                browser type, device, approximate location, pages visited and
                the date and time of your visit.
              </li>
            </ul>
          </div>

          <div>
            <h4 className={h}>How we use your information</h4>
            <ul className={list}>
              <li>To send you new blog reflections and podcast episodes, if you subscribed</li>
              <li>To reply to your questions, comments and requests</li>
              <li>To understand which writings and episodes are most helpful, so we can improve the Site</li>
              <li>To keep the Site secure and working properly</li>
              <li>To meet our legal obligations</li>
            </ul>
          </div>

          <div>
            <h4 className={h}>Newsletter and your choices</h4>
            <div className={body}>
              <p>
                We email you only if you have chosen to subscribe. Every
                newsletter includes an unsubscribe link, and you can also ask
                us to remove you at any time by writing to [enter contact
                email]. Unsubscribing will not affect your use of the Site.
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>Third-party services</h4>
            <div className={body}>
              <p>
                We rely on a small number of trusted services to run the
                Site. These providers process data on our behalf and only as
                needed to provide their service:
              </p>
            </div>
            <ul className={list}>
              <li>Vercel: hosts and delivers the Site</li>
              <li>Supabase: sends our newsletter</li>
              <li> Google Analytics: helps us understand how the Site is used</li>
              <li>
                YouTube: our podcast episodes are hosted on YouTube. When you
                follow a link to YouTube, its own privacy policy and cookie
                practices apply.
              </li>
            </ul>
            <div className={`${body} pt-4`}>
              <p>
                We do not sell, rent or trade your personal information. We
                may disclose it if required by law or to protect the rights
                and safety of our readers, listeners and ourselves.
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>Cookies</h4>
            <div className={body}>
              <p>
                The Site may use cookies or similar technologies to remember
                your preferences and to measure how the Site is used. You can
                block or delete cookies in your browser settings. Some parts
                of the Site may not work as intended if you do.
               
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>How long we keep your information</h4>
            <div className={body}>
              <p>
                We keep your information only for as long as needed for the
                purposes above. Newsletter details are kept until you
                unsubscribe, and messages sent through the Contact page are
                kept for as long as needed to respond and follow up.
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>How we protect your information</h4>
            <div className={body}>
              <p>
                We use reasonable technical and organizational measures to
                protect your information from loss, misuse and unauthorized
                access. No method of transmission or storage is completely
                secure, so we cannot guarantee absolute security.
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>Your rights</h4>
            <div className={body}>
              <p>
                Depending on where you live, you may have the right to access
                the personal information we hold about you, correct it,
                delete it, object to or restrict its use, or withdraw your
                consent at any time. To make a request, contact us using the
                details below. We will respond within a reasonable time.
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>Children’s privacy</h4>
            <div className={body}>
              <p>
                The Site is not directed at children under 16, and we do not knowingly collect their personal
                information. If you believe a child has given us their
                information, please contact us and we will delete it.
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>Changes to this policy</h4>
            <div className={body}>
              <p>
                We may update this policy from time to time. When we do, we
                will change the date at the top of this page. If the changes
                are significant, we will let you know through the Site or by
                email.
              </p>
            </div>
          </div>

          <div>
            <h4 className={h}>Contact us</h4>
            <div className={body}>
              <p>
                If you have questions about this policy or how your
                information is handled, you are welcome to reach out:
              </p>
            </div>
            {/* <ul className="space-y-1 pt-2 text-base leading-7 md:text-lg md:leading-8">
              <li>[Name of owner / privacy contact]</li>
              <li>[Email address]</li>
              <li>[Postal address, if relevant]</li>
            </ul> */}
            <div className={`${body} pt-4`}>
              <p>
                You can also write to us through our{" "}
                <Link href="/contactus">
                  <span className="underline">Contact page</span>
                </Link>
                .
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