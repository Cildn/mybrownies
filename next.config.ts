import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Enables Next.js app directory
  },

  images: {
    domains: ['localhost', '5.135.21.229'],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*", // Proxy API requests
      },

      {
        source: "/uploads/:path*",
        destination: "http://localhost:4000/uploads/:path*",
      },
    ];
  },

  // Configure API body size limit
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set the limit to 10 MB (or any value suitable for your use case)
    },
  },

  webpack(config) {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Add SVGR support for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Polyfill or ignore Node.js modules
    config.resolve.fallback = {
      fs: false, // Ignore `fs` module
      path: false, // Ignore `path` module
      stream: require.resolve("stream-browserify"), // Polyfill `stream`
      buffer: require.resolve("buffer/"), // Polyfill `buffer`
    };

    return config;
  },
};

export default nextConfig;