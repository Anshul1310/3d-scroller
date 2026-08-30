import Lenis from '@studio-freight/lenis';

export class TwoD3Scroller {
  constructor(container) {
    this.container = container || document.body;
    this.lenis = null;
    this.rafId = null;
    this.currentScroll = 0;
    this.scrollVelocity = 0;
    this.targetVelocity = 0;
    this.isDestroyed = false;
    this.shards = [];
    this.activeChapter = 0;

    this.images = ['/image1.png', '/image2.png', '/image3.png'];
    this.numChapters = 5; // matching 5 sections
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.onMouseMove = (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  mount() {
    this.renderDOM();
    this.initLenis();
    this.initVortexShards();
    window.addEventListener('mousemove', this.onMouseMove);
    this.startLoop();
  }

  renderDOM() {
    const existing = document.getElementById('two-d3-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'two-d3-root';
    root.className = 'two-d3-root';
    root.innerHTML = `
      <!-- Radial Kinetic Vortex Stage -->
      <div class="vortex-stage" id="vortexStage">
        <div class="vortex-core" id="vortexCore">
          <!-- Shards generated dynamically -->
        </div>
        <div class="vortex-aperture-ring"></div>
      </div>
      
      <main class="content">
        <section class="section" data-chapter="0">
          <h2>4 domains</h2>
        </section>
        <section class="section" data-chapter="1">
          <h2>42 hours</h2>
        </section>
        <section class="section" data-chapter="2">
          <h2>100+ team</h2>
        </section>
        <section class="section" data-chapter="3">
          <h2>infinite possibilities</h2>
        </section>
        <section class="section" data-chapter="4">
          <h2>TRANSFINITTE</h2>
        </section>
      </main>
    `;
    this.container.appendChild(root);
  }

  initVortexShards() {
    const core = document.getElementById('vortexCore');
    if (!core) return;
    core.innerHTML = '';
    this.shards = [];

    // Create 8 radial shards for each chapter (5 chapters * 8 shards = 40 shards)
    const shardsPerChapter = 8;
    for (let c = 0; c < this.numChapters; c++) {
      const imgPath = this.images[c % this.images.length];

      for (let s = 0; s < shardsPerChapter; s++) {
        const shardEl = document.createElement('div');
        shardEl.className = `vortex-shard shard-${s}`;
        shardEl.dataset.chapter = c;
        shardEl.dataset.shard = s;

        // Angle in radians around circle (0, 45, 90, 135, 180, 225, 270, 315 deg)
        const angleDeg = (s * 360) / shardsPerChapter;
        const angleRad = (angleDeg * Math.PI) / 180;

        shardEl.innerHTML = `
          <div class="shard-inner">
            <div class="shard-media">
              <img src="${imgPath}" alt="" class="v-img-base" />
              <div class="v-img-reveal">
                <img src="${imgPath}" alt="" class="v-img-color" />
              </div>
            </div>
            <div class="shard-flare"></div>
          </div>
        `;

        core.appendChild(shardEl);

        const shardObj = {
          element: shardEl,
          inner: shardEl.querySelector('.shard-inner'),
          reveal: shardEl.querySelector('.v-img-reveal'),
          chapter: c,
          shardIndex: s,
          angleDeg,
          angleRad,
          baseRadius: 180 + (s % 2) * 60, // staggering inner and outer radial rings
          hoverProgress: 0,
          isHovered: false
        };

        shardEl.addEventListener('mouseenter', () => {
          shardObj.isHovered = true;
        });
        shardEl.addEventListener('mouseleave', () => {
          shardObj.isHovered = false;
        });

        this.shards.push(shardObj);
      }
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
      this.targetVelocity = e.velocity * 0.015;
    });
  }

  update() {
    this.scrollVelocity += (this.targetVelocity - this.scrollVelocity) * 0.12;
    this.targetVelocity *= 0.88;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollHeight > 0 ? this.currentScroll / scrollHeight : 0;

    // Current continuous chapter progress (0.0 to 4.0)
    const exactChapter = scrollFraction * (this.numChapters - 1);

    // Dynamic rotation of the entire vortex stage driven by scroll
    const vortexSpin = scrollFraction * 720 + (this.scrollVelocity * 50);

    this.shards.forEach((shard) => {
      // Hover wipe sweep
      if (shard.isHovered) {
        shard.hoverProgress = Math.min(1, shard.hoverProgress + 0.08);
      } else {
        shard.hoverProgress = Math.max(0, shard.hoverProgress - 0.04);
      }

      const wipePct = shard.hoverProgress * 100;
      if (shard.reveal) {
        shard.reveal.style.clipPath = `polygon(0 0, ${wipePct}% 0, ${wipePct}% 100%, 0 100%)`;
      }

      // Distance from current chapter
      const chapterDiff = shard.chapter - exactChapter;
      const absDiff = Math.abs(chapterDiff);

      // Expansion / implosion physics based on distance to active chapter
      // When absDiff is 0 (current chapter): shards expand outward in full glory
      // When absDiff > 1: shards fold into micro core or collapse away
      const expandFactor = Math.max(0, 1 - absDiff);
      const isPast = chapterDiff < 0;

      // Radial position calculation
      const currentAngleRad = shard.angleRad + (vortexSpin * Math.PI) / 180;
      const radius = (shard.baseRadius * (0.3 + expandFactor * 0.95)) + (Math.abs(this.scrollVelocity) * 80);
      
      const posX = Math.cos(currentAngleRad) * radius + (this.mouse.x * 25);
      const posY = Math.sin(currentAngleRad) * radius + (this.mouse.y * 25);

      // 3D tilt & rotation facing outward along radial vector
      const rotZ = shard.angleDeg + (vortexSpin) + (this.scrollVelocity * 40);
      const rotX = Math.sin(currentAngleRad) * 28 * (1 - expandFactor);
      const rotY = Math.cos(currentAngleRad) * 28 * (1 - expandFactor);

      // Depth z: Active chapter floats forward, inactive recedes into deep tunnel
      const zDepth = (expandFactor * 140) - (absDiff * 250);
      const scale = Math.max(0.1, expandFactor * 1.05 + (1 - expandFactor) * 0.35);
      const opacity = Math.max(0, Math.min(1, Math.pow(expandFactor, 1.4)));

      shard.element.style.transform = `
        translate3d(${posX}px, ${posY}px, ${zDepth}px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        rotateZ(${rotZ}deg)
        scale(${scale})
      `;
      shard.element.style.opacity = opacity.toFixed(3);
      shard.element.style.zIndex = Math.round(50 + expandFactor * 50);
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
    const root = document.getElementById('two-d3-root');
    if (root) root.remove();
  }
}
