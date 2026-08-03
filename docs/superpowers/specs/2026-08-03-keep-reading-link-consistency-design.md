# Keep Reading Link Consistency Design

## Goal

Make all links in the article sidebar's Keep Reading box use the blog's standard link presentation and display inserted category names in lowercase.

## Link Presentation

Remove the special `post-link` and `no-underline` treatment from the featured-post and related-post anchors inside `ArticleSidebar`. These anchors will inherit the same persistent underline, hover color and decoration changes, and visible focus outline as other links in article content, including the existing category-browse link.

Do not change link destinations, link boundaries, recommendation ordering, or the separate divider above the category-browse link.

## Category Display Text

Derive a display-only lowercase category name within `ArticleSidebar` using English locale-aware casing. Use it in:

- `Start here in accessibility`
- `Browse accessibility posts`

Keep the original category value for data flow and the existing lowercase category URL for navigation.

## Verification

Extend the focused article browser test to confirm that:

- the three recommendation links and category-browse link are underlined by default;
- the links retain the site's hover and keyboard-focus styling;
- the featured heading reads `Start here in accessibility`;
- the category link's accessible name is `Browse accessibility posts`;
- existing destinations and the standalone divider remain unchanged.

Run Astro checks, the focused article tests, the non-visual browser suite including axe checks, and the article visual snapshots in desktop/mobile light/dark modes. Update only reviewed article snapshots.
