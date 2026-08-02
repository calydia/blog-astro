import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import type BlogData from '../../src/interfaces/blogHighlight.ts';
import {
  getDrupalFeaturedCategoryPosts,
  getCategoryDiscoveryConfig,
  resolveFeaturedCategoryPost,
} from '../../src/utils/categoryDiscovery.ts';

const category = getCategoryDiscoveryConfig('accessibility');
if (!category) throw new Error('Accessibility category config is required for tests.');

function post(overrides: Partial<BlogData> = {}): BlogData {
  return {
    title: 'Post',
    category: 'Accessibility',
    slug: '/post',
    date: '2026-01-01',
    listingImage: '/post.jpg',
    metaDescription: 'Description',
    ...overrides,
  };
}

describe('resolveFeaturedCategoryPost', () => {
  it('uses a Drupal-selected post before the configured post', () => {
    const configured = post({ slug: category.featuredSlug });
    const selected = post({ slug: '/selected' });

    assert.equal(resolveFeaturedCategoryPost([configured, selected], category, [selected]), selected);
  });

  it('uses the newest Drupal selection and warns when several are selected', () => {
    const older = post({ title: 'Older', slug: '/older', date: '2025-01-01' });
    const newer = post({ title: 'Newer', slug: '/newer', date: '2026-01-01' });
    const warning = mock.method(console, 'warn', () => undefined);

    try {
      assert.equal(resolveFeaturedCategoryPost([], category, [older, newer]), newer);
      assert.equal(warning.mock.callCount(), 1);
      assert.match(String(warning.mock.calls[0].arguments[0]), /Using newest: “Newer”/);
      assert.match(String(warning.mock.calls[0].arguments[0]), /Also selected: “Older”/);
    } finally {
      warning.mock.restore();
    }
  });

  it('uses the locally configured post when Drupal has no selection', () => {
    const configured = post({ slug: category.featuredSlug });
    assert.equal(resolveFeaturedCategoryPost([configured], category), configured);
  });

  it('falls back to the newest post in the category', () => {
    const older = post({ slug: '/older', date: '2025-01-01' });
    const newer = post({ slug: '/newer', date: '2026-01-01' });
    assert.equal(resolveFeaturedCategoryPost([older, newer], category), newer);
  });

  it('sorts invalid dates behind valid dates and ignores other categories', () => {
    const invalid = post({ slug: '/invalid', date: 'not-a-date' });
    const valid = post({ slug: '/valid', date: '2024-01-01' });
    const otherCategory = post({ category: 'Tech', slug: '/tech', date: '2027-01-01' });

    assert.equal(resolveFeaturedCategoryPost([invalid, valid, otherCategory], category), valid);
  });

  it('returns undefined when there is no usable post', () => {
    assert.equal(resolveFeaturedCategoryPost([], category), undefined);
  });
});

describe('getDrupalFeaturedCategoryPosts', () => {
  it('returns only selected posts in the requested primary category', () => {
    const selected = post({ slug: '/selected', featuredCategoryPost: true });
    const unselected = post({ slug: '/unselected', featuredCategoryPost: false });
    const selectedElsewhere = post({
      category: 'Tech',
      slug: '/selected-tech',
      featuredCategoryPost: true,
    });

    assert.deepEqual(
      getDrupalFeaturedCategoryPosts([selected, unselected, selectedElsewhere], category),
      [selected],
    );
  });
});
