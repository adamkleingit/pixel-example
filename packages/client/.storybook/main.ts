import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import type { Plugin } from "vite";
import { mergeConfig } from "vite";

const appSrc = path.resolve(__dirname, "../src");

function pixelReactAlias(): Plugin {
  return {
    name: "pixel-react-alias",
    enforce: "pre",
    apply: "serve",
    async resolveId(source, importer) {
      if (source !== "react") return null;
      if (!importer || !importer.startsWith(appSrc)) return null;
      return (await this.resolve("@getpixel/ui/pixel-react", importer, { skipSelf: true }))?.id ?? null;
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
    return mergeConfig(config, {
      plugins: [pixelReactAlias()],
      optimizeDeps: {
        include: ["@getpixel/ui/pixel-react"],
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
