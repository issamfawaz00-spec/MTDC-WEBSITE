import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "accent" | "outline" | "ghost" | "light" | "outline-light";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ink-900 text-white hover:bg-ink-700 shadow-[0_8px_24px_-12px_rgba(6,18,26,0.6)]",
  accent: "bg-teal-600 text-white hover:bg-teal-700 shadow-[0_8px_24px_-12px_rgba(11,138,133,0.7)]",
  outline: "border border-line-strong bg-white text-ink-900 hover:border-ink-900",
  ghost: "text-ink-900 hover:bg-canvas",
  light: "bg-white text-ink-900 hover:bg-canvas",
  "outline-light": "border border-white/25 text-white hover:border-white hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

function Content({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      {children}
      {arrow && <Icon name="arrowRight" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  arrow,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}

export function Button({
  variant,
  size,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}

/** Text link with a moving arrow, for secondary actions. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 font-semibold text-ink-900 underline-offset-4 hover:underline ${className}`}
    >
      {children}
      <Icon name="arrowRight" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
