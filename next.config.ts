import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set turbopack root to silence the workspace detection warning
  turbopack: {
    root: __dirname,
  },
  // Configure image domains and optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.sankham.cv",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "visarutsankham.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
    // Enable image optimization
    formats: ["image/webp", "image/avif"],
  },
  // Security & CORS headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

export default nextConfig;
