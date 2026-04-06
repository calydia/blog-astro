# Blog Taxonomy And Discovery Design

Date: 2026-04-06
Project: `blog-astro`
Scope: Blog information architecture and content discovery improvements for `blog.sanna.ninja`

## Goal

Improve the blog's structure so it works better as:

- a discoverable learning resource for accessibility and tech content
- a flexible personal publication for life, cats, and games
- a site that can support future growth without forcing an immediate split into separate publications

The design should strengthen browsing and internal discovery first. Search is intentionally deferred unless the archive grows enough that browsing no longer serves readers well.

## Background

The current blog already has:

- strong top-level categories in the main navigation: `Accessibility`, `Tech`, `Life`, `Cats`, `Games`
- category archive pages
- article pages with RSS support
- article pages with related posts based on shared category

The current structure is clear at the category level, but weak at the topic level:

- there is no secondary taxonomy for recurring subjects
- related posts can only recommend from the same category
- there is no topic archive or “browse by topic” experience
- there is no “start here” path for readers who want to learn accessibility or tech from the archive

At the same time, the blog should remain one publication. Accessibility and tech should drive discovery, while personal categories remain part of the same editorial identity without needing to perform the same search/discovery job.

## Non-Goals

- No migration of accessibility posts into `a11ying-front` in this phase
- No change to `wcag-front` scope or positioning
- No full editorial split into separate sites or separate CMS models
- No broad visual redesign of the blog
- No immediate implementation of blog search
- No uncontrolled folksonomy where authors can create arbitrary tags without governance

## Current State

### Frontend

The Astro frontend currently:

- renders top-level category archive pages
- renders article pages under `/<category>/<slug>/`
- shows RSS entry points in header and footer
- shows related posts below article content

Related posts are currently computed by:

- matching the current article's category
- excluding the current article
- taking the first three matches

This gives basic onward navigation, but it does not reflect topical relevance within larger categories.

### Content Model

The blog frontend consumes article data from Drupal over GraphQL. The current `Page` model includes fields such as:

- title
- category
- slug
- content
- date
- meta description
- images
- author fields

There is currently no tag field in the frontend model. To support topic discovery, Drupal will need to expose a reusable tag field for articles through GraphQL.

### Related Sites

`a11ying-front` already surfaces the newest accessibility posts on its front page. This is a useful feeder pattern and should remain in place for now.

`wcag-front` is a focused reference-oriented experience and should not absorb editorial blog content in this phase.

## Recommendation

Keep the blog as the canonical home for all posts and introduce a controlled secondary taxonomy using tags.

This approach is preferred because:

- it preserves one publishing workflow
- it strengthens discovery for accessibility and tech without penalizing personal writing
- it avoids the maintenance overhead of running two editorial homes
- it allows `a11ying-front` to continue acting as a curated feeder for accessibility content
- it creates a path to better related posts, tag archives, and future search without requiring all of those features at once

## Alternatives Considered

### 1. Categories Only

Keep the current category structure and improve only archive copy and related posts.

Pros:

- simplest implementation
- no Drupal schema work needed
- low editorial overhead

Cons:

- weak topic-level discovery
- related content stays blunt and category-bound
- limited support for readers trying to learn a specific accessibility or tech topic

### 2. Categories Plus Controlled Tags

Keep categories as the main editorial structure and add a governed tag system for recurring topics.

Pros:

- improves topic-level discovery without disrupting the current site model
- creates better related-post recommendations
- supports future search and topic archives
- fits a hybrid publication model well

Cons:

- requires Drupal content-model work
- needs tag governance to avoid sprawl

Decision: use this approach.

### 3. Split Accessibility Content Into `a11ying-front`

Move accessibility articles or future accessibility writing into `a11ying-front`, while keeping the blog for personal and non-accessibility topics.

Pros:

- strongest topical focus for accessibility
- could improve perceived authority for that content area

Cons:

- creates two editorial homes
- complicates decisions for overlapping accessibility/tech posts
- raises migration and maintenance cost before the volume justifies it

Decision: reject for now. Revisit only if accessibility publishing volume becomes consistent and substantial.

## Information Architecture Decision

The blog will use two levels of taxonomy:

### 1. Categories Remain Primary

Categories define the broad editorial areas:

- Accessibility
- Tech
- Life
- Cats
- Games

Categories continue to drive:

- main navigation
- article URL structure
- category archive pages
- high-level editorial expectations

### 2. Tags Become Secondary

Tags describe recurring topics within or across categories.

Tags should be:

- reusable
- topic-based
- stable in spelling and scope
- useful for browsing and recommendation

Tags should not be:

- duplicates of categories
- one-off labels
- vague labels such as `thoughts`, `random`, or `personal`

## Tagging Model

### Tag Rules

Initial editorial rules:

- each post may have 0 to 5 tags
- only create a new tag when it is expected to be reused
- prefer tags that can support at least 3 posts over time
- maintain one canonical label per topic
- use sentence-style display names where that improves readability, such as `screen readers`

### Suggested Starter Tag Set

Accessibility-focused:

- `wcag`
- `screen readers`
- `keyboard`
- `forms`
- `aria`
- `testing`
- `content design`

Tech-focused:

- `astro`
- `css`
- `javascript`
- `frontend`
- `performance`
- `drupal`

Cross-over:

- `inclusive ux`
- `game accessibility`
- `writing`

Personal categories should use tags sparingly. The intent is not to force the same taxonomy depth onto life, cats, and games unless clear recurring topic clusters emerge naturally.

## Drupal Requirements

Drupal needs to support tags as structured editorial data rather than free text.

Recommended Drupal-side changes:

- add a reusable tag taxonomy for blog articles
- expose tags in the GraphQL article payload
- expose both human-readable label and machine-safe slug if possible
- allow multiple tags per article
- keep category as a separate primary field rather than replacing it with tags

Preferred GraphQL article data shape:

- category
- tags: array of tag objects
- each tag object should include:
  - label
  - slug

This avoids fragile frontend slug generation and keeps canonical tag URLs consistent.

## Frontend Changes

### 1. Article Metadata

Tags should appear near the article meta information on post pages.

Recommended placement:

- below or beside date, category, and reading time
- above the article body

Behavior:

- each tag links to its tag archive page
- tags are secondary in visual hierarchy to category

This makes the topic model visible without changing the site's main navigation.

### 2. Related Posts Logic

Related posts should become relevance-based instead of category-only.

Recommended ranking logic:

1. shared tags first
2. same category second
3. newest eligible posts as final fallback if needed

Selection rules:

- exclude the current article
- prefer posts with the highest number of shared tags
- if tag matches are insufficient, fill remaining slots from the same category
- keep the result count at 3 unless later testing justifies expanding it

Section labeling should also become more flexible. A heading like `Related posts` is safer than always saying `More in Accessibility`, because the set may include tag-related relevance rather than category-only similarity.

### 3. Tag Archive Pages

Add tag archive pages under a stable route pattern such as:

- `/tags/<tag-slug>/`

Each tag page should include:

- page title using the tag label
- short introductory copy explaining the topic
- reverse-chronological listing of matching posts
- standard post-card metadata

If Drupal does not provide tag descriptions initially, the frontend can launch with a generic intro template and later upgrade to CMS-authored tag intros if needed.

### 4. Category Pages

Category pages should remain the primary browsing pages, especially for `Accessibility` and `Tech`.

Recommended enhancement:

- add a small `Browse by topic` or `Popular topics` section on category pages
- only show tags that are meaningfully represented in that category
- keep this section secondary to the main article listing

This creates a better learning path without turning category pages into dense taxonomy hubs.

### 5. Homepage

The homepage should not become tag-heavy in this phase.

Keep the homepage focused on:

- newest post
- recent posts
- editorial character of the publication

Tag-driven discovery should live lower in the browsing journey, where readers are already engaged with the archive.

## Search Decision

Search is explicitly deferred in this phase.

### Rationale

The stronger current need is exploration, not direct retrieval.

Tags, topic archives, and better related-post logic will do more immediate work for readers who:

- want to continue learning after one article
- want to browse a topic cluster
- do not yet know the exact post they want

Search is more valuable when:

- the accessibility and tech archive grows substantially
- users are likely to arrive looking for one specific topic
- browsing by category and tag is no longer efficient enough

### Future Search Scope

If search is implemented later, it should be intentionally narrow and accessible.

Recommended future scope:

- search title
- search meta description
- search category
- search tags

Recommended future UI:

- a dedicated search page
- optional header entry point
- accessible keyboard and focus behavior from the start

Search should not replace category and tag browsing. It should complement them.

## Content Strategy Implications

This taxonomy design supports the publication's hybrid role:

- accessibility and tech can function as discoverable learning content
- life, cats, and games can remain expressive and personal
- the whole site still reads as one author's publication

This also creates space for future editorial features without a structural reset:

- “Start here” pages for accessibility and tech
- “Best of” collections
- curated reading paths by topic
- stronger linking from `a11ying-front` into specific topic clusters

## Implementation Order

Recommended sequence:

1. Add tag support in Drupal and GraphQL.
2. Extend frontend article types to include tags.
3. Render tags on article pages.
4. Update related-post selection to use shared tags first and category fallback second.
5. Add tag archive pages.
6. Add `Browse by topic` sections to `Accessibility` and `Tech` category pages.
7. Reassess search later based on archive growth and user needs.

This sequence keeps each step independently useful and avoids shipping search before the information architecture is ready.

## Risks And Mitigations

### Risk: Tag Sprawl

If tags are added inconsistently, the system becomes noisy and low-value.

Mitigation:

- start with a small controlled vocabulary
- create editorial rules for tag creation
- normalize labels and slugs in Drupal

### Risk: Personal Categories Become Over-Structured

If tags are forced equally across all categories, the personal side of the publication may feel artificial.

Mitigation:

- keep tags optional
- apply them most deliberately to accessibility and tech
- only add personal-topic tags when repeated clusters emerge naturally

### Risk: Related Posts Feel Less Predictable

Moving from same-category to relevance-based recommendations can surprise users if the logic is too broad.

Mitigation:

- rank shared tags above all else
- keep category as the main fallback
- keep the section size small

### Risk: Frontend Depends On Incomplete Drupal Tag Data

If Drupal exposes only free-text labels or inconsistent slugs, frontend archive routing becomes brittle.

Mitigation:

- require structured tag objects with canonical label and slug before launching tag pages

## Open Questions Resolved In This Design

- Should the blog remain canonical for all writing? Yes.
- Should accessibility content move into `a11ying-front` now? No.
- Should `wcag-front` become a blog home? No.
- Are tags recommended? Yes, as a secondary governed taxonomy.
- Is search recommended now? No, not as the next priority.

## Acceptance Criteria For Implementation Planning

The implementation plan for this design should satisfy the following outcomes:

- articles can carry structured tags from Drupal
- tags are visible and linkable on article pages
- related posts use shared-tag relevance before category fallback
- readers can browse posts by tag on dedicated archive pages
- `Accessibility` and `Tech` category pages gain a lightweight topic-browsing layer
- search remains out of scope for this phase
