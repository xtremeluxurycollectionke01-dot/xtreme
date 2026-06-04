/*import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here *
};

export default nextConfig;*/


/*import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;*/

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/socket/io",
        destination: "/api/socket/io",
      },
    ];
  },
};

export default nextConfig;