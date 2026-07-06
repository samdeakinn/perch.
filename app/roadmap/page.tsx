export const metadata = { title: 'roadmap', description: 'what is next for perch.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">roadmap</div>
        <h1>what is <em>coming.</em></h1>
        <div style={{ maxWidth: 'var(--max-narrow)', margin: '24px 0 0' }}>
          {[
            ['now', 'now', 'early access — extraction, verdicts, weekly digest. free.'],
            ['now', 'next', 'price history tracking and savings dashboard.'],
            ['soon', 'later', 'calendar view and csv/pdf export.'],
            ['soon', 'later', 'market benchmarking (premium).'],
            ['later', 'later', 'team digest forwarding and multi-inbox (premium).'],
          ].map(([when, badge, body], i) => (
            <div className="rm-entry" key={i}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ember)', minWidth: 90, paddingTop: 2 }}>{when}</div>
              <div>
                <span className={`rm-badge ${badge === 'now' ? 'rm-badge-now' : badge === 'next' ? 'rm-badge-next' : ''}`}>{badge}</span>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
