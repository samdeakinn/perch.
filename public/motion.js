(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // ═══ 1. LENIS SMOOTH SCROLL ═══
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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Wire up anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80, duration: 1 });
        }
      });
    });
  }

  // ═══ 2. SCROLL-TRIGGERED REVEALS ═══
  function initScrollReveals() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.a-fade-up, .a-scale-in').forEach(function(el) {
      observer.observe(el);
    });

    // Auto-mark section children
    document.querySelectorAll('.lp-section:not(.hero) .steps, .lp-section:not(.hero) .track-grid, .lp-section:not(.hero) .not-grid, .lp-section:not(.hero) .audience-grid-index, .features-grid, .resources-grid, .facts-grid, .testimonial-grid, .pricing-grid, .blog-list').forEach(function(grid) {
      grid.classList.add('a-stagger-grid');
      observer.observe(grid);
    });
  }

  // ═══ 3. TEXT REVEAL (WORD-BY-WORD) ═══
  function initTextReveal() {
    var headings = document.querySelectorAll('h2.reveal-text, .section-sub.reveal-text');
    headings.forEach(function(el) {
      el.classList.add('tr-initialized');
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('tr-done')) {
          entry.target.classList.add('tr-done');
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('h2.reveal-text').forEach(function(el) { observer.observe(el); });
  }

  // ═══ 4. MAGNETIC BUTTONS ═══
  function initMagneticButtons() {
    if (isTouch) return;
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .magnetic').forEach(function(btn) {
      btn.classList.add('mag-ready');
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

  // ═══ 5. CUSTOM CURSOR MORPH ═══
  function initCursor() {
    var dot = document.getElementById('cursorDot');
    if (!dot || isTouch || !dot) return;

    var mx = -100, my = -100, cx = -100, cy = -100;
    var state = 'default';
    var targetSize = 8;

    document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });

    // Detect hover targets
    document.querySelectorAll('a, button, .tilt-card, .demo-item-header, .app-item-header, input, textarea, select').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        var tag = this.tagName.toLowerCase();
        if (tag === 'a' || tag === 'button') state = 'link';
        else if (this.matches('.tilt-card, .demo-item-header, .app-item-header')) state = 'card';
        else state = 'link';
      });
      el.addEventListener('mouseleave', function() { state = 'default'; });
    });

    function drift() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;

      if (state === 'default') targetSize = 8;
      else if (state === 'link') targetSize = 28;
      else if (state === 'card') targetSize = 48;

      var currentSize = parseFloat(dot.style.width) || 8;
      var newSize = currentSize + (targetSize - currentSize) * 0.2;

      dot.style.width = newSize + 'px';
      dot.style.height = newSize + 'px';
      dot.style.transform = 'translate(' + (cx - newSize/2) + 'px, ' + (cy - newSize/2) + 'px)';
      dot.style.opacity = state === 'card' ? '0.25' : state === 'link' ? '0.15' : '0.5';
      dot.style.mixBlendMode = state === 'card' ? 'normal' : 'difference';
      dot.classList.add('cursor-dot-visible');

      requestAnimationFrame(drift);
    }
    drift();
  }

  // ═══ 6. GLASS CARD TILT + SPECULAR HIGHLIGHT ═══
  function initGlassTilt() {
    if (isTouch) return;
    document.querySelectorAll('.tilt-card').forEach(function(card) {
      var wrap = card.closest('.tilt-wrap') || card.parentElement;
      wrap.style.perspective = '800px';
      card.style.transformStyle = 'preserve-3d';

      // Add highlight layer
      if (!card.querySelector('.card-highlight')) {
        var hl = document.createElement('div');
        hl.className = 'card-highlight';
        hl.setAttribute('aria-hidden', 'true');
        card.style.position = card.style.position || 'relative';
        card.appendChild(hl);
      }

      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rotX = (y - 0.5) * -10;
        var rotY = (x - 0.5) * 10;
        card.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';

        var hl = card.querySelector('.card-highlight');
        if (hl) {
          hl.style.opacity = '0.15';
          hl.style.background = 'radial-gradient(circle at ' + (x * 100) + '% ' + (y * 100) + '%, rgba(255,255,255,0.4) 0%, transparent 60%)';
        }
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        var hl = card.querySelector('.card-highlight');
        if (hl) hl.style.opacity = '0';
      });
    });
  }

  // ═══ 7. GRADIENT PARALLAX ═══
  function initGradientParallax() {
    document.addEventListener('mousemove', function(e) {
      var x = (e.clientX / window.innerWidth) * 100;
      var y = (e.clientY / window.innerHeight) * 100;
      document.querySelectorAll('.orb, .glow-text').forEach(function(el) {
        el.style.setProperty('--mouse-x', x);
        el.style.setProperty('--mouse-y', y);
      });
    });

    if (lenis) {
      lenis.on('scroll', function(e) {
        var scrollY = e.animatedScroll || window.scrollY;
        document.querySelectorAll('.parallax-section').forEach(function(section) {
          var rect = section.getBoundingClientRect();
          var centerY = rect.top + rect.height / 2;
          var viewCenter = window.innerHeight / 2;
          var offset = (centerY - viewCenter) / window.innerHeight;
          section.style.setProperty('--parallax', offset);
        });
      });
    }
  }

  // ═══ 8. STAT COUNTERS ═══
  function initCounters() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = '1';
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var isCurrency = el.textContent.includes('\u00A3');
        var dur = 1600, start = performance.now();

        function tick(now) {
          var t = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          var val = Math.round(eased * target) || 0;
          el.textContent = isCurrency ? '\u00A3' + val.toLocaleString() : val.toLocaleString();
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-count]').forEach(function(el) { observer.observe(el); });
  }

  // ═══ 9. GLOW TEXT MOUSE FOLLOW ═══
  function initGlowText() {
    if (isTouch) return;
    document.addEventListener('mousemove', function(e) {
      var x = (e.clientX / window.innerWidth) * 100;
      var y = (e.clientY / window.innerHeight) * 100;
      document.querySelectorAll('.glow-text').forEach(function(el) {
        el.style.backgroundPosition = x + '% ' + y + '%';
      });
    });
  }

  // ═══ 10. SMOOTH PAGE TRANSITIONS ═══
  function initPageTransitions() {
    if (!document.startViewTransition) return;
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('javascript')) return;
      if (link.target === '_blank') return;
      if (e.metaKey || e.ctrlKey) return;
      if (link.closest('.app-item-header') || link.closest('.demo-item-header')) return;

      e.preventDefault();
      document.startViewTransition(function() {
        return new Promise(function(resolve) {
          window.location.href = href;
          setTimeout(resolve, 300);
        });
      });
    });
  }

  // ═══ INIT ALL ═══
  initLenis();
  setTimeout(function() { initScrollReveals(); initTextReveal(); initMagneticButtons(); initCursor(); initGlassTilt(); initGradientParallax(); initCounters(); initGlowText(); initPageTransitions(); }, 100);
})();
