import type { Category } from "@/lib/catalogue/types";

/** Working categories for the product list supplied by MTDC on 6 October 2026. */
export const categories: Category[] = [
  {
    id: "cooking-oils",
    slug: "cooking-oils",
    name: "Cooking Oils",
    subcategories: [
      {
        id: "vegetable-oil",
        name: "Vegetable Oil",
      },
      {
        id: "soya-oil",
        name: "Soya Oil",
      },
    ],
  },
  {
    id: "rice-grains",
    slug: "rice-grains",
    name: "Rice & Grains",
    subcategories: [],
  },
  {
    id: "tomato-paste",
    slug: "tomato-paste",
    name: "Tomato Paste",
    subcategories: [],
  },
  {
    id: "bread-bakery",
    slug: "bread-bakery",
    name: "Bread & Bakery",
    subcategories: [],
  },
  {
    id: "shisha-accessories",
    slug: "shisha-accessories",
    name: "Shisha Accessories",
    subcategories: [
      {
        id: "charcoal",
        name: "Charcoal",
      },
    ],
  },
];
