/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  // Use the prefix for GitHub Pages
  basePath: isProd ? '/SimplifySpaceJunk' : '',
  assetPrefix: isProd ? '/SimplifySpaceJunk/' : '',
  output: 'standalone',
}

module.exports = nextConfig
