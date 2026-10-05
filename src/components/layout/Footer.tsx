import Link from "next/link";
import { siteConfig } from "@/config/site";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { ContactValue } from "@/components/ui/ContactValue";
import { Logo } from "./Logo";

const companyLinks = [
  { href: "/about", label: "About MTDC" },
  { href: "/services", label: "Services" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/contact", label: "Contact" },
];

const productLinks = [
  { href: "/products", label: "Products & Brands" },
  { href: "/contact?type=quote#enquiry", label: "Request a Quote" },
  { href: "/contact?type=partnership#enquiry", label: "Brand partnerships" },
];

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold tracking-[0.16em] text-white uppercase">{title}</h2>
      <ul className="mt-5 space-y-3 text-[0.92rem]">{children}</ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-950 text-ink-300">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-ink-400">
              Distribution and route-to-market services in {siteConfig.coverage}. {siteConfig.tagline}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <FooterColumn title="Company">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Services">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`} className="transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Contact">
              <li>{siteConfig.location}</li>
              <li>Coverage: {siteConfig.coverage}</li>
              <li className="flex flex-wrap items-center gap-2">
                Email: <ContactValue field="email" tone="light" />
              </li>
              <li className="flex flex-wrap items-center gap-2">
                Phone: <ContactValue field="phone" tone="light" />
              </li>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name} ({siteConfig.shortName}). All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
