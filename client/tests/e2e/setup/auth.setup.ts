import { test as setup, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

const authFile = path.join(dirname, "../../../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/auth/login", { waitUntil: "networkidle" });

  const emailInput = page.getByLabel("Email");
  await emailInput.fill("test@test.com");

  const passwordInput = page.getByLabel("Password", { exact: true });
  await passwordInput.fill("password");

  const loginButton = page.getByRole("button", { name: "Login" });
  await loginButton.click();

  await page.waitForURL("/streamer");

  await page.context().storageState({ path: authFile });
});
