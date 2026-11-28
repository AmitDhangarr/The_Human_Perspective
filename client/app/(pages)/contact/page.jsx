import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";
import ContactForm from "@/components/ContactForm.jsx";

export const metadata = { title: "Contact us - The Human Perspective" };

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact - The Human Perspective',
  url: 'https://thehumanperspective.amitdhangar.in/',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://amitdhangar.in',
    name: 'Amit Dhangar',
    email: 'amitdhangar.work@gmail.com',
  },
};

function ContactUs() {
  return (
    <div>
      <Header />
      <main>
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema).replace(/</g, '\\u003c'),
        }}
      />
        {/* contact form */}
        <section className="mx-auto flex w-full max-w-xl flex-col items-center px-6 py-12 md:py-20">
          <div className="text-center">
            <h1
              data-anim="fade-up"
              className="font-display text-4xl md:text-5xl"
            >
              Connect with Us
            </h1>
            <p data-anim="fade-up" className="mt-4">
              We welcome your thoughts, stories, and questions. Send us a
              message
            </p>
          </div>

          <ContactForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ContactUs;
