import { expect, test } from "@playwright/test";

for (const width of [360, 390, 430]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    // Scroll through the page so every lazy image and reveal has settled
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(scrollWidth).toBe(innerWidth);
  });
}

test("mobile menu opens, traps Escape and closes on link click", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menuBtn = page.getByRole("button", { name: "Open menu" });
  await menuBtn.click();
  const drawer = page.getByRole("dialog", { name: "Menu" });
  await expect(drawer).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(menuBtn).toBeFocused();

  await menuBtn.click();
  await drawer.getByRole("link", { name: "Collections" }).click();
  await expect(drawer).toBeHidden();
});

test("filters and quick view preselect the product in the form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Table", exact: true }).click();
  await expect(page.getByRole("button", { name: /Table Linen/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Bedcovers/ })).toBeHidden();

  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByRole("button", { name: /Robes & Kimonos/ }).click();
  const dialog = page.getByRole("dialog", { name: "Robes & Kimonos" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /Enquire about this/ }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator("#f-product")).toHaveValue("Robes & Kimonos");
});

test("content is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Tell us what/ })).toBeVisible();
  const opacity = await page.locator("#ordering li").first().evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
  await context.close();
});
