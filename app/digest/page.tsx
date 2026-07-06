export const metadata = { title: 'the monday digest', description: 'a preview of the perch. weekly digest.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">the digest</div>
        <h1>every monday. <em>90 seconds.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>a preview of the email you get every monday morning — this week’s renewals, ranked by urgency.</p>
        <div className="digest-mockup" style={{ maxWidth: 560, margin: '0 auto', border: '1px solid var(--mist)', background: 'var(--slate)' }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--mist)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)' }}>perch. · weekly renewal roundup · mon</div>
          <div style={{ padding: 16 }}>
            <p style={{ fontFamily: 'var(--body-serif)', fontSize: 13, color: 'var(--pencil)', marginBottom: 16 }}>good morning. here is what is renewing this week and what needs your attention.</p>
            {[
              ['urgent', 'needs action', [['renegotiate', 'admiral car insurance', '£612.40/yr · +22%'], ['renegotiate', 'virgin media broadband', '£42/mo · +£14/mo']]],
              ['cancel', 'consider cancelling', [['cancel', 'adobe creative cloud', '£59.99/mo · unused 4mo']]],
              ['ok', 'all clear', [['renew', 'namecheap — perch. domain', '£14.99/yr']]],
            ].map(([dot, heading, items]) => (
              <div key={heading as string} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: dot === 'urgent' ? 'var(--ember)' : dot === 'cancel' ? 'var(--vermilion)' : 'var(--sage)' }} />
                  {heading}
                </div>
                {(items as string[][]).map(([b, name, meta]) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, fontFamily: 'var(--body-serif)', color: 'var(--paper)', borderBottom: '1px solid var(--mist)' }}>
                    <span className={`badge ${b === 'renew' ? 'badge-renew' : b === 'cancel' ? 'badge-cancel' : 'badge-renegotiate'}`}>{b}</span>
                    <span>{name}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dust)', marginLeft: 'auto' }}>{meta}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
