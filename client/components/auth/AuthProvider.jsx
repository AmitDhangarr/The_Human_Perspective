"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default function AuthProvider({ children }) {
  const sb = getBrowserSupabase();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "signin", reason: "" });

  // session -> user (kept in sync across tabs by supabase-js)
  useEffect(() => {
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [sb]);

  // user -> profile row
  const loadProfile = useCallback(async () => {
    if (!sb || !user) return setProfile(null);
    const { data } = await sb
      .from("profiles")
      .select("id, display_name, bio, created_at")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(data ?? null);
  }, [sb, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const openAuth = useCallback(
    (mode = "signin", reason = "") => setModal({ open: true, mode, reason }),
    []
  );
  const closeAuth = useCallback(() => setModal((m) => ({ ...m, open: false })), []);

  const notConfigured = { error: { message: "Login is not configured yet (missing Supabase keys)." } };

  const signIn = useCallback(
    async (email, password) => (sb ? sb.auth.signInWithPassword({ email, password }) : notConfigured),
    [sb]
  );

  const signUp = useCallback(
    async (email, password, displayName) =>
      sb
        ? sb.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: displayName },
              emailRedirectTo: `${window.location.origin}/profile`,
            },
          })
        : notConfigured,
    [sb]
  );

  const resetPassword = useCallback(
    async (email) =>
      sb
        ? sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
        : notConfigured,
    [sb]
  );

  const signOut = useCallback(async () => {
    if (sb) await sb.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [sb]);

  const updateProfile = useCallback(
    async ({ display_name, bio }) => {
      if (!sb || !user) return { error: { message: "Not signed in" } };
      const { error } = await sb
        .from("profiles")
        .update({ display_name: display_name.trim(), bio: bio?.trim() || null })
        .eq("id", user.id);
      if (!error) await loadProfile();
      return { error };
    },
    [sb, user, loadProfile]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      configured: !!sb,
      displayName: profile?.display_name || user?.user_metadata?.display_name || user?.email?.split("@")[0] || "",
      modal,
      openAuth,
      closeAuth,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updateProfile,
    }),
    [user, profile, loading, sb, modal, openAuth, closeAuth, signIn, signUp, signOut, resetPassword, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
