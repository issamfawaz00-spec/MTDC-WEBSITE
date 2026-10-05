import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && <p className={`eyebrow ${light ? "eyebrow-light" : ""} ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>}
      <Tag
        className={`mt-4 text-[2rem] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[2.6rem] ${light ? "text-white" : "text-ink-900"}`}
      >
        {title}
      </Tag>
      {intro && <p className={`mt-5 text-[1.05rem] leading-relaxed sm:text-lg ${light ? "text-ink-300" : "text-ink-600"}`}>{intro}</p>}
    </div>
  );
}
