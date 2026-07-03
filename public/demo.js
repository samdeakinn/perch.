(function(){
  if (!document.getElementById('demoPage')) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = prefersReduced ? (t) => Math.round(t * 0.3) : (t) => t;

  const STORAGE_KEY = 'perch_demo_seen';

  const ITEMS = [
    { icon:'🛡️', subject:'Your policy renews soon', provider:'Admiral Car Insurance', amount:612.40, period:'year', renews:'14 Aug 2026', change:'+22%', verdict:'renegotiate', reason:'Price up 22% — loyalty penalty applied.', tag:'pdf' },
    { icon:'🎬', subject:'Your subscription ends', provider:'Adobe Creative Cloud', amount:59.99, period:'month', renews:'3 Sep 2026', change:'stable', verdict:'cancel', reason:'Unused for 4 months. Last login: March 2026.', tag:'invoice' },
    { icon:'🌐', subject:'Your broadband price is changing', provider:'Virgin Media Broadband', amount:42, period:'month', renews:'21 Jul 2026', change:'+£14/mo', verdict:'renegotiate', reason:'Out of contract pricing. Switch or renegotiate.', tag:'notice' },
    { icon:'🔗', subject:'Domain renewal reminder', provider:'Namecheap — perch. domain', amount:14.99, period:'year', renews:'18 Aug 2026', change:'stable', verdict:'renew', reason:'Essential domain. Price unchanged.', tag:'reminder' },
    { icon:'🎬', subject:'Monthly membership', provider:'PureGym Manchester', amount:32, period:'month', renews:'1 Aug 2026', change:'stable', verdict:'cancel', reason:'Unused since March. £160/yr saved by cancelling.', tag:'invoice' },
    { icon:'🛡️', subject:'Your home insurance renews', provider:'Direct Line Home Insurance', amount:387, period:'year', renews:'5 Sep 2026', change:'+31%', verdict:'renegotiate', reason:'Massive hike. New customer rate is £289.', tag:'pdf' }
  ];

  const el = {
    replayBtn: document.getElementById('demoReplayBtn'),
    statusBadge: document.getElementById('demoStatusBadge'),
    window: document.getElementById('demoWindow'),
    scanning: document.getElementById('demoScanning'),
    scanLabel: document.getElementById('demoScanLabel'),
    scanFill: document.getElementById('demoScanFill'),
    app: document.getElementById('demoApp'),
    list: document.getElementById('demoList'),
    listFooter: document.getElementById('demoListFooter'),
    viewDigestBtn: document.getElementById('demoViewDigestBtn'),
    sumAnnual: document.getElementById('demoSumAnnual'),
    sumItems: document.getElementById('demoSumItems'),
    sumAction: document.getElementById('demoSumAction'),
    savingsHero: document.getElementById('demoSavingsHero'),
    tabs: document.querySelectorAll('.demo-tab'),
    panes: {
      inbox: document.getElementById('demoPaneInbox'),
      digest: document.getElementById('demoPaneDigest'),
      savings: document.getElementById('demoPaneSavings')
    },
    scenarios: document.getElementById('demoScenarios'),
    scenarioBtns: document.querySelectorAll('.demo-scenario-btn')
  };

  const totalAnnual = ITEMS.reduce((s, it) => s + (it.period === 'month' ? it.amount * 12 : it.amount), 0);
  const totalActionable = ITEMS.filter(it => it.verdict !== 'renew').length;

  let expandedIndex = -1;
  let isAnimating = false;

  el.replayBtn.addEventListener('click', replayScan);
  el.viewDigestBtn.addEventListener('click', () => switchTab('digest'));

  el.tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  el.scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switch (btn.dataset.action) {
        case 'digest': switchTab('digest'); break;
        case 'savings': switchTab('savings'); break;
        case 'expand': expandFirstItem(); break;
        case 'replay': replayScan(); break;
      }
    });
  });

  const seen = localStorage.getItem(STORAGE_KEY);

  if (!seen) {
    startScan();
  } else {
    showAppImmediately();
  }

  function startScan(){
    isAnimating = true;
    el.replayBtn.disabled = true;
    el.statusBadge.textContent = 'scanning your inbox...';
    el.scanning.classList.remove('demo-scanning-hidden');
    el.app.classList.remove('demo-app-visible');

    const steps = [
      { pct:8, label:'connecting to inbox...' },
      { pct:22, label:'scanning for renewal emails...' },
      { pct:40, label:'parsing dates and amounts...' },
      { pct:58, label:'comparing price changes...' },
      { pct:78, label:'generating verdicts...' },
      { pct:92, label:'building your digest...' },
      { pct:100, label:'done' }
    ];

    let i = 0;
    function tick(){
      if (i >= steps.length) {
        doneScanning();
        return;
      }
      const s = steps[i];
      el.scanLabel.textContent = s.label;
      el.scanFill.style.width = s.pct + '%';
      i++;
      setTimeout(tick, delay(s.pct === 100 ? 500 : 320));
    }
    setTimeout(tick, delay(600));
  }

  function doneScanning(){
    el.scanning.classList.add('demo-scanning-hidden');
    el.app.classList.add('demo-app-visible');
    el.statusBadge.textContent = 'demo ready';
    isAnimating = false;
    el.replayBtn.disabled = false;
    localStorage.setItem(STORAGE_KEY, '1');
    revealItems(0);
  }

  function expandFirstItem(){
    if (el.list.children.length > 0) {
      const first = el.list.children[0];
      if (first) {
        if (expandedIndex === 0) {
          first.classList.remove('demo-item-expanded');
          expandedIndex = -1;
        } else {
          if (expandedIndex >= 0) {
            const prev = el.list.children[expandedIndex];
            if (prev) prev.classList.remove('demo-item-expanded');
          }
          first.classList.add('demo-item-expanded');
          expandedIndex = 0;
        }
      }
    }
  }

  function showAppImmediately(){
    el.scanning.classList.add('demo-scanning-hidden');
    el.app.classList.add('demo-app-visible');
    el.statusBadge.textContent = 'demo ready';

    ITEMS.forEach((item, idx) => {
      const div = createItem(item, idx);
      el.list.appendChild(div);
      div.classList.add('demo-item-visible');
      div.classList.add('demo-item-anim');
    });

    updateSummary();
    el.listFooter.style.display = 'block';
    showScenarios();
  }

  function replayScan(){
    if (isAnimating) return;
    el.list.innerHTML = '';
    el.listFooter.style.display = 'none';
    expandedIndex = -1;
    el.sumAnnual.textContent = '£0';
    el.sumItems.textContent = '0';
    el.sumAction.textContent = '0';
    el.savingsHero.textContent = '£0';
    startScan();
  }

  function createItem(item, idx){
    const div = document.createElement('div');
    div.className = 'demo-item demo-item-anim';
    div.innerHTML = `
      <div class="demo-item-header">
        <div class="demo-item-icon">${item.icon}</div>
        <div class="demo-item-body">
          <div class="demo-item-subject">${item.subject}</div>
          <div class="demo-item-provider">${item.provider}</div>
        </div>
        <span class="demo-item-tag">${item.tag}</span>
      </div>
      <div class="demo-item-data">
        <div class="demo-item-data-inner">
          <div class="demo-data-row"><span class="demo-data-label">Amount</span><span class="demo-data-value">${item.period === 'month' ? '£' + item.amount.toFixed(2) + '/mo' : '£' + item.amount.toFixed(2) + '/yr'}</span></div>
          <div class="demo-data-row"><span class="demo-data-label">Renews</span><span class="demo-data-value">${item.renews}</span></div>
          <div class="demo-data-row"><span class="demo-data-label">Change</span><span class="demo-data-value ${item.change !== 'stable' ? 'demo-data-change' : ''}">${item.change === 'stable' ? 'No change' : item.change}</span></div>
          <div class="demo-data-verdict verdict-${item.verdict}">${item.verdict === 'renegotiate' ? '✕ Renegotiate' : item.verdict === 'cancel' ? '✕ Cancel' : '✓ Renew'} — ${item.reason}</div>
        </div>
      </div>
    `;
    div.addEventListener('click', () => toggleItem(idx, div));
    return div;
  }

  function revealItems(idx){
    if (idx >= ITEMS.length) {
    updateSummary();
    el.listFooter.style.display = 'block';
    showScenarios();
    return;
    }

    const item = ITEMS[idx];
    const div = createItem(item, idx);
    el.list.appendChild(div);

    setTimeout(() => div.classList.add('demo-item-in'), 50);
    setTimeout(() => revealItems(idx + 1), delay(500));
  }

  function showScenarios(){
    if (el.scenarios) {
      el.scenarios.style.display = 'block';
      el.scenarios.style.opacity = '0';
      requestAnimationFrame(() => {
        el.scenarios.style.transition = 'opacity .5s var(--ease)';
        el.scenarios.style.opacity = '1';
      });
    }
  }

  function toggleItem(idx, div){
    if (expandedIndex === idx) {
      div.classList.remove('demo-item-expanded');
      expandedIndex = -1;
    } else {
      if (expandedIndex >= 0) {
        const prev = el.list.children[expandedIndex];
        if (prev) prev.classList.remove('demo-item-expanded');
      }
      div.classList.add('demo-item-expanded');
      expandedIndex = idx;
    }
  }

  function updateSummary(){
    el.sumAnnual.textContent = '£' + totalAnnual.toLocaleString();
    el.sumItems.textContent = ITEMS.length;
    el.sumAction.textContent = totalActionable;
    animateCountUp(el.savingsHero, 1431);
  }

  function animateCountUp(target, value){
    const dur = 1000;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      target.textContent = '£' + Math.round(eased * value).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function switchTab(tab){
    el.tabs.forEach(t => t.classList.toggle('demo-tab-active', t.dataset.tab === tab));
    Object.keys(el.panes).forEach(key => {
      el.panes[key].classList.toggle('demo-pane-active', key === tab);
    });
  }
})();
