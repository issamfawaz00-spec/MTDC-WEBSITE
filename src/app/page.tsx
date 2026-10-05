import Link from "next/link";
import { siteConfig } from "@/config/site";
import { channels } from "@/content/channels";
import { services } from "@/content/services";
import { getBrands, getCategories, getFeaturedProducts, isPlaceholderCatalogue } from "@/lib/catalogue";
import { BrandStrip } from "@/components/catalogue/BrandStrip";
import { ProductGrid } from "@/components/catalogue/ProductCard";
import { ProductMedia } from "@/components/catalogue/ProductVisual";
import { ChannelGrid } from "@/components/sections/ChannelGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  {
    title: "Focused on Abuja / FCT",
    body: "We concentrate on one market and work to know its channels, buyers and routes in depth, rather than spreading thin.",
  },
  {
    title: "Every channel, one partner",
    body: "Modern trade, open markets, wholesale, HORECA and institutional buyers, reached through a single accountable relationship.",
  },
  {
    title: "Stock close to the market",
    body: "Local warehousing and logistics keep products available, handled with care and moving to trade customers.",
  },
  {
    title: "Selling, not just delivering",
    body: "Sales execution and brand development help products sell through to consumers, not simply sit in outlets.",
  },
];

export default async function HomePage() {
  const [featured, categories, brands, placeholder] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
    getBrands(),
    isPlaceholderCatalogue(),
  ]);
  const heroProducts = featured.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-canvas">
        <Container className="grid items-center gap-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24 lg:pb-28">
          <div className="animate-fade-up lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-[0.8rem] font-medium text-ink-600">
              <Icon name="pin" className="size-4 text-teal-600" />
              Distribution &amp; route-to-market · {siteConfig.coverage}
            </p>
            <h1 className="mt-7 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.04em] text-ink-900 sm:text-[4rem] lg:text-[4.6rem]">
              Helping brands move from product to <span className="text-teal-600">market.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-600 sm:text-[1.2rem]">
              MT Distribution Channel (MTDC) is an Abuja-based distribution and route-to-market company. We connect manufacturers,
              producers, brand owners and importers with the trade buyers that reach consumers.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/products" size="lg" arrow>
                Explore Products &amp; Brands
              </ButtonLink>
              <ButtonLink href="/partner" size="lg" variant="outline">
                Partner With MTDC
              </ButtonLink>
            </div>
            <dl className="mt-14 grid max-w-xl grid-cols-1 gap-6 border-t border-line-strong pt-8 sm:grid-cols-3">
              {[
                ["Based in", siteConfig.location],
                ["Coverage", siteConfig.coverage],
                ["Channels", "Modern trade, open market & HORECA"],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">{term}</dt>
                  <dd className="mt-2 text-[0.95rem] font-medium text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Product mosaic: shows MTDC handles physical products */}
          <div className="relative animate-fade-up [animation-delay:120ms] lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroProducts.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-white ring-1 ring-line ${i === 0 ? "row-span-2 aspect-[4/7]" : "aspect-square"}`}
                  aria-label={`View ${p.name}`}
                >
                  <ProductMedia image={p.images[0]} seed={p.slug} sizes="(min-width: 1024px) 240px, 45vw" priority caption={false} />
                </Link>
              ))}
            </div>
            {placeholder && <p className="mt-4 text-right text-xs text-ink-400">Sample visuals. Product photography coming soon.</p>}
          </div>
        </Container>
      </section>

      {/* Channels strip */}
      <section aria-label="Channels we supply" className="border-b border-line">
        <Container className="flex flex-col gap-4 py-7 lg:flex-row lg:items-center lg:gap-10">
          <p className="shrink-0 text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">We supply</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-medium text-ink-700">
            {channels.map((c) => (
              <li key={c.id}>{c.label}</li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Who we are */}
      <section>
        <Container className="grid gap-10 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-6" data-reveal>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-5 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.75rem]">
              A focused route-to-market partner for brands in Abuja.
            </h2>
          </div>
          <div className="prose-mtdc lg:col-span-5 lg:col-start-8 lg:pt-12" data-reveal>
            <p>
              Great products only succeed when they are in the right outlets, at the right time, in front of the right buyers. MTDC exists
              to make that happen in Abuja and the FCT.
            </p>
            <p>
              We combine distribution, warehousing and logistics with sales execution and brand development, so brand owners can rely on one
              partner to take products from storage to sale.
            </p>
            <ArrowLink href="/about" className="mt-2">
              More about MTDC
            </ArrowLink>
          </div>
        </Container>
      </section>

      {/* Products & Brands */}
      <section className="border-t border-line bg-white">
        <Container className="py-24 sm:py-32">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-reveal>
            <SectionHeading
              eyebrow="Products & Brands"
              title="The products we put on shelves."
              intro="Browse the range MTDC distributes by category, open any product for pack and carton details, and request a quote."
            />
            <ButtonLink href="/products" variant="outline" arrow className="self-start lg:self-auto">
              View full catalogue
            </ButtonLink>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Browse by category">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          {placeholder && (
            <div className="mt-8">
              <PlaceholderNotice title="Sample catalogue.">
                These products, brands and categories are placeholders showing the layout. They will be replaced with MTDC&rsquo;s approved
                product list and photography.
              </PlaceholderNotice>
            </div>
          )}

          <div className="mt-12">
            <ProductGrid products={featured} />
          </div>

          <div className="mt-24" data-reveal>
            <h3 className="text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">Brands we distribute</h3>
            <div className="mt-6">
              <BrandStrip brands={brands} />
            </div>
          </div>
        </Container>
      </section>

      {/* Who we supply */}
      <section className="bg-canvas">
        <Container className="py-24 sm:py-32">
          <SectionHeading
            eyebrow="Who we supply"
            title="Reaching the channels that matter in Abuja."
            intro="From supermarkets to open markets and the hospitality sector, MTDC supplies the buyers who put products in front of consumers every day."
            className="mb-14"
          />
          <div className="bg-white">
            <ChannelGrid />
          </div>
        </Container>
      </section>

      {/* Why brands work with MTDC */}
      <section className="bg-ink-900 text-white">
        <Container className="grid gap-14 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                tone="light"
                eyebrow="Why brands work with MTDC"
                title="A partner on the ground, accountable for results."
                intro="Brand owners choose a distributor to reach buyers they cannot reach alone. Here is what MTDC brings to that relationship."
              />
              <ButtonLink href="/partner" variant="light" arrow className="mt-10">
                Partner With MTDC
              </ButtonLink>
            </div>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {reasons.map((r, i) => (
              <li
                key={r.title}
                className="grid grid-cols-[3rem_1fr] gap-4 border-t border-white/10 py-9 first:border-t-0 first:pt-0"
                data-reveal
              >
                <span className="text-sm font-semibold text-teal-300 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-semibold">{r.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-300">{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Services overview */}
      <section>
        <Container className="py-24 sm:py-32">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-reveal>
            <SectionHeading
              eyebrow="Services"
              title="End-to-end route-to-market."
              intro="Eight connected capabilities, from planning the route to building the brand."
            />
            <ButtonLink href="/services" variant="outline" arrow className="self-start lg:self-auto">
              All services
            </ButtonLink>
          </div>
          <ul className="mt-14 grid border-t border-line md:grid-cols-2 md:gap-x-12">
            {services.map((s) => (
              <li key={s.id} className="border-b border-line">
                <Link href={`/services#${s.id}`} className="group flex items-start gap-5 py-7">
                  <Icon name={s.icon} className="mt-0.5 size-6 shrink-0 text-teal-600" />
                  <span className="flex-1">
                    <span className="block text-lg font-semibold text-ink-900">{s.title}</span>
                    <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-ink-500">{s.summary}</span>
                  </span>
                  <Icon
                    name="arrowUpRight"
                    className="mt-1 size-5 shrink-0 text-ink-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-900"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        eyebrow="For manufacturers, producers, brand owners and importers"
        title="Looking for a distribution partner in Abuja?"
        intro="Talk directly with MTDC about taking your products to market across Abuja / FCT."
        actions={
          <>
            <ButtonLink href="/partner" variant="light" size="lg" arrow>
              Partner With MTDC
            </ButtonLink>
            <ButtonLink href="/contact?type=quote#enquiry" variant="outline-light" size="lg">
              Request a Quote
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
