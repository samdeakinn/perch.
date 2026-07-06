(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var isMobile = window.innerWidth < 768;

  var container = document.getElementById('observatoryScene');
  if (!container || prefersReduced || isTouch || isMobile || typeof THREE === 'undefined') return;
  container.style.display = 'block';

  var W = container.clientWidth;
  var H = container.clientHeight;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
  camera.position.set(0, 0.2, 8);

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  var scrollPct = 0;
  var mouseX = 0, mouseY = 0, targetMX = 0, targetMY = 0;

  // ═══ Ring (the lens) ═══
  var ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xc98a3a,
    emissive: 0x8a5a1a,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8
  });
  var ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.03, 32, 100), ringMaterial);
  ring.rotation.x = Math.PI * 0.55;
  scene.add(ring);

  // ═══ Inner lens disc ═══
  var discMaterial = new THREE.MeshStandardMaterial({
    color: 0xc98a3a,
    emissive: 0x3a2a10,
    emissiveIntensity: 0.3,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.12
  });
  var disc = new THREE.Mesh(new THREE.CircleGeometry(1.15, 64), discMaterial);
  disc.rotation.x = Math.PI * 0.55;
  scene.add(disc);

  // ═══ Documents (thin boxes orbiting) ═══
  var docs = [];
  var docMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8e4dd,
    roughness: 0.4,
    metalness: 0.1
  });
  for (var i = 0; i < 4; i++) {
    var doc = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.55, 1, 1, 1), docMaterial);
    doc.userData = {
      angle: (i / 4) * Math.PI * 2,
      radius: 1.6 + i * 0.2,
      speed: 0.3 + i * 0.1,
      yOffset: (i - 1.5) * 0.3
    };
    scene.add(doc);
    docs.push(doc);
  }

  // ═══ Verdict indicators ═══
  var verdictColors = [0x5c9870, 0xc47848, 0xd46a5a];
  var verdicts = [];
  for (var j = 0; j < 3; j++) {
    var v = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshStandardMaterial({
      color: verdictColors[j],
      emissive: verdictColors[j],
      emissiveIntensity: 0.5,
      roughness: 0.2
    }));
    v.userData = { angle: (j / 3) * Math.PI * 2, radius: 1.35, y: (j - 1) * 0.25 };
    scene.add(v);
    verdicts.push(v);
  }

  // ═══ Particles ═══
  var particlesGeo = new THREE.BufferGeometry();
  var particleCount = 80;
  var positions = new Float32Array(particleCount * 3);
  var particleData = [];
  for (var k = 0; k < particleCount; k++) {
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.random() * Math.PI * 0.6;
    var r = 1.8 + Math.random() * 2.5;
    positions[k * 3] = Math.cos(theta) * Math.cos(phi) * r;
    positions[k * 3 + 1] = Math.sin(phi) * r;
    positions[k * 3 + 2] = Math.sin(theta) * Math.cos(phi) * r;
    particleData.push({ speed: 0.1 + Math.random() * 0.3, r: r, theta: theta, phi: phi });
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var particlesMat = new THREE.PointsMaterial({
    color: 0xc98a3a,
    size: 0.02,
    transparent: true,
    opacity: 0.4
  });
  var particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // ═══ Lighting ═══
  scene.add(new THREE.AmbientLight(0x2a1a08, 0.6));
  var key = new THREE.DirectionalLight(0xffd8a0, 1.2);
  key.position.set(3, 2, 4);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x4a8a6a, 0.3);
  fill.position.set(-3, -1, -2);
  scene.add(fill);

  // ═══ Mouse tracking ═══
  document.addEventListener('mousemove', function(e) {
    targetMX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ═══ Scroll tracking ═══
  window.addEventListener('scroll', function() {
    var h = document.documentElement;
    var st = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    scrollPct = max > 0 ? Math.min(st / max, 1) : 0;
  }, { passive: true });

  // ═══ Resize ═══
  window.addEventListener('resize', function() {
    W = container.clientWidth; H = container.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  // ═══ Render loop ═══
  var time = 0;
  function animate(ts) {
    requestAnimationFrame(animate);
    time = ts * 0.001;

    mouseX += (targetMX - mouseX) * 0.05;
    mouseY += (targetMY - mouseY) * 0.05;

    // Scene group tilt from mouse
    ring.rotation.y = time * 0.15 + mouseX * 0.4;
    ring.rotation.x = Math.PI * 0.55 + mouseY * 0.15;
    disc.rotation.copy(ring.rotation);

    // Accent shift: amber → rose-gold
    var accentColor = new THREE.Color(0xc98a3a).lerp(new THREE.Color(0xc47848), scrollPct);
    ringMaterial.color.copy(accentColor);
    ringMaterial.emissive.copy(accentColor).multiplyScalar(0.5);
    discMaterial.color.copy(accentColor);
    discMaterial.emissive.copy(accentColor).multiplyScalar(0.25);
    particlesMat.color.copy(accentColor);

    // Ring scale pulses with scroll
    var ringScale = 1 + scrollPct * 0.2;
    ring.scale.setScalar(ringScale);
    disc.scale.setScalar(ringScale);

    // Documents orbit
    docs.forEach(function(doc) {
      var d = doc.userData;
      d.angle += d.speed * (0.5 + scrollPct * 1.5) * 0.01;
      doc.position.x = Math.cos(d.angle) * d.radius * (1 + scrollPct * 0.4);
      doc.position.z = Math.sin(d.angle) * d.radius * (1 + scrollPct * 0.4);
      doc.position.y = d.yOffset;
      doc.rotation.y += 0.01;
      doc.rotation.x = Math.sin(time * 0.5) * 0.1;
      doc.scale.setScalar(0.7 + scrollPct * 0.4);
    });

    // Verdict indicators
    verdicts.forEach(function(v) {
      var vd = v.userData;
      vd.angle += 0.005 * (0.5 + scrollPct * 0.5);
      v.position.x = Math.cos(vd.angle) * vd.radius;
      v.position.z = Math.sin(vd.angle) * vd.radius;
      v.position.y = vd.y;
      v.visible = scrollPct > 0.05;
    });

    // Particles
    var posArray = particlesGeo.attributes.position.array;
    for (var p = 0; p < particleCount; p++) {
      var pd = particleData[p];
      pd.theta += pd.speed * 0.003;
      posArray[p * 3] = Math.cos(pd.theta) * Math.cos(pd.phi) * pd.r * (1 + scrollPct * 0.3);
      posArray[p * 3 + 1] = Math.sin(pd.phi) * pd.r;
      posArray[p * 3 + 2] = Math.sin(pd.theta) * Math.cos(pd.phi) * pd.r * (1 + scrollPct * 0.3);
    }
    particlesGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
