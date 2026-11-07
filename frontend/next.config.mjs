// Enforce single-worker compilation on Windows to prevent concurrent mkdir EPERM race conditions
process.env.NEXT_CPU_NUM = "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
