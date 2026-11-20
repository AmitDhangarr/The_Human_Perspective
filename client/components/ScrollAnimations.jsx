"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  One component, mounted once in app/layout.tsx. It animates anything that
  carries a data-anim attribute, so pages stay server components and any
  CMS-driven element can opt in just by adding the attribute:

    data-anim="fade-up"   text / blocks rise and fade in (optional data-delay="0.2")
    data-anim="image"     image wrapper is revealed with a wipe + slow zoom-out
    data-anim="parallax"  wrapper with overflow-hidden; its <img> drifts on scroll
    data-anim="stagger"   children of this element fade up one after another
    data-anim="mist"      hero text: drifts in out of a soft blur on page load (data-delay)
    data-anim="float"     decorative element that slowly drifts up and down, like breath

  Nothing runs for visitors who prefer reduced motion.
*/
const num = (v, fallback = 0) => {
  const n = parseFloat(v);
  return Number.isNaN(n) ? fallback : n;
};

export default function ScrollAnimations() {
  const pathname = usePathname();
  const fromHistory = useRef(false);

  // Always open a new page at the top. (Back / forward keeps the browser's own
  // remembered position.) Runs before the animations are set up.
  useEffect(() => {
    const onPop = () => (fromHistory.current = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const all = (name) => gsap.utils.toArray(`[data-anim="${name}"]`);

      all("fade-up").forEach((el) => {
        gsap.from(el, {
          y: 26,
          autoAlpha: 0,
          duration: 1.6,
          delay: num(el.dataset.delay),
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      all("mist").forEach((el) => {
        gsap.from(el, {
          y: 22,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 2.2,
          delay: num(el.dataset.delay),
          ease: "power2.out",
          clearProps: "filter",
        });
      });

      all("float").forEach((el, i) => {
        gsap.to(el, {
          y: -12,
          duration: 4.5 + (i % 3) * 0.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      all("stagger").forEach((el) => {
        gsap.from(el.children, {
          y: 26,
          autoAlpha: 0,
          duration: 1.4,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      all("image").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({
          delay: num(el.dataset.delay),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
        tl.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.8,
            ease: "power2.inOut",
            onComplete: () => gsap.set(el, { clearProps: "clipPath" }),
          }
        );
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.12 },
            { scale: 1, duration: 2.6, ease: "power2.out" },
            0
          );
        }
      });

      all("parallax").forEach((el) => {
        const img = el.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6, // the image trails the scroll a little, like a held breath
            },
          }
        );
      });
    });

    // layout is fixed by aspect ratios, but fonts can shift things slightly
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const raf = requestAnimationFrame(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      cancelAnimationFrame(raf);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
