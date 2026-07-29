import type { Decorator, Preview } from "@storybook/react";
import React from "react";
import "../src/app/globals.css";

const withTheme: Decorator = (Story) => (
  <div
    className="app-shell"
    style={{
      padding: "var(--spacing-13)",
      minHeight: "100%",
      background:
        "radial-gradient(800px 400px at 10% -10%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 55%), var(--color-bg)",
      color: "var(--color-text)",
      fontFamily: "var(--font-body)",
    }}
  >
    <Story />
  </div>
);

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "padded",
  },
  decorators: [withTheme],
};

export default preview;
