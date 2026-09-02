import{L as N}from"./lenis-BRqnZd4Q.js";class z{constructor(t){this.container=t||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.scrollVelocity=0,this.targetVelocity=0,this.isDestroyed=!1,this.activeIndex=0,this.hoveredFilmIndex=-1,this.isDragging=!1,this.dragStartY=0,this.dragStartScroll=0,this.films=[{id:1,director:"AQSA ALTAF",title:"AMERICAN EID",tagline:"Two sisters celebrate Eid in a new world",imgSrc:"/image1.png",image:null},{id:2,director:"HAO ZHENG",title:"DINNER IS SERVED",tagline:"Ambition and identity at an elite school",imgSrc:"/image2.png",image:null},{id:3,director:"ANN MARIE PACE",title:"GROWING FANGS",tagline:"Half human, half vampire, fully trying to fit in",imgSrc:"/image3.png",image:null},{id:4,director:"STEFANIE ABEL HOROWITZ",title:"LET'S BE TIGERS",tagline:"Grief and healing through a playful afternoon",imgSrc:"/image1.png",image:null},{id:5,director:"JESSICA MENDEZ SIQUEIROS",title:"THE LAST OF THE CHUPACABRAS",tagline:"A lonely grandmother meets a legendary creature",imgSrc:"/image2.png",image:null},{id:6,director:"MOXIE PENG",title:"THE LITTLE PRINCE(SS)",tagline:"A 7-year-old discovers ballet and self-expression",imgSrc:"/image3.png",image:null}],this.numTotalSegments=24,this.anglePerSegment=Math.PI*2/this.numTotalSegments,this.mouse={x:0,y:0,targetX:0,targetY:0,canvasX:0,canvasY:0},this.currentRotation=0,this.targetRotation=0,this.onMouseMove=i=>{this.mouse.targetX=(i.clientX/window.innerWidth-.5)*2,this.mouse.targetY=(i.clientY/window.innerHeight-.5)*2;const e=this.canvas?this.canvas.getBoundingClientRect():null;e&&(this.mouse.canvasX=i.clientX-e.left,this.mouse.canvasY=i.clientY-e.top)},this.onMouseDown=i=>{i.target.closest(".poster-left-panel")||i.target.closest(".app-global-nav")||(this.isDragging=!0,this.dragStartY=i.clientY,this.dragStartScroll=this.currentScroll)},this.onMouseMoveDrag=i=>{if(!this.isDragging)return;const e=(i.clientY-this.dragStartY)*3;this.lenis&&this.lenis.scrollTo(this.dragStartScroll-e,{immediate:!0})},this.onMouseUp=()=>{this.isDragging=!1},this.onResize=()=>{this.resizeCanvas()}}mount(){this.preloadImages(),this.renderDOM(),this.initCanvas(),this.initLenis(),this.bindEvents(),this.startLoop()}preloadImages(){this.films.forEach(t=>{const i=new Image;i.src=t.imgSrc,t.image=i})}renderDOM(){const t=document.getElementById("two-d5-root");t&&t.remove();const i=document.createElement("div");i.id="two-d5-root",i.className="two-d5-root",i.innerHTML=`
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
              ${this.films.map((e,s)=>`
                <li class="director-item ${s===0?"active":""}" data-film-index="${s}">
                  <button class="director-btn" type="button">
                    <span class="director-bullet"></span>
                    <span class="director-name">${e.director}</span>
                  </button>
                </li>
              `).join("")}
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
    `,this.container.appendChild(i)}initCanvas(){this.canvas=document.getElementById("arcCanvas"),this.canvas&&(this.ctx=this.canvas.getContext("2d"),this.resizeCanvas())}resizeCanvas(){if(!this.canvas||!this.ctx)return;const t=window.devicePixelRatio||1,i=window.innerWidth,e=window.innerHeight;this.canvas.width=i*t,this.canvas.height=e*t,this.canvas.style.width=`${i}px`,this.canvas.style.height=`${e}px`,this.ctx.scale(t,t)}initLenis(){this.lenis=new N({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",t=>{this.currentScroll=t.scroll,this.targetVelocity=t.velocity*.015})}bindEvents(){window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("mousedown",this.onMouseDown),window.addEventListener("mousemove",this.onMouseMoveDrag),window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("resize",this.onResize),this.canvas&&this.canvas.addEventListener("click",i=>{this.hoveredFilmIndex>=0&&this.scrollToFilm(this.hoveredFilmIndex)});const t=document.getElementById("directorsList");t&&t.querySelectorAll(".director-item").forEach(i=>{i.addEventListener("click",()=>{const e=parseInt(i.dataset.filmIndex,10);this.scrollToFilm(e)})})}scrollToFilm(t){const i=Math.max(1,document.documentElement.scrollHeight-window.innerHeight),e=t/this.films.length*i;this.lenis&&this.lenis.scrollTo(e,{duration:1.3})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;const t=Math.max(1,document.documentElement.scrollHeight-window.innerHeight),e=this.currentScroll/t*(Math.PI*2*(this.films.length/this.numTotalSegments)*2.5);this.targetRotation=e,this.currentRotation+=(this.targetRotation-this.currentRotation)*.1;const s=document.getElementById("posterStage");if(s){const n=this.mouse.x*3.5,a=-this.mouse.y*2.5;s.style.transform=`rotateX(${a}deg) rotateY(${n}deg)`}this.drawArcWheel()}drawArcWheel(){if(!this.ctx||!this.canvas)return;const t=window.innerWidth,i=window.innerHeight,e=this.ctx;e.clearRect(0,0,t,i);const s=t<=768,n=s?t*.45:t*.52,a=s?i*.98:i*.92,f=s?Math.min(t*.72,450):Math.min(t*.68,i*1.15,880),o=s?180:Math.min(t*.26,320),c=f,w=f-o,D=-Math.PI*.32;let x=1/0,S=0;this.hoveredFilmIndex=-1;const y=this.mouse.canvasX-n,E=this.mouse.canvasY-a,L=Math.sqrt(y*y+E*E);let b=Math.atan2(E,y);for(let h=0;h<this.numTotalSegments;h++){const I=h%this.films.length,m=this.films[I],A=.006,C=-Math.PI*.95+h*this.anglePerSegment,g=C+this.currentRotation+A,v=C+this.anglePerSegment+this.currentRotation-A,d=(g+v)/2;let M=Math.atan2(Math.sin(d),Math.cos(d));if(M<-Math.PI*.95&&M>Math.PI*.4)continue;let l=Math.abs(M-D);l>Math.PI&&(l=Math.PI*2-l),l<x&&(x=l,S=I);const R=L>=w&&L<=c&&b>=g&&b<=v;R&&(this.hoveredFilmIndex=I);const H=l<this.anglePerSegment*.65;if(e.save(),e.beginPath(),e.arc(n,a,c,g,v,!1),e.arc(n,a,w,v,g,!0),e.closePath(),e.clip(),m.image&&m.image.complete&&m.image.naturalWidth>0){e.save();const T=(c+w)/2,F=n+Math.cos(d)*T,B=a+Math.sin(d)*T;e.translate(F,B),e.rotate(d+Math.PI/2);const P=H?1.06:R?1.08:1,r=o*1.5*P,p=o*1.25*P;e.drawImage(m.image,-r/2,-p/2,r,p);const u=e.createLinearGradient(-r/2,0,r/2,0);u.addColorStop(0,"rgba(0,0,0,0.15)"),u.addColorStop(.5,"rgba(255,255,255,0.05)"),u.addColorStop(1,"rgba(0,0,0,0.25)"),e.fillStyle=u,e.fillRect(-r/2,-p/2,r,p),e.restore()}else e.fillStyle="#222220",e.fill();e.strokeStyle="#f1efea",e.lineWidth=2.5,e.stroke(),e.restore()}S!==this.activeIndex&&(this.activeIndex=S,this.updateActiveUI(this.activeIndex))}updateActiveUI(t){const i=this.films[t];if(!i)return;const e=document.getElementById("directorsList");e&&e.querySelectorAll(".director-item").forEach((o,c)=>{c===t?o.classList.add("active"):o.classList.remove("active")});const s=document.getElementById("previewNumber"),n=document.getElementById("previewTitle"),a=document.getElementById("previewTagline");s&&(s.textContent=`PERSPECTIVE 0${i.id} OF 06`),n&&(n.style.opacity="0",n.style.transform="translateY(4px)",setTimeout(()=>{n.textContent=i.title,n.style.opacity="1",n.style.transform="translateY(0)"},100)),a&&(a.style.opacity="0",setTimeout(()=>{a.textContent=i.tagline,a.style.opacity="1"},100))}startLoop(){const t=i=>{this.isDestroyed||(this.lenis&&this.lenis.raf(i),this.update(),this.rafId=requestAnimationFrame(t))};this.rafId=requestAnimationFrame(t)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy(),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mousedown",this.onMouseDown),window.removeEventListener("mousemove",this.onMouseMoveDrag),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("resize",this.onResize);const t=document.getElementById("two-d5-root");t&&t.remove()}}export{z as TwoD5Scroller};
