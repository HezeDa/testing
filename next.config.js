/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config, { isServer }) => {
    // Включаем подробное логирование только в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      config.stats = 'verbose';
    }
    
    return config;
  },
  // Включаем подробное логирование маршрутов
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-debug',
              value: 'true',
            },
          ],
          destination: '/:path*',
        },
      ],
    };
  },
}

module.exports = nextConfig 