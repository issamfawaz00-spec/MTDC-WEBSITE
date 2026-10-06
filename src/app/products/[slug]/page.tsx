import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getRelatedProducts, productDisplayName } from "@/lib/catalogue";
import { availabilityLabels, channelLabels } from "@/lib/catalogue/labels";
import { AvailabilityBadge } from "@/components/catalogue/AvailabilityBadge";
import { ProductGrid, quoteHref } from "@/components/catalogue/ProductCard";
import { ProductMedia } from "@/components/catalogue/ProductVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Tbc } from "@/components/ui/Tbc";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = productDisplayName(product);
  const description = [product.description, product.packSize].filter(Boolean).join(" ").slice(0, 160);
  const image = product.images[0];
  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title, description, images: image ? [{ url: image.src, alt: image.alt }] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product, 4);

  const specs: [string, string | undefined][] = [
    ["Brand", product.brand?.name],
    ["Manufacturer", product.manufacturer],
    ["Category", product.category?.name],
    ["Subcategory", product.subcategory?.name],
    ["Pack size", product.packSize],
    ["Carton configuration", product.cartonConfiguration],
    ["Availability", product.availability === "unconfirmed" ? undefined : availabilityLabels[product.availability]],
  ];

  return (
    <>
      <div className="border-b border-line">
        <Container className="py-5">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
              <li>
                <Link href="/products" className="hover:text-ink-900">
                  Products &amp; Brands
                </Link>
              </li>
              {product.category && (
                <li className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-ink-300">
                    /
                  </span>
                  <Link href={`/products?category=${product.category.slug}`} className="hover:text-ink-900">
                    {product.category.name}
                  </Link>
                </li>
              )}
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-ink-300">
                  /
                </span>
                <span aria-current="page" className="text-ink-900">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <section>
        <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-16">
          {/* Gallery */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-canvas ring-1 ring-line lg:sticky lg:top-28">
              <ProductMedia image={product.images[0]} sizes="(min-width: 1024px) 560px, 100vw" priority size="lg" />
            </div>
            {product.images.length > 1 && (
              <ul className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img) => (
                  <li key={img.src} className="relative aspect-square overflow-hidden rounded-xl bg-canvas ring-1 ring-line">
                    <ProductMedia image={img} sizes="120px" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-6">
            {product.isPlaceholder && (
              <div className="mb-8">
                <PlaceholderNotice title="Sample product.">
                  This entry demonstrates the product page layout and is not a real MTDC product.
                </PlaceholderNotice>
              </div>
            )}
            <p className={`text-xs font-semibold tracking-[0.16em] uppercase ${product.brand ? "text-ink-500" : "text-ink-400"}`}>
              {product.brand?.name ?? "Brand to be confirmed"}
            </p>
            <h1 className="mt-3 text-[2.2rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[2.8rem]">{product.name}</h1>
            <div className="mt-4">
              <AvailabilityBadge availability={product.availability} />
            </div>
            <p className="mt-6 text-lg leading-relaxed text-ink-600">{product.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={quoteHref(product.slug)} size="lg" arrow>
                Request a Quote
              </ButtonLink>
              <ButtonLink href={`/contact?type=general&product=${encodeURIComponent(product.slug)}#enquiry`} size="lg" variant="outline">
                Enquire About This Product
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-ink-500">Trade enquiries only. Prices and terms are shared on request; no online payment.</p>

            <h2 className="mt-12 text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">Product details</h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {specs.map(([term, value]) => (
                <div key={term} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 py-3.5 text-[0.95rem]">
                  <dt className="text-ink-500">{term}</dt>
                  <dd className="font-medium text-ink-900">{value ? value : <Tbc />}</dd>
                </div>
              ))}
            </dl>

            {product.channels.length > 0 && (
              <>
                <h2 className="mt-10 text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">Suitable for</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {product.channels.map((c) => (
                    <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-sm text-ink-700">
                      <Icon name="check" className="size-3.5 text-teal-600" />
                      {channelLabels[c]}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-canvas">
          <Container className="py-20 sm:py-24">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">More in {product.category?.name}</h2>
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hidden text-sm font-semibold underline-offset-4 hover:underline sm:block"
                >
                  View category
                </Link>
              )}
            </div>
            <div className="mt-10">
              <ProductGrid products={related} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
