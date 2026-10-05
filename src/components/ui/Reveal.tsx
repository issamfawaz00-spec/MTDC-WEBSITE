"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Subtle scroll reveal for elements marked with `data-reveal`.
 * Content is only hidden after this runs (via the `reveal-ready` class),
 * so pages stay fully visible without JavaScript or with reduced motion.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));

    // Anything already on screen shows immediately; the rest fades in on scroll.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.setAttribute("data-revealed", "");
      else observer.observe(el);
    }
    root.classList.add("reveal-ready");

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
