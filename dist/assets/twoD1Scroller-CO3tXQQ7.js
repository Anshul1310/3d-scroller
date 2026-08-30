import{L as k}from"./lenis-BRqnZd4Q.js";class S{constructor(t){this.container=t||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.targetVelocity=0,this.scrollVelocity=0,this.isDestroyed=!1,this.cards=[],this.towerAngle=0,this.numCards=12,this.images=["/image1.png","/image2.png","/image3.png"],this.mouse={x:0,y:0,targetX:0,targetY:0},this.onMouseMove=s=>{this.mouse.targetX=(s.clientX/window.innerWidth-.5)*2,this.mouse.targetY=(s.clientY/window.innerHeight-.5)*2}}mount(){this.renderDOM(),this.initLenis(),this.initCards(),window.addEventListener("mousemove",this.onMouseMove),this.startLoop()}renderDOM(){const t=document.getElementById("two-d1-root");t&&t.remove();const s=document.createElement("div");s.id="two-d1-root",s.className="two-d1-root",s.innerHTML=`
      <div class="nav">
        <h1>2D1 KINETIC SCROLLER</h1>
        <div class="nav-routes" style="display:flex;gap:0.4rem;flex-wrap:wrap;">
          <a href="/2d" class="mode-switch-btn nav-route-link" data-route="/2d">2D SPIRAL</a>
          <a href="/2d2" class="mode-switch-btn nav-route-link" data-route="/2d2">2D2 DECK</a>
          <a href="/2d3" class="mode-switch-btn nav-route-link" data-route="/2d3">2D3 VORTEX</a>
          <a href="/2d4" class="mode-switch-btn nav-route-link" data-route="/2d4">2D4 FRAMES</a>
          <a href="/2d5" class="mode-switch-btn nav-route-link" data-route="/2d5">2D5 BOOK</a>
          <a href="/" class="mode-switch-btn nav-route-link" data-route="/">3D MODE</a>
        </div>
      </div>

      <!-- 2D Kinetic Parallax Stage -->
      <div class="kinetic-stage" id="kineticStage">
        <!-- 2D Geometric Center Totem (translating tower.glb into rotating 2D isometric wireframe) -->
        <div class="center-totem" id="centerTotem">
          <div class="totem-ring ring-1"></div>
          <div class="totem-ring ring-2"></div>
          <div class="totem-ring ring-3"></div>
          <div class="totem-spine"></div>
        </div>

        <!-- Flying Dual-Ribbon Parallax Stream -->
        <div class="kinetic-track" id="kineticTrack">
          <!-- Injected dynamically -->
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
    `,this.container.appendChild(s)}initCards(){const t=document.getElementById("kineticTrack");if(t){t.innerHTML="",this.cards=[];for(let s=0;s<this.numCards;s++){const o=this.images[s%this.images.length],n=s%2===1,i=document.createElement("div");i.className=`kinetic-card ${n?"side-right":"side-left"}`,i.dataset.index=s,i.innerHTML=`
        <div class="kinetic-card-inner">
          <div class="slice slice-top">
            <img src="${o}" alt="" class="k-img-base" />
            <div class="k-img-reveal">
              <img src="${o}" alt="" class="k-img-color" />
            </div>
          </div>
          <div class="slice slice-bottom">
            <img src="${o}" alt="" class="k-img-base" />
            <div class="k-img-reveal">
              <img src="${o}" alt="" class="k-img-color" />
            </div>
          </div>
          <div class="kinetic-card-glare"></div>
        </div>
      `,t.appendChild(i);const e={element:i,inner:i.querySelector(".kinetic-card-inner"),sliceTop:i.querySelector(".slice-top"),sliceBottom:i.querySelector(".slice-bottom"),reveals:i.querySelectorAll(".k-img-reveal"),index:s,isRightSide:n,progress:s/(this.numCards-1),hoverProgress:0,isHovered:!1};i.addEventListener("mouseenter",()=>{e.isHovered=!0}),i.addEventListener("mouseleave",()=>{e.isHovered=!1}),this.cards.push(e)}}}initLenis(){this.lenis=new k({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",t=>{this.currentScroll=t.scroll,this.targetVelocity=t.velocity*.012})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;const t=document.documentElement.scrollHeight-window.innerHeight,s=t>0?this.currentScroll/t:0,o=window.innerHeight,n=window.innerWidth;this.towerAngle+=this.scrollVelocity*2.5;const i=document.getElementById("centerTotem");i&&(i.style.transform=`translate(-50%, -50%) rotate(${this.towerAngle}deg) scale(${1+Math.sin(s*Math.PI)*.15})`),this.cards.forEach(e=>{e.isHovered?e.hoverProgress=Math.min(1,e.hoverProgress+.08):e.hoverProgress=Math.max(0,e.hoverProgress-.04);const c=e.hoverProgress*100;e.reveals.forEach(M=>{M.style.clipPath=`polygon(0 0, ${c}% 0, ${c}% 100%, 0 100%)`});const d=e.progress*t-this.currentScroll,h=d/(o*.7),a=e.index*.8-s*6,r=e.isRightSide?1:-1,g=r*(Math.min(320,n*.26)+Math.sin(a)*60)+this.mouse.x*15,u=o*.5+d*.9-110,m=Math.cos(a),v=Math.max(.65,Math.min(1.12,.88+m*.18)),y=r*-6+this.scrollVelocity*35*r,p=r*-22+Math.sin(a)*15,f=-h*20-this.mouse.y*8,w=Math.max(.18,Math.min(1,1-Math.abs(h)*.65));e.element.style.transform=`
        translate3d(${g}px, ${u}px, 0px)
        rotateX(${f}deg)
        rotateY(${p}deg)
        rotateZ(${y}deg)
        scale(${v})
      `,e.element.style.opacity=w.toFixed(3),e.element.style.zIndex=Math.round(50+m*25);const l=Math.max(-20,Math.min(20,this.scrollVelocity*45));e.sliceTop&&(e.sliceTop.style.transform=`rotateX(${l}deg) skewX(${l*.4}deg)`),e.sliceBottom&&(e.sliceBottom.style.transform=`rotateX(${-l*.4}deg)`)})}startLoop(){const t=s=>{this.isDestroyed||(this.lenis&&this.lenis.raf(s),this.update(),this.rafId=requestAnimationFrame(t))};this.rafId=requestAnimationFrame(t)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy(),window.removeEventListener("mousemove",this.onMouseMove);const t=document.getElementById("two-d1-root");t&&t.remove()}}export{S as TwoD1Scroller};
