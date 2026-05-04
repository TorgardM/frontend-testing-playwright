const { test, expect } = require('@playwright/test');

test('Robust kundereise: Navigering til E2S-serien', async ({ page }) => {
  // 1. Gå direkte til kategorisiden (slipper å stole på søkefunksjonen)
  await page.goto('https://e-wheels.no');

  // 2. Håndter cookie-banner hvis den dukker opp
  const cookieButton = page.getByRole('button', { name: /Godta|Aksepter/i });
  if (await cookieButton.isVisible()) {
    await cookieButton.click();
  }

  // 3. Vent på at produktlisten lastes
  // Vi ser etter et produktkort som inneholder "E2S V2"
  const productCard = page.locator('.product-list-item, .product-card').filter({ hasText: /E2S V2/i }).first();
  
  // Verifiser at produktet faktisk er synlig på skjermen
  await expect(productCard).toBeVisible({ timeout: 10000 });

  // 4. Klikk på "Les mer" eller selve bildet for å gå til produktsiden
  await productCard.click();

  // 5. Verifiser at vi har landet på riktig produktside
  // Vi sjekker at hovedoverskriften (H1) inneholder modellnavnet
  await expect(page.locator('h1')).toContainText(/E2S V2/i);

  // 6. Sjekk at kjøpsknappen er tilstede (beviser at siden er funksjonell)
  const buyButton = page.locator('#product-add-to-cart, .add-to-cart');
  await expect(buyButton).toBeVisible();

  console.log("Test fullført: Navigering og produktside fungerer.");
});