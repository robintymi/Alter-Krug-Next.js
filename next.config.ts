import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/projects/AlterKrug',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: '/projects/AlterKrug',
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
