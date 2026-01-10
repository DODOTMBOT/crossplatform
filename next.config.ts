import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Разрешаем загрузку до 50 МБ (хватит для видео)
    },
  },
};

export default nextConfig;