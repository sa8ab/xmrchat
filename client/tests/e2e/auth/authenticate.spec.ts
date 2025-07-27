import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("unsuccessful authentication", () => {
  test("should not authenticate with wrong password", async ({ page }) => {
    await page.goto("/auth/login", { waitUntil: "networkidle" });

    const emailInput = page.getByLabel("Email");
    await emailInput.fill("test@test.com");

    const passwordInput = page.getByLabel("Password", { exact: true });
    await passwordInput.fill("wrongpassword");

    const loginButton = page.getByRole("button", { name: "Login" });
    await loginButton.click();

    const failedAlert = page.locator("p", { hasText: "Login Failed" });
    await expect(failedAlert).toBeVisible();
  });

  test("should not signup with wrong values", async ({ page }) => {
    await page.goto("/auth/signup", { waitUntil: "networkidle" });

    const emailInput = page.getByLabel("Email");
    await emailInput.fill("notanemail");

    const passwordInput = page.getByLabel("Password", { exact: true });
    await passwordInput.fill("short");

    const confirmPasswordInput = page.getByLabel("Confirm Password", {
      exact: true,
    });
    await confirmPasswordInput.fill("notsame");

    const signupButton = page.getByRole("button", { name: "Signup" });
    await signupButton.click();

    const emailError = page.locator("p", { hasText: "Email is invalid" });
    const passwordError = page.locator("p", {
      hasText: "Should be at least 6 characters.",
    });
    const confirmPasswordError = page.locator("p", {
      hasText: "Should be same as Password",
    });

    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
    await expect(confirmPasswordError).toBeVisible();

    await expect(page).toHaveURL("/auth/signup");
  });
});
