import { siteConfig, type ContactKey } from "@/config/site";
import { Tbc } from "./Tbc";

/** Renders an approved contact detail as a link, or "To be confirmed". */
export function ContactValue({ field, tone = "dark" }: { field: ContactKey; tone?: "dark" | "light" }) {
  const value = siteConfig.contact[field].trim();
  if (!value) return <Tbc tone={tone} />;

  const linkClass = "underline-offset-4 hover:underline";
  switch (field) {
    case "email":
      return (
        <a className={linkClass} href={`mailto:${value}`}>
          {value}
        </a>
      );
    case "phone":
      return (
        <a className={linkClass} href={`tel:${value.replace(/[^\d+]/g, "")}`}>
          {value}
        </a>
      );
    case "whatsapp": {
      const digits = value.replace(/\D/g, "");
      return (
        <a className={linkClass} href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
          +{digits}
        </a>
      );
    }
    default:
      return <>{value}</>;
  }
}
