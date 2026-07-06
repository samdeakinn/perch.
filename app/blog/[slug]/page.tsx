import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/articles';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt, alternates: { canonical: `/blog/${slug}` } };
}

function renderBody(body: string) {
  return body.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.trim() === '') return null;
    return <p key={i}>{line}</p>;
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <>
      <section className="page-header">
        <div className="wrap" style={{ maxWidth: 'var(--max-narrow)' }}>
          <div className="eyebrow">{article.date} · {article.readTime} min read</div>
          <h1 style={{ fontStyle: 'normal', maxWidth: 'none' }}>{article.title}</h1>
          <p className="section-sub" style={{ margin: '16px 0 0' }}>{article.excerpt}</p>
        </div>
      </section>
      <div className="article-body">{renderBody(article.body)}</div>
      <div className="wrap" style={{ maxWidth: 'var(--max-narrow)', borderTop: '1px solid var(--mist)', padding: '24px 0 80px' }}>
        <Link href="/blog" className="btn-secondary">← back to blog</Link>
      </div>
    </>
  );
}
