import { expect, test } from '@playwright/test';
import { representativePages } from './pages';

for (const pageCase of representativePages) {
  for (const theme of ['light', 'dark'] as const) {
    test(`@visual ${pageCase.name} in ${theme} theme`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((selectedTheme) => {
        localStorage.setItem('darkMode', selectedTheme === 'dark' ? 'enabled' : 'disabled');
      }, theme);

      await page.goto(pageCase.path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('html')).toHaveClass(new RegExp(theme));
      await expect(page).toHaveScreenshot(`${pageCase.name}-${theme}.png`, {
        animations: 'disabled',
        fullPage: true,
      });
    });
  }
}
