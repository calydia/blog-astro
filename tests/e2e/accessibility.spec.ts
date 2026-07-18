import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { representativePages } from './pages';

for (const pageCase of representativePages) {
  test(`@a11y ${pageCase.name} has no WCAG A or AA violations`, async ({ page }) => {
    await page.goto(pageCase.path, { waitUntil: 'networkidle' });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test('@a11y CSP is present and permits the theme toggle', async ({ page }) => {
  const cspErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /content security policy|refused to/i.test(message.text())) {
      cspErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => cspErrors.push(error.message));

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1);

  const html = page.locator('html');
  const initialTheme = await html.getAttribute('class');
  await page.getByRole('button', { name: /switch to/i }).click();
  await expect(html).not.toHaveAttribute('class', initialTheme ?? '');
  expect(cspErrors).toEqual([]);
});
