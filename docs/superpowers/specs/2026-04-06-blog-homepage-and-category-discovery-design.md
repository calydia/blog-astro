# Blog Homepage And Category Discovery Design

Date: 2026-04-06
Status: Approved in conversation, pending user review of written spec

## Goal

Improve first-visit discovery on the blog by making it easier for new readers to find the kind of content they want quickly, while preserving the site's personal tone and existing visual identity.

The design should:

- Make topic-based discovery easier than it is today
- Give `Accessibility` and `Tech` more prominence on the homepage
- Add curated `New here? Read this first` recommendations without needing analytics
- Reduce the visual heaviness of category discovery compared to the current image-dominant listing pattern
- Keep the site feeling personal rather than turning it into a generic publication layout

## Non-Goals

- No newsletter or email capture work
- No major brand redesign
- No new analytics dependency
- No change to the core post data model in Drupal
- No attempt to algorithmically determine best posts

## User Problem

The current homepage is readable and visually consistent, but discovery is weak for a first-time reader:

- The first screen introduces the site but does not guide readers toward the best entry point
- The latest-post grid is visually heavy and not easy to scan quickly
- All categories are effectively treated the same on the homepage, even though `Accessibility` and `Tech` are the strongest discovery paths
- Category pages do not currently help a new reader know where to start

## Design Principles

1. Topic first, personality second in structure
The site should be organized primarily around helping readers find the topic they want. Personality should shape the tone and introductions, not replace navigation.

2. Editorial curation over analytics
Because analytics are not currently available, featured entry points should be manually curated and easy to update.

3. Lighter featured discovery patterns
Featured category recommendations should be easier to scan than the existing post cards and should not depend on large thumbnails.

4. Reuse existing visual language
The implementation should work within the current Astro/Tailwind structure and preserve the site's established colors, typography, and tone.

## Chosen Direction

### Homepage

Use a weighted, topic-led homepage.

Structure:

1. Short personality-driven intro
2. Primary category discovery row for `Accessibility` and `Tech`
3. Secondary category discovery row for `Life`, `Cats`, and `Games`
4. Existing latest-post listing moved lower on the page as a secondary browse path

Each homepage category card should include:

- Category name
- Short category description
- `New here? Read this first`
- Title of the featured introductory post
- Link to browse the category

Visual direction:

- Use a balanced card treatment
- Include a light visual cue, but not a large dominant thumbnail
- Keep primary categories visually stronger than secondary categories

### Category Pages

Keep category pages topic-led and structurally consistent.

Structure:

1. Existing page title and intro
2. Lightweight text-led `New here? Read this first` block
3. Existing `Browse by topic` section
4. Existing latest-post and remaining post listing

The featured intro block should:

- Sit above topic browsing and the post listing
- Use text-first hierarchy instead of a thumbnail-heavy presentation
- Help a new reader find a strong first post immediately

Visual direction:

- Use a text-led treatment
- Allow the recommendation to stand out through spacing, border, and typography rather than a large image

## Curated First-Read Picks

These are the editorially selected introductory posts for new readers:

- `Accessibility`: `How to create more accessible content - avoid common accessibility mistakes`
- `Tech`: `Moving my accessibility site to Astro`
- `Life`: `Getting psychological safety back`
- `Cats`: `Remembering Osiris`
- `Games`: `Little Kitty, Big City - a cat lover's dream`

These choices optimize for new-reader appeal, not post performance metrics.

## Content Model

Add a small local category configuration module as the source of truth for curated discovery metadata.

Each category entry should define:

- Category key / slug
- Display name
- Short homepage description
- Visual weight: `primary` or `secondary`
- Featured post slug
- Optional label text, defaulting to `New here? Read this first`

This config should be used by both homepage and category-page components.

## Components

Introduce a small reusable discovery layer rather than hardcoding homepage and category-page blocks.

### `categoryConfig`

Purpose:

- Editorial source of truth for category descriptions, weights, and first-read picks

Responsibilities:

- Map category slug to display data
- Make homepage and category-page discovery consistent

### `CategorySpotlightCard`

Purpose:

- Homepage category card for guided discovery

Responsibilities:

- Render category name, description, featured post, and browse link
- Support primary and secondary visual weights
- Use balanced visual treatment

### `CategoryFirstRead`

Purpose:

- Lightweight featured recommendation block on category pages

Responsibilities:

- Render label, featured post title, and short supporting context if available
- Use text-led treatment
- Fail safely if featured post data is missing

### Data helper

Purpose:

- Resolve featured post objects from the existing fetched article lists

Responsibilities:

- Match configured slug to available post data
- Return `undefined` or similar safe fallback when not found

## Data Flow

### Homepage

- Fetch existing front page content
- Fetch all listing articles as today
- Group or map categories using local config
- Resolve one featured post per configured category
- Render primary and secondary category spotlight sections
- Render latest posts below them

### Category Pages

- Fetch existing page intro content
- Fetch category article listing as today
- Build existing popular tags as today
- Resolve the configured featured post for the category from the fetched article list
- Render the `CategoryFirstRead` block above `TopicBrowse`

## Behavior And Failure Handling

- If a configured featured slug does not resolve, the page should still render without crashing
- Homepage category cards should still render category descriptions even if the featured post is missing
- Category pages may hide the `New here? Read this first` block if no configured featured post is found
- The existing post listing remains the fallback discovery path

## Visual Guidance

### Homepage cards

- Balanced treatment
- Smaller image cue or decorative visual, not full-card dominant imagery
- Clear separation between category description and featured recommendation
- Stronger size and emphasis for `Accessibility` and `Tech`

### Category first-read blocks

- Text-led treatment
- No large thumbnail required
- Strong label and post-title hierarchy
- Should read as an editorial recommendation, not another card in the listing grid

## SEO And Metadata Notes

Fix the homepage canonical and OG URL issue while implementing this work.

Current issue:

- Front page currently passes `currentUrl="front"` and produces malformed homepage canonical and OG URLs

Expected behavior:

- Homepage canonical and OG URL should resolve to the real homepage URL

No `last updated` field should be added for regular blog posts as part of this work, because posts are not meaningfully maintained after publication.

## Testing

Manual verification should cover:

- Homepage desktop layout
- Homepage mobile layout
- One primary category page desktop and mobile
- One secondary category page desktop and mobile
- Correct featured-post link resolution for all five categories
- Graceful behavior when a configured featured slug is invalid
- Homepage canonical and OG URL output

## Implementation Scope

Likely files affected:

- Homepage page component
- Category page components
- One or two new reusable discovery components
- A local category config module
- Possible small helper utilities for featured-post lookup
- Layout metadata handling for homepage canonical / OG fix

## Open Questions Resolved

- No newsletter CTA: confirmed out of scope
- Featured picks chosen editorially: confirmed
- Topic-led structure with personality in the intro: confirmed
- `Accessibility` and `Tech` receive more homepage emphasis: confirmed
- Visual treatment: balanced on homepage, text-led on category pages: confirmed

## Recommendation

Proceed with implementation planning for:

- category config
- homepage discovery section
- category-page first-read block
- homepage metadata fix
