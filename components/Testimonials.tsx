'use client';

import { useEffect, useState } from 'react';

const TESTIMONIALS = [
  { quote: 'i forwarded fifteen emails in about four minutes. it found a domain renewal i had forgotten about, a pet insurance quote that jumped 34%, and a charity subscription i meant to cancel last year. already worth it and i have not paid a thing.', cite: 'jo milner · household, manchester' },
  { quote: 'we run a small agency with fifteen saas tools across the team. being able to forward the receipt and get a clear verdict is exactly the right level of involvement.', cite: 'tom carr · founder, stag studio · bristol' },
  { quote: 'i consider myself pretty on top of finances, but i still missed a mobile contract renewal that had quietly doubled. the weekly digest format is perfect.', cite: 'samira khan · freelance designer, london' },
  { quote: 'we had three saas tools on annual contracts that we had completely stopped using. total cost: about £1,800 a year. perch. flagged all three in the first batch.', cite: 'mike rowland · co-founder, rafter · edinburgh' },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 8000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div style={{ position: 'relative', maxWidth: 'var(--max-narrow)', margin: '40px auto 0' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {TESTIMONIALS.map((t, j) => (
        <div key={j} className="testimonial" style={{ display: j === i ? 'block' : 'none' }}>
          <blockquote>{t.quote}</blockquote>
          <cite>{t.cite}</cite>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
        {TESTIMONIALS.map((_, j) => (
          <button
            key={j}
            aria-label={`testimonial ${j + 1}`}
            onClick={() => setI(j)}
            style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid var(--fog)', background: j === i ? 'var(--accent)' : 'transparent', cursor: 'pointer', padding: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
