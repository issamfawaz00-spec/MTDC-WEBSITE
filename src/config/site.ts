/**
 * Company details and launch switches.
 *
 * Anything left as an empty string is shown on the site as "To be confirmed"
 * and is never linked. Fill these in only with approved details.
 */
export const siteConfig = {
  name: "MT Distribution Channel",
  shortName: "MTDC",
  tagline: "Helping brands move from product to market.",
  description:
    "MT Distribution Channel (MTDC) is an Abuja-based distribution and route-to-market company connecting manufacturers, producers, brand owners and importers with trade buyers across Abuja / FCT.",
  location: "Abuja, Nigeria",
  coverage: "Abuja / FCT",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /**
   * Search engine indexing. Keep false until the website is approved for
   * launch. When false, every page sends noindex/nofollow and robots.txt
   * disallows all crawling.
   */
  indexable: false,

  contact: {
    email: "",
    phone: "",
    /** International format digits only, e.g. "234XXXXXXXXXX". */
    whatsapp: "",
    address: "",
    hours: "",
  },
} as const;

export type ContactKey = keyof typeof siteConfig.contact;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products & Brands" },
  { href: "/services", label: "Services" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/contact", label: "Contact" },
] as const;
