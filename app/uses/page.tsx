export const metadata = { title: 'uses', description: 'who perch. is built for — households, freelancers, landlords, small teams.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">who it is for</div>
        <h1>built for anyone who <em>forgets</em> to cancel.</h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>if you have more than three things auto-renewing, perch. pays for itself. if you have a business or a portfolio, it is essential.</p>
        <div className="track-grid-2col" style={{ marginTop: 32 }}>
          {[
            ['🏠', 'households', 'the six-to-nine auto-renewing items quietly costing the average uk home £500+ a year.'],
            ['💼', 'freelancers', 'saas tools, co-working, software subscriptions — the small charges that compound.'],
            ['🏢', 'landlords', '15–25 renewal events a year across properties, each on a different date, each with a penalty.'],
            ['👥', 'small teams', 'the tangle of annual saas contracts nobody owns and nobody cancels.'],
          ].map(([icon, t, d]) => (
            <div className="card" key={t as string}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
