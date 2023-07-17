/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    apiUrl: process.env.API_URL,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
