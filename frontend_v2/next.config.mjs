import { hostname } from 'os';

/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['demo-app.pegelinux.my.id'],
  },
};

export default nextConfig;