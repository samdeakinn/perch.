(function(){
  if (!document.getElementById('demoApp')) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ITEMS = [
    { id:1, type:'PDF', provider:'Admiral Car Insurance', subject:'Your policy renews soon', amount:612.40, period:'year', renews:'14 Aug 2026', change:'+22%', verdict:'renegotiate', reason:'Price up 22% — loyalty penalty applied.', urgency:'high', icon:'🛡️' },
    { id:2, type:'Invoice', provider:'Adobe Creative Cloud', subject:'Your subscription ends', amount:59.99, period:'month', renews:'3 Sep 2026', change:'stable', verdict:'cancel', reason:'Unused for 4 months. Last login: March 2026.', urgency:'medium', icon:'🎬' },
    { id:3, type:'Notice', provider:'Virgin Media Broadband', subject:'Your broadband price is changing', amount:42, period:'month', renews:'21 Jul 2026', change:'+£14/mo', verdict:'renegotiate', reason:'Out of contract pricing. Switch or renegotiate.', urgency:'high', icon:'🌐' },
    { id:4, type:'Reminder', provider:'Namecheap — perch. domain', subject:'Domain renewal reminder', amount:14.99, period:'year', renews:'18 Aug 2026', change:'stable', verdict:'renew', reason:'Essential domain. Price unchanged.', urgency:'low', icon:'🔗' },
    { id:5, type:'Invoice', provider:'PureGym Manchester', subject:'Monthly membership', amount:32, period:'month', renews:'1 Aug 2026', change:'stable', verdict:'cancel', reason:'Unused since March. £160/yr saved by cancelling.', urgency:'medium', icon:'🎬' },
    { id:6, type:'PDF', provider:'Direct Line Home Insurance', subject:'Your home insurance renews', amount:387, period:'year', renews:'5 Sep 2026', change:'+31%', verdict:'renegotiate', reason:'Massive hike. New customer rate is £289.', urgency:'high', icon:'🛡️' }
  ];

  const state = { phase:'intro', idx:0, extracted:[] };

  const app = document.getElementById('demoApp');
  const intro = document.getElementById('demoIntro');
  const stage = document.getElementById('demoStage');
  const itemsEl = document.getElementById('demoItems');
  const progress = document.getElementById('demoProgress');
  const stepLabel = document.getElementById('demoStepLabel');
  const statsEl = document.getElementById('demoStats');
  const digestBtn = document.getElementById('demoDigestBtn');
  const digestEl = document.getElementById('demoDigest');

  const totalAnnual = ITEMS.reduce((sum, it) => {
    const amt = it.period === 'month' ? it.amount * 12 : it.amount;
    return sum + amt;
  }, 0);

  const totalActionable = ITEMS.filter(i => i.verdict !== 'renew').length;

  document.getElementById('demoStartBtn').addEventListener('click', startDemo);
  digestBtn.addEventListener('click', showDigest);

  function startDemo(){
    state.phase = 'scanning';
    intro.classList.add('demo-intro-done');
    stage.classList.add('demo-stage-active');
    progress.classList.add('demo-progress-active');
    updateProgress(0);
    addNextItem();
  }

  function addNextItem(){
    const item = ITEMS[state.idx];
    const card = document.createElement('div');
    card.className = 'demo-item';
    card.innerHTML = `
      <div class="demo-item-email">
        <div class="demo-item-icon">${item.icon}</div>
        <div class="demo-item-meta">
          <div class="demo-item-subject">${item.subject}</div>
          <div class="demo-item-provider">${item.provider}</div>
        </div>
        <span class="demo-item-tag">${item.type}</span>
      </div>
      <div class="demo-item-data">
        <div class="demo-data-line" data-field="amount"><span class="demo-data-label">Amount</span><span class="demo-data-val">${item.period === 'month' ? '£' + item.amount.toFixed(2) + '/month' : '£' + item.amount.toFixed(2) + '/year'}</span></div>
        <div class="demo-data-line" data-field="renews"><span class="demo-data-label">Renews</span><span class="demo-data-val">${item.renews}</span></div>
        <div class="demo-data-line" data-field="change"><span class="demo-data-label">Change</span><span class="demo-data-val ${item.change === 'stable' ? 'val-stable' : 'val-up'}">${item.change === 'stable' ? 'No change' : item.change}</span></div>
        <div class="demo-data-verdict verdict-${item.verdict}">${item.verdict === 'renegotiate' ? 'Renegotiate' : item.verdict === 'cancel' ? 'Cancel' : 'Renew'} — ${item.reason}</div>
      </div>
    `;
    itemsEl.appendChild(card);

    state.extracted.push(item);
    state.idx++;

    stepLabel.textContent = `Extracting ${state.idx} of ${ITEMS.length}...`;
    updateProgress(state.idx / ITEMS.length);

    if (!prefersReduced) {
      requestAnimationFrame(() => card.classList.add('demo-item-in'));
      revealLines(card, 0);
    } else {
      card.classList.add('demo-item-in', 'demo-item-data-visible');
      card.querySelectorAll('.demo-data-line').forEach(l => l.classList.add('line-revealed'));
      card.querySelector('.demo-data-verdict').classList.add('verdict-shown');
    }

    const delay = prefersReduced ? 400 : 1000;
    if (state.idx < ITEMS.length) {
      setTimeout(addNextItem, delay);
    } else {
      setTimeout(showStats, prefersReduced ? 400 : 1200);
    }
  }

  function revealLines(card, i){
    const lines = card.querySelectorAll('.demo-data-line');
    if (i >= lines.length) {
      setTimeout(() => {
        card.querySelector('.demo-data-verdict').classList.add('verdict-shown');
        card.classList.add('demo-item-data-visible');
      }, 300);
      return;
    }
    setTimeout(() => {
      lines[i].classList.add('line-revealed');
      revealLines(card, i + 1);
    }, 350);
  }

  function updateProgress(pct){
    progress.style.width = Math.round(pct * 100) + '%';
  }

  function showStats(){
    state.phase = 'complete';
    stepLabel.textContent = 'Complete';
    progress.classList.remove('demo-progress-active');
    progress.classList.add('demo-progress-done');

    document.getElementById('demoStatItems').textContent = ITEMS.length;
    document.getElementById('demoStatAnnual').textContent = '£' + totalAnnual.toLocaleString();
    document.getElementById('demoStatAction').textContent = totalActionable;

    setTimeout(() => {
      statsEl.classList.add('demo-stats-visible');
    }, 300);

    setTimeout(() => {
      digestBtn.classList.add('demo-digest-btn-visible');
    }, 1000);
  }

  function showDigest(){
    digestEl.scrollIntoView({ behavior:'smooth', block:'start' });
    digestEl.classList.add('demo-digest-visible');
  }

  document.querySelectorAll('.demo-stat-num[data-count]').forEach(el => {
    const t = parseInt(el.getAttribute('data-count'), 10);
    const isCur = el.textContent.includes('£');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(el);
        const dur = 800;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = Math.round(eased * t);
          el.textContent = isCur ? '£' + v.toLocaleString() : v.toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold:0.5 });
    obs.observe(el);
  });
})();