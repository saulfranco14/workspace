import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['images.pexels.com', 'cdn.pixabay.com'],
  },
  compiler: {
    styledComponents: true,
  },
  allowedDevOrigins: ['http://localhost:3000', 'https://planta-shop.vercel.app'],
  trailingSlash: false,
};

export default nextConfig;
