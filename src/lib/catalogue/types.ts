/**
 * Catalogue domain types.
 *
 * These describe the catalogue independently of where it is stored. Today the
 * data lives in src/content/catalogue; later the same shapes can be served
 * from a database, an admin dashboard or an ERP/API integration without the
 * pages changing.
 */

/** Trade channels MTDC supplies. */
export const CHANNEL_TYPES = [
  "supermarkets",
  "wholesalers",
  "retailers",
  "open-markets",
  "hotels",
  "restaurants",
  "caterers",
  "institutional",
] as const;
export type ChannelType = (typeof CHANNEL_TYPES)[number];

/**
 * Availability is deliberately coarse and never implies a stock quantity.
 * "unconfirmed" is the default until MTDC approves a status for a product.
 */
export const AVAILABILITY = ["available", "limited", "on-request", "coming-soon", "unconfirmed"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export interface ProductImage {
  /** Path under /public, e.g. "/images/products/brand-product-500ml.jpg". */
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  subcategories: Subcategory[];
  /** True while this is sample content awaiting approved data. */
  isPlaceholder?: boolean;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  /** Path under /public. Only add logos MTDC has permission to display. */
  logo?: string;
  isPlaceholder?: boolean;
}

export interface Product {
  id: string;
  /** URL segment: /products/[slug]. Lowercase letters, numbers and dashes. */
  slug: string;
  name: string;
  /** Omit until MTDC confirms the brand; product details show To be confirmed. */
  brandId?: string;
  manufacturer?: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  /** Unit pack size, e.g. "500ml bottle". */
  packSize?: string;
  /** Case/carton make-up, e.g. "12 x 500ml per carton". */
  cartonConfiguration?: string;
  images: ProductImage[];
  availability: Availability;
  featured: boolean;
  channels: ChannelType[];
  isPlaceholder?: boolean;
}

/** A product joined with its brand and category for display. */
export interface ProductView extends Product {
  brand: Brand | undefined;
  category: Category | undefined;
  subcategory: Subcategory | undefined;
}

