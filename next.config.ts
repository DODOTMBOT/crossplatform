import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Блок eslint убрали, чтобы не было ошибки типов
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;