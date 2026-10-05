"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ENQUIRY_TYPES, enquiryTypeLabels, type EnquiryType } from "@/lib/enquiry/schema";
import { EnquiryForm, type ProductOption } from "./EnquiryForm";

const descriptions: Record<EnquiryType, string> = {
  quote: "For supermarkets, wholesalers, retailers, market traders, hotels, restaurants, caterers and institutions buying from MTDC.",
  general: "Questions about MTDC, our services or working with us.",
  partnership: "For manufacturers, producers, brand owners and importers looking for distribution in Abuja / FCT.",
};

function parseType(value: string | null): EnquiryType {
  return ENQUIRY_TYPES.includes(value as EnquiryType) ? (value as EnquiryType) : "quote";
}

/** Switches between the three enquiry forms; the choice is kept in the URL (?type=). */
export function EnquiryTabs({ products }: { products: ProductOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = parseType(params.get("type"));
  const productParam = params.get("product") ?? "";
  const defaultProduct = products.some((p) => p.slug === productParam) ? productParam : "";

  function select(type: EnquiryType) {
    const sp = new URLSearchParams(params.toString());
    sp.set("type", type);
    if (type === "partnership") sp.delete("product");
    router.replace(`${pathname}?${sp.toString()}#enquiry`, { scroll: false });
  }

  return (
    <div>
      <div role="tablist" aria-label="Enquiry type" className="grid grid-cols-3 gap-1 rounded-full bg-canvas p-1">
        {ENQUIRY_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`tab-${t}`}
            aria-selected={active === t}
            aria-controls={`panel-${t}`}
            onClick={() => select(t)}
            className={`rounded-full px-2 py-2.5 text-[0.8rem] font-semibold transition-all duration-200 sm:text-sm ${
              active === t ? "bg-white text-ink-900 shadow-[0_1px_3px_rgba(6,18,26,0.12)]" : "text-ink-500 hover:text-ink-900"
            }`}
          >
            {enquiryTypeLabels[t]}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm text-ink-500">{descriptions[active]}</p>
      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} className="mt-8">
        <EnquiryForm key={`${active}-${defaultProduct}`} type={active} products={products} defaultProductSlug={defaultProduct} />
      </div>
    </div>
  );
}
