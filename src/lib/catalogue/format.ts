import type { ProductView } from "./types";

/** Client-safe helpers (no data imports). */
export function productDisplayName(product: Pick<ProductView, "name" | "brand">): string {
  return [product.brand?.name, product.name].filter(Boolean).join(" ");
}

/**
 * Shortens text for meta descriptions without cutting a word in half.
 * Text within `max` characters is returned unchanged; longer text is cut at
 * the last space before the limit and ends with "…" (included in `max`).
 */
export function truncateAtWord(text: string, max = 160): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, "")}…`;
}

/** Apostrophe-like characters people may type or that appear in names: ‘ ’ ‛ ʼ ′ ` ´ */
const APOSTROPHES = /[‘’‛ʼ′`´]/g;

/**
 * Normalises text for catalogue search: lower case, and every apostrophe
 * variant treated as a plain ' so "L'Amore" and "L’Amore" match each other.
 */
export function normaliseForSearch(text: string): string {
  return text.toLowerCase().replace(APOSTROPHES, "'");
}
