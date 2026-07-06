export const metadata = { title: 'features', description: 'everything perch. does — extraction, verdicts, digest, dashboard.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">features</div>
        <h1>what perch. <em>actually does.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>no bank linking. no auto-cancel bots. just the tools to see what is renewing and decide what stays.</p>
        <div className="features-grid">
          {[
            ['📧', 'email & document extraction', 'forward a renewal email, upload a pdf, paste a screenshot. perch. reads the provider, amount, date, and price change.'],
            ['⚖️', 'renew / cancel / renegotiate', 'a clear verdict per item, with a reason and the deadline. you always make the call — we never touch an account.'],
            ['📬', 'monday digest', 'a 90-second weekly summary of everything renewing that week, ranked by urgency. read it once, act once.'],
            ['📊', 'savings dashboard', 'your tracked exposure, your potential savings, your price-change history — all in one view.'],
            ['📅', 'calendar view', 'every renewal on a calendar so you see the clusters coming, not just the next one.'],
            ['🔐', 'private by design', 'no training on your data, no third-party sharing, delete any item any time.'],
          ].map(([icon, t, d]) => (
            <div className="feature-card" key={t as string}>
              <div className="feature-icon">{icon}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
