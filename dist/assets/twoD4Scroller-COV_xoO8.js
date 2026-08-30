import{L as p}from"./lenis-BRqnZd4Q.js";class f{constructor(s){this.container=s||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.scrollVelocity=0,this.targetVelocity=0,this.isDestroyed=!1,this.frames=[],this.numFrames=10,this.images=["/image1.png","/image2.png","/image3.png"],this.mouse={x:0,y:0,targetX:0,targetY:0},this.onMouseMove=t=>{this.mouse.targetX=(t.clientX/window.innerWidth-.5)*2,this.mouse.targetY=(t.clientY/window.innerHeight-.5)*2}}mount(){this.renderDOM(),this.initLenis(),this.initPhotoFrames(),window.addEventListener("mousemove",this.onMouseMove),this.startLoop()}renderDOM(){const s=document.getElementById("two-d4-root");s&&s.remove();const t=document.createElement("div");t.id="two-d4-root",t.className="two-d4-root",t.innerHTML=`
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
    `,this.container.appendChild(t)}initPhotoFrames(){const s=document.getElementById("framesTrack");if(s){s.innerHTML="",this.frames=[];for(let t=0;t<this.numFrames;t++){const n=this.images[t%this.images.length],e=t%2===1,r=t%3!==0,i=document.createElement("div");i.className=`photo-frame ${e?"align-right":"align-left"} ${r?"frame-landscape":"frame-portrait"}`,i.dataset.index=t,i.innerHTML=`
        <div class="hanging-wire"></div>
        <div class="frame-structure">
          <div class="matting-passepartout">
            <div class="artwork-window">
              <img src="${n}" alt="" class="frame-img-base" />
              <div class="frame-img-reveal">
                <img src="${n}" alt="" class="frame-img-color" />
              </div>
              <div class="museum-glass-glare"></div>
            </div>
          </div>
          <div class="frame-brass-tag">EXHIBIT 0${t+1}</div>
        </div>
      `,s.appendChild(i);const o={element:i,structure:i.querySelector(".frame-structure"),reveal:i.querySelector(".frame-img-reveal"),index:t,isRight:e,progress:t/(this.numFrames-1),baseX:(e?1:-1)*(220+t%3*60),swingAngle:0,hoverProgress:0,isHovered:!1};i.addEventListener("mouseenter",()=>{o.isHovered=!0}),i.addEventListener("mouseleave",()=>{o.isHovered=!1}),this.frames.push(o)}}}initLenis(){this.lenis=new p({duration:1.2,easing:s=>Math.min(1,1.001-Math.pow(2,-10*s)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",s=>{this.currentScroll=s.scroll,this.targetVelocity=s.velocity*.01})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;const s=document.documentElement.scrollHeight-window.innerHeight,t=window.innerHeight,n=window.innerWidth;this.frames.forEach(e=>{e.isHovered?e.hoverProgress=Math.min(1,e.hoverProgress+.08):e.hoverProgress=Math.max(0,e.hoverProgress-.04);const r=e.hoverProgress*100;e.reveal&&(e.reveal.style.clipPath=`polygon(0 0, ${r}% 0, ${r}% 100%, 0 100%)`);const o=e.progress*s-this.currentScroll,a=o/(t*.8),l=Math.max(-15,Math.min(15,this.scrollVelocity*(e.isRight?28:-28)));e.swingAngle+=(l-e.swingAngle)*.1;const c=(e.isRight?1:-1)*Math.min(280,n*.24)+this.mouse.x*12,h=t*.5+o*.95-140,m=e.swingAngle+(e.isRight?-2:2),d=(e.isRight?-14:14)+this.mouse.x*6,g=-a*16-this.mouse.y*6,u=Math.max(.75,Math.min(1.08,1-Math.abs(a)*.2)),v=Math.max(.2,Math.min(1,1-Math.abs(a)*.6));e.element.style.transform=`
        translate3d(${c}px, ${h}px, 0px)
        rotateX(${g}deg)
        rotateY(${d}deg)
        rotateZ(${m}deg)
        scale(${u})
      `,e.element.style.opacity=v.toFixed(3),e.element.style.zIndex=Math.round(50-Math.abs(a*20))})}startLoop(){const s=t=>{this.isDestroyed||(this.lenis&&this.lenis.raf(t),this.update(),this.rafId=requestAnimationFrame(s))};this.rafId=requestAnimationFrame(s)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy(),window.removeEventListener("mousemove",this.onMouseMove);const s=document.getElementById("two-d4-root");s&&s.remove()}}export{f as TwoD4Scroller};
