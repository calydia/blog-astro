# Article Related Link Boundaries Design

## Goal

Clarify link boundaries on individual article pages so hover and focus styling applies only to meaningful linked text, while preserving generous card hit areas.

## Related Posts

Refactor each related-post list item to use the existing `card-cover` pattern. Keep the decorative image and publication date outside the anchor. Place the anchor only around the post title and give it `card-cover__link`, whose pseudo-element expands the hit area across the full list item.

Only the title receives the link underline and color treatment on hover. The date remains unlinked and never underlined. Keyboard focus on the title link produces the existing whole-card `focus-within` outline, while the link itself does not draw a redundant inner outline.

## Keep Reading Category Link

Replace the top border currently attached to the category anchor with a separate decorative horizontal rule. The rule visually separates the category link from the preceding recommendations but is not part of the anchor's hover, focus, or hit area. Keep the category anchor limited to the `Browse [category] posts` text.

## Verification

Add focused browser assertions that:

- a related-post card has one title-only anchor;
- the image and date are outside that anchor;
- the expanded title anchor remains the hit target across the card;
- hovering the card underlines the title but not the date;
- keyboard focus outlines the card;
- the sidebar divider is a sibling of, rather than a descendant of, the category link;
- the category link's accessible name remains unchanged.

Run Astro checks, focused article tests, the non-visual browser suite including axe checks, and the article visual snapshots in light/dark desktop/mobile modes. Update only article snapshots after reviewing the intentional changes.
