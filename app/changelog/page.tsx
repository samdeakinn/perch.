export const metadata = { title: 'changelog', description: 'what has shipped on perch.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">changelog</div>
        <h1>what has <em>shipped.</em></h1>
        <div style={{ maxWidth: 'var(--max-narrow)', margin: '24px 0 0' }}>
          {[
            ['6 jul 2026', 'new', '3d observatory rebuild — persistent three.js world across the landing page, react three fiber, post-processing.'],
            ['3 jul 2026', 'new', 'savings calculator, community counter, and uk loyalty penalty map.'],
            ['2 jul 2026', 'improved', 'referral codes and waitlist position lookup.'],
            ['28 jun 2026', 'new', 'blog: 12 articles on the uk auto-renewal economy.'],
            ['3 jul 2026', 'improved', 'monday digest format and the savings breakdown view.'],
          ].map(([date, badge, body]) => (
            <div className="rm-entry" key={body}>
              <div className="rm-date" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ember)', minWidth: 90, paddingTop: 2 }}>{date}</div>
              <div>
                <span className={`rm-badge ${badge === 'new' ? 'rm-badge-now' : 'rm-badge-next'}`}>{badge}</span>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
