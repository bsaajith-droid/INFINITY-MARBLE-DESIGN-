/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['drizzle-orm', '@neondatabase/serverless', 'better-auth'],
}

export default nextConfig
