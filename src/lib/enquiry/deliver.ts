/* Server-only: imported by the enquiry API route, never by client components. */

/**
 * Enquiry delivery. Today: POST JSON to a configured webhook.
 * Later this is the single place to plug in email, a CRM, Odoo/ERP or a
 * database, without changing the forms or the API route.
 */
export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

export async function deliverEnquiry(payload: Record<string, unknown>): Promise<DeliveryResult> {
  const url = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (!url) return { ok: false, reason: "not_configured" };

  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET?.trim();
  if (secret) headers.Authorization = `Bearer ${secret}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[enquiry] webhook responded ${res.status}`);
      return { ok: false, reason: "failed" };
    }
    return { ok: true };
  } catch (error) {
    console.error("[enquiry] webhook request failed", error);
    return { ok: false, reason: "failed" };
  }
}
