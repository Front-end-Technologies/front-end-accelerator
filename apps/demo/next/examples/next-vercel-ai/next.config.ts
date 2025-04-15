import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveExtensions: ['.md', '.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  }
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
