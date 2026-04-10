// next.config.js


/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['192.168.1.104'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'your-cdn.com',
      },
      {
        protocol: 'https',
        hostname: '*'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 64, 96, 128, 256, 384]
  },
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true
  },
  // eslint: {
    // ignoreDuringBuilds: true
  // },
  // typescript: {
    // ignoreBuildErrors: true
  // }
};

module.exports = nextConfig;