# Featured Post Typography Refinement

## Scope

Refine the typography of featured-post treatments on the homepage category cards and category archive pages. No layout, content, color, link, or selection behavior changes are included.

## Homepage category cards

- Render the “Recommended post” label in normal casing and normal font weight.
- Use normal letter spacing for the label.
- Give the label `0.5rem` top margin.
- Match the label's responsive font size to the featured article title: `text-sm` by default and `text-base` at the large breakpoint.
- Set the featured article title line-height to `1.5` so its underline has more breathing room.

## Category page highlight

- Render the “New here? Read this first” label in normal casing and with normal letter spacing.
- Size the label at 18px with a 1.75rem line-height by default, and 24px with a 2rem line-height from the medium breakpoint.
- Match the highlighted article heading's responsive typography to the homepage category-card recommended-post link: `text-sm` by default and `text-base` at the large breakpoint, with a `1.5` line-height.
- Preserve the highlight heading's existing font weight, link behavior, and surrounding card presentation.

## Implementation and verification

Apply the changes through the existing utility classes in `CategorySpotlightCard.astro` and `CategoryFirstRead.astro`. Verify with the relevant automated tests and a production build; add no new behavior-specific tests because these are presentational utility-class changes.
