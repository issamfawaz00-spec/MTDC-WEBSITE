import Image from "next/image";
import type { ProductImage } from "@/lib/catalogue/types";

/**
 * Neutral tile shown until a product photo is supplied. It deliberately
 * depicts no packaging type (bottle, tin, sack...), so it never suggests
 * how a product is packed, and shows no brand, label or text.
 */
export function PlaceholderArt({
  caption = true,
  size = "md",
  tone = "canvas",
}: {
  caption?: boolean;
  size?: "md" | "lg";
  /** "white" for tiles placed on the canvas-coloured hero. */
  tone?: "canvas" | "white";
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-300 ${tone === "white" ? "bg-white" : "bg-canvas"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={size === "lg" ? "size-16" : "size-10"}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="3" y="4.5" width="18" height="15" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M21 16l-5-5-8.5 8.5" />
      </svg>
      {caption && <span className="hidden text-[0.72rem] font-medium tracking-wide text-ink-400 sm:block">Photo coming soon</span>}
    </div>
  );
}

/** Product photo if supplied, otherwise the neutral placeholder. */
export function ProductMedia({
  image,
  sizes,
  priority,
  caption,
  size,
  tone,
}: {
  image: ProductImage | undefined;
  sizes: string;
  priority?: boolean;
  caption?: boolean;
  size?: "md" | "lg";
  tone?: "canvas" | "white";
}) {
  if (!image) return <PlaceholderArt caption={caption} size={size} tone={tone} />;
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
