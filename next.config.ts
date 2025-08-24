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
        hostname: "backend.visarutsankham.com",
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
  // Headers for CORS handling
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
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
