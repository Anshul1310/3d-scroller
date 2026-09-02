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
    this.activeIndex = 0;
    this.hoveredFilmIndex = -1;
    this.isDragging = false;
    this.dragStartY = 0;
    this.dragStartScroll = 0;

    // 6 Films from the Disney Launchpad poster
    this.films = [
      {
        id: 1,
        director: 'AQSA ALTAF',
        title: 'AMERICAN EID',
        tagline: 'Two sisters celebrate Eid in a new world',
        imgSrc: '/image1.png',
        image: null
      },
      {
        id: 2,
        director: 'HAO ZHENG',
        title: 'DINNER IS SERVED',
        tagline: 'Ambition and identity at an elite school',
        imgSrc: '/image2.png',
        image: null
      },
      {
        id: 3,
        director: 'ANN MARIE PACE',
        title: 'GROWING FANGS',
        tagline: 'Half human, half vampire, fully trying to fit in',
        imgSrc: '/image3.png',
        image: null
      },
      {
        id: 4,
        director: 'STEFANIE ABEL HOROWITZ',
        title: "LET'S BE TIGERS",
        tagline: 'Grief and healing through a playful afternoon',
        imgSrc: '/image1.png',
        image: null
      },
      {
        id: 5,
        director: 'JESSICA MENDEZ SIQUEIROS',
        title: 'THE LAST OF THE CHUPACABRAS',
        tagline: 'A lonely grandmother meets a legendary creature',
        imgSrc: '/image2.png',
        image: null
      },
      {
        id: 6,
        director: 'MOXIE PENG',
        title: 'THE LITTLE PRINCE(SS)',
        tagline: 'A 7-year-old discovers ballet and self-expression',
        imgSrc: '/image3.png',
        image: null
      }
    ];

    // Number of total segments around the full loop (24 segments = 4 repeats of 6 films)
    this.numTotalSegments = 24;
    this.anglePerSegment = (Math.PI * 2) / this.numTotalSegments; // in radians (~15 deg)

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, canvasX: 0, canvasY: 0 };
    this.currentRotation = 0;
    this.targetRotation = 0;

    this.onMouseMove = (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;

      const rect = this.canvas ? this.canvas.getBoundingClientRect() : null;
      if (rect) {
        this.mouse.canvasX = e.clientX - rect.left;
        this.mouse.canvasY = e.clientY - rect.top;
      }
    };

    this.onMouseDown = (e) => {
      // Allow dragging on right panel or canvas
      if (e.target.closest('.poster-left-panel') || e.target.closest('.app-global-nav')) return;
      this.isDragging = true;
      this.dragStartY = e.clientY;
      this.dragStartScroll = this.currentScroll;
    };

    this.onMouseMoveDrag = (e) => {
      if (!this.isDragging) return;
      const deltaY = (e.clientY - this.dragStartY) * 3;
      if (this.lenis) {
        this.lenis.scrollTo(this.dragStartScroll - deltaY, { immediate: true });
      }
    };

    this.onMouseUp = () => {
      this.isDragging = false;
    };

    this.onResize = () => {
      this.resizeCanvas();
    };
  }

  mount() {
    this.preloadImages();
    this.renderDOM();
    this.initCanvas();
    this.initLenis();
    this.bindEvents();
    this.startLoop();
  }

  preloadImages() {
    this.films.forEach((film) => {
      const img = new Image();
      img.src = film.imgSrc;
      film.image = img;
    });
  }

  renderDOM() {
    const existing = document.getElementById('two-d5-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'two-d5-root';
    root.className = 'two-d5-root';
    root.innerHTML = `
      <!-- Paper grain texture overlay -->
      <div class="poster-paper-bg"></div>
      <div class="poster-texture-overlay"></div>
      <div class="poster-vignette"></div>

      <!-- Main Poster Canvas Stage -->
      <div class="poster-stage" id="posterStage">
        
        <!-- Left Editorial Typography & Branding (Matches poster exactly) -->
        <div class="poster-left-panel">
          
          <!-- Top Subtitle and Directors List -->
          <div class="editorial-top-section">
            <div class="editorial-heading-group">
              <h2 class="poster-eyebrow-1">SIX ORIGINAL SHORT FILMS</h2>
              <h3 class="poster-eyebrow-2">FROM SIX UNIQUE PERSPECTIVES:</h3>
            </div>

            <!-- 6 Directors List -->
            <ul class="directors-list" id="directorsList">
              ${this.films.map((film, idx) => `
                <li class="director-item ${idx === 0 ? 'active' : ''}" data-film-index="${idx}">
                  <button class="director-btn" type="button">
                    <span class="director-bullet"></span>
                    <span class="director-name">${film.director}</span>
                  </button>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Central Feature Details Badge -->
          <div class="film-active-preview" id="filmActivePreview">
            <div class="preview-number" id="previewNumber">PERSPECTIVE 01 OF 06</div>
            <div class="preview-title" id="previewTitle">${this.films[0].title}</div>
            <div class="preview-tagline" id="previewTagline">${this.films[0].tagline}</div>
          </div>

          <!-- Bottom Hero Branding -->
          <div class="editorial-bottom-section">
            
            <!-- Disney Logo -->
            <div class="disney-brand-wrap">
              <svg class="disney-brand-svg" viewBox="0 0 140 45" fill="currentColor">
                <path d="M16.2,28.8c-3.1,0-5.5-2-5.5-4.6c0-3.1,2.8-5.3,6.5-5.3c1.7,0,3.3,0.5,4.5,1.2l1-3.3 c-1.5-0.6-3.5-1.2-5.7-1.2c-5.9,0-10.4,3.6-10.4,8.7c0,4.6,4,7.8,9.2,7.8c2.3,0,4.3-0.5,5.7-1.3l-1-3.2 C19.4,28.3,17.9,28.8,16.2,28.8z"/>
                <path d="M28.1,16.2h4.1v15.6h-4.1V16.2z M30.1,10.2c-1.4,0-2.4,1-2.4,2.4c0,1.4,1,2.4,2.4,2.4c1.4,0,2.4-1,2.4-2.4 C32.5,11.2,31.5,10.2,30.1,10.2z"/>
                <path d="M48.2,25.3c0-4.2-2.9-6.6-6.9-6.6c-4.5,0-7.4,3.1-7.4,7c0,4.2,3.1,6.6,7.2,6.6 C45.5,32.3,48.2,29.5,48.2,25.3z M37.9,25.6c0-2.3,1.4-3.7,3.3-3.7c1.9,0,3.1,1.4,3.1,3.7c0,2.3-1.3,3.7-3.2,3.7 C39.2,29.3,37.9,27.9,37.9,25.6z"/>
                <path d="M60.9,16.2h4v2.4c1.1-1.7,2.9-2.7,4.8-2.7c3.9,0,6.2,2.7,6.2,7.3v8.6h-4.1v-7.9c0-2.7-1.1-4.2-3.3-4.2 c-1.9,0-3.6,1.4-3.6,3.9v8.2h-4V16.2z"/>
                <path d="M87.4,25.1c0.3,4,2.7,6.1,6,6.1c2.2,0,4-0.8,5.1-1.8l2,2.6c-1.8,1.7-4.6,2.7-7.7,2.7 c-5.9,0-9.6-4-9.6-9.1c0-5.2,4-9.5,9.5-9.5c5.5,0,8.8,4,8.8,8.6c0,0.5,0,1.1-0.1,1.4H87.4z M95.4,22.4 c-0.1-2.3-1.5-4-3.7-4c-2.2,0-3.7,1.5-4.2,4H95.4z"/>
                <path d="M107.8,16.2l4,10.6l3.7-10.6h4.3l-6.1,15.5c-1.4,3.5-3.3,4.9-6.4,4.9c-1,0-2-0.1-2.8-0.5l0.8-3.1 c0.5,0.3,1.1,0.4,1.8,0.4c1.5,0,2.5-0.8,3.2-2.4l0.5-1.3l-5.7-13.4H107.8z"/>
              </svg>
            </div>

            <!-- LAUNCHPAD with camera on P -->
            <div class="launchpad-brand-container">
              <div class="launchpad-word">
                <span class="lp-letter">L</span>
                <span class="lp-letter">A</span>
                <span class="lp-letter">U</span>
                <span class="lp-letter">N</span>
                <span class="lp-letter">C</span>
                <span class="lp-letter">H</span>
                <div class="lp-p-camera-box">
                  <svg class="camera-icon-svg" viewBox="0 0 54 40" fill="currentColor">
                    <!-- Projector Camera Silhouette -->
                    <polygon points="36,12 52,3 52,28 36,19" fill="#111111"/>
                    <rect x="8" y="7" width="30" height="22" rx="3" fill="#111111"/>
                    <circle cx="16" cy="5" r="4" fill="#111111"/>
                    <circle cx="28" cy="5" r="4" fill="#111111"/>
                    <!-- Projection Beam Glow -->
                    <polygon points="36,15 0,6 0,26 36,15" fill="rgba(255,255,255,0.45)" class="camera-light-beam"/>
                  </svg>
                  <span class="lp-letter lp-letter-p">P</span>
                </div>
                <span class="lp-letter">A</span>
                <span class="lp-letter">D</span>
              </div>
              <div class="launchpad-tagline">A SHORT FILM COLLECTION</div>
            </div>

            <!-- Disney+ Footer Badge -->
            <div class="streaming-footer-banner">
              <div class="dplus-badge">
                <span class="dplus-logo-main">Disney</span><span class="dplus-logo-plus">+</span>
              </div>
              <div class="dplus-subtext">Original Short Films Streaming May 28</div>
            </div>

          </div>

        </div>

        <!-- Right Side: Sweeping Circular Arc Canvas -->
        <div class="poster-right-panel" id="posterRightPanel">
          <canvas id="arcCanvas" class="arc-canvas"></canvas>
        </div>

        <!-- Scroll Indicator Hint -->
        <div class="reel-scroll-hint">
          <span class="hint-arrow">↓</span>
          <span class="hint-label">SCROLL REEL</span>
        </div>

      </div>

      <!-- Virtual Lenis Content Spine -->
      <main class="virtual-scroll-spine">
        <div class="spine-block"></div>
        <div class="spine-block"></div>
        <div class="spine-block"></div>
        <div class="spine-block"></div>
        <div class="spine-block"></div>
        <div class="spine-block"></div>
      </main>
    `;
    this.container.appendChild(root);
  }

  initCanvas() {
    this.canvas = document.getElementById('arcCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }

  resizeCanvas() {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.scale(dpr, dpr);
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
      infinite: false
    });

    this.lenis.on('scroll', (e) => {
      this.currentScroll = e.scroll;
      this.targetVelocity = e.velocity * 0.015;
    });
  }

  bindEvents() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMoveDrag);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('resize', this.onResize);

    // Canvas click to select segment
    if (this.canvas) {
      this.canvas.addEventListener('click', (e) => {
        if (this.hoveredFilmIndex >= 0) {
          this.scrollToFilm(this.hoveredFilmIndex);
        }
      });
    }

    // Directors list click listeners
    const directorsList = document.getElementById('directorsList');
    if (directorsList) {
      directorsList.querySelectorAll('.director-item').forEach((item) => {
        item.addEventListener('click', () => {
          const fIdx = parseInt(item.dataset.filmIndex, 10);
          this.scrollToFilm(fIdx);
        });
      });
    }
  }

  scrollToFilm(targetFilmIndex) {
    const scrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetScroll = (targetFilmIndex / this.films.length) * scrollHeight;
    if (this.lenis) {
      this.lenis.scrollTo(targetScroll, { duration: 1.3 });
    }
  }

  update() {
    this.scrollVelocity += (this.targetVelocity - this.scrollVelocity) * 0.12;
    this.targetVelocity *= 0.88;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    const scrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollFraction = this.currentScroll / scrollHeight;

    // Continuous smooth rotation of the arc
    // When scrolling down, the arc rolls smoothly clockwise
    const totalRotationRad = scrollFraction * (Math.PI * 2 * (this.films.length / this.numTotalSegments) * 2.5);
    this.targetRotation = totalRotationRad;
    this.currentRotation += (this.targetRotation - this.currentRotation) * 0.1;

    // 3D stage tilt from mouse parallax
    const stage = document.getElementById('posterStage');
    if (stage) {
      const rotY = this.mouse.x * 3.5;
      const rotX = -this.mouse.y * 2.5;
      stage.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    // Render Canvas Arc Wheel
    this.drawArcWheel();
  }

  drawArcWheel() {
    if (!this.ctx || !this.canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    // Arc Circle Center geometry
    // In the poster, the arc center is situated at bottom-left relative to the arc curve
    // which sweeps across the top-middle and curves down the right side.
    const isMobile = width <= 768;
    const cx = isMobile ? width * 0.45 : width * 0.52;
    const cy = isMobile ? height * 0.98 : height * 0.92;

    // Outer and Inner Radius of the curved ribbon
    const baseRadius = isMobile ? Math.min(width * 0.72, 450) : Math.min(width * 0.68, height * 1.15, 880);
    const ribbonWidth = isMobile ? 180 : Math.min(width * 0.26, 320);
    const rOuter = baseRadius;
    const rInner = baseRadius - ribbonWidth;

    // Focal viewing angle (where the top-right focal segment is situated, roughly -55 to -45 degrees)
    const focalAngle = -Math.PI * 0.32;

    let minAngleDist = Infinity;
    let closestFilmIndex = 0;
    this.hoveredFilmIndex = -1;

    // Mouse distance to center for hover hit-testing
    const mouseDx = this.mouse.canvasX - cx;
    const mouseDy = this.mouse.canvasY - cy;
    const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
    let mouseAngle = Math.atan2(mouseDy, mouseDx);

    // Render each annular segment along the ribbon
    for (let i = 0; i < this.numTotalSegments; i++) {
      const filmIndex = i % this.films.length;
      const film = this.films[filmIndex];

      // Segment angular bounds with 0.008 rad crisp separator slit
      const slitGap = 0.006;
      // Offset starting angle so it spans from top-left (-130 deg) across top and down right (+40 deg)
      const baseStartAngle = -Math.PI * 0.95 + i * this.anglePerSegment;
      const a1 = baseStartAngle + this.currentRotation + slitGap;
      const a2 = baseStartAngle + this.anglePerSegment + this.currentRotation - slitGap;
      const aMid = (a1 + a2) / 2;

      // Normalize angle to -PI to PI
      let normMid = Math.atan2(Math.sin(aMid), Math.cos(aMid));

      // Only draw if within visible field of view (-160 deg to +60 deg)
      if (normMid < -Math.PI * 0.95 && normMid > Math.PI * 0.4) {
        continue;
      }

      // Check distance to focal angle for active highlight
      let angleDist = Math.abs(normMid - focalAngle);
      if (angleDist > Math.PI) angleDist = Math.PI * 2 - angleDist;

      if (angleDist < minAngleDist) {
        minAngleDist = angleDist;
        closestFilmIndex = filmIndex;
      }

      // Check if mouse is hovering over this segment
      const isHovered = mouseDist >= rInner && mouseDist <= rOuter && mouseAngle >= a1 && mouseAngle <= a2;
      if (isHovered) {
        this.hoveredFilmIndex = filmIndex;
      }

      const isActive = angleDist < this.anglePerSegment * 0.65;

      // Draw Annular Segment
      ctx.save();

      // Create curved annular wedge clipping path
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, a1, a2, false);
      ctx.arc(cx, cy, rInner, a2, a1, true);
      ctx.closePath();
      ctx.clip();

      // Draw Background / Image
      if (film.image && film.image.complete && film.image.naturalWidth > 0) {
        ctx.save();
        // Translate & rotate canvas to center of this wedge for natural image projection
        const rMid = (rOuter + rInner) / 2;
        const imgX = cx + Math.cos(aMid) * rMid;
        const imgY = cy + Math.sin(aMid) * rMid;

        ctx.translate(imgX, imgY);
        ctx.rotate(aMid + Math.PI / 2);

        const imgScale = isActive ? 1.06 : (isHovered ? 1.08 : 1.0);
        const imgW = ribbonWidth * 1.5 * imgScale;
        const imgH = ribbonWidth * 1.25 * imgScale;

        // Draw image centered in wedge
        ctx.drawImage(film.image, -imgW / 2, -imgH / 2, imgW, imgH);

        // Subtle gradient sheen overlay
        const grad = ctx.createLinearGradient(-imgW / 2, 0, imgW / 2, 0);
        grad.addColorStop(0, 'rgba(0,0,0,0.15)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        grad.addColorStop(1, 'rgba(0,0,0,0.25)');
        ctx.fillStyle = grad;
        ctx.fillRect(-imgW / 2, -imgH / 2, imgW, imgH);

        ctx.restore();
      } else {
        // Fallback tone
        ctx.fillStyle = '#222220';
        ctx.fill();
      }

      // Draw crisp subtle inner shadow & border
      ctx.strokeStyle = '#f1efea';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.restore();
    }

    // Update Active UI information on left panel
    if (closestFilmIndex !== this.activeIndex) {
      this.activeIndex = closestFilmIndex;
      this.updateActiveUI(this.activeIndex);
    }
  }

  updateActiveUI(index) {
    const currentFilm = this.films[index];
    if (!currentFilm) return;

    // Highlight director in list
    const directorsList = document.getElementById('directorsList');
    if (directorsList) {
      const items = directorsList.querySelectorAll('.director-item');
      items.forEach((it, i) => {
        if (i === index) {
          it.classList.add('active');
        } else {
          it.classList.remove('active');
        }
      });
    }

    // Update active metadata preview
    const numEl = document.getElementById('previewNumber');
    const titleEl = document.getElementById('previewTitle');
    const tagEl = document.getElementById('previewTagline');

    if (numEl) numEl.textContent = `PERSPECTIVE 0${currentFilm.id} OF 06`;
    if (titleEl) {
      titleEl.style.opacity = '0';
      titleEl.style.transform = 'translateY(4px)';
      setTimeout(() => {
        titleEl.textContent = currentFilm.title;
        titleEl.style.opacity = '1';
        titleEl.style.transform = 'translateY(0)';
      }, 100);
    }
    if (tagEl) {
      tagEl.style.opacity = '0';
      setTimeout(() => {
        tagEl.textContent = currentFilm.tagline;
        tagEl.style.opacity = '1';
      }, 100);
    }
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
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMoveDrag);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('resize', this.onResize);

    const root = document.getElementById('two-d5-root');
    if (root) root.remove();
  }
}
