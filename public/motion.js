(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // ═══ Lens cursor ═══
  var lens = document.createElement('div');
  lens.id = 'lensCursor';
  document.body.appendChild(lens);
  var mx = -100, my = -100, cursorState = 'text';

  if (!isTouch && !prefersReduced) {
    document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });
    var interactiveSel = 'a, button, input, textarea, select, .nav-cta, .btn-primary, .btn-secondary, .btn-tertiary, .card, .ledger-item-header';
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

  // ═══ Accent shift via scroll ═══
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

  // ═══ Section handoff transitions ═══
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

  // ═══ Theme toggle ═══
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
