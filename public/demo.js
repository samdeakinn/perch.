(function(){
  if (!document.getElementById('demoPage')) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var delayFn = prefersReduced ? function(t) { return Math.round(t * 0.3); } : function(t) { return t; };
  var STORAGE_KEY = 'perch_demo_seen';

  var totalAnnual = 1431;
  var totalActionable = 5;
  var expandedIndex = -1;
  var isAnimating = false;

  var el = {
    replayBtn: document.getElementById('demoReplayBtn'),
    statusBadge: document.getElementById('demoStatusBadge'),
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

  var itemEls = Array.from(el.list.querySelectorAll('.demo-item'));

  itemEls.forEach(function(item, idx) {
    item.addEventListener('click', function() { handleItemClick(idx); });
  });

  el.replayBtn.addEventListener('click', replayScan);
  el.viewDigestBtn.addEventListener('click', function() { switchTab('digest'); });

  el.tabs.forEach(function(tab) {
    tab.addEventListener('click', function() { switchTab(tab.getAttribute('data-tab')); });
  });

  el.scenarioBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var action = btn.getAttribute('data-action');
      if (action === 'digest') switchTab('digest');
      else if (action === 'savings') switchTab('savings');
      else if (action === 'expand') handleItemClick(0);
      else if (action === 'replay') replayScan();
    });
  });

  el.sumAnnual.textContent = '£' + totalAnnual.toLocaleString();
  el.sumItems.textContent = '6';
  el.sumAction.textContent = totalActionable.toString();
  if (el.savingsHero) el.savingsHero.textContent = '£1,431';

  var seen = null;
  try { seen = localStorage.getItem(STORAGE_KEY); } catch(e) {}

  if (!seen) {
    startScan();
  } else {
    showImmediately();
  }

  function startScan() {
    isAnimating = true;
    el.replayBtn.disabled = true;
    el.statusBadge.textContent = 'scanning your inbox...';

    el.scanning.classList.add('demo-scanning-active');
    el.scanning.classList.remove('demo-scanning-hidden');

    el.listFooter.style.display = 'none';

    itemEls.forEach(function(div) {
      div.classList.remove('demo-item-init', 'demo-item-in', 'demo-item-visible', 'demo-item-expanded');
      div.classList.add('demo-item-anim');
    });
    expandedIndex = -1;

    el.sumAnnual.textContent = '£0';
    el.sumItems.textContent = '0';
    el.sumAction.textContent = '0';
    if (el.savingsHero) el.savingsHero.textContent = '£0';

    var steps = [
      { pct:8, label:'connecting to inbox...' },
      { pct:22, label:'scanning for renewal emails...' },
      { pct:40, label:'parsing dates and amounts...' },
      { pct:58, label:'comparing price changes...' },
      { pct:78, label:'generating verdicts...' },
      { pct:92, label:'building your digest...' },
      { pct:100, label:'done' }
    ];

    var i = 0;
    function tick() {
      if (i >= steps.length) { doneScanning(); return; }
      var s = steps[i];
      el.scanLabel.textContent = s.label;
      el.scanFill.style.width = s.pct + '%';
      i++;
      setTimeout(tick, delayFn(s.pct === 100 ? 500 : 320));
    }
    setTimeout(tick, delayFn(600));
  }

  function doneScanning() {
    el.scanning.classList.remove('demo-scanning-active');
    el.scanning.classList.add('demo-scanning-hidden');
    el.statusBadge.textContent = 'demo ready';
    isAnimating = false;
    el.replayBtn.disabled = false;
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch(e) {}
    animateItemsIn(0);
  }

  function showImmediately() {
    el.scanning.classList.remove('demo-scanning-active');
    el.scanning.classList.add('demo-scanning-hidden');

    itemEls.forEach(function(div) {
      div.classList.remove('demo-item-init', 'demo-item-anim');
      div.classList.add('demo-item-visible');
    });

    el.listFooter.style.display = 'block';
    showScenarios();
    animateCountUp(el.savingsHero, 1431);
  }

  function replayScan() {
    if (isAnimating) return;
    startScan();
  }

  function animateItemsIn(idx) {
    if (idx >= itemEls.length) {
      el.sumAnnual.textContent = '£' + totalAnnual.toLocaleString();
      el.sumItems.textContent = '6';
      el.sumAction.textContent = totalActionable.toString();
      el.listFooter.style.display = 'block';
      showScenarios();
      animateCountUp(el.savingsHero, 1431);
      return;
    }
    var div = itemEls[idx];
    if (div) {
      div.classList.remove('demo-item-init');
      div.classList.add('demo-item-anim');
      setTimeout(function() { div.classList.add('demo-item-in'); }, 50);
      setTimeout(function() { animateItemsIn(idx + 1); }, delayFn(500));
    } else {
      animateItemsIn(idx + 1);
    }
  }

  function handleItemClick(idx) {
    var div = itemEls[idx];
    if (!div) return;
    if (expandedIndex === idx) {
      div.classList.remove('demo-item-expanded');
      expandedIndex = -1;
    } else {
      if (expandedIndex >= 0) {
        var prev = itemEls[expandedIndex];
        if (prev) prev.classList.remove('demo-item-expanded');
      }
      div.classList.add('demo-item-expanded');
      expandedIndex = idx;
    }
  }

  function showScenarios() {
    if (el.scenarios) {
      el.scenarios.style.display = 'block';
      el.scenarios.style.opacity = '0';
      requestAnimationFrame(function() {
        el.scenarios.style.transition = 'opacity .5s cubic-bezier(0.4,0,0.2,1)';
        el.scenarios.style.opacity = '1';
      });
    }
  }

  function animateCountUp(target, value) {
    var dur = 1000;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      target.textContent = '£' + Math.round(eased * value).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function switchTab(tab) {
    el.tabs.forEach(function(t) { t.classList.toggle('demo-tab-active', t.getAttribute('data-tab') === tab); });
    Object.keys(el.panes).forEach(function(key) {
      el.panes[key].classList.toggle('demo-pane-active', key === tab);
    });
  }
})();
