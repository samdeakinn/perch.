export const metadata = { title: 'the problem', description: 'auto-renewal is a £4bn tax on not paying attention.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ maxWidth: 'var(--max-narrow)' }}>
        <div className="eyebrow">the problem</div>
        <h1>renewal is designed to be <em>silent.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>every provider is incentivised to make auto-renewal frictionless and quiet. the result is a quiet, compounding tax on uk households — paid by the people who least notice it.</p>
        <div className="big-stat" style={{ fontSize: 'clamp(60px,9vw,100px)' }}>£4bn</div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dust)', textAlign: 'center', margin: '8px 0 40px' }}>lost by uk consumers to auto-renewal inertia every year</p>
        <div className="track-grid-2col" style={{ marginTop: 32 }}>
          <div className="card">
            <h3>the loyalty penalty</h3>
            <p>insurers, broadband, and gyms all charge renewing customers more than new ones. the fca banned the worst of it in 2022, but the gap never closed.</p>
          </div>
          <div className="card">
            <h3>out-of-contract drift</h3>
            <p>the moment your fixed term ends, the price jumps — often doubling — and nobody tells you. the provider has no incentive to.</p>
          </div>
          <div className="card">
            <h3>the ghost subscription</h3>
            <p>£1.6bn a year in the uk, from services you stopped using but never cancelled. the model is built on you forgetting.</p>
          </div>
          <div className="card">
            <h3>the preventable lapse</h3>
            <p>a £15 domain renewal ignored becomes a £150 buyback — if you can buy it back at all. the most preventable loss in the ledger.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
