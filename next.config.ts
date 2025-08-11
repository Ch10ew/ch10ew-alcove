import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
