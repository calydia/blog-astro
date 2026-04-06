# Blog Taxonomy And Discovery Implementation Plan

Date: 2026-04-06
Project: `blog-astro`
Scope: Frontend implementation plan for the approved blog taxonomy and discovery design

## Goal

Implement the approved blog information architecture improvements in a sequence that:

- depends on Drupal tag support only where necessary
- delivers useful improvements incrementally
- keeps current category-based browsing intact during rollout

## Dependencies

### Required Drupal Dependency

Before tag-driven features can ship fully, Drupal must expose structured tags in the article GraphQL payload.

Required article fields:

- `tags`
- each tag should include:
  - `label`
  - `slug`

Category remains unchanged and continues to be required.

### Frontend Assumptions

The Astro frontend will continue to:

- fetch article data from Drupal GraphQL at build time
- generate static article and archive pages
- keep categories as the primary route and navigation model

## Rollout Strategy

Use a phased rollout with one integration point between Drupal and Astro.

Recommended sequence:

1. Prepare frontend types and helper logic for tags.
2. Land Drupal tag support.
3. Render tags on article pages.
4. Upgrade related posts to use shared-tag relevance.
5. Add tag archive pages.
6. Enhance `Accessibility` and `Tech` archive pages with topic browsing.
7. Reassess search later.

This keeps the rollout low-risk and avoids shipping partial taxonomy UI without data support.

## Phase 1: Frontend Preparation

This phase can begin before Drupal changes are complete.

### Tasks

- extend frontend interfaces to support tag objects
- add a shared tag type, for example:
  - `label`
  - `slug`
- add utility helpers for:
  - normalizing tag arrays
  - counting shared tags between posts
  - generating tag archive URLs from canonical slugs
- review existing GraphQL query locations and list every query that must request tags once available

### Affected Areas

- article page data model
- listing/highlight data model where needed
- related-post selection logic
- future tag archive route generation
- RSS query review for possible tag inclusion later if desired

### Output

The codebase is ready to consume tags with minimal follow-up once Drupal exposes them.

## Phase 2: Drupal Integration

This phase depends on Drupal work.

### Required Frontend Query Updates

Update all article-fetching GraphQL queries to request tags where article data is needed.

Primary places to update:

- `src/pages/[category]/[...slug].astro`
- `src/pages/index.astro`
- category archive pages such as:
  - `src/pages/accessibility.astro`
  - `src/pages/tech.astro`
  - `src/pages/life.astro`
  - `src/pages/cats.astro`
  - `src/pages/games.astro`
- `src/pages/rss.xml.ts` if tag-aware feed output is later desired

### Validation

Confirm:

- all posts build when tags are absent or empty
- posts with tags expose stable `label` and `slug`
- no frontend route logic depends on generating slugs from labels

### Output

Frontend builds successfully against Drupal responses that include structured tags.

## Phase 3: Article Tag UI

Add tags to article pages as secondary metadata.

### Tasks

- render tags near the existing article meta line
- make each tag a link to `/tags/<tag-slug>/`
- keep category visually primary and tags visually secondary
- hide the tag section cleanly when a post has no tags

### UX Notes

- do not overload the meta area
- avoid badge styling that visually competes with the title or category
- keep keyboard focus states clear and consistent with existing link patterns

### Output

Posts visibly expose topic relationships without changing the site’s main navigation.

## Phase 4: Related Posts Upgrade

Replace category-only related posts with a relevance-based selection model.

### Selection Logic

Rank candidate posts by:

1. number of shared tags
2. same-category preference
3. recency as a tiebreaker if needed

Selection rules:

- exclude the current post
- prefer posts with at least one shared tag
- fill any remaining slots with same-category posts
- return at most 3 posts

### Tasks

- move related-post scoring into a helper rather than keeping it inline in `getStaticPaths`
- update the `RelatedPosts` heading to support generic relevance wording such as `Related posts`
- ensure the component still works when a post has no tags

### Validation

Test at least these cases:

- post with multiple tags
- post with one tag
- post with no tags
- category with many posts
- category with very few posts

### Output

Related content becomes more useful for learning-oriented browsing while preserving category fallback.

## Phase 5: Tag Archive Pages

Add static tag archive pages under `/tags/<tag-slug>/`.

### Route Responsibilities

The tag route should:

- gather all articles
- derive the distinct tag set
- generate one static page per tag slug
- list all matching posts newest first

### Page Content

Each tag archive should include:

- tag title
- short intro copy
- list of matching posts
- standard metadata display for each post

### Intro Copy Strategy

Phase 1 of tag pages can use template copy, for example:

- “Posts about {tag}”

If later needed, Drupal can add optional tag descriptions for richer archive intros.

### Output

Readers can browse topic clusters directly instead of relying only on categories.

## Phase 6: Category Topic Browsing

Enhance the `Accessibility` and `Tech` category pages with a lightweight topic-browsing section.

### Tasks

- compute the most relevant tags used in the category
- render a `Browse by topic` or `Popular topics` section
- link each topic to its tag archive page
- keep the main chronological listing as the primary content

### Scope Limits

This phase should only be applied to `Accessibility` and `Tech` first.

Reasons:

- these categories are the main discovery engines
- personal categories do not yet need equivalent taxonomy depth

### Output

The most important learning categories gain a second browsing layer without turning into complex directory pages.

## Phase 7: Editorial Governance

This is partly content work, but the implementation should support it.

### Governance Rules

- keep a small starter vocabulary
- avoid synonym drift
- avoid one-off tags
- treat tags as optional on personal posts

### Practical Follow-Up

- backfill tags for existing accessibility and tech posts first
- leave older personal posts untagged unless clear clusters exist
- review the starter vocabulary after real tagging work, not before

### Output

The taxonomy remains useful instead of becoming noisy.

## Deferred Work: Search

Search is not in scope for this implementation plan.

### Revisit Trigger

Reconsider search when:

- the archive has enough accessibility and tech depth that browsing becomes slow
- tag archives and related posts are no longer sufficient for discovery
- there is a clear user need to retrieve a specific concept quickly

### Future Search Scope

If revisited later, the first version should search:

- title
- meta description
- category
- tags

This future work should be treated as a separate spec and plan.

## Suggested File-Level Worklist

Likely files to update or add:

- `src/interfaces/page.ts`
- `src/interfaces/blogHighlight.ts`
- `src/pages/[category]/[...slug].astro`
- `src/components/RelatedPosts.astro`
- `src/pages/index.astro`
- `src/pages/accessibility.astro`
- `src/pages/tech.astro`
- optional later updates to `src/pages/life.astro`
- optional later updates to `src/pages/cats.astro`
- optional later updates to `src/pages/games.astro`
- new helper modules under `src/utils/`
- new tag route under `src/pages/tags/`

Exact route file structure can be chosen during implementation based on current Astro routing preferences.

## Testing Plan

### Functional Checks

- article pages render with and without tags
- related posts work with tag matches and fallbacks
- tag archive pages build correctly
- tag links resolve correctly
- category topic sections only show meaningful tags

### Accessibility Checks

- tag links are keyboard reachable
- focus styles remain visible
- related-post links still have clear names
- tag archive pages preserve heading hierarchy

### Regression Checks

- existing category pages still build
- existing post URLs remain unchanged
- RSS feed remains valid
- builds do not fail when tags are empty arrays

## Implementation Risks

### Risk: Tight Coupling Between Query Shapes And UI

Mitigation:

- centralize tag types and helper logic
- avoid repeating tag assumptions inline in multiple files

### Risk: Empty Or Partial Tag Data During Rollout

Mitigation:

- treat tags as optional everywhere
- preserve category fallback logic

### Risk: Tag Pages With Thin Content

Mitigation:

- only generate pages for tags that are actually used
- start with compact template intros
- revisit richer tag descriptions later if needed

## Completion Criteria

This plan is complete when:

- article queries consume structured tags from Drupal
- articles display tag links when tags exist
- related posts use shared-tag relevance before category fallback
- tag archive pages exist and list matching posts
- `Accessibility` and `Tech` pages expose topic browsing
- search remains deferred and out of scope
