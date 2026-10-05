import type { Metadata } from "next";
import { partnerTypes } from "@/content/channels";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Manufacturers, producers, brand owners and importers: talk directly to MTDC about distribution and route-to-market across Abuja / FCT.",
  alternates: { canonical: "/partner" },
};

const enter = [
  "Route-to-market planning for your range in Abuja / FCT",
  "Introductions to supermarkets, wholesalers, retailers and open-market traders",
  "Access to hotels, restaurants, caterers and institutional buyers",
  "Local warehousing and delivery to trade customers",
];

const grow = [
  "Active sales execution and order follow-up",
  "In-outlet visibility and trade engagement",
  "Brand development to build demand and sell-through",
  "Market feedback shared with your team",
];

const steps = [
  { title: "Introduce your brand", body: "Send us your details using the form below." },
  { title: "Conversation", body: "We discuss your range, goals and the channels that fit." },
  { title: "Agree the plan", body: "Terms and a route-to-market plan are agreed before anything moves." },
  { title: "Launch and grow", body: "Products are stocked, sold in and supported in the market." },
];

export default function PartnerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partner With MTDC"
        title="Looking for a distribution partner in Abuja?"
        intro="MTDC helps manufacturers, producers, brand owners and importers enter and grow in the Abuja / FCT market, through one accountable partner on the ground."
        crumbs={[{ href: "/", label: "Home" }, { label: "Partner With Us" }]}
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#partner-form" size="lg" arrow>
            Start the conversation
          </ButtonLink>
          <ButtonLink href="/services" size="lg" variant="outline">
            Our services
          </ButtonLink>
        </div>
      </PageHeader>

      <section>
        <Container className="py-24 sm:py-32">
          <SectionHeading
            eyebrow="Who we partner with"
            title="We work directly with the businesses behind the products."
            intro="Partnerships are agreed directly between your business and MTDC. We are a distributor, not an open marketplace: there are no seller accounts or third-party listings."
            className="mb-14"
          />
          <ul className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {partnerTypes.map((p) => (
              <li key={p.id} className="border-r border-b border-line p-7" data-reveal>
                <Icon name={p.icon} className="size-7 text-teal-600" />
                <h3 className="mt-8 text-lg font-semibold">{p.label}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{p.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-ink-900 text-white">
        <Container className="py-24 sm:py-32">
          <SectionHeading
            tone="light"
            eyebrow="What MTDC does for your brand"
            title="Enter the market. Then grow in it."
            className="mb-16"
          />
          <div className="grid gap-14 md:grid-cols-2">
            {[
              { title: "Enter Abuja / FCT", items: enter },
              { title: "Grow your brand", items: grow },
            ].map((col) => (
              <div key={col.title} data-reveal>
                <h3 className="border-b border-white/15 pb-5 text-xl font-semibold">{col.title}</h3>
                <ul className="mt-6 space-y-4">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-3 text-ink-300">
                      <Icon name="check" className="mt-0.5 size-5 shrink-0 text-teal-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-24 sm:py-32">
          <SectionHeading eyebrow="How it works" title="A clear path from first conversation to the shelf." className="mb-14" />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-ink-900 pt-6" data-reveal>
                <span className="text-sm font-semibold text-teal-700 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="partner-form" className="scroll-mt-20 border-t border-line bg-canvas">
        <Container className="grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Partnership enquiry"
              title="Tell us about your brand."
              intro="This form is for manufacturers, producers, brand owners and importers. Buying for your business? Use the quote request on our Contact page."
            />
          </div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-line sm:p-10 lg:col-span-7 lg:col-start-6">
            <EnquiryForm type="partnership" />
          </div>
        </Container>
      </section>
    </>
  );
}
