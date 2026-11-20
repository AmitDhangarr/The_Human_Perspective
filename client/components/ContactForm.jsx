"use client";

import { useState } from "react";
import Field from "@/components/Field.jsx";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { v, hasErrors, focusFirst } from "@/lib/validate";

const IDS = { first: "first-name", last: "last-name", email: "contact-email", message: "message" };
const empty = { first: "", last: "", email: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (x = values) => ({
    first: v.person(x.first, "first name"),
    last: v.person(x.last, "last name"),
    email: v.email(x.email),
    message: v.text(x.message, { label: "a message", min: 10, max: 2000 }),
  });
  const set = (k) => (e) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (errors[k]) setErrors((p) => ({ ...p, [k]: validate(next)[k] }));
  };
  const blur = (k) => () => setErrors((p) => ({ ...p, [k]: validate()[k] }));

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    const errs = validate();
    setErrors(errs);
    if (hasErrors(errs)) return focusFirst(errs, IDS);
    const sb = getBrowserSupabase();
    if (!sb) return setFormError("Messages can't be sent right now. Please try again later.");
    setBusy(true);
    const { error } = await sb.rpc("submit_contact", {
      p_first: values.first,
      p_last: values.last,
      p_email: values.email,
      p_message: values.message,
    });
    setBusy(false);
    if (error) return setFormError("We couldn't send your message. Please try again in a moment.");
    setValues(empty);
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="mt-10 w-full bg-neutral-100 p-8 text-center">
        <h2 className="font-display text-3xl">Thank you</h2>
        <p className="mt-3">Your message has reached us. We will reply to you soon.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-5 font-label underline underline-offset-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-10 flex w-full flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={IDS.first} label="First Name *" value={values.first} onChange={set("first")} onBlur={blur("first")} error={errors.first} maxLength={50} autoComplete="given-name" />
        <Field id={IDS.last} label="Last Name *" value={values.last} onChange={set("last")} onBlur={blur("last")} error={errors.last} maxLength={50} autoComplete="family-name" />
      </div>
      <Field id={IDS.email} label="Email Address *" type="email" inputMode="email" value={values.email} onChange={set("email")} onBlur={blur("email")} error={errors.email} maxLength={254} autoComplete="email" />
      <Field as="textarea" id={IDS.message} label="Message *" rows={5} value={values.message} onChange={set("message")} onBlur={blur("message")} error={errors.message} maxLength={2000} className="resize-none" hint={`${values.message.length}/2000`} />
      <p role="alert" className={`text-sm text-red-700 ${formError ? "" : "hidden"}`}>{formError}</p>
      <button type="submit" disabled={busy} className="bg-black p-3 font-label text-white transition-colors duration-500 hover:bg-neutral-800 disabled:opacity-50">
        {busy ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
