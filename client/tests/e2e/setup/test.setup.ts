import { test as setup } from "@playwright/test";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

const authFile = path.join(dirname, "../../../playwright/.auth/user.json");

setup.describe.configure({ mode: "serial" });

setup.describe("setup", () => {
  setup("seed", async ({ page }) => {
    const apiUrl =
      process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    await axios.post(`${apiUrl}/__test__/seed`);
  });

  setup("authenticate", async ({ page }) => {
    await page.goto("/auth/login", { waitUntil: "networkidle" });

    const emailInput = page.getByLabel("Email");
    await emailInput.fill("test@test.com");

    const passwordInput = page.getByLabel("Password", { exact: true });
    await passwordInput.fill("password");

    const loginButton = page.getByRole("button", { name: "Login" });
    await loginButton.click();

    await page.waitForURL("/streamer", { waitUntil: "commit" });

    await page.context().storageState({ path: authFile });
  });
});
