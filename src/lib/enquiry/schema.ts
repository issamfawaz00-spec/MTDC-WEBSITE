/**
 * Enquiry form definitions and validation, shared by the browser and the
 * server so both apply exactly the same rules.
 */

export const ENQUIRY_TYPES = ["quote", "general", "partnership"] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const enquiryTypeLabels: Record<EnquiryType, string> = {
  quote: "Request a Quote",
  general: "General Enquiry",
  partnership: "Brand Partnership",
};

export const BUSINESS_TYPES = [
  "Supermarket",
  "Wholesaler",
  "Retailer",
  "Open market trader",
  "Hotel",
  "Restaurant",
  "Caterer",
  "Institutional buyer",
  "Other",
] as const;

export const PARTNER_TYPES = ["Manufacturer", "Producer", "Brand owner", "Importer"] as const;

export interface EnquiryInput {
  type: EnquiryType;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  businessType: string;
  partnerType: string;
  productSlug: string;
  quantity: string;
  deliveryArea: string;
  productsAndBrands: string;
  message: string;
  consent: boolean;
  /** Honeypot: real visitors never see or fill this. */
  website: string;
}

export type EnquiryField = Exclude<keyof EnquiryInput, "type" | "website">;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const emptyEnquiry = (type: EnquiryType, productSlug = ""): EnquiryInput => ({
  type,
  name: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  businessType: "",
  partnerType: "",
  productSlug,
  quantity: "",
  deliveryArea: "",
  productsAndBrands: "",
  message: "",
  consent: false,
  website: "",
});

const LIMITS: Partial<Record<EnquiryField, number>> = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  role: 120,
  quantity: 120,
  deliveryArea: 160,
  productsAndBrands: 500,
  message: 4000,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s-]{7,}$/;

/** Fields shown and required for each enquiry type. */
export const requiredFields: Record<EnquiryType, EnquiryField[]> = {
  quote: ["name", "email", "phone", "businessType", "message", "consent"],
  general: ["name", "email", "phone", "message", "consent"],
  partnership: ["name", "email", "phone", "company", "partnerType", "message", "consent"],
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Normalises untrusted input into an EnquiryInput (unknown keys dropped). */
export function normaliseEnquiry(raw: unknown): EnquiryInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const type = str(r.type) as EnquiryType;
  if (!ENQUIRY_TYPES.includes(type)) return null;
  return {
    type,
    name: str(r.name),
    email: str(r.email),
    phone: str(r.phone),
    company: str(r.company),
    role: str(r.role),
    businessType: str(r.businessType),
    partnerType: str(r.partnerType),
    productSlug: str(r.productSlug),
    quantity: str(r.quantity),
    deliveryArea: str(r.deliveryArea),
    productsAndBrands: str(r.productsAndBrands),
    message: str(r.message),
    consent: r.consent === true,
    website: str(r.website),
  };
}

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const field of requiredFields[input.type]) {
    const value = input[field];
    if (field === "consent") {
      if (value !== true) errors.consent = "Please confirm we may use these details to respond.";
    } else if (!value) {
      errors[field] = "This field is required.";
    }
  }
  if (input.email && !EMAIL.test(input.email)) errors.email = "Please enter a valid email address.";
  if (input.phone && !PHONE.test(input.phone)) errors.phone = "Please enter a valid phone number.";
  if (input.message && input.message.length < 10 && !errors.message) errors.message = "Please add a little more detail.";
  if (input.businessType && !(BUSINESS_TYPES as readonly string[]).includes(input.businessType))
    errors.businessType = "Please choose an option.";
  if (input.partnerType && !(PARTNER_TYPES as readonly string[]).includes(input.partnerType))
    errors.partnerType = "Please choose an option.";
  for (const [field, max] of Object.entries(LIMITS) as [EnquiryField, number][]) {
    const value = input[field];
    if (typeof value === "string" && value.length > max) errors[field] = `Please keep this under ${max} characters.`;
  }
  return errors;
}
