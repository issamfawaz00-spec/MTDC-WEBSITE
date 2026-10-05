import Image from "next/image";
import type { Brand } from "@/lib/catalogue/types";

export function BrandStrip({ brands }: { brands: Brand[] }) {
  return (
    <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-4">
      {brands.map((b) => (
        <li key={b.id} className="flex h-28 items-center justify-center border-r border-b border-line px-6 sm:h-32">
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
