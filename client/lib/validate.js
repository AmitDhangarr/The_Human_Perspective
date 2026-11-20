// Shared form validators. Each returns "" when the value is fine, otherwise a
// short, friendly message that is shown under the field.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PERSON = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.-]*$/u; // first / last name
const HANDLE = /^[\p{L}\p{N}][\p{L}\p{N}\s'’._-]*$/u; // display name

export const v = {
  email(value) {
    const s = (value || "").trim();
    if (!s) return "Please enter your email address.";
    if (s.length > 254 || !EMAIL.test(s)) return "That doesn't look like a valid email (try name@example.com).";
    return "";
  },
  // signup = true applies the strength rules, sign-in only needs a value
  password(value, { signup = false } = {}) {
    if (!value) return "Please enter your password.";
    if (!signup) return "";
    if (value.length < 8) return "Use at least 8 characters.";
    if (value.length > 72) return "Use 72 characters or fewer.";
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Include at least one letter and one number.";
    return "";
  },
  confirm(value, original) {
    if (!value) return "Please re-enter your password.";
    return value === original ? "" : "The passwords don't match.";
  },
  person(value, label = "name") {
    const s = (value || "").trim();
    if (!s) return `Please enter your ${label}.`;
    if (s.length > 50) return `Your ${label} must be 50 characters or fewer.`;
    if (!PERSON.test(s)) return `Your ${label} can only use letters, spaces, apostrophes, dots and hyphens.`;
    return "";
  },
  displayName(value) {
    const s = (value || "").trim();
    if (!s) return "Please enter a name.";
    if (s.length < 2) return "Use at least 2 characters.";
    if (s.length > 60) return "Use 60 characters or fewer.";
    if (!HANDLE.test(s)) return "Use letters, numbers, spaces and . - _ ' only.";
    return "";
  },
  text(value, { label = "This field", min = 1, max = 2000, required = true } = {}) {
    const s = (value || "").trim();
    if (!s) return required ? `Please enter ${label}.` : "";
    if (s.length < min) return `${label[0].toUpperCase()}${label.slice(1)} needs at least ${min} characters.`;
    if (s.length > max) return `${label[0].toUpperCase()}${label.slice(1)} must be ${max} characters or fewer.`;
    return "";
  },
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

// focus the first invalid field (ids must match the error keys' field ids)
export function focusFirst(errors, ids) {
  const key = Object.keys(errors).find((k) => errors[k]);
  if (key) requestAnimationFrame(() => document.getElementById(ids[key])?.focus());
}

// turn raw Supabase errors into plain language
export function friendlyAuthError(message = "") {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "That email and password don't match. Please try again.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("not confirmed")) return "Please confirm your email first. Check your inbox for the link.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Please wait a few minutes and try again.";
  if (m.includes("password") && m.includes("least")) return "Your password is too short.";
  if (m.includes("failed to fetch") || m.includes("network")) return "Couldn't reach the server. Check your connection and try again.";
  return message || "Something went wrong. Please try again.";
}
