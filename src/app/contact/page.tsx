import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig, type ContactKey } from "@/config/site";
import { getProducts, productDisplayName } from "@/lib/catalogue";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { EnquiryTabs } from "@/components/forms/EnquiryTabs";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { ContactValue } from "@/components/ui/ContactValue";
import { Icon, type IconName } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact MT Distribution Channel (MTDC) in Abuja / FCT: request a quote, make a general enquiry or discuss a brand partnership.",
  alternates: { canonical: "/contact" },
};

const details: { field: ContactKey; label: string; icon: IconName }[] = [
  { field: "phone", label: "Phone", icon: "phone" },
  { field: "whatsapp", label: "WhatsApp", icon: "chat" },
  { field: "email", label: "Email", icon: "mail" },
  { field: "address", label: "Address", icon: "building" },
  { field: "hours", label: "Business hours", icon: "clock" },
];

export default async function ContactPage() {
  const products = (await getProducts()).map((p) => ({
    slug: p.slug,
    label: [productDisplayName(p), p.packSize].filter(Boolean).join(" · "),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to MTDC."
        intro="Request a quote for your business, ask a general question, or start a brand partnership conversation with our team in Abuja."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />

      <section>
        <Container className="grid gap-14 py-16 sm:py-24 lg:grid-cols-12">
          <aside className="order-2 lg:order-1 lg:col-span-4">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">Contact details</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              <li className="flex gap-4 py-5">
                <Icon name="pin" className="mt-0.5 size-5 shrink-0 text-teal-600" />
                <div>
                  <p className="text-sm text-ink-500">Location</p>
                  <p className="mt-0.5 font-medium">
                    {siteConfig.location} · {siteConfig.coverage}
                  </p>
                </div>
              </li>
              {details.map((d) => (
                <li key={d.field} className="flex gap-4 py-5">
                  <Icon name={d.icon} className="mt-0.5 size-5 shrink-0 text-teal-600" />
                  <div>
                    <p className="text-sm text-ink-500">{d.label}</p>
                    <p className="mt-0.5 font-medium break-words">
                      <ContactValue field={d.field} />
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-line-strong bg-canvas p-6 text-center text-sm text-ink-500">
              A map will be added once the business address is confirmed.
            </div>
          </aside>

          <div id="enquiry" className="order-1 scroll-mt-24 lg:order-2 lg:col-span-8">
            <div className="rounded-2xl p-0 sm:p-10 sm:ring-1 sm:ring-line">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Send an enquiry</h2>
              <div className="mt-8">
                <Suspense fallback={<EnquiryForm type="quote" products={products} />}>
                  <EnquiryTabs products={products} />
                </Suspense>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
