export const metadata = { title: 'comparison', description: 'how perch. compares to budgeting apps, bank-link trackers, and spreadsheets.' };

const ROWS = [
  ['time horizon', 'looks forward', 'looks backward', 'backward', 'manual'],
  ['bank linking', 'never', 'required', 'required', 'n/a'],
  ['auto-cancel', 'never — you decide', 'sometimes', 'no', 'manual'],
  ['renewal extraction', 'email + document', 'spending patterns', 'spending', 'you type it'],
  ['monday digest', 'yes', 'no', 'no', 'no'],
  ['privacy', 'no training on your data', 'reads transactions', 'reads transactions', 'local'],
];

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">comparison</div>
        <h1>not a budgeting app. <em>a renewal radar.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>budgeting apps tell you what you spent. perch. tells you what is about to renew and whether you should act. different job, different time horizon.</p>
        <table className="comp-table">
          <thead>
            <tr><th></th><th>perch.</th><th>budgeting app</th><th>open banking</th><th>spreadsheet</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                <td className="accent-col" style={{ color: 'var(--accent)' }}>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
