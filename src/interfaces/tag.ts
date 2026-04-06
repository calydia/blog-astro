export interface DrupalTagReference {
  name?: string | null,
  title?: string | null,
}

export type SecondaryCategoriesValue =
  | Array<string | DrupalTagReference | null>
  | string
  | null
  | undefined;

export default interface TagData {
  label: string,
  slug: string,
}
