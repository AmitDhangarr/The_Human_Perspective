"use client";

import { useState } from "react";
import Field from "@/components/Field.jsx";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { v } from "@/lib/validate";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const validate = (e = email, a = agree) => ({
    email: v.email(e),
    agree: a ? "" : "Please tick the box to confirm you'd like to subscribe.",
  });

  const submit = async (ev) => {
    ev.preventDefault();
    setFormError("");
    const errs = validate();
    setErrors(errs);
    if (errs.email) return document.getElementById("news-email")?.focus();
    if (errs.agree) return document.getElementById("news-agree")?.focus();
    const sb = getBrowserSupabase();
    if (!sb) return setFormError("Subscriptions are unavailable right now. Please try again later.");
    setBusy(true);
    const { error } = await sb.rpc("subscribe_newsletter", { p_email: email });
    setBusy(false);
    if (error) return setFormError("We couldn't subscribe you. Please try again in a moment.");
    setDone(true);
  };

  if (done) {
    return (
      <p role="status" className="w-full bg-neutral-100 p-6 text-center">
        Thank you for subscribing. New reflections will find their way to your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex w-full flex-col gap-3 text-left">
      <Field
        id="news-email"
        label="Email*"
        type="email"
        inputMode="email"
        value={email}
        maxLength={254}
        autoComplete="email"
        error={errors.email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((p) => ({ ...p, email: validate(e.target.value).email }));
        }}
        onBlur={() => setErrors((p) => ({ ...p, email: validate().email }))}
      />
      <div>
        <label className="flex items-start gap-2.5">
          <input
            id="news-agree"
            type="checkbox"
            checked={agree}
            aria-invalid={errors.agree ? true : undefined}
            aria-describedby={errors.agree ? "news-agree-error" : undefined}
            onChange={(e) => {
              setAgree(e.target.checked);
              if (errors.agree) setErrors((p) => ({ ...p, agree: validate(email, e.target.checked).agree }));
            }}
            className="mt-1.5"
          />
          <span>I want to subscribe to your newsletter</span>
        </label>
        <p id="news-agree-error" role="alert" className={`mt-1.5 text-sm text-red-700 ${errors.agree ? "" : "hidden"}`}>
          {errors.agree}
        </p>
      </div>
      <p role="alert" className={`text-sm text-red-700 ${formError ? "" : "hidden"}`}>{formError}</p>
      <button type="submit" disabled={busy} className="bg-black p-3 font-label text-white transition-colors duration-500 hover:bg-neutral-800 disabled:opacity-50">
        {busy ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
