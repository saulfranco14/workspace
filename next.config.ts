import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
