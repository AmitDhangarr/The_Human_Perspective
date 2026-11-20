"use client";

import { useState } from "react";
import Link from "next/link";
import Field from "@/components/Field.jsx";
import { useAuth } from "@/components/auth/AuthProvider.jsx";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { v, hasErrors, focusFirst, friendlyAuthError } from "@/lib/validate";

const IDS = { password: "reset-password", confirm: "reset-confirm" };

// The email link signs the person in temporarily; here they choose a new password.
export default function ResetPasswordForm() {
  const sb = getBrowserSupabase();
  const { user, loading } = useAuth();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const validate = (p = pw, c = confirm) => ({
    password: v.password(p, { signup: true }),
    confirm: v.confirm(c, p),
  });

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    const errs = validate();
    setErrors(errs);
    if (hasErrors(errs)) return focusFirst(errs, IDS);
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) setFormError(friendlyAuthError(error.message));
    else setDone(true);
  };

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-5 px-6 py-16 text-center">
      <h1 className="font-display text-4xl">Choose a new password</h1>
      {done ? (
        <p>
          Your password has been updated.{" "}
          <Link href="/profile" className="underline underline-offset-4">Go to your profile</Link>.
        </p>
      ) : loading ? (
        <p className="font-label">Loading...</p>
      ) : !user ? (
        <p>This link has expired or was already used. Request a new one from the login window.</p>
      ) : (
        <form onSubmit={submit} noValidate className="flex w-full flex-col gap-4 text-left">
          <Field id={IDS.password} label="New password" type="password" value={pw} maxLength={72} autoComplete="new-password"
            hint="At least 8 characters, with a letter and a number."
            onChange={(e) => { setPw(e.target.value); if (errors.password) setErrors((x) => ({ ...x, password: validate(e.target.value, confirm).password })); }}
            onBlur={() => setErrors((x) => ({ ...x, password: validate().password }))} error={errors.password} />
          <Field id={IDS.confirm} label="Confirm new password" type="password" value={confirm} maxLength={72} autoComplete="new-password"
            onChange={(e) => { setConfirm(e.target.value); if (errors.confirm) setErrors((x) => ({ ...x, confirm: validate(pw, e.target.value).confirm })); }}
            onBlur={() => setErrors((x) => ({ ...x, confirm: validate().confirm }))} error={errors.confirm} />
          <p role="alert" className={`text-sm text-red-700 ${formError ? "" : "hidden"}`}>{formError}</p>
          <button type="submit" disabled={busy} className="bg-black p-3 font-label text-white hover:bg-neutral-800 disabled:opacity-50">
            {busy ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
    </section>
  );
}
