import { test, expect } from "@playwright/test";

test("Signup", async ({ page }) => {
  await page.goto("/auth/signup", { waitUntil: "networkidle" });

  // find input by label "Email"
  const emailInput = page.getByLabel("Email");
  await emailInput.fill("test@test.com");

  // find input by label "Password"
  const passwordInput = page.getByLabel("Password", { exact: true });
  await passwordInput.fill("password");

  // find input by label "Confirm Password"
  const confirmPasswordInput = page.getByLabel("Confirm Password");
  await confirmPasswordInput.fill("password");

  const signupButton = page.getByRole("button", { name: "Signup" });
  await signupButton.click();

  await page.getByText("Signup Successfull").waitFor();
});
