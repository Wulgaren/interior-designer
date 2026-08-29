import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [
    {
      url: "/~offline",
      revision: "homiq-offline-v1",
    },
  ],
});

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/.git/**",
          "**/node_modules/**",
          "**/.next/**",
          "**/.playwright-mcp/**",
          "**/public/sw.js",
          "**/public/swe-worker*.js",
        ],
      };
    }
    return config;
  },
};

export default withSerwist(nextConfig);
