import { expect, test } from '@playwright/test';

test('homepage shows six newest posts and links to the full archive', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.locator('section[aria-label="Blog listing"] li.card-cover')).toHaveCount(6);
  await expect(page.getByRole('link', { name: /browse all posts/i })).toHaveAttribute('href', '/posts/');
});

test('all-post archive uses accessible numbered pagination', async ({ page }) => {
  await page.goto('/posts/', { waitUntil: 'networkidle' });

  const pagination = page.getByRole('navigation', { name: 'Pagination' });
  await expect(page.locator('section[aria-label="All blog posts"] li.card-cover')).toHaveCount(12);
  await expect(pagination.locator('[aria-current="page"]')).toHaveText(/1/);
  await expect(pagination.getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '/posts/2/');
  await expect(pagination.getByRole('link', { name: /next/i })).toHaveAttribute('rel', 'next');

  await pagination.getByRole('link', { name: 'Page 2' }).click();
  await expect(page).toHaveURL(/\/posts\/2\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('All posts – Page 2');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://blog.sanna.ninja/posts/2/');
  await expect(page.getByRole('navigation', { name: 'Pagination' }).getByRole('link', { name: /previous/i })).toHaveAttribute('rel', 'prev');
});

test('category pagination uses compact subsequent pages and returns to the full introduction', async ({ page }) => {
  await page.goto('/accessibility/', { waitUntil: 'networkidle' });

  await expect(page.locator('section[aria-label="Accessibility blog posts"] li.card-cover')).toHaveCount(12);
  await expect(page.getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '/accessibility/page/2/');

  await page.getByRole('link', { name: 'Page 2' }).click();
  await expect(page).toHaveURL(/\/accessibility\/page\/2\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Accessibility posts – Page 2');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://blog.sanna.ninja/accessibility/page/2/');
  await expect(page.getByRole('heading', { name: /start here/i })).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Pagination' }).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/accessibility/');
});

test('pagination uses the dark-theme text colours', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('darkMode', 'enabled'));
  await page.goto('/posts/', { waitUntil: 'networkidle' });

  const pagination = page.getByRole('navigation', { name: 'Pagination' });
  await expect(pagination.getByRole('link', { name: 'Page 2' })).toHaveCSS('color', 'rgb(173, 229, 248)');
  await expect(pagination.getByRole('link', { name: /next/i })).toHaveCSS('color', 'rgb(173, 229, 248)');
  await expect(pagination.locator('[aria-current="page"]')).toHaveCSS('color', 'rgb(24, 3, 43)');
});

test('homepage archive link uses the dark-theme brand colour', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('darkMode', 'enabled'));
  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.getByRole('link', { name: /browse all posts/i })).toHaveCSS('color', 'rgb(173, 229, 248)');
});
