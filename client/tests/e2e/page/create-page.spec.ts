import { test } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

test("Create page", async ({ page }) => {
  await page.goto("/streamer/create", { waitUntil: "networkidle" });

  // first file inpput
  const logoInput = page.getByLabel("Click to upload").first();

  const fileChooserPromise = page.waitForEvent("filechooser");
  await logoInput.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(dirname, "xmrchat-logo.png"));

  const bannerInput = page.getByLabel("Click to upload").nth(1);
  await bannerInput.click();
  const fileChooser2 = await fileChooserPromise;
  await fileChooser2.setFiles(path.join(dirname, "xmrchat-logo.png"));

  await page.waitForTimeout(4000);
});
