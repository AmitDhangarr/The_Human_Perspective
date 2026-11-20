"use client";

import { useEffect, useState } from "react";
import ShareBar from "@/components/ShareBar.jsx";
import PostStats from "@/components/PostStats.jsx";
import Comments from "@/components/Comments.jsx";
import { HeartIcon, BookmarkIcon } from "@/components/icons.jsx";
import { useAuth } from "@/components/auth/AuthProvider.jsx";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { getVisitorId } from "@/lib/visitor";

const norm = (r) => ({
  views: Number(r.views) || 0,
  likes: Number(r.likes) || 0,
  saves: Number(r.saves) || 0,
  comments: Number(r.comments) || 0,
  shares: Number(r.shares) || 0,
});

const action =
  "inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-1.5 font-label text-sm transition-colors duration-500 hover:bg-black/[0.05]";

// Everything interactive under a post: view tracking, like, save, share, stats, comments.
export default function PostEngagement({ slug, title, initial }) {
  const sb = getBrowserSupabase();
  const { user, openAuth } = useAuth();
  const [stats, setStats] = useState(norm(initial || {}));
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // count this visit (once per visitor per day), then show the fresh numbers
  useEffect(() => {
    if (!sb) return;
    let off = false;
    (async () => {
      await sb.rpc("record_view", { p_slug: slug, p_visitor: getVisitorId() });
      const { data } = await sb.rpc("post_stats", { p_slugs: [slug] });
      if (!off && data?.[0]) setStats(norm(data[0]));
    })();
    return () => {
      off = true;
    };
  }, [sb, slug]);

  // did this user already like / save it?  (RLS only returns their own rows)
  useEffect(() => {
    if (!sb || !user) {
      setLiked(false);
      setSaved(false);
      return;
    }
    let off = false;
    Promise.all([
      sb.from("post_likes").select("post_slug").eq("post_slug", slug).maybeSingle(),
      sb.from("post_saves").select("post_slug").eq("post_slug", slug).maybeSingle(),
    ]).then(([l, s]) => {
      if (off) return;
      setLiked(!!l.data);
      setSaved(!!s.data);
    });
    return () => {
      off = true;
    };
  }, [sb, user?.id, slug]);

  const toggle = async (kind) => {
    if (!sb) return;
    if (!user) {
      return openAuth(
        "signin",
        kind === "likes" ? "Sign in to like this reflection." : "Sign in to save this reflection."
      );
    }
    const isLike = kind === "likes";
    const table = isLike ? "post_likes" : "post_saves";
    const on = isLike ? liked : saved;
    const setOn = isLike ? setLiked : setSaved;
    const bump = (d) => setStats((s) => ({ ...s, [kind]: Math.max(0, s[kind] + d) }));

    setOn(!on);
    bump(on ? -1 : 1);
    const { error } = on
      ? await sb.from(table).delete().eq("post_slug", slug).eq("user_id", user.id)
      : await sb.from(table).insert({ post_slug: slug });
    if (error && error.code !== "23505") {
      setOn(on); // roll back
      bump(on ? 1 : -1);
    }
  };

  const onShare = (channel) => {
    sb?.rpc("record_share", { p_slug: slug, p_channel: channel });
    setStats((s) => ({ ...s, shares: s.shares + 1 }));
  };

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-black/20 pt-3">
        <ShareBar title={title} onShare={onShare} />
        <div className="flex items-center gap-2">
          <button type="button" aria-pressed={liked} onClick={() => toggle("likes")} className={action}>
            <HeartIcon className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
            {liked ? "Liked" : "Like"}
          </button>
          <button type="button" aria-pressed={saved} onClick={() => toggle("saves")} className={action}>
            <BookmarkIcon className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <PostStats
        views={stats.views}
        comments={stats.comments}
        likes={stats.likes}
        showLabels
        className="mt-3 border-t border-black/20 pt-4"
      />

      <Comments
        slug={slug}
        onCountChange={(d) => setStats((s) => ({ ...s, comments: Math.max(0, s.comments + d) }))}
      />
    </>
  );
}
