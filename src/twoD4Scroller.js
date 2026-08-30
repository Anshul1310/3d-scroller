import Lenis from '@studio-freight/lenis';

export class TwoD4Scroller {
  constructor(container) {
    this.container = container || document.body;
    this.lenis = null;
    this.rafId = null;
    this.currentScroll = 0;
    this.scrollVelocity = 0;
    this.targetVelocity = 0;
    this.isDestroyed = false;
    this.frames = [];

    this.numFrames = 10;
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
    this.initPhotoFrames();
    window.addEventListener('mousemove', this.onMouseMove);
    this.startLoop();
  }

  renderDOM() {
    const existing = document.getElementById('two-d4-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'two-d4-root';
    root.className = 'two-d4-root';
    root.innerHTML = `
      <!-- Photo Frames Salon Stage -->
      <div class="gallery-wall-stage" id="galleryWallStage">
        <div class="frames-track" id="framesTrack">
          <!-- Frames generated dynamically -->
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

  initPhotoFrames() {
    const track = document.getElementById('framesTrack');
    if (!track) return;
    track.innerHTML = '';
    this.frames = [];

    for (let i = 0; i < this.numFrames; i++) {
      const imgPath = this.images[i % this.images.length];
      const isRight = i % 2 === 1;
      const isLandscape = i % 3 !== 0;

      const frameEl = document.createElement('div');
      frameEl.className = `photo-frame ${isRight ? 'align-right' : 'align-left'} ${isLandscape ? 'frame-landscape' : 'frame-portrait'}`;
      frameEl.dataset.index = i;

      frameEl.innerHTML = `
        <div class="hanging-wire"></div>
        <div class="frame-structure">
          <div class="matting-passepartout">
            <div class="artwork-window">
              <img src="${imgPath}" alt="" class="frame-img-base" />
              <div class="frame-img-reveal">
                <img src="${imgPath}" alt="" class="frame-img-color" />
              </div>
              <div class="museum-glass-glare"></div>
            </div>
          </div>
          <div class="frame-brass-tag">EXHIBIT 0${i + 1}</div>
        </div>
      `;

      track.appendChild(frameEl);

      const frameObj = {
        element: frameEl,
        structure: frameEl.querySelector('.frame-structure'),
        reveal: frameEl.querySelector('.frame-img-reveal'),
        index: i,
        isRight,
        progress: i / (this.numFrames - 1),
        baseX: (isRight ? 1 : -1) * (220 + (i % 3) * 60),
        swingAngle: 0,
        hoverProgress: 0,
        isHovered: false
      };

      frameEl.addEventListener('mouseenter', () => {
        frameObj.isHovered = true;
      });
      frameEl.addEventListener('mouseleave', () => {
        frameObj.isHovered = false;
      });

      this.frames.push(frameObj);
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
    const windowH = window.innerHeight;
    const windowW = window.innerWidth;

    this.frames.forEach((frame) => {
      // Hover wipe sweep
      if (frame.isHovered) {
        frame.hoverProgress = Math.min(1, frame.hoverProgress + 0.08);
      } else {
        frame.hoverProgress = Math.max(0, frame.hoverProgress - 0.04);
      }

      const wipePct = frame.hoverProgress * 100;
      if (frame.reveal) {
        frame.reveal.style.clipPath = `polygon(0 0, ${wipePct}% 0, ${wipePct}% 100%, 0 100%)`;
      }

      const frameScrollY = frame.progress * scrollHeight;
      const distFromCenter = frameScrollY - this.currentScroll;
      const normDist = distFromCenter / (windowH * 0.8);

      // Hanging frame pendulum inertia swing physics
      const targetSwing = Math.max(-15, Math.min(15, this.scrollVelocity * (frame.isRight ? 28 : -28)));
      frame.swingAngle += (targetSwing - frame.swingAngle) * 0.1;

      // Position along gallery wall
      const posX = (frame.isRight ? 1 : -1) * Math.min(280, windowW * 0.24) + (this.mouse.x * 12);
      const posY = (windowH * 0.5) + (distFromCenter * 0.95) - 140;

      // Frame 2.5D perspective tilt (like framed art viewing angle)
      const rotZ = frame.swingAngle + (frame.isRight ? -2 : 2);
      const rotY = (frame.isRight ? -14 : 14) + (this.mouse.x * 6);
      const rotX = -normDist * 16 - (this.mouse.y * 6);
      const scale = Math.max(0.75, Math.min(1.08, 1 - Math.abs(normDist) * 0.2));
      const opacity = Math.max(0.2, Math.min(1, 1 - Math.abs(normDist) * 0.6));

      frame.element.style.transform = `
        translate3d(${posX}px, ${posY}px, 0px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        rotateZ(${rotZ}deg)
        scale(${scale})
      `;
      frame.element.style.opacity = opacity.toFixed(3);
      frame.element.style.zIndex = Math.round(50 - Math.abs(normDist * 20));
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
    const root = document.getElementById('two-d4-root');
    if (root) root.remove();
  }
}
