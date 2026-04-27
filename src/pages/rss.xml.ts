import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export const prerender = true;

export async function GET(context: { site: URL | undefined }) {
  const blog = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = blog.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const siteUrl = context.site ?? new URL('http://localhost:4321');

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: siteUrl,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
