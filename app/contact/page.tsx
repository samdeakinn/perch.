export const metadata = { title: 'contact', description: 'get in touch with perch.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ maxWidth: 'var(--max-narrow)' }}>
        <div className="eyebrow">contact</div>
        <h1>say <em>hello.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>questions, feedback, or a renewal horror story? we read everything.</p>
        <div className="card" style={{ maxWidth: 460 }}>
          <h3>email</h3>
          <p style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>hello@perch.app</p>
        </div>
        <div className="card" style={{ maxWidth: 460, marginTop: 12 }}>
          <h3>social</h3>
          <p><a href="https://x.com/perch_app" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>@perch_app on x</a></p>
        </div>
      </div>
    </section>
  );
}
