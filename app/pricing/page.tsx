export const metadata = { title: 'pricing', description: 'three tiers. no kickbacks. free to start.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">pricing</div>
        <h1>three tiers. <em>no kickbacks.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>free to start, cheap to stay, premium if you need the firehose. all plans include extraction, verdicts, and the weekly digest.</p>
        <div className="pricing-row" style={{ marginTop: 32 }}>
          {[
            { name: 'starter', price: '£0', feats: ['up to 5 renewals tracked', 'email & document extraction', 'weekly digest (read only)', 'renew / cancel / renegotiate verdicts'] },
            { name: 'standard', price: '£8.99', feats: ['unlimited renewals tracked', 'email & document extraction', 'full weekly digest', 'price history tracking', 'savings dashboard', 'calendar view'], featured: true },
            { name: 'premium', price: '£19.99', feats: ['everything in standard', '3 forwarding inboxes', 'vendor & saas contract tracking', 'team digest forwarding', 'market benchmarking', 'csv / pdf export', 'priority support'] },
          ].map((p) => (
            <div className={`pricing-card${p.featured ? ' featured' : ''}`} key={p.name}>
              <h3>{p.name}</h3>
              <div className="pricing-price">{p.price}{p.price !== '£0' && <span>/month</span>}</div>
              <ul>{p.feats.map((f) => <li key={f}>{f}</li>)}</ul>
              <a href="/waitlist" className="btn-secondary">get early access &rarr;</a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginTop: 20 }}>no surprises. cancel any time. annual billing saves ~20–30% depending on tier.</p>
      </div>
    </section>
  );
}
