'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/problem', label: 'problem' },
  { href: '/how-it-works', label: 'how it works' },
  { href: '/demo', label: 'demo' },
  { href: '/app', label: 'app' },
  { href: '/pricing', label: 'pricing' },
  { href: '/blog', label: 'blog' },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    fetch('/api/waitlist/count', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.count > 0) setCount(d.count); })
      .catch(() => {});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">perch<span>.</span></Link>
          <div className="nav-links">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? 'active' : ''}>{l.label}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/waitlist" className="nav-cta">
              join waitlist{count ? <span className="nav-badge">{count.toLocaleString()}</span> : null}
            </Link>
          </div>
          <button className="nav-hamburger" aria-label="menu" onClick={() => setOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-overlay${open ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        <button className="nav-overlay-close" aria-label="close menu" onClick={() => setOpen(false)}>✕</button>
        <Link href="/problem" onClick={() => setOpen(false)}>problem</Link>
        <Link href="/how-it-works" onClick={() => setOpen(false)}>how it works</Link>
        <Link href="/demo" onClick={() => setOpen(false)}>demo</Link>
        <Link href="/app" onClick={() => setOpen(false)}>app</Link>
        <Link href="/pricing" onClick={() => setOpen(false)}>pricing</Link>
        <Link href="/blog" onClick={() => setOpen(false)}>blog</Link>
        <Link href="/features" onClick={() => setOpen(false)}>features</Link>
        <Link href="/calculator" onClick={() => setOpen(false)}>savings calculator</Link>
        <Link href="/penalty-map" onClick={() => setOpen(false)}>loyalty penalty map</Link>
        <Link href="/waitlist" onClick={() => setOpen(false)}>join waitlist</Link>
      </div>
    </>
  );
}
