/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js Image Optimization
    // Vercel provides built-in Image Optimization API
    // Remove unoptimized for optimized images
  },
}

export default nextConfig
