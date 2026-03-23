/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://rand-es.vercel.app/api/v1",
  },
};

module.exports = nextConfig;
