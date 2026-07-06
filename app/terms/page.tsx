export const metadata = { title: 'terms', description: 'the perch. terms of service.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap legal-body">
        <div className="eyebrow">terms</div>
        <h1 style={{ marginBottom: 24 }}>terms, <em>plain.</em></h1>
        {[
          ['the service', 'perch. reads renewal emails and documents you forward or upload, extracts renewal details, and produces verdicts and a weekly digest.'],
          ['your responsibility', 'you make every decision. we never cancel, switch, or contact a provider on your behalf. you are responsible for acting on verdicts.'],
          ['early access', 'during early access all features are free. we will give notice before billing begins, and you can leave at any time.'],
          ['accuracy', 'extraction is not perfect. always check the details before acting. we are not liable for actions taken or not taken based on a verdict.'],
          ['accounts', 'you provide a name and email. you can delete your data and leave at any time.'],
          ['contact', 'questions? email hello@perch.app or use the contact page.'],
        ].map(([h, p]) => (
          <div key={h}>
            <h3>{h}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
