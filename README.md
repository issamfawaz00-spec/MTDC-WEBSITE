# MT Distribution Channel (MTDC) — website

Company website and B2B product catalogue for MT Distribution Channel, an Abuja-based distribution and
route-to-market company. Built with **Next.js (App Router) + TypeScript + Tailwind CSS**.

> **Development only.** The site is `noindex, nofollow` and `robots.txt` blocks all crawlers until
> `indexable` is set to `true` in `src/config/site.ts` (after launch approval).

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Approved, stable website. Changes arrive only by approved merge. |
| `claude/work` | Development branch. All work happens here and is reviewed before merging. |

## Run locally (Windows PowerShell)

Requires **Node.js 20.9 or newer** (LTS recommended) and Git.

```powershell
git clone https://github.com/issamfawaz00-spec/MTDC-WEBSITE.git
cd MTDC-WEBSITE
git checkout claude/work
npm install
npm run dev
```

Open http://localhost:3000. Stop the server with `Ctrl+C`.

Production preview: `npm run build` then `npm start`.

## Checks

```powershell
npm run typecheck   # route type generation + TypeScript
npm run lint        # ESLint (Next.js core-web-vitals + TypeScript rules)
npm run build       # production build; also validates the catalogue data
npm run check       # all three, in order
```

Optional browser smoke test (needs Playwright installed separately; not a project dependency):
start the site on port 3100 and run `node scripts/smoke.cjs`. It checks every page at phone and
desktop widths, the catalogue filters and both enquiry outcomes, and saves screenshots to `screenshots/`.

## Project structure

```
src/
  app/                      Routes (Next.js App Router)
    page.tsx                Home
    about/ services/ partner/ contact/
    products/page.tsx       Catalogue (filters, search)
    products/[slug]/        Product detail page, one static page per product
    api/enquiry/route.ts    Enquiry endpoint (validates, then delivers)
    layout.tsx              Header, footer, fonts, site-wide metadata
    robots.ts sitemap.ts    SEO files (robots blocks all while noindex)
  components/
    layout/                 Header, Footer, Logo
    ui/                     Button, Container, SectionHeading, Icon, Tbc, notices, scroll reveal
    sections/               PageHeader, CtaBand, ChannelGrid
    catalogue/              ProductCard, ProductGrid, Catalogue browser, BrandStrip, placeholders
    forms/                  EnquiryForm, EnquiryTabs
  config/site.ts            Company details, contact details, navigation, indexing switch
  content/
    catalogue/              products.ts, categories.ts, brands.ts  <- the catalogue data
    services.ts channels.ts Service and channel copy
  lib/
    catalogue/              Types, data access functions, validation, labels
    enquiry/                Shared form schema/validation, delivery
public/images/products      Product photography (to be supplied)
public/images/brands        Brand logos (to be supplied)
```

### Catalogue

The data model is in `src/lib/catalogue/types.ts`. Each product supports: id, slug, name, brand,
manufacturer, category, subcategory, description, pack size, carton configuration, images,
availability, featured and channel types.

- Edit products in `src/content/catalogue/products.ts` (field guide at the top of the file),
  categories in `categories.ts`, brands in `brands.ts`.
- Pages read the catalogue **only** through the async functions in `src/lib/catalogue/index.ts`.
  Moving to a database, CMS, admin dashboard or ERP/API later means changing that one file.
- Catalogue data is validated when the site builds (duplicate slugs, unknown brands or categories,
  missing image alt text, etc.). A mistake fails the build with a clear message instead of reaching the site.
- Each product gets its own page at `/products/<slug>`.
- Remove `isPlaceholder: true` from entries as real data replaces them; the "Sample" labels and
  notices disappear automatically when no placeholders remain.

### Working MTDC catalogue — 6 October 2026

The sample catalogue has been replaced with 13 product entries from MTDC's supplied list:
Zyn vegetable oil (25 kg), Zyn soya oil (25 kg, 1 L, 1.7 L, 5 L), rice (25 kg and 50 kg),
Lamoure tomato paste (50 g, 210 g, 400 g, 2.2 kg), Rima markouk bread and shisha charcoal.

- Category groupings and the four Home featured products are provisional for review.
- Descriptions explicitly say **Draft description**. No ingredients, quality or exclusivity claims are inferred.
- Rice and charcoal brands are unset. Missing brands show **To be confirmed** on product details,
  and are not added to the brand strip.
- The tomato-paste brand spelling **Lamoure** is preserved as supplied; confirm against packaging.
- Bread types and charcoal types/sizes still need confirmation.
- Every availability value remains `unconfirmed`; no stock quantities or prices are supplied.
- Product images, brand logos, manufacturers, carton configurations and suitable channels await confirmation.
- Oil bulk weights remain **25 kg**, not silently converted to litres.
- Tobacco flavour entries are not included in this sales/enquiry catalogue.
- Charcoal is listed under a **Charcoal** category (renamed from "Shisha Accessories" by owner decision);
  the product name is kept as supplied.

### Enquiries

Three forms share one component: **Request a Quote**, **General Enquiry** and **Brand Partnership**.
The browser and the server apply the same validation (`src/lib/enquiry/schema.ts`).

`POST /api/enquiry` forwards each valid enquiry as JSON to `ENQUIRY_WEBHOOK_URL`
(see `.env.example`; works with Formspree, Make/Zapier, n8n, a CRM or MTDC's own backend).

- **A success message appears only when the webhook answers with a 2xx status.**
- With no webhook configured, the visitor is told their enquiry has **not** been sent and their
  details stay in the form.
- To configure locally, copy `.env.example` to `.env.local` and fill it in. Never commit `.env*` files.

#### Required before public enquiry delivery: rate limiting

`/api/enquiry` has no rate limiting yet. **Do not set `ENQUIRY_WEBHOOK_URL` on the public site until
rate limiting is in place.** Requirements (agreed in review):

- Choose the counter store once hosting is decided. In-memory counters only work for a single running
  process; multiple processes or serverless instances need a shared store (e.g. Redis).
- Identify visitors from information supplied by the trusted hosting platform or proxy. Do not trust a
  raw incoming `X-Forwarded-For` header, which visitors can forge.
- Check the limit **before** an enquiry is forwarded to the webhook.
- Over the limit, respond `429 Too Many Requests` with a `Retry-After` header; the form must say the
  enquiry was not sent.
- Remove expired counters so memory or storage does not grow without bound.

### Security headers

Production builds (`npm run build` / `npm start`) send a Content-Security-Policy, HSTS
(`max-age=63072000`, no `includeSubDomains` yet), `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` and `Permissions-Policy`; see `next.config.ts`. `next dev` sends none of them.

- The CSP only allows the site's own resources. **Adding any third-party service** (maps, analytics,
  chat, embedded video, external images) requires extending the policy, or it will be blocked.
- Add `includeSubDomains` to HSTS only once HTTPS is confirmed for every subdomain.
- Before launch, test the production policy on the real domain over HTTPS.

### Contact details

Set approved details in `src/config/site.ts` (`contact`). Empty values show "To be confirmed" and are never linked.

## Scope

Company website and product showcase only: no cart, checkout, payments, prices, customer accounts,
seller accounts or supplier dashboards. Coverage is presented as Abuja / FCT.
The architecture is prepared for (but does not implement) a database-backed catalogue, admin dashboard,
stock availability, trade pricing, an RFQ basket, ordering, ERP integration and analytics.
