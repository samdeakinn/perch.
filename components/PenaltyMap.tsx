'use client';

import { useState } from 'react';

type Node = { x: number; y: number; region: string; cat: string; pct: number; cost: string };

const NODES: Node[] = [
  { x: 220, y: 70, region: 'scotland', cat: 'home insurance', pct: 28, cost: '£312/yr' },
  { x: 250, y: 120, region: 'ne england', cat: 'car insurance', pct: 19, cost: '£74/yr' },
  { x: 200, y: 165, region: 'n ireland', cat: 'broadband', pct: 41, cost: '£216/yr' },
  { x: 250, y: 175, region: 'yorks & humber', cat: 'mobile', pct: 34, cost: '£388/yr' },
  { x: 190, y: 215, region: 'wales', cat: 'broadband', pct: 38, cost: '£204/yr' },
  { x: 255, y: 220, region: 'midlands', cat: 'pet insurance', pct: 26, cost: '£148/yr' },
  { x: 285, y: 265, region: 'london & se', cat: 'subscriptions', pct: 22, cost: '£312/yr' },
  { x: 230, y: 275, region: 'sw england', cat: 'car insurance', pct: 17, cost: '£68/yr' },
];

export default function PenaltyMap() {
  const [tip, setTip] = useState<{ x: number; y: number; n: Node } | null>(null);

  return (
    <div className="map-panel">
      <div className="map-svg-wrap">
        <svg viewBox="0 0 420 360" style={{ width: '100%', height: 'auto' }} role="img" aria-label="uk loyalty penalty map">
          {/* stylized uk silhouette */}
          <path
            d="M180 40 C 210 30 245 35 270 55 C 295 75 300 110 290 140 C 285 160 295 180 300 210 C 305 240 295 275 280 300 C 265 320 240 330 215 325 C 200 320 185 305 175 285 C 165 260 155 245 160 220 C 165 195 150 175 145 150 C 142 130 150 110 165 90 C 170 75 175 55 180 40 Z"
            fill="rgba(201,138,58,0.04)"
            stroke="rgba(201,138,58,0.25)"
            strokeWidth="1"
          />
          {/* subtle inner lines */}
          <path d="M150 150 C 180 160 220 155 260 165" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <path d="M170 220 C 210 215 250 225 285 235" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

          {NODES.map((n, i) => (
            <g key={i} className="map-node" onMouseEnter={() => setTip({ x: n.x, y: n.y, n })} onMouseLeave={() => setTip(null)}>
              <circle cx={n.x} cy={n.y} r={3} fill="#c98a3a" />
              <circle cx={n.x} cy={n.y} r={8 + n.pct * 0.3} fill="none" stroke="#c98a3a" strokeOpacity={0.3} strokeWidth={1} />
              <circle cx={n.x} cy={n.y} r={8 + n.pct * 0.3} fill="#c98a3a" fillOpacity={0.06} />
            </g>
          ))}
        </svg>

        {tip && (
          <div
            className="map-tooltip on"
            style={{ left: (tip.x / 420) * 100 + '%', top: (tip.y / 360) * 100 + '%', transform: 'translate(-50%, -120%)' }}
          >
            <div style={{ color: 'var(--ember)', marginBottom: 4 }}>{tip.n.region}</div>
            <div>{tip.n.cat} · +{tip.n.pct}% avg · {tip.n.cost}</div>
          </div>
        )}
      </div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginTop: 18, textAlign: 'center' }}>
        glowing nodes = avg auto-renewal overcharge by region. hover for the category breakdown.
      </p>
    </div>
  );
}
