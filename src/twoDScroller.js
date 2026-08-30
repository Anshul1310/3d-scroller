import Lenis from '@studio-freight/lenis';

export class TwoDScroller {
  constructor(container) {
    this.container = container || document.body;
    this.lenis = null;
    this.rafId = null;
    this.currentScroll = 0;
    this.scrollVelocity = 0;
    this.targetVelocity = 0;
    this.currentBend = 0;
    this.isDestroyed = false;
    this.blocks = [];

    this.numBlocks = 10;
    this.images = ['/image1.png', '/image2.png', '/image3.png'];
  }

  mount() {
    this.renderDOM();
    this.initLenis();
    this.initImageBlocks();
    this.startLoop();
  }

  renderDOM() {
    const existing = document.getElementById('two-d-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'two-d-root';
    root.className = 'two-d-root';
    root.innerHTML = `
      <!-- 2D Image Gallery Stage -->
      <div class="gallery-2d-stage" id="gallery2dStage">
        <!-- Image blocks will be injected here -->
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

  initImageBlocks() {
    const stage = document.getElementById('gallery2dStage');
    if (!stage) return;
    stage.innerHTML = '';
    this.blocks = [];

    for (let i = 0; i < this.numBlocks; i++) {
      const imgPath = this.images[i % this.images.length];
      const blockEl = document.createElement('div');
      blockEl.className = 'gallery-2d-block';
      blockEl.dataset.index = i;

      blockEl.innerHTML = `
        <div class="block-mesh-sim">
          <div class="block-half block-upper">
            <img src="${imgPath}" alt="" class="img-base" />
            <div class="img-color-reveal">
              <img src="${imgPath}" alt="" class="img-color" />
            </div>
          </div>
          <div class="block-half block-lower">
            <img src="${imgPath}" alt="" class="img-base" />
            <div class="img-color-reveal">
              <img src="${imgPath}" alt="" class="img-color" />
            </div>
          </div>
        </div>
      `;

      stage.appendChild(blockEl);

      const blockObj = {
        element: blockEl,
        upperMesh: blockEl.querySelector('.block-upper'),
        lowerMesh: blockEl.querySelector('.block-lower'),
        revealUpper: blockEl.querySelector('.block-upper .img-color-reveal'),
        revealLower: blockEl.querySelector('.block-lower .img-color-reveal'),
        index: i,
        progressFraction: i / (this.numBlocks - 1),
        spiralAngle: i * -1.256, // matches 2*PI/5 spiral from 3D
        hoverProgress: 0,
        isHovered: false
      };

      // Hover sweep listeners (mimics 3D shader reveal)
      blockEl.addEventListener('mouseenter', () => {
        blockObj.isHovered = true;
      });
      blockEl.addEventListener('mouseleave', () => {
        blockObj.isHovered = false;
      });

      this.blocks.push(blockObj);
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
      this.targetVelocity = e.velocity * 0.01;
    });
  }

  update() {
    // Smooth velocity approach
    this.scrollVelocity += (this.targetVelocity - this.scrollVelocity) * 0.12;
    this.targetVelocity *= 0.88;

    // Velocity-based bend (replicating 3D upper-half vertex bend)
    this.currentBend += (this.scrollVelocity - this.currentBend) * 0.12;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollHeight > 0 ? this.currentScroll / scrollHeight : 0;

    const windowH = window.innerHeight;
    const windowW = window.innerWidth;

    this.blocks.forEach((block) => {
      // Hover reveal sweep calculation (left-to-right reveal)
      if (block.isHovered) {
        block.hoverProgress = Math.min(1, block.hoverProgress + 0.08);
      } else {
        block.hoverProgress = Math.max(0, block.hoverProgress - 0.04);
      }

      const wipePct = block.hoverProgress * 100;
      const clipStyle = `polygon(0 0, ${wipePct}% 0, ${wipePct}% 100%, 0 100%)`;
      if (block.revealUpper) block.revealUpper.style.clipPath = clipStyle;
      if (block.revealLower) block.revealLower.style.clipPath = clipStyle;

      // Calculate pseudo-3D cylindrical spiral positioning in 2D space
      // In 3D: cylinder radius=8, height=30, spiral step = -2*PI/5
      const blockScrollY = block.progressFraction * scrollHeight;
      const deltaY = blockScrollY - this.currentScroll;
      const normDelta = deltaY / (windowH * 0.8);

      // Cylindrical orbit angle based on index and scroll
      const currentAngle = block.spiralAngle - (scrollFraction * Math.PI * 4);
      const orbitX = Math.sin(currentAngle) * Math.min(280, windowW * 0.22);
      const orbitZ = Math.cos(currentAngle); // -1 (back) to +1 (front)
      const rotY = Math.sin(currentAngle) * -35;
      
      // Position block relative to viewport center
      const posY = (windowH * 0.5) + (deltaY * 0.85) - 120;
      const scale = Math.max(0.65, Math.min(1.15, 0.9 + orbitZ * 0.22));
      const opacity = Math.max(0.2, Math.min(1, (1.1 - Math.abs(normDelta) * 0.6) * (0.6 + (orbitZ + 1) * 0.25)));

      // Upper half bend effect (bending upper half with scroll velocity)
      const bendDeg = Math.max(-25, Math.min(25, this.currentBend * 40));

      block.element.style.transform = `
        translate3d(${orbitX}px, ${posY}px, 0px)
        rotateY(${rotY}deg)
        scale(${scale})
      `;
      block.element.style.opacity = opacity.toFixed(3);
      block.element.style.zIndex = Math.round(50 + orbitZ * 40);

      // Apply bend to upper half simulating the 3D vertex displacement
      if (block.upperMesh) {
        block.upperMesh.style.transform = `rotateX(${bendDeg}deg) skewX(${bendDeg * 0.3}deg)`;
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
    const root = document.getElementById('two-d-root');
    if (root) root.remove();
  }
}
