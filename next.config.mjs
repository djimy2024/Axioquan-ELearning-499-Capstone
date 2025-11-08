/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove cacheComponents as it's not a valid option
  // Remove eslint configuration from here
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig