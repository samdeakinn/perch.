'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [subbed, setSubbed] = useState(false);
  const [email, setEmail] = useState('');

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Subscriber', email, segment: 'household', source: 'footer' }),
      });
    } catch {}
    setSubbed(true);
  }

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">perch<span>.</span></div>
          <p className="footer-tagline">track what renews. decide what stays.</p>
        </div>
        <div className="footer-col">
          <h4>product</h4>
          <Link href="/app">app</Link>
          <Link href="/demo">demo</Link>
          <Link href="/pricing">pricing</Link>
          <Link href="/features">features</Link>
          <Link href="/roadmap">roadmap</Link>
          <Link href="/changelog">changelog</Link>
        </div>
        <div className="footer-col">
          <h4>learn</h4>
          <Link href="/problem">the problem</Link>
          <Link href="/how-it-works">how it works</Link>
          <Link href="/blog">blog</Link>
          <Link href="/calculator">savings calculator</Link>
          <Link href="/penalty-map">loyalty penalty map</Link>
          <Link href="/about">about</Link>
          <Link href="/privacy">privacy</Link>
          <Link href="/terms">terms</Link>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-body)', margin: '24px auto 0', padding: '0 100px' }}>
        <div style={{ borderTop: '1px solid var(--mist)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: 'var(--dust)' }}>get updates on auto-renewal, loyalty penalties, and perch. launch news.</div>
          {subbed ? (
            <div style={{ fontSize: 12, color: 'var(--ember)' }}>you're subscribed.</div>
          ) : (
            <form className="footer-sub" onSubmit={subscribe}>
              <input type="email" placeholder="you@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit">subscribe</button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-bottom-text">© 2026 perch. · <Link href="/privacy" style={{ color: 'inherit' }}>privacy</Link> · <Link href="/terms" style={{ color: 'inherit' }}>terms</Link> · <Link href="/contact" style={{ color: 'inherit' }}>contact</Link></span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="https://x.com/perch_app" target="_blank" rel="noopener" style={{ fontSize: 11, color: 'var(--dust)' }}>x</a>
        </div>
      </div>

      <button className="back-to-top" id="backToTop" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
      <div className="cursor-dot" id="cursorDot"></div>
    </footer>
  );
}
