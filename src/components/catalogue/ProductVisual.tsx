import Image from "next/image";
import type { ProductImage } from "@/lib/catalogue/types";

/**
 * Neutral line-art packaging used until real product photography is supplied.
 * It deliberately shows no brand, label or text that could be mistaken for a
 * real product.
 */
const shapes = [
  // bottle
  <g key="bottle">
    <path d="M88 40h24v18c0 6 14 12 14 30v68a8 8 0 0 1-8 8H82a8 8 0 0 1-8-8V88c0-18 14-24 14-30z" />
    <path d="M86 34h28v6H86z" />
    <path d="M74 104h52M74 140h52" />
  </g>,
  // carton
  <g key="carton">
    <path d="M64 70l36-18 36 18v86l-36 18-36-18z" />
    <path d="M64 70l36 18 36-18M100 88v86" />
    <path d="M82 61l36 18" />
  </g>,
  // can
  <g key="can">
    <ellipse cx="100" cy="54" rx="26" ry="8" />
    <path d="M74 54v104c0 4.4 11.6 8 26 8s26-3.6 26-8V54" />
    <path d="M74 72c0 4.4 11.6 8 26 8s26-3.6 26-8M74 140c0 4.4 11.6 8 26 8s26-3.6 26-8" />
  </g>,
  // jar
  <g key="jar">
    <path d="M78 50h44v14H78z" />
    <path d="M74 64h52c6 0 10 6 10 14v78a10 10 0 0 1-10 10H74a10 10 0 0 1-10-10V78c0-8 4-14 10-14z" />
    <path d="M64 100h72v36H64" />
  </g>,
  // pouch
  <g key="pouch">
    <path d="M72 46h56l-4 14c10 12 14 30 14 54v44a8 8 0 0 1-8 8H70a8 8 0 0 1-8-8v-44c0-24 4-42 14-54z" />
    <path d="M76 60h48" />
    <path d="M86 104h28" />
  </g>,
  // sack
  <g key="sack">
    <path d="M70 52c10 6 50 6 60 0l-4 16c10 14 16 38 16 62v26a10 10 0 0 1-10 10H68a10 10 0 0 1-10-10v-26c0-24 6-48 16-62z" />
    <path d="M74 68c12 4 40 4 52 0" />
    <path d="M80 112h40v30H80z" />
  </g>,
];

const tones = ["#f3f1ec", "#edf0ef", "#f1eee8", "#eceeec"];

/** FNV-1a with a final mix, so similar slugs still get varied shapes. */
function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return h >>> 0;
}

export function PlaceholderArt({ seed, caption = true, size = "md" }: { seed: string; caption?: boolean; size?: "md" | "lg" }) {
  const h = hash(seed);
  const shape = shapes[h % shapes.length];
  const tone = tones[(h >> 3) % tones.length];
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: tone }}>
      <svg viewBox="0 0 200 200" className={size === "lg" ? "w-1/2" : "w-[58%]"} aria-hidden="true" focusable="false">
        <ellipse cx="100" cy="176" rx="46" ry="5" fill="#0a1b25" opacity="0.06" />
        <g fill="#ffffff" fillOpacity="0.75" stroke="#aeb8be" strokeWidth="1.6" strokeLinejoin="round">
          {shape}
        </g>
      </svg>
      {caption && (
        <span className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-[0.68rem] font-medium tracking-wide whitespace-nowrap text-ink-400 sm:block">
          Photography coming soon
        </span>
      )}
    </div>
  );
}

/** Product photo if supplied, otherwise the neutral placeholder. */
export function ProductMedia({
  image,
  seed,
  sizes,
  priority,
  caption,
  size,
}: {
  image: ProductImage | undefined;
  seed: string;
  sizes: string;
  priority?: boolean;
  caption?: boolean;
  size?: "md" | "lg";
}) {
  if (!image) return <PlaceholderArt seed={seed} caption={caption} size={size} />;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-contain p-[8%] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
    />
  );
}
