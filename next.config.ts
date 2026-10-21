import type { NextConfig } from "next";

const lanOrigin = process.env.LAN_ORIGIN ? [process.env.LAN_ORIGIN] : [];

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    ...lanOrigin,
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
    "localhost:*",
    "*.loca.lt",
    "*.ngrok.io",
    "*.ngrok-free.app",
    "*.trycloudflare.com",
  ],
  images: {
    unoptimized: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
