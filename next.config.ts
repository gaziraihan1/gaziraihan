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
  },
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true
  }
};

module.exports = nextConfig;