/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.104"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "your-cdn.com" },
      { protocol: "https", hostname: "**" }, // ✅ '**' for wildcard, not '*'
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
  compress: true,
  reactStrictMode: true,
  // ✅ Catch type errors and lint errors at build time
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizeCss: true,
  },
  // ✅ Remove empty turbopack — causes warnings in Next.js 16
};

module.exports = nextConfig;