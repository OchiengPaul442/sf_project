/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  // Keep only essential optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optimize images
  images: {
    unoptimized: false,
  },
  // Cache build output
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
};

export default nextConfig;
