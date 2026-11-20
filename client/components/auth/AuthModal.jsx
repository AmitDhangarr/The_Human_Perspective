"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAuth } from "@/components/auth/AuthProvider.jsx";
import Field from "@/components/Field.jsx";
import { CloseIcon } from "@/components/icons.jsx";
import { v, hasErrors, focusFirst, friendlyAuthError } from "@/lib/validate";

const TITLES = { signin: "Welcome back", signup: "Begin your journey", forgot: "Reset your password" };
const IDS = { name: "auth-name", email: "auth-email", password: "auth-password", confirm: "auth-confirm" };

export default function AuthModal() {
  const { modal, openAuth, closeAuth, signIn, signUp, resetPassword, configured } = useAuth();
  const { open, mode, reason } = modal;
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const panel = useRef(null);
  const backdrop = useRef(null);

  const validate = (vals = values) => {
    const e = { email: v.email(vals.email) };
    if (mode === "signup") {
      e.name = v.displayName(vals.name);
      e.password = v.password(vals.password, { signup: true });
      e.confirm = v.confirm(vals.confirm, vals.password);
    } else if (mode === "signin") {
      e.password = v.password(vals.password);
    }
    return e;
  };

  const set = (key) => (e) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    // once a field has shown an error, re-check it while the person types
    if (errors[key]) setErrors((p) => ({ ...p, [key]: validate(next)[key] }));
    if (key === "password" && errors.confirm) setErrors((p) => ({ ...p, confirm: validate(next).confirm }));
  };
  const blur = (key) => () => setErrors((p) => ({ ...p, [key]: validate()[key] }));

  // reset state whenever the window opens or the mode changes; soft entrance
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setFormError("");
    setNotice("");
    setValues((x) => ({ ...x, password: "", confirm: "" }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      gsap.fromTo(panel.current, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power2.out" });
    }
    const t = setTimeout(() => document.getElementById(mode === "signup" ? IDS.name : IDS.email)?.focus(), 150);
    return () => clearTimeout(t);
  }, [open, mode]);

  // fade backdrop only when opening
  useEffect(() => {
    if (open && backdrop.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(backdrop.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "sine.out" });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeAuth();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeAuth]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    setNotice("");
    const errs = validate();
    setErrors(errs);
    if (hasErrors(errs)) return focusFirst(errs, IDS);

    setBusy(true);
    try {
      const email = values.email.trim();
      if (mode === "signin") {
        const { error } = await signIn(email, values.password);
        if (error) setFormError(friendlyAuthError(error.message));
        else closeAuth();
      } else if (mode === "signup") {
        const { data, error } = await signUp(email, values.password, values.name.trim());
        if (error) setFormError(friendlyAuthError(error.message));
        else if (data?.user && data.user.identities?.length === 0)
          setFormError("An account with this email already exists. Try signing in instead.");
        else if (data?.session) closeAuth();
        else setNotice("Almost there. We sent a confirmation link to your email. Open it to finish signing up.");
      } else {
        const { error } = await resetPassword(email);
        if (error) setFormError(friendlyAuthError(error.message));
        else setNotice("If that email has an account, a reset link is on its way.");
      }
    } finally {
      setBusy(false);
    }
  };

  const switchTo = (m) => () => openAuth(m, reason);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div ref={backdrop} onClick={closeAuth} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto bg-white p-7 shadow-2xl md:p-10"
      >
        <button type="button" onClick={closeAuth} aria-label="Close" className="absolute right-3 top-3 p-2 hover:opacity-60">
          <CloseIcon className="h-6 w-6" />
        </button>

        <h2 id="auth-title" className="text-center font-display text-3xl md:text-4xl">
          {TITLES[mode]}
        </h2>
        {reason && mode !== "forgot" && <p className="mt-2 text-center text-sm text-neutral-600">{reason}</p>}
        {!configured && (
          <p role="alert" className="mt-4 bg-neutral-100 p-3 text-center text-sm">
            Login is not connected yet. Add your Supabase keys to .env.local.
          </p>
        )}

        <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4 text-left">
          {mode === "signup" && (
            <Field id={IDS.name} label="Name" value={values.name} onChange={set("name")} onBlur={blur("name")} error={errors.name} maxLength={60} autoComplete="name" placeholder="How should we greet you?" />
          )}
          <Field id={IDS.email} label="Email" type="email" inputMode="email" value={values.email} onChange={set("email")} onBlur={blur("email")} error={errors.email} maxLength={254} autoComplete="email" />
          {mode !== "forgot" && (
            <Field
              id={IDS.password}
              label="Password"
              type="password"
              value={values.password}
              onChange={set("password")}
              onBlur={blur("password")}
              error={errors.password}
              maxLength={72}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              hint={mode === "signup" ? "At least 8 characters, with a letter and a number." : undefined}
            />
          )}
          {mode === "signup" && (
            <Field id={IDS.confirm} label="Confirm password" type="password" value={values.confirm} onChange={set("confirm")} onBlur={blur("confirm")} error={errors.confirm} maxLength={72} autoComplete="new-password" />
          )}

          <p role="alert" aria-live="polite" className={`text-sm text-red-700 ${formError ? "" : "hidden"}`}>
            {formError}
          </p>
          {notice && (
            <p role="status" className="bg-neutral-100 p-3 text-sm">
              {notice}
            </p>
          )}

          <button type="submit" disabled={busy || !configured} className="bg-black p-3 font-label tracking-wide text-white transition-colors duration-500 hover:bg-neutral-800 disabled:opacity-50">
            {busy ? "One moment..." : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          {mode === "signin" && (
            <>
              <button type="button" onClick={switchTo("forgot")} className="underline underline-offset-4">Forgot your password?</button>
              <p>New here? <button type="button" onClick={switchTo("signup")} className="underline underline-offset-4">Create an account</button></p>
            </>
          )}
          {mode === "signup" && (
            <p>Already have an account? <button type="button" onClick={switchTo("signin")} className="underline underline-offset-4">Sign in</button></p>
          )}
          {mode === "forgot" && (
            <button type="button" onClick={switchTo("signin")} className="underline underline-offset-4">Back to sign in</button>
          )}
        </div>
      </div>
    </div>
  );
}
