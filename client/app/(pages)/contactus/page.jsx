import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";
import ContactForm from "@/components/ContactForm.jsx";

export const metadata = { title: "Contact us - The Human Perspective" };

function ContactUs() {
  return (
    <div>
      <Header />
      <main>
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
