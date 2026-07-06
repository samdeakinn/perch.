'use client';

import { useEffect } from 'react';

export default function ClientFX() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // scroll progress → --scroll-pct
    let ticking = false;
    const updateScroll = () => {
      const h = document.documentElement;
      const st = h.scrollTop || document.body.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? Math.min(st / max, 1) : 0;
      document.documentElement.style.setProperty('--scroll-pct', String(pct));
      const back = document.getElementById('backToTop');
      if (back) back.classList.toggle('visible', st > 500);
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(() => { updateScroll(); ticking = false; }); ticking = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    // gravitational reveals
    if (!prefersReduced) {
      const fades = document.querySelectorAll('.grav-fade');
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      fades.forEach((el, i) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;
        if (visible) (el as HTMLElement).classList.add('in');
        else io.observe(el);
      });
    } else {
      document.querySelectorAll('.grav-fade').forEach((el) => el.classList.add('in'));
    }

    // cursor dot (desktop, non-touch, non-reduced)
    if (!isTouch && !prefersReduced) {
      const dot = document.getElementById('cursorDot');
      if (dot) {
        let mx = -100, my = -100, cx = -100, cy = -100;
        document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
        document.querySelectorAll('a, button, input, textarea, .card, .calc-chip, .map-node').forEach((el) => {
          el.addEventListener('mouseenter', () => dot.classList.add('cursor-dot-hover'));
          el.addEventListener('mouseleave', () => dot.classList.remove('cursor-dot-hover'));
        });
        const drift = () => {
          cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
          dot.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
          dot.classList.add('cursor-dot-visible');
          requestAnimationFrame(drift);
        };
        drift();
      }
    }

    // magnetic buttons (desktop)
    if (!isTouch && !prefersReduced) {
      document.querySelectorAll('.btn-primary, .nav-cta').forEach((btn) => {
        const el = btn as HTMLElement;
        el.addEventListener('mousemove', (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
          el.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translate(0,0)';
          el.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
        });
      });
    }

    // faq toggles (delegated)
    document.querySelectorAll('.faq-item').forEach((item) => {
      item.addEventListener('click', () => item.classList.toggle('open'));
    });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
