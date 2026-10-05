import { AVAILABILITY, CHANNEL_TYPES, type Brand, type Category, type Product } from "./types";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Fails the build (and dev server) with a clear message when catalogue data
 * is inconsistent, so mistakes never reach the live site.
 */
export function validateCatalogue(data: { products: Product[]; brands: Brand[]; categories: Category[] }) {
  const errors: string[] = [];
  const unique = (label: string, values: string[]) => {
    const seen = new Set<string>();
    for (const v of values) {
      if (seen.has(v)) errors.push(`Duplicate ${label}: "${v}"`);
      seen.add(v);
    }
  };

  unique(
    "category id",
    data.categories.map((c) => c.id),
  );
  unique(
    "category slug",
    data.categories.map((c) => c.slug),
  );
  unique(
    "brand id",
    data.brands.map((b) => b.id),
  );
  unique(
    "product id",
    data.products.map((p) => p.id),
  );
  unique(
    "product slug",
    data.products.map((p) => p.slug),
  );

  const brandIds = new Set(data.brands.map((b) => b.id));
  const categories = new Map(data.categories.map((c) => [c.id, c]));

  for (const c of data.categories) {
    if (!SLUG.test(c.slug)) errors.push(`Category "${c.id}": slug "${c.slug}" must be lowercase-with-dashes`);
  }

  for (const p of data.products) {
    const where = `Product "${p.id}"`;
    if (!p.name.trim()) errors.push(`${where}: name is required`);
    if (!SLUG.test(p.slug)) errors.push(`${where}: slug "${p.slug}" must be lowercase-with-dashes`);
    if (!brandIds.has(p.brandId)) errors.push(`${where}: unknown brandId "${p.brandId}"`);
    const category = categories.get(p.categoryId);
    if (!category) errors.push(`${where}: unknown categoryId "${p.categoryId}"`);
    else if (p.subcategoryId && !category.subcategories.some((s) => s.id === p.subcategoryId)) {
      errors.push(`${where}: subcategory "${p.subcategoryId}" is not in category "${p.categoryId}"`);
    }
    if (!AVAILABILITY.includes(p.availability)) errors.push(`${where}: invalid availability "${p.availability}"`);
    for (const ch of p.channels) {
      if (!CHANNEL_TYPES.includes(ch)) errors.push(`${where}: invalid channel "${ch}"`);
    }
    for (const img of p.images) {
      if (!img.src.startsWith("/")) errors.push(`${where}: image src "${img.src}" must start with "/"`);
      if (!img.alt.trim()) errors.push(`${where}: image "${img.src}" needs alt text`);
    }
  }

  if (errors.length) {
    throw new Error(`Catalogue data has ${errors.length} problem(s):\n- ${errors.join("\n- ")}`);
  }
}
