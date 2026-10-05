import type { Category } from "@/lib/catalogue/types";

/**
 * PLACEHOLDER categories. Replace with MTDC's approved category list.
 * `id` is used by products; `slug` appears in catalogue filter URLs.
 */
export const categories: Category[] = [
  {
    id: "category-a",
    slug: "category-a",
    name: "Sample Category A",
    description: "Placeholder category. Replace with an approved MTDC product category.",
    subcategories: [
      { id: "category-a-1", name: "Subcategory A1" },
      { id: "category-a-2", name: "Subcategory A2" },
    ],
    isPlaceholder: true,
  },
  {
    id: "category-b",
    slug: "category-b",
    name: "Sample Category B",
    description: "Placeholder category. Replace with an approved MTDC product category.",
    subcategories: [
      { id: "category-b-1", name: "Subcategory B1" },
      { id: "category-b-2", name: "Subcategory B2" },
    ],
    isPlaceholder: true,
  },
  {
    id: "category-c",
    slug: "category-c",
    name: "Sample Category C",
    description: "Placeholder category. Replace with an approved MTDC product category.",
    subcategories: [
      { id: "category-c-1", name: "Subcategory C1" },
      { id: "category-c-2", name: "Subcategory C2" },
    ],
    isPlaceholder: true,
  },
  {
    id: "category-d",
    slug: "category-d",
    name: "Sample Category D",
    description: "Placeholder category. Replace with an approved MTDC product category.",
    subcategories: [
      { id: "category-d-1", name: "Subcategory D1" },
      { id: "category-d-2", name: "Subcategory D2" },
    ],
    isPlaceholder: true,
  },
];
