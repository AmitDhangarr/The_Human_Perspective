import Link from "next/link";
import Image from "next/image";
import hands from "@/app/assests/home/desktop-home-img-6.avif";
import logo from "@/app/assests/home/logo.png";
import VisitorCounter from "@/components/VisitorCounter.jsx";

function Footer() {
  return (
    <div>
      <div>
        <div className="logo flex items-center justify-center py-4">
          <Image
            className="h-20 w-auto md:h-24"
            src={logo}
            alt="the_human_perspective_logo"
          />
        </div>
        <div data-anim="image" className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[1280/665]">
          <Image
            className="object-cover"
            fill
            sizes="100vw"
            src={hands}
            alt="two_hands_trying_to_join"
          />
        </div>
      </div>

      <footer className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-8 text-center md:flex-row md:items-start md:justify-between md:px-8 md:text-left">
        <div className="link-section-1 space-y-1">
          <p className="font-label">info@mysite.com</p>
          <p className="font-label">123-456-789</p>
        </div>
        <div className="link-section-2">
          <address className="font-label not-italic">
            500 Terry Francine <br /> St,San Francisco, CA 94158
          </address>
        </div>
        <div className="link-section-3 space-y-1">
          <Link href="/privacypolicy" className="block font-label underline">
            Privacy Policy
          </Link>
          <Link
            href="/accessibilitystatements"
            className="block font-label underline"
          >
            Accessibility Statements
          </Link>
        </div>
      </footer>

      <VisitorCounter />
      <div className="flex items-center justify-center px-6 pb-6 pt-2 text-center">
        &copy;
        <p className="pl-3 font-label">amitdhangar.in 2026 - 2027</p>
      </div>
    </div>
  );
}

export default Footer;
