// Small formatting helpers. UTC is used so server and browser always agree.
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : shortDate.format(d);
}

export function formatReadTime(minutes) {
  return minutes ? `${minutes} min read` : "";
}

export function formatEpisodeLabel(number, duration) {
  const ep = `Ep. ${String(number).padStart(2, "0")}`;
  return duration ? `${ep} (${duration} min)` : ep;
}

export function calcReadTime(blocks = []) {
  const words = blocks
    .map((b) => b.text || "")
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}