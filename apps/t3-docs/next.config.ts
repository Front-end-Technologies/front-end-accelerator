import type { NextConfig } from "next";

// needed for webcontainers COEP and COOP headers
// https://webcontainers.io/guides/configuring-headers
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
        source: "/(.*)",
      },
    ];
  },
};

export default nextConfig;
