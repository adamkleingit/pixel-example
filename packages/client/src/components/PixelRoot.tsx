"use client";

import { Overlay, PixelProvider, PixelStateRoot, httpSink } from "@getpixel/ui";

const PIXEL_ENABLED = process.env.NODE_ENV !== "production";

export function PixelRoot({ children }: { children: React.ReactNode }) {
  return (
    <PixelProvider
      isEnabled={PIXEL_ENABLED}
      config={{
        sink: httpSink("http://localhost:41789"),
        bar: { always: true },
        taskPollMs: 1000,
      }}
    >
      <PixelStateRoot enabled={PIXEL_ENABLED}>{children}</PixelStateRoot>
      {PIXEL_ENABLED && <Overlay />}
    </PixelProvider>
  );
}
