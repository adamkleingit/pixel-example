import type { Decorator, Preview } from "@storybook/react";
import { Overlay, PixelProvider, httpSink } from "@getpixel/ui";
import React from "react";
import "../src/app/globals.css";

const themeDecorator: Decorator = (Story) => (
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
);

const withPixel: Decorator = (Story) => {
  if (!import.meta.env.DEV) return <Story />;

  return (
    <PixelProvider
      config={{
        sink: httpSink("http://localhost:41789"),
        bar: { always: true },
        taskPollMs: 1000,
      }}
    >
      <Story />
      <Overlay />
    </PixelProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "padded",
  },
  decorators: [withPixel, themeDecorator],
};

export default preview;
