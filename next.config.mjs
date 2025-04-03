/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'storage.googleapis.com'],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: false,
};

export default nextConfig;
