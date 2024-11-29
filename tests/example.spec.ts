import { test, expect } from '@playwright/test';
import { AxeBuilder } from "@axe-core/playwright";
import { createHtmlReport } from 'axe-html-reporter';
import * as fs from "fs";

const baseUrl = "http://localhost:63342/um/index.html";
// const baseUrl = "http://dev.ushomi-musambani.de.s3-website.eu-central-1.amazonaws.com/";

test('has title', async ({ page }) => {
  await page.goto(baseUrl);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Ushomi-Musambani/);
});

test('isamu link', async ({ page, isMobile }) => {
  await page.goto(baseUrl);

  // get menu - also hamburger menu in mobile case
  if (isMobile) {
    await page.locator(".jo-nav-icon-mobile").click();
  }
  //await page.getByRole('link', { name: /isamu/i }).click();

  // Expects page to have a heading with the name of Installation.
  expect(page.getByText(/Sabaku Inus/i)).toBeVisible
});


test.describe("homepage - a11y testing", () => {
  test("should not have any a11y issues", async ({ page }, testInfo) => {
    // homepage
    await page.goto(baseUrl);

    const a11yResults = await new AxeBuilder({ page })
      // .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('.jo-contact-map')
      .analyze();

    const reportHTML = createHtmlReport({
      results: a11yResults,
      options: {
        projectKey: "Ushomi-Musambani"
      },
    });

    if (!fs.existsSync("./test-results/reports/a11y-report.html")) {
      fs.mkdirSync("./test-results/reports", {
        recursive: true,
      });
    }
    fs.writeFileSync("./test-results/reports/a11y-report.html", reportHTML);
    

    expect(a11yResults.violations).toEqual([]);

  })
})