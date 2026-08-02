type GraphQLResponse<T> = {
  data: T,
  errors?: Array<{ message: string }>,
};

const BLOG_API_URL = import.meta.env.BLOG_API_URL ?? 'https://drupal.ampere.corrupted.pw/graphql';

type ArticleCapabilities = {
  fields: Set<string>;
  arguments: Set<string>;
};

let articleCapabilitiesPromise: Promise<ArticleCapabilities> | undefined;

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

async function getArticleCapabilities(): Promise<ArticleCapabilities> {
  articleCapabilitiesPromise ??= fetchGraphQL<{
    articleType: { fields: Array<{ name: string }> };
    queryType: { fields: Array<{ name: string; args: Array<{ name: string }> }> };
  }>(`
    query ArticleCapabilities {
      articleType: __type(name: "Article") {
        fields {
          name
        }
      }
      queryType: __type(name: "Query") {
        fields {
          name
          args {
            name
          }
        }
      }
    }
  `).then((data) => ({
    fields: new Set(data.articleType.fields.map((field) => field.name)),
    arguments: new Set(
      data.queryType.fields.find((field) => field.name === 'articles')?.args.map((argument) => argument.name) ?? [],
    ),
  }));

  return articleCapabilitiesPromise;
}

async function getSecondaryCategoryFieldSelection(): Promise<string> {
  const capabilities = await getArticleCapabilities();
  return capabilities.fields.has('secondaryCategories') ? '\n          secondaryCategories' : '';
}

async function getFeaturedCategoryPostFieldSelection(): Promise<string> {
  const capabilities = await getArticleCapabilities();
  return capabilities.fields.has('featuredCategoryPost') ? '\n          featuredCategoryPost' : '';
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
  featuredOnly = false,
  fieldSet,
}: {
  limit: number;
  offset?: number;
  category?: number;
  featuredOnly?: boolean;
  fieldSet: 'listing' | 'full' | 'rss';
}) {
  const capabilities = await getArticleCapabilities();
  if (featuredOnly && !capabilities.arguments.has('featuredOnly')) {
    return { articles: { items: [] } };
  }

  const [secondaryCategoryField, featuredCategoryPostField] = await Promise.all([
    getSecondaryCategoryFieldSelection(),
    getFeaturedCategoryPostFieldSelection(),
  ]);

  const fieldsBySet = {
    listing: `
          title
          slug
          date
          listingImage
          metaDescription
          category${secondaryCategoryField}${featuredCategoryPostField}
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
          boxContent${secondaryCategoryField}${featuredCategoryPostField}
    `,
    rss: `
          title
          slug
          date
          category
          metaDescription
          content${secondaryCategoryField}${featuredCategoryPostField}
    `,
  } as const;

  const categoryArgument = category ? `, category: ${category}` : '';
  const offsetArgument = offset ? `, offset: ${offset}` : '';
  const featuredOnlyArgument = featuredOnly ? ', featuredOnly: true' : '';

  return fetchGraphQL<{ articles: { items: unknown[] } }>(`
    query GetArticles {
      articles(limit: ${limit}${categoryArgument}${offsetArgument}${featuredOnlyArgument}) {
        items {
${fieldsBySet[fieldSet]}
        }
      }
    }
  `);
}
