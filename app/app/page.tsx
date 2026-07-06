'use client';

import { useEffect, useState } from 'react';

type Item = {
  id: string;
  provider: string;
  amount: string;
  period: string;
  renews: string;
  category: string;
  change: string;
  notes: string;
  verdict: 'renew' | 'cancel' | 'renegotiate';
};

const SAMPLE = `Subject: Your car insurance is renewing soon
From: Admiral Insurance

your policy for your toyota yaris will renew on 14 august 2026. your new premium is £612.40 per year. this represents a change of +22% from your previous year's premium of £502.00.

if you want to cancel or make changes, please contact us before the renewal date.`;

function parseEmail(text: string): Partial<Item> {
  const amountMatch = text.match(/£\s?([\d,]+\.?\d*)\s*(?:per\s*year|\/year|\/yr|per\s*month|\/month|\/mo)?/i);
  const dateMatch = text.match(/(\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4})/i);
  const changeMatch = text.match(/([+\-]?\d+%)/);
  const providerMatch = text.match(/From:\s*(.+)/i) || text.match(/^([A-Z][A-Za-z\s&]+?)(?:\s+(?:insurance|broadband|media|gym|domains?))/m);
  return {
    provider: providerMatch ? providerMatch[1].trim() : 'unknown provider',
    amount: amountMatch ? `£${amountMatch[1]}` : '',
    renews: dateMatch ? dateMatch[1] : '',
    change: changeMatch ? changeMatch[1] : 'no change',
    period: /per\s*month|\/mo/i.test(text) ? 'month' : 'year',
  };
}

function verdictFor(change: string, notes: string): Item['verdict'] {
  const c = parseFloat(change) || 0;
  if (/unused|cancel/i.test(notes)) return 'cancel';
  if (c >= 15) return 'renegotiate';
  if (c > 0) return 'renegotiate';
  return 'renew';
}

export default function AppPage() {
  const [mode, setMode] = useState<'paste' | 'manual'>('paste');
  const [view, setView] = useState<'list' | 'digest'>('list');
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState<Item[]>([]);
  const [paste, setPaste] = useState('');
  const [parseResult, setParseResult] = useState<Partial<Item> | null>(null);
  const [manual, setManual] = useState({ provider: '', amount: '', renews: '', category: 'insurance', change: '', notes: '' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('perch-items');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  function persist(next: Item[]) {
    setItems(next);
    try { localStorage.setItem('perch-items', JSON.stringify(next)); } catch {}
  }

  function addParsed() {
    if (!parseResult) return;
    const it: Item = {
      id: crypto.randomUUID(),
      provider: parseResult.provider || 'unknown',
      amount: parseResult.amount || '',
      period: parseResult.period || 'year',
      renews: parseResult.renews || '',
      category: /insurance|policy/i.test(parseResult.provider || '') ? 'insurance' : 'subscription',
      change: parseResult.change || 'no change',
      notes: '',
      verdict: verdictFor(parseResult.change || 'no change', ''),
    };
    persist([...items, it]);
    setParseResult(null);
    setPaste('');
  }

  function addManual(e: React.FormEvent) {
    e.preventDefault();
    const it: Item = {
      id: crypto.randomUUID(),
      provider: manual.provider,
      amount: `£${manual.amount}`,
      period: 'year',
      renews: manual.renews,
      category: manual.category,
      change: manual.change || 'no change',
      notes: manual.notes,
      verdict: verdictFor(manual.change || 'no change', manual.notes),
    };
    persist([...items, it]);
    setManual({ provider: '', amount: '', renews: '', category: 'insurance', change: '', notes: '' });
  }

  function del(id: string) {
    persist(items.filter((i) => i.id !== id));
  }

  function clearAll() {
    if (confirm('clear all tracked items?')) persist([]);
  }

  const annualExposure = items.reduce((s, i) => {
    const n = parseFloat(i.amount.replace(/[£,]/g, '')) || 0;
    return s + (i.period === 'month' ? n * 12 : n);
  }, 0);
  const needAction = items.filter((i) => i.verdict !== 'renew').length;
  const savings = items.filter((i) => i.verdict !== 'renew').reduce((s, i) => {
    const n = parseFloat(i.amount.replace(/[£,]/g, '')) || 0;
    return s + (i.period === 'month' ? n * 12 : n) * 0.5;
  }, 0);

  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  return (
    <section style={{ paddingBottom: 80, paddingTop: 120 }}>
      <div className="wrap" style={{ textAlign: 'center', marginBottom: 24 }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>renewal tracker</div>
        <h1 style={{ maxWidth: 'none', marginBottom: 8 }}>your <em style={{ color: 'var(--accent)' }}>inbox.</em></h1>
        <p style={{ fontSize: 14, color: 'var(--pencil)', maxWidth: 500, margin: '0 auto' }}>paste a renewal email or enter the details yourself. perch. extracts what matters. data stays in your browser.</p>
      </div>

      <div className="wrap" style={{ maxWidth: 'var(--max-body)' }}>
        <div style={{ border: '1px solid var(--mist)', background: 'var(--slate)', marginBottom: 20 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--mist)' }}>
            {(['paste', 'manual'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: 10, background: 'none', border: 'none', borderBottom: `1px solid ${mode === m ? 'var(--ember)' : 'transparent'}`, color: mode === m ? 'var(--ember)' : 'var(--pencil)', fontFamily: 'var(--sans)', fontSize: 11, cursor: 'pointer' }}>{m === 'paste' ? 'paste email' : 'manual entry'}</button>
            ))}
          </div>

          {mode === 'paste' && (
            <div style={{ padding: 16 }}>
              <textarea value={paste} onChange={(e) => { setPaste(e.target.value); setParseResult(e.target.value.length > 20 ? parseEmail(e.target.value) : null); }} placeholder="paste a renewal email here..." style={{ width: '100%', minHeight: 120, background: 'var(--graphite)', border: '1px solid var(--mist)', color: 'var(--paper)', fontFamily: 'var(--mono)', fontSize: 12, padding: 12, resize: 'vertical', outline: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)' }}>perch. reads the email and extracts dates, amounts, and price changes.</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setPaste(SAMPLE); setParseResult(parseEmail(SAMPLE)); }} style={{ background: 'none', border: '1px solid var(--fog)', color: 'var(--pencil)', padding: '8px 14px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--sans)', fontSize: 11, cursor: 'pointer' }}>example</button>
                  <button onClick={addParsed} disabled={!parseResult} style={{ padding: '8px 16px', border: 'none', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'var(--ember)', color: 'var(--obsidian)', opacity: parseResult ? 1 : 0.4 }}>parse & add →</button>
                </div>
              </div>
              {parseResult && paste.length > 20 && (
                <div style={{ marginTop: 12, padding: 12, background: 'var(--graphite)', border: '1px solid var(--mist)' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ember)', marginBottom: 8 }}>extracted</div>
                  {[['provider', parseResult.provider], ['amount', parseResult.amount], ['renews', parseResult.renews], ['change', parseResult.change]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontFamily: 'var(--mono)', fontSize: 12 }}><span style={{ color: 'var(--dust)', fontSize: 10 }}>{l}</span><span style={{ color: 'var(--paper)' }}>{v || '—'}</span></div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === 'manual' && (
            <form onSubmit={addManual} style={{ padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input placeholder="provider" required value={manual.provider} onChange={(e) => setManual({ ...manual, provider: e.target.value })} style={{ padding: 10, background: 'var(--graphite)', border: '1px solid var(--mist)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 12 }} />
                <input placeholder="amount (e.g. 612.40)" required value={manual.amount} onChange={(e) => setManual({ ...manual, amount: e.target.value })} style={{ padding: 10, background: 'var(--graphite)', border: '1px solid var(--mist)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 12 }} />
                <input type="date" required value={manual.renews} onChange={(e) => setManual({ ...manual, renews: e.target.value })} style={{ padding: 10, background: 'var(--graphite)', border: '1px solid var(--mist)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 12 }} />
                <select value={manual.category} onChange={(e) => setManual({ ...manual, category: e.target.value })} style={{ padding: 10, background: 'var(--graphite)', border: '1px solid var(--mist)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 12 }}>
                  <option value="insurance">insurance</option>
                  <option value="subscription">subscription</option>
                  <option value="broadband">broadband</option>
                  <option value="domain">domain</option>
                </select>
                <input placeholder="change (e.g. +22%)" value={manual.change} onChange={(e) => setManual({ ...manual, change: e.target.value })} style={{ padding: 10, background: 'var(--graphite)', border: '1px solid var(--mist)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 12 }} />
                <input placeholder="notes" value={manual.notes} onChange={(e) => setManual({ ...manual, notes: e.target.value })} style={{ padding: 10, background: 'var(--graphite)', border: '1px solid var(--mist)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 12 }} />
              </div>
              <div style={{ marginTop: 12 }}>
                <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'var(--ember)', color: 'var(--obsidian)' }}>add item →</button>
              </div>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, border: '1px solid var(--mist)', background: 'var(--slate)', marginBottom: 16 }}>
          {[['£' + Math.round(annualExposure).toLocaleString(), 'annual exposure'], [String(items.length), 'items tracked'], [String(needAction), 'need action'], ['£' + Math.round(savings).toLocaleString(), 'potential savings']].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', padding: '16px 8px', borderRight: i < 3 ? '1px solid var(--mist)' : 'none' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 24, color: l === 'potential savings' ? 'var(--sage)' : 'var(--paper)' }}>{n}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dust)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['all', 'insurance', 'subscription', 'broadband', 'domain'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', border: `1px solid ${filter === f ? 'var(--ember)' : 'var(--fog)'}`, background: filter === f ? 'var(--ember-soft)' : 'transparent', color: filter === f ? 'var(--ember)' : 'var(--pencil)', fontFamily: 'var(--sans)', fontSize: 11, cursor: 'pointer', borderRadius: 'var(--radius-pill)' }}>{f}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['list', 'digest'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '5px 10px', border: `1px solid ${view === v ? 'var(--ember)' : 'var(--fog)'}`, background: view === v ? 'var(--ember-soft)' : 'transparent', color: view === v ? 'var(--ember)' : 'var(--pencil)', fontSize: 13, cursor: 'pointer', borderRadius: 'var(--radius-pill)' }}>{v}</button>
            ))}
          </div>
        </div>

        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, border: '1px solid var(--mist)', background: 'var(--slate)' }}>
            <div style={{ fontSize: 32 }}>📬</div>
            <h3 style={{ margin: '8px 0' }}>nothing tracked yet.</h3>
            <p style={{ fontSize: 13, color: 'var(--pencil)' }}>paste a renewal email above or add an item manually.</p>
          </div>
        )}

        {view === 'list' && items.length > 0 && (
          <div>
            {filtered.map((it) => (
              <div key={it.id} style={{ border: '1px solid var(--mist)', background: 'var(--slate)', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--body-serif)', fontSize: 14, fontWeight: 500, color: 'var(--paper)' }}>{it.provider}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginTop: 2 }}>{it.amount}/{it.period} · renews {it.renews} · {it.change}</div>
                  </div>
                  <span className={`badge ${it.verdict === 'renew' ? 'badge-renew' : it.verdict === 'cancel' ? 'badge-cancel' : 'badge-renegotiate'}`} style={{ padding: '4px 8px' }}>{it.verdict}</span>
                  <button onClick={() => del(it.id)} style={{ background: 'none', border: '1px solid var(--fog)', color: 'var(--vermilion)', padding: '4px 10px', fontFamily: 'var(--sans)', fontSize: 10, cursor: 'pointer', borderRadius: 'var(--radius-pill)' }}>delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'digest' && items.length > 0 && (
          <div style={{ border: '1px solid var(--mist)', background: 'var(--slate)', padding: 16 }}>
            <p style={{ fontFamily: 'var(--body-serif)', fontSize: 13, color: 'var(--pencil)', marginBottom: 16, fontStyle: 'italic' }}>your weekly renewal roundup. issued monday.</p>
            {['renegotiate', 'cancel', 'renew'].map((v) => {
              const group = items.filter((i) => i.verdict === v);
              if (!group.length) return null;
              return (
                <div key={v} style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: v === 'renegotiate' ? 'var(--ember)' : v === 'cancel' ? 'var(--vermilion)' : 'var(--sage)' }} />
                    {v === 'renegotiate' ? 'needs action' : v === 'cancel' ? 'consider cancelling' : 'all clear'}
                  </div>
                  {group.map((it) => (
                    <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, fontFamily: 'var(--body-serif)', color: 'var(--paper)', borderBottom: '1px solid var(--mist)' }}>
                      <span className={`badge badge-${v}`}>{v}</span>
                      <span>{it.provider}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)', marginLeft: 'auto' }}>{it.amount} · {it.change}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            <button onClick={clearAll} style={{ padding: '6px 14px', border: '1px solid var(--fog)', background: 'transparent', color: 'var(--pencil)', fontFamily: 'var(--sans)', fontSize: 11, cursor: 'pointer', borderRadius: 'var(--radius-pill)' }}>clear all data</button>
          </div>
        )}
      </div>
    </section>
  );
}
