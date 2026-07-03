(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, mouse = { x: 0, y: 0, ax: 0, ay: 0 };
  const MAX = 55;
  const pts = [];

  function resize(){
    const target = document.getElementById('heroSection') || document.body;
    const r = target.getBoundingClientRect();
    W = canvas.width = window.innerWidth;
    H = canvas.height = r.bottom + 200;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
  }

  function Particle(){
    this.reset(true);
  }
  Particle.prototype.reset = function(init){
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + 20;
    this.r = 1 + Math.random() * 2.5;
    this.dx = (Math.random() - 0.5) * 0.3;
    this.dy = -(0.15 + Math.random() * 0.35);
    this.life = 0.2 + Math.random() * 0.6;
    this.pulse = Math.random() * Math.PI * 2;
    this.speed = 0.3 + Math.random() * 0.5;
  };
  Particle.prototype.step = function(){
    this.pulse += 0.02 * this.speed;
    this.x += this.dx + (mouse.ax * 0.008);
    this.y += this.dy;
    if (this.x < -10 || this.x > W + 10 || this.y < -10) this.reset(false);
  };
  Particle.prototype.draw = function(){
    const alpha = this.life * (0.5 + 0.5 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,138,58,${alpha})`;
    ctx.fill();
  };

  function init(){
    resize();
    for (let i = 0; i < MAX; i++) pts.push(new Particle());
    loop();
  }

  let raf;
  function loop(){
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) { p.step(); p.draw(); }
    raf = requestAnimationFrame(loop);
  }

  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / W) * 2 - 1;
    targetY = (e.clientY / H) * 2 - 1;
  });

  function smoothMouse(){
    mouse.ax += (targetX - mouse.ax) * 0.05;
    mouse.ay += (targetY - mouse.ay) * 0.05;
  }

  function fullLoop(){
    smoothMouse();
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) { p.step(); p.draw(); }
    raf = requestAnimationFrame(fullLoop);
  }

  window.addEventListener('resize', resize);
  init();
  raf = requestAnimationFrame(fullLoop);
})();