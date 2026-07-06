import { articles } from '@/lib/articles';

const SITE = 'https://perch.vercel.app';

export async function GET() {
  const items = articles
    .map(
      (a) => `
    <entry>
      <title>${a.title}</title>
      <link>${SITE}/blog/${a.slug}</link>
      <id>${SITE}/blog/${a.slug}</id>
      <updated>${new Date(a.date).toISOString()}</updated>
      <summary>${a.excerpt}</summary>
    </entry>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>perch. blog</title>
  <link href="${SITE}/blog" />
  <id>${SITE}/blog</id>
  <updated>${new Date().toISOString()}</updated>
  ${items}
</feed>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml' } });
}
