/*
 * Optional browser smoke test (not part of the build). Requires Playwright:
 *   npm run build && npx next start -p 3100     (in one terminal)
 *   BASE_URL=http://localhost:3100 node scripts/smoke.cjs
 * Checks every page at phone and desktop widths for console errors and
 * horizontal overflow, exercises the catalogue filters and the enquiry forms,
 * checks production security headers (CSP violations surface as console
 * errors), and writes screenshots to ./screenshots (git-ignored).
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const base = (process.env.BASE_URL || "http://localhost:3100").replace(/\/$/, "");
const expectDelivery = process.env.EXPECT_DELIVERY === "1";
const out = path.resolve(__dirname, "..", "screenshots");
const pages = ["/", "/about", "/products", "/products/sample-product-01", "/services", "/partner", "/contact"];
const viewports = { phone: { width: 375, height: 812 }, desktop: { width: 1440, height: 900 } };
const fail = [];
const check = (cond, msg) => cond || fail.push(msg);
const shotName = (p) => (p === "/" ? "home" : p.slice(1).replace(/\//g, "-"));

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();

  for (const [vp, size] of Object.entries(viewports)) {
    const ctx = await browser.newContext({ viewport: size, reducedMotion: "reduce" });
    for (const p of pages) {
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const response = await page.goto(base + p, { waitUntil: "networkidle" });
      // Production security headers present; any CSP violation shows up as a console error above.
      check(!!response.headers()["content-security-policy"], `${vp} ${p}: Content-Security-Policy header present`);
      check(!errors.length, `${vp} ${p}: console errors: ${errors.join(" | ")}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(overflow <= 0, `${vp} ${p}: horizontal overflow ${overflow}px`);
      check((await page.locator("h1").count()) === 1, `${vp} ${p}: expected one h1`);
      await page.screenshot({ path: path.join(out, `${vp}-${shotName(p)}.png`), fullPage: true });
      await page.close();
    }
    if (vp === "phone") {
      const page = await ctx.newPage();
      await page.goto(base + "/");
      await page.click('button[aria-controls="mobile-nav"]');
      check(await page.isVisible("#mobile-nav"), "phone: mobile menu opens");
      await page.click("#mobile-nav >> text=Products & Brands");
      await page.waitForURL(/\/products$/);
      check(!(await page.isVisible("#mobile-nav")), "phone: mobile menu closes after navigation");
      await page.close();
    }
    await ctx.close();
  }

  const ctx = await browser.newContext({ viewport: viewports.desktop, reducedMotion: "reduce" });
  const page = await ctx.newPage();

  // Catalogue
  await page.goto(base + "/products");
  const cards = () => page.locator("article").count();
  const total = await cards();
  check(total > 0, "products: cards rendered");
  await page.locator("aside button", { hasText: "Sample Category B" }).click();
  await page.waitForURL(/category=category-b/);
  check((await cards()) < total, "products: category filter narrows results");
  await page.locator("aside button", { hasText: "Subcategory B2" }).click();
  await page.waitForURL(/sub=category-b-2/);
  await page.fill("#catalogue-search", "zzzz-no-match");
  check(await page.isVisible("text=No products match your search"), "products: empty state");
  await page.click("text=Clear filters");
  await page.waitForURL((u) => !u.search);
  await page.waitForTimeout(300);
  check((await cards()) === total, "products: clear filters");

  // Search box follows the URL when navigation changes it (Codex finding 1)
  // Typed key by key so URL updates overlap with typing; no characters may be lost.
  await page.locator("#catalogue-search").pressSequentially("Sample Product 05", { delay: 15 });
  await page.waitForURL(/q=Sample\+Product\+05/);
  await page.waitForTimeout(300);
  check((await page.inputValue("#catalogue-search")) === "Sample Product 05", "products: fast typing keeps every character");
  check((await cards()) === 1, "products: search narrows results");
  await page.locator("header").getByRole("link", { name: "Products & Brands" }).click();
  await page.waitForURL((u) => !u.search);
  await page.waitForTimeout(300);
  check((await page.inputValue("#catalogue-search")) === "", "products: search box cleared when URL has no query");
  check((await cards()) === total, "products: all products shown after navigating to /products");
  await page.goBack();
  await page.waitForURL(/q=Sample/);
  await page.waitForTimeout(300);
  check((await page.inputValue("#catalogue-search")) === "Sample Product 05", "products: search box restored on back navigation");

  // Interrupted search update (Codex re-review of finding 1): a keystroke and a
  // header navigation happen in the same instant, so the navigation lands while
  // the search update is still in flight. The box must follow the final URL,
  // and later URL changes must still be followed.
  await page.goto(base + "/products?q=abc", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const input = document.querySelector("#catalogue-search");
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setValue.call(input, "abcd");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    document.querySelector('header a[href="/products"]').click();
  });
  await page.waitForTimeout(1000);
  check(new URL(page.url()).search === "", `products (interrupted): URL has no query (got ${page.url()})`);
  check((await page.inputValue("#catalogue-search")) === "", "products (interrupted): box cleared after navigating away mid-update");
  check((await cards()) === total, "products (interrupted): all products shown");
  // Same instant again, but navigating Back to a URL whose query equals the old one.
  await page.goto(base + "/products?q=abc", { waitUntil: "networkidle" });
  await page.locator("header").getByRole("link", { name: "Products & Brands" }).click();
  await page.waitForURL((u) => !u.search);
  await page.evaluate(() => {
    const input = document.querySelector("#catalogue-search");
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setValue.call(input, "zz");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    window.history.back();
  });
  await page.waitForTimeout(1000);
  check(new URL(page.url()).searchParams.get("q") === "abc", `products (back mid-update): URL back at ?q=abc (got ${page.url()})`);
  check((await page.inputValue("#catalogue-search")) === "abc", "products (back mid-update): box matches URL");
  await page.evaluate(() => window.history.pushState(null, "", "/products?q=other"));
  await page.waitForTimeout(500);
  check((await page.inputValue("#catalogue-search")) === "other", "products (interrupted): later URL change to ?q=other is followed");

  // Product page -> quote prefill
  await page.goto(base + "/products/sample-product-01");
  await page.locator("main").getByRole("link", { name: "Request a Quote" }).first().click();
  await page.waitForURL(/contact\?type=quote&product=sample-product-01/);
  const productValue = await page.locator('select[name="productSlug"]').inputValue();
  check(productValue === "sample-product-01", "contact: product pre-selected from product page");

  // Validation
  await page.click('button[type="submit"]');
  check((await page.locator('[aria-invalid="true"]').count()) >= 4, "contact: validation errors shown");

  // Browser applies the server's trimming before validating (Codex finding 3):
  // spaces-only is rejected, a pasted email with surrounding spaces is accepted.
  await page.fill('input[name="name"]', "   ");
  await page.fill('input[name="phone"]', "-------");
  await page.click('button[type="submit"]');
  check(
    (await page.getAttribute('input[name="phone"]', "aria-invalid")) === "true",
    "contact: punctuation-only phone rejected (finding 4)",
  );
  check((await page.getAttribute('input[name="name"]', "aria-invalid")) === "true", "contact: spaces-only name rejected in browser");

  // Valid submission
  await page.fill('input[name="name"]', "Smoke Test");
  await page.fill('input[name="email"]', "  smoke@example.com  ");
  await page.fill('input[name="phone"]', "+234 800 000 0000");
  await page.selectOption('select[name="businessType"]', "Retailer");
  await page.fill('textarea[name="message"]', "Automated smoke test enquiry.");
  await page.check('input[name="consent"]');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(300);
  check((await page.getAttribute('input[name="email"]', "aria-invalid")) !== "true", "contact: email with surrounding spaces accepted");
  if (expectDelivery) {
    await page
      .waitForSelector("text=Your enquiry has been sent", { timeout: 10000 })
      .catch(() => fail.push("contact: success after delivery"));
  } else {
    await page
      .waitForSelector("text=Your enquiry has not been sent", { timeout: 10000 })
      .catch(() => fail.push("contact: not-sent message"));
    check(!(await page.isVisible("text=Your enquiry has been sent")), "contact: no false success");
    check((await page.inputValue('input[name="name"]')) === "Smoke Test", "contact: values kept when not sent");
  }
  await page.locator("#enquiry").screenshot({ path: path.join(out, `desktop-contact-form-${expectDelivery ? "sent" : "not-sent"}.png`) });

  // Unconfirmed delivery (receiver error or lost connection): never claims
  // success or that nothing was sent, and keeps the visitor's details (Codex finding 2)
  for (const mode of expectDelivery ? [] : ["http-502", "network"]) {
    await page.route("**/api/enquiry", (route) =>
      mode === "network"
        ? route.abort("connectionreset")
        : route.fulfill({ status: 502, contentType: "application/json", body: '{"ok":false,"error":"delivery_failed"}' }),
    );
    await page.click('#enquiry button[type="submit"]');
    await page
      .waitForSelector("text=couldn’t confirm that your enquiry was received", { timeout: 10000 })
      .catch(() => fail.push(`contact (${mode}): unconfirmed message`));
    check(!(await page.isVisible("text=Nothing was submitted")), `contact (${mode}): no claim that nothing was submitted`);
    check(!(await page.isVisible("text=Your enquiry has been sent")), `contact (${mode}): no false success`);
    check((await page.inputValue('input[name="name"]')) === "Smoke Test", `contact (${mode}): details kept in the form`);
    await page.unroute("**/api/enquiry");
  }

  // Tabs
  await page.click('role=tab[name="Brand Partnership"]');
  await page.waitForURL(/type=partnership/);
  check(await page.isVisible('select[name="partnerType"]'), "contact: partnership tab shows partner fields");

  await browser.close();
  if (fail.length) {
    console.error("FAILED:\n- " + fail.join("\n- "));
    process.exit(1);
  }
  console.log(`Smoke test passed (${expectDelivery ? "delivery configured" : "delivery not configured"}). Screenshots in ./screenshots`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
