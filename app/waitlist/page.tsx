'use client';

import { useState } from 'react';

export default function WaitlistPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [segment, setSegment] = useState('household');
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, segment }),
      });
    } catch {}
    setDone(true);
    // also fetch status
    try {
      const r = await fetch(`/api/waitlist/status?email=${encodeURIComponent(email)}`);
      const d = await r.json();
      if (d.found) setStatus(d);
    } catch {}
  }

  return (
    <section className="page-header">
      <div className="wrap" style={{ maxWidth: 'var(--max-narrow)' }}>
        <div className="eyebrow">early access</div>
        <h1>join the <em>waitlist.</em></h1>
        <p className="section-sub" style={{ margin: '12px 0 32px' }}>no bank linking. no auto-cancel bots. just a weekly digest of what is renewing and what to do about it. early access is free.</p>

        {!done ? (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              {['household', 'business', 'freelancer'].map((s) => (
                <button key={s} className={`calc-chip${segment === s ? ' on' : ''}`} onClick={() => setSegment(s)} style={{ textTransform: 'lowercase' }}>{s}</button>
              ))}
            </div>
            <form onSubmit={submit} style={{ maxWidth: 460 }}>
              <input className="hero-form" style={{ display: 'block', width: '100%', marginBottom: 10, maxWidth: 'none', margin: '0 0 10px' }} type="text" placeholder="your name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="hero-form" style={{ display: 'block', width: '100%', marginBottom: 16, maxWidth: 'none', margin: '0 0 16px' }} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="btn-primary">join the waitlist &rarr;</button>
            </form>
          </>
        ) : (
          <div style={{ maxWidth: 460, padding: 28, border: '1px solid var(--mist)', background: 'var(--slate)' }}>
            <h3 style={{ marginBottom: 8 }}>you are on the list{name && `, ${name}`}.</h3>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dust)' }}>we will be in touch when your spot opens.</p>
            {status && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--mist)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)' }}>your position</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 28, color: 'var(--paper)' }}>#{status.position} <span style={{ fontSize: 13, color: 'var(--dust)' }}>/ {status.total}</span></div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ember)', marginTop: 6 }}>est. access: {status.estimatedAccess}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginTop: 12 }}>referral code: <span style={{ color: 'var(--accent)' }}>{status.referralCode}</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
