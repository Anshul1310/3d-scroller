import{L as y}from"./lenis-BRqnZd4Q.js";class I{constructor(e){this.container=e||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.scrollVelocity=0,this.targetVelocity=0,this.currentBend=0,this.isDestroyed=!1,this.blocks=[],this.numBlocks=10,this.images=["/image1.png","/image2.png","/image3.png"]}mount(){this.renderDOM(),this.initLenis(),this.initImageBlocks(),this.startLoop()}renderDOM(){const e=document.getElementById("two-d-root");e&&e.remove();const s=document.createElement("div");s.id="two-d-root",s.className="two-d-root",s.innerHTML=`
      <!-- 2D Image Gallery Stage -->
      <div class="gallery-2d-stage" id="gallery2dStage">
        <!-- Image blocks will be injected here -->
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
    `,this.container.appendChild(s)}initImageBlocks(){const e=document.getElementById("gallery2dStage");if(e){e.innerHTML="",this.blocks=[];for(let s=0;s<this.numBlocks;s++){const o=this.images[s%this.images.length],i=document.createElement("div");i.className="gallery-2d-block",i.dataset.index=s,i.innerHTML=`
        <div class="block-mesh-sim">
          <div class="block-half block-upper">
            <img src="${o}" alt="" class="img-base" />
            <div class="img-color-reveal">
              <img src="${o}" alt="" class="img-color" />
            </div>
          </div>
          <div class="block-half block-lower">
            <img src="${o}" alt="" class="img-base" />
            <div class="img-color-reveal">
              <img src="${o}" alt="" class="img-color" />
            </div>
          </div>
        </div>
      `,e.appendChild(i);const t={element:i,upperMesh:i.querySelector(".block-upper"),lowerMesh:i.querySelector(".block-lower"),revealUpper:i.querySelector(".block-upper .img-color-reveal"),revealLower:i.querySelector(".block-lower .img-color-reveal"),index:s,progressFraction:s/(this.numBlocks-1),spiralAngle:s*-1.256,hoverProgress:0,isHovered:!1};i.addEventListener("mouseenter",()=>{t.isHovered=!0}),i.addEventListener("mouseleave",()=>{t.isHovered=!1}),this.blocks.push(t)}}}initLenis(){this.lenis=new y({duration:1.2,easing:e=>Math.min(1,1.001-Math.pow(2,-10*e)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",e=>{this.currentScroll=e.scroll,this.targetVelocity=e.velocity*.01})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.currentBend+=(this.scrollVelocity-this.currentBend)*.12;const e=document.documentElement.scrollHeight-window.innerHeight,s=e>0?this.currentScroll/e:0,o=window.innerHeight,i=window.innerWidth;this.blocks.forEach(t=>{t.isHovered?t.hoverProgress=Math.min(1,t.hoverProgress+.08):t.hoverProgress=Math.max(0,t.hoverProgress-.04);const l=t.hoverProgress*100,c=`polygon(0 0, ${l}% 0, ${l}% 100%, 0 100%)`;t.revealUpper&&(t.revealUpper.style.clipPath=c),t.revealLower&&(t.revealLower.style.clipPath=c);const a=t.progressFraction*e-this.currentScroll,d=a/(o*.8),r=t.spiralAngle-s*Math.PI*4,m=Math.sin(r)*Math.min(280,i*.22),n=Math.cos(r),g=Math.sin(r)*-35,u=o*.5+a*.85-120,p=Math.max(.65,Math.min(1.15,.9+n*.22)),v=Math.max(.2,Math.min(1,(1.1-Math.abs(d)*.6)*(.6+(n+1)*.25))),h=Math.max(-25,Math.min(25,this.currentBend*40));t.element.style.transform=`
        translate3d(${m}px, ${u}px, 0px)
        rotateY(${g}deg)
        scale(${p})
      `,t.element.style.opacity=v.toFixed(3),t.element.style.zIndex=Math.round(50+n*40),t.upperMesh&&(t.upperMesh.style.transform=`rotateX(${h}deg) skewX(${h*.3}deg)`)})}startLoop(){const e=s=>{this.isDestroyed||(this.lenis&&this.lenis.raf(s),this.update(),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy();const e=document.getElementById("two-d-root");e&&e.remove()}}export{I as TwoDScroller};
