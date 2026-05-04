const { test, expect } = require('@playwright/test');

test('Kunde-reise: Søk og finn E2S V2 Long Range', async ({ page }) => {
  // 1. Åpne siden
  await page.goto('https://e-wheels.no');

  // 2. Finn søkefeltet og skriv det fulle navnet
  const searchInput = page.locator('input[type="search"], input[name="q"]').first();
  await searchInput.fill('E2S V2 Long Range');
  await searchInput.press('Enter');

  // 3. Vent på at resultatene dukker opp
  // Vi ser etter en lenke (link) som inneholder teksten "Long Range"
  const produktLink = page.getByRole('link', { name: /E2S V2 Long Range/i }).first();
  
  // Sjekk at produktet faktisk finnes i listen
  await expect(produktLink).toBeVisible();

  // 4. KLIKK på produktet for å gå til produktsiden
  await produktLink.click();

  // 5. Verifiser at vi er på riktig side ved å sjekke overskriften (H1)
  const mainHeader = page.locator('h1');
  await expect(mainHeader).toContainText('E2S V2 Long Range');
  
  console.log("Suksess! Vi fant og åpnet produktsiden for Long Range.");
});