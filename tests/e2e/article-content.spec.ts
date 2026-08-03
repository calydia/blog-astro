import { expect, test } from '@playwright/test';

const articlePath = '/accessibility/accessibility-testing-guide/';

test('article body headings retain their historical type scale', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(articlePath, { waitUntil: 'networkidle' });

  const body = page.locator('.bodytext');
  await body.evaluate((element) => {
    element.insertAdjacentHTML('beforeend', '<h3>Test meaningful interactions</h3><h4>Record the results</h4>');
  });
  await expect(body.locator('h2')).toHaveCSS('font-size', '30px');
  await expect(body.locator('h3')).toHaveCSS('font-size', '24px');
  await expect(body.locator('h4')).toHaveCSS('font-size', '20px');
  await expect(body.locator('h2')).toHaveCSS('font-weight', '700');
  await expect(body.locator('h3')).toHaveCSS('font-weight', '700');
  await expect(body.locator('h4')).toHaveCSS('font-weight', '700');

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(body.locator('h2')).toHaveCSS('font-size', '24px');
  await expect(body.locator('h3')).toHaveCSS('font-size', '20px');
  await expect(body.locator('h4')).toHaveCSS('font-size', '18px');
});

test('article image credits render only when provided', async ({ page }) => {
  await page.goto(articlePath, { waitUntil: 'networkidle' });
  await expect(page.locator('.credits')).toHaveCount(0);
  await expect(page.getByText(/Image credit:|null/)).toHaveCount(0);

  await page.goto('/accessibility/how-to-create-more-accessible-content-avoid-common-accessibility-mistakes/', { waitUntil: 'networkidle' });
  await expect(page.locator('.credits')).toHaveText('Image credit: Test fixture image');
});

test('related post and sidebar links exclude supporting decoration and metadata', async ({ page }) => {
  await page.goto(articlePath, { waitUntil: 'networkidle' });

  const relatedCard = page.locator('.related-post-card').first();
  const relatedLink = relatedCard.getByRole('link');
  const relatedTitle = relatedCard.locator('.post-title');
  const relatedDate = relatedCard.locator('.related-post-date');

  await expect(relatedLink).toHaveCount(1);
  await expect(relatedLink).toHaveText('How to create more accessible content');
  await expect(relatedLink.locator('img, .related-post-date')).toHaveCount(0);

  await relatedCard.hover();
  await expect(relatedTitle).toHaveCSS('text-decoration-line', 'underline');
  await expect(relatedDate).toHaveCSS('text-decoration-line', 'none');

  await relatedLink.focus();
  await expect(relatedCard).toHaveCSS('outline-style', 'solid');

  const bounds = await relatedCard.boundingBox();
  if (!bounds) throw new Error('Related-post card must have visible bounds.');
  const hitTarget = await page.evaluate(({ x, y }) => {
    const target = document.elementFromPoint(x, y);
    return target?.tagName ?? 'none';
  }, { x: bounds.x + bounds.width / 2, y: bounds.y + 10 });
  expect(hitTarget).toBe('A');

  const sidebar = page.locator('aside');
  const keepReading = sidebar.locator('section').first();
  const keepReadingLinks = keepReading.getByRole('link');
  const categoryLink = keepReading.getByRole('link', { name: 'Browse accessibility posts' });
  const divider = sidebar.locator('.sidebar-category-divider');

  await expect(keepReading.getByRole('heading', { name: 'Start here in accessibility' })).toBeVisible();
  await expect(keepReadingLinks).toHaveCount(4);
  for (const link of await keepReadingLinks.all()) {
    await expect(link).toHaveCSS('text-decoration-line', 'underline');
  }

  await keepReadingLinks.first().focus();
  await expect(keepReadingLinks.first()).toHaveCSS('outline-style', 'solid');

  await expect(divider).toHaveCount(1);
  await expect(categoryLink.locator('.sidebar-category-divider')).toHaveCount(0);
  await expect(divider.locator('+ .sidebar-category-link')).toHaveCount(1);
});
