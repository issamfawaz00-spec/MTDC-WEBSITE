import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/catalogue";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/products", "/services", "/partner", "/contact"].map((path) => ({
    url: `${siteConfig.url}${path}`,
  }));
  const products = (await getProducts()).map((p) => ({ url: `${siteConfig.url}/products/${p.slug}` }));
  return [...pages, ...products];
}
