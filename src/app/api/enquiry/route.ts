import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/catalogue";
import { productDisplayName } from "@/lib/catalogue/format";
import { deliverEnquiry } from "@/lib/enquiry/deliver";
import { enquiryTypeLabels, normaliseEnquiry, validateEnquiry } from "@/lib/enquiry/schema";

const MAX_BODY_BYTES = 20_000;

/**
 * POST /api/enquiry
 *   200 { ok: true }                          delivered (receiver returned 2xx)
 *   422 { ok: false, error: "invalid", fields } validation failed
 *   503 { ok: false, error: "not_configured" }  no delivery destination set
 *   502 { ok: false, error: "delivery_failed" } no 2xx from the destination (it may
 *                                              still have received it, e.g. on timeout)
 *   400 { ok: false, error: "bad_request" }     malformed request
 * The client only reports success on 200 + ok: true.
 */
export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const input = normaliseEnquiry(raw);
  if (!input) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // Honeypot filled: reject without delivering.
  if (input.website) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  const fields = validateEnquiry(input);
  if (Object.keys(fields).length) return NextResponse.json({ ok: false, error: "invalid", fields }, { status: 422 });

  const product = input.productSlug ? await getProductBySlug(input.productSlug) : undefined;

  const { website: _honeypot, productSlug, ...details } = input;
  void _honeypot;
  const result = await deliverEnquiry({
    source: "mtdc-website",
    enquiryType: input.type,
    enquiryLabel: enquiryTypeLabels[input.type],
    submittedAt: new Date().toISOString(),
    ...details,
    product: product
      ? { slug: product.slug, name: productDisplayName(product), packSize: product.packSize ?? "", isPlaceholder: !!product.isPlaceholder }
      : productSlug
        ? { slug: productSlug, name: "Unknown product" }
        : null,
  });

  if (result.ok) return NextResponse.json({ ok: true });
  if (result.reason === "not_configured") return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
}
