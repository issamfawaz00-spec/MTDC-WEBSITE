/** Marks a detail that has not been approved yet. Never rendered as a link. */
export function Tbc({ label = "To be confirmed", tone = "dark" }: { label?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-dashed px-2 py-0.5 text-[0.8em] font-medium ${
        tone === "light" ? "border-white/25 text-ink-300" : "border-amber-line bg-amber-tint text-amber-ink"
      }`}
    >
      {label}
    </span>
  );
}
