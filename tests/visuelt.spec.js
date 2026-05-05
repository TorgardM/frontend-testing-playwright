const { test, expect } = require('@playwright/test');

const VAREKODE = '8708';

test('Visualiser søkefeil uten cookie-støy', async ({ page }) => {
  
  // Hjelpefunksjon for å fjerne cookie-banneret helt fra siden
  const fjernCookieBanner = async () => {
    // Vi prøver å finne vanlige ID-er eller klasser for cookie-bannere
    // og setter "display: none" på dem via JavaScript i nettleseren.
    await page.evaluate(() => {
      const selectors = [
        '#CybotCookiebotDialog', 
        '.cookie-consent', 
        '.cookie-banner', 
        '[id*="cookie"]', 
        '[class*="cookie"]'
      ];
      selectors.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
      });
    });
  };

  // 1. Gå til produktsiden
  await page.goto(`https://www.e-wheels.no/tilbehor/til-el-sparkesykkel/lader-elsparkesykkel/?code=${VAREKODE}`);
  
  // Rydd unna cookies før bilde 1
  await fjernCookieBanner();
  
  const varekodeElement = page.locator('text=Varekode: 8708').first();
  await varekodeElement.evaluate(el => el.style.border = '5px solid red'); // Gjør rød ramme tydeligere
  
  await page.screenshot({ path: `bevis-1-varen-eksisterer.png` });
  console.log("✅ Bilde 1 tatt (uten cookie-banner)");

  // 2. Gå til forsiden
  await page.goto('https://www.e-wheels.no/');
  
  // Rydd unna cookies igjen (noen ganger dukker de opp på nytt på ny URL)
  await fjernCookieBanner();
  await page.waitForTimeout(500); // Vent litt for visuell stabilitet

  const searchInput = page.locator('input[type="search"], input[name="q"]').first();
  await searchInput.fill(VAREKODE);
  
  await page.screenshot({ path: `bevis-2-soker-etter-vare.png` });
  console.log("✅ Bilde 2 tatt (uten cookie-banner)");

  await searchInput.press('Enter');

  // 3. Sluttresultat
  const resultItem = page.locator('.product-list-item, .product-card').first();
  
  try {
    await expect(resultItem).toBeVisible({ timeout: 5000 });
  } catch (error) {
    // Rydd unna cookies en siste gang før det endelige feil-bildet
    await fjernCookieBanner();
    await page.screenshot({ path: `bevis-3-sokeresultat-feilet.png`, fullPage: true });
    
    console.log(`❌ FEIL BEKREFTET: Resultatet er nå dokumentert med rene bilder.`);
    throw error;
  }
});