import type { Bookmark } from "@/types/common.type";
import type { Tables } from "@/types/database.types";

export function dbRowToBookmark(row: Tables<"bookmarks">): Bookmark {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    folderId: row.folder_id,
    favourite: row.favourite,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export function faviconFor(url: string) {
  return `https://www.google.com/s2/favicons?sz=64&domain=${url.replace(/^www\./, "")}`;
}

export function initials(title: string) {
  return title
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "msclkid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "ref_url",
  "si",
  "feature",
  "spm",
]);

/**
 * Normalizes a URL for duplicate detection: strips protocol, www, hash and trailing
 * slashes, and drops known tracking params — but keeps other query params (sorted),
 * since some sites (e.g. YouTube's `?v=`) encode the page's identity there.
 */
export function normalizeUrl(u: string) {
  const trimmed = (u || "").trim().toLowerCase();
  if (!trimmed) return "";

  const noOrigin = trimmed
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/#.*$/, "");

  const qIndex = noOrigin.indexOf("?");
  const path = (qIndex === -1 ? noOrigin : noOrigin.slice(0, qIndex)).replace(
    /\/+$/,
    "",
  );
  if (qIndex === -1) return path;

  const kept = [...new URLSearchParams(noOrigin.slice(qIndex + 1))]
    .filter(([key]) => !TRACKING_PARAMS.has(key))
    .map(([key, value]) => `${key}=${value}`)
    .sort();

  return kept.length ? `${path}?${kept.join("&")}` : path;
}

export function cleanUrl(u: string) {
  return u
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

/** Strips a leading unread/notification-count badge (e.g. "(520) ", "[3] ") that sites like YouTube or Gmail prepend to the tab title. */
export function stripNotificationCount(title: string) {
  const stripped = title.replace(/^[([]\s*\d+\+?\s*[)\]]\s*/, "");
  return stripped || title;
}

export function titleFromUrl(url: string) {
  const clean = url.split("/")[0]!;
  const host = clean.replace(/^www\./, "").split(".")[0]!;
  return host ? host.charAt(0).toUpperCase() + host.slice(1) : clean;
}

const TINT_CLASSES = [
  "tint-0",
  "tint-1",
  "tint-2",
  "tint-3",
  "tint-4",
  "tint-5",
] as const;

/** Cycles a folder's tint index into one of the 6 palette pairs defined in globals.css. */
export function tintClass(index: number) {
  const i = ((index % 6) + 6) % 6;
  return TINT_CLASSES[i];
}
