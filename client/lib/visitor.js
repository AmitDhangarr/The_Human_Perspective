// Anonymous, stable id per browser. Used for unique view / visitor counting.
const KEY = "thp_visitor";

export function getVisitorId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
        `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `s-${Math.random().toString(36).slice(2, 14)}`;
  }
}
