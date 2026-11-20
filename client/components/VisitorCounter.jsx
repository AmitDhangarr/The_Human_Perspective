"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { getVisitorId } from "@/lib/visitor";

const fmt = (n) => Math.round(n).toLocaleString("en-US");

// Counts each browser once per day, then shows the live totals from Postgres.
export default function VisitorCounter() {
  const [stats, setStats] = useState(null);
  const totalRef = useRef(null);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    let off = false;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      let counted = false;
      try {
        counted = localStorage.getItem("thp_counted_day") === today;
      } catch {}
      const { data } = await sb.rpc("site_stats", { p_visitor: counted ? null : getVisitorId() });
      if (off || !data) return;
      try {
        localStorage.setItem("thp_counted_day", today);
      } catch {}
      setStats(data);
    })();
    return () => {
      off = true;
    };
  }, []);

  // slow count-up
  useEffect(() => {
    if (!stats || !totalRef.current) return;
    const el = totalRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fmt(stats.total);
      return;
    }
    const o = { v: 0 };
    const tween = gsap.to(o, {
      v: stats.total,
      duration: 2.4,
      ease: "power2.out",
      onUpdate: () => (el.textContent = fmt(o.v)),
    });
    return () => tween.kill();
  }, [stats]);

  if (!stats) return null;
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-3 px-6 pt-2 text-center font-label text-sm text-neutral-700">
      <span>
        <span ref={totalRef} className="text-base text-black">
          0
        </span>{" "}
        souls have visited
      </span>
      <span aria-hidden>·</span>
      <span>{fmt(stats.today)} today</span>
    </p>
  );
}
