import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";
import { ChannelGrid } from "@/components/sections/ChannelGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Distribution, route-to-market, modern trade, open market and wholesale, HORECA supply, warehousing and logistics, sales execution and brand development across Abuja / FCT.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything it takes to move products to market."
        intro="Eight connected services that take products from the warehouse to the buyers who reach consumers across Abuja / FCT."
        crumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
      >
        <nav aria-label="Services on this page" className="mt-10 flex flex-wrap gap-2">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex h-9 items-center rounded-full border border-line-strong bg-white px-3.5 text-sm font-medium text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
            >
              {s.title}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <section>
        <Container className="py-12 sm:py-16">
          {services.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className="grid scroll-mt-28 gap-8 border-b border-line py-14 last:border-b-0 lg:grid-cols-12 lg:gap-10"
              data-reveal
            >
              <div className="lg:col-span-4">
                <span className="text-sm font-semibold text-ink-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div className="mt-4 flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-[1.75rem]">{s.title}</h2>
                </div>
              </div>
              <div className="lg:col-span-5">
                <p className="text-lg leading-relaxed text-ink-900">{s.summary}</p>
                <p className="mt-4 leading-relaxed text-ink-600">{s.detail}</p>
              </div>
              <ul className="space-y-3 lg:col-span-3">
                {s.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[0.95rem] text-ink-600">
                    <Icon name="check" className="mt-0.5 size-4.5 shrink-0 text-teal-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Container>
      </section>

      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Channels" title="Who our services reach." />
            <ButtonLink href="/contact?type=quote#enquiry" variant="outline" arrow className="self-start lg:self-auto">
              Request a Quote
            </ButtonLink>
          </div>
          <div className="bg-white">
            <ChannelGrid descriptions={false} />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Need a route to market in Abuja?"
        intro="Tell us about your brand and we will discuss how MTDC can help it reach the right buyers."
        actions={
          <ButtonLink href="/partner" variant="light" size="lg" arrow>
            Partner With MTDC
          </ButtonLink>
        }
      />
    </>
  );
}
