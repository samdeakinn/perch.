export const metadata = { title: 'the tool', description: 'a quick in-browser renewal extractor.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>the tool</div>
        <h1 style={{ textAlign: 'center', margin: '0 auto 8px' }}>paste a renewal email. <em>see it parsed.</em></h1>
        <p className="section-sub section-sub-center">the full interactive version is at <a href="/app" style={{ color: 'var(--accent)' }}>/app</a> — paste, upload, or manual entry, with list/calendar/digest views.</p>
      </div>
    </section>
  );
}
