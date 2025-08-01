import { expect, test } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

test("Create page", async ({ page }) => {
  await page.goto("/streamer/create", { waitUntil: "networkidle" });

  const logoInput = page.getByLabel("Click to upload").nth(0);

  const fileChooserPromise = page.waitForEvent("filechooser");
  await logoInput.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(dirname, "xmrchat-logo.png"));

  const bannerInput = page.getByLabel("Click to upload").nth(1);

  const fileChooserPromise2 = page.waitForEvent("filechooser");
  await bannerInput.click();
  const fileChooser2 = await fileChooserPromise2;
  await fileChooser2.setFiles(path.join(dirname, "xmrchat-logo.png"));

  await page
    .locator("p", { hasText: "Field is required" })
    .nth(0)
    .waitFor({ state: "hidden" });
  await page
    .locator("p", { hasText: "Field is required" })
    .nth(1)
    .waitFor({ state: "hidden" });

  const yourIdInput = page.getByLabel("Your id");
  await yourIdInput.fill(`page-${Math.floor(Math.random() * 1000)}`);

  await page.getByText("Available", { exact: true }).waitFor();

  const moneroPrimaryInput = page.getByLabel("Monero primary");
  await moneroPrimaryInput.fill(
    // Temporary monero address. Do not use.
    "45ttFTPkNZrA9qar2tSQywaJZhLRri3YgLVeYbd3pApQYTQjYrRuB9LBCuJMp2fzNtS433ihrMQgZh16exFvNjz2Q3UTUEm"
  );

  const moneroKeyInput = page.getByLabel("Monero secret");
  await moneroKeyInput.fill(
    "ea271297df7a01c42cb0a63879b4d7d3fc2f169449d92a7dd1eefe7261fe0202"
  );

  const continueButton = page.locator("button", { hasText: "Continue" });
  await continueButton.click();

  const modalTitle = page.locator("h2", { hasText: "Page Creation Fee" });
  const openInWalletButton = page.locator("a", {
    hasText: "Open in My Wallet",
  });
  const qrCode = page.locator("canvas");

  await expect(modalTitle).toBeVisible();
  await expect(openInWalletButton).toBeVisible();
  await expect(qrCode).toBeVisible();
});
