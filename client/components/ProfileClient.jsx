"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import PostCard from "@/components/PostCard.jsx";
import Field from "@/components/Field.jsx";
import { PencilIcon } from "@/components/icons.jsx";
import { v, hasErrors } from "@/lib/validate";
import { useAuth } from "@/components/auth/AuthProvider.jsx";
import { getBrowserSupabase } from "@/lib/supabase/client";

const TABS = [
  { id: "saved", label: "Saved" },
  { id: "liked", label: "Liked" },
  { id: "comments", label: "My Comments" },
];
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function ProfileClient({ posts }) {
  const sb = getBrowserSupabase();
  const { user, profile, loading, displayName, openAuth, signOut, updateProfile } = useAuth();
  const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

  const [tab, setTab] = useState("saved");
  const [saved, setSaved] = useState([]);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);
  const [busy, setBusy] = useState(true);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (TABS.some((x) => x.id === t)) setTab(t);
  }, []);

  useEffect(() => {
    setName(profile?.display_name || "");
    setBio(profile?.bio || "");
  }, [profile]);

  const load = useCallback(async () => {
    if (!sb || !user) return setBusy(false);
    const [s, l, c] = await Promise.all([
      sb.from("post_saves").select("post_slug, created_at").order("created_at", { ascending: false }),
      sb.from("post_likes").select("post_slug, created_at").order("created_at", { ascending: false }),
      sb.from("comments").select("id, body, post_slug, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setSaved(s.data || []);
    setLiked(l.data || []);
    setComments(c.data || []);
    setBusy(false);
  }, [sb, user]);

  useEffect(() => {
    load();
  }, [load]);

  // gentle fade on first paint and on tab change
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.current.querySelectorAll("[data-fade]"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power2.out" });
  }, [tab, busy, user?.id]);

  const unsave = async (slug) => {
    const { error } = await sb.from("post_saves").delete().eq("post_slug", slug).eq("user_id", user.id);
    if (!error) setSaved((l) => l.filter((x) => x.post_slug !== slug));
  };
  const delComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    const { error } = await sb.from("comments").delete().eq("id", id);
    if (!error) setComments((l) => l.filter((x) => x.id !== id));
  };
  const validate = (n = name, b = bio) => ({
    name: v.displayName(n),
    bio: v.text(b, { label: "your note", max: 280, required: false }),
  });
  const startEdit = () => {
    setName(profile?.display_name || displayName);
    setBio(profile?.bio || "");
    setErrors({});
    setMsg("");
    setEditing(true);
  };
  const saveProfile = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (hasErrors(errs)) return document.getElementById(errs.name ? "profile-name" : "profile-bio")?.focus();
    setSaving(true);
    const { error } = await updateProfile({ display_name: name.trim(), bio });
    setSaving(false);
    if (error) return setErrors({ form: "We couldn't save your changes. Please try again." });
    setEditing(false);
    setMsg("Profile updated");
    setTimeout(() => setMsg(""), 3000);
  };

  if (loading) return <p className="px-6 py-24 text-center font-label">Loading...</p>;

  if (!user) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-24 text-center">
        <h1 className="font-display text-4xl md:text-5xl">Your Sanctuary</h1>
        <p>Sign in to see the reflections you have saved, liked and discussed.</p>
        <button
          type="button"
          onClick={() => openAuth("signin")}
          className="bg-black px-6 py-3 font-label text-white transition-colors duration-500 hover:bg-neutral-800"
        >
          Login
        </button>
      </section>
    );
  }

  const list = tab === "saved" ? saved : liked;

  return (
    <div ref={root} className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
      <div data-fade className="flex flex-col items-center gap-4 text-center">
        <span aria-hidden className="flex h-20 w-20 items-center justify-center rounded-full bg-black font-display text-4xl text-white">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <div className="flex items-center justify-center gap-2">
          <h1 className="font-display text-4xl md:text-5xl">{displayName}</h1>
          {!editing && (
            <button
              type="button"
              onClick={startEdit}
              aria-label="Edit profile"
              title="Edit profile"
              className="rounded-full p-2 transition-colors duration-500 hover:bg-black/[0.06]"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="font-label text-sm text-neutral-600">
          {user.email}
          {profile?.created_at && ` · Walking with us since ${dateFmt.format(new Date(profile.created_at))}`}
        </p>
        {editing ? (
          <form onSubmit={saveProfile} noValidate className="flex w-full max-w-md flex-col gap-4 text-left">
            <Field
              id="profile-name"
              label="Display name"
              value={name}
              maxLength={60}
              autoComplete="nickname"
              error={errors.name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: validate(e.target.value, bio).name }));
              }}
              onBlur={() => setErrors((p) => ({ ...p, name: validate().name }))}
            />
            <Field
              as="textarea"
              id="profile-bio"
              label="About you"
              rows={3}
              value={bio}
              maxLength={280}
              error={errors.bio}
              hint={`${bio.length}/280`}
              onChange={(e) => {
                setBio(e.target.value);
                if (errors.bio) setErrors((p) => ({ ...p, bio: validate(name, e.target.value).bio }));
              }}
              onBlur={() => setErrors((p) => ({ ...p, bio: validate().bio }))}
            />
            <p role="alert" className={`text-sm text-red-700 ${errors.form ? "" : "hidden"}`}>{errors.form}</p>
            <div className="flex items-center gap-5">
              <button type="submit" disabled={saving} className="bg-black px-6 py-2.5 font-label text-white transition-colors duration-500 hover:bg-neutral-800 disabled:opacity-50">
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="font-label underline underline-offset-4 hover:opacity-60">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          profile?.bio && <p className="max-w-xl">{profile.bio}</p>
        )}
        <p role="status" className="h-5 font-label text-sm text-neutral-600">{msg}</p>
        <div className="flex gap-8 font-label text-sm">
          <span><strong className="text-lg">{saved.length}</strong> saved</span>
          <span><strong className="text-lg">{liked.length}</strong> liked</span>
          <span><strong className="text-lg">{comments.length}</strong> comments</span>
        </div>
      </div>

      <div className="mt-10 flex justify-center border-b border-black/20" role="tablist" aria-label="Profile sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 font-label transition-opacity duration-500 ${tab === t.id ? "border-b-2 border-black" : "opacity-55 hover:opacity-100"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10" role="tabpanel">
        {busy ? (
          <p className="text-center font-label text-sm text-neutral-500">Gathering your reflections...</p>
        ) : tab === "comments" ? (
          comments.length === 0 ? (
            <p data-fade className="text-center">You haven&apos;t commented yet. <Link href="/blog" className="underline underline-offset-4">Visit the journal</Link>.</p>
          ) : (
            <ul className="mx-auto flex max-w-2xl flex-col gap-6">
              {comments.map((c) => (
                <li data-fade key={c.id} className="border-t border-black/15 pt-5">
                  <p className="font-label text-sm text-neutral-600">
                    On{" "}
                    <Link href={`/blog/${c.post_slug}`} className="text-black underline underline-offset-4">
                      {bySlug[c.post_slug]?.title || c.post_slug}
                    </Link>
                    {" · "}{dayFmt.format(new Date(c.created_at))}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words leading-7">{c.body}</p>
                  <button type="button" onClick={() => delComment(c.id)} className="mt-2 font-label text-xs underline underline-offset-4 hover:opacity-60">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )
        ) : list.length === 0 ? (
          <p data-fade className="text-center">
            {tab === "saved" ? "Nothing saved yet." : "Nothing liked yet."}{" "}
            <Link href="/blog" className="underline underline-offset-4">Explore the journal</Link>.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((row) => {
              const post = bySlug[row.post_slug];
              if (!post) return null;
              return (
                <div data-fade key={row.post_slug}>
                  <PostCard post={post} />
                  {tab === "saved" && (
                    <button type="button" onClick={() => unsave(row.post_slug)} className="mx-auto mt-2 block font-label text-xs underline underline-offset-4 hover:opacity-60">
                      Remove from saved
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div data-fade className="mt-16 border-t border-black/20 pt-8 text-center">
        <button type="button" onClick={signOut} className="font-label underline underline-offset-4 hover:opacity-60">
          Sign out
        </button>
      </div>
    </div>
  );
}
