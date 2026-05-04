const { test, expect } = require('@playwright/test');

test('Sjekk at Google har riktig tittel', async ({ page }) => {
  // 1. Gå til google.no
  await page.goto('https://google.no');

  // 2. Sjekk at tittelen inneholder ordet "Google"
  await expect(page).toHaveTitle(/Google/);
});