import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/brand/mtdc-logo.webp";

/**
 * MTDC logo, used exactly as supplied (public/images/brand/mtdc-logo.webp,
 * 2000 x 667, transparent background). The file has transparent margins
 * around the lettering (about 13.2% left/right, 27% top/bottom); negative
 * margins cancel them so the letters align with the page edge.
 *
 * The lettering is dark navy, so on dark backgrounds (`tone="light"`) the
 * logo sits on a white panel rather than being recoloured.
 */
function LogoImage({ width, priority }: { width: number; priority?: boolean }) {
  const height = Math.round((width * logo.height) / logo.width);
  const marginX = Math.round(width * 0.132);
  const marginY = Math.round(height * 0.268);
  return (
    <Image
      src={logo}
      alt="MTDC"
      width={width}
      height={height}
      priority={priority}
      style={{ margin: `-${marginY}px -${marginX}px` }}
      className="max-w-none"
    />
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <Link href="/" className="inline-flex items-center gap-3.5" aria-label="MT Distribution Channel (MTDC), home">
      {light ? (
        <span className="inline-flex rounded-lg bg-white px-3.5 py-2.5">
          <LogoImage width={140} />
        </span>
      ) : (
        <LogoImage width={150} priority />
      )}
      <span
        className={`hidden border-l pl-3.5 text-[0.72rem] leading-tight font-medium tracking-[0.02em] sm:block ${
          light ? "border-white/15 text-ink-300" : "border-line-strong text-ink-500"
        }`}
      >
        MT Distribution
        <br />
        Channel
      </span>
    </Link>
  );
}
