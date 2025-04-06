import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "core.trackmania.nadeo.live",
        port: "",
        pathname: "/maps/**",
        search: "",
      }
    ],
    minimumCacheTTL: 60 * 60 * 24, // 1 day
  }
};

export default nextConfig;
