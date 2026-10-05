import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/** Inner-page header: breadcrumb, eyebrow, title and intro on a calm canvas. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: { href?: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-canvas">
      <Container className="pt-10 pb-14 sm:pt-14 sm:pb-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-ink-300">
                    /
                  </span>
                )}
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink-900">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink-900">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-10 max-w-3xl animate-fade-up">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 text-[2.4rem] leading-[1.05] font-semibold tracking-[-0.03em] text-ink-900 sm:text-[3.4rem]">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">{intro}</p>}
          {children}
        </div>
      </Container>
    </section>
  );
}
