import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const backendOrigin = (process.env.QUARK_API_URL || "http://127.0.0.1:8011").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return ["/chat/:path*", "/login"].map(source => ({ source, headers: [
      { key: "Cache-Control", value: "private, no-store" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "no-referrer" },
    ] }));
  },
  async rewrites() {
    return ["api", "media", "fonts", "webhooks"].map((prefix) => ({
      source: `/${prefix}/:path*`,
      destination: `${backendOrigin}/${prefix}/:path*`,
    }));
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
