import Lenis from '@studio-freight/lenis';

export class TwoD5Scroller {
  constructor(container) {
    this.container = container || document.body;
    this.lenis = null;
    this.rafId = null;
    this.currentScroll = 0;
    this.scrollVelocity = 0;
    this.targetVelocity = 0;
    this.isDestroyed = false;
    this.pages = [];

    this.chapters = [
      { id: 1, title: '4 domains', img: '/image1.png' },
      { id: 2, title: '42 hours', img: '/image2.png' },
      { id: 3, title: '100+ team', img: '/image3.png' },
      { id: 4, title: 'infinite possibilities', img: '/image1.png' },
      { id: 5, title: 'TRANSFINITTE', img: '/image2.png' }
    ];

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.onMouseMove = (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  mount() {
    this.renderDOM();
    this.initLenis();
    this.initBookPages();
    window.addEventListener('mousemove', this.onMouseMove);
    this.startLoop();
  }

  renderDOM() {
    const existing = document.getElementById('two-d5-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'two-d5-root';
    root.className = 'two-d5-root';
    root.innerHTML = `
      <!-- Book Stage -->
      <div class="book-stage" id="bookStage">
        <div class="book-wrapper" id="bookWrapper">
          <div class="book-cover-back"></div>
          <div class="book-spine"></div>
          
          <!-- Static Base Spread Underneath -->
          <div class="book-base-spread">
            <div class="page-side page-left-base" id="baseLeft">
              <div class="page-content">
                <span class="folio-tag">CHAPTER 01</span>
                <h2 class="book-chapter-title">4 domains</h2>
              </div>
            </div>
            <div class="page-side page-right-base" id="baseRight">
              <div class="page-photo-wrap">
                <img src="/image2.png" alt="" class="base-img" />
              </div>
            </div>
          </div>

          <!-- Dynamic Flipping Book Leaves -->
          <div class="book-leaves" id="bookLeaves">
            <!-- Leaves generated dynamically -->
          </div>
        </div>
      </div>
      
      <!-- Virtual scroll height driving page flips -->
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

  initBookPages() {
    const leavesContainer = document.getElementById('bookLeaves');
    if (!leavesContainer) return;
    leavesContainer.innerHTML = '';
    this.pages = [];

    // Create 4 flippable leaves for 5 chapters
    for (let i = 0; i < this.chapters.length - 1; i++) {
      const currentChapter = this.chapters[i];
      const nextChapter = this.chapters[i + 1];

      const leafEl = document.createElement('div');
      leafEl.className = 'book-leaf';
      leafEl.dataset.leafIndex = i;

      leafEl.innerHTML = `
        <!-- Front side of turning page (Facing right initially) -->
        <div class="leaf-face leaf-front">
          <div class="page-photo-wrap">
            <img src="${currentChapter.img}" alt="" class="p-img-base" />
            <div class="p-img-reveal">
              <img src="${currentChapter.img}" alt="" class="p-img-color" />
            </div>
            <div class="page-sheen"></div>
          </div>
          <div class="page-corner-curl"></div>
        </div>

        <!-- Back side of turning page (Facing left when turned) -->
        <div class="leaf-face leaf-back">
          <div class="page-content">
            <span class="folio-tag">CHAPTER 0${nextChapter.id}</span>
            <h2 class="book-chapter-title">${nextChapter.title}</h2>
          </div>
          <div class="page-shadow-back"></div>
        </div>
      `;

      leavesContainer.appendChild(leafEl);

      const leafObj = {
        element: leafEl,
        reveal: leafEl.querySelector('.p-img-reveal'),
        index: i,
        hoverProgress: 0,
        isHovered: false
      };

      leafEl.addEventListener('mouseenter', () => {
        leafObj.isHovered = true;
      });
      leafEl.addEventListener('mouseleave', () => {
        leafObj.isHovered = false;
      });

      this.pages.push(leafObj);
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
    this.scrollVelocity += (this.targetVelocity - this.scrollVelocity) * 0.12;
    this.targetVelocity *= 0.88;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollHeight > 0 ? this.currentScroll / scrollHeight : 0;

    // Total flippable leaves = 4
    const totalLeaves = this.pages.length;
    const continuousLeafProgress = scrollFraction * totalLeaves;

    // 3D Folio tilt from mouse
    const book = document.getElementById('bookWrapper');
    if (book) {
      const rotY = (this.mouse.x * 6);
      const rotX = 12 - (this.mouse.y * 6);
      book.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1)`;
    }

    this.pages.forEach((leaf) => {
      // Hover wipe
      if (leaf.isHovered) {
        leaf.hoverProgress = Math.min(1, leaf.hoverProgress + 0.08);
      } else {
        leaf.hoverProgress = Math.max(0, leaf.hoverProgress - 0.04);
      }

      const wipePct = leaf.hoverProgress * 100;
      if (leaf.reveal) {
        leaf.reveal.style.clipPath = `polygon(0 0, ${wipePct}% 0, ${wipePct}% 100%, 0 100%)`;
      }

      // Calculate exact turn rotation for this leaf (from 0deg to -180deg)
      const leafOffset = continuousLeafProgress - leaf.index;
      const turnFraction = Math.max(0, Math.min(1, leafOffset));

      // Ease page turn rotation
      const easedTurn = turnFraction < 0.5 
        ? 2 * turnFraction * turnFraction 
        : 1 - Math.pow(-2 * turnFraction + 2, 2) / 2;

      const angleDeg = easedTurn * -180;
      
      // Page lift curl during middle of turn
      const liftFactor = Math.sin(turnFraction * Math.PI);
      const curlZ = liftFactor * 45;
      const paperWave = this.scrollVelocity * 25 * liftFactor;

      leaf.element.style.transform = `
        rotateY(${angleDeg}deg)
        rotateZ(${paperWave}deg)
        translateZ(${curlZ}px)
      `;

      // z-index stacking: turned pages stack on left, unturned stack on right
      if (angleDeg < -90) {
        leaf.element.style.zIndex = Math.round(10 + leaf.index * 5);
      } else {
        leaf.element.style.zIndex = Math.round(10 + (totalLeaves - leaf.index) * 5);
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
    const root = document.getElementById('two-d5-root');
    if (root) root.remove();
  }
}
