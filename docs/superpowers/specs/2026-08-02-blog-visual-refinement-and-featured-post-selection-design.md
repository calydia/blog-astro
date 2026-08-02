# Blog Visual Refinement And Featured Post Selection Design

Date: 2026-08-02
Status: Approved in conversation, pending review of written spec

## Goal

Make the homepage and category pages shorter, easier to scan, and more professionally structured while preserving the blog's spacious character, typography, gradients, and purple-and-blue brand palette. Prepare category recommendations for a future Drupal editorial field without requiring Drupal changes in this implementation.

## Scope

- Compact the homepage category discovery section.
- Preserve greater visual prominence for Accessibility and Tech.
- Reduce accumulated vertical spacing on category pages.
- Lighten the visual treatment of topic browsing and ordinary article cards.
- Give category and article cards one semantic title link whose clickable area covers the card.
- Centralize featured-post selection behind a Drupal-ready resolver.
- Preserve the current complete latest-post listing because there is no dedicated archive destination.

## Non-Goals

- Changing Drupal fields or its GraphQL schema.
- Adding a posts archive page.
- Rendering editorial warnings to visitors or browser consoles.
- Introducing client-side random recommendations.
- Rebranding the site or replacing its established colors and typography.

## Homepage Design

The homepage retains its current order: introduction, category discovery, latest posts, and footer.

The category discovery section uses the approved compact 2 + 3 arrangement:

- Accessibility and Tech form the primary two-card row.
- Life, Cats, and Games form the secondary three-card row on wide screens.
- Cards collapse to one column at narrower widths.
- Primary cards may use slightly larger type and padding than secondary cards, but all cards should be substantially shorter than the current design.

Each category card contains:

- Category title.
- Short category description.
- One concise `Start with:` recommendation.

The repeated category image and generic `Category` label are removed. The recommendation stays inside the card as readable text but is not a second link. Activating the card follows the category-title link to the category page. The featured post title therefore serves as editorial guidance rather than a separate navigation target in this component.

The section heading changes from `Start exploring` to `Explore by topic`. The introductory sentence should remain concise.

The complete latest-post listing remains on the homepage. A `View all posts` link is not added until the site has a valid archive destination.

## Card Link Interaction

Category cards and article cards use one semantic link: the card title.

The card is a positioned container, and the title link receives a pseudo-element positioned across the card. This makes the complete card pointer-clickable without placing descriptions, metadata, or images inside the anchor. Screen readers encounter only the meaningful title as link text and can read the remaining card content as ordinary content.

Requirements:

- The title remains visibly identifiable as the link.
- Keyboard focus on the title link produces a clear focus treatment around the complete card.
- Hovering anywhere on the expanded link produces a card-level hover treatment.
- Cards contain no other interactive elements underneath the expanded pseudo-element.
- The markup does not add redundant `aria-label` text or duplicate links.
- The DOM reading order remains title, supporting metadata, and description where applicable.

## Category Page Design

The category title and Drupal-provided introduction retain their current centered presentation, with reduced top and bottom spacing.

The `New here?` recommendation becomes a compact callout directly after the introduction:

- It keeps an editorial label and recommended-post title.
- The generic explanatory sentence is removed.
- Padding and bottom margin are reduced.
- It remains visually featured and may retain the strong gradient border.
- Its title-link click target expands across the callout using the shared card-link pattern.

`Browse by topic` becomes a lighter tag row:

- It retains a visible heading and linked tags.
- It no longer competes with the recommendation as another heavy, four-sided featured panel.
- Its spacing is reduced so that it reads as part of category navigation rather than an independent hero section.
- Because tags are independent links, this component does not use a card-covering link.

## Visual System Refinements

- Keep the existing brand gradients, purple and blue palette, title font, and accessible contrast.
- Reserve the 4px gradient border for featured content such as category discovery and first-read recommendations.
- Use a quieter 2px border for ordinary article cards.
- Use the existing spacing scale consistently and avoid stacked component margins producing unintended gaps.
- Reduce spacing between the homepage introduction and topic discovery, and between category introductions, recommendations, topic tags, and listings.
- Keep enough internal padding for readability and comfortable touch targets.
- Preserve light and dark theme support.

## Featured-Post Resolver

Create one resolver used by the homepage and every category page. It accepts:

- All available posts for the relevant context.
- The category configuration.
- An optional array of posts selected by Drupal.

The resolver selects exactly one post using this order:

1. If Drupal-selected posts exist, sort them by publication date and use the newest.
2. Otherwise, use the post matching the locally configured featured slug.
3. If the configured slug does not resolve, use the newest post in that category.
4. If no category posts exist, return `undefined` and let the component render its existing safe fallback or omit the recommendation as appropriate.

The resolver must not depend on API response order. Valid dates sort newest first. Posts with missing or invalid dates sort behind posts with valid dates, with a deterministic title or slug tie-breaker.

## Duplicate Drupal Selections

The future Drupal field may return multiple selected posts. Multiple values must not break or lengthen the public card.

When more than one Drupal post is selected:

- Render only the newest selected post.
- Emit a server-side `console.warn()` during development or build.
- Include the category, chosen title, and other selected titles in the warning.
- Do not render a warning in HTML.
- Do not send a warning to client-side JavaScript or the browser console.

Until Drupal exposes the selection field, callers pass no Drupal selections. The local configured slug therefore remains the active editorial source. When Drupal support is added later, GraphQL results should be mapped into the optional resolver input without changing selection behavior or card components.

## Components And Responsibilities

### Category discovery configuration

Retains category slug, name, concise description, visual weight, local featured slug, and optional label. The local slug acts as the transitional editorial fallback after Drupal integration.

### Featured-post resolver

Owns Drupal-selection priority, deterministic sorting, duplicate-selection warnings, local fallback resolution, and newest-category fallback.

### `CategorySpotlightCard`

Renders the compact category card without an image or generic category label. It owns presentation only and receives an already-resolved recommended post.

### `CategoryFirstRead`

Renders the compact category-page recommendation. It receives an already-resolved post and hides safely when no post exists.

### Article listing cards

Render image, title, publication metadata, and description with only the title inside the anchor. Both newest and other listing components use the same interaction and visual conventions.

### `TopicBrowse`

Renders lightweight topic navigation. Its tag links remain independent interactive elements.

## Error Handling

- An absent future Drupal field does not affect current builds.
- Empty Drupal selections fall through to local configuration.
- Multiple Drupal selections produce a server/build warning only.
- Missing configured posts fall through to the newest category post.
- Empty categories omit the first-read block and retain a safe category-card message.
- Invalid post dates do not throw and do not outrank valid dates.

## Accessibility Requirements

- Each card exposes one descriptive link in the accessibility tree.
- Supporting card content remains readable but is not repeated as link text.
- Expanded pseudo-element links work with pointer input without invalid nested interactive content.
- Full-card focus and hover styles do not remove the visible title-link affordance.
- Focus indicators meet contrast requirements in light and dark themes.
- Topic tags remain individually keyboard accessible.
- Existing heading order and landmark structure remain valid.
- Responsive layouts do not clip text or create horizontal scrolling at supported viewport widths.

## Testing

Automated unit-level coverage should verify:

- A single Drupal selection wins over local configuration.
- The newest of multiple Drupal selections is chosen.
- Multiple selections produce one server-side warning with useful context.
- An empty Drupal selection uses the configured slug.
- A missing configured slug uses the newest category post.
- Invalid dates sort behind valid dates.
- Empty post lists return `undefined` safely.

Page and component checks should verify:

- Category and article cards contain only one anchor.
- Article metadata and descriptions are outside the anchor.
- The title link's expanded target covers the card.
- Keyboard focus visibly identifies the complete card.
- No nested interactive elements are obscured by the overlay.

Verification should include:

- Astro type checking and production build.
- Existing accessibility tests.
- Homepage and representative category pages in light and dark themes.
- Desktop and mobile widths, including the compact 2 + 3 responsive transition.
- Intentional visual snapshot updates after reviewing the changed output.

## Success Criteria

- The homepage category section is materially shorter on desktop and mobile.
- Accessibility and Tech remain the strongest category entry points.
- Category-page navigation blocks feel connected rather than separated by excessive whitespace.
- Cards present one concise screen-reader link while remaining fully clickable for pointer users.
- Ordinary post cards feel visually lighter than featured content.
- Current local featured picks continue working without Drupal changes.
- Future duplicate Drupal selections resolve predictably without exposing warnings or layout errors to visitors.
