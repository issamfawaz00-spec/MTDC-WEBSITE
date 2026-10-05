# MT Distribution Channel (MTDC) — company website

First version of the MTDC company website and product showcase.
Plain HTML, CSS and JavaScript: no build step, no framework, no backend.

> **Not live yet.** Every page carries `<meta name="robots" content="noindex, nofollow">`.
> Remove that line from each page when the site is approved for public launch.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `about.html` | About Us |
| `products.html` | Products & Brands (category filters, search, enquiry buttons) |
| `services.html` | Our Services |
| `partner.html` | Partner With Us (partnership enquiry form) |
| `contact.html` | Contact (contact details + enquiry form) |

## View it locally

From the repository folder, run any static file server, then open the address it prints:

```bash
python3 -m http.server 8080      # then open http://localhost:8080
# or
npx serve .
```

Opening `index.html` directly in a browser also works.

## Updating content

### Products, categories and brands → `assets/js/products-data.js`

This is the only file you edit to change the catalogue. Instructions are at the top of the file.
Product photos go in `assets/img/products/`, brand logos in `assets/img/brands/`.
When the real list is in, set `isPlaceholder: false` and remove `placeholder: true` from each product;
the yellow "placeholder" notices then disappear.

Each card's **Enquire** button opens the Contact page with the product pre-filled in the enquiry form.
Featured products on the Home page are those with `featured: true` (the first four are shown).

### Contact details and form delivery → `assets/js/site-config.js`

- `contact.email`, `phone`, `whatsapp`, `address`, `hours`: anything left empty is shown as
  "To be confirmed" and is never linked.
- `formEndpoint`: where enquiries are sent (e.g. a Formspree/Basin/Getform form URL, or MTDC's own backend).

**Forms are honest about delivery.** Until `formEndpoint` is set, submitting a valid form tells the visitor
their enquiry has *not* been sent and keeps what they typed. When an endpoint is set, a success message
appears only if the endpoint responds with a 2xx status; any failure shows an error.

### Page text, header and footer

Edit the `.html` files directly. The header and footer are repeated in each page,
so a change to navigation or footer must be made in all six files.

### Colours and typography → `assets/css/styles.css`

Design tokens (colours, radius, spacing) are at the top of the stylesheet.

## Checks

```bash
node scripts/check.mjs                              # links, anchors, page metadata, catalogue data
NODE_PATH="$(npm root -g)" node scripts/smoke.cjs   # browser test (needs Playwright installed)
```

The smoke test loads every page at phone and desktop widths, fails on console errors or horizontal
scrolling, exercises filters/search/enquiry pre-fill and both form outcomes, and writes screenshots
to `screenshots/` (git-ignored).

## Scope of this phase

Company website and product showcase only: no cart, checkout, payments or customer accounts.
Coverage is presented as Abuja / FCT.
