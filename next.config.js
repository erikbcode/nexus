/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['lh3.googleusercontent.com'] },
  experimental: {
    appDir: true,
    serverActions: true,
  },
  optimizeFonts: false,
};

module.exports = nextConfig;
