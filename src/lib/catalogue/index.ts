/**
 * Catalogue data access.
 *
 * Pages and components read the catalogue ONLY through these functions.
 * They are async on purpose: swapping the static content for a database,
 * CMS, admin dashboard or ERP/API later only changes this file.
 */
import { brands } from "@/content/catalogue/brands";
import { categories } from "@/content/catalogue/categories";
import { products } from "@/content/catalogue/products";
import type { Brand, Category, Product, ProductView } from "./types";
import { validateCatalogue } from "./validate";

validateCatalogue({ products, brands, categories });

const brandById = new Map(brands.map((b) => [b.id, b]));
const categoryById = new Map(categories.map((c) => [c.id, c]));

function toView(product: Product): ProductView {
  const category = categoryById.get(product.categoryId);
  return {
    ...product,
    brand: brandById.get(product.brandId),
    category,
    subcategory: category?.subcategories.find((s) => s.id === product.subcategoryId),
  };
}

export async function getProducts(): Promise<ProductView[]> {
  return products.map(toView);
}

export async function getFeaturedProducts(limit = 4): Promise<ProductView[]> {
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit).map(toView);
}

export async function getProductBySlug(slug: string): Promise<ProductView | undefined> {
  const product = products.find((p) => p.slug === slug);
  return product ? toView(product) : undefined;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<ProductView[]> {
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit)
    .map(toView);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getBrands(): Promise<Brand[]> {
  return brands;
}

/** True while any catalogue entry is still sample content. */
export async function isPlaceholderCatalogue(): Promise<boolean> {
  return products.some((p) => p.isPlaceholder) || brands.some((b) => b.isPlaceholder);
}

export { productDisplayName } from "./format";
