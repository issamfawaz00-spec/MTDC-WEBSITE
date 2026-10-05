import Link from "next/link";

export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="10" fill="#0a1b25" />
      <path d="M10 28l7-7 5 4 8-11" fill="none" stroke="#6fd3cc" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.5 13.5H30V19" fill="none" stroke="#6fd3cc" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="28" r="2.4" fill="#fff" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="MT Distribution Channel, home">
      <LogoMark className={`size-9 ${light ? "ring-1 ring-white/15 rounded-[10px]" : ""}`} />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.05rem] font-bold tracking-[0.08em] ${light ? "text-white" : "text-ink-900"}`}>MTDC</span>
        <span className={`mt-1 text-[0.68rem] font-medium tracking-[0.02em] whitespace-nowrap ${light ? "text-ink-300" : "text-ink-500"}`}>
          MT Distribution Channel
        </span>
      </span>
    </Link>
  );
}
