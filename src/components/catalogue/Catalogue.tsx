"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Category, ProductView } from "@/lib/catalogue/types";
import { Icon } from "@/components/ui/Icon";
import { normaliseForSearch } from "@/lib/catalogue/format";
import { ProductGrid } from "./ProductCard";

const ALL = "all";

/**
 * Catalogue browser: category + subcategory filters and search.
 * Filter state lives in the URL (?category=&sub=&q=) so views can be shared.
 */
export function Catalogue({ products, categories }: { products: ProductView[]; categories: Category[] }) {
  const params = useSearchParams();

  const categoryParam = params.get("category");
  const activeCategory = categories.find((c) => c.slug === categoryParam);
  const activeSub = activeCategory?.subcategories.find((s) => s.id === params.get("sub"));
  const urlQuery = params.get("q") ?? "";
  // The search box is local state so typing stays smooth; the URL is the
  // source of truth. Filter changes are written with the native History API,
  // which updates the address bar immediately (Next.js keeps useSearchParams
  // in sync), so there is never a pending update to go stale. Whenever the
  // URL changes, from typing, a link, Back/Forward or a shared URL, the box
  // adopts the address bar's actual query unless it already matches.
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    // Reads the address bar (outside React), which render code cannot do; an
    // effect is the intended place to sync with such an external system.
    const live = new URLSearchParams(window.location.search).get("q") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the address bar, see above
    setQuery((current) => (current.trim() === live ? current : live));
    // Runs on every URL change (new params object), not only when ?q= differs
    // from the last render, so no navigation can be missed.
  }, [params]);

  function update(next: { category?: string | null; sub?: string | null; q?: string | null }) {
    // Build on the live address bar, not a possibly older render's params.
    const sp = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(next)) {
      if (value === undefined) continue;
      if (value === null || value === "" || value === ALL) sp.delete(key);
      else sp.set(key, value);
    }
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }

  function search(value: string, extra: { category?: null; sub?: null } = {}) {
    setQuery(value);
    update({ ...extra, q: value.trim() || null });
  }

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1);
      if (p.subcategoryId) map.set(p.subcategoryId, (map.get(p.subcategoryId) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const visible = useMemo(() => {
    const terms = normaliseForSearch(query).split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      if (activeCategory && p.categoryId !== activeCategory.id) return false;
      if (activeSub && p.subcategoryId !== activeSub.id) return false;
      if (!terms.length) return true;
      const haystack = normaliseForSearch(
        [p.name, p.brand?.name, p.manufacturer, p.category?.name, p.subcategory?.name, p.packSize, p.description].join(" "),
      );
      return terms.every((t) => haystack.includes(t));
    });
  }, [products, activeCategory, activeSub, query]);

  const chip = (selected: boolean) =>
    `inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200 ${
      selected ? "border-ink-900 bg-ink-900 text-white" : "border-line-strong bg-white text-ink-600 hover:border-ink-900 hover:text-ink-900"
    }`;

  const sideItem = (selected: boolean) =>
    `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[0.93rem] transition-colors duration-150 ${
      selected ? "bg-canvas font-semibold text-ink-900" : "text-ink-600 hover:bg-canvas/70 hover:text-ink-900"
    }`;

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block" aria-label="Product categories">
        <div className="sticky top-28">
          <p className="px-3 text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">Categories</p>
          <ul className="mt-4 space-y-0.5">
            <li>
              <button
                type="button"
                className={sideItem(!activeCategory)}
                aria-pressed={!activeCategory}
                onClick={() => update({ category: null, sub: null })}
              >
                All products <span className="text-xs text-ink-400">{products.length}</span>
              </button>
            </li>
            {categories.map((c) => {
              const selected = activeCategory?.id === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={sideItem(selected && !activeSub)}
                    aria-pressed={selected}
                    onClick={() => update({ category: c.slug, sub: null })}
                  >
                    {c.name} <span className="text-xs text-ink-400">{counts.get(c.id) ?? 0}</span>
                  </button>
                  {selected && c.subcategories.length > 0 && (
                    <ul className="mt-0.5 mb-2 ml-3 space-y-0.5 border-l border-line pl-2">
                      {c.subcategories.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            className={sideItem(activeSub?.id === s.id)}
                            aria-pressed={activeSub?.id === s.id}
                            onClick={() => update({ sub: activeSub?.id === s.id ? null : s.id })}
                          >
                            {s.name} <span className="text-xs text-ink-400">{counts.get(s.id) ?? 0}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <label htmlFor="catalogue-search" className="sr-only">
              Search products
            </label>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-ink-400" />
            <input
              id="catalogue-search"
              type="search"
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search by product, brand or category"
              autoComplete="off"
              className="field-input rounded-full pl-10"
            />
          </div>
          <p className="text-sm text-ink-500" aria-live="polite">
            {visible.length} of {products.length} products
            {activeCategory ? ` in ${activeSub?.name ?? activeCategory.name}` : ""}
          </p>
        </div>

        {/* Mobile / tablet category chips */}
        <div
          className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            className={chip(!activeCategory)}
            aria-pressed={!activeCategory}
            onClick={() => update({ category: null, sub: null })}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={chip(activeCategory?.id === c.id)}
              aria-pressed={activeCategory?.id === c.id}
              onClick={() => update({ category: c.slug, sub: null })}
            >
              {c.name}
            </button>
          ))}
        </div>
        {activeCategory && activeCategory.subcategories.length > 0 && (
          <div
            className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden"
            role="group"
            aria-label="Filter by subcategory"
          >
            {activeCategory.subcategories.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`${chip(activeSub?.id === s.id)} h-9 text-[0.82rem]`}
                aria-pressed={activeSub?.id === s.id}
                onClick={() => update({ sub: activeSub?.id === s.id ? null : s.id })}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8">
          {visible.length ? (
            <ProductGrid products={visible} columns={3} />
          ) : (
            <div className="rounded-card border border-dashed border-line-strong px-6 py-16 text-center">
              <p className="text-lg font-semibold">No products match your search</p>
              <p className="mt-2 text-ink-500">Try another category or search term, or ask our team directly.</p>
              <button
                type="button"
                onClick={() => search("", { category: null, sub: null })}
                className="mt-6 text-sm font-semibold text-ink-900 underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
