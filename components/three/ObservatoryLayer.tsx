'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ObservatoryScene = dynamic(() => import('./ObservatoryScene'), { ssr: false });

export default function ObservatoryLayer() {
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const mobile = window.innerWidth < 768;
    const ok = !reduced && !touch && !mobile;
    setShow(ok);
    setChecked(true);
    if (ok) document.body.classList.add('has-3d');
  }, []);

  if (!checked) return null;

  if (!show) {
    // reduced-motion / touch / mobile: render nothing — sections use their own subtle backgrounds.
    // a faint css ring sits in the hero via the page.
    return null;
  }

  return (
    <div className="observatory-layer" aria-hidden="true">
      <ObservatoryScene />
    </div>
  );
}
