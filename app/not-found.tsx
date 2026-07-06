import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="page-404">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>404</div>
        <h1 style={{ margin: '0 auto 16px' }}>this page <em>lapsed.</em></h1>
        <p className="section-sub section-sub-center">like a forgotten domain renewal. <Link href="/" style={{ color: 'var(--accent)' }}>go home →</Link></p>
      </div>
    </section>
  );
}
