import { expect, test } from "@playwright/test";

test("counter changes survive login/logout; reset preserves hidden state", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Increase by 10", exact: true }).click();
  await page.getByLabel("Custom amount").fill("-3");
  await page.getByLabel("Custom amount").press("Enter");
  await expect(page.getByLabel("Counter value")).toHaveText("7");
  await page.getByRole("button", { name: "Hide Counter", exact: true }).click();
  await page.getByRole("button", { name: "Try demo without credentials" }).click();
  await expect(page.getByRole("heading", { name: "My User Profile" })).toBeFocused();
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Demo login" })).toBeFocused();
  await page.getByRole("button", { name: "Reset Counter", exact: true }).click();
  await expect(page.locator("#counter-value")).toBeHidden();
  await page.getByRole("button", { name: "Show Counter", exact: true }).click();
  await expect(page.getByLabel("Counter value")).toHaveText("0");
  await expect(page.getByRole("button", { name: "Reset Counter", exact: true })).toBeDisabled();
  expect(errors).toEqual([]);
});

test("keyboard skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("native validation rejects fractions and overflow remains recoverable", async ({ page }) => {
  await page.goto("/");
  const amount = page.getByLabel("Custom amount");
  await amount.fill("1.5");
  await page.getByRole("button", { name: "Apply amount" }).click();
  await expect(page.getByLabel("Counter value")).toHaveText("0");
  await amount.fill(String(Number.MAX_SAFE_INTEGER));
  await page.getByRole("button", { name: "Apply amount" }).click();
  await expect(page.getByRole("button", { name: "Increment", exact: true })).toBeDisabled();
  await amount.fill("1");
  await page.getByRole("button", { name: "Apply amount" }).click();
  const feedback = page.getByRole("form", { name: "Adjust counter" }).getByRole("alert", { includeHidden: true });
  await expect(feedback).toContainText("safe range");
  await expect(amount).toBeFocused();
  await page.getByRole("button", { name: "Reset Counter", exact: true }).click();
  await expect(feedback).toBeEmpty();
  await expect(page.getByRole("button", { name: "Increment", exact: true })).toBeEnabled();
});

test("demo credentials never enter request URLs or bodies", async ({ page }) => {
  await page.goto("/");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(decodeURIComponent(request.url()) + (request.postData() ?? "")));
  await page.getByLabel("Email", { exact: true }).fill("browser-demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("fictitious-browser-password");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByRole("heading", { name: "My User Profile" })).toBeVisible();
  expect(requests.join("\n")).not.toContain("browser-demo@example.com");
  expect(requests.join("\n")).not.toContain("fictitious-browser-password");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Demo login" })).toBeVisible();
  await expect(page.getByLabel("Counter value")).toHaveText("0");
});

test("CSP blocks native submission when JavaScript is disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
    await page.getByLabel("Email", { exact: true }).fill("browser-demo@example.com");
    await page.getByLabel("Password", { exact: true }).fill("fictitious-browser-password");
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    const blocked = page.waitForEvent("console", {
      predicate: (message) => message.text().includes("form-action"),
    });
    await page.getByRole("button", { name: "Login", exact: true }).click({ noWaitAfter: true });
    await blocked;
    expect(requests).toEqual([]);
    expect(new URL(page.url()).search).toBe("");
  } finally {
    await context.close();
  }
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`mobile layout and controls work in ${colorScheme} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Increment", exact: true }).click();
    await expect(page.getByLabel("Counter value")).toHaveText("1");
    for (const button of await page.getByRole("button").all()) {
      const size = await button.boundingBox();
      expect(size?.height).toBeGreaterThanOrEqual(44);
    }
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe(colorScheme === "dark" ? "rgb(23, 19, 30)" : "rgb(244, 241, 248)");
  });
}

test("missing pages offer a working route back and the app has an icon", async ({ page, request }) => {
  const response = await page.goto("/missing-demo-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Back to demo" }).click();
  await expect(page.getByRole("heading", { name: "Redux State Demo", exact: true })).toBeVisible();
  await expect(page).toHaveTitle("Redux State Demo");
  const icon = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(icon).toBeTruthy();
  expect((await request.get(icon!)).status()).toBe(200);
});
