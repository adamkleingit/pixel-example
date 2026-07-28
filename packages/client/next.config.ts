import type { NextConfig } from "next";
import path from "node:path";

const apiOrigin = process.env.API_PROXY_ORIGIN ?? "http://127.0.0.1:3001";
const pixelReact = path.resolve(__dirname, "src/lib/pixel-react/index.js");
const compiledReactIndex = path.join(
  path.dirname(require.resolve("next/package.json")),
  "dist/compiled/react/index.js",
);

function isAppSource(context: string) {
  return context.replace(/\\/g, "/").includes("/packages/client/src");
}

function isPixelReactBundle(context: string) {
  const ctx = context.replace(/\\/g, "/");
  return ctx.includes("@getpixel/ui/dist/pixel-react") || ctx.includes("/src/lib/pixel-react");
}

const EXCLUDED_FROM_CAPTURE = [
  "/components/ThemeProvider",
  "/components/AppNav",
  "/components/PixelRoot",
  "/app/layout",
];

function shouldAliasPixelReact(context: string) {
  const ctx = context.replace(/\\/g, "/");
  if (isPixelReactBundle(ctx)) return false;
  if (ctx.includes("@getpixel/ui/dist")) return false;
  if (!isAppSource(ctx)) return false;
  // Keep ThemeProvider / shell chrome on plain React so their hooks are not captured.
  return !EXCLUDED_FROM_CAPTURE.some((segment) => ctx.includes(segment));
}

const COMPILED_REACT = /next[\\/]dist[\\/]compiled[\\/]react[\\/]index\.js$/;

const nextConfig: NextConfig = {
  // StrictMode double-invokes hooks in dev and desyncs pixel-react capture.
  reactStrictMode: false,
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
      config.plugins.unshift(
        new webpack.NormalModuleReplacementPlugin(/^react$/, (resource: { context: string; request: string }) => {
          const ctx = resource.context.replace(/\\/g, "/");

          // pixel-react must delegate to the same React instance Next's react-dom uses.
          if (isPixelReactBundle(ctx)) {
            resource.request = compiledReactIndex;
            return;
          }

          if (shouldAliasPixelReact(ctx)) {
            resource.request = pixelReact;
          }
        }),
        // SWC may split hook imports: useState → pixel-react but useCallback → compiled/react.
        new webpack.NormalModuleReplacementPlugin(COMPILED_REACT, (resource: { context: string; request: string }) => {
          if (shouldAliasPixelReact(resource.context)) {
            resource.request = pixelReact;
          }
        }),
      );
    }

    return config;
  },
};

export default nextConfig;
