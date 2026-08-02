# Blog Visual Refinement Implementation Plan

Date: 2026-08-02
Design: `2026-08-02-blog-visual-refinement-and-featured-post-selection-design.md`

## Goal

Implement the approved compact discovery layout, accessible card interaction, category-page spacing refinements, and Drupal-ready featured-post resolver without requiring a Drupal schema change.

## Work Sequence

1. Replace direct featured-slug lookup with a deterministic resolver that accepts optional Drupal selections, warns server-side about duplicates, and falls back safely.
2. Add focused resolver tests and a unit-test script.
3. Rebuild category spotlight cards without images or redundant labels, using one expanded title link.
4. Refactor article listing cards so only their titles are links while their expanded CSS targets cover each card.
5. Compact category introductions and first-read recommendations, and lighten topic browsing.
6. Apply the shared resolver to the homepage and all category pages.
7. Verify types, production build, unit behavior, accessibility, keyboard interaction, responsive layout, and visual snapshots.

## Expected Files

- `src/utils/categoryDiscovery.ts`
- `src/components/CategorySpotlightCard.astro`
- `src/components/CategoryFirstRead.astro`
- `src/components/NewestBlogListing.astro`
- `src/components/OtherBlogListing.astro`
- `src/components/TopicBrowse.astro`
- `src/pages/index.astro`
- `src/pages/accessibility.astro`
- `src/pages/tech.astro`
- `src/pages/life.astro`
- `src/pages/cats.astro`
- `src/pages/games.astro`
- `src/styles/global.css`
- `tests/unit/categoryDiscovery.test.ts`
- relevant Playwright checks and snapshots

## Verification Commands

- `npm run test:unit`
- `npm run build`
- `npm run test:a11y`
- `npm run test:e2e`
- `npm run test:visual:update` after manual review of generated screenshots
