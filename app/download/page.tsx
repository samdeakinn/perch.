export const metadata = { title: 'download', description: 'perch. is a web app — no download needed.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>download</div>
        <h1 style={{ textAlign: 'center', margin: '0 auto 8px' }}>it is just a <em>web app.</em></h1>
        <p className="section-sub section-sub-center">no app store, no install. forward emails from any device, read the digest in any inbox.</p>
        <div style={{ marginTop: 24 }}>
          <a href="/waitlist" className="btn-primary">get early access &rarr;</a>
        </div>
      </div>
    </section>
  );
}
