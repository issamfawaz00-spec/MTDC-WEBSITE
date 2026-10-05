import type { SVGProps } from "react";

/** Minimal line-icon set (24px grid, 1.6 stroke). Decorative by default. */
const paths = {
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4-4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </>
  ),
  phone: <path d="M5 3.5h3.5l2 5-2.5 1.5a11 11 0 0 0 6 6l1.5-2.5 5 2V19a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2z" />,
  chat: <path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-2v18" />
      <path d="M12 8l8 2.5V21" />
      <path d="M2.5 21h19" />
      <path d="M7.5 8h1M7.5 12h1M7.5 16h1M15.5 13h1M15.5 17h1" />
    </>
  ),
  supermarket: (
    <>
      <circle cx="9" cy="20" r="1.3" />
      <circle cx="17.5" cy="20" r="1.3" />
      <path d="M2.5 3.5h2.8l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.4-1.1L21 8H6.2" />
    </>
  ),
  wholesale: (
    <>
      <path d="M3 20.5V8.5L12 3.5l9 5v12" />
      <path d="M7 20.5V12h10v8.5" />
      <path d="M7 16h10" />
    </>
  ),
  retail: (
    <>
      <path d="M4 9.5h16l-1.2-5H5.2z" />
      <path d="M5 9.5v11h14v-11" />
      <path d="M10 20.5v-5.5h4v5.5" />
    </>
  ),
  market: (
    <>
      <path d="M3 10l2-5.5h14L21 10" />
      <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 12.5v8h14v-8" />
    </>
  ),
  hotel: (
    <>
      <path d="M3 20V5" />
      <path d="M3 15h18v5" />
      <path d="M3 11.5h7V8h8a3 3 0 0 1 3 3v4" />
      <circle cx="6.5" cy="9" r="1.5" />
    </>
  ),
  restaurant: (
    <>
      <path d="M7 3v8a2 2 0 0 0 2 2v8" />
      <path d="M11 3v8a2 2 0 0 1-2 2" />
      <path d="M17.5 21V3c-2 1-3 3.2-3 6v4h3" />
    </>
  ),
  catering: (
    <>
      <path d="M3 17.5h18" />
      <path d="M4.5 17.5a7.5 7.5 0 0 1 15 0" />
      <path d="M12 6.5V4.5" />
      <path d="M2 20.5h20" />
    </>
  ),
  institution: (
    <>
      <path d="M3 21h18" />
      <path d="M4.5 9.5L12 4l7.5 5.5" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6h11v10h-11z" />
      <path d="M13.5 9.5h4l3.5 3.5v3h-7.5" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  warehouse: (
    <>
      <path d="M2.5 20V9l9.5-5.5L21.5 9v11" />
      <path d="M6.5 20v-7.5h11V20" />
      <path d="M6.5 16.2h11" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="18" cy="5.5" r="2" />
      <path d="M8 18.5h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v5M12 12l-5.5 5.5M12 12l5.5 5.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3.5 10.5v3l11.5 5V5.5z" />
      <path d="M7 13.8V18a2 2 0 0 0 4 0v-2.6" />
      <path d="M19 9.5a3.5 3.5 0 0 1 0 5" />
    </>
  ),
  factory: (
    <>
      <path d="M2.5 20.5V10l6 3.5V10l6 3.5V5.5h6.5v15z" />
      <path d="M6 17h2M11 17h2M16 17h2" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19.5C5 10.5 11 5 20 4.5c0 9-5.5 15-14.5 15" />
      <path d="M5 19.5l7-7" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12.2V4h8.2L21 13.8 13.8 21z" />
      <circle cx="7.5" cy="8.5" r="1.4" />
    </>
  ),
  ship: (
    <>
      <path d="M3 15l2 5.5h14l2-5.5z" />
      <path d="M5 15V9.5h14V15" />
      <path d="M12 4v5.5" />
      <path d="M9 6h6" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
  box: (
    <>
      <path d="M20.5 7.5L12 3 3.5 7.5v9L12 21l8.5-4.5z" />
      <path d="M3.5 7.5L12 12l8.5-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  handshake: (
    <>
      <path d="M11 17l2 2a1.5 1.5 0 0 0 2-2" />
      <path d="M14 16l2.5 2.5a1.5 1.5 0 0 0 2-2L14 12" />
      <path d="M2 11l5-5 4 2h3l4-2 4 5-3 3" />
      <path d="M7 6l-3 8 4 4 3-2" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M6.5 16.5v-4M11 16.5v-8M15.5 16.5v-6M20 16.5V5.5" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5", ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
