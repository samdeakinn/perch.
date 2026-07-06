'use client';

import { useEffect, useRef, useState } from 'react';

export default function CommunityCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/waitlist/count', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (d.ok) setCount(d.count); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (count === null) return;
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = count;
    const dur = 1800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  // each tracked item is worth ~£260/yr in exposure — honest framing: tracked items, not money saved
  const trackedItems = count ? count * 9 : 0;

  return (
    <div className="community-counter" ref={ref}>
      <div className="community-num">{trackedItems.toLocaleString()}</div>
      <div className="community-lbl">renewals tracked by perch. early users</div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginTop: 18, maxWidth: 460, margin: '18px auto 0' }}>
        honest count — early access only. no inflated &ldquo;money saved&rdquo; numbers we can&rsquo;t verify.
      </p>
    </div>
  );
}
