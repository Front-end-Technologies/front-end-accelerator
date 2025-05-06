import type { NextConfig } from "next";
import nextMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveExtensions: ['.md', '.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  }
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
})

export default withMDX(nextConfig)
