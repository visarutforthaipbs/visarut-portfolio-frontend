import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set turbopack root to silence the workspace detection warning
  turbopack: {
    root: __dirname,
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

export default nextConfig;
