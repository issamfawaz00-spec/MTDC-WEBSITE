// Static checks for the MTDC site. Run: node scripts/check.mjs
// - every local href/src points to an existing file (and #anchor where given)
// - product catalogue data is well-formed
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const errors = [];
const pages = fs.readdirSync(root).filter((f) => f.endsWith(".html"));

const ids = {};
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  ids[page] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: missing <title>`);
  if (!/<meta name="description" content="[^"]+">/.test(html)) errors.push(`${page}: missing meta description`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${page}: expected exactly one <h1>`);
}

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [file, hash] = url.split("#");
    const target = file === "" ? page : file.split("?")[0];
    if (!fs.existsSync(path.join(root, target))) {
      errors.push(`${page}: ${attr}="${url}" -> missing file`);
      continue;
    }
    if (hash && target.endsWith(".html") && !ids[target]?.has(hash)) {
      errors.push(`${page}: ${attr}="${url}" -> missing #${hash}`);
    }
  }
}

// Catalogue data
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/products-data.js"), "utf8"), sandbox);
const cat = sandbox.window.MTDC_CATALOGUE;
if (!cat) errors.push("products-data.js: MTDC_CATALOGUE not defined");
else {
  const catIds = new Set();
  for (const c of cat.categories) {
    if (!c.id || !c.name) errors.push(`category missing id/name: ${JSON.stringify(c)}`);
    if (catIds.has(c.id)) errors.push(`duplicate category id: ${c.id}`);
    catIds.add(c.id);
  }
  const prodIds = new Set();
  for (const p of cat.products) {
    for (const k of ["id", "category", "name"]) if (!p[k]) errors.push(`product missing ${k}: ${JSON.stringify(p)}`);
    if (p.id && !/^[a-z0-9-]+$/.test(p.id)) errors.push(`product id must be lowercase-with-dashes: ${p.id}`);
    if (prodIds.has(p.id)) errors.push(`duplicate product id: ${p.id}`);
    prodIds.add(p.id);
    if (!catIds.has(p.category)) errors.push(`product ${p.id}: unknown category "${p.category}"`);
    if (p.image && !fs.existsSync(path.join(root, p.image))) errors.push(`product ${p.id}: image not found ${p.image}`);
    if (!cat.isPlaceholder && p.placeholder) errors.push(`product ${p.id}: still marked placeholder but isPlaceholder is false`);
  }
  for (const b of cat.brands || []) {
    if (b.logo && !fs.existsSync(path.join(root, b.logo))) errors.push(`brand ${b.name}: logo not found ${b.logo}`);
  }
  console.log(`catalogue: ${cat.categories.length} categories, ${cat.products.length} products, placeholder=${cat.isPlaceholder}`);
}

console.log(`pages checked: ${pages.join(", ")}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log("All static checks passed.");
