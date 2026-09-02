class CircularGalleryApp {
  constructor() {
    this.canvas = document.getElementById('galleryCanvas');
    if (!this.canvas) {
      console.error('Gallery canvas element not found!');
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.wrapper = document.querySelector('.canvas-wrapper');
    this.container = document.querySelector('.app-container');
    this.tooltip = document.getElementById('hoverTooltip');

    // Inspect Picture Card elements
    this.inspectTheme = document.getElementById('inspectTheme');
    this.inspectIndex = document.getElementById('inspectIndex');
    this.inspectTitle = document.getElementById('inspectTitle');
    this.inspectDescription = document.getElementById('inspectDescription');
    this.btnCardPrev = document.getElementById('btnCardPrev');
    this.btnCardNext = document.getElementById('btnCardNext');
    this.btnInspectModal = document.getElementById('btnInspectModal');

    // Lightbox modal elements
    this.lightboxOverlay = document.getElementById('lightboxOverlay');
    this.modalCloseBtn = document.getElementById('modalCloseBtn');
    this.modalPhotoId = document.getElementById('modalPhotoId');
    this.modalBadge = document.getElementById('modalBadge');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalDescription = document.getElementById('modalDescription');
    this.modalImg = document.getElementById('modalImg');
    this.btnModalPrev = document.getElementById('btnModalPrev');
    this.btnModalNext = document.getElementById('btnModalNext');

    // Photos dataset
    this.uniquePhotos = (typeof window !== 'undefined' && window.GALLERY_PHOTOS && window.GALLERY_PHOTOS.length > 0)
      ? window.GALLERY_PHOTOS
      : [];
    
    // 24 slots around the circle so 5-6 photos are visible simultaneously along the arc
    this.cycleCount = 2;
    this.numItems = this.uniquePhotos.length * this.cycleCount;
    if (this.numItems === 0) this.numItems = 24;

    this.images = [];
    this.itemAngle = (Math.PI * 2) / this.numItems;
    this.angleGap = 0.014;

    // Geometry
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cx = 0;
    this.cy = 0;
    this.rInner = 0;
    this.rOuter = 0;
    this.isMobile = false;

    // Pure manual scrolling & momentum
    this.rotationAngle = 0;
    this.targetRotation = null;
    this.angularVelocity = 0;
    this.isDragging = false;
    this.dragStartAngle = 0;
    this.dragStartRotation = 0;
    this.lastPointerAngle = 0;
    this.lastPointerTime = 0;
    this.dragMoved = 0;

    // Selection / Focus
    this.hoveredIndex = -1;
    this.activeIndex = 0;
    this.modalActiveIndex = 0;
    this.focalAngle = 0;

    this.init();
  }

  init() {
    this.loadImages();
    this.updateDimensions();
    this.bindEvents();
    if (this.uniquePhotos.length > 0) {
      this.updateInspectCard(0);
    }
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  loadImages() {
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
        console.warn(`Could not load image for photo ${idx + 1}`);
        itemData.loaded = false;
      };

      img.src = p.localUrl || p.url;
      if (img.complete && img.naturalWidth > 0) {
        itemData.loaded = true;
      }
      this.images.push(itemData);
    });
  }

  updateDimensions() {
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
      // Mobile: Generous circular gap for content, edge-to-edge right coverage, continuous top-to-bottom
      this.cx = -this.width * 0.14;
      this.cy = this.height * 0.50;
      this.rInner = this.width * 0.72;
      this.rOuter = this.rInner + Math.min(this.width * 0.42, 175);
      this.focalAngle = 0;
    } else if (this.isTablet) {
      // Tablet: Sweeping arc on right
      this.cx = this.width * 0.16;
      this.cy = this.height * 0.50;
      this.rInner = Math.min(this.width, this.height) * 0.65;
      this.rOuter = this.rInner + Math.min(this.width * 0.20, 220);
      this.focalAngle = 0;
    } else {
      // Desktop / Laptop: Balanced rightward arc
      this.cx = this.width * 0.25;
      this.cy = this.height * 0.50;
      this.rInner = Math.min(this.width, this.height) * 0.76;
      this.rOuter = this.rInner + Math.min(this.width * 0.19, 275);
      this.focalAngle = 0;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.updateDimensions());

    // Pure manual scroll wheel rotation with responsive velocity
    window.addEventListener('wheel', (e) => {
      if (this.lightboxOverlay && this.lightboxOverlay.classList.contains('active')) return;
      this.targetRotation = null;
      const delta = e.deltaY || e.deltaX;
      this.angularVelocity += delta * (this.isMobile ? 0.0016 : 0.0006);
    }, { passive: true });

    // Pointer drag events on canvas
    this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

    // Card Prev / Next arrows & Inspect button
    if (this.btnCardPrev) {
      this.btnCardPrev.addEventListener('click', () => this.stepItem(-1));
    }
    if (this.btnCardNext) {
      this.btnCardNext.addEventListener('click', () => this.stepItem(1));
    }
    if (this.btnInspectModal) {
      this.btnInspectModal.addEventListener('click', () => this.openLightbox(this.activeIndex));
    }

    // Lightbox modal events
    if (this.modalCloseBtn) this.modalCloseBtn.addEventListener('click', () => this.closeLightbox());
    if (this.lightboxOverlay) {
      this.lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === this.lightboxOverlay) this.closeLightbox();
      });
    }
    if (this.btnModalPrev) this.btnModalPrev.addEventListener('click', () => this.navigateLightbox(-1));
    if (this.btnModalNext) this.btnModalNext.addEventListener('click', () => this.navigateLightbox(1));

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
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
    });
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

  rotateToSlot(slotIndex) {
    this.angularVelocity = 0;
    let target = this.focalAngle - slotIndex * this.itemAngle;
    while (target - this.rotationAngle > Math.PI) target -= Math.PI * 2;
    while (target - this.rotationAngle < -Math.PI) target += Math.PI * 2;
    this.targetRotation = target;
    const photoIdx = slotIndex % this.uniquePhotos.length;
    this.updateInspectCard(photoIdx);
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

        // Clamp maximum flick speed
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
      this.modalImg.src = (itemData && itemData.loaded && itemData.img) ? itemData.img.src : (p.localUrl || p.url);
      this.modalImg.alt = p.title;
    }
  }

  animate() {
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
    requestAnimationFrame(this.animate);
  }

  draw() {
    const ctx = this.ctx;
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

    // Clip to precise curved Annular Sector
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
}

function startGalleryApp() {
  if (!window.__galleryAppInstance) {
    window.__galleryAppInstance = new CircularGalleryApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startGalleryApp);
} else {
  startGalleryApp();
}
