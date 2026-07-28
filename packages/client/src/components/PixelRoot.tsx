"use client";

import { Overlay, PixelProvider, PixelStateRoot, httpSink } from "@getpixel/ui";

const PIXEL_ENABLED = process.env.NODE_ENV !== "production";

export function PixelProviderShell({ children }: { children: React.ReactNode }) {
  return (
    <PixelProvider
      isEnabled={PIXEL_ENABLED}
      config={{
        sink: httpSink("http://localhost:41789"),
        bar: { always: true },
        taskPollMs: 1000,
      }}
    >
      {children}
      {PIXEL_ENABLED && <Overlay />}
    </PixelProvider>
  );
}

/** Wrap page content only — keep ThemeProvider / shell chrome outside for cleaner state capture. */
export function PixelStateBoundary({ children }: { children: React.ReactNode }) {
  return <PixelStateRoot enabled={PIXEL_ENABLED}>{children}</PixelStateRoot>;
}
