import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import type Page from '../interfaces/page';
import { fetchArticles } from '../utils/blogApi';
import { normalizeSecondaryCategories } from '../utils/tags';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(context: APIContext) {
  const response = await fetchArticles({ limit: 50, fieldSet: 'rss' });
  const articles = response.articles.items as Pick<Page, 'title' | 'slug' | 'date' | 'category' | 'metaDescription' | 'content' | 'secondaryCategories'>[];

  return rss({
    title: 'Sanna Kramsi – Blog',
    description: 'Accessibility, tech, and more from Sanna Kramsi.',
    site: context.site!,
    items: articles.map((article) => ({
      title: article.title,
      pubDate: new Date(article.date),
      description: article.metaDescription,
      content: article.content,
      link: `/${article.category.toLowerCase()}/${article.slug.substring(1)}/`,
      customData: normalizeSecondaryCategories(article.secondaryCategories)
        .map((tag) => `<category>${escapeXml(tag.label)}</category>`)
        .join(''),
    })),
    customData: `<language>en</language>`,
  });
}
