import { test, expect } from "@playwright/test";

test("page title has monero", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Monero/);
});
