import type { Brand } from "@/lib/catalogue/types";

/**
 * PLACEHOLDER brands. Replace with the brands MTDC is approved to represent.
 * Logos go in /public/images/brands and are referenced as "/images/brands/<file>".
 */
export const brands: Brand[] = [
  { id: "brand-a", slug: "brand-a", name: "Sample Brand A", isPlaceholder: true },
  { id: "brand-b", slug: "brand-b", name: "Sample Brand B", isPlaceholder: true },
  { id: "brand-c", slug: "brand-c", name: "Sample Brand C", isPlaceholder: true },
  { id: "brand-d", slug: "brand-d", name: "Sample Brand D", isPlaceholder: true },
];
