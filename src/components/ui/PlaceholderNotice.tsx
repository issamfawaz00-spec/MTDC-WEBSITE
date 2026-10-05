import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function PlaceholderNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="note" className="flex gap-3 rounded-xl border border-amber-line bg-amber-tint px-4 py-3.5 text-sm text-amber-ink sm:px-5">
      <Icon name="info" className="mt-0.5 size-5 shrink-0" />
      <p>
        <strong className="font-semibold">{title}</strong> {children}
      </p>
    </div>
  );
}
