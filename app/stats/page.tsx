import { getStats } from '@/lib/waitlist';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const s = await getStats();
  return (
    <section className="page-header">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>live stats</div>
        <h1 style={{ textAlign: 'center', margin: '0 auto 8px' }}>the waitlist, <em>honestly.</em></h1>
        <p className="section-sub section-sub-center">no inflated numbers. just the real count.</p>
        <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--mist)', marginTop: 32, maxWidth: 680, margin: '32px auto 0' }}>
          {[['total', s.total], ['households', s.households], ['businesses', s.businesses], ['referrals', s.totalRefs]].map(([l, n]) => (
            <div key={l as string} style={{ padding: 20, background: 'var(--slate)', textAlign: 'center', border: '1px solid var(--mist)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 28, color: 'var(--paper)' }}>{(n as number).toLocaleString()}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
