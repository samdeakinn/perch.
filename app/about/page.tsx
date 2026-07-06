export const metadata = { title: 'about', description: 'why perch. exists.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ maxWidth: 'var(--max-narrow)' }}>
        <div className="eyebrow">about</div>
        <h1>we are not a fintech. <em>we are a flashlight.</em></h1>
        <div className="article-body" style={{ padding: 0 }}>
          <p>perch. exists because auto-renewal is a £4bn tax on not paying attention, and nobody was building the simple thing: a forward address that reads your renewals and tells you what to do.</p>
          <p>we do not link your bank. we do not auto-cancel on your behalf. we do not sell your data. we read the emails you forward us, turn them into verdicts, and send you one summary a week. that is the whole product.</p>
          <p>built in the uk, for the uk market — the loyalty penalty, the out-of-contract pricing, the gym contracts, the domain lapses. the stuff that quietly costs british households real money.</p>
        </div>
      </div>
    </section>
  );
}
