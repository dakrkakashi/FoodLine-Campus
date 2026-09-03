import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
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
};

export default nextConfig;
