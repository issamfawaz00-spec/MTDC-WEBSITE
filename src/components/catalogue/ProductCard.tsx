import Link from "next/link";
import type { ProductView } from "@/lib/catalogue/types";
import { productDisplayName } from "@/lib/catalogue/format";
import { Icon } from "@/components/ui/Icon";
import { ProductMedia } from "./ProductVisual";

export function quoteHref(slug: string) {
  return `/contact?type=quote&product=${encodeURIComponent(slug)}#enquiry`;
}

export function ProductCard({ product, priority }: { product: ProductView; priority?: boolean }) {
  const specs = [product.packSize, product.cartonConfiguration].filter(Boolean).join(" · ");
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-canvas ring-1 ring-line transition-shadow duration-300 group-hover:shadow-[0_18px_40px_-24px_rgba(6,18,26,0.35)]">
        <ProductMedia
          image={product.images[0]}
          seed={product.slug}
          sizes="(min-width: 1280px) 290px, (min-width: 768px) 33vw, 50vw"
          priority={priority}
        />
        {product.isPlaceholder && (
          <span className="absolute top-3 left-3 rounded-full border border-amber-line bg-amber-tint/95 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.08em] text-amber-ink uppercase">
            Sample
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[0.72rem] font-semibold tracking-[0.12em] text-ink-500 uppercase">{product.brand?.name}</p>
        <h3 className="mt-1.5 text-[1.02rem] leading-snug font-semibold text-ink-900">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink-500">{specs || "Pack size and carton details to be confirmed"}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
          <span className="hidden items-center gap-1.5 text-sm font-medium text-ink-900 sm:inline-flex">
            View product
            <Icon name="arrowRight" className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
          <Link
            href={quoteHref(product.slug)}
            className="relative z-10 -mx-2 rounded-full px-2 py-1 text-sm font-medium text-teal-700 underline-offset-4 hover:underline"
            aria-label={`Request a quote for ${productDisplayName(product)}`}
          >
            Request a quote
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, columns = 4 }: { products: ProductView[]; columns?: 3 | 4 }) {
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 ${columns === 4 ? "xl:grid-cols-4" : ""}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 2} />
      ))}
    </div>
  );
}
