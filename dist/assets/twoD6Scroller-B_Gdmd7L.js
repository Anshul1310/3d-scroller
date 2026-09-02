class M{constructor(t){this.container=t||document.body,this.isDestroyed=!1,this.rafId=null,this.uniquePhotos=[{id:"tf-01",title:"Sisterhood & Community Spirit",category:"Community",author:"Aqsa Altaf (Launchpad)",timestamp:"Edition 01 • Day 1",location:"Auditorium Concourse",description:"Capturing the boundless excitement and warm camaraderie at the opening check-in of the hackathon festival.",url:"/assets/photo_01.jpg",color:"#6366f1"},{id:"tf-02",title:"The Keynote Visionary",category:"Keynote",author:"Hao Zheng (Launchpad)",timestamp:"Edition 02 • Inauguration",location:"Golden Jubilee Convention Hall",description:"Opening address on the horizon of autonomous intelligence and building technology that serves humanity.",url:"/assets/photo_02.jpg",color:"#0ea5e9"},{id:"tf-03",title:"The Eureka Moment",category:"Breakthrough",author:"Ann Marie Pace (Launchpad)",timestamp:"Edition 03 • Midnight",location:"Main Coding Arena",description:"A spontaneous burst of triumph as a high-frequency inference pipeline compiles cleanly after 18 hours of refactoring.",url:"/assets/photo_03.jpg",color:"#f59e0b"},{id:"tf-04",title:"Mentorship & Family Support",category:"Perspectives",author:"Stefanie Abel Horowitz",timestamp:"Edition 04 • Afternoon",location:"Veranda Sandbox",description:"The heartwarming human stories behind every developer who dares to build from scratch.",url:"/assets/photo_04.jpg",color:"#ec4899"},{id:"tf-05",title:"Street Culture & Local Heritage",category:"Culture",author:"Jessica Mendez Siqueiros",timestamp:"Edition 05 • Twilight",location:"Trichy Quadrangle",description:"Celebrating local flavors, midnight street treats, and timeless memories outside the hacker arena.",url:"/assets/photo_05.jpg",color:"#10b981"},{id:"tf-06",title:"The Next Generation Architect",category:"Futurism",author:"Moxie Peng (Launchpad)",timestamp:"Edition 06 • Morning",location:"Innovation Pavilion",description:"Eyes raised toward the future—curiosity, wonder, and determination defining tomorrow's creators.",url:"/assets/photo_06.jpg",color:"#06b6d4"},{id:"tf-07",title:"Main Arena // Midnight Sprint",category:"Hacking",author:"TransfiNITTe Media Cell",timestamp:"Oct 22, 2025 • 02:30 IST",location:"GJCH Main Arena Hall B",description:"Over 1200 hackers in deep flow state beneath pulsing blue and green cyber neon lighting grids.",url:"/assets/photo_07.jpg",color:"#3b82f6"},{id:"tf-08",title:"Champions Podium // Grand Finale",category:"Triumph",author:"Pranav M. & Vignesh T.",timestamp:"Oct 23, 2025 • 16:00 IST",location:"Grand Podium Stage",description:"The gold TransfiNITTe Cup awarded to the grand prize winners amidst confetti and standing ovations.",url:"/assets/photo_08.jpg",color:"#eab308"},{id:"tf-09",title:"Robotics & Hardware Sandbox",category:"Hardware",author:"Robotics Council NIT Trichy",timestamp:"Oct 22, 2025 • 14:15 IST",location:"Embedded Systems Lab",description:"Autonomous micro-drone navigation and custom PCB soldering trials tested in real-time obstacle nets.",url:"/assets/photo_09.jpg",color:"#14b8a6"},{id:"tf-10",title:"Laser Matrix // Central Concourse",category:"Atmosphere",author:"Devansh R. (Stage Lead)",timestamp:"Oct 22, 2025 • 21:00 IST",location:"Central Concourse",description:"Volumetric cyber laser arrays casting geometric planes of light over the hackathon concourse.",url:"/assets/photo_10.jpg",color:"#a855f7"},{id:"tf-11",title:"System Architecture & Mentorship",category:"Mentorship",author:"Corporate Engineering Guild",timestamp:"Oct 22, 2025 • 17:40 IST",location:"Cluster 3 Seminar Hall",description:"Industry veterans stress-testing high-availability topologies and edge-compute failure scenarios.",url:"/assets/photo_11.jpg",color:"#6366f1"},{id:"tf-12",title:"Zero Hour Countdown // 00:00:01",category:"Zero Hour",author:"Team TransfiNITTe",timestamp:"Oct 23, 2025 • 08:59 IST",location:"Jumbotron Central Screen",description:"The final seconds before git merge lockdown. Heart rates peaking across all 400 competing teams.",url:"/assets/photo_12.jpg",color:"#f43f5e"}],this.cycleCount=2,this.numItems=this.uniquePhotos.length*this.cycleCount,this.itemAngle=Math.PI*2/this.numItems,this.angleGap=.014,this.images=[],this.width=window.innerWidth,this.height=window.innerHeight,this.dpr=Math.min(window.devicePixelRatio||1,2),this.cx=0,this.cy=0,this.rInner=0,this.rOuter=0,this.isMobile=!1,this.isTablet=!1,this.rotationAngle=0,this.targetRotation=null,this.angularVelocity=0,this.isDragging=!1,this.dragStartAngle=0,this.dragStartRotation=0,this.lastPointerAngle=0,this.lastPointerTime=0,this.dragMoved=0,this.hoveredIndex=-1,this.activeIndex=0,this.modalActiveIndex=0,this.focalAngle=0,this.boundResize=null,this.boundWheel=null,this.boundPointerDown=null,this.boundPointerMove=null,this.boundPointerUp=null,this.boundKeyDown=null}mount(){this.renderDOM(),this.loadImages(),this.updateDimensions(),this.bindEvents(),this.updateInspectCard(0),this.animate=this.animate.bind(this),this.rafId=requestAnimationFrame(this.animate)}renderDOM(){const t=document.getElementById("two-d6-root");t&&t.remove();const i=document.createElement("div");i.id="two-d6-root",i.className="two-d6-root",i.innerHTML=`
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
    `,this.container.appendChild(i),this.canvas=i.querySelector("#galleryCanvas"),this.ctx=this.canvas.getContext("2d"),this.wrapper=i.querySelector(".canvas-wrapper"),this.tooltip=i.querySelector("#hoverTooltip"),this.inspectTheme=i.querySelector("#inspectTheme"),this.inspectIndex=i.querySelector("#inspectIndex"),this.inspectTitle=i.querySelector("#inspectTitle"),this.inspectDescription=i.querySelector("#inspectDescription"),this.btnCardPrev=i.querySelector("#btnCardPrev"),this.btnCardNext=i.querySelector("#btnCardNext"),this.btnInspectModal=i.querySelector("#btnInspectModal"),this.lightboxOverlay=i.querySelector("#lightboxOverlay"),this.modalCloseBtn=i.querySelector("#modalCloseBtn"),this.modalPhotoId=i.querySelector("#modalPhotoId"),this.modalBadge=i.querySelector("#modalBadge"),this.modalTitle=i.querySelector("#modalTitle"),this.modalDescription=i.querySelector("#modalDescription"),this.modalImg=i.querySelector("#modalImg"),this.btnModalPrev=i.querySelector("#btnModalPrev"),this.btnModalNext=i.querySelector("#btnModalNext")}loadImages(){this.images=[],this.uniquePhotos.forEach((t,i)=>{const e=new Image,s={img:e,loaded:!1,data:t};e.onload=()=>{s.loaded=!0},e.onerror=()=>{s.loaded=!1},e.src=t.url,e.complete&&e.naturalWidth>0&&(s.loaded=!0),this.images.push(s)})}updateDimensions(){this.canvas&&(this.width=window.innerWidth,this.height=window.innerHeight,this.dpr=Math.min(window.devicePixelRatio||1,2),this.canvas.width=this.width*this.dpr,this.canvas.height=this.height*this.dpr,this.canvas.style.width=`${this.width}px`,this.canvas.style.height=`${this.height}px`,this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0),this.isMobile=this.width<768,this.isTablet=this.width>=768&&this.width<1100,this.isMobile?(this.cx=-this.width*.14,this.cy=this.height*.52,this.rInner=this.width*.72,this.rOuter=this.rInner+Math.min(this.width*.42,175),this.focalAngle=0):this.isTablet?(this.cx=this.width*.16,this.cy=this.height*.5,this.rInner=Math.min(this.width,this.height)*.65,this.rOuter=this.rInner+Math.min(this.width*.2,220),this.focalAngle=0):(this.cx=this.width*.25,this.cy=this.height*.5,this.rInner=Math.min(this.width,this.height)*.76,this.rOuter=this.rInner+Math.min(this.width*.19,275),this.focalAngle=0))}bindEvents(){this.boundResize=()=>this.updateDimensions(),window.addEventListener("resize",this.boundResize),this.boundWheel=t=>{if(this.lightboxOverlay&&this.lightboxOverlay.classList.contains("active")||t.target&&t.target.closest&&t.target.closest(".app-global-nav"))return;this.targetRotation=null;const i=t.deltaY||t.deltaX;this.angularVelocity+=i*(this.isMobile?.0016:6e-4)},window.addEventListener("wheel",this.boundWheel,{passive:!0}),this.boundPointerDown=t=>this.onPointerDown(t),this.boundPointerMove=t=>this.onPointerMove(t),this.boundPointerUp=t=>this.onPointerUp(t),this.canvas&&this.canvas.addEventListener("pointerdown",this.boundPointerDown),window.addEventListener("pointermove",this.boundPointerMove),window.addEventListener("pointerup",this.boundPointerUp),window.addEventListener("pointercancel",this.boundPointerUp),this.btnCardPrev&&this.btnCardPrev.addEventListener("click",()=>this.stepItem(-1)),this.btnCardNext&&this.btnCardNext.addEventListener("click",()=>this.stepItem(1)),this.btnInspectModal&&this.btnInspectModal.addEventListener("click",()=>this.openLightbox(this.activeIndex)),this.modalCloseBtn&&this.modalCloseBtn.addEventListener("click",()=>this.closeLightbox()),this.lightboxOverlay&&this.lightboxOverlay.addEventListener("click",t=>{t.target===this.lightboxOverlay&&this.closeLightbox()}),this.btnModalPrev&&this.btnModalPrev.addEventListener("click",()=>this.navigateLightbox(-1)),this.btnModalNext&&this.btnModalNext.addEventListener("click",()=>this.navigateLightbox(1)),this.boundKeyDown=t=>{t.code==="ArrowLeft"||t.code==="ArrowUp"?(t.preventDefault(),this.lightboxOverlay&&this.lightboxOverlay.classList.contains("active")?this.navigateLightbox(-1):this.stepItem(-1)):t.code==="ArrowRight"||t.code==="ArrowDown"?(t.preventDefault(),this.lightboxOverlay&&this.lightboxOverlay.classList.contains("active")?this.navigateLightbox(1):this.stepItem(1)):t.code==="Space"?(t.preventDefault(),this.openLightbox(this.activeIndex)):t.code==="Escape"&&this.closeLightbox()},window.addEventListener("keydown",this.boundKeyDown)}goToNext(){this.angularVelocity=0;const i=Math.round((this.focalAngle-this.rotationAngle)/this.itemAngle)+1;this.targetRotation=this.focalAngle-i*this.itemAngle;const e=(this.activeIndex+1)%this.uniquePhotos.length;this.updateInspectCard(e)}goToPrev(){this.angularVelocity=0;const i=Math.round((this.focalAngle-this.rotationAngle)/this.itemAngle)-1;this.targetRotation=this.focalAngle-i*this.itemAngle;const e=(this.activeIndex-1+this.uniquePhotos.length)%this.uniquePhotos.length;this.updateInspectCard(e)}stepItem(t){t>0?this.goToNext():this.goToPrev()}getPolar(t,i){const e=t-this.cx,s=i-this.cy,o=Math.hypot(e,s),n=Math.atan2(s,e);return{dist:o,angle:n}}getItemAtPoint(t,i){const{dist:e,angle:s}=this.getPolar(t,i);if(e<this.rInner-15||e>this.rOuter+20)return-1;let o=s-this.rotationAngle;return o=(o%(Math.PI*2)+Math.PI*2)%(Math.PI*2),Math.floor(o/this.itemAngle)%this.numItems}onPointerDown(t){if(t.button!==void 0&&t.button!==0||t.target&&t.target.closest&&t.target.closest(".app-global-nav"))return;this.isDragging=!0,this.targetRotation=null;const{angle:i}=this.getPolar(t.clientX,t.clientY);this.dragStartAngle=i,this.dragStartRotation=this.rotationAngle,this.lastPointerAngle=i,this.lastPointerTime=performance.now(),this.dragMoved=0,this.angularVelocity=0}onPointerMove(t){if(this.isDestroyed)return;const{angle:i}=this.getPolar(t.clientX,t.clientY);if(this.isDragging){let e=i-this.dragStartAngle;for(;e>Math.PI;)e-=Math.PI*2;for(;e<-Math.PI;)e+=Math.PI*2;const s=this.isMobile?1.7:1;this.rotationAngle=this.dragStartRotation+e*s,this.dragMoved+=Math.abs(e);const o=performance.now(),n=o-this.lastPointerTime;if(n>12){let a=i-this.lastPointerAngle;for(;a>Math.PI;)a-=Math.PI*2;for(;a<-Math.PI;)a+=Math.PI*2;const h=this.isMobile?2.4:1;this.angularVelocity=a/n*16*h;const r=this.isMobile?.08:.05;this.angularVelocity=Math.max(-r,Math.min(r,this.angularVelocity)),this.lastPointerAngle=i,this.lastPointerTime=o}this.hideTooltip()}else{const e=this.getItemAtPoint(t.clientX,t.clientY);if(e!==this.hoveredIndex)if(this.hoveredIndex=e,e!==-1){const s=e%this.uniquePhotos.length,o=this.uniquePhotos[s];o&&this.showTooltip(t.clientX,t.clientY,o)}else this.hideTooltip();else e!==-1&&this.updateTooltipPos(t.clientX,t.clientY)}}onPointerUp(t){if(this.isDragging&&(this.isDragging=!1,this.dragMoved<.02)){const i=this.getItemAtPoint(t.clientX,t.clientY);if(i!==-1){const e=i%this.uniquePhotos.length;this.openLightbox(e)}}}showTooltip(t,i,e){if(!this.tooltip)return;const s=this.tooltip.querySelector(".tooltip-title");s&&(s.textContent=e.title),this.updateTooltipPos(t,i),this.tooltip.classList.add("visible")}updateTooltipPos(t,i){this.tooltip&&(this.tooltip.style.left=`${t}px`,this.tooltip.style.top=`${i}px`)}hideTooltip(){this.tooltip&&this.tooltip.classList.remove("visible")}updateInspectCard(t){const i=this.uniquePhotos[t];i&&(this.activeIndex=t,this.inspectTheme&&(this.inspectTheme.textContent=`THEME: ${i.category.toUpperCase()}`),this.inspectIndex&&(this.inspectIndex.textContent=`[ ${String(t+1).padStart(2,"0")} / ${String(this.uniquePhotos.length).padStart(2,"0")} ]`),this.inspectTitle&&(this.inspectTitle.textContent=i.title),this.inspectDescription&&(this.inspectDescription.textContent=i.description))}openLightbox(t){this.uniquePhotos[t]&&(this.modalActiveIndex=t,this.updateLightboxContent(),this.lightboxOverlay&&this.lightboxOverlay.classList.add("active"))}closeLightbox(){this.lightboxOverlay&&this.lightboxOverlay.classList.remove("active")}navigateLightbox(t){const i=this.uniquePhotos.length;this.modalActiveIndex=(this.modalActiveIndex+t+i)%i,this.updateLightboxContent(),this.updateInspectCard(this.modalActiveIndex)}updateLightboxContent(){const t=this.uniquePhotos[this.modalActiveIndex];if(!t)return;this.modalPhotoId&&(this.modalPhotoId.textContent=`INDEX [${String(this.modalActiveIndex+1).padStart(2,"0")}]`),this.modalBadge&&(this.modalBadge.textContent=`THEME: ${t.category.toUpperCase()}`),this.modalTitle&&(this.modalTitle.textContent=t.title),this.modalDescription&&(this.modalDescription.textContent=t.description);const i=this.images[this.modalActiveIndex];this.modalImg&&(this.modalImg.src=i&&i.loaded&&i.img?i.img.src:t.url,this.modalImg.alt=t.title)}animate(){if(!this.isDestroyed){if(this.isDragging)this.targetRotation=null;else if(this.targetRotation!==null){const t=this.targetRotation-this.rotationAngle;Math.abs(t)<5e-4?(this.rotationAngle=this.targetRotation,this.targetRotation=null,this.angularVelocity=0):this.rotationAngle+=t*.18}else{this.rotationAngle+=this.angularVelocity;const t=this.isMobile?.945:.89;this.angularVelocity*=t,Math.abs(this.angularVelocity)<5e-5&&(this.angularVelocity=0)}if(this.uniquePhotos.length>0){let t=this.focalAngle-this.rotationAngle;t=(t%(Math.PI*2)+Math.PI*2)%(Math.PI*2);const e=Math.round(t/this.itemAngle)%this.numItems%this.uniquePhotos.length;this.activeIndex!==e&&this.targetRotation===null&&this.updateInspectCard(e)}this.draw(),this.rafId=requestAnimationFrame(this.animate)}}draw(){const t=this.ctx;if(t){t.clearRect(0,0,this.width,this.height),this.drawDecorations(t);for(let i=0;i<this.numItems;i++){const e=this.rotationAngle+i*this.itemAngle,s=e-this.itemAngle/2+this.angleGap/2,o=e+this.itemAngle/2-this.angleGap/2,n=this.hoveredIndex===i,a=i%this.uniquePhotos.length,h=this.activeIndex===a;this.drawPhotoSector(t,i,a,s,o,e,n,h)}this.drawFocalIndicator(t)}}drawDecorations(t){t.save();const i=-Math.PI/2,e=Math.PI/2;t.beginPath(),t.arc(this.cx,this.cy,this.rInner-8,i,e),t.strokeStyle="rgba(255, 255, 255, 0.14)",t.lineWidth=1,t.stroke(),t.beginPath(),t.arc(this.cx,this.cy,this.rOuter+8,i,e),t.strokeStyle="rgba(255, 255, 255, 0.14)",t.lineWidth=1,t.stroke(),t.setLineDash([4,10]),t.beginPath(),t.arc(this.cx,this.cy,this.rInner-18,i,e),t.strokeStyle="rgba(255, 255, 255, 0.08)",t.stroke(),t.setLineDash([]);const s=96;for(let o=0;o<s;o++){const n=o/s*Math.PI*2+this.rotationAngle;if(Math.cos(n)<.05)continue;const a=o%4===0,h=a?12:5,r=this.rInner-8,l=r-h;t.beginPath(),t.moveTo(this.cx+r*Math.cos(n),this.cy+r*Math.sin(n)),t.lineTo(this.cx+l*Math.cos(n),this.cy+l*Math.sin(n)),t.strokeStyle=a?"rgba(255, 255, 255, 0.4)":"rgba(255, 255, 255, 0.14)",t.lineWidth=a?1.5:1,t.stroke()}t.restore()}drawPhotoSector(t,i,e,s,o,n,a,h){if(Math.cos(n)<-.2)return;const r=this.images[e],l=this.uniquePhotos[e],v=(this.rInner+this.rOuter)/2,c=this.rOuter-this.rInner,g=this.rOuter*(o-s);t.save(),t.beginPath(),t.arc(this.cx,this.cy,this.rOuter,s,o,!1),t.arc(this.cx,this.cy,this.rInner,o,s,!0),t.closePath(),t.clip();const f=this.cx+v*Math.cos(n),y=this.cy+v*Math.sin(n);t.translate(f,y),t.rotate(n+Math.PI/2);const b=a?1.06:1;if(t.scale(b,b),r&&r.loaded&&r.img){const d=r.img,I=g*1.15,w=c*1.15,m=(d.naturalWidth||800)/(d.naturalHeight||533);let p=I,u=w;p/u>m?u=p/m:p=u*m,t.drawImage(d,-p/2,-u/2,p,u)}else{const d=t.createLinearGradient(-c,-g,c,g);d.addColorStop(0,"#101018"),d.addColorStop(.5,l&&l.color?l.color:"#2563eb"),d.addColorStop(1,"#08080c"),t.fillStyle=d,t.fillRect(-g,-c,g*2,c*2),t.fillStyle="#ffffff",t.font='bold 13px "Space Grotesk", sans-serif',t.textAlign="center",t.fillText(l?l.title:`ITEM ${e+1}`,0,0)}a?(t.fillStyle="rgba(0, 255, 136, 0.08)",t.fillRect(-1e3,-1e3,2e3,2e3)):h||(t.fillStyle="rgba(0, 0, 0, 0.16)",t.fillRect(-1e3,-1e3,2e3,2e3)),t.restore(),t.save(),t.beginPath(),t.arc(this.cx,this.cy,this.rOuter,s,o,!1),t.arc(this.cx,this.cy,this.rInner,o,s,!0),t.closePath(),a?(t.strokeStyle="#00ff88",t.lineWidth=2.5,t.shadowColor="#00ff88",t.shadowBlur=10):h?(t.strokeStyle="#ffffff",t.lineWidth=1.8):(t.strokeStyle="rgba(255, 255, 255, 0.25)",t.lineWidth=1),t.stroke(),t.restore()}drawFocalIndicator(t){t.save();const i=this.focalAngle,e=this.rInner-12,s=this.cx+e*Math.cos(i),o=this.cy+e*Math.sin(i);t.translate(s,o),t.rotate(i),t.beginPath(),t.moveTo(-10,-7),t.lineTo(0,0),t.lineTo(-10,7),t.strokeStyle="#00ff88",t.lineWidth=2.2,t.stroke(),t.restore()}destroy(){this.isDestroyed=!0,this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.boundResize&&window.removeEventListener("resize",this.boundResize),this.boundWheel&&window.removeEventListener("wheel",this.boundWheel),this.canvas&&this.boundPointerDown&&this.canvas.removeEventListener("pointerdown",this.boundPointerDown),this.boundPointerMove&&window.removeEventListener("pointermove",this.boundPointerMove),this.boundPointerUp&&(window.removeEventListener("pointerup",this.boundPointerUp),window.removeEventListener("pointercancel",this.boundPointerUp)),this.boundKeyDown&&window.removeEventListener("keydown",this.boundKeyDown);const t=document.getElementById("two-d6-root");t&&t.remove(),this.images=[]}}export{M as TwoD6Scroller};
