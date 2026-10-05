import type { Metadata } from "next";
import { Suspense } from "react";
import { getBrands, getCategories, getProducts, isPlaceholderCatalogue } from "@/lib/catalogue";
import { BrandStrip } from "@/components/catalogue/BrandStrip";
import { Catalogue } from "@/components/catalogue/Catalogue";
import { ProductGrid } from "@/components/catalogue/ProductCard";
import { PageHeader } from "@/components/sections/PageHeader";
import { ArrowLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";

export const metadata: Metadata = {
  title: "Products & Brands",
  description:
    "Browse the products and brands distributed by MT Distribution Channel (MTDC) across Abuja / FCT, and request a trade quote.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, categories, brands, placeholder] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
    isPlaceholderCatalogue(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Products & Brands"
        title="Products and brands we distribute."
        intro="Browse by category, search the range and open any product for pack and carton details. Prices and trade terms are shared on request."
        crumbs={[{ href: "/", label: "Home" }, { label: "Products & Brands" }]}
      />

      <section>
        <Container className="py-14 sm:py-20">
          {placeholder && (
            <div className="mb-12">
              <PlaceholderNotice title="Sample catalogue.">
                The categories, brands and products below are placeholders that demonstrate the layout. They will be replaced with
                MTDC&rsquo;s approved product list and photography.
              </PlaceholderNotice>
            </div>
          )}
          <Suspense fallback={<ProductGrid products={products} columns={3} />}>
            <Catalogue products={products} categories={categories} />
          </Suspense>
        </Container>
      </section>

      <section className="border-t border-line bg-canvas">
        <Container className="py-20 sm:py-24">
          <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">Brands we distribute</h2>
          <div className="mt-6 bg-white">
            <BrandStrip brands={brands} />
          </div>
        </Container>
      </section>

      <section>
        <Container className="grid gap-px overflow-hidden py-20 sm:py-24 md:grid-cols-2 md:gap-12">
          {[
            {
              icon: "supermarket" as const,
              title: "Buying for your business?",
              body: "Supermarkets, wholesalers, retailers, market traders, hotels, restaurants, caterers and institutions can request a quote for any product.",
              href: "/contact?type=quote#enquiry",
              cta: "Request a Quote",
            },
            {
              icon: "handshake" as const,
              title: "Want your brand in this catalogue?",
              body: "Manufacturers, producers, brand owners and importers can talk to MTDC about distribution across Abuja / FCT.",
              href: "/partner",
              cta: "Partner With MTDC",
            },
          ].map((b) => (
            <div key={b.title} className="border-t border-line pt-8" data-reveal>
              <Icon name={b.icon} className="size-6 text-teal-600" />
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">{b.title}</h2>
              <p className="mt-3 max-w-md leading-relaxed text-ink-600">{b.body}</p>
              <ArrowLink href={b.href} className="mt-6">
                {b.cta}
              </ArrowLink>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
