"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import {
  BUSINESS_TYPES,
  PARTNER_TYPES,
  emptyEnquiry,
  requiredFields,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryInput,
  type EnquiryType,
} from "@/lib/enquiry/schema";

export interface ProductOption {
  slug: string;
  label: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "not-sent"; reason: "not_configured" | "failed" | "invalid" };

const submitLabels: Record<EnquiryType, string> = {
  quote: "Send quote request",
  general: "Send enquiry",
  partnership: "Send partnership enquiry",
};

export function EnquiryForm({
  type,
  products = [],
  defaultProductSlug = "",
}: {
  type: EnquiryType;
  products?: ProductOption[];
  defaultProductSlug?: string;
}) {
  const uid = useId();
  const [values, setValues] = useState<EnquiryInput>(() => emptyEnquiry(type, defaultProductSlug));
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const required = new Set<EnquiryField>(requiredFields[type]);
  const id = (field: string) => `${uid}-${field}`;

  function set<K extends keyof EnquiryInput>(field: K, value: EnquiryInput[K]) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field as EnquiryField]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function focusFirstError(errs: EnquiryErrors) {
    const first = Object.keys(errs)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  function announce(next: Status) {
    setStatus(next);
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errs = validateEnquiry(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus({ kind: "idle" });
      focusFirstError(errs);
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; fields?: EnquiryErrors } | null;

      if (res.ok && data?.ok === true) {
        setValues(emptyEnquiry(type));
        announce({ kind: "sent" });
        return;
      }
      if (data?.error === "invalid" && data.fields) {
        setErrors(data.fields);
        setStatus({ kind: "not-sent", reason: "invalid" });
        focusFirstError(data.fields);
        return;
      }
      announce({ kind: "not-sent", reason: data?.error === "not_configured" ? "not_configured" : "failed" });
    } catch {
      announce({ kind: "not-sent", reason: "failed" });
    }
  }

  const field = (name: EnquiryField, label: string, input: ReactNode, opts: { full?: boolean; hint?: string } = {}) => (
    <div className={opts.full ? "sm:col-span-2" : ""}>
      <label htmlFor={id(name)} className="mb-1.5 block text-sm font-medium text-ink-900">
        {label}
        {!required.has(name) && <span className="ml-1 font-normal text-ink-400">(optional)</span>}
      </label>
      {input}
      {opts.hint && !errors[name] && <p className="mt-1.5 text-xs text-ink-500">{opts.hint}</p>}
      {errors[name] && (
        <p id={id(`${name}-error`)} className="mt-1.5 text-[0.8rem] text-red-700">
          {errors[name]}
        </p>
      )}
    </div>
  );

  const aria = (name: EnquiryField) => ({
    id: id(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? id(`${name}-error`) : undefined,
    "aria-required": required.has(name) || undefined,
  });

  const text = (name: EnquiryField, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      {...aria(name)}
      type="text"
      className="field-input"
      value={values[name] as string}
      onChange={(e) => set(name, e.target.value)}
      {...props}
    />
  );

  const select = (name: EnquiryField, options: readonly string[] | ProductOption[], placeholder: string) => (
    <select
      {...aria(name)}
      className="field-input appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%235b6f7c%22%20stroke-width=%222%22%3E%3Cpath%20d=%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[length:18px] bg-[right_0.9rem_center] bg-no-repeat pr-10"
      value={values[name] as string}
      onChange={(e) => set(name, e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.slug} value={o.slug}>
            {o.label}
          </option>
        ),
      )}
    </select>
  );

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative">
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[10000px] size-px overflow-hidden">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input
          id={id("website")}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {type === "partnership" && (
          <>
            {field("company", "Company name", text("company", { autoComplete: "organization" }))}
            {field("partnerType", "Your business is a", select("partnerType", PARTNER_TYPES, "Select one"))}
          </>
        )}

        {field("name", "Your name", text("name", { autoComplete: "name" }))}
        {type === "partnership"
          ? field("role", "Your role", text("role", { autoComplete: "organization-title" }))
          : field("company", "Business name", text("company", { autoComplete: "organization" }))}

        {field("email", "Email address", text("email", { type: "email", autoComplete: "email", inputMode: "email" }))}
        {field("phone", "Phone number", text("phone", { type: "tel", autoComplete: "tel", inputMode: "tel" }))}

        {type !== "partnership" && (
          <>
            {field("businessType", "Type of business", select("businessType", BUSINESS_TYPES, "Select one"))}
            {field(
              "productSlug",
              "Product",
              select("productSlug", products, type === "quote" ? "Not sure yet / several products" : "Not about a specific product"),
            )}
          </>
        )}

        {type === "quote" && (
          <>
            {field("quantity", "Approximate quantity", text("quantity", { placeholder: "e.g. 20 cartons per month" }))}
            {field("deliveryArea", "Delivery area", text("deliveryArea", { placeholder: "Area within Abuja / FCT" }))}
          </>
        )}

        {type === "partnership" &&
          field(
            "productsAndBrands",
            "Products and brands",
            text("productsAndBrands", { placeholder: "Brands and product types you would like distributed" }),
            { full: true },
          )}

        {field(
          "message",
          type === "partnership" ? "Tell us about your goals in Abuja / FCT" : "Message",
          <textarea
            {...aria("message")}
            rows={5}
            className="field-input min-h-36 resize-y"
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={
              type === "quote"
                ? "Products, pack sizes, frequency of supply and anything else we should know"
                : type === "partnership"
                  ? "Current presence in Abuja, channels you want to reach, timelines"
                  : "How can we help?"
            }
          />,
          { full: true },
        )}

        <div className="sm:col-span-2">
          <label htmlFor={id("consent")} className="flex items-start gap-3 text-sm text-ink-600">
            <input
              {...aria("consent")}
              type="checkbox"
              checked={values.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="mt-0.5 size-[1.15rem] shrink-0 rounded border-line-strong accent-ink-900"
            />
            I agree that MTDC may use these details to respond to this enquiry.
          </label>
          {errors.consent && (
            <p id={id("consent-error")} className="mt-1.5 text-[0.8rem] text-red-700">
              {errors.consent}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status.kind === "sending"} arrow={status.kind !== "sending"}>
          {status.kind === "sending" ? "Sending…" : submitLabels[type]}
        </Button>
        <p className="text-xs text-ink-500">No payment or account needed. Our team replies with availability and trade terms.</p>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status.kind === "sent" && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            <p className="font-semibold">Thank you. Your enquiry has been sent to MTDC.</p>
            <p className="mt-1">Our team will reply using the contact details you provided.</p>
          </div>
        )}
        {status.kind === "not-sent" && status.reason === "not_configured" && (
          <div className="mt-6 rounded-xl border border-amber-line bg-amber-tint px-5 py-4 text-sm text-amber-ink">
            <p className="font-semibold">Your enquiry has not been sent.</p>
            <p className="mt-1">
              Online enquiries are not connected yet. Your details are still in the form. Please contact MTDC directly using the details on
              this page.
            </p>
          </div>
        )}
        {status.kind === "not-sent" && status.reason === "failed" && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
            <p className="font-semibold">Sorry, your enquiry could not be sent.</p>
            <p className="mt-1">Nothing was submitted. Please try again in a moment, or contact MTDC directly.</p>
          </div>
        )}
        {status.kind === "not-sent" && status.reason === "invalid" && (
          <p className="mt-6 text-sm text-red-700">Please correct the highlighted fields and try again.</p>
        )}
      </div>
    </form>
  );
}
