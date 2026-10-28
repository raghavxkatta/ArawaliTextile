import { expect, test, type Page } from "@playwright/test";

async function fillValid(page: Page) {
  await page.locator("#f-name").fill("Anna Müller");
  await page.locator("#f-company").fill("Maison Lin");
  await page.locator("#f-email").fill("anna@example.com");
  await page.locator("#f-country").selectOption("France");
  await page.locator("#f-product").selectOption("Table Linen");
  await page.locator("#f-quantity").fill("300 pieces");
  await page.locator("#f-message").fill("Runners in indigo, 40 x 180 cm.");
}

test("shows friendly inline errors and links them to the fields", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: /Send enquiry/ }).click();
  const name = page.locator("#f-name");
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAttribute("aria-describedby", "e-name");
  await expect(page.locator("#e-name")).toHaveText("Please add your name so we know who to reply to.");

  await name.fill("Anna");
  await page.locator("#f-email").fill("not-an-email");
  await page.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(page.locator("#e-email")).toHaveText("Please add an email we can reply to, like you@company.com.");
});

test("successful submission shows the summary and a prefilled WhatsApp link", async ({ page }) => {
  await page.route("**/api/enquiry", (route) => route.fulfill({ json: { ok: true } }));
  await page.goto("/#contact");
  await fillValid(page);
  await page.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(page.getByRole("heading", { name: "Your enquiry has been sent" })).toBeFocused();
  await expect(page.locator("#summary")).toContainText("Product: Table Linen");
  const href = await page.getByRole("link", { name: /Also message us on WhatsApp/ }).getAttribute("href");
  expect(href).toContain("https://wa.me/917877945556?text=");
  expect(decodeURIComponent(href!.split("text=")[1])).toContain("Name: Anna Müller");
});

test("server failure keeps the input and explains what to do", async ({ page }) => {
  await page.route("**/api/enquiry", (route) => route.fulfill({ status: 500, json: { ok: false } }));
  await page.goto("/#contact");
  await fillValid(page);
  await page.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(page.locator("#form").getByRole("alert")).toContainText("We couldn’t send that. Please try again, or message us on WhatsApp.");
  await expect(page.locator("#f-name")).toHaveValue("Anna Müller");
});

test("API validates on the server and ignores honeypot hits", async ({ request }) => {
  const bad = await request.post("/api/enquiry", { data: { name: "", email: "x" } });
  expect(bad.status()).toBe(400);
  const body = await bad.json();
  expect(body.errors.name).toBeTruthy();

  const bot = await request.post("/api/enquiry", {
    data: { name: "Bot", email: "bot@example.com", country: "Other", product: "Table Linen", website: "http://spam" },
  });
  expect(bot.status()).toBe(200);
});
