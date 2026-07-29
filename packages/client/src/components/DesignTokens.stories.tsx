import type { Meta, StoryObj } from "@storybook/react";

const TOKEN_GROUPS = [
  {
    title: "Colors",
    tokens: [
      "--color-primary",
      "--color-accent",
      "--color-bg",
      "--color-bg-deep",
      "--color-surface",
      "--color-text",
      "--color-on-primary",
      "--color-danger",
      "--color-danger-strong",
      "--color-danger-text",
    ],
  },
  {
    title: "Typography",
    tokens: [
      "--font-body",
      "--font-display",
      "--font-size-xs",
      "--font-size-sm",
      "--font-size-base",
      "--font-size-lg",
      "--font-size-xl",
      "--font-size-2xl",
      "--font-size-3xl",
      "--font-weight-semibold",
      "--font-weight-bold",
      "--line-height-snug",
      "--letter-spacing-tight",
    ],
  },
  {
    title: "Spacing",
    tokens: [
      "--spacing-3",
      "--spacing-6",
      "--spacing-8",
      "--spacing-13",
      "--spacing-16",
      "--spacing-18",
      "--column-gap",
      "--spacing-page-x",
    ],
  },
  {
    title: "Radii & opacity",
    tokens: [
      "--radius",
      "--radius-sm",
      "--radius-md",
      "--radius-lg",
      "--radius-card",
      "--radius-full",
      "--opacity-muted",
      "--opacity-soft",
      "--opacity-dragging",
    ],
  },
] as const;

function TokenSwatch({ name }: { name: string }) {
  const isColor = name.startsWith("--color-");
  const isRadius = name.startsWith("--radius");
  const isSpacing = name.startsWith("--spacing") || name === "--column-gap";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(160px, 1fr) auto",
        gap: "var(--spacing-8)",
        alignItems: "center",
        padding: "var(--spacing-8) 0",
        borderBottom: "1px solid color-mix(in srgb, var(--color-primary) 10%, transparent)",
        fontSize: "var(--font-size-base)",
      }}
    >
      <code style={{ fontSize: "var(--font-size-sm)" }}>{name}</code>
      {isColor ? (
        <span
          title={name}
          style={{
            width: "2.5rem",
            height: "1.5rem",
            borderRadius: "var(--radius-sm)",
            background: `var(${name})`,
            border: "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
          }}
        />
      ) : null}
      {isRadius ? (
        <span
          style={{
            width: "2.5rem",
            height: "1.5rem",
            background: "var(--color-primary)",
            borderRadius: `var(${name})`,
          }}
        />
      ) : null}
      {isSpacing ? (
        <span
          style={{
            height: "0.75rem",
            width: `var(${name})`,
            minWidth: "0.25rem",
            background: "var(--color-accent)",
            borderRadius: "var(--radius-sm)",
          }}
        />
      ) : null}
      {!isColor && !isRadius && !isSpacing ? (
        <span style={{ opacity: "var(--opacity-muted)", fontFamily: "var(--font-body)" }}>
          var({name})
        </span>
      ) : null}
    </div>
  );
}

function DesignTokensGallery() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1
        style={{
          margin: "0 0 var(--spacing-6)",
          fontFamily: "var(--font-display)",
          fontSize: "var(--font-size-page-title)",
        }}
      >
        Design tokens
      </h1>
      <p style={{ margin: "0 0 var(--spacing-16)", opacity: "var(--opacity-soft)" }}>
        Source of truth lives in <code>src/app/globals.css</code> (:root). Runtime theme settings
        override the semantic color / font / radius tokens via ThemeProvider.
      </p>
      {TOKEN_GROUPS.map((group) => (
        <section key={group.title} style={{ marginBottom: "var(--spacing-18)" }}>
          <h2
            style={{
              margin: "0 0 var(--spacing-8)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--font-size-2xl)",
            }}
          >
            {group.title}
          </h2>
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
              padding: "0 var(--spacing-13)",
            }}
          >
            {group.tokens.map((token) => (
              <TokenSwatch key={token} name={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta: Meta<typeof DesignTokensGallery> = {
  title: "Foundation/DesignTokens",
  component: DesignTokensGallery,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DesignTokensGallery>;

export const Default: Story = {};
