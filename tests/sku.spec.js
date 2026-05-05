const { test, expect } = require('@playwright/test');

test('Dokumenter søkefeil: Søk på varekode 8708 gir ingen treff', async ({ page }) => {
  // 1. Gå direkte til produktet for å bekrefte at varekoden eksisterer
  const produktUrl = 'https://www.e-wheels.no/tilbehor/til-el-sparkesykkel/lader-elsparkesykkel/?code=8708';
  await page.goto(produktUrl);

  // 2. Bekreft at varekoden 8708 faktisk står på siden
  // Vi ser etter teksten "Varekode: 8708"
  const varekodeElement = page.locator('text=Varekode: 8708');
  await expect(varekodeElement).toBeVisible();
  console.log("Bekreftet: Varekode 8708 finnes på produktsiden.");

  // 3. Gå til forsiden for å bruke søkefunksjonen
  await page.goto('https://www.e-wheels.no/');

  // 4. Håndter cookie-banner (viktig for at søkefeltet skal være klikkbart)
  const cookieButton = page.getByRole('button', { name: /Godta|Aksepter/i });
  if (await cookieButton.isVisible()) {
    await cookieButton.click();
  }

  // 5. Søk på varekoden "8708"
  const searchInput = page.locator('input[type="search"], input[name="q"]').first();
  await searchInput.fill('8708');
  await searchInput.press('Enter');

  // 6. FORVENTNING: Vi forventer å se produktet i søkeresultatet
  // Siden du har oppdaget at dette ikke fungerer, vil testen feile her.
  const resultItem = page.locator('.product-list-item, .product-card').first();
  
  // Vi setter en timeout på 5 sekunder før den feiler
  await expect(resultItem).toBeVisible({ timeout: 5000 });
  await expect(resultItem).toContainText('8708');
});
