import type { ProductView } from "./types";

/** Client-safe helpers (no data imports). */
export function productDisplayName(product: Pick<ProductView, "name" | "brand">): string {
  return [product.brand?.name, product.name].filter(Boolean).join(" ");
}
