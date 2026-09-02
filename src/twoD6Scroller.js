// 2D6 Transfinitte Circular Photo Gallery Scroller

export class TwoD6Scroller {
  constructor(container) {
    this.container = container || document.body;
    this.isDestroyed = false;
    this.rafId = null;

    // Photos dataset with offline assets in /assets/
    this.uniquePhotos = [
      {
        id: "tf-01",
        title: "Sisterhood & Community Spirit",
        category: "Community",
        author: "Aqsa Altaf (Launchpad)",
        timestamp: "Edition 01 • Day 1",
        location: "Auditorium Concourse",
        description: "Capturing the boundless excitement and warm camaraderie at the opening check-in of the hackathon festival.",
        url: "/assets/photo_01.jpg",
        color: "#6366f1"
      },
      {
        id: "tf-02",
        title: "The Keynote Visionary",
        category: "Keynote",
        author: "Hao Zheng (Launchpad)",
        timestamp: "Edition 02 • Inauguration",
        location: "Golden Jubilee Convention Hall",
        description: "Opening address on the horizon of autonomous intelligence and building technology that serves humanity.",
        url: "/assets/photo_02.jpg",
        color: "#0ea5e9"
      },
      {
        id: "tf-03",
        title: "The Eureka Moment",
        category: "Breakthrough",
        author: "Ann Marie Pace (Launchpad)",
        timestamp: "Edition 03 • Midnight",
        location: "Main Coding Arena",
        description: "A spontaneous burst of triumph as a high-frequency inference pipeline compiles cleanly after 18 hours of refactoring.",
        url: "/assets/photo_03.jpg",
        color: "#f59e0b"
      },
      {
        id: "tf-04",
        title: "Mentorship & Family Support",
        category: "Perspectives",
        author: "Stefanie Abel Horowitz",
        timestamp: "Edition 04 • Afternoon",
        location: "Veranda Sandbox",
        description: "The heartwarming human stories behind every developer who dares to build from scratch.",
        url: "/assets/photo_04.jpg",
        color: "#ec4899"
      },
      {
        id: "tf-05",
        title: "Street Culture & Local Heritage",
        category: "Culture",
        author: "Jessica Mendez Siqueiros",
        timestamp: "Edition 05 • Twilight",
        location: "Trichy Quadrangle",
        description: "Celebrating local flavors, midnight street treats, and timeless memories outside the hacker arena.",
        url: "/assets/photo_05.jpg",
        color: "#10b981"
      },
      {
        id: "tf-06",
        title: "The Next Generation Architect",
        category: "Futurism",
        author: "Moxie Peng (Launchpad)",
        timestamp: "Edition 06 • Morning",
        location: "Innovation Pavilion",
        description: "Eyes raised toward the future—curiosity, wonder, and determination defining tomorrow's creators.",
        url: "/assets/photo_06.jpg",
        color: "#06b6d4"
      },
      {
        id: "tf-07",
        title: "Main Arena // Midnight Sprint",
        category: "Hacking",
        author: "TransfiNITTe Media Cell",
        timestamp: "Oct 22, 2025 • 02:30 IST",
        location: "GJCH Main Arena Hall B",
        description: "Over 1200 hackers in deep flow state beneath pulsing blue and green cyber neon lighting grids.",
        url: "/assets/photo_07.jpg",
        color: "#3b82f6"
      },
      {
        id: "tf-08",
        title: "Champions Podium // Grand Finale",
        category: "Triumph",
        author: "Pranav M. & Vignesh T.",
        timestamp: "Oct 23, 2025 • 16:00 IST",
        location: "Grand Podium Stage",
        description: "The gold TransfiNITTe Cup awarded to the grand prize winners amidst confetti and standing ovations.",
        url: "/assets/photo_08.jpg",
        color: "#eab308"
      },
      {
        id: "tf-09",
        title: "Robotics & Hardware Sandbox",
        category: "Hardware",
        author: "Robotics Council NIT Trichy",
        timestamp: "Oct 22, 2025 • 14:15 IST",
        location: "Embedded Systems Lab",
        description: "Autonomous micro-drone navigation and custom PCB soldering trials tested in real-time obstacle nets.",
        url: "/assets/photo_09.jpg",
        color: "#14b8a6"
      },
      {
        id: "tf-10",
        title: "Laser Matrix // Central Concourse",
        category: "Atmosphere",
        author: "Devansh R. (Stage Lead)",
        timestamp: "Oct 22, 2025 • 21:00 IST",
        location: "Central Concourse",
        description: "Volumetric cyber laser arrays casting geometric planes of light over the hackathon concourse.",
        url: "/assets/photo_10.jpg",
        color: "#a855f7"
      },
      {
        id: "tf-11",
        title: "System Architecture & Mentorship",
        category: "Mentorship",
        author: "Corporate Engineering Guild",
        timestamp: "Oct 22, 2025 • 17:40 IST",
        location: "Cluster 3 Seminar Hall",
        description: "Industry veterans stress-testing high-availability topologies and edge-compute failure scenarios.",
        url: "/assets/photo_11.jpg",
        color: "#6366f1"
      },
      {
        id: "tf-12",
        title: "Zero Hour Countdown // 00:00:01",
        category: "Zero Hour",
        author: "Team TransfiNITTe",
        timestamp: "Oct 23, 2025 • 08:59 IST",
        location: "Jumbotron Central Screen",
        description: "The final seconds before git merge lockdown. Heart rates peaking across all 400 competing teams.",
        url: "/assets/photo_12.jpg",
        color: "#f43f5e"
      }
    ];

    // 24 slots around circle (2 cycles of 12) so multiple photos are visible simultaneously
    this.cycleCount = 2;
    this.numItems = this.uniquePhotos.length * this.cycleCount;
    this.itemAngle = (Math.PI * 2) / this.numItems;
    this.angleGap = 0.014;

    this.images = [];

    // Geometry
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cx = 0;
    this.cy = 0;
    this.rInner = 0;
    this.rOuter = 0;
    this.isMobile = false;
    this.isTablet = false;

    // Rotation & momentum state
    this.rotationAngle = 0;
    this.targetRotation = null;
    this.angularVelocity = 0;
    this.isDragging = false;
    this.dragStartAngle = 0;
    this.dragStartRotation = 0;
    this.lastPointerAngle = 0;
    this.lastPointerTime = 0;
    this.dragMoved = 0;

    // Active & selection state
    this.hoveredIndex = -1;
    this.activeIndex = 0;
    this.modalActiveIndex = 0;
    this.focalAngle = 0;

    // Event listener references for clean teardown
    this.boundResize = null;
    this.boundWheel = null;
    this.boundPointerDown = null;
    this.boundPointerMove = null;
    this.boundPointerUp = null;
    this.boundKeyDown = null;
  }

  mount() {
    this.renderDOM();
    this.loadImages();
    this.updateDimensions();
    this.bindEvents();
    this.updateInspectCard(0);

    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  renderDOM() {
    const existing = document.getElementById('two-d6-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'two-d6-root';
    root.className = 'two-d6-root';

    root.innerHTML = `
      <!-- Technical Background Grid & Vignette -->
      <div class="bg-grid"></div>
      <div class="bg-radial-vignette"></div>
      <div class="bg-watermark">transfinitte</div>

      <!-- Technical Corner Crop Marks -->
      <div class="corner-mark corner-tl"></div>
      <div class="corner-mark corner-tr"></div>
      <div class="corner-mark corner-bl"></div>
      <div class="corner-mark corner-br"></div>

      <!-- Sub-Navigation Telemetry Bar -->
      <div class="two-d6-telemetry-bar">
        <div class="telemetry-left">
          <span class="live-pulse"></span>
          <span>49 DAYS TO GO</span>
          <span style="opacity: 0.35;">|</span>
          <span style="opacity: 0.75;">OCT 21-23 2026 • GJCH</span>
        </div>
        <div class="telemetry-right">
          <span>CIRCULAR ARCHIVE // '26</span>
        </div>
      </div>

      <!-- Main Stage Container -->
      <main class="app-container">
        <!-- Canvas Layer for Annular Photo Sector Wheel -->
        <div class="canvas-wrapper">
          <canvas id="galleryCanvas"></canvas>
          <div id="hoverTooltip" class="hover-tooltip">
            <div class="tooltip-title">Photo Title</div>
          </div>
        </div>

        <!-- Hero Content Overlay -->
        <section class="hero-content">
          <div class="hero-top">
            <div class="section-tag">
              <span class="tag-dot"></span>
              <span>LAUNCHPAD ARCHIVE // '26</span>
            </div>

            <h1 class="hero-title">
              MOMENTS <br>
              <span class="dim">IN MOTION</span>
            </h1>

            <p class="hero-desc">
              A kinetic radial timeline celebrating the energy, spirit, and breakthroughs of TransfiNITTe.
            </p>

            <div class="mobile-swipe-badge">
              <span class="swipe-badge-dot"></span>
              <span>SWIPE TO EXPLORE ↗</span>
            </div>

            <!-- Dialogue Bubble Simulation -->
            <div class="real-chat-container">
              <div class="chat-row chat-incoming">
                <div class="chat-bubble-wrapper">
                  <div class="real-bubble bubble-dark-chat">
                    <span class="chat-sender-tag">HACKER_01</span>
                    <p class="chat-bold-title">TransfiNITTe '25 was insane,</p>
                    <p class="chat-sub-text">How to explore the memories?</p>
                    <span class="chat-timestamp">02:14 AM</span>
                  </div>
                  <svg class="chat-tail-svg tail-left-svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M14 0C14 6 10 12 0 15C6 14 11 11 14 4V0Z" fill="#181822"/>
                    <path d="M14 0C14 6 10 12 0 15" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
                  </svg>
                </div>
              </div>

              <div class="chat-row chat-outgoing">
                <div class="chat-bubble-wrapper">
                  <div class="real-bubble bubble-light-chat">
                    <span class="chat-sender-reply">TRANSFINITTE_CORE</span>
                    <p class="chat-hero-reply">Scroll or drag the radial wheel ↗</p>
                    <div class="chat-status-bar">
                      <span class="chat-time-light">02:15 AM</span>
                      <span class="chat-read-ticks">✓✓</span>
                    </div>
                  </div>
                  <svg class="chat-tail-svg tail-right-svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M0 0C0 6 4 12 14 15C8 14 3 11 0 4V0Z" fill="#ffffff"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Inspect Picture Card -->
            <div class="inspect-picture-card">
              <div class="card-header">
                <span id="inspectTheme" class="inspect-theme-badge">THEME: KEYNOTE</span>
                <span id="inspectIndex" class="inspect-index-tag">[ 01 / 12 ]</span>
              </div>
              <h3 id="inspectTitle" class="inspect-title">Opening Keynote & Inauguration</h3>
              <p id="inspectDescription" class="inspect-description">The inauguration ceremony of TransfiNITTe '25 with 1200+ hackers from across 80+ universities gearing up for a 42-hour non-stop sprint.</p>
              <div class="card-nav-row">
                <button id="btnCardPrev" class="card-nav-arrow" title="Previous Picture">
                  <span>←</span>
                  <span>PREV</span>
                </button>
                <button id="btnInspectModal" class="btn-inspect-action">
                  <span>INSPECT</span>
                  <span>↗</span>
                </button>
                <button id="btnCardNext" class="card-nav-arrow" title="Next Picture">
                  <span>NEXT</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Site Footer -->
      <footer class="site-footer">
        <span>© 2026 TRANSFINITTE. ALL RIGHTS RESERVED.</span>
      </footer>

      <!-- Lightbox Modal -->
      <div id="lightboxOverlay" class="lightbox-overlay" role="dialog" aria-modal="true">
        <div class="lightbox-card">
          <button id="modalCloseBtn" class="modal-close-btn" aria-label="Close modal">✕</button>

          <div class="lightbox-image-pane">
            <img id="modalImg" class="lightbox-img" src="" alt="Selected photo">
          </div>

          <div class="lightbox-details-pane">
            <div>
              <div class="modal-badge-row">
                <span id="modalBadge" class="modal-badge">MOMENT</span>
                <span id="modalPhotoId" class="modal-photo-id">INDEX [01]</span>
              </div>
              <h2 id="modalTitle" class="modal-title">Photo Title</h2>
              <p id="modalDescription" class="modal-description">Detailed description of the moment captured during TransfiNITTe hackathon.</p>
            </div>

            <div class="modal-nav-row">
              <button id="btnModalPrev" class="modal-nav-btn">
                <span>← PREVIOUS</span>
              </button>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">
                USE [←] [→] KEYS
              </span>
              <button id="btnModalNext" class="modal-nav-btn">
                <span>NEXT →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(root);

    // Cache element references
    this.canvas = root.querySelector('#galleryCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.wrapper = root.querySelector('.canvas-wrapper');
    this.tooltip = root.querySelector('#hoverTooltip');

    this.inspectTheme = root.querySelector('#inspectTheme');
    this.inspectIndex = root.querySelector('#inspectIndex');
    this.inspectTitle = root.querySelector('#inspectTitle');
    this.inspectDescription = root.querySelector('#inspectDescription');
    this.btnCardPrev = root.querySelector('#btnCardPrev');
    this.btnCardNext = root.querySelector('#btnCardNext');
    this.btnInspectModal = root.querySelector('#btnInspectModal');

    this.lightboxOverlay = root.querySelector('#lightboxOverlay');
    this.modalCloseBtn = root.querySelector('#modalCloseBtn');
    this.modalPhotoId = root.querySelector('#modalPhotoId');
    this.modalBadge = root.querySelector('#modalBadge');
    this.modalTitle = root.querySelector('#modalTitle');
    this.modalDescription = root.querySelector('#modalDescription');
    this.modalImg = root.querySelector('#modalImg');
    this.btnModalPrev = root.querySelector('#btnModalPrev');
    this.btnModalNext = root.querySelector('#btnModalNext');
  }

  loadImages() {
    this.images = [];
    this.uniquePhotos.forEach((p, idx) => {
      const img = new Image();
      const itemData = {
        img: img,
        loaded: false,
        data: p
      };

      img.onload = () => {
        itemData.loaded = true;
      };

      img.onerror = () => {
        itemData.loaded = false;
      };

      img.src = p.url;
      if (img.complete && img.naturalWidth > 0) {
        itemData.loaded = true;
      }
      this.images.push(itemData);
    });
  }

  updateDimensions() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.isMobile = this.width < 768;
    this.isTablet = this.width >= 768 && this.width < 1100;

    if (this.isMobile) {
      this.cx = -this.width * 0.14;
      this.cy = this.height * 0.52;
      this.rInner = this.width * 0.72;
      this.rOuter = this.rInner + Math.min(this.width * 0.42, 175);
      this.focalAngle = 0;
    } else if (this.isTablet) {
      this.cx = this.width * 0.16;
      this.cy = this.height * 0.50;
      this.rInner = Math.min(this.width, this.height) * 0.65;
      this.rOuter = this.rInner + Math.min(this.width * 0.20, 220);
      this.focalAngle = 0;
    } else {
      this.cx = this.width * 0.25;
      this.cy = this.height * 0.50;
      this.rInner = Math.min(this.width, this.height) * 0.76;
      this.rOuter = this.rInner + Math.min(this.width * 0.19, 275);
      this.focalAngle = 0;
    }
  }

  bindEvents() {
    this.boundResize = () => this.updateDimensions();
    window.addEventListener('resize', this.boundResize);

    this.boundWheel = (e) => {
      if (this.lightboxOverlay && this.lightboxOverlay.classList.contains('active')) return;
      if (e.target && e.target.closest && e.target.closest('.app-global-nav')) return;

      this.targetRotation = null;
      const delta = e.deltaY || e.deltaX;
      this.angularVelocity += delta * (this.isMobile ? 0.0016 : 0.0006);
    };
    window.addEventListener('wheel', this.boundWheel, { passive: true });

    this.boundPointerDown = (e) => this.onPointerDown(e);
    this.boundPointerMove = (e) => this.onPointerMove(e);
    this.boundPointerUp = (e) => this.onPointerUp(e);

    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', this.boundPointerDown);
    }
    window.addEventListener('pointermove', this.boundPointerMove);
    window.addEventListener('pointerup', this.boundPointerUp);
    window.addEventListener('pointercancel', this.boundPointerUp);

    // Card buttons
    if (this.btnCardPrev) {
      this.btnCardPrev.addEventListener('click', () => this.stepItem(-1));
    }
    if (this.btnCardNext) {
      this.btnCardNext.addEventListener('click', () => this.stepItem(1));
    }
    if (this.btnInspectModal) {
      this.btnInspectModal.addEventListener('click', () => this.openLightbox(this.activeIndex));
    }

    // Lightbox modal buttons
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeLightbox());
    }
    if (this.lightboxOverlay) {
      this.lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === this.lightboxOverlay) this.closeLightbox();
      });
    }
    if (this.btnModalPrev) {
      this.btnModalPrev.addEventListener('click', () => this.navigateLightbox(-1));
    }
    if (this.btnModalNext) {
      this.btnModalNext.addEventListener('click', () => this.navigateLightbox(1));
    }

    // Keyboard navigation
    this.boundKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (this.lightboxOverlay && this.lightboxOverlay.classList.contains('active')) {
          this.navigateLightbox(-1);
        } else {
          this.stepItem(-1);
        }
      } else if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        e.preventDefault();
        if (this.lightboxOverlay && this.lightboxOverlay.classList.contains('active')) {
          this.navigateLightbox(1);
        } else {
          this.stepItem(1);
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        this.openLightbox(this.activeIndex);
      } else if (e.code === 'Escape') {
        this.closeLightbox();
      }
    };
    window.addEventListener('keydown', this.boundKeyDown);
  }

  goToNext() {
    this.angularVelocity = 0;
    const currentSlot = Math.round((this.focalAngle - this.rotationAngle) / this.itemAngle);
    const targetSlot = currentSlot + 1;
    this.targetRotation = this.focalAngle - targetSlot * this.itemAngle;
    const nextPhoto = (this.activeIndex + 1) % this.uniquePhotos.length;
    this.updateInspectCard(nextPhoto);
  }

  goToPrev() {
    this.angularVelocity = 0;
    const currentSlot = Math.round((this.focalAngle - this.rotationAngle) / this.itemAngle);
    const targetSlot = currentSlot - 1;
    this.targetRotation = this.focalAngle - targetSlot * this.itemAngle;
    const prevPhoto = (this.activeIndex - 1 + this.uniquePhotos.length) % this.uniquePhotos.length;
    this.updateInspectCard(prevPhoto);
  }

  stepItem(delta) {
    if (delta > 0) {
      this.goToNext();
    } else {
      this.goToPrev();
    }
  }

  getPolar(clientX, clientY) {
    const dx = clientX - this.cx;
    const dy = clientY - this.cy;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    return { dist, angle };
  }

  getItemAtPoint(clientX, clientY) {
    const { dist, angle } = this.getPolar(clientX, clientY);
    if (dist < this.rInner - 15 || dist > this.rOuter + 20) {
      return -1;
    }

    let rel = angle - this.rotationAngle;
    rel = ((rel % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const slotIdx = Math.floor(rel / this.itemAngle) % this.numItems;
    return slotIdx;
  }

  onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target && e.target.closest && e.target.closest('.app-global-nav')) return;

    this.isDragging = true;
    this.targetRotation = null;
    const { angle } = this.getPolar(e.clientX, e.clientY);
    this.dragStartAngle = angle;
    this.dragStartRotation = this.rotationAngle;
    this.lastPointerAngle = angle;
    this.lastPointerTime = performance.now();
    this.dragMoved = 0;
    this.angularVelocity = 0;
  }

  onPointerMove(e) {
    if (this.isDestroyed) return;
    const { angle } = this.getPolar(e.clientX, e.clientY);

    if (this.isDragging) {
      let delta = angle - this.dragStartAngle;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;

      const dragFactor = this.isMobile ? 1.7 : 1.0;
      this.rotationAngle = this.dragStartRotation + delta * dragFactor;
      this.dragMoved += Math.abs(delta);

      const now = performance.now();
      const dt = now - this.lastPointerTime;
      if (dt > 12) {
        let stepDelta = angle - this.lastPointerAngle;
        while (stepDelta > Math.PI) stepDelta -= Math.PI * 2;
        while (stepDelta < -Math.PI) stepDelta += Math.PI * 2;

        const throwMultiplier = this.isMobile ? 2.4 : 1.0;
        this.angularVelocity = (stepDelta / dt) * 16 * throwMultiplier;

        const maxVel = this.isMobile ? 0.08 : 0.05;
        this.angularVelocity = Math.max(-maxVel, Math.min(maxVel, this.angularVelocity));

        this.lastPointerAngle = angle;
        this.lastPointerTime = now;
      }
      this.hideTooltip();
    } else {
      const hovered = this.getItemAtPoint(e.clientX, e.clientY);
      if (hovered !== this.hoveredIndex) {
        this.hoveredIndex = hovered;
        if (hovered !== -1) {
          const photoIdx = hovered % this.uniquePhotos.length;
          const photo = this.uniquePhotos[photoIdx];
          if (photo) {
            this.showTooltip(e.clientX, e.clientY, photo);
          }
        } else {
          this.hideTooltip();
        }
      } else if (hovered !== -1) {
        this.updateTooltipPos(e.clientX, e.clientY);
      }
    }
  }

  onPointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.dragMoved < 0.02) {
      const clickedSlot = this.getItemAtPoint(e.clientX, e.clientY);
      if (clickedSlot !== -1) {
        const photoIdx = clickedSlot % this.uniquePhotos.length;
        this.openLightbox(photoIdx);
      }
    }
  }

  showTooltip(x, y, photo) {
    if (!this.tooltip) return;
    const titleEl = this.tooltip.querySelector('.tooltip-title');
    if (titleEl) titleEl.textContent = photo.title;
    this.updateTooltipPos(x, y);
    this.tooltip.classList.add('visible');
  }

  updateTooltipPos(x, y) {
    if (!this.tooltip) return;
    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top = `${y}px`;
  }

  hideTooltip() {
    if (this.tooltip) this.tooltip.classList.remove('visible');
  }

  updateInspectCard(photoIndex) {
    const photo = this.uniquePhotos[photoIndex];
    if (!photo) return;
    this.activeIndex = photoIndex;

    if (this.inspectTheme) this.inspectTheme.textContent = `THEME: ${photo.category.toUpperCase()}`;
    if (this.inspectIndex) this.inspectIndex.textContent = `[ ${String(photoIndex + 1).padStart(2, '0')} / ${String(this.uniquePhotos.length).padStart(2, '0')} ]`;
    if (this.inspectTitle) this.inspectTitle.textContent = photo.title;
    if (this.inspectDescription) this.inspectDescription.textContent = photo.description;
  }

  openLightbox(photoIndex) {
    if (!this.uniquePhotos[photoIndex]) return;
    this.modalActiveIndex = photoIndex;
    this.updateLightboxContent();
    if (this.lightboxOverlay) this.lightboxOverlay.classList.add('active');
  }

  closeLightbox() {
    if (this.lightboxOverlay) this.lightboxOverlay.classList.remove('active');
  }

  navigateLightbox(delta) {
    const total = this.uniquePhotos.length;
    this.modalActiveIndex = (this.modalActiveIndex + delta + total) % total;
    this.updateLightboxContent();
    this.updateInspectCard(this.modalActiveIndex);
  }

  updateLightboxContent() {
    const p = this.uniquePhotos[this.modalActiveIndex];
    if (!p) return;

    if (this.modalPhotoId) this.modalPhotoId.textContent = `INDEX [${String(this.modalActiveIndex + 1).padStart(2, '0')}]`;
    if (this.modalBadge) this.modalBadge.textContent = `THEME: ${p.category.toUpperCase()}`;
    if (this.modalTitle) this.modalTitle.textContent = p.title;
    if (this.modalDescription) this.modalDescription.textContent = p.description;

    const itemData = this.images[this.modalActiveIndex];
    if (this.modalImg) {
      this.modalImg.src = (itemData && itemData.loaded && itemData.img) ? itemData.img.src : p.url;
      this.modalImg.alt = p.title;
    }
  }

  animate() {
    if (this.isDestroyed) return;

    if (this.isDragging) {
      this.targetRotation = null;
    } else if (this.targetRotation !== null) {
      const diff = this.targetRotation - this.rotationAngle;
      if (Math.abs(diff) < 0.0005) {
        this.rotationAngle = this.targetRotation;
        this.targetRotation = null;
        this.angularVelocity = 0;
      } else {
        this.rotationAngle += diff * 0.18;
      }
    } else {
      this.rotationAngle += this.angularVelocity;
      const damping = this.isMobile ? 0.945 : 0.89;
      this.angularVelocity *= damping;
      if (Math.abs(this.angularVelocity) < 0.00005) {
        this.angularVelocity = 0;
      }
    }

    if (this.uniquePhotos.length > 0) {
      let focalRel = this.focalAngle - this.rotationAngle;
      focalRel = ((focalRel % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const slotIndex = Math.round(focalRel / this.itemAngle) % this.numItems;
      const photoIndex = slotIndex % this.uniquePhotos.length;
      if (this.activeIndex !== photoIndex && this.targetRotation === null) {
        this.updateInspectCard(photoIndex);
      }
    }

    this.draw();
    this.rafId = requestAnimationFrame(this.animate);
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawDecorations(ctx);

    for (let i = 0; i < this.numItems; i++) {
      const centerAngle = this.rotationAngle + i * this.itemAngle;
      const startAngle = centerAngle - this.itemAngle / 2 + this.angleGap / 2;
      const endAngle = centerAngle + this.itemAngle / 2 - this.angleGap / 2;
      const isHovered = (this.hoveredIndex === i);
      const photoIndex = i % this.uniquePhotos.length;
      const isFocused = (this.activeIndex === photoIndex);

      this.drawPhotoSector(ctx, i, photoIndex, startAngle, endAngle, centerAngle, isHovered, isFocused);
    }

    this.drawFocalIndicator(ctx);
  }

  drawDecorations(ctx) {
    ctx.save();

    const startArc = -Math.PI / 2;
    const endArc = Math.PI / 2;

    // Boundary arc lines
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.rInner - 8, startArc, endArc);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.rOuter + 8, startArc, endArc);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dashed inner track
    ctx.setLineDash([4, 10]);
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.rInner - 18, startArc, endArc);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();
    ctx.setLineDash([]);

    // Radial telemetry ticks
    const tickCount = 96;
    for (let t = 0; t < tickCount; t++) {
      const a = (t / tickCount) * Math.PI * 2 + this.rotationAngle;
      if (Math.cos(a) < 0.05) continue;

      const isMajor = (t % 4 === 0);
      const len = isMajor ? 12 : 5;
      const r1 = this.rInner - 8;
      const r2 = r1 - len;

      ctx.beginPath();
      ctx.moveTo(this.cx + r1 * Math.cos(a), this.cy + r1 * Math.sin(a));
      ctx.lineTo(this.cx + r2 * Math.cos(a), this.cy + r2 * Math.sin(a));
      ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = isMajor ? 1.5 : 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  drawPhotoSector(ctx, slotIndex, photoIndex, startAngle, endAngle, centerAngle, isHovered, isFocused) {
    if (Math.cos(centerAngle) < -0.2) {
      return;
    }

    const itemData = this.images[photoIndex];
    const photo = this.uniquePhotos[photoIndex];
    const rMid = (this.rInner + this.rOuter) / 2;
    const radialDepth = this.rOuter - this.rInner;
    const arcLength = this.rOuter * (endAngle - startAngle);

    ctx.save();

    // Clip to curved annular sector
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.rOuter, startAngle, endAngle, false);
    ctx.arc(this.cx, this.cy, this.rInner, endAngle, startAngle, true);
    ctx.closePath();
    ctx.clip();

    const px = this.cx + rMid * Math.cos(centerAngle);
    const py = this.cy + rMid * Math.sin(centerAngle);

    ctx.translate(px, py);
    ctx.rotate(centerAngle + Math.PI / 2);

    const scale = isHovered ? 1.06 : 1.0;
    ctx.scale(scale, scale);

    if (itemData && itemData.loaded && itemData.img) {
      const img = itemData.img;
      const targetW = arcLength * 1.15;
      const targetH = radialDepth * 1.15;
      const imgAspect = (img.naturalWidth || 800) / (img.naturalHeight || 533);

      let dw = targetW;
      let dh = targetH;
      if (dw / dh > imgAspect) {
        dh = dw / imgAspect;
      } else {
        dw = dh * imgAspect;
      }

      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    } else {
      const grad = ctx.createLinearGradient(-radialDepth, -arcLength, radialDepth, arcLength);
      grad.addColorStop(0, '#101018');
      grad.addColorStop(0.5, (photo && photo.color) ? photo.color : '#2563eb');
      grad.addColorStop(1, '#08080c');
      ctx.fillStyle = grad;
      ctx.fillRect(-arcLength, -radialDepth, arcLength * 2, radialDepth * 2);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(photo ? photo.title : `ITEM ${photoIndex + 1}`, 0, 0);
    }

    if (isHovered) {
      ctx.fillStyle = 'rgba(0, 255, 136, 0.08)';
      ctx.fillRect(-1000, -1000, 2000, 2000);
    } else if (!isFocused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.fillRect(-1000, -1000, 2000, 2000);
    }

    ctx.restore();

    // Outline border
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.rOuter, startAngle, endAngle, false);
    ctx.arc(this.cx, this.cy, this.rInner, endAngle, startAngle, true);
    ctx.closePath();

    if (isHovered) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;
    } else if (isFocused) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
    }
    ctx.stroke();
    ctx.restore();
  }

  drawFocalIndicator(ctx) {
    ctx.save();
    const a = this.focalAngle;
    const r = this.rInner - 12;
    const px = this.cx + r * Math.cos(a);
    const py = this.cy + r * Math.sin(a);

    ctx.translate(px, py);
    ctx.rotate(a);

    ctx.beginPath();
    ctx.moveTo(-10, -7);
    ctx.lineTo(0, 0);
    ctx.lineTo(-10, 7);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.restore();
  }

  destroy() {
    this.isDestroyed = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.boundResize) window.removeEventListener('resize', this.boundResize);
    if (this.boundWheel) window.removeEventListener('wheel', this.boundWheel);
    if (this.canvas && this.boundPointerDown) {
      this.canvas.removeEventListener('pointerdown', this.boundPointerDown);
    }
    if (this.boundPointerMove) window.removeEventListener('pointermove', this.boundPointerMove);
    if (this.boundPointerUp) {
      window.removeEventListener('pointerup', this.boundPointerUp);
      window.removeEventListener('pointercancel', this.boundPointerUp);
    }
    if (this.boundKeyDown) window.removeEventListener('keydown', this.boundKeyDown);

    const root = document.getElementById('two-d6-root');
    if (root) root.remove();

    this.images = [];
  }
}
