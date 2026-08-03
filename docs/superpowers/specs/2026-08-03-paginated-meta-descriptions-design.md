# Paginated Meta Descriptions Design

## Goal

Give paginated post archives accurate, distinct meta descriptions without creating copy that becomes stale when posts move between pages.

## Design

Keep the existing description on the first page of each archive. On pages 2 and later, generate a human-readable description that includes the current page number and retains the archive topic:

- The all-posts archive uses: `Browse page {page} of posts about accessibility, technology, life, cats, and games.`
- Each category archive uses its existing category meta description with `Page {page}: ` prepended.

The computed description continues to pass through the existing `Layout` interface. This keeps the HTML meta description, Open Graph description, and `CollectionPage` schema description aligned without changing the layout API.

## Scope

Change only the description computation in the all-posts and category archive components. Preserve existing page titles, headings, URLs, self-referencing canonicals, crawlable pagination links, and indexation behavior.

## Error Handling

Pagination already supplies a positive page number. No new fallback or validation is required. Page 1 remains an explicit branch so its current copy cannot change accidentally.

## Verification

Run the Astro type/content checks and production build. Confirm from generated HTML that page 1 retains its original description and representative pages 2+ contain their page number in the HTML, Open Graph, and JSON-LD descriptions.
