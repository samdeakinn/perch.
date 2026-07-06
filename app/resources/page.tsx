import Link from 'next/link';
import { articles } from '@/lib/articles';

export const metadata = { title: 'resources', description: 'guides, calculators, and research on the uk auto-renewal economy.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">resources</div>
        <h1>tools & <em>research.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>free, no sign-up needed.</p>
        <div className="resources-grid">
          <Link href="/calculator" className="blog-card" style={{ display: 'block' }}>
            <div className="blog-card-meta">calculator</div>
            <h3>savings calculator</h3>
            <p>estimate what auto-renewal inertia costs you, by category.</p>
          </Link>
          <Link href="/penalty-map" className="blog-card" style={{ display: 'block' }}>
            <div className="blog-card-meta">map</div>
            <h3>uk loyalty penalty map</h3>
            <p>auto-renewal overcharge by region.</p>
          </Link>
          <Link href="/blog" className="blog-card" style={{ display: 'block' }}>
            <div className="blog-card-meta">blog</div>
            <h3>the perch. blog</h3>
            <p>{articles.length} articles on auto-renewals, loyalty penalties, and household money.</p>
          </Link>
          <Link href="/demo" className="blog-card" style={{ display: 'block' }}>
            <div className="blog-card-meta">demo</div>
            <h3>interactive demo</h3>
            <p>watch a batch of renewals get parsed into verdicts, in your browser.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
