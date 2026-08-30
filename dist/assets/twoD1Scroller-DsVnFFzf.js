import{L as k}from"./lenis-BRqnZd4Q.js";class T{constructor(t){this.container=t||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.targetVelocity=0,this.scrollVelocity=0,this.isDestroyed=!1,this.cards=[],this.towerAngle=0,this.numCards=12,this.images=["/image1.png","/image2.png","/image3.png"],this.mouse={x:0,y:0,targetX:0,targetY:0},this.onMouseMove=i=>{this.mouse.targetX=(i.clientX/window.innerWidth-.5)*2,this.mouse.targetY=(i.clientY/window.innerHeight-.5)*2}}mount(){this.renderDOM(),this.initLenis(),this.initCards(),window.addEventListener("mousemove",this.onMouseMove),this.startLoop()}renderDOM(){const t=document.getElementById("two-d1-root");t&&t.remove();const i=document.createElement("div");i.id="two-d1-root",i.className="two-d1-root",i.innerHTML=`
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
    `,this.container.appendChild(i)}initCards(){const t=document.getElementById("kineticTrack");if(t){t.innerHTML="",this.cards=[];for(let i=0;i<this.numCards;i++){const o=this.images[i%this.images.length],n=i%2===1,s=document.createElement("div");s.className=`kinetic-card ${n?"side-right":"side-left"}`,s.dataset.index=i,s.innerHTML=`
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
      `,t.appendChild(s);const e={element:s,inner:s.querySelector(".kinetic-card-inner"),sliceTop:s.querySelector(".slice-top"),sliceBottom:s.querySelector(".slice-bottom"),reveals:s.querySelectorAll(".k-img-reveal"),index:i,isRightSide:n,progress:i/(this.numCards-1),hoverProgress:0,isHovered:!1};s.addEventListener("mouseenter",()=>{e.isHovered=!0}),s.addEventListener("mouseleave",()=>{e.isHovered=!1}),this.cards.push(e)}}}initLenis(){this.lenis=new k({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",t=>{this.currentScroll=t.scroll,this.targetVelocity=t.velocity*.012})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;const t=document.documentElement.scrollHeight-window.innerHeight,i=t>0?this.currentScroll/t:0,o=window.innerHeight,n=window.innerWidth;this.towerAngle+=this.scrollVelocity*2.5;const s=document.getElementById("centerTotem");s&&(s.style.transform=`translate(-50%, -50%) rotate(${this.towerAngle}deg) scale(${1+Math.sin(i*Math.PI)*.15})`),this.cards.forEach(e=>{e.isHovered?e.hoverProgress=Math.min(1,e.hoverProgress+.08):e.hoverProgress=Math.max(0,e.hoverProgress-.04);const a=e.hoverProgress*100;e.reveals.forEach(M=>{M.style.clipPath=`polygon(0 0, ${a}% 0, ${a}% 100%, 0 100%)`});const h=e.progress*t-this.currentScroll,d=h/(o*.7),c=e.index*.8-i*6,r=e.isRightSide?1:-1,g=r*(Math.min(320,n*.26)+Math.sin(c)*60)+this.mouse.x*15,u=o*.5+h*.9-110,m=Math.cos(c),v=Math.max(.65,Math.min(1.12,.88+m*.18)),y=r*-6+this.scrollVelocity*35*r,p=r*-22+Math.sin(c)*15,f=-d*20-this.mouse.y*8,w=Math.max(.18,Math.min(1,1-Math.abs(d)*.65));e.element.style.transform=`
        translate3d(${g}px, ${u}px, 0px)
        rotateX(${f}deg)
        rotateY(${p}deg)
        rotateZ(${y}deg)
        scale(${v})
      `,e.element.style.opacity=w.toFixed(3),e.element.style.zIndex=Math.round(50+m*25);const l=Math.max(-20,Math.min(20,this.scrollVelocity*45));e.sliceTop&&(e.sliceTop.style.transform=`rotateX(${l}deg) skewX(${l*.4}deg)`),e.sliceBottom&&(e.sliceBottom.style.transform=`rotateX(${-l*.4}deg)`)})}startLoop(){const t=i=>{this.isDestroyed||(this.lenis&&this.lenis.raf(i),this.update(),this.rafId=requestAnimationFrame(t))};this.rafId=requestAnimationFrame(t)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy(),window.removeEventListener("mousemove",this.onMouseMove);const t=document.getElementById("two-d1-root");t&&t.remove()}}export{T as TwoD1Scroller};
