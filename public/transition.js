(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cache = {};

  function fetchPage(url){
    if (cache[url]) return Promise.resolve(cache[url]);
    return fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.text(); })
      .then(html => { cache[url] = html; return html; });
  }

  function extractContent(html){
    const d = document.createElement('div');
    d.innerHTML = html;
    const pageEl = d.querySelector('.page');
    const navEl = d.querySelector('.nav');
    const title = d.querySelector('title');
    if (!pageEl) return null;
    return {
      page: pageEl.innerHTML,
      title: title ? title.textContent : '',
      navActive: navEl ? navEl.innerHTML : null
    };
  }

  function animateOut(){
    document.querySelector('.page')?.classList.remove('page');
    const el = document.querySelector('.page');
    if (!el) return Promise.resolve();
    return new Promise(resolve => {
      el.style.transition = 'opacity .25s cubic-bezier(0.4,0,0.2,1), filter .25s cubic-bezier(0.4,0,0.2,1)';
      el.style.opacity = '0';
      el.style.filter = 'blur(4px)';
      setTimeout(resolve, 260);
    });
  }

  function animateIn(container){
    container.classList.add('page');
    container.style.opacity = '0.98';
    container.style.filter = 'blur(2px)';
    requestAnimationFrame(() => {
      container.style.transition = 'opacity .5s cubic-bezier(0.4,0,0.2,1), filter .5s cubic-bezier(0.4,0,0.2,1)';
      container.style.opacity = '1';
      container.style.filter = 'blur(0)';
    });
  }

  function updateNav(html){
    const nav = document.querySelector('.nav .nav-inner');
    if (nav && html) nav.innerHTML = html;
  }

  function updateContent(content){
    const existing = document.querySelector('.page');
    if (!existing) return;

    const container = document.createElement('div');
    container.className = 'page';
    container.innerHTML = content.page;

    existing.replaceWith(container);
    document.title = content.title;

    if (content.navActive) updateNav(content.navActive);

    animateIn(container);
    initFadeObservers();
    initFAQs();
    initCounters();
  }

  function navigateTo(url){
    const path = url.replace(window.location.origin, '');
    if (path === window.location.pathname) return;

    const prevScroll = window.scrollY;

    animateOut().then(() => {
      fetchPage(path).then(html => {
        const content = extractContent(html);
        if (!content) { window.location.href = url; return; }
        window.history.pushState({ path, scroll: prevScroll }, '', path);
        updateContent(content);
        window.scrollTo(0, 0);
        reattachNavListener();
      }).catch(() => {
        window.location.href = url;
      });
    });
  }

  function reattachNavListener(){
    const navCta = document.querySelector('.nav-cta');
    if (navCta && navCta.getAttribute('href') !== '#') {
      const href = navCta.getAttribute('href');
      navCta.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(href);
      });
    }

    document.querySelectorAll('.nav-links a, a.btn-primary, a.btn-secondary').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        navigateTo(href);
      });
    });
  }

  window.addEventListener('popstate', e => {
    if (e.state && e.state.path) {
      const path = e.state.path;
      fetchPage(path).then(html => {
        const content = extractContent(html);
        if (!content) { window.location.href = path; return; }
        const container = document.querySelector('.page');
        if (container) {
          container.style.transition = 'none';
          container.style.opacity = '0';
        }
        updateContent(content);
        window.scrollTo(0, e.state.scroll || 0);
        reattachNavListener();
      }).catch(() => { window.location.href = path; });
    }
  });

  function initFadeObservers(){
    const faders = document.querySelectorAll('.a-fade-up');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      faders.forEach(el => el.classList.add('in'));
    } else {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      faders.forEach(el => observer.observe(el));
    }
  }

  function initFAQs(){
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => item.classList.toggle('open'));
    });
  }

  function initCounters(){
    document.querySelectorAll('.proof-num[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const isCurrency = el.textContent.includes('£');
      const currentText = el.textContent;

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(el);

          const dur = 1500;
          const start = performance.now();

          function tick(now){
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const val = Math.round(eased * target);
            el.textContent = isCurrency ? '£' + val.toLocaleString() : val.toLocaleString();
            if (t < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    });
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    navigateTo(href);
  });

  initFadeObservers();
  initFAQs();
  initCounters();
  reattachNavListener();
})();
