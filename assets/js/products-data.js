/*
 * MTDC product catalogue
 * -----------------------------------------------------------------------------
 * This is the ONLY file you need to edit to update the Products & Brands page
 * and the featured products on the Home page.
 *
 * Everything below is a PLACEHOLDER. No real brands, products, specifications
 * or availability are listed yet. Replace with the approved product list.
 *
 * How to update:
 *   1. Set `isPlaceholder` to false once real data is in.
 *   2. Edit `categories` — each needs a unique `id` (lowercase, no spaces) and a `name`.
 *   3. Edit `products` — each product needs:
 *        id          unique id, lowercase-with-dashes (used in enquiry links)
 *        category    one of the category ids above
 *        brand       brand name as approved
 *        name        product name
 *        description one or two short sentences
 *        packSize    e.g. "12 x 500ml" or "Carton of 24"
 *        image       path to photo, e.g. "assets/img/products/my-product.jpg"
 *                    (leave "" to show the photo placeholder)
 *        imageAlt    short description of the photo for screen readers
 *        featured    true to show on the Home page (keep to 4–8 products)
 *        placeholder true while the entry is sample content (shows a label)
 *   4. Edit `brands` — logos shown in the "Brands" strip. `logo` is optional.
 *
 * Recommended photo spec: square (1:1), at least 800x800px, plain light
 * background, JPG or WebP under ~200KB each.
 */
window.MTDC_CATALOGUE = {
  isPlaceholder: true,

  categories: [
    { id: "category-a", name: "Category A (placeholder)" },
    { id: "category-b", name: "Category B (placeholder)" },
    { id: "category-c", name: "Category C (placeholder)" },
    { id: "category-d", name: "Category D (placeholder)" }
  ],

  brands: [
    { name: "Brand logo 1", logo: "" },
    { name: "Brand logo 2", logo: "" },
    { name: "Brand logo 3", logo: "" },
    { name: "Brand logo 4", logo: "" },
    { name: "Brand logo 5", logo: "" },
    { name: "Brand logo 6", logo: "" }
  ],

  products: [
    {
      id: "sample-product-01",
      category: "category-a",
      brand: "Brand name",
      name: "Sample product 01",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: true,
      placeholder: true
    },
    {
      id: "sample-product-02",
      category: "category-a",
      brand: "Brand name",
      name: "Sample product 02",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: false,
      placeholder: true
    },
    {
      id: "sample-product-03",
      category: "category-a",
      brand: "Brand name",
      name: "Sample product 03",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: false,
      placeholder: true
    },
    {
      id: "sample-product-04",
      category: "category-b",
      brand: "Brand name",
      name: "Sample product 04",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: true,
      placeholder: true
    },
    {
      id: "sample-product-05",
      category: "category-b",
      brand: "Brand name",
      name: "Sample product 05",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: false,
      placeholder: true
    },
    {
      id: "sample-product-06",
      category: "category-b",
      brand: "Brand name",
      name: "Sample product 06",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: false,
      placeholder: true
    },
    {
      id: "sample-product-07",
      category: "category-c",
      brand: "Brand name",
      name: "Sample product 07",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: true,
      placeholder: true
    },
    {
      id: "sample-product-08",
      category: "category-c",
      brand: "Brand name",
      name: "Sample product 08",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: false,
      placeholder: true
    },
    {
      id: "sample-product-09",
      category: "category-d",
      brand: "Brand name",
      name: "Sample product 09",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: true,
      placeholder: true
    },
    {
      id: "sample-product-10",
      category: "category-d",
      brand: "Brand name",
      name: "Sample product 10",
      description: "Placeholder description. Replace with the approved product description.",
      packSize: "Pack size to be confirmed",
      image: "",
      imageAlt: "",
      featured: false,
      placeholder: true
    }
  ]
};
