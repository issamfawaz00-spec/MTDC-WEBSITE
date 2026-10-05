import { availabilityLabels } from "@/lib/catalogue/labels";
import type { Availability } from "@/lib/catalogue/types";

const dots: Record<Availability, string> = {
  available: "bg-emerald-500",
  limited: "bg-amber-500",
  "on-request": "bg-teal-500",
  "coming-soon": "bg-ink-400",
  unconfirmed: "bg-ink-300",
};

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.8rem] text-ink-500">
      <span className={`size-1.5 rounded-full ${dots[availability]}`} aria-hidden="true" />
      {availabilityLabels[availability]}
    </span>
  );
}
