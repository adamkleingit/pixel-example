import type { Decorator, Preview } from "@storybook/react";
import { Overlay, PixelProvider, PixelStateRoot, httpSink } from "@getpixel/ui";
import React from "react";
import "../src/app/globals.css";

const themeDecorator: Decorator = (Story) => (
  <div
    style={{
      fontFamily: "var(--font-body)",
      color: "var(--color-text)",
      padding: "var(--spacing-4)",
      background:
        "radial-gradient(800px 400px at 10% -10%, rgba(15,118,110,0.16), transparent 55%), hsl(var(--background))",
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
      isEnabled
      config={{
        sink: httpSink("http://localhost:41789"),
        bar: { always: true },
        taskPollMs: 1000,
      }}
    >
      <PixelStateRoot enabled>
        <Story />
      </PixelStateRoot>
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
