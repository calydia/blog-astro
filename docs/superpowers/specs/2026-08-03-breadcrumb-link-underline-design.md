# Breadcrumb Link Underline Design

## Goal

Make breadcrumb links use the same underline progression as ordinary blog links on every page where breadcrumbs appear.

## Shared Styling

Update the shared `Breadcrumb.astro` styles so breadcrumb links use the browser/site default underline thickness at rest and a `2px` underline on hover. Preserve the existing underline offset, light/dark hover colors, and visible keyboard-focus treatment. Focus continues to remove the underline while showing the explicit outline.

Remove the current breadcrumb-specific `2px` resting underline and `4px` hover underline. Do not change breadcrumb markup, labels, destinations, separators, wrapping, or current-page text.

Because category, archive, tag, and article layouts share `Breadcrumb.astro`, the component-level change applies consistently without duplicated layout rules.

## Verification

Add browser assertions on representative category and article pages that confirm:

- breadcrumb links are underlined at rest;
- resting underline thickness is thinner than the hover thickness;
- hover thickness is `2px`;
- existing focus outlines remain visible;
- breadcrumb destinations and accessible navigation labels remain unchanged.

Run Astro checks, focused breadcrumb tests, the non-visual browser suite including axe checks, and affected visual snapshots. Update only snapshots whose breadcrumb rendering intentionally changes after review.
