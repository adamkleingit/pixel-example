import type { NextConfig } from "next";
import path from "node:path";

const apiOrigin = process.env.API_PROXY_ORIGIN ?? "http://127.0.0.1:3001";
const appSrc = path.resolve(__dirname, "src").replace(/\\/g, "/");
const pixelReact = path.resolve(__dirname, "node_modules/@getpixel/ui/dist/pixel-react/index.js");
const realReact = path.resolve(__dirname, "node_modules/react/index.js");
const realReactDom = path.resolve(__dirname, "node_modules/react-dom/index.js");
const realReactDomClient = path.resolve(__dirname, "node_modules/react-dom/client.js");
const realJsxDevRuntime = path.resolve(__dirname, "node_modules/react/jsx-dev-runtime.js");
const realJsxRuntime = path.resolve(__dirname, "node_modules/react/jsx-runtime.js");

function isAppSource(context: string) {
  return context.replace(/\\/g, "/").includes("/packages/client/src");
}

function unifyReactAliases(alias: Record<string, string | false | string[]>) {
  const next: Record<string, string | false | string[]> = { ...alias };
  for (const [key, value] of Object.entries(alias)) {
    if (typeof value !== "string" || !value.includes("next/dist/compiled")) continue;
    if (key.includes("jsx-dev-runtime")) next[key] = realJsxDevRuntime;
    else if (key.includes("jsx-runtime")) next[key] = realJsxRuntime;
    else if (key === "react-dom/client$" || key.includes("react-dom/client")) next[key] = realReactDomClient;
    else if (key.startsWith("react-dom")) next[key] = realReactDom;
    else if (key.startsWith("react")) next[key] = realReact;
  }
  return next;
}

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
      config.resolve.alias = unifyReactAliases(config.resolve.alias ?? {});

      config.plugins.unshift(
        new webpack.NormalModuleReplacementPlugin(/^react$/, (resource: { context: string; request: string }) => {
          const ctx = resource.context.replace(/\\/g, "/");

          if (ctx.includes("@getpixel/ui/dist/pixel-react")) {
            return;
          }

          if (ctx.includes("@getpixel/ui/dist") && !ctx.includes("pixel-react")) {
            return;
          }

          if (isAppSource(ctx)) {
            resource.request = pixelReact;
          }
        }),
      );
    }

    return config;
  },
};

export default nextConfig;
