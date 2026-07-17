import type { Preview } from "@storybook/react";
import React from "react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          ["--color-primary" as string]: "#0F766E",
          ["--color-accent" as string]: "#F97316",
          ["--color-bg" as string]: "#F0F7F6",
          ["--color-surface" as string]: "#FFFFFF",
          ["--color-text" as string]: "#134E4A",
          ["--font-body" as string]: '"Figtree", "Segoe UI", sans-serif',
          ["--radius" as string]: "12px",
          fontFamily: "var(--font-body)",
          color: "var(--color-text)",
          padding: "1rem",
          background:
            "radial-gradient(800px 400px at 10% -10%, rgba(15,118,110,0.16), transparent 55%), #F0F7F6",
          minHeight: "100%",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
