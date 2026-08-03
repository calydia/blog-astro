# Category Card Equal-Height Rows

## Problem

Homepage category cards opt out of CSS Grid's default stretch behavior with `self-start`. Cards in the same row therefore size themselves to their individual content and can have mismatched heights.

## Design

Remove `self-start` from the root element of `CategorySpotlightCard.astro`. The existing homepage grids will then stretch each card to the height of the tallest card in its row.

The primary and secondary card grids remain independent, and cards in different rows are not forced to share a height. Mobile single-column cards continue to use their natural row height. No fixed or minimum heights will be introduced.

## Verification

Run the production build and existing tests. Confirm from the rendered homepage that cards sharing a multi-column grid row have matching heights at the applicable responsive breakpoints.
