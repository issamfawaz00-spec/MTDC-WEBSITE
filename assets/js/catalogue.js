/*
 * MTDC — product catalogue rendering.
 * Reads window.MTDC_CATALOGUE (assets/js/products-data.js) and renders:
 *   [data-catalogue]            full catalogue with filters + search (Products page)
 *   [data-featured-products]    featured products (Home page)
 *   [data-brand-strip]          brand logo tiles
 *   [data-if-placeholder]       elements shown only while the catalogue is placeholder data
 */
(function () {
  "use strict";

  var data = window.MTDC_CATALOGUE || { categories: [], products: [], brands: [] };
  var categories = data.categories || [];
  var products = data.products || [];
  var brands = data.brands || [];

  var categoryNames = {};
  categories.forEach(function (c) {
    categoryNames[c.id] = c.name;
  });

  var PHOTO_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
  var MAIL_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function enquiryHref(product) {
    return "contact.html?product=" + encodeURIComponent(product.id) + "#enquiry";
  }

  function productCard(product) {
    var card = el("article", "product-card");

    /* Media */
    var media = el("div", "product-media");
    if (product.image) {
      var img = document.createElement("img");
      img.src = product.image;
      img.alt = product.imageAlt || [product.brand, product.name].filter(Boolean).join(" ");
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 800;
      img.height = 800;
      media.appendChild(img);
    } else {
      media.classList.add("is-placeholder");
      var ph = el("div", "photo-placeholder");
      ph.innerHTML = PHOTO_ICON;
      ph.appendChild(el("span", null, "Product photo coming soon"));
      media.appendChild(ph);
    }
    if (product.placeholder) {
      media.appendChild(el("span", "product-flag", "Placeholder"));
    }
    card.appendChild(media);

    /* Body */
    var body = el("div", "product-body");
    if (categoryNames[product.category]) {
      body.appendChild(el("p", "product-category", categoryNames[product.category]));
    }
    if (product.brand) body.appendChild(el("p", "product-brand", product.brand));
    body.appendChild(el("h3", "product-name", product.name));
    if (product.description) body.appendChild(el("p", "product-desc", product.description));

    var meta = el("div", "product-meta");
    var pack = el("p", "pack-size mb-0");
    pack.appendChild(el("span", null, "Pack size"));
    pack.appendChild(document.createTextNode(product.packSize || "To be confirmed"));
    meta.appendChild(pack);

    var cta = el("a", "btn btn-primary btn-sm");
    cta.href = enquiryHref(product);
    cta.innerHTML = MAIL_ICON;
    cta.appendChild(document.createTextNode("Enquire"));
    cta.setAttribute("aria-label", "Enquire about " + [product.brand, product.name].filter(Boolean).join(" "));
    meta.appendChild(cta);

    body.appendChild(meta);
    card.appendChild(body);
    return card;
  }

  /* ---------- Placeholder notices ---------- */
  document.querySelectorAll("[data-if-placeholder]").forEach(function (node) {
    node.hidden = !data.isPlaceholder;
  });

  /* ---------- Featured products (Home) ---------- */
  document.querySelectorAll("[data-featured-products]").forEach(function (grid) {
    var limit = parseInt(grid.getAttribute("data-limit"), 10) || 4;
    var featured = products.filter(function (p) {
      return p.featured;
    });
    if (!featured.length) featured = products.slice();
    featured.slice(0, limit).forEach(function (p) {
      grid.appendChild(productCard(p));
    });
  });

  /* ---------- Brand strip ---------- */
  document.querySelectorAll("[data-brand-strip]").forEach(function (strip) {
    brands.forEach(function (b) {
      var tile = el("div", "brand-tile");
      if (b.logo) {
        tile.classList.add("has-logo");
        var img = document.createElement("img");
        img.src = b.logo;
        img.alt = b.name;
        img.loading = "lazy";
        tile.appendChild(img);
      } else {
        tile.textContent = b.name;
      }
      strip.appendChild(tile);
    });
  });

  /* ---------- Full catalogue (Products page) ---------- */
  var root = document.querySelector("[data-catalogue]");
  if (!root) return;

  var filterGroup = root.querySelector("[data-filters]");
  var grid = root.querySelector("[data-grid]");
  var countEl = root.querySelector("[data-count]");
  var searchInput = root.querySelector("[data-search]");
  var emptyEl = root.querySelector("[data-empty]");
  var resetBtn = root.querySelector("[data-reset]");

  var params = new URLSearchParams(window.location.search);
  var state = {
    category: categoryNames[params.get("category")] ? params.get("category") : "all",
    query: ""
  };

  function countFor(id) {
    if (id === "all") return products.length;
    return products.filter(function (p) {
      return p.category === id;
    }).length;
  }

  function buildFilters() {
    var options = [{ id: "all", name: "All products" }].concat(categories);
    options.forEach(function (opt) {
      var btn = el("button", "filter-chip");
      btn.type = "button";
      btn.setAttribute("data-category", opt.id);
      btn.setAttribute("aria-pressed", String(opt.id === state.category));
      btn.appendChild(document.createTextNode(opt.name));
      btn.appendChild(el("span", "count", String(countFor(opt.id))));
      btn.addEventListener("click", function () {
        state.category = opt.id;
        syncUrl();
        render();
      });
      filterGroup.appendChild(btn);
    });
  }

  function syncUrl() {
    var url = new URL(window.location.href);
    if (state.category === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", state.category);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function matches(p) {
    if (state.category !== "all" && p.category !== state.category) return false;
    if (!state.query) return true;
    var haystack = [p.brand, p.name, p.description, p.packSize, categoryNames[p.category]]
      .join(" ")
      .toLowerCase();
    return state.query
      .toLowerCase()
      .split(/\s+/)
      .every(function (term) {
        return haystack.indexOf(term) !== -1;
      });
  }

  function render() {
    filterGroup.querySelectorAll(".filter-chip").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-category") === state.category));
    });

    var list = products.filter(matches);
    grid.textContent = "";
    list.forEach(function (p) {
      grid.appendChild(productCard(p));
    });

    emptyEl.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    countEl.textContent =
      "Showing " + list.length + " of " + products.length + " product" + (products.length === 1 ? "" : "s") +
      (state.category !== "all" ? " in " + categoryNames[state.category] : "");
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value.trim();
      render();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      state.category = "all";
      state.query = "";
      if (searchInput) searchInput.value = "";
      syncUrl();
      render();
    });
  }

  buildFilters();
  render();
})();
