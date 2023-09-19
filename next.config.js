/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV !== "production",
    register: true,
    skipWaiting: true,
  },
});
