/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remova ou comente a linha abaixo:
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
