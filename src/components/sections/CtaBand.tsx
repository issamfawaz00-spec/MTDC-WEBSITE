import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/** Closing call-to-action on a dark band. */
export function CtaBand({ eyebrow, title, intro, actions }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; actions: ReactNode }) {
  return (
    <section className="bg-ink-900 text-white">
      <Container className="py-20 sm:py-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]" data-reveal>
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
            <h2 className="mt-4 text-[2rem] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[2.75rem]">{title}</h2>
            {intro && <p className="mt-5 text-lg leading-relaxed text-ink-300">{intro}</p>}
          </div>
          <div className="flex flex-wrap gap-3">{actions}</div>
        </div>
      </Container>
    </section>
  );
}
