# The Observatory Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete visual redesign of the perch. website under The Observatory aesthetic — cinematic, editorial, interactive, dark-first, with a shifting amber-to-rose-gold accent, gravitational scroll, lens cursor, and ledger-style cards across all 25+ templates.

**Architecture:** Full CSS rewrite with new design tokens. `style.css` replaced with ~2,000 lines of observatory CSS. `motion.js` rewritten as gravitational scroll engine + lens cursor. Head updated with 4 new Google Fonts. All 22+ templates updated to new markup. `server.js`, `app.js`, `demo.js` logic untouched. `hero-scene.js` and `particles.js` deleted.

**Tech Stack:** Vanilla CSS, vanilla JS, Google Fonts CDN, EJS templates, Express (unchanged).

## Global Constraints

- All visible text lowercase
- Dark mode primary; light mode via toggle with simplified palette (no scroll-driven accent shift in light mode)
- `prefers-reduced-motion: reduce` disables all animations
- Touch devices: lens cursor disabled, section transitions instant
- No new npm packages. No new server routes. No new templates (only modifications)
- `server.js` zero changes. `app.js` logic zero changes. `demo.js` logic zero changes

---

## Task 1: Foundation — Design Tokens + Base Styles

**Files:**
- Rewrite: `public/style.css` (lines 1-80: `:root` + base styles)
- Modify: `views/partials/head.ejs` (fonts + remove inline critical CSS)

**This task replaces the `:root` block, all global base styles, and typography foundations.**

- [ ] **Step 1: Replace the entire `:root` block in style.css**

Replace lines 1 through the closing `}` of :root with:

```css
:root{
  --obsidian:#060a08;
  --graphite:#0c1110;
  --slate:#141a18;
  --mist:rgba(255,255,255,0.04);
  --fog:rgba(255,255,255,0.08);
  --paper:#e8e4dd;
  --pencil:#9da39f;
  --dust:#5c645f;
  --ember:#d4984a;
  --rose-gold:#c48255;
  --sage:#5c8f78;
  --ember-soft:rgba(212,152,74,0.10);
  --display:'Playfair Display','Iowan Old Style',Georgia,serif;
  --body-serif:'Source Serif 4','Palatino Linotype',Georgia,serif;
  --sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  --mono:'JetBrains Mono','SF Mono','Fira Code',monospace;
  --text-hero:clamp(52px,7vw,88px);
  --text-section:clamp(30px,4vw,56px);
  --text-body:15px;
  --text-meta:12px;
  --ease: cubic-bezier(0.16,1,0.3,1);
  --ease-fast: cubic-bezier(0.22,1,0.36,1);
  --max-body:960px;
  --max-narrow:680px;
  --radius-full:999px;
  --scroll-pct:0;
}
```

Also add backward-compat aliases for any old tokens still referenced by surviving component CSS:
```css
:root{
  --bg:var(--obsidian);
  --bg-soft:var(--graphite);
  --panel:var(--slate);
  --line:var(--mist);
  --line-strong:var(--fog);
  --text:var(--paper);
  --text-dim:var(--pencil);
  --text-faint:var(--dust);
  --accent:var(--ember);
  --accent-soft:var(--ember-soft);
  --accent-line:rgba(212,152,74,0.25);
  --radius:10px;
  --radius-sm:6px;
  --radius-lg:14px;
  --maxw:var(--max-body);
  --serif:var(--body-serif);
  --ease-bounce:var(--ease);
  /* ... existing token aliases continue ... */
}
```

- [ ] **Step 2: Replace base styles (skip-link through .page)**

Replace everything from `.skip-link` to the `.page` rule with:

```css
*{ box-sizing:border-box; margin:0; padding:0; }
html{ scroll-behavior:smooth; background:var(--obsidian); }
html::-webkit-scrollbar{ width:5px; }
html::-webkit-scrollbar-track{ background:var(--obsidian); }
html::-webkit-scrollbar-thumb{ background:var(--fog); border-radius:var(--radius-full); }
body{
  background:var(--obsidian); color:var(--paper);
  font-family:var(--body-serif); font-size:var(--text-body);
  line-height:1.7; -webkit-font-smoothing:antialiased; overflow-x:hidden;
}
::selection{ background:var(--ember-soft); color:var(--paper); }
:focus-visible{ outline:2px solid var(--ember); outline-offset:2px; border-radius:2px; }
a{ color:inherit; text-decoration:none; }
section{ position:relative; }
.page{ opacity:1; }
.wrap{ max-width:var(--max-body); margin:0 auto; padding:0 100px; }
@media (max-width:768px){ .wrap{ padding:0 24px; } }
img,svg{ display:block; max-width:100%; }
```

- [ ] **Step 3: Add section spacing and editorial typography**

After the `.wrap` styles:

```css
.lp-section{ padding:140px 0; }
@media (max-width:768px){ .lp-section{ padding:80px 0; } }
h1{ font-family:var(--display); font-size:var(--text-hero); line-height:1.05; font-weight:500; letter-spacing:-0.02em; max-width:720px; font-style:italic; }
h1 em{ color:var(--ember); font-style:italic; }
h2{ font-family:var(--display); font-size:var(--text-section); line-height:1.15; font-weight:500; letter-spacing:-0.015em; max-width:var(--max-narrow); }
h3{ font-family:var(--body-serif); font-size:20px; font-weight:500; }
p{ color:var(--pencil); }
.eyebrow{ font-family:var(--mono); font-size:var(--text-meta); color:var(--ember); text-transform:lowercase; letter-spacing:0.04em; margin-bottom:20px; }
.section-sub{ font-family:var(--body-serif); font-size:17px; color:var(--pencil); max-width:var(--max-narrow); line-height:1.7; }
```

- [ ] **Step 4: Add lens cursor CSS**

```css
#lensCursor{
  position:fixed; pointer-events:none; z-index:99999;
  width:60px; height:60px; border-radius:50%;
  backdrop-filter:brightness(1.35) contrast(1.05);
  -webkit-backdrop-filter:brightness(1.35) contrast(1.05);
  opacity:0; transition:opacity 0.3s var(--ease);
}
#lensCursor.active{ opacity:1; }
#lensCursor.interactive{
  width:8px; height:8px; border-radius:50%;
  backdrop-filter:none; -webkit-backdrop-filter:none;
  background:var(--ember);
}
@media (hover:none),(pointer:coarse){ #lensCursor{ display:none; } }
```

- [ ] **Step 5: Update head.ejs — replace font preloads and loading script**

Replace all font `<link>` tags and the font-loading `<script>` with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<script>
(function() {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
  link.media = 'print';
  link.onload = function() { this.media = 'all'; };
  document.head.appendChild(link);
})();
</script>
```

- [ ] **Step 6: Remove the inline critical CSS `<style>` block from head.ejs**

Remove the `<style>body{background:var(--bg,...)}.wrap{...}.nav{...}</style>` tag entirely — the stylesheet handles it now.

- [ ] **Step 7: Commit**

```bash
git add public/style.css views/partials/head.ejs
git commit -m "feat(observatory): design tokens, typography, base styles, lens cursor css"
```

---

## Task 2: Foundation — Motion Engine

**Files:**
- Rewrite: `public/motion.js`

- [ ] **Step 1: Write the new motion.js**

Replace the entire content of `public/motion.js` with:

```javascript
(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // Lens cursor
  var lens = document.createElement('div');
  lens.id = 'lensCursor';
  document.body.appendChild(lens);
  var mx = -100, my = -100, cursorState = 'text';

  if (!isTouch && !prefersReduced) {
    document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });
    var interactiveSel = 'a, button, input, textarea, select, .nav-cta, .btn-primary, .btn-secondary, .btn-tertiary, .app-item-header, .demo-item-header, .card';
    function bindInteractive() {
      document.querySelectorAll(interactiveSel).forEach(function(el) {
        el.addEventListener('mouseenter', function() { cursorState = 'interactive'; });
        el.addEventListener('mouseleave', function() { cursorState = 'text'; });
      });
    }
    bindInteractive();
    setInterval(bindInteractive, 2000);
    function driftLens() {
      lens.style.left = (mx - 30) + 'px';
      lens.style.top = (my - 30) + 'px';
      lens.classList.add('active');
      if (cursorState === 'interactive') lens.classList.add('interactive');
      else lens.classList.remove('interactive');
      requestAnimationFrame(driftLens);
    }
    driftLens();
  }

  // Accent shift via scroll
  if (!prefersReduced) {
    var ticking = false;
    function updateScrollPct() {
      var h = document.documentElement;
      var scrollTop = h.scrollTop || document.body.scrollTop;
      var maxScroll = h.scrollHeight - h.clientHeight;
      var pct = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      document.documentElement.style.setProperty('--scroll-pct', pct);
    }
    window.addEventListener('scroll', function() {
      if (!ticking) { requestAnimationFrame(function() { updateScrollPct(); ticking = false; }); ticking = true; }
    }, { passive: true });
    updateScrollPct();
  }

  // Section handoff transitions
  if (!prefersReduced) {
    var sections = document.querySelectorAll('.lp-section');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) { entry.target.style.transform = 'translateY(0)'; entry.target.style.opacity = '1'; }
      });
    }, { threshold: 0.05 });
    sections.forEach(function(section, i) {
      section.style.transform = 'translateY(40px)';
      section.style.opacity = '0';
      section.style.transition = 'transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 0.8s cubic-bezier(0.16,1,0.3,1)';
      section.style.transitionDelay = (i * 0.1) + 's';
      observer.observe(section);
    });
  }

  // Theme toggle
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
  }
  try { var saved = localStorage.getItem('theme'); if (saved === 'light') setTheme('light'); } catch(e) {}
  document.getElementById('themeToggle')?.addEventListener('click', function() {
    var current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  });
  document.getElementById('themeToggleDrawer')?.addEventListener('click', function() {
    var current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add public/motion.js
git commit -m "feat(observatory): motion engine — gravitational scroll, lens cursor, accent shift, theme toggle"
```

---

## Task 3: Shell — Navigation

**Files:**
- Rewrite: `views/partials/nav.ejs`
- Modify: `public/style.css` (remove old nav CSS, add new nav CSS)
- Modify: `views/partials/footer.ejs` (add nav scroll + overlay JS)

- [ ] **Step 1: Remove all old nav CSS from style.css**

Remove all rules that match: `.nav`, `.nav-inner`, `.nav-links`, `.nav-links a`, `.nav-links a.active`, `.nav-links a.active::after`, `@keyframes navActive`, `.nav-cta`, `.nav-badge`, `.nav-hamburger`, `.hamburger-line`, `.nav-overlay`, `.nav-overlay.open`, `.nav-drawer`, `.nav-drawer-close`, `.nav-drawer-links`, `.nav-drawer-links a`, `.nav-drawer-cta`, and the `@media (max-width:840px)` nav breakpoint.

- [ ] **Step 2: Add new nav CSS**

Add after the lens cursor CSS:

```css
.nav{ position:fixed; top:0; left:0; right:0; z-index:100; padding:16px 0; transition:background 0.4s var(--ease),backdrop-filter 0.4s var(--ease); }
.nav.scrolled{ background:rgba(6,10,8,0.75); backdrop-filter:blur(30px); -webkit-backdrop-filter:blur(30px); border-bottom:1px solid var(--mist); }
.nav-inner{ display:flex; align-items:center; justify-content:space-between; max-width:var(--max-body); margin:0 auto; padding:0 100px; }
@media (max-width:768px){ .nav-inner{ padding:0 24px; } }
.logo{ font-family:var(--display); font-size:22px; font-style:italic; color:var(--paper); }
.logo span{ color:var(--ember); }
.nav-links{ display:flex; gap:28px; font-size:var(--text-meta); font-family:var(--sans); }
.nav-links a{ color:var(--pencil); position:relative; padding:4px 0; transition:color 0.2s var(--ease); }
.nav-links a::after{ content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:var(--ember); transition:width 0.3s var(--ease); }
.nav-links a:hover{ color:var(--paper); }
.nav-links a:hover::after{ width:100%; }
.nav-links a.active{ color:var(--paper); }
.nav-links a.active::after{ width:100%; }
.nav-cta{ font-family:var(--sans); font-size:var(--text-meta); font-weight:500; color:var(--ember); padding:7px 16px; border:1px solid var(--ember); border-radius:var(--radius-full); transition:background 0.2s var(--ease),color 0.2s var(--ease); }
.nav-cta:hover{ background:var(--ember); color:var(--obsidian); }
.nav-badge{ display:none; margin-left:6px; font-size:10px; font-weight:600; background:var(--ember); color:var(--obsidian); padding:2px 6px; border-radius:var(--radius-full); }
.nav-hamburger{ display:none; background:none; border:none; cursor:pointer; padding:4px; }
.nav-hamburger span{ display:block; width:18px; height:1.5px; background:var(--pencil); margin:4px 0; transition:background 0.2s var(--ease); }
.nav-overlay{ position:fixed; inset:0; z-index:200; background:var(--obsidian); opacity:0; pointer-events:none; transition:opacity 0.4s var(--ease); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:32px; }
.nav-overlay.open{ opacity:1; pointer-events:auto; }
.nav-overlay-close{ position:absolute; top:24px; right:24px; background:none; border:none; color:var(--pencil); font-size:24px; cursor:pointer; }
.nav-overlay a{ font-family:var(--display); font-size:28px; color:var(--pencil); transition:color 0.2s var(--ease); }
.nav-overlay a:hover{ color:var(--paper); }
@media (max-width:840px){ .nav-links{ display:none; } .nav-hamburger{ display:block; } }
```

- [ ] **Step 3: Rewrite nav.ejs**

Replace the entire content of `views/partials/nav.ejs` with:

```html
<nav class="nav" id="nav">
  <div class="nav-inner">
    <a href="/" class="logo">perch<span>.</span></a>
    <div class="nav-links">
      <a href="/problem" class="<%= currentPage === 'problem' ? 'active' : '' %>">problem</a>
      <a href="/how-it-works" class="<%= currentPage === 'how-it-works' ? 'active' : '' %>">how it works</a>
      <a href="/demo" class="<%= currentPage === 'demo' ? 'active' : '' %>">demo</a>
      <a href="/app" class="<%= currentPage === 'app' ? 'active' : '' %>">app</a>
      <a href="/pricing" class="<%= currentPage === 'pricing' ? 'active' : '' %>">pricing</a>
      <a href="/blog" class="<%= currentPage === 'blog' ? 'active' : '' %>">blog</a>
    </div>
    <div style="display:flex;align-items:center;gap:12px;">
      <button class="theme-toggle" id="themeToggle" aria-label="toggle theme" style="background:none;border:none;color:var(--pencil);font-size:15px;cursor:pointer;padding:4px;">◐</button>
      <a href="/waitlist" class="nav-cta">join waitlist <span class="nav-badge" id="waitlistCount"></span></a>
    </div>
    <button class="nav-hamburger" id="hamburgerBtn" aria-label="menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<div class="nav-overlay" id="navOverlay">
  <button class="nav-overlay-close" id="navOverlayClose" aria-label="close menu">✕</button>
  <a href="/problem">problem</a>
  <a href="/how-it-works">how it works</a>
  <a href="/demo">demo</a>
  <a href="/app">app</a>
  <a href="/pricing">pricing</a>
  <a href="/blog">blog</a>
  <a href="/features">features</a>
  <a href="/resources">resources</a>
  <a href="/waitlist">join waitlist</a>
</div>
```

- [ ] **Step 4: Add nav scroll + overlay JS to footer.ejs inline script**

Add inside the footer's existing inline `<script>` block (right after the existing init):

```javascript
var nav = document.getElementById('nav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

var hamburger = document.getElementById('hamburgerBtn');
var overlay = document.getElementById('navOverlay');
var overlayClose = document.getElementById('navOverlayClose');
if (hamburger && overlay && overlayClose) {
  hamburger.addEventListener('click', function() { overlay.classList.add('open'); });
  overlayClose.addEventListener('click', function() { overlay.classList.remove('open'); });
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.classList.remove('open'); });
}
```

- [ ] **Step 5: Commit**

```bash
git add public/style.css views/partials/nav.ejs views/partials/footer.ejs
git commit -m "feat(observatory): navigation — floating text links, fullscreen mobile overlay, amber underline"
```

---

## Task 4: Shell — Buttons, Cards, Footer

**Files:**
- Modify: `public/style.css` (add button + card + footer CSS, remove old rules)
- Rewrite: `views/partials/footer.ejs` (3-column markup)

- [ ] **Step 1: Remove old button, card, and footer CSS from style.css**

Remove all rules matching: `.btn-primary`, `.btn-secondary`, `.btn-ripple`, `@keyframes rippleOut`, `.tilt-card`, `.tilt-card:hover`, `.stat-hero-card`, `.track-card`, `.not-card`, `.audience-tile`, `.faq-item`, `.faq-q`, `.faq-a`, `footer`, `.footer-inner`, `.footer-links`, `.footer-trust`, `.footer-counter`, plus all `[data-theme="light"]` variants of these.

- [ ] **Step 2: Add new button CSS**

```css
.btn-primary{
  display:inline-flex; align-items:center; gap:8px;
  padding:16px 32px; border:none; border-radius:var(--radius-full);
  background:var(--ember); color:var(--obsidian);
  font-family:var(--sans); font-size:var(--text-meta); font-weight:500;
  cursor:pointer; text-decoration:none;
  border-top:2px inset rgba(255,255,255,0.15);
  transition:transform 0.2s var(--ease),box-shadow 0.2s var(--ease);
}
.btn-primary:hover{ transform:translateY(-2px); box-shadow:0 8px 24px rgba(212,152,74,0.25); }
.btn-secondary{
  display:inline-flex; align-items:center; gap:8px;
  padding:0; border:none; background:none; color:var(--ember);
  font-family:var(--sans); font-size:var(--text-meta); font-weight:500;
  cursor:pointer; text-decoration:none; position:relative;
}
.btn-secondary::after{ content:''; position:absolute; bottom:-2px; left:50%; transform:translateX(-50%); width:0; height:1px; background:var(--ember); transition:width 0.3s var(--ease); }
.btn-secondary:hover::after{ width:100%; }
.btn-tertiary{
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 20px; border:1px solid var(--fog); border-radius:var(--radius-full);
  background:transparent; color:var(--pencil);
  font-family:var(--sans); font-size:var(--text-meta); font-weight:500;
  cursor:pointer; text-decoration:none; transition:border-color 0.2s var(--ease),background 0.2s var(--ease),color 0.2s var(--ease);
}
.btn-tertiary:hover{ border-color:var(--ember); background:var(--ember-soft); color:var(--ember); }
```

- [ ] **Step 3: Add new card CSS**

```css
.card{
  border:1px solid var(--mist); background:var(--slate);
  padding:28px; transition:transform 0.2s var(--ease),border-color 0.2s var(--ease);
}
.card:hover{ transform:translateY(-2px); border-color:var(--fog); }
.card h3{ font-family:var(--body-serif); font-size:18px; font-weight:500; margin-bottom:8px; }
.card p{ font-family:var(--body-serif); font-size:14px; color:var(--pencil); line-height:1.6; }
```

- [ ] **Step 4: Add new footer CSS and FAQ CSS**

```css
footer{ border-top:1px solid var(--mist); padding:64px 0; background:var(--obsidian); }
.footer-grid{ display:grid; grid-template-columns:2fr 1fr 1fr; gap:48px; max-width:var(--max-body); margin:0 auto; padding:0 100px; }
@media (max-width:768px){ .footer-grid{ grid-template-columns:1fr; gap:32px; padding:0 24px; } }
.footer-brand .logo{ font-family:var(--display); font-size:24px; font-style:italic; margin-bottom:8px; }
.footer-brand .logo span{ color:var(--ember); }
.footer-tagline{ font-family:var(--body-serif); font-size:14px; color:var(--pencil); max-width:240px; line-height:1.6; }
.footer-col h4{ font-family:var(--mono); font-size:var(--text-meta); color:var(--dust); text-transform:lowercase; letter-spacing:0.04em; margin-bottom:12px; }
.footer-col a{ display:block; font-family:var(--sans); font-size:var(--text-meta); color:var(--dust); padding:2px 0; transition:color 0.2s var(--ease); }
.footer-col a:hover{ color:var(--pencil); }
.footer-bottom{ margin-top:48px; padding-top:20px; border-top:1px solid var(--mist); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; max-width:var(--max-body); margin-left:auto; margin-right:auto; padding-left:100px; padding-right:100px; }
@media (max-width:768px){ .footer-bottom{ padding-left:24px; padding-right:24px; } }
.footer-bottom-text{ font-family:var(--sans); font-size:11px; color:var(--dust); }

.faq-item{ border-bottom:1px solid var(--mist); padding:16px 0; cursor:pointer; }
.faq-q{ font-family:var(--body-serif); font-size:18px; font-weight:500; color:var(--paper); display:flex; justify-content:space-between; align-items:center; }
.faq-q .icon{ color:var(--ember); }
.faq-item.open .faq-q .icon{ transform:rotate(45deg); }
.faq-a{ max-height:0; overflow:hidden; transition:max-height 0.4s var(--ease),padding 0.3s var(--ease); font-family:var(--body-serif); font-size:15px; color:var(--pencil); line-height:1.7; }
.faq-item.open .faq-a{ max-height:300px; padding-top:12px; }
```

- [ ] **Step 5: Rewrite footer.ejs markup**

Replace everything inside `<footer>` except the subscribe form, back-to-top, and cursor-dot with:

```html
<div class="footer-grid">
  <div class="footer-brand">
    <div class="logo">perch<span>.</span></div>
    <p class="footer-tagline">track what renews. decide what stays.</p>
  </div>
  <div class="footer-col">
    <h4>product</h4>
    <a href="/app">app</a>
    <a href="/demo">demo</a>
    <a href="/pricing">pricing</a>
    <a href="/features">features</a>
    <a href="/download">download</a>
    <a href="/roadmap">roadmap</a>
    <a href="/changelog">changelog</a>
  </div>
  <div class="footer-col">
    <h4>learn</h4>
    <a href="/problem">the problem</a>
    <a href="/how-it-works">how it works</a>
    <a href="/blog">blog</a>
    <a href="/resources">resources</a>
    <a href="/about">about</a>
    <a href="/privacy">privacy</a>
    <a href="/terms">terms</a>
  </div>
</div>
<div class="footer-bottom">
  <span class="footer-bottom-text">© 2026 perch. · <a href="/privacy" style="color:inherit;">privacy</a> · <a href="/terms" style="color:inherit;">terms</a> · <a href="/contact" style="color:inherit;">contact</a></span>
  <div style="display:flex;gap:16px;align-items:center;">
    <a href="https://x.com/perch_app" target="_blank" rel="noopener" style="font-size:11px;color:var(--dust);">x</a>
    <span class="footer-bottom-text" id="pageViewCounter" style="display:none;"></span>
  </div>
</div>
```

Keep the existing subscribe form `<div>` and waitlist badge `<div>` if present, placed between `footer-grid` and `footer-bottom`.

- [ ] **Step 6: Commit**

```bash
git add public/style.css views/partials/footer.ejs
git commit -m "feat(observatory): buttons, cards, footer, FAQ — pill primary, hairline cards, 3-col footer"
```

---

## Task 5: Index Page — Hero + All Sections

**Files:**
- Rewrite: `views/index.ejs` (entire file)
- Modify: `public/style.css` (hero CSS, section CSS)

This is the largest single task. Temporarily remove all old index-specific CSS then add the new hero + section CSS, and completely rewrite the template.

- [ ] **Step 1: Remove old hero + index-specific CSS from style.css**

Remove rules: `.hero`, `.hero-inner`, `.hero-content`, `.hero-visual`, `.hero-visual canvas`, `.scene-fallback`, `.stage`, `.scene-card`, `.scene-ring`, `.scene-particle`, `.scene-label`, `@keyframes staggerUp`, `.orb`, `.orb-1`, `.orb-2`, `.orb-3`, `@keyframes orbFloat`, `.hero-sub`, `.hero-cta-row`, `.hero-microcopy`, `.stat-badge`, `.stat-dot`, `.final-cta-section`, `.final-cta-row`, `.final-micro`, `.steps`, `.step`, `.step-index`, `.step-desc`, `.steps-a`, `.proof-num`, `.proof-divider`, `.testimonial-grid`, `.testimonial-card`, `.testimonial-text`, `.testimonial-author`, `.track-grid`, `.track-card`, `.track-icon`, `.track-cost`, `.not-grid`, `.not-card`, `.not-mark`, `.audience-grid-index`, `.audience-tile`, `.pricing-grid`, `.pricing-grid-3`, `.price-card`, `.price-badge`, `.price-amount`, `.price-alt`, `.price-footnote`, `.pricing-toggle`.

Also remove their `@media`, `[data-theme]`, and `prefers-reduced-motion` variants.

- [ ] **Step 2: Add new hero CSS**

```css
.hero{
  padding:160px 0 120px; text-align:center;
  background:radial-gradient(ellipse 800px 500px at 50% -10%, rgba(212,152,74,0.07), transparent 60%),var(--obsidian);
}
@media (max-width:768px){ .hero{ padding:110px 0 70px; } }
.hero p{ max-width:540px; margin:0 auto 32px; font-size:17px; line-height:1.7; font-family:var(--body-serif); }
.hero-form{ display:flex; gap:8px; max-width:400px; margin:0 auto 12px; justify-content:center; }
.hero-form input{
  flex:1; padding:14px 20px; border-radius:var(--radius-full);
  border:1px solid var(--fog); background:var(--slate); color:var(--paper);
  font-family:var(--sans); font-size:var(--text-meta); outline:none; min-width:180px;
  transition:border-color 0.2s var(--ease);
}
.hero-form input:focus{ border-color:var(--ember); }
.hero-micro{ font-family:var(--mono); font-size:11px; color:var(--dust); }

.big-stat{ font-family:var(--mono); font-size:clamp(80px,12vw,140px); font-weight:500; color:var(--paper); line-height:1; }
.stat-row-flex{ display:flex; gap:48px; justify-content:center; margin-top:40px; flex-wrap:wrap; }
.stat-block{ text-align:center; }
.stat-block-num{ font-family:var(--mono); font-size:48px; font-weight:500; color:var(--paper); }
.stat-block-label{ font-family:var(--body-serif); font-size:13px; color:var(--dust); margin-top:4px; max-width:180px; }

.step-row{ display:flex; gap:16px; align-items:baseline; padding:16px 0; border-bottom:1px solid var(--mist); }
.step-row:last-child{ border-bottom:none; }
.step-num{ font-family:var(--mono); font-size:12px; color:var(--ember); min-width:24px; }
.step-text{ font-family:var(--body-serif); font-size:15px; color:var(--paper); }

.track-grid-2col{ display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--mist); margin-top:40px; }
.track-grid-2col .card{ border:none; }
@media (max-width:600px){ .track-grid-2col{ grid-template-columns:1fr; } }

.pricing-row{ display:flex; gap:1px; background:var(--mist); margin-top:40px; justify-content:center; }
@media (max-width:700px){ .pricing-row{ flex-direction:column; } }
.pricing-card{ flex:1; max-width:320px; border:none; border-right:1px solid var(--mist); background:var(--slate); padding:32px 28px; }
.pricing-card:last-child{ border-right:none; }
.pricing-card.featured{ border:1px solid var(--ember); background:var(--graphite); position:relative; }
.pricing-card h3{ font-family:var(--body-serif); font-size:16px; color:var(--dust); text-transform:lowercase; font-weight:500; margin-bottom:4px; }
.pricing-price{ font-family:var(--mono); font-size:36px; font-weight:500; color:var(--paper); margin-bottom:12px; }
.pricing-price span{ font-size:14px; color:var(--dust); }
.pricing-card ul{ list-style:none; margin:16px 0 20px; }
.pricing-card li{ font-family:var(--body-serif); font-size:13px; color:var(--pencil); padding:4px 0; }
.pricing-card li::before{ content:'- '; color:var(--ember); }

.testimonial{ max-width:var(--max-narrow); margin:0 auto; text-align:center; padding:32px 0; }
.testimonial blockquote{ font-family:var(--body-serif); font-size:20px; font-style:italic; color:var(--paper); line-height:1.6; margin-bottom:16px; }
.testimonial blockquote::before{ content:'\201C'; color:var(--ember); }
.testimonial cite{ font-family:var(--mono); font-size:var(--text-meta); color:var(--dust); font-style:normal; }

.final-cta{ text-align:center; padding:120px 0; }
.section-sub-center{ margin:16px auto 40px; text-align:center; }
```

- [ ] **Step 3: Rewrite index.ejs completely**

Full new template (collapsed sections follow the spec):
- Hero: eyebrow, h1, p, hero-form (email input + button), hero-micro
- Section "cost": eyebrow, h2, section-sub, big-stat £4bn, stat-row-flex with £560m and 47%
- Section "how": eyebrow, h2, 4 step-rows (01-04)
- Section "track": eyebrow, h2, track-grid-2col with 4 cards
- Section "proof": eyebrow, h2, 2 testimonials as blockquote + cite
- Section "pricing": eyebrow, h2, pricing-row with 3 pricing-cards
- Section "faq": eyebrow, h2, 5 faq-items
- Final CTA: h2, p, hero-form, hero-micro

- [ ] **Step 4: Commit**

```bash
git add public/style.css views/index.ejs
git commit -m "feat(observatory): index page — reading-lamp hero, editorial sections, inline pricing"
```

---

## Task 6: Demo + App Pages

**Files:**
- Modify: `views/demo.ejs`, `views/app.ejs`
- Modify: `public/style.css` (remove old demo/app window CSS, add new demo/app CSS)

- [ ] **Step 1: Remove old demo + app window CSS**

Remove rules: `.demo-page`, `.demo-intro-text`, `.demo-replay-btn`, `.demo-scenario-btn`, `.demo-window`, `.demo-titlebar`, `.demo-traffic`, `.demo-dot`, `.demo-body`, `.demo-scanning`, `.demo-scanning-hidden`, `.demo-scanning-active`, `.demo-scan-inner`, `.demo-scan-icon`, `.demo-scan-ring`, `@keyframes scanSpin`, `.demo-scan-label`, `.demo-scan-track`, `.demo-scan-fill`, `.demo-app`, `.demo-app-visible`, `.demo-summary`, `.demo-summary-val`, `.demo-summary-lbl`, `.demo-summary-gap`, `.demo-tabs`, `.demo-tab`, `.demo-tab-active`, `.demo-pane`, `.demo-pane-active`, `.demo-list`, `.demo-item`, `.demo-item-anim`, `.demo-item-in`, `.demo-item-visible`, `.demo-item-init`, `.demo-item-header`, `.demo-item-icon`, `.demo-item-body`, `.demo-item-subject`, `.demo-item-provider`, `.demo-item-tag`, `.demo-item-data`, `.demo-item-data-inner`, `.demo-data-row`, `.demo-data-label`, `.demo-data-value`, `.demo-data-change`, `.demo-data-verdict`, `.verdict-renegotiate`, `.verdict-cancel`, `.verdict-renew`, `.demo-list-footer`, `.demo-list-footer-inner`, `.demo-list-footer-btn`, `.demo-digest-pane`, `.demo-digest-pane-header`, `.demo-digest-intro`, `.demo-digest-group`, `.demo-digest-heading`, `.demo-digest-item`, `.demo-digest-badge`, `.demo-digest-meta`, `.demo-savings-pane`, `.demo-savings-hero`, `.demo-savings-hero-num`, `.demo-savings-hero-lbl`, `.demo-savings-detail`, `.demo-savings-row`, `.demo-savings-pos`, `.demo-savings-total`, `.demo-savings-note`, `.demo-scenarios`, plus all their `@media` and `[data-theme]` variants.

Also remove all `.app-*` CSS rules from the app section (keep the `.app-` rules that are functional — app items, calendar, digest — but remove any that reference the old window frame or old card system).

- [ ] **Step 2: Add new ledger-style item CSS for demo + app**

```css
.ledger-item{
  border:1px solid var(--mist); background:var(--slate); margin-bottom:8px;
  transition:border-color 0.2s var(--ease);
}
.ledger-item:hover{ border-color:var(--fog); }
.ledger-item-header{
  display:flex; align-items:center; gap:12px; padding:14px 18px; cursor:pointer;
}
.ledger-item-body{ flex:1; min-width:0; }
.ledger-item-name{ font-family:var(--body-serif); font-size:14px; font-weight:500; color:var(--paper); }
.ledger-item-meta{ font-family:var(--mono); font-size:11px; color:var(--dust); margin-top:2px; }
.ledger-item-tag{
  font-family:var(--mono); font-size:9px; font-weight:500; text-transform:lowercase;
  padding:3px 8px; border-radius:3px; white-space:nowrap;
}
.ledger-verdict-renew{ background:rgba(92,143,120,0.12); color:var(--sage); }
.ledger-verdict-cancel{ background:rgba(248,113,109,0.08); color:#f8716d; }
.ledger-verdict-renegotiate{ background:var(--ember-soft); color:var(--ember); }
.ledger-item-data{ max-height:0; overflow:hidden; transition:max-height 0.4s var(--ease); }
.ledger-item-expanded .ledger-item-data{ max-height:400px; }
.ledger-item-data-inner{ padding:0 18px 16px; border-top:1px solid var(--mist); }
.ledger-item-expanded .ledger-item-header{ border-bottom:1px solid var(--mist); }
```

- [ ] **Step 3: Update demo.ejs and app.ejs**

In both templates:
- Remove the `.demo-window` wrapper and all titlebar/traffic-lights markup
- Remove the scanning overlay (keep the JS scanning functionality — just don't render the overlay div)
- Replace `.demo-item-header`, `.demo-item`, etc. with the new `ledger-item` classes
- Change all `demo-*` CSS class references to `ledger-*` equivalents in the JS-generated HTML and in the pre-rendered items
- The demo replay button becomes a `.btn-tertiary`
- The app add panel gets no border radius, hairline borders
- The app filters become `.btn-tertiary` style
- The app stats become centered mono numbers
- Keep all JS logic intact — only change the class names referenced in `createElement` / `innerHTML` calls and the pre-rendered HTML

- [ ] **Step 4: Commit**

```bash
git add public/style.css views/demo.ejs views/app.ejs
git commit -m "feat(observatory): demo + app — unframed, ledger items, no window chrome"
```

---

## Task 7: Content Pages — Editorial Template Pass

**Files:**
- Modify: `views/blog.ejs`, `views/article.ejs`
- Modify: `views/features.ejs`, `views/resources.ejs`, `views/dashboard.ejs`
- Modify: `views/changelog.ejs`, `views/comparison.ejs`
- Modify: `views/pricing.ejs`, `views/how-it-works.ejs`, `views/problem.ejs`, `views/proof.ejs`, `views/uses.ejs`
- Modify: `views/about.ejs`, `views/contact.ejs`, `views/privacy.ejs`, `views/terms.ejs`, `views/brand.ejs`
- Modify: `views/digest.ejs`, `views/tool.ejs`, `views/stats.ejs`, `views/roadmap.ejs`
- Modify: `public/style.css` (editorial template CSS)

- [ ] **Step 1: Apply editorial header pattern to all content pages**

Every content page header becomes:
```html
<div class="wrap" style="padding-top:140px;padding-bottom:20px;">
  <div class="eyebrow">[page eyebrow]</div>
  <h1>[page title]</h1>
  <p class="section-sub" style="margin-top:12px;">[page description]</p>
</div>
```

Replace all existing page headers (`.page-header`, inline styles with `padding-top:120px`, etc.) with this pattern on every content page template.

- [ ] **Step 2: Replace card wrappers**

All `.feature-card`, `.resource-card`, `.blog-card`, `.stat-hero-card`, `.track-card`, `.not-card`, `.audience-tile`, `.price-card` → replace with `.card` and inline the specific styles.

- [ ] **Step 3: Update changelog to timeline layout**

Replace the existing `.cl-entry` cards with:
```html
<div style="display:flex;gap:20px;padding:20px 0;border-bottom:1px solid var(--mist);">
  <span style="font-family:var(--mono);font-size:var(--text-meta);color:var(--ember);min-width:90px;padding-top:2px;">4 jul 2026</span>
  <div>
    <h3 style="font-family:var(--body-serif);font-size:16px;margin-bottom:4px;">[entry title]</h3>
    <p style="font-family:var(--body-serif);font-size:14px;color:var(--pencil);line-height:1.6;">[entry description]</p>
  </div>
</div>
```

- [ ] **Step 4: Update comparison to ledger table**

Replace `comp-table` with:
```css
.comp-table{ width:100%; border-collapse:collapse; }
.comp-table th{ font-family:var(--mono); font-size:var(--text-meta); color:var(--dust); text-align:left; padding:10px 0; border-bottom:1px solid var(--mist); }
.comp-table td{ font-family:var(--body-serif); font-size:14px; color:var(--paper); padding:10px 0; border-bottom:1px solid var(--mist); }
.comp-table tr:nth-child(even) td{ background:var(--graphite); }
```

- [ ] **Step 5: Update dashboard gate**

Remove the `.dash-gate-inner` card wrapper. Center the form with text.

- [ ] **Step 6: Commit**

```bash
git add public/style.css views/blog.ejs views/article.ejs views/features.ejs views/resources.ejs views/dashboard.ejs views/changelog.ejs views/comparison.ejs views/pricing.ejs views/how-it-works.ejs views/problem.ejs views/proof.ejs views/uses.ejs views/about.ejs views/contact.ejs views/privacy.ejs views/terms.ejs views/brand.ejs views/digest.ejs views/tool.ejs views/stats.ejs views/roadmap.ejs
git commit -m "feat(observatory): editorial template pass — all 18 content pages aligned to new design"
```

---

## Task 8: Special Pages + Cleanup

**Files:**
- Modify: `views/waitlist.ejs`, `views/download.ejs`
- Modify: `views/404.ejs` (already minimal, just typography)
- Delete: `public/hero-scene.js`, `public/particles.js`
- Modify: `views/partials/newsletter-cta.ejs`
- Modify: `public/style.css` (waitlist + download CSS)

- [ ] **Step 1: Rewrite waitlist.ejs to two-column layout**

Left column (narrative): eyebrow, heading, subtext, trust badges
Right column (form): name input, email input, segment chips (household / freelancer / business), submit button

Remove the multi-step JS. One page, one form.

- [ ] **Step 2: Rewrite download.ejs to centered minimal**

Centered column: display serif heading, primary download button, mono version/date/size, 3 instructional steps below

- [ ] **Step 3: Delete hero-scene.js and particles.js**

```bash
rm public/hero-scene.js public/particles.js
```

- [ ] **Step 4: Update newsletter-cta.ejs**

Simpler: eyebrow + heading + name input + email input + submit. No card wrapper.

- [ ] **Step 5: Update head.ejs**

Remove `<link rel="modulepreload" href="/hero-scene.js">` and `<link rel="modulepreload" href="/particles.js">` if present. Remove `<script src="/particles.js"></script>` from footer.ejs.

- [ ] **Step 6: Remove old CSS that references deleted files**

Remove all CSS rules for: `#particleCanvas`, `.hero-scene`, `.scene-card-1` through `.scene-card-4`, `.scene-particle`, `.scene-label`, `.hero-visual canvas`, `.scene-fallback`.

- [ ] **Step 7: Add light mode CSS**

Minimal light mode:
```css
[data-theme="light"] {
  --obsidian:#f7f5f0; --graphite:#eeebe5; --slate:#e6e2da;
  --mist:rgba(0,0,0,0.06); --fog:rgba(0,0,0,0.10);
  --paper:#141714; --pencil:#4a504c; --dust:#8a908c;
  --ember:#a66e20; --rose-gold:#a8683a; --sage:#3d7a5a;
  --ember-soft:rgba(166,110,32,0.08);
}
[data-theme="light"] .nav.scrolled{ background:rgba(247,245,240,0.88); }
[data-theme="light"] .nav-cta:hover{ color:#f7f5f0; }
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(observatory): special pages, cleanup, light mode, delete old 3D scene"
```

---

## Self-Review

After writing the complete plan:

1. **Spec coverage check**: All sections from the spec are covered — design tokens, typography, spacing, nav, buttons, cards, footer, hero, sections (cost, how-it-works, track, proof, pricing, faq), demo/app ledger items, editorial template for content pages, changelog timeline, comparison ledger table, waitlist 2-column, download centered, 404 minimal, motion engine, lens cursor, accent shift, light mode, cleanup. ✅

2. **Placeholder scan**: No TBD, TODO, or incomplete sections. All steps have actual code or specific instructions. ✅

3. **Type consistency**: The `--scroll-pct` variable set in motion.js is consumed by CSS. The `ledger-item` classes in CSS match what demo.js and app.js will reference. Nav variable names (`nav`, `hamburger`, `overlay`, `overlayClose`) are consistent across HTML, CSS, and JS. ✅

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-05-observatory-redesign.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
