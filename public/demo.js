(function(){
  if (!document.getElementById('demoPage')) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pause = prefersReduced ? (t) => t : (t) => t + 1.5;

  const ITEMS = [
    { icon:'🛡️', subject:'Your policy renews soon', provider:'Admiral Car Insurance', amount:612.40, period:'year', renews:'14 Aug 2026', change:'+22%', verdict:'renegotiate', reason:'Price up 22% — loyalty penalty applied.', urgency:'high', dead:'23 days' },
    { icon:'🎬', subject:'Your subscription ends', provider:'Adobe Creative Cloud', amount:59.99, period:'month', renews:'3 Sep 2026', change:'stable', verdict:'cancel', reason:'Unused for 4 months. Last login: March 2026.', urgency:'medium', dead:'55 days' },
    { icon:'🌐', subject:'Your broadband price is changing', provider:'Virgin Media Broadband', amount:42, period:'month', renews:'21 Jul 2026', change:'+£14/mo', verdict:'renegotiate', reason:'Out of contract pricing. Switch or renegotiate.', urgency:'high', dead:'12 days' },
    { icon:'🔗', subject:'Domain renewal reminder', provider:'Namecheap — perch. domain', amount:14.99, period:'year', renews:'18 Aug 2026', change:'stable', verdict:'renew', reason:'Essential domain. Price unchanged.', urgency:'low', dead:'27 days' },
    { icon:'🎬', subject:'Monthly membership', provider:'PureGym Manchester', amount:32, period:'month', renews:'1 Aug 2026', change:'stable', verdict:'cancel', reason:'Unused since March. £160/yr saved by cancelling.', urgency:'medium', dead:'23 days' },
    { icon:'🛡️', subject:'Your home insurance renews', provider:'Direct Line Home Insurance', amount:387, period:'year', renews:'5 Sep 2026', change:'+31%', verdict:'renegotiate', reason:'Massive hike. New customer rate is £289.', urgency:'high', dead:'56 days' }
  ];

  const el = {
    launchBtn: document.getElementById('demoLaunchBtn'),
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
    }
  };

  const totalAnnual = ITEMS.reduce((s, it) => s + (it.period === 'month' ? it.amount * 12 : it.amount), 0);
  const totalActionable = ITEMS.filter(it => it.verdict !== 'renew').length;
  const totalSavings = 328 + 1103;

  let expandedIndex = -1;

  el.launchBtn.addEventListener('click', startDemo);
  el.viewDigestBtn.addEventListener('click', () => switchTab('digest'));

  el.tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  function startDemo(){
    el.launchBtn.parentElement.style.display = 'none';
    el.window.classList.add('demo-window-visible');
    el.window.scrollIntoView({ behavior:'smooth', block:'center' });
    scanProgress();
  }

  function scanProgress(){
    const steps = [
      { pct:10, label:'connecting to inbox...' },
      { pct:25, label:'scanning for renewal emails...' },
      { pct:45, label:'parsing dates and amounts...' },
      { pct:65, label:'comparing price changes...' },
      { pct:85, label:'generating verdicts...' },
      { pct:100, label:'building your digest...' }
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
      setTimeout(tick, pause(s.pct === 100 ? 600 : 350));
    }
    setTimeout(tick, 800);
  }

  function doneScanning(){
    el.scanning.classList.add('demo-scanning-hidden');
    el.app.classList.add('demo-app-visible');
    revealItems(0);
  }

  function revealItems(idx){
    if (idx >= ITEMS.length) {
      updateSummary();
      el.listFooter.style.display = 'block';
      return;
    }

    const item = ITEMS[idx];
    const div = document.createElement('div');
    div.className = 'demo-item';
    div.style.transitionDelay = '0s';
    div.innerHTML = `
      <div class="demo-item-header">
        <div class="demo-item-icon">${item.icon}</div>
        <div class="demo-item-body">
          <div class="demo-item-subject">${item.subject}</div>
          <div class="demo-item-provider">${item.provider}</div>
        </div>
        <span class="demo-item-tag">${item.type || 'notice'}</span>
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
    el.list.appendChild(div);

    div.addEventListener('click', () => toggleItem(idx, div));

    setTimeout(() => div.classList.add('demo-item-in'), 50);

    setTimeout(() => revealItems(idx + 1), pause(600));
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

  function animateCountUp(el, target){
    const dur = 1200;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(eased * target);
      el.textContent = '£' + v.toLocaleString();
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
