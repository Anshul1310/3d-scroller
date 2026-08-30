import{L as M}from"./lenis-BRqnZd4Q.js";class D{constructor(e){this.container=e||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.scrollVelocity=0,this.targetVelocity=0,this.isDestroyed=!1,this.shards=[],this.activeChapter=0,this.images=["/image1.png","/image2.png","/image3.png"],this.numChapters=5,this.mouse={x:0,y:0,targetX:0,targetY:0},this.onMouseMove=s=>{this.mouse.targetX=(s.clientX/window.innerWidth-.5)*2,this.mouse.targetY=(s.clientY/window.innerHeight-.5)*2}}mount(){this.renderDOM(),this.initLenis(),this.initVortexShards(),window.addEventListener("mousemove",this.onMouseMove),this.startLoop()}renderDOM(){const e=document.getElementById("two-d3-root");e&&e.remove();const s=document.createElement("div");s.id="two-d3-root",s.className="two-d3-root",s.innerHTML=`
      <div class="nav">
        <h1>2D3 RADIAL VORTEX</h1>
        <div class="nav-routes" style="display:flex;gap:0.4rem;flex-wrap:wrap;">
          <a href="/2d" class="mode-switch-btn nav-route-link" data-route="/2d">2D SPIRAL</a>
          <a href="/2d1" class="mode-switch-btn nav-route-link" data-route="/2d1">2D1 KINETIC</a>
          <a href="/2d2" class="mode-switch-btn nav-route-link" data-route="/2d2">2D2 DECK</a>
          <a href="/2d4" class="mode-switch-btn nav-route-link" data-route="/2d4">2D4 FRAMES</a>
          <a href="/2d5" class="mode-switch-btn nav-route-link" data-route="/2d5">2D5 BOOK</a>
          <a href="/" class="mode-switch-btn nav-route-link" data-route="/">3D MODE</a>
        </div>
      </div>

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
    `,this.container.appendChild(s)}initVortexShards(){const e=document.getElementById("vortexCore");if(!e)return;e.innerHTML="",this.shards=[];const s=8;for(let a=0;a<this.numChapters;a++){const r=this.images[a%this.images.length];for(let t=0;t<s;t++){const i=document.createElement("div");i.className=`vortex-shard shard-${t}`,i.dataset.chapter=a,i.dataset.shard=t;const n=t*360/s,c=n*Math.PI/180;i.innerHTML=`
          <div class="shard-inner">
            <div class="shard-media">
              <img src="${r}" alt="" class="v-img-base" />
              <div class="v-img-reveal">
                <img src="${r}" alt="" class="v-img-color" />
              </div>
            </div>
            <div class="shard-flare"></div>
          </div>
        `,e.appendChild(i);const o={element:i,inner:i.querySelector(".shard-inner"),reveal:i.querySelector(".v-img-reveal"),chapter:a,shardIndex:t,angleDeg:n,angleRad:c,baseRadius:180+t%2*60,hoverProgress:0,isHovered:!1};i.addEventListener("mouseenter",()=>{o.isHovered=!0}),i.addEventListener("mouseleave",()=>{o.isHovered=!1}),this.shards.push(o)}}}initLenis(){this.lenis=new M({duration:1.2,easing:e=>Math.min(1,1.001-Math.pow(2,-10*e)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",e=>{this.currentScroll=e.scroll,this.targetVelocity=e.velocity*.015})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;const e=document.documentElement.scrollHeight-window.innerHeight,s=e>0?this.currentScroll/e:0,a=s*(this.numChapters-1),r=s*720+this.scrollVelocity*50;this.shards.forEach(t=>{t.isHovered?t.hoverProgress=Math.min(1,t.hoverProgress+.08):t.hoverProgress=Math.max(0,t.hoverProgress-.04);const i=t.hoverProgress*100;t.reveal&&(t.reveal.style.clipPath=`polygon(0 0, ${i}% 0, ${i}% 100%, 0 100%)`);const n=t.chapter-a,c=Math.abs(n),o=Math.max(0,1-c),l=t.angleRad+r*Math.PI/180,h=t.baseRadius*(.3+o*.95)+Math.abs(this.scrollVelocity)*80,d=Math.cos(l)*h+this.mouse.x*25,m=Math.sin(l)*h+this.mouse.y*25,u=t.angleDeg+r+this.scrollVelocity*40,v=Math.sin(l)*28*(1-o),g=Math.cos(l)*28*(1-o),p=o*140-c*250,f=Math.max(.1,o*1.05+(1-o)*.35),y=Math.max(0,Math.min(1,Math.pow(o,1.4)));t.element.style.transform=`
        translate3d(${d}px, ${m}px, ${p}px)
        rotateX(${v}deg)
        rotateY(${g}deg)
        rotateZ(${u}deg)
        scale(${f})
      `,t.element.style.opacity=y.toFixed(3),t.element.style.zIndex=Math.round(50+o*50)})}startLoop(){const e=s=>{this.isDestroyed||(this.lenis&&this.lenis.raf(s),this.update(),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy(),window.removeEventListener("mousemove",this.onMouseMove);const e=document.getElementById("two-d3-root");e&&e.remove()}}export{D as TwoD3Scroller};
