import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@supabase\/realtime-js/,
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    // Handle external dependencies from @qb/quickbot package
    if (!isServer) {
      // For client-side, ensure Supabase is resolved from node_modules
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }

    return config;
  },
};

export default nextConfig;
