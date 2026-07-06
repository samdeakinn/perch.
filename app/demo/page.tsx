'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ITEMS = [
  { icon: '🛡️', subject: 'your policy renews soon', provider: 'admiral car insurance', tag: 'pdf', amount: '£612.40/yr', renews: '14 aug 2026', change: '+22%', verdict: 'renegotiate', verdictText: 'price up 22% — loyalty penalty applied.' },
  { icon: '🎬', subject: 'your subscription ends', provider: 'adobe creative cloud', tag: 'invoice', amount: '£59.99/mo', renews: '3 sep 2026', change: 'no change', verdict: 'cancel', verdictText: 'unused for 4 months. last login: march 2026.' },
  { icon: '🌐', subject: 'your broadband price is changing', provider: 'virgin media broadband', tag: 'notice', amount: '£42.00/mo', renews: '21 jul 2026', change: '+£14/mo', verdict: 'renegotiate', verdictText: 'out of contract pricing. switch or renegotiate.' },
  { icon: '🔗', subject: 'domain renewal reminder', provider: 'namecheap — perch. domain', tag: 'reminder', amount: '£14.99/yr', renews: '18 aug 2026', change: 'no change', verdict: 'renew', verdictText: 'essential domain. price unchanged.' },
  { icon: '💪', subject: 'monthly membership', provider: 'puregym manchester', tag: 'invoice', amount: '£32.00/mo', renews: '1 aug 2026', change: 'no change', verdict: 'cancel', verdictText: 'unused since march. £160/yr saved by cancelling.' },
  { icon: '🛡️', subject: 'your home insurance renews', provider: 'direct line home insurance', tag: 'pdf', amount: '£387.00/yr', renews: '5 sep 2026', change: '+31%', verdict: 'renegotiate', verdictText: 'massive hike. new customer rate is £289.' },
];

type Tab = 'inbox' | 'digest' | 'savings';

export default function DemoPage() {
  const [phase, setPhase] = useState<'scan' | 'done'>('scan');
  const [pct, setPct] = useState(0);
  const [tab, setTab] = useState<Tab>('inbox');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setPct(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPhase('done');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // reveal items one by one after scan
  useEffect(() => {
    if (phase !== 'done') return;
    if (revealed >= ITEMS.length) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), 180);
    return () => clearTimeout(t);
  }, [phase, revealed]);

  function replay() {
    setPhase('scan');
    setPct(0);
    setRevealed(0);
    setExpanded(null);
  }

  return (
    <section className="demo-page" style={{ paddingBottom: 80 }}>
      <div className="wrap" style={{ textAlign: 'center', paddingTop: 140, paddingBottom: 20 }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>interactive demo</div>
        <h1 style={{ maxWidth: 'none', marginBottom: 8 }}>see perch. <em>in action.</em></h1>
        <p style={{ fontFamily: 'var(--body-serif)', fontSize: 15, color: 'var(--pencil)', maxWidth: 500, margin: '0 auto 20px' }}>forward an email in your head. watch what happens. no download, no sign-up, no risk.</p>
        <button onClick={replay} style={{ background: 'none', border: '1px solid var(--fog)', color: 'var(--pencil)', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--sans)', fontSize: 12, cursor: 'pointer', marginBottom: 24 }}>↻ replay scan</button>
      </div>

      <div className="wrap" style={{ position: 'relative' }}>
        <div style={{ position: 'relative', background: 'var(--graphite)', border: '1px solid var(--mist)' }}>
          {phase === 'scan' && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--obsidian)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, border: '1.5px solid var(--ember)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1.5s linear infinite' }} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginBottom: 16 }}>connecting to inbox...</div>
                <div style={{ width: 200, height: 2, background: 'var(--fog)', margin: '0 auto', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--ember)', width: `${pct}%`, transition: 'width 0.1s' }} />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 16, borderBottom: '1px solid var(--mist)' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 20, color: 'var(--paper)', display: 'block' }}>£1,716</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dust)' }}>annual exposure</span>
            </div>
            <div style={{ width: 1, height: 28, background: 'var(--mist)' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 20, color: 'var(--paper)', display: 'block' }}>6</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dust)' }}>items tracked</span>
            </div>
            <div style={{ width: 1, height: 28, background: 'var(--mist)' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 20, color: 'var(--ember)', display: 'block' }}>3</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dust)' }}>need attention</span>
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--mist)' }}>
            {(['inbox', 'digest', 'savings'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: 10, background: 'none', border: 'none', borderBottom: `1px solid ${tab === t ? 'var(--ember)' : 'transparent'}`, color: tab === t ? 'var(--ember)' : 'var(--pencil)', fontFamily: 'var(--sans)', fontSize: 12, cursor: 'pointer' }}>{t}</button>
            ))}
          </div>

          {tab === 'inbox' && (
            <div style={{ padding: 0 }}>
              {ITEMS.map((it, i) => (
                <div key={i} style={{ border: '1px solid var(--mist)', background: 'var(--slate)', opacity: i < revealed ? 1 : 0.2, transition: 'opacity 0.4s' }}>
                  <div onClick={() => setExpanded(expanded === i ? null : i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer' }}>
                    <div style={{ fontSize: 18 }}>{it.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--body-serif)', fontSize: 14, fontWeight: 500, color: 'var(--paper)' }}>{it.subject}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginTop: 2 }}>{it.provider}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 500, padding: '3px 8px', borderRadius: 2, color: 'var(--dust)', background: 'var(--graphite)' }}>{it.tag}</span>
                  </div>
                  {expanded === i && (
                    <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--mist)' }}>
                      {[['amount', it.amount], ['renews', it.renews], ['change', it.change]].map(([l, v]) => (
                        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: 'var(--mono)' }}>
                          <span style={{ fontSize: 10, color: 'var(--dust)' }}>{l}</span>
                          <span style={{ fontSize: 13, color: v.includes('+') ? 'var(--vermilion)' : 'var(--paper)' }}>{v}</span>
                        </div>
                      ))}
                      <div className={`badge ${it.verdict === 'renew' ? 'badge-renew' : it.verdict === 'cancel' ? 'badge-cancel' : 'badge-renegotiate'}`} style={{ marginTop: 8, display: 'inline-block', padding: '6px 10px' }}>{it.verdict} — {it.verdictText}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'digest' && (
            <div style={{ padding: 16 }}>
              <p style={{ fontFamily: 'var(--body-serif)', fontSize: 13, color: 'var(--pencil)', marginBottom: 16, fontStyle: 'italic' }}>good morning. here is what is renewing this week and what needs your attention.</p>
              {[
                { dot: 'urgent', heading: 'needs action', items: ITEMS.filter((x) => x.verdict === 'renegotiate') },
                { dot: 'cancel', heading: 'consider cancelling', items: ITEMS.filter((x) => x.verdict === 'cancel') },
                { dot: 'ok', heading: 'all clear', items: ITEMS.filter((x) => x.verdict === 'renew') },
              ].map((g) => (
                <div key={g.heading} style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: g.dot === 'urgent' ? 'var(--ember)' : g.dot === 'cancel' ? 'var(--vermilion)' : 'var(--sage)' }} />{g.heading}
                  </div>
                  {g.items.map((it) => (
                    <div key={it.provider} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, fontFamily: 'var(--body-serif)', color: 'var(--paper)' }}>
                      <span className={`badge ${it.verdict === 'renew' ? 'badge-renew' : it.verdict === 'cancel' ? 'badge-cancel' : 'badge-renegotiate'}`}>{it.verdict}</span>
                      <span>{it.provider}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)', marginLeft: 'auto' }}>{it.amount} · {it.change}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {tab === 'savings' && (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(40px,8vw,64px)', fontWeight: 500, color: 'var(--sage)' }}>£1,431</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginTop: 4 }}>potential annual savings found</div>
              <div style={{ margin: '24px auto', maxWidth: 320 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 12, padding: '6px 0', color: 'var(--pencil)' }}><span>by renegotiating 3 policies</span><span style={{ color: 'var(--sage)' }}>+£328</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 12, padding: '6px 0', color: 'var(--pencil)' }}><span>by cancelling 2 unused subs</span><span style={{ color: 'var(--sage)' }}>+£1,103</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 0 0', borderTop: '1px solid var(--mist)', marginTop: 6, fontWeight: 500, color: 'var(--paper)' }}><span>total potential savings</span><span>£1,431</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="wrap" style={{ textAlign: 'center', padding: '60px 0 80px' }}>
        <h2 style={{ maxWidth: 'none', margin: '0 auto 16px' }}>see what <em>you are</em> missing.</h2>
        <p style={{ fontSize: 15, color: 'var(--pencil)', maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.6 }}>forward one email. get a date, an amount, and a verdict. that is the whole loop.</p>
        <Link href="/waitlist" className="btn-primary">get early access &rarr;</Link>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}
