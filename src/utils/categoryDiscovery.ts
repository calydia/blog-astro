import type BlogData from '../interfaces/blogHighlight';

export type CategorySlug = 'accessibility' | 'tech' | 'life' | 'cats' | 'games';
export type CategoryWeight = 'primary' | 'secondary';

export type CategoryDiscoveryConfig = {
  slug: CategorySlug;
  name: string;
  description: string;
  weight: CategoryWeight;
  featuredSlug: string;
  featuredLabel?: string;
};

export const categoryDiscoveryConfig: CategoryDiscoveryConfig[] = [
  {
    slug: 'accessibility',
    name: 'Accessibility',
    description: 'Practical writing on digital accessibility, content quality, and the mistakes worth avoiding.',
    weight: 'primary',
    featuredSlug: '/how-to-create-more-accessible-content-avoid-common-accessibility-mistakes',
  },
  {
    slug: 'tech',
    name: 'Tech',
    description: 'Frontend, Astro, Drupal, and personal project notes from building and rebuilding things.',
    weight: 'primary',
    featuredSlug: '/moving-my-accessibility-site-to-astro',
  },
  {
    slug: 'life',
    name: 'Life',
    description: 'Work, recovery, communication, and the personal side of building a sustainable life.',
    weight: 'secondary',
    featuredSlug: '/getting-psychological-safety-back',
  },
  {
    slug: 'cats',
    name: 'Cats',
    description: 'Stories about the cats in my life, from affectionate chaos to the harder moments that stay with you.',
    weight: 'secondary',
    featuredSlug: '/remembering-osiris',
  },
  {
    slug: 'games',
    name: 'Games',
    description: 'Game impressions with a personal angle, usually focused on what made the experience memorable.',
    weight: 'secondary',
    featuredSlug: '/little-kitty-big-city-a-cat-lovers-dream',
  },
];

export function getCategoryDiscoveryConfig(slug: string): CategoryDiscoveryConfig | undefined {
  return categoryDiscoveryConfig.find((category) => category.slug === slug);
}

export function getFeaturedCategoryPost(posts: BlogData[], featuredSlug: string): BlogData | undefined {
  return posts.find((post) => post.slug === featuredSlug);
}
