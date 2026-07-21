import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import type { Plugin } from "vite";
import { mergeConfig } from "vite";

const clientSrc = path.resolve(__dirname, "../src").replace(/\\/g, "/");
const pixelReact = path.resolve(__dirname, "../node_modules/@getpixel/ui/dist/pixel-react/index.js");
const realReact = path.resolve(__dirname, "../node_modules/react/index.js");

function isComponentSource(importer: string) {
  const file = importer.replace(/\\/g, "/");
  return file.includes("/packages/client/src/") && !file.endsWith(".stories.tsx") && !file.endsWith(".stories.ts");
}

function pixelReactAlias(): Plugin {
  return {
    name: "pixel-react-alias",
    enforce: "pre",
    resolveId(source, importer) {
      if (source !== "react" || !importer) return null;

      const file = importer.replace(/\\/g, "/");
      if (file.includes("@getpixel/ui/dist/pixel-react")) {
        return realReact;
      }

      if (isComponentSource(file)) {
        return pixelReact;
      }

      return null;
    },
  };
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    config.server = { ...config.server, allowedHosts: true, host: true };
    return mergeConfig(config, {
      plugins: [pixelReactAlias()],
      optimizeDeps: {
        include: ["@getpixel/ui/pixel-react", "react", "react-dom"],
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
          "@kanban/shared": path.resolve(__dirname, "../../shared/src/index.ts"),
        },
      },
    });
  },
};

export default config;
