export const metadata = { title: 'brand', description: 'the perch. brand — voice, colour, type.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ maxWidth: 'var(--max-narrow)' }}>
        <div className="eyebrow">brand</div>
        <h1>perch<span style={{ color: 'var(--accent)' }}>.</span> — <em>the brand.</em></h1>
        <div className="article-body" style={{ padding: '16px 0 0' }}>
          <h2>voice</h2>
          <p>plain. direct. never salesy. anti-fintech-bro. all visible text stays lowercase. we say “you forgot you agreed to,” not “unlock savings.”</p>
          <h2>colour</h2>
          <p>obsidian <code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>#080d0c</code> background. ember <code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>#c98a3a</code> accent, brightening to gold <code style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>#f0b840</code> on scroll. sage = renew, vermilion = cancel, amber = renegotiate.</p>
          <h2>type</h2>
          <p>playfair display (hero, italic). source serif 4 (body). inter (ui). jetbrains mono (data). no border radius on cards. hairline borders.</p>
          <h2>the observatory</h2>
          <p>the 3d motif is an astrolabe — concentric gimbal rings, an icosahedron core, orbiting documents, three verdict nodes. it persists across the landing page and responds to scroll.</p>
        </div>
      </div>
    </section>
  );
}
