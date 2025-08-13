import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "core.trackmania.nadeo.live",
        port: "",
        pathname: "/maps/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "avatars.ubisoft.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "trackmania.exchange",
        port: "",
        pathname: "/mapimage/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "trackmania.exchange",
        port: "",
        pathname: "/mappackthumb/**",
        search: "",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24, // 1 day
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1gb",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push("ssh2");
    }
    return config;
  },
};

export default nextConfig;
