/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/biggame_fantasy',
  trailingSlash: true,
  distDir: 'out',
};

module.export