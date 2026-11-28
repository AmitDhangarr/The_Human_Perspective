import type { Metadata } from "next";
import { Cormorant_Garamond, Lora, Marcellus } from "next/font/google";
import "./globals.css";
import ScrollAnimations from "@/components/ScrollAnimations.jsx";
import AuthProvider from "@/components/auth/AuthProvider.jsx";
import AuthModal from "@/components/auth/AuthModal.jsx";

// font config - Cormorant for display, Marcellus for labels, Lora for reading
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-marcellus",
});

export const metadata: Metadata = {
  title: "The Human Perspective - Finding peace in a world of noise",
  description:
    "The Human Perspective is a quiet space for spiritual contemplation: reflections, conversations and practices for everyday life.",
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://thehumanperspective.amitdhangar.in/',
  name: 'The Human Perspective',
  url: 'https://thehumanperspective.amitdhangar.in/',
  description: 'A collection of writings and conversations dedicated to exploring the quieter, deeper currents of faith.',
  publisher: {
    '@type': 'Person',
    '@id': 'https://amitdhangar.in/',
    name: 'Amit Dhangar',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lora.variable} ${marcellus.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c'),
          }}
        />
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
        <ScrollAnimations />
      </body>
    </html>
  );
}
