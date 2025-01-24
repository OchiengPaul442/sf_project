/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "eu-west-2.graphassets.com",
  //     },
  //   ],
  //   dangerouslyAllowSVG: true,
  //   contentDispositionType: "inline",
  //   minimumCacheTTL: 60,
  //   deviceSizes: [320, 420, 768, 1024, 1200],
  //   imageSizes: [16, 32, 48, 64, 96],
  // },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
