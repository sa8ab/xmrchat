import { expect, test } from "@playwright/test";

test("tip", async ({ page }) => {
  await page.goto("/test-page", { waitUntil: "networkidle" });

  await page.getByLabel("Name").fill("Test user");
  await page.getByLabel("Amount").fill("1");
  await page.getByLabel("Message").fill("Test message");

  await page.locator("button", { hasText: "Send Tip" }).click();

  const modalTitle = page.locator("h2", { hasText: "Send Tip" });
  const openInWalletButton = page.locator("a", {
    hasText: "Open in My Wallet",
  });
  const qrCode = page.locator("canvas");

  await expect(modalTitle).toBeVisible();
  await expect(openInWalletButton).toBeVisible();
  await expect(qrCode).toBeVisible();
});
