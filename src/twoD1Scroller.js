import Lenis from '@studio-freight/lenis';

export class TwoD1Scroller {
  constructor(container) {
    this.container = container || document.body;
    this.lenis = null;
    this.rafId = null;
    this.currentScroll = 0;
    this.targetVelocity = 0;
    this.scrollVelocity = 0;
    this.isDestroyed = false;
    this.cards = [];
    this.towerAngle = 0;

    this.numCards = 12;
    this.images = ['/image1.png', '/image2.png', '/image3.png'];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.onMouseMove = (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  mount() {
    this.renderDOM();
    this.initLenis();
    this.initCards();
    window.addEventListener('mousemove', this.onMouseMove);
    this.startLoop();
  }

  renderDOM() {
    const existing = document.getElementById('two-d1-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'two-d1-root';
    root.className = 'two-d1-root';
    root.innerHTML = `
      <div class="nav">
        <h1>2D1 KINETIC SCROLLER</h1>
        <div class="nav-routes" style="display:flex;gap:0.4rem;flex-wrap:wrap;">
          <a href="/2d" class="mode-switch-btn nav-route-link" data-route="/2d">2D SPIRAL</a>
          <a href="/2d2" class="mode-switch-btn nav-route-link" data-route="/2d2">2D2 DECK</a>
          <a href="/2d3" class="mode-switch-btn nav-route-link" data-route="/2d3">2D3 VORTEX</a>
          <a href="/2d4" class="mode-switch-btn nav-route-link" data-route="/2d4">2D4 FRAMES</a>
          <a href="/2d5" class="mode-switch-btn nav-route-link" data-route="/2d5">2D5 BOOK</a>
          <a href="/" class="mode-switch-btn nav-route-link" data-route="/">3D MODE</a>
        </div>
      </div>

      <!-- 2D Kinetic Parallax Stage -->
      <div class="kinetic-stage" id="kineticStage">
        <!-- 2D Geometric Center Totem (translating tower.glb into rotating 2D isometric wireframe) -->
        <div class="center-totem" id="centerTotem">
          <div class="totem-ring ring-1"></div>
          <div class="totem-ring ring-2"></div>
          <div class="totem-ring ring-3"></div>
          <div class="totem-spine"></div>
        </div>

        <!-- Flying Dual-Ribbon Parallax Stream -->
        <div class="kinetic-track" id="kineticTrack">
          <!-- Injected dynamically -->
        </div>
      </div>
      
      <main class="content">
        <section class="section">
          <h2>4 domains</h2>
        </section>
        <section class="section">
          <h2>42 hours</h2>
        </section>
        <section class="section">
          <h2>100+ team</h2>
        </section>
        <section class="section">
          <h2>infinite possibilities</h2>
        </section>
        <section class="section">
          <h2>TRANSFINITTE</h2>
        </section>
      </main>
    `;
    this.container.appendChild(root);
  }

  initCards() {
    const track = document.getElementById('kineticTrack');
    if (!track) return;
    track.innerHTML = '';
    this.cards = [];

    for (let i = 0; i < this.numCards; i++) {
      const imgPath = this.images[i % this.images.length];
      const isRightSide = i % 2 === 1;

      const cardEl = document.createElement('div');
      cardEl.className = `kinetic-card ${isRightSide ? 'side-right' : 'side-left'}`;
      cardEl.dataset.index = i;

      cardEl.innerHTML = `
        <div class="kinetic-card-inner">
          <div class="slice slice-top">
            <img src="${imgPath}" alt="" class="k-img-base" />
            <div class="k-img-reveal">
              <img src="${imgPath}" alt="" class="k-img-color" />
            </div>
          </div>
          <div class="slice slice-bottom">
            <img src="${imgPath}" alt="" class="k-img-base" />
            <div class="k-img-reveal">
              <img src="${imgPath}" alt="" class="k-img-color" />
            </div>
          </div>
          <div class="kinetic-card-glare"></div>
        </div>
      `;

      track.appendChild(cardEl);

      const cardObj = {
        element: cardEl,
        inner: cardEl.querySelector('.kinetic-card-inner'),
        sliceTop: cardEl.querySelector('.slice-top'),
        sliceBottom: cardEl.querySelector('.slice-bottom'),
        reveals: cardEl.querySelectorAll('.k-img-reveal'),
        index: i,
        isRightSide,
        progress: i / (this.numCards - 1),
        hoverProgress: 0,
        isHovered: false
      };

      cardEl.addEventListener('mouseenter', () => {
        cardObj.isHovered = true;
      });
      cardEl.addEventListener('mouseleave', () => {
        cardObj.isHovered = false;
      });

      this.cards.push(cardObj);
    }
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    this.lenis.on('scroll', (e) => {
      this.currentScroll = e.scroll;
      this.targetVelocity = e.velocity * 0.012;
    });
  }

  update() {
    this.scrollVelocity += (this.targetVelocity - this.scrollVelocity) * 0.12;
    this.targetVelocity *= 0.88;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollHeight > 0 ? this.currentScroll / scrollHeight : 0;

    const windowH = window.innerHeight;
    const windowW = window.innerWidth;

    // Rotate center 2D wireframe totem with scroll
    this.towerAngle += (this.scrollVelocity * 2.5);
    const totem = document.getElementById('centerTotem');
    if (totem) {
      totem.style.transform = `translate(-50%, -50%) rotate(${this.towerAngle}deg) scale(${1 + Math.sin(scrollFraction * Math.PI) * 0.15})`;
    }

    // Dynamic S-Curve Dual Stream Positioning
    this.cards.forEach((card) => {
      // Hover wipe sweep
      if (card.isHovered) {
        card.hoverProgress = Math.min(1, card.hoverProgress + 0.08);
      } else {
        card.hoverProgress = Math.max(0, card.hoverProgress - 0.04);
      }

      const wipePct = card.hoverProgress * 100;
      card.reveals.forEach((rev) => {
        rev.style.clipPath = `polygon(0 0, ${wipePct}% 0, ${wipePct}% 100%, 0 100%)`;
      });

      const cardScrollY = card.progress * scrollHeight;
      const distFromCenter = cardScrollY - this.currentScroll;
      const normalizedDist = distFromCenter / (windowH * 0.7);

      // S-curve wave offset
      const wavePhase = (card.index * 0.8) - (scrollFraction * 6);
      const sideMultiplier = card.isRightSide ? 1 : -1;
      
      // Horizontal fan-out from center with sine wave
      const spreadX = sideMultiplier * (Math.min(320, windowW * 0.26) + Math.sin(wavePhase) * 60) + (this.mouse.x * 15);
      const posY = (windowH * 0.5) + (distFromCenter * 0.9) - 110;

      // Depth perception via scale & skew wave
      const depthFactor = Math.cos(wavePhase); // -1 to 1
      const scale = Math.max(0.65, Math.min(1.12, 0.88 + depthFactor * 0.18));
      const rotZ = (sideMultiplier * -6) + (this.scrollVelocity * 35 * sideMultiplier);
      const rotY = (sideMultiplier * -22) + (Math.sin(wavePhase) * 15);
      const rotX = -normalizedDist * 20 - (this.mouse.y * 8);

      const opacity = Math.max(0.18, Math.min(1, 1 - Math.abs(normalizedDist) * 0.65));

      card.element.style.transform = `
        translate3d(${spreadX}px, ${posY}px, 0px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        rotateZ(${rotZ}deg)
        scale(${scale})
      `;
      card.element.style.opacity = opacity.toFixed(3);
      card.element.style.zIndex = Math.round(50 + depthFactor * 25);

      // Kinetic slice wave deformation (bending slices against each other based on velocity)
      const sliceBend = Math.max(-20, Math.min(20, this.scrollVelocity * 45));
      if (card.sliceTop) {
        card.sliceTop.style.transform = `rotateX(${sliceBend}deg) skewX(${sliceBend * 0.4}deg)`;
      }
      if (card.sliceBottom) {
        card.sliceBottom.style.transform = `rotateX(${-sliceBend * 0.4}deg)`;
      }
    });
  }

  startLoop() {
    const loop = (time) => {
      if (this.isDestroyed) return;
      if (this.lenis) this.lenis.raf(time);
      this.update();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  destroy() {
    this.isDestroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.lenis) this.lenis.destroy();
    window.removeEventListener('mousemove', this.onMouseMove);
    const root = document.getElementById('two-d1-root');
    if (root) root.remove();
  }
}
