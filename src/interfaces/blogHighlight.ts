import type { SecondaryCategoriesValue } from './tag';

export default interface BlogData {
  title: string,
  category: string,
  slug: string,
  date: string,
  listingImage: string,
  metaDescription: string,
  secondaryCategories?: SecondaryCategoriesValue,
}
