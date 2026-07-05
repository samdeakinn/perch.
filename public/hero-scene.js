(function(){
  var sceneEl = document.getElementById('heroScene3D');
  if (!sceneEl) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initScene;
    script.onerror = function() { sceneEl.innerHTML = '<div class="scene-fallback">🛡️</div>'; };
    document.head.appendChild(script);
  } catch(e) {
    sceneEl.innerHTML = '<div class="scene-fallback">🛡️</div>';
  }

  function initScene() {
    var container = sceneEl;
    var w = container.clientWidth;
    var h = container.clientHeight;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0.5, 8);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    var ambient = new THREE.AmbientLight(0x2a2018, 0.4);
    scene.add(ambient);

    var keyLight = new THREE.PointLight(0xd49440, 2, 15);
    keyLight.position.set(5, 3, 5);
    scene.add(keyLight);

    var fillLight = new THREE.PointLight(0xffffff, 0.5, 10);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    var rimLight = new THREE.PointLight(0xe8a850, 0.8, 8);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // Main geometry — abstract torus knot
    var torusGeo = new THREE.TorusKnotGeometry(1.8, 0.4, 128, 16, 2, 3);
    var torusMat = new THREE.MeshStandardMaterial({
      color: 0xd49440,
      roughness: 0.25,
      metalness: 0.8,
    });
    var torus = new THREE.Mesh(torusGeo, torusMat);
    torus.castShadow = true;
    torus.receiveShadow = true;
    scene.add(torus);

    // Wireframe overlay
    var wireGeo = new THREE.TorusKnotGeometry(1.82, 0.02, 64, 8, 2, 3);
    var wireMat = new THREE.MeshBasicMaterial({
      color: 0xe8a850,
      transparent: true,
      opacity: 0.15,
      wireframe: false
    });
    var wireframe = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireframe);

    // Inner ring
    var ringGeo = new THREE.TorusGeometry(1.2, 0.04, 32, 64);
    var ringMat = new THREE.MeshStandardMaterial({
      color: 0xe8a850,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x3a2010,
      emissiveIntensity: 0.3
    });
    var ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // Particles
    var particlesGeo = new THREE.BufferGeometry();
    var particleCount = 200;
    var positions = new Float32Array(particleCount * 3);
    var sizes = new Float32Array(particleCount);
    var velocities = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.random() * Math.PI;
      var r = 2.2 + Math.random() * 1.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 2 + 0.5;
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var particlesMat = new THREE.PointsMaterial({
      color: 0xd49440,
      size: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.6
    });
    var particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Mouse tracking state
    var mouseX = 0, mouseY = 0;
    var targetX = 0, targetY = 0;
    var isHovering = false;

    container.addEventListener('mousemove', function(e) {
      var rect = container.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      isHovering = true;
    });
    container.addEventListener('mouseleave', function() {
      targetX = 0; targetY = 0;
      isHovering = false;
    });
    // Touch support
    container.addEventListener('touchmove', function(e) {
      if (e.touches.length) {
        var rect = container.getBoundingClientRect();
        targetX = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
        targetY = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
        isHovering = true;
      }
    }, { passive: true });
    container.addEventListener('touchend', function() { targetX = 0; targetY = 0; });

    // Parallax on hero text
    var heroContent = document.querySelector('.hero-content');
    var heroVisual = document.querySelector('.hero-visual');

    // Render loop
    var clock = new THREE.Clock();
    var autoRot = 0;
    var lastTime = performance.now();
    var isVisible = true;
    var isMobile = window.innerWidth < 760;

    var observer = new IntersectionObserver(function(entries) {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    function animate(time) {
      requestAnimationFrame(animate);

      if (!isVisible) return;

      var dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse following
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Auto rotation
      autoRot += 0.003 * dt * 60;

      // Apply rotation with blending
      var baseRotY = autoRot + Math.PI * 0.15;
      var baseRotX = -Math.PI * 0.05;

      torus.rotation.y = baseRotY + mouseX * 0.6;
      torus.rotation.x = baseRotX + mouseY * 0.4;
      wireframe.rotation.y = torus.rotation.y;
      wireframe.rotation.x = torus.rotation.x;
      ring.rotation.y = torus.rotation.y + 0.3;
      ring.rotation.x = torus.rotation.x;
      particles.rotation.y = torus.rotation.y * 0.5;
      particles.rotation.x = torus.rotation.x * 0.5;

      // Animate particles
      var posArr = particles.geometry.attributes.position.array;
      for (var i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += velocities[i * 3 + 1] * (isHovering ? 0.3 : 1);
        if (Math.abs(posArr[i * 3 + 1]) > 3) velocities[i * 3 + 1] *= -1;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Pulsing ring glow
      var pulse = 1 + Math.sin(time * 0.001) * 0.05;
      keyLight.intensity = 2 * pulse;

      // Parallax on hero text
      if (heroContent && !isMobile) {
        heroContent.style.transform = 'translate(' + (mouseX * 12) + 'px,' + (mouseY * 8) + 'px)';
        heroContent.style.transition = 'transform 1.5s cubic-bezier(0.22,1,0.36,1)';
      }

      renderer.render(scene, camera);
    }

    // Resize
    window.addEventListener('resize', function() {
      var nw = container.clientWidth;
      var nh = container.clientHeight;
      isMobile = nw < 760;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      if (isMobile) renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    });

    requestAnimationFrame(animate);
  }
})();
