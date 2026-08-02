import { expect, test } from '@playwright/test';

test('category cards expose category and recommended-post links with distinct targets', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const card = page.locator('article.card-cover').first();
  const titleLink = card.getByRole('link', { name: 'Accessibility' });
  const postLink = card.getByRole('link', { name: /How to create more accessible content/ });
  await expect(card.getByRole('link')).toHaveCount(2);
  await expect(postLink).toHaveAttribute('href', /how-to-create-more-accessible-content/);

  await titleLink.focus();
  await expect(card).toHaveCSS('outline-style', 'solid');
  await card.evaluate((element) => element.scrollIntoView({ block: 'center' }));

  const bounds = await card.boundingBox();
  if (!bounds) throw new Error('Category card must have visible bounds.');
  const hitTarget = await page.evaluate(({ x, y }) => {
    const target = document.elementFromPoint(x, y);
    return target ? `${target.tagName}.${target.className}` : 'none';
  }, { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 });
  expect(hitTarget, 'the expanded pseudo-element should make the title anchor the hit target').toContain('A.');
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(page).toHaveURL(/\/accessibility\/?$/);
});

test('article cards keep metadata and descriptions outside their single title link', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const card = page.locator('section[aria-label="Blog listing"] li.card-cover').first();
  const link = card.getByRole('link');
  await expect(link).toHaveCount(1);
  await expect(link).toHaveText(/A practical guide to accessibility testing/);
  await expect(link.locator('img')).toHaveCount(0);
  await expect(link.locator('p')).toHaveCount(0);
  await expect(card.locator('p')).toHaveCount(2);

  await link.focus();
  await expect(card).toHaveCSS('outline-style', 'solid');
});
