import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      // tsconfig sets jsx:"preserve" for Next, which makes esbuild fall back to
      // the classic runtime and emit React.createElement into files that never
      // import React.
      esbuild: { jsx: "automatic" },
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
