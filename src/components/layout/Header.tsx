"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
          scrolled || open ? "border-line shadow-[0_1px_0_rgba(6,18,26,0.02)]" : "border-transparent"
        }`}
      >
        <Container className="flex h-[4.5rem] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium whitespace-nowrap transition-colors duration-200 ${
                        active ? "text-ink-900" : "text-ink-500 hover:text-ink-900"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute inset-x-3.5 -bottom-[1.1rem] h-0.5 rounded-full bg-teal-500" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Wrapper controls visibility; Button's own display class would override `hidden`. */}
            <div className="hidden sm:block">
              <ButtonLink href="/contact?type=quote#enquiry" size="sm">
                Request a Quote
              </ButtonLink>
            </div>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink-900 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </Container>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise trap this fixed panel. */}
      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-line bg-white lg:hidden">
          <Container className="py-4">
            <nav aria-label="Mobile">
              <ul className="divide-y divide-line">
                {mainNav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between py-4 text-lg font-medium ${active ? "text-teal-700" : "text-ink-900"}`}
                      >
                        {item.label}
                        <Icon name="arrowRight" className="size-4 text-ink-400" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <ButtonLink href="/contact?type=quote#enquiry" size="lg" className="mt-6 w-full">
              Request a Quote
            </ButtonLink>
          </Container>
        </div>
      )}
    </>
  );
}
