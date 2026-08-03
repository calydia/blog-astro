import { expect, test } from '@playwright/test';

const breadcrumbPages = [
  { name: 'category', path: '/accessibility/' },
  { name: 'article', path: '/accessibility/accessibility-testing-guide/' },
] as const;

for (const pageCase of breadcrumbPages) {
  test(`${pageCase.name} breadcrumb uses the standard link underline progression`, async ({ page }) => {
    await page.goto(pageCase.path, { waitUntil: 'networkidle' });

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumbs' });
    const homeLink = breadcrumb.getByRole('link', { name: 'Home' });

    await expect(homeLink).toHaveAttribute('href', '/');
    await expect(homeLink).toHaveCSS('text-decoration-line', 'underline');
    await expect(homeLink).toHaveCSS('text-decoration-thickness', 'auto');

    await homeLink.hover();
    await expect(homeLink).toHaveCSS('text-decoration-thickness', '2px');

    await homeLink.focus();
    await expect(homeLink).toHaveCSS('outline-style', 'solid');
  });
}
