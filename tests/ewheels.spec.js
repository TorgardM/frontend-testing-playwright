const { test, expect } = require('@playwright/test');

test('Kunde-reise: Søk og finn Komplett spak til foldemekanisme', async ({ page }) => {
  // 1. Åpne siden
  await page.goto('https://e-wheels.no');

  // 2. Finn søkefeltet og skriv det fulle navnet
  const searchInput = page.locator('input[type="search"], input[name="q"]').first();
  await searchInput.fill('Long Range');
  await searchInput.press('Enter');

  // 3. Vent på at resultatene dukker opp
  // Vi ser etter en lenke (link) som inneholder teksten "Long Range"
  const produktLink = page.getByRole('link', { name: 'Komplett spak til foldemekanisme' }).first();
  
  // Sjekk at produktet faktisk finnes i listen
  await expect(produktLink).toBeVisible();

  // 4. KLIKK på produktet for å gå til produktsiden
  await produktLink.click();

  // 5. Verifiser at vi er på riktig side ved å sjekke overskriften (H1)
  const mainHeader = page.locator('h1');
  await expect(mainHeader).toContainText('Komplett spak til foldemekanisme');
  
    // 6. Sjekk at kjøpsknappen er tilstede (beviser at siden er funksjonell)
  const buyButton = page.locator('#product-add-to-cart, .add-to-cart');
  await expect(buyButton).toBeVisible();

  console.log("Test fullført: Navigering og produktside fungerer.");
});