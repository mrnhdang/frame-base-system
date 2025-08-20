import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true   // Next.js 15 recommends React Compiler
  }
};

export default nextConfig;
