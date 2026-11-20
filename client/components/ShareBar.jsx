"use client";

import { useState } from "react";
import {
  FacebookIcon,
  XIcon,
  LinkedInIcon,
  LinkIcon,
} from "@/components/icons.jsx";

// onShare(channel) is called after a share is started - the post page uses it
// to record the share in the database.
export default function ShareBar({ title = "", onShare }) {
  const [copied, setCopied] = useState(false);

  const share = (channel, build) => () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      build(url, encodeURIComponent(title)),
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
    onShare?.(channel);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      onShare?.("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked - nothing to do */
    }
  };

  const btn =
    "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 hover:bg-black/5";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className={btn}
        aria-label="Share on Facebook"
        onClick={share("facebook", (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`)}
      >
        <FacebookIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={btn}
        aria-label="Share on X"
        onClick={share("x", (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`)}
      >
        <XIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={btn}
        aria-label="Share on LinkedIn"
        onClick={share("linkedin", (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`)}
      >
        <LinkedInIcon className="h-5 w-5" />
      </button>
      <button type="button" className={btn} aria-label="Copy link" onClick={copy}>
        <LinkIcon className="h-5 w-5" />
      </button>
      <span role="status" className="pl-2 font-label text-xs text-neutral-600">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
