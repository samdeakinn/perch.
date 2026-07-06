(function(){
  try {
  console.log('[perch-3d] observatory-scene.js STARTED — THREE type: ' + typeof THREE);
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var isMobile = window.innerWidth < 768;

  var container = document.getElementById('observatoryScene');
  console.log('[perch-3d] container found: ' + !!container + ' | reduced=' + prefersReduced + ' touch=' + isTouch + ' mobile=' + isMobile + ' THREE undefined=' + (typeof THREE === 'undefined'));
  if (!container || prefersReduced || isTouch || isMobile || typeof THREE === 'undefined') {
    console.log('[perch-3d] EARLY RETURN — scene will not render');
    return;
  }
  container.style.display = 'block';
  console.log('[perch-3d] container display set to block, dimensions: ' + container.clientWidth + 'x' + container.clientHeight);

  var W = container.clientWidth;
  var H = container.clientHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
  camera.position.set(0, 0.3, 9);

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);
  console.log('[perch-3d] WebGL renderer created, canvas appended to container. Canvas size: ' + renderer.domElement.width + 'x' + renderer.domElement.height);

  function createGlowTexture(innerColor, outerColor) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    var ctx = canvas.getContext('2d');
    var grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.25, outerColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    var tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  var emberGlow = createGlowTexture('rgba(255,210,140,0.9)', 'rgba(201,138,58,0.3)');

  var COLOR_AMBER = new THREE.Color(0xc98a3a);
  var COLOR_DEEP = new THREE.Color(0xb86848);
  var COLOR_SAGE = new THREE.Color(0x5c8f72);
  var COLOR_VERMILION = new THREE.Color(0xd46a5a);

  var scrollPct = 0;
  var mouseX = 0, mouseY = 0, targetMX = 0, targetMY = 0;
  var entranceProgress = 0;

  var ringGroup = new THREE.Group();
  scene.add(ringGroup);

  var rings = [];
  var ringConfigs = [
    { radius: 2.0, tube: 0.018, tiltX: Math.PI * 0.45, tiltZ: 0, speed: 0.12, emissive: 0.4 },
    { radius: 1.55, tube: 0.014, tiltX: Math.PI * 0.3, tiltZ: Math.PI * 0.25, speed: 0.2, emissive: 0.5 },
    { radius: 1.15, tube: 0.01, tiltX: Math.PI * 0.6, tiltZ: Math.PI * 0.5, speed: 0.28, emissive: 0.6 }
  ];

  ringConfigs.forEach(function(cfg) {
    var mat = new THREE.MeshStandardMaterial({
      color: COLOR_AMBER.clone(),
      emissive: COLOR_AMBER.clone(),
      emissiveIntensity: cfg.emissive,
      roughness: 0.15,
      metalness: 0.9
    });
    var ring = new THREE.Mesh(new THREE.TorusGeometry(cfg.radius, cfg.tube, 24, 120), mat);
    ring.rotation.x = cfg.tiltX;
    ring.rotation.z = cfg.tiltZ;
    ring.userData = { speed: cfg.speed, mat: mat, baseTiltX: cfg.tiltX, baseTiltZ: cfg.tiltZ };
    ringGroup.add(ring);
    rings.push(ring);
  });

  var tickConfigs = [
    { ring: 0, count: 12, size: 0.04 },
    { ring: 1, count: 8, size: 0.035 },
    { ring: 2, count: 6, size: 0.03 }
  ];
  var tickMeshes = [];
  tickConfigs.forEach(function(tc) {
    var ring = rings[tc.ring];
    var radius = ringConfigs[tc.ring].radius;
    for (var i = 0; i < tc.count; i++) {
      var angle = (i / tc.count) * Math.PI * 2;
      var tickMat = new THREE.MeshStandardMaterial({
        color: COLOR_AMBER.clone(),
        emissive: COLOR_AMBER.clone(),
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.8
      });
      var tick = new THREE.Mesh(new THREE.BoxGeometry(0.015, tc.size, 0.015), tickMat);
      tick.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      tick.rotation.x = ring.rotation.x;
      tick.rotation.z = ring.rotation.z;
      ring.add(tick);
      tickMeshes.push({ mesh: tick, mat: tickMat });
    }
  });

  var coreMat = new THREE.MeshStandardMaterial({
    color: 0xfff0d0,
    emissive: 0xffb050,
    emissiveIntensity: 2.5,
    roughness: 0.1,
    metalness: 0.2
  });
  var core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 1), coreMat);
  scene.add(core);

  var coreGlowMat = new THREE.SpriteMaterial({
    map: emberGlow,
    color: 0xffd0a0,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  var coreGlow = new THREE.Sprite(coreGlowMat);
  coreGlow.scale.set(1.2, 1.2, 1);
  scene.add(coreGlow);

  var docs = [];
  var docMat = new THREE.MeshStandardMaterial({
    color: 0xe8e4dd,
    emissive: 0x4a3a20,
    emissiveIntensity: 0.15,
    roughness: 0.5,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  for (var i = 0; i < 6; i++) {
    var doc = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.48), docMat);
    doc.userData = {
      angle: (i / 6) * Math.PI * 2,
      radius: 1.8 + (i % 2) * 0.5,
      speed: 0.15 + (i % 3) * 0.06,
      yBase: (i - 2.5) * 0.22,
      yFreq: 0.3 + (i % 2) * 0.2,
      yAmp: 0.15 + (i % 3) * 0.05
    };
    scene.add(doc);
    docs.push(doc);
  }

  var verdictData = [
    { color: COLOR_SAGE, label: 'renew', angle: 0 },
    { color: COLOR_AMBER.clone(), label: 'watch', angle: Math.PI * 0.67 },
    { color: COLOR_VERMILION, label: 'cancel', angle: Math.PI * 1.33 }
  ];
  var verdicts = [];
  verdictData.forEach(function(vd) {
    var vMat = new THREE.MeshStandardMaterial({
      color: vd.color.clone(),
      emissive: vd.color.clone(),
      emissiveIntensity: 1.5,
      roughness: 0.2
    });
    var v = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), vMat);
    v.userData = { angle: vd.angle, radius: 2.0, mat: vMat, baseColor: vd.color.clone() };
    scene.add(v);

    var vGlowMat = new THREE.SpriteMaterial({
      map: emberGlow,
      color: vd.color.clone(),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    var vGlow = new THREE.Sprite(vGlowMat);
    vGlow.scale.set(0.4, 0.4, 1);
    v.add(vGlow);

    verdicts.push(v);
  });

  var particleCount = 120;
  var particlesGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(particleCount * 3);
  var particleData = [];
  for (var k = 0; k < particleCount; k++) {
    var theta = Math.random() * Math.PI * 2;
    var phi = (Math.random() - 0.5) * Math.PI * 0.5;
    var r = 2.5 + Math.random() * 3.5;
    positions[k * 3] = Math.cos(theta) * Math.cos(phi) * r;
    positions[k * 3 + 1] = Math.sin(phi) * r;
    positions[k * 3 + 2] = Math.sin(theta) * Math.cos(phi) * r;
    particleData.push({
      speed: 0.02 + Math.random() * 0.05,
      r: r,
      theta: theta,
      phi: phi,
      phiDrift: (Math.random() - 0.5) * 0.002
    });
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var particlesMat = new THREE.PointsMaterial({
    map: emberGlow,
    color: COLOR_AMBER.clone(),
    size: 0.06,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });
  var particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  var ambientMat = new THREE.SpriteMaterial({
    map: emberGlow,
    color: 0xc98a3a,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  var ambientGlow = new THREE.Sprite(ambientMat);
  ambientGlow.scale.set(6, 6, 1);
  ambientGlow.position.set(0, 0, -0.5);
  scene.add(ambientGlow);

  scene.add(new THREE.AmbientLight(0x2a1f10, 0.5));
  var key = new THREE.DirectionalLight(0xffd8a0, 1.4);
  key.position.set(3, 3, 5);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x4a7a6a, 0.25);
  fill.position.set(-4, -1, -2);
  scene.add(fill);
  var coreLight = new THREE.PointLight(0xffb060, 1.5, 5, 1.5);
  coreLight.position.set(0, 0, 0);
  scene.add(coreLight);

  document.addEventListener('mousemove', function(e) {
    targetMX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('scroll', function() {
    var h = document.documentElement;
    var st = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    scrollPct = max > 0 ? Math.min(st / max, 1) : 0;
  }, { passive: true });

  window.addEventListener('resize', function() {
    W = container.clientWidth; H = container.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  var time = 0;
  function animate(ts) {
    requestAnimationFrame(animate);
    time = ts * 0.001;

    entranceProgress = Math.min(entranceProgress + 0.012, 1);
    var ep = entranceProgress;
    var epEased = 1 - Math.pow(1 - ep, 3);

    mouseX += (targetMX - mouseX) * 0.04;
    mouseY += (targetMY - mouseY) * 0.04;

    ringGroup.scale.setScalar(epEased);
    ringGroup.rotation.y = time * 0.05 + mouseX * 0.3;
    ringGroup.rotation.x = mouseY * 0.15;

    var accentColor = COLOR_AMBER.clone().lerp(COLOR_DEEP, scrollPct);
    var glowColor = new THREE.Color(0xffd0a0).lerp(new THREE.Color(0xd49060), scrollPct);

    rings.forEach(function(ring, i) {
      var ud = ring.userData;
      var scrollBoost = 1 + scrollPct * 1.5;
      ring.rotation.z = ud.baseTiltZ + time * ud.speed * scrollBoost;
      ring.rotation.x = ud.baseTiltX + mouseY * 0.05 * (i + 1);

      ud.mat.color.copy(accentColor);
      ud.mat.emissive.copy(accentColor);
      ud.mat.emissiveIntensity = ud.emissive * (0.5 + scrollPct * 0.5) * epEased;
    });

    tickMeshes.forEach(function(t) {
      t.mat.color.copy(accentColor);
      t.mat.emissive.copy(accentColor);
    });

    var coreScale = epEased * (0.9 + Math.sin(time * 1.5) * 0.08);
    core.scale.setScalar(coreScale);
    core.rotation.x = time * 0.3;
    core.rotation.y = time * 0.4;
    coreMat.emissiveIntensity = 2.5 * epEased + scrollPct * 1.5;

    coreGlow.scale.setScalar(1.2 * epEased * (1 + Math.sin(time * 2) * 0.05));
    coreGlowMat.opacity = 0.6 * epEased;
    coreGlowMat.color.copy(glowColor);
    coreLight.intensity = 1.5 * epEased + scrollPct * 0.8;
    coreLight.color.copy(glowColor);

    docs.forEach(function(doc) {
      var d = doc.userData;
      d.angle += d.speed * 0.008 * (1 + scrollPct * 1.2);
      var r = d.radius * (1 + scrollPct * 0.15);
      doc.position.x = Math.cos(d.angle) * r;
      doc.position.z = Math.sin(d.angle) * r;
      doc.position.y = d.yBase + Math.sin(time * d.yFreq + d.angle) * d.yAmp;
      doc.rotation.y = -d.angle + Math.PI * 0.5;
      doc.rotation.x = Math.sin(time * 0.3 + d.angle) * 0.15;
      doc.scale.setScalar(epEased * (0.8 + scrollPct * 0.3));
      doc.visible = ep > 0.3;
    });

    verdicts.forEach(function(v, i) {
      var vd = v.userData;
      vd.angle += 0.003 * (1 + scrollPct * 0.5);
      v.position.x = Math.cos(vd.angle) * vd.radius;
      v.position.z = Math.sin(vd.angle) * vd.radius;
      v.position.y = Math.sin(vd.angle * 2 + i) * 0.3;
      v.scale.setScalar(epEased * (0.8 + Math.sin(time * 2 + i * 2) * 0.15));
      v.visible = ep > 0.5 && scrollPct > 0.02;
      vd.mat.emissiveIntensity = 1.5 + Math.sin(time * 3 + i * 2) * 0.5;
    });

    var posArray = particlesGeo.attributes.position.array;
    for (var p = 0; p < particleCount; p++) {
      var pd = particleData[p];
      pd.theta += pd.speed * 0.003;
      pd.phi += pd.phiDrift;
      var pr = pd.r * (1 + scrollPct * 0.2);
      posArray[p * 3] = Math.cos(pd.theta) * Math.cos(pd.phi) * pr;
      posArray[p * 3 + 1] = Math.sin(pd.phi) * pr;
      posArray[p * 3 + 2] = Math.sin(pd.theta) * Math.cos(pd.phi) * pr;
    }
    particlesGeo.attributes.position.needsUpdate = true;
    particlesMat.color.copy(accentColor);
    particlesMat.opacity = 0.5 * epEased;
    particles.rotation.y = time * 0.02;

    ambientGlowMat.opacity = 0.12 * epEased;
    ambientGlowMat.color.copy(accentColor);

    var camZ = 9 - scrollPct * 4.5;
    var camY = 0.3 + scrollPct * 0.8;
    camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (camY + mouseY * 0.3 - camera.position.y) * 0.03;
    camera.position.z += (camZ - camera.position.z) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
  console.log('[perch-3d] SCENE READY — animation loop started, ' + rings.length + ' rings, ' + docs.length + ' docs, ' + verdicts.length + ' verdicts, ' + particleCount + ' particles');
  } catch(e) {
    console.error('[perch-3d] FATAL ERROR:', e.message, e.stack);
  }
})();
