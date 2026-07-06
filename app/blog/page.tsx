import Link from 'next/link';
import { articles } from '@/lib/articles';

export const metadata = { title: 'blog', description: 'the perch. blog on auto-renewals, loyalty penalties, and uk household money.' };

export default function BlogPage() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">writing</div>
        <h1>the <em>perch. blog.</em></h1>
        <p className="section-sub" style={{ margin: '12px 0 32px' }}>the auto-renewal economy, the loyalty penalty, and what to do about it. plain, researched, uk-focused.</p>
        <div className="blog-list">
          {articles.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="blog-card">
              <div className="blog-card-meta">{a.date} · {a.readTime} min read</div>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <div className="blog-card-footer">read →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
