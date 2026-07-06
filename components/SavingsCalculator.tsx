'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { key: 'insurance', label: '🛡️ insurance', base: 308, pct: 0.22 },
  { key: 'broadband', label: '🌐 broadband', base: 240, pct: 0.5 },
  { key: 'streaming', label: '🎬 streaming', base: 180, pct: 0.6 },
  { key: 'gym', label: '💪 gym', base: 384, pct: 0.7 },
  { key: 'mobile', label: '📱 mobile', base: 540, pct: 0.4 },
  { key: 'domains', label: '🔗 domains', base: 40, pct: 0.1 },
];

export default function SavingsCalculator() {
  const [on, setOn] = useState<Record<string, boolean>>({ insurance: true, broadband: true, streaming: true });
  const [items, setItems] = useState(8);

  const { exposure, savings } = useMemo(() => {
    let exposure = 0;
    let savings = 0;
    CATEGORIES.forEach((c) => {
      if (on[c.key]) {
        exposure += c.base;
        savings += Math.round(c.base * c.pct);
      }
    });
    const scale = items / 8;
    exposure = Math.round(exposure * scale);
    savings = Math.round(savings * scale);
    return { exposure, savings };
  }, [on, items]);

  return (
    <div className="calc-panel">
      <div className="calc-controls">
        {CATEGORIES.map((c) => (
          <button key={c.key} className={`calc-chip${on[c.key] ? ' on' : ''}`} onClick={() => setOn((p) => ({ ...p, [c.key]: !p[c.key] }))}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="calc-slider" style={{ marginTop: 24 }}>
        <label>renewing items you track: {items}</label>
        <input type="range" min={2} max={30} value={items} onChange={(e) => setItems(Number(e.target.value))} />
      </div>
      <div className="calc-result">
        <div className="calc-result-num">£{savings.toLocaleString()}</div>
        <div className="calc-result-lbl">potential yearly savings · est. £{exposure.toLocaleString()} tracked exposure</div>
        <div style={{ marginTop: 28 }}>
          <Link href="/waitlist" className="btn-primary">get your real number &rarr;</Link>
        </div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dust)', marginTop: 14, maxWidth: 460, margin: '14px auto 0' }}>
          estimates based on uk avg loyalty penalties &amp; unused-sub rates. your actual savings depend on your renewals.
        </p>
      </div>
    </div>
  );
}
