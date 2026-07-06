export const metadata = { title: 'dashboard', description: 'a preview of the perch. dashboard.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">dashboard</div>
        <h1>your renewals, <em>at a glance.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>this is the shape of the dashboard early-access users see. (static preview — the live app is at <a href="/app" style={{ color: 'var(--accent)' }}>/app</a>.)</p>
        <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--mist)', marginBottom: 24 }}>
          {[['£1,716', 'annual exposure'], ['9', 'items tracked'], ['3', 'need action'], ['£431', 'potential savings']].map(([n, l]) => (
            <div key={l} className="dash-stat" style={{ padding: 20, background: 'var(--slate)', textAlign: 'center', border: '1px solid var(--mist)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 28, color: 'var(--paper)' }}>{n}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 'var(--max-narrow)' }}>
          {[
            ['urgent', 'admiral car insurance · renews 14 aug · +22%', 'renegotiate'],
            ['urgent', 'virgin media broadband · renews 21 jul · +£14/mo', 'renegotiate'],
            ['cancel', 'adobe creative cloud · unused 4 months', 'cancel'],
            ['ok', 'namecheap domain · £14.99/yr · unchanged', 'renew'],
          ].map(([dot, body, badge], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--mist)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0, background: dot === 'urgent' ? 'var(--ember)' : dot === 'cancel' ? 'var(--vermilion)' : 'var(--sage)' }} />
              <div style={{ flex: 1, fontFamily: 'var(--body-serif)', fontSize: 14, color: 'var(--paper)' }}>{body}</div>
              <span className={`badge ${badge === 'renew' ? 'badge-renew' : badge === 'cancel' ? 'badge-cancel' : 'badge-renegotiate'}`}>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
