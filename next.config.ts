import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // NOTE: 'muhurat-app' must match your GitHub repository name exactly.
  // If you name your repo something else, update this value.
  basePath: isProd ? '/muhurat-app' : '',
  assetPrefix: isProd ? '/muhurat-app/' : '',
};

export default nextConfig;
