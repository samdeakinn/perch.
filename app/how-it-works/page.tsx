import Link from 'next/link';

export const metadata = { title: 'how it works', description: 'forward an email, get a verdict. the whole perch. loop in four steps.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">how it works</div>
        <h1>one email forward. <em>one verdict.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>no bank linking, no password sharing, no daily attention. just the emails you would ignore anyway — read, dated, and turned into a clear action.</p>
        <div className="steps">
          {[
            ['01', 'forward', 'forward the renewal email, pdf, or screenshot. one at a time, or batch a dozen.'],
            ['02', 'extract', 'ai reads the provider, amount, renewal date, and price change — even from scanned documents.'],
            ['03', 'verdict', 'you get renew, cancel, or renegotiate, with a reason and a deadline. you make the call.'],
            ['04', 'digest', 'every monday, a 90-second summary of everything renewing that week.'],
          ].map(([n, t, d]) => (
            <div className="step" key={n}>
              <span className="step-index">{n}</span>
              <h3>{t}</h3>
              <p className="step-desc">{d}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/demo" className="btn-primary">see the demo &rarr;</Link>
        </div>
      </div>
    </section>
  );
}
