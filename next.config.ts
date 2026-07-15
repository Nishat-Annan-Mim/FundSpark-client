import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://fundspark-server.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
