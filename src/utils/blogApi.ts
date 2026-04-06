type GraphQLResponse<T> = {
  data: T,
  errors?: Array<{ message: string }>,
};

const BLOG_API_URL = 'https://drupal.ampere.corrupted.pw/graphql';

let articleFieldsPromise: Promise<Set<string>> | undefined;

async function fetchGraphQL<T>(query: string): Promise<T> {
  const response = await fetch(BLOG_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const json = await response.json() as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join('; '));
  }

  return json.data;
}

async function getArticleFields(): Promise<Set<string>> {
  articleFieldsPromise ??= fetchGraphQL<{ __type: { fields: Array<{ name: string }> } }>(`
    query ArticleFields {
      __type(name: "Article") {
        fields {
          name
        }
      }
    }
  `).then((data) => new Set(data.__type.fields.map((field) => field.name)));

  return articleFieldsPromise;
}

async function getSecondaryCategoryFieldSelection(): Promise<string> {
  const articleFields = await getArticleFields();
  return articleFields.has('secondaryCategories') ? '\n          secondaryCategories' : '';
}

export async function fetchPageContent(pageId: number) {
  return fetchGraphQL<{ page: { title: string; metaDescription: string; content: string } }>(`
    query GetBlogFrontPage {
      page(id: ${pageId}) {
        title
        metaDescription
        content
      }
    }
  `);
}

export async function fetchArticles({
  limit,
  offset = 0,
  category,
  fieldSet,
}: {
  limit: number;
  offset?: number;
  category?: number;
  fieldSet: 'listing' | 'full' | 'rss';
}) {
  const secondaryCategoryField = await getSecondaryCategoryFieldSelection();

  const fieldsBySet = {
    listing: `
          title
          slug
          date
          listingImage
          metaDescription
          category${secondaryCategoryField}
    `,
    full: `
          title
          authorContent
          authorImage
          authorName
          category
          content
          date
          id
          imageCredits
          slug
          published
          mainImage
          listingImage
          metaDescription
          boxTitle
          boxContent${secondaryCategoryField}
    `,
    rss: `
          title
          slug
          date
          category
          metaDescription
          content${secondaryCategoryField}
    `,
  } as const;

  const categoryArgument = category ? `, category: ${category}` : '';
  const offsetArgument = offset ? `, offset: ${offset}` : '';

  return fetchGraphQL<{ articles: { items: unknown[] } }>(`
    query GetArticles {
      articles(limit: ${limit}${categoryArgument}${offsetArgument}) {
        items {
${fieldsBySet[fieldSet]}
        }
      }
    }
  `);
}
