import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Content Security Policy: only the site's own scripts, styles, images and
 * fonts (the Inter font is self-hosted by next/font). Next.js needs inline
 * scripts and styles, hence 'unsafe-inline'; a nonce-based policy would force
 * every page to render per request. Adding third-party services later (maps,
 * analytics, chat) requires extending this policy.
 *
 * `upgrade-insecure-requests` is deliberately omitted so a local production
 * preview over plain HTTP keeps working; HSTS enforces HTTPS on the live site.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // No includeSubDomains until HTTPS is confirmed on every subdomain. Browsers
  // ignore HSTS over plain HTTP, so local previews are unaffected.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Production only: `next dev` needs eval and websockets for live reload.
  async headers() {
    return isProduction ? [{ source: "/:path*", headers: securityHeaders }] : [];
  },
};

export default nextConfig;
