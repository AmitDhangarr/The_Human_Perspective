"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAuth } from "@/components/auth/AuthProvider.jsx";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { v } from "@/lib/validate";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const SELECT = "id, body, created_at, updated_at, parent_id, user_id, profiles(display_name)";
const box = "w-full border border-black bg-white p-3 text-base";
const smallBtn = "font-label text-xs underline underline-offset-4 hover:opacity-60";

function Avatar({ name }) {
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 font-display text-base text-white"
    >
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function Composer({ placeholder, onSubmit, onCancel, autoFocus, initial = "", submitLabel = "Post" }) {
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const problem = v.text(text, { label: "a comment", min: 2, max: 2000 });
    if (problem) return setErr(problem);
    setBusy(true);
    setErr("");
    const error = await onSubmit(text.trim());
    setBusy(false);
    if (error) setErr(error.message || "Something went wrong. Please try again.");
    else if (!initial) setText("");
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2">
      <textarea
        className={box}
        rows={3}
        maxLength={2000}
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => {
          setText(e.target.value);
          if (err) setErr("");
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-invalid={err ? true : undefined}
      />
      {err && (
        <p role="alert" className="text-sm text-red-700">
          {err}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="bg-black px-5 py-2 font-label text-sm text-white transition-colors duration-500 hover:bg-neutral-800 disabled:opacity-40"
        >
          {busy ? "Posting..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={smallBtn}>
            Cancel
          </button>
        )}
        <span className="ml-auto font-label text-xs text-neutral-500">{text.length}/2000</span>
      </div>
    </form>
  );
}

export default function Comments({ slug, onCountChange }) {
  const sb = getBrowserSupabase();
  const { user, openAuth } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const listRef = useRef(null);
  const animated = useRef(false);

  const load = useCallback(async () => {
    if (!sb) return setLoading(false);
    const { data } = await sb.from("comments").select(SELECT).eq("post_slug", slug).order("created_at", { ascending: true });
    setItems(data || []);
    setLoading(false);
  }, [sb, slug]);

  useEffect(() => {
    load();
  }, [load]);

  // soft reveal of the first batch
  useEffect(() => {
    if (loading || animated.current || !listRef.current?.children.length) return;
    animated.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(listRef.current.children, { y: 22, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: "power2.out" });
  }, [loading, items]);

  const requireLogin = () => {
    openAuth("signin", "Sign in to join the conversation.");
  };

  const add = (parentId) => async (body) => {
    if (!user) return requireLogin();
    const { data, error } = await sb
      .from("comments")
      .insert({ post_slug: slug, body, parent_id: parentId || null })
      .select(SELECT)
      .single();
    if (error) return error;
    setItems((l) => [...l, data]);
    setReplyTo(null);
    onCountChange?.(1);
    return null;
  };

  const save = (id) => async (body) => {
    const { data, error } = await sb.from("comments").update({ body }).eq("id", id).select(SELECT).single();
    if (error) return error;
    setItems((l) => l.map((c) => (c.id === id ? data : c)));
    setEditing(null);
    return null;
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    const { error } = await sb.from("comments").delete().eq("id", id);
    if (error) return;
    const gone = new Set([id, ...items.filter((c) => c.parent_id === id).map((c) => c.id)]);
    setItems((l) => l.filter((c) => !gone.has(c.id)));
    onCountChange?.(-gone.size);
  };

  const top = items.filter((c) => !c.parent_id).reverse(); // newest first
  const repliesOf = (id) => items.filter((c) => c.parent_id === id);

  const renderOne = (c, isReply) => {
    const mine = user?.id === c.user_id;
    const name = c.profiles?.display_name || "Seeker";
    return (
      <li key={c.id} className={isReply ? "mt-5 flex gap-3" : "flex gap-3 border-t border-black/15 pt-6"}>
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <p className="font-label text-sm">
            <span className="text-black">{name}</span>
            <span className="text-neutral-500">
              {" · "}
              {dateFmt.format(new Date(c.created_at))}
              {c.updated_at !== c.created_at && " · edited"}
            </span>
          </p>

          {editing === c.id ? (
            <div className="mt-2">
              <Composer initial={c.body} submitLabel="Save" onSubmit={save(c.id)} onCancel={() => setEditing(null)} autoFocus />
            </div>
          ) : (
            <p className="mt-1.5 whitespace-pre-wrap break-words leading-7 text-neutral-800">{c.body}</p>
          )}

          {editing !== c.id && (
            <div className="mt-2 flex items-center gap-4">
              {!isReply && (
                <button type="button" className={smallBtn} onClick={() => (user ? setReplyTo(replyTo === c.id ? null : c.id) : requireLogin())}>
                  Reply
                </button>
              )}
              {mine && (
                <>
                  <button type="button" className={smallBtn} onClick={() => setEditing(c.id)}>
                    Edit
                  </button>
                  <button type="button" className={smallBtn} onClick={() => remove(c.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {replyTo === c.id && (
            <div className="mt-3">
              <Composer placeholder={`Reply to ${name}`} submitLabel="Reply" onSubmit={add(c.id)} onCancel={() => setReplyTo(null)} autoFocus />
            </div>
          )}

          {!isReply && repliesOf(c.id).length > 0 && (
            <ul className="mt-2">{repliesOf(c.id).map((r) => renderOne(r, true))}</ul>
          )}
        </div>
      </li>
    );
  };

  return (
    <section aria-labelledby="comments-title" className="mt-10 border-t border-black/20 pt-8">
      <h2 id="comments-title" className="font-display text-2xl md:text-3xl">
        Reflections &amp; Comments
      </h2>

      <div className="mt-5">
        {user ? (
          <Composer placeholder="Share your thoughts..." onSubmit={add(null)} />
        ) : (
          <div className="flex flex-col items-start gap-3 bg-neutral-100 p-5">
            <p>Sign in to add your voice to this conversation.</p>
            <button
              type="button"
              onClick={requireLogin}
              className="bg-black px-5 py-2 font-label text-sm text-white transition-colors duration-500 hover:bg-neutral-800"
            >
              Login to comment
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="font-label text-sm text-neutral-500">Gathering reflections...</p>
        ) : top.length === 0 ? (
          <p className="text-neutral-600">No comments yet. Be the first to share a thought.</p>
        ) : (
          <ul ref={listRef} className="flex flex-col gap-6">
            {top.map((c) => renderOne(c, false))}
          </ul>
        )}
      </div>
    </section>
  );
}
