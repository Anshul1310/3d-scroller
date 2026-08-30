import{L as g}from"./lenis-BRqnZd4Q.js";class w{constructor(t){this.container=t||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.scrollVelocity=0,this.targetVelocity=0,this.isDestroyed=!1,this.cards=[],this.numCards=10,this.images=["/image1.png","/image2.png","/image3.png"],this.mouse={x:0,y:0,targetX:0,targetY:0},this.onMouseMove=e=>{this.mouse.targetX=(e.clientX/window.innerWidth-.5)*2,this.mouse.targetY=(e.clientY/window.innerHeight-.5)*2}}mount(){this.renderDOM(),this.initLenis(),this.initCards(),window.addEventListener("mousemove",this.onMouseMove),this.startLoop()}renderDOM(){const t=document.getElementById("two-d2-root");t&&t.remove();const e=document.createElement("div");e.id="two-d2-root",e.className="two-d2-root",e.innerHTML=`
      <div class="nav">
        <h1>2D2 HORIZONTAL DECK</h1>
        <div class="nav-routes" style="display:flex;gap:0.4rem;flex-wrap:wrap;">
          <a href="/2d" class="mode-switch-btn nav-route-link" data-route="/2d">2D SPIRAL</a>
          <a href="/2d1" class="mode-switch-btn nav-route-link" data-route="/2d1">2D1 KINETIC</a>
          <a href="/2d3" class="mode-switch-btn nav-route-link" data-route="/2d3">2D3 VORTEX</a>
          <a href="/2d4" class="mode-switch-btn nav-route-link" data-route="/2d4">2D4 FRAMES</a>
          <a href="/2d5" class="mode-switch-btn nav-route-link" data-route="/2d5">2D5 BOOK</a>
          <a href="/" class="mode-switch-btn nav-route-link" data-route="/">3D MODE</a>
        </div>
      </div>

      <!-- Horizontal 2.5D Coverflow Stage -->
      <div class="horizontal-stage" id="horizontalStage">
        <div class="deck-track" id="deckTrack">
          <!-- Cards injected dynamically -->
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
    `,this.container.appendChild(e)}initCards(){const t=document.getElementById("deckTrack");if(t){t.innerHTML="",this.cards=[];for(let e=0;e<this.numCards;e++){const a=this.images[e%this.images.length],i=document.createElement("div");i.className="deck-card",i.dataset.index=e,i.innerHTML=`
        <div class="deck-card-inner">
          <div class="deck-media">
            <img src="${a}" alt="" class="d-img-base" />
            <div class="d-img-reveal">
              <img src="${a}" alt="" class="d-img-color" />
            </div>
            <div class="deck-glare"></div>
          </div>
          <div class="deck-index-tag">0${e+1}</div>
        </div>
      `,t.appendChild(i);const n={element:i,inner:i.querySelector(".deck-card-inner"),reveal:i.querySelector(".d-img-reveal"),index:e,progress:e/(this.numCards-1),hoverProgress:0,isHovered:!1};i.addEventListener("mouseenter",()=>{n.isHovered=!0}),i.addEventListener("mouseleave",()=>{n.isHovered=!1}),this.cards.push(n)}}}initLenis(){this.lenis=new g({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",t=>{this.currentScroll=t.scroll,this.targetVelocity=t.velocity*.012})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;const t=document.documentElement.scrollHeight-window.innerHeight,e=t>0?this.currentScroll/t:0,a=window.innerWidth,i=(this.numCards-1)*360,n=e*i;this.cards.forEach(s=>{s.isHovered?s.hoverProgress=Math.min(1,s.hoverProgress+.08):s.hoverProgress=Math.max(0,s.hoverProgress-.04);const c=s.hoverProgress*100;s.reveal&&(s.reveal.style.clipPath=`polygon(0 0, ${c}% 0, ${c}% 100%, 0 100%)`);const r=s.index*360-n,o=r/(a*.5),d=Math.max(-55,Math.min(55,o*-45)),l=Math.max(-400,100-Math.abs(r)*.65),h=Math.abs(o)*35,m=Math.max(.68,Math.min(1.15,1-Math.abs(o)*.28)),u=Math.max(-18,Math.min(18,this.scrollVelocity*35))*(1-Math.abs(o)*.3)+o*4,v=Math.max(.2,Math.min(1,1.1-Math.abs(o)*.7));s.element.style.transform=`
        translate3d(${r+this.mouse.x*20}px, ${h+this.mouse.y*10}px, ${l}px)
        rotateY(${d}deg)
        rotateZ(${u}deg)
        scale(${m})
      `,s.element.style.opacity=v.toFixed(3),s.element.style.zIndex=Math.round(100+l)})}startLoop(){const t=e=>{this.isDestroyed||(this.lenis&&this.lenis.raf(e),this.update(),this.rafId=requestAnimationFrame(t))};this.rafId=requestAnimationFrame(t)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy(),window.removeEventListener("mousemove",this.onMouseMove);const t=document.getElementById("two-d2-root");t&&t.remove()}}export{w as TwoD2Scroller};
