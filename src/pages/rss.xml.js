import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const posts = await getCollection('blog');
  
  return rss({
    title: SITE_TITLE || 'Hidratación Saludable Blog',
    description: SITE_DESCRIPTION || 'Blog sobre nutrición, bienestar y oportunidades de negocio con productos naturales',
    site: context.site || 'https://hidratacionsaludable.com.ar',
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        author: post.data.author,
        categories: [post.data.category, ...post.data.tags],
        customData: [
          post.data.heroImage 
            ? `<enclosure url="${context.site || 'https://hidratacionsaludable.com.ar'}${post.data.heroImage}" type="image/jpeg" />`
            : '',
          post.data.instagramCaption 
            ? `<instagramCaption><![CDATA[${post.data.instagramCaption}]]></instagramCaption>`
            : ''
        ].filter(Boolean).join('\n'),
      })),
    customData: `<language>es-ar</language>`,
  });
}