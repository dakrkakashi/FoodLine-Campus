/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/account',
        destination: '/profile',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/404', destination: '/error/404' },
      { source: '/500', destination: '/error/500' },
    ];
  },
};

export default nextConfig;
