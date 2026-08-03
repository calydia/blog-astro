# Article Body Heading And Image Credit Design

## Goal

Restore the established visual hierarchy for headings inside individual blog article bodies and suppress the image-credit line when an article has no credit value.

## Heading Scope And Styles

Apply the historical heading scale only to `h2`, `h3`, and `h4` elements inside the article body's `.bodytext` container:

- `h2`: `text-2xl`, increasing to `text-3xl` at the large breakpoint.
- `h3`: `text-xl`, increasing to `text-2xl` at the large breakpoint.
- `h4`: `text-lg`, increasing to `text-xl` at the large breakpoint.
- All three levels remain bold and use the historical `mt-8` spacing.

Define these selectors outside Tailwind's base layer so the reset cannot reduce the headings to the inherited body-text size. Do not change headings in the article title, table of contents, optional content box, sidebar, related-post section, cards, navigation, or footer.

## Image Credit Rendering

Treat `imageCredits` as nullable article data. Trim the value before deciding whether to render it. Render the existing `Image credit: ...` block only when the trimmed value is non-empty. For `null`, `undefined`, an empty string, or whitespace-only content, omit the entire credit element so no label or `null` text appears.

Credit HTML remains trusted CMS output and continues to use the existing rendering mechanism when present.

## Verification

Extend the deterministic article fixture so its body contains `h2`, `h3`, and `h4` elements. Add browser assertions that:

- each heading level is visually larger than the body-text size where its historical scale calls for it;
- the heading levels form the expected descending hierarchy at desktop size;
- an article with a credit displays the existing credit line;
- an article with a null credit has no `.credits` element and no `Image credit:` or `null` text.

Run Astro checks, the focused article browser tests, the full deterministic browser suite, and the accessibility suite. Visual snapshots should not be updated until the intentional article typography change has been reviewed.
