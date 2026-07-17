import type { NextConfig } from "next";
import path from "node:path";

const apiOrigin = process.env.API_PROXY_ORIGIN ?? "http://127.0.0.1:3001";
const appSrc = path.resolve(__dirname, "src");

const nextConfig: NextConfig = {
  transpilePackages: ["@kanban/shared", "@getpixel/ui"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
  webpack(config, { dev, isServer, webpack }) {
    if (dev && !isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^react$/, (resource) => {
          if (resource.context.startsWith(appSrc)) {
            resource.request = "@getpixel/ui/pixel-react";
          }
        }),
      );
    }

    return config;
  },
};

export default nextConfig;
