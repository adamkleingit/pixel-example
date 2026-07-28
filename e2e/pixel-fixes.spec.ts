import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const PIXEL_SERVER = "http://localhost:41789";
const pixelEditButton = '[data-pixel-tour="edit"]';
const pixelStateHistoryButton = '[data-pixel-tour="time-travel"]';

test.describe("Pixel fixes", () => {
  test("design tokens are extracted and served by @getpixel/server", async ({ request }) => {
    const response = await request.get(`${PIXEL_SERVER}/tokens`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.adapterId).toBe("shadcn");
    expect(body.tokens.length).toBeGreaterThan(0);

    const names = new Set(body.tokens.map((t: { name: string }) => t.name));
    expect(names.has("primary")).toBeTruthy();
    expect(names.has("background")).toBeTruthy();
  });

  test("Pixel UI loads design tokens in edit mode", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Board" })).toBeVisible();

    await page.locator(pixelEditButton).click();
    await expect(page.locator('[data-pixel-tour="design"]')).toBeVisible();

    const tokenCount = await page.evaluate(async () => {
      const res = await fetch("http://localhost:41789/tokens");
      const body = await res.json();
      return body.tokens?.length ?? 0;
    });
    expect(tokenCount).toBeGreaterThan(0);
  });

  test("KanbanBoard source avoids useCallback/useMemo (dual-React hook misalignment)", async () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "packages/client/src/components/KanbanBoard.tsx"),
      "utf8",
    );

    expect(source).not.toMatch(/\buseCallback\b/);
    expect(source).not.toMatch(/\buseMemo\b/);
  });

  test("state time travel replays modal edits instead of the loading screen", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "Board" })).toBeVisible();
    await expect(page.getByText("Loading board…")).toHaveCount(0);

    await page.locator(".page-header .btn").click();
    const title = page.locator("#task-title");
    await expect(title).toBeVisible();

    const marker = `playwright-${Date.now()}`;
    await title.fill(marker);

    await page.locator(pixelStateHistoryButton).click();
    await expect(page.getByRole("complementary", { name: "State history pane" })).toBeVisible();

    const states = page.locator(".pixel-states-item");
    await expect(states.first()).toBeVisible();
    const stateCount = await states.count();
    expect(stateCount).toBeGreaterThan(2);

    await states.nth(stateCount - 1).click();
    await expect(page.getByText(/Frozen at state \d+ of \d+/)).toBeVisible();
    await expect(page.getByText("Loading board…")).toHaveCount(0);
    await expect(title).toBeVisible();
    await expect(title).toHaveValue(marker);
  });
});
