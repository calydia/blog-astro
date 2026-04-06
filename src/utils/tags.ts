import type { SecondaryCategoriesValue } from '../interfaces/tag';
import type TagData from '../interfaces/tag';

const SLUG_OVERRIDES: Record<string, string> = {};

function slugifyTag(label: string): string {
  return label
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getTagLabel(tag: string | { name?: string | null; title?: string | null } | null): string | null {
  if (!tag) {
    return null;
  }

  if (typeof tag === 'string') {
    return tag.trim() || null;
  }

  const candidate = tag.name ?? tag.title ?? null;
  return candidate?.trim() || null;
}

export function normalizeSecondaryCategories(secondaryCategories: SecondaryCategoriesValue): TagData[] {
  const values = Array.isArray(secondaryCategories)
    ? secondaryCategories
    : secondaryCategories
      ? [secondaryCategories]
      : [];

  const uniqueTags = new Map<string, TagData>();

  values.forEach((tag) => {
    const label = getTagLabel(tag);

    if (!label) {
      return;
    }

    const overrideKey = label.toLowerCase();
    const slug = SLUG_OVERRIDES[overrideKey] ?? slugifyTag(label);

    if (!slug) {
      return;
    }

    uniqueTags.set(slug, { label, slug });
  });

  return Array.from(uniqueTags.values()).sort((firstTag, secondTag) => firstTag.label.localeCompare(secondTag.label));
}

export function getSharedTagCount(
  firstTags: SecondaryCategoriesValue,
  secondTags: SecondaryCategoriesValue,
): number {
  const firstTagSlugs = new Set(normalizeSecondaryCategories(firstTags).map((tag) => tag.slug));

  return normalizeSecondaryCategories(secondTags).filter((tag) => firstTagSlugs.has(tag.slug)).length;
}

export function getRelatedPosts<T extends {
  slug: string;
  category: string;
  date: string;
  secondaryCategories?: SecondaryCategoriesValue;
}>(
  currentPost: T,
  allPosts: T[],
  limit = 3,
): T[] {
  const candidates = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      sharedTagCount: getSharedTagCount(currentPost.secondaryCategories, post.secondaryCategories),
      sameCategory: post.category === currentPost.category,
      timestamp: Date.parse(post.date),
    }));

  const sortedCandidates = candidates.sort((firstCandidate, secondCandidate) =>
    secondCandidate.sharedTagCount - firstCandidate.sharedTagCount ||
    Number(secondCandidate.sameCategory) - Number(firstCandidate.sameCategory) ||
    secondCandidate.timestamp - firstCandidate.timestamp,
  );

  const preferredPosts = sortedCandidates
    .filter((candidate) => candidate.sharedTagCount > 0 || candidate.sameCategory)
    .map((candidate) => candidate.post);

  if (preferredPosts.length >= limit) {
    return preferredPosts.slice(0, limit);
  }

  const usedSlugs = new Set(preferredPosts.map((post) => post.slug));
  const fallbackPosts = sortedCandidates
    .map((candidate) => candidate.post)
    .filter((post) => !usedSlugs.has(post.slug));

  return [...preferredPosts, ...fallbackPosts].slice(0, limit);
}

export function getPopularTags<T extends { secondaryCategories?: SecondaryCategoriesValue }>(
  posts: T[],
  {
    limit = 8,
    minCount = 2,
  }: {
    limit?: number;
    minCount?: number;
  } = {},
): TagData[] {
  const tagCounts = new Map<string, { tag: TagData; count: number }>();

  posts.forEach((post) => {
    const uniquePostTags = new Map(
      normalizeSecondaryCategories(post.secondaryCategories).map((tag) => [tag.slug, tag]),
    );

    uniquePostTags.forEach((tag, slug) => {
      const existing = tagCounts.get(slug);

      tagCounts.set(slug, {
        tag,
        count: (existing?.count ?? 0) + 1,
      });
    });
  });

  return Array.from(tagCounts.values())
    .filter((entry) => entry.count >= minCount)
    .sort((firstEntry, secondEntry) => secondEntry.count - firstEntry.count || firstEntry.tag.label.localeCompare(secondEntry.tag.label))
    .slice(0, limit)
    .map((entry) => entry.tag);
}
