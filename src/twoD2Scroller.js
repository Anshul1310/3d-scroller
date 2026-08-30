import Lenis from '@studio-freight/lenis';

export class TwoD2Scroller {
  constructor(container) {
    this.container = container || document.body;
    this.lenis = null;
    this.rafId = null;
    this.currentScroll = 0;
    this.scrollVelocity = 0;
    this.targetVelocity = 0;
    this.isDestroyed = false;
    this.cards = [];

    this.numCards = 10;
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
    const existing = document.getElementById('two-d2-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'two-d2-root';
    root.className = 'two-d2-root';
    root.innerHTML = `
      <!-- Horizontal 2.5D Coverflow Stage -->
      <div class="horizontal-stage" id="horizontalStage">
        <div class="deck-track" id="deckTrack">
          <!-- Cards injected dynamically -->
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
    const track = document.getElementById('deckTrack');
    if (!track) return;
    track.innerHTML = '';
    this.cards = [];

    for (let i = 0; i < this.numCards; i++) {
      const imgPath = this.images[i % this.images.length];
      const cardEl = document.createElement('div');
      cardEl.className = 'deck-card';
      cardEl.dataset.index = i;

      cardEl.innerHTML = `
        <div class="deck-card-inner">
          <div class="deck-media">
            <img src="${imgPath}" alt="" class="d-img-base" />
            <div class="d-img-reveal">
              <img src="${imgPath}" alt="" class="d-img-color" />
            </div>
            <div class="deck-glare"></div>
          </div>
          <div class="deck-index-tag">0${i + 1}</div>
        </div>
      `;

      track.appendChild(cardEl);

      const cardObj = {
        element: cardEl,
        inner: cardEl.querySelector('.deck-card-inner'),
        reveal: cardEl.querySelector('.d-img-reveal'),
        index: i,
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

    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    // Horizontal Coverflow / Carousel Transform
    const totalSpan = (this.numCards - 1) * 360; // total horizontal distance
    const trackCenterOffset = scrollFraction * totalSpan;

    this.cards.forEach((card) => {
      // Hover wipe sweep
      if (card.isHovered) {
        card.hoverProgress = Math.min(1, card.hoverProgress + 0.08);
      } else {
        card.hoverProgress = Math.max(0, card.hoverProgress - 0.04);
      }

      const wipePct = card.hoverProgress * 100;
      if (card.reveal) {
        card.reveal.style.clipPath = `polygon(0 0, ${wipePct}% 0, ${wipePct}% 100%, 0 100%)`;
      }

      // Card relative position from center of screen
      const cardBaseX = card.index * 360;
      const distX = cardBaseX - trackCenterOffset;
      const normDist = distX / (windowW * 0.5); // -1 (left edge) to 1 (right edge)

      // 2.5D Coverflow rotation and parabolic arc
      const rotY = Math.max(-55, Math.min(55, normDist * -45));
      const zDepth = Math.max(-400, 100 - Math.abs(distX) * 0.65);
      const arcY = Math.abs(normDist) * 35; // subtle curved horizon
      const scale = Math.max(0.68, Math.min(1.15, 1 - Math.abs(normDist) * 0.28));
      
      // Velocity dynamic skew / inertia lean
      const velLean = Math.max(-18, Math.min(18, this.scrollVelocity * 35));
      const rotZ = (velLean * (1 - Math.abs(normDist) * 0.3)) + (normDist * 4);

      const opacity = Math.max(0.2, Math.min(1, 1.1 - Math.abs(normDist) * 0.7));

      card.element.style.transform = `
        translate3d(${distX + (this.mouse.x * 20)}px, ${arcY + (this.mouse.y * 10)}px, ${zDepth}px)
        rotateY(${rotY}deg)
        rotateZ(${rotZ}deg)
        scale(${scale})
      `;
      card.element.style.opacity = opacity.toFixed(3);
      card.element.style.zIndex = Math.round(100 + zDepth);
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
    const root = document.getElementById('two-d2-root');
    if (root) root.remove();
  }
}
