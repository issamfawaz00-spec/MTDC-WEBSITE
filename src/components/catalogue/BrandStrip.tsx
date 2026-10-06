import Image from "next/image";
import type { Brand } from "@/lib/catalogue/types";

/**
 * Hairline grid of brand tiles. Tiles keep a fixed width (2 per row on
 * phones, 4 from tablet up) and any incomplete row is centred, so there
 * are never empty cells, whatever the number of brands. Each tile draws
 * its own border, overlapped by 1px so neighbouring lines don't double.
 */
export function BrandStrip({ brands }: { brands: Brand[] }) {
  return (
    <ul className="flex flex-wrap justify-center pt-px pl-px">
      {brands.map((b) => (
        <li
          key={b.id}
          className="-mt-px -ml-px flex h-28 basis-1/2 items-center justify-center border border-line bg-white px-6 sm:h-32 sm:basis-1/4"
        >
          {b.logo ? (
            <Image
              src={b.logo}
              alt={b.name}
              width={160}
              height={64}
              className="max-h-12 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          ) : (
            <span className="text-center text-sm font-medium tracking-wide text-ink-400">
              {b.name}
              {b.isPlaceholder && <span className="mt-1 block text-[0.68rem] tracking-[0.1em] uppercase">Logo placeholder</span>}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
