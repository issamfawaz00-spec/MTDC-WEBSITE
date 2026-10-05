import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ChannelGrid } from "@/components/sections/ChannelGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "MT Distribution Channel (MTDC) is an Abuja-based distribution and route-to-market company serving modern trade, open market, wholesale, HORECA and institutional buyers across Abuja / FCT.",
  alternates: { canonical: "/about" },
};

const capabilities: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "route",
    title: "Route-to-market expertise",
    body: "Planning which channels and buyers a product should reach, and how supply should flow to them.",
  },
  {
    icon: "pin",
    title: "Abuja market knowledge",
    body: "A focus on one market: its neighbourhoods, trading patterns, outlets and buyers.",
  },
  {
    icon: "handshake",
    title: "Trade relationships",
    body: "Working relationships with trade buyers, maintained through regular contact and reliable service.",
  },
  {
    icon: "supermarket",
    title: "Modern trade",
    body: "Supplying supermarkets and organised retail with consistent, well-presented stock.",
  },
  { icon: "market", title: "Open market", body: "Reaching the traders and markets where much of Abuja's everyday purchasing happens." },
  { icon: "hotel", title: "HORECA", body: "Supplying hotels, restaurants and caterers around their service and event schedules." },
  { icon: "wholesale", title: "Wholesale", body: "Trade-quantity supply to wholesalers and retailers for onward sale." },
  { icon: "truck", title: "Warehousing & logistics", body: "Local storage and delivery that keep stock close to the market and moving." },
  {
    icon: "target",
    title: "Sales execution",
    body: "Actively selling in, following up orders and paying attention to how products appear in outlets.",
  },
  { icon: "megaphone", title: "Brand development", body: "Building visibility and demand so products sell through to consumers." },
];

const principles = [
  {
    title: "Reliability",
    body: "Trade buyers plan around their deliveries. We treat supply commitments seriously and communicate early when anything changes.",
  },
  {
    title: "Partnership",
    body: "We work with brand owners as an extension of their team, sharing what we see in the market and agreeing plans together.",
  },
  { title: "Focus", body: `Concentrating on ${siteConfig.coverage} lets us understand our customers, channels and routes in depth.` },
  { title: "Integrity", body: "We represent the brands we carry honestly and handle their products with care from warehouse to outlet." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About MTDC"
        title="A route-to-market partner built for Abuja."
        intro={`MT Distribution Channel (MTDC) is a distribution and route-to-market company based in ${siteConfig.location}. We help brands move from product to market.`}
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
      />

      <section>
        <Container className="grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <p className="eyebrow">Our role</p>
            <h2 className="mt-5 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.6rem]">
              The link between the people who make products and the buyers who sell them.
            </h2>
          </div>
          <div className="prose-mtdc lg:col-span-6 lg:col-start-7 lg:pt-12" data-reveal>
            <p>
              On one side, we work with manufacturers, producers, brand owners and importers who want their products available across Abuja
              and the FCT. On the other, we supply supermarkets, wholesalers, retailers, open markets, hotels, restaurants, caterers and
              institutional buyers.
            </p>
            <p>
              Between them, MTDC brings together warehousing, logistics, trade sales and brand development, so a brand owner can rely on a
              single accountable partner to take products from storage to sale, and to keep them selling.
            </p>
            <p>
              We have chosen to concentrate on {siteConfig.coverage}. Serving one market well, with depth and consistency, is how we intend
              to earn the trust of brands and buyers alike.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <SectionHeading eyebrow="What we bring" title="Capabilities across the route to market." className="mb-14" />
          <ul className="grid gap-x-12 border-t border-line-strong md:grid-cols-2">
            {capabilities.map((c) => (
              <li key={c.title} className="flex gap-5 border-b border-line-strong py-7" data-reveal>
                <Icon name={c.icon} className="mt-0.5 size-6 shrink-0 text-teal-600" />
                <div>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-600">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section>
        <Container className="grid gap-14 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="How we work" title="Principles we hold ourselves to." />
          </div>
          <dl className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {principles.map((p) => (
              <div key={p.title} className="border-t-2 border-ink-900 pt-6" data-reveal>
                <dt className="text-xl font-semibold">{p.title}</dt>
                <dd className="mt-3 leading-relaxed text-ink-600">{p.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Who we supply" title="Trade customers across Abuja / FCT." />
            <ButtonLink href="/services" variant="outline" arrow className="self-start lg:self-auto">
              Our services
            </ButtonLink>
          </div>
          <div className="bg-white">
            <ChannelGrid />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Let's take your products to market."
        intro="Whether you want to buy from MTDC or have us distribute your brand, we would like to hear from you."
        actions={
          <>
            <ButtonLink href="/partner" variant="light" size="lg" arrow>
              Partner With MTDC
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light" size="lg">
              Contact us
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
