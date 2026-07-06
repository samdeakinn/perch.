(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (prefersReduced) return;

  // ═══ LENIS SMOOTH SCROLL ═══
  var lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.2,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80, duration: 1 }); }
      });
    });
  }

  // ═══ ACCENT SHIFT ═══
  var scrollTicking = false;
  function updateScrollPct() {
    var h = document.documentElement;
    var st = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? Math.min(st / max, 1) : 0;
    document.documentElement.style.setProperty('--scroll-pct', pct);
  }
  window.addEventListener('scroll', function() {
    if (!scrollTicking) { requestAnimationFrame(function() { updateScrollPct(); scrollTicking = false; }); scrollTicking = true; }
  }, { passive: true });
  updateScrollPct();

  // ═══ GRAVITATIONAL SECTION REVEALS ═══
  var sections = document.querySelectorAll('.gravitational');
  if (sections.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
        }
      });
    }, { threshold: 0.05 });
    sections.forEach(function(section, i) {
      var rect = section.getBoundingClientRect();
      var isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        section.style.transform = 'translateY(0)';
        section.style.opacity = '1';
        section.style.transition = 'none';
      } else {
        section.style.transform = 'translateY(40px)';
        section.style.opacity = '0';
        section.style.transition = 'transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 0.8s cubic-bezier(0.16,1,0.3,1)';
        section.style.transitionDelay = (i * 0.08) + 's';
      }
      observer.observe(section);
    });
  }

  // ═══ LENS CURSOR ═══
  var lens = document.createElement('div');
  lens.id = 'lensCursor';
  document.body.appendChild(lens);
  var lmx = -100, lmy = -100, cursorState = 'text';
  if (!isTouch) {
    document.addEventListener('mousemove', function(e) { lmx = e.clientX; lmy = e.clientY; });
    var interactiveSel = 'a, button, input, textarea, select, .nav-cta, .btn-primary, .btn-secondary, .btn-tertiary, .card, .demo-item-header, .app-item-header';
    function bindLensInteractive() {
      document.querySelectorAll(interactiveSel).forEach(function(el) {
        el.addEventListener('mouseenter', function() { cursorState = 'interactive'; });
        el.addEventListener('mouseleave', function() { cursorState = 'text'; });
      });
    }
    bindLensInteractive();
    setInterval(bindLensInteractive, 2000);
    function driftLens() {
      lens.style.left = (lmx - 30) + 'px';
      lens.style.top = (lmy - 30) + 'px';
      lens.classList.add('active');
      if (cursorState === 'interactive') lens.classList.add('interactive');
      else lens.classList.remove('interactive');
      requestAnimationFrame(driftLens);
    }
    driftLens();
  }

  // ═══ CURSOR DOT (morph) ═══
  var dot = document.getElementById('cursorDot');
  if (dot && !isTouch) {
    var dmx = -100, dmy = -100, dcx = -100, dcy = -100;
    document.addEventListener('mousemove', function(e) { dmx = e.clientX; dmy = e.clientY; });
    var dotState = 'default';
    document.querySelectorAll('a, button, .card, .demo-item-header, .app-item-header, input, textarea').forEach(function(el) {
      el.addEventListener('mouseenter', function() { dotState = 'link'; });
      el.addEventListener('mouseleave', function() { dotState = 'default'; });
    });
    function driftDot() {
      dcx += (dmx - dcx) * 0.12;
      dcy += (dmy - dcy) * 0.12;
      dot.style.transform = 'translate(' + (dcx - 4) + 'px, ' + (dcy - 4) + 'px)';
      if (dotState === 'link') dot.classList.add('cursor-dot-hover');
      else dot.classList.remove('cursor-dot-hover');
      dot.classList.add('cursor-dot-visible');
      requestAnimationFrame(driftDot);
    }
    driftDot();
  }

  // ═══ MAGNETIC BUTTONS ═══
  if (!isTouch) {
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
        this.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
      });
      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
        this.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      });
    });
  }

  // ═══ GLASS CARD TILT ═══
  if (!isTouch) {
    document.querySelectorAll('.card').forEach(function(card) {
      var wrap = card.parentElement;
      wrap.style.perspective = '800px';
      card.style.transformStyle = 'preserve-3d';
      var hl = document.createElement('div');
      hl.className = 'card-highlight';
      hl.setAttribute('aria-hidden', 'true');
      card.style.position = card.style.position || 'relative';
      card.appendChild(hl);
      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rotX = (y - 0.5) * -8;
        var rotY = (x - 0.5) * 8;
        card.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
        hl.style.opacity = '0.12';
        hl.style.background = 'radial-gradient(circle at ' + (x * 100) + '% ' + (y * 100) + '%, rgba(255,255,255,0.4) 0%, transparent 60%)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'none';
        hl.style.opacity = '0';
      });
    });
  }

  // ═══ THEME TOGGLE ═══
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
  }
  try { var saved = localStorage.getItem('theme'); if (saved === 'light') setTheme('light'); } catch(e) {}
  document.getElementById('themeToggle')?.addEventListener('click', function() {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
  document.getElementById('themeToggleDrawer')?.addEventListener('click', function() {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });

  // ═══ INIT ═══
  initLenis();
})();
