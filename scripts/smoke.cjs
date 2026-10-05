// Browser smoke test. Needs Playwright. Run:
//   NODE_PATH="$(npm root -g)" node scripts/smoke.cjs
// Serves the site locally, checks every page at phone and desktop widths,
// exercises filters and forms, and saves screenshots to ./screenshots.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(root, p === "/" ? "index.html" : p);
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const pages = ["index.html", "about.html", "products.html", "services.html", "partner.html", "contact.html"];
const viewports = { phone: { width: 375, height: 812 }, desktop: { width: 1366, height: 900 } };
const fail = [];
const check = (cond, msg) => { if (!cond) fail.push(msg); };

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  fs.mkdirSync(path.join(root, "screenshots"), { recursive: true });

  for (const [vpName, vp] of Object.entries(viewports)) {
    const ctx = await browser.newContext({ viewport: vp });
    for (const p of pages) {
      const page = await ctx.newPage();
      const errs = [];
      page.on("pageerror", (e) => errs.push(e.message));
      // Web fonts are external; failing to reach them offline is not a site error.
      page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g/.test(m.text() + (m.location().url || ""))) errs.push(m.text()); });
      await page.goto(base + p, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      check(!errs.length, `${vpName} ${p}: console errors: ${errs.join(" | ")}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(overflow <= 0, `${vpName} ${p}: horizontal overflow ${overflow}px`);
      await page.screenshot({ path: path.join(root, "screenshots", `${vpName}-${p.replace(".html", "")}.png`), fullPage: true });
      await page.close();
    }

    // Mobile nav
    if (vpName === "phone") {
      const page = await ctx.newPage();
      await page.goto(base + "index.html");
      check(!(await page.isVisible(".site-nav")), "phone: nav should start closed");
      await page.click(".nav-toggle");
      check(await page.isVisible(".site-nav"), "phone: nav should open on toggle");
      await page.close();
    }
    await ctx.close();
  }

  // Catalogue behaviour
  const ctx = await browser.newContext({ viewport: viewports.desktop });
  const page = await ctx.newPage();
  await page.goto(base + "index.html");
  check((await page.locator("[data-featured-products] .product-card").count()) === 4, "home: expected 4 featured products");
  await page.goto(base + "products.html");
  const total = await page.locator("[data-grid] .product-card").count();
  check(total === 10, `products: expected 10 cards, got ${total}`);
  await page.click('.filter-chip[data-category="category-b"]');
  check((await page.locator("[data-grid] .product-card").count()) === 3, "products: category filter");
  check(page.url().includes("category=category-b"), "products: category in URL");
  await page.fill("[data-search]", "zzzz");
  check(await page.isVisible("[data-empty]"), "products: empty state");
  await page.click("[data-reset]");
  check((await page.locator("[data-grid] .product-card").count()) === 10, "products: reset");
  await page.screenshot({ path: path.join(root, "screenshots", "desktop-products-viewport.png") });

  // Enquiry link pre-fills contact form
  await page.click("[data-grid] .product-card >> nth=0 >> text=Enquire");
  await page.waitForURL(/contact\.html\?product=/);
  check((await page.inputValue("#c-product")).includes("Sample product 01"), "contact: product prefill");
  check((await page.inputValue("#c-enquiry-type")) === "Product enquiry", "contact: enquiry type prefill");

  // Empty submit -> validation errors
  await page.click('#enquiry [type="submit"]');
  check((await page.locator("#enquiry .field-error").count()) >= 4, "contact: validation errors shown");

  // Valid submit with no endpoint -> clearly NOT sent, no success
  await page.fill("#c-name", "Test Person");
  await page.fill("#c-email", "test@example.com");
  await page.fill("#c-phone", "+234 800 000 0000");
  await page.selectOption("#c-business-type", "Retailer");
  await page.fill("#c-message", "Smoke test message only.");
  await page.check("#c-consent");
  await page.click('#enquiry [type="submit"]');
  const statusText = await page.textContent("#enquiry .form-status");
  check(/NOT been sent/.test(statusText), "contact: no-endpoint message");
  check(!(await page.locator(".form-status.is-success").count()), "contact: must not show success without endpoint");
  check((await page.inputValue("#c-name")) === "Test Person", "contact: data kept after unsent submit");
  await page.locator("#enquiry").screenshot({ path: path.join(root, "screenshots", "desktop-contact-form-unsent.png") });

  // With an endpoint that fails -> error, with one that succeeds -> success
  for (const [status, expect] of [[500, "is-error"], [200, "is-success"]]) {
    const p2 = await ctx.newPage();
    await p2.route("**/test-endpoint", (r) => r.fulfill({ status, body: "{}" }));
    await p2.route("**/assets/js/site-config.js", async (r) => {
      const body = fs.readFileSync(path.join(root, "assets/js/site-config.js"), "utf8").replace('formEndpoint: ""', 'formEndpoint: "/test-endpoint"');
      r.fulfill({ status: 200, contentType: "text/javascript", body });
    });
    await p2.goto(base + "partner.html");
    await p2.fill("#p-company", "Co");
    await p2.selectOption("#p-type", "Importer");
    await p2.fill("#p-name", "Name");
    await p2.fill("#p-email", "a@b.co");
    await p2.fill("#p-phone", "08000000000");
    await p2.fill("#p-message", "Testing the endpoint path.");
    await p2.check("#p-consent");
    await p2.click('#partner-form [type="submit"]');
    await p2.waitForSelector(`#partner-form .form-status.${expect}`, { timeout: 5000 }).catch(() => fail.push(`partner: expected ${expect} for HTTP ${status}`));
    await p2.close();
  }

  await browser.close();
  server.close();
  if (fail.length) { console.error("FAILED:\n- " + fail.join("\n- ")); process.exit(1); }
  console.log("Smoke test passed. Screenshots in ./screenshots");
})().catch((e) => { console.error(e); process.exit(1); });
