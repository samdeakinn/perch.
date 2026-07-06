export const metadata = { title: 'privacy', description: 'how perch. handles your data.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap privacy-body">
        <div className="eyebrow">privacy</div>
        <h1 style={{ marginBottom: 24 }}>privacy, <em>plain.</em></h1>
        {[
          ['what we collect', 'the emails and documents you forward. your name and email for the waitlist and digest. nothing else.'],
          ['what we do not collect', 'no bank credentials, no transaction history, no browsing data, no third-party tracking cookies.'],
          ['how we use it', 'we extract renewal details and store what is needed to track your items. we do not train models on your data.'],
          ['who we share with', 'nobody. no third parties, no aggregators, no “partners.”'],
          ['your control', 'delete any tracked item at any time. leave the waitlist at any time. export your data as csv/pdf.'],
          ['where it lives', 'stored in the eu/uk. encrypted in transit and at rest.'],
        ].map(([h, p]) => (
          <div className="privacy-block" key={h} style={{ marginBottom: 24 }}>
            <h3>{h}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
