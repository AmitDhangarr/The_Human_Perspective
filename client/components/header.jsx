"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import logo from "@/app/assests/home/logo.png";
import { MenuIcon, CloseIcon, ChevronIcon } from "@/components/icons.jsx";
import { useAuth } from "@/components/auth/AuthProvider.jsx";

const links = [
  { href: "/about", label: "About" },
  { href: "/podcast", label: "Podcast" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const linkCls =
  "rounded-full px-4 py-1.5 font-label text-[15px] tracking-wide transition-colors duration-500 hover:bg-black/[0.06]";

function UserMenu({ onNavigate }) {
  const { user, displayName, signOut, openAuth, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const away = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (loading) return <span className="h-9 w-20" aria-hidden />;

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuth("signin")}
        className="rounded-full bg-black px-5 py-1.5 font-label text-[15px] tracking-wide text-white transition-colors duration-500 hover:bg-neutral-800"
      >
        Login
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2 hover:bg-black/[0.06]"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black font-display text-lg text-white"
        >
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="sr-only">Account menu for {displayName}</span>
        <ChevronIcon className={`h-4 w-4 transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-3 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white py-2 shadow-xl"
        >
          <p className="truncate px-4 pb-2 pt-1 font-display text-lg">{displayName}</p>
          <Link
            role="menuitem"
            href="/profile"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="block px-4 py-2 font-label hover:bg-black/[0.05]"
          >
            My Profile
          </Link>
          <Link
            role="menuitem"
            href="/profile?tab=saved"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="block px-4 py-2 font-label hover:bg-black/[0.05]"
          >
            Saved Reflections
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="block w-full px-4 py-2 text-left font-label hover:bg-black/[0.05]"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/*
  Floating glass navbar. It is fixed with a margin from the top, so on pages
  that start with a hero image (pass `overlay`) it sits right on top of the
  hero. On other pages a spacer keeps the content below it.
*/
function Header({ overlay = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrap = useRef(null);
  const panel = useRef(null);
  const pathname = usePathname();
  const close = () => setOpen(false);

  // gentle entrance
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(wrap.current, { y: -36, autoAlpha: 0, duration: 1.6, delay: 0.3, ease: "power3.out" });
    });
    return () => mm.revert();
  }, []);

  // bar becomes a little more solid after leaving the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open && panel.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(panel.current, { y: -12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" });
    }
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const active = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div ref={wrap} className="fixed inset-x-0 top-3 z-40 px-3 md:top-6 md:px-8">
        <header className="mx-auto max-w-6xl">
          <nav
            aria-label="Main"
            className={`flex items-center justify-between gap-3 rounded-full border px-3 py-1.5 backdrop-blur-xl transition-all duration-700 md:px-5 ${
              scrolled
                ? "border-black/10 bg-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
                : "border-white/60 bg-white/65 shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
            }`}
          >
            <Link href="/" onClick={close} aria-label="The Human Perspective - home" className="flex items-center gap-3">
              <Image className="h-10 w-auto md:h-12" src={logo} alt="the_human_perspective_logo" priority />
              <span className="hidden font-display text-xl font-medium leading-none tracking-wide lg:inline">
                The Human Perspective
              </span>
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active(l.href) ? "page" : undefined}
                    className={`${linkCls} ${active(l.href) ? "bg-black/[0.07]" : ""}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <UserMenu onNavigate={close} />
              <button
                type="button"
                className="p-2 md:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
              </button>
            </div>
          </nav>

          {open && (
            <div
              ref={panel}
              id="mobile-menu"
              className="mt-2 rounded-3xl border border-white/60 bg-white/90 p-3 shadow-xl backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col font-label">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={close} className="block rounded-2xl px-4 py-3 hover:bg-black/[0.05]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>
      </div>
      {!overlay && <div aria-hidden className="h-20 md:h-28" />}
    </>
  );
}

export default Header;
