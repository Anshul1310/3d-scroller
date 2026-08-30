import{L as m}from"./lenis-BRqnZd4Q.js";class f{constructor(e){this.container=e||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.scrollVelocity=0,this.targetVelocity=0,this.isDestroyed=!1,this.pages=[],this.chapters=[{id:1,title:"4 domains",img:"/image1.png"},{id:2,title:"42 hours",img:"/image2.png"},{id:3,title:"100+ team",img:"/image3.png"},{id:4,title:"infinite possibilities",img:"/image1.png"},{id:5,title:"TRANSFINITTE",img:"/image2.png"}],this.mouse={x:0,y:0,targetX:0,targetY:0},this.onMouseMove=s=>{this.mouse.targetX=(s.clientX/window.innerWidth-.5)*2,this.mouse.targetY=(s.clientY/window.innerHeight-.5)*2}}mount(){this.renderDOM(),this.initLenis(),this.initBookPages(),window.addEventListener("mousemove",this.onMouseMove),this.startLoop()}renderDOM(){const e=document.getElementById("two-d5-root");e&&e.remove();const s=document.createElement("div");s.id="two-d5-root",s.className="two-d5-root",s.innerHTML=`
      <!-- Book Stage -->
      <div class="book-stage" id="bookStage">
        <div class="book-wrapper" id="bookWrapper">
          <div class="book-cover-back"></div>
          <div class="book-spine"></div>
          
          <!-- Static Base Spread Underneath -->
          <div class="book-base-spread">
            <div class="page-side page-left-base" id="baseLeft">
              <div class="page-content">
                <span class="folio-tag">CHAPTER 01</span>
                <h2 class="book-chapter-title">4 domains</h2>
              </div>
            </div>
            <div class="page-side page-right-base" id="baseRight">
              <div class="page-photo-wrap">
                <img src="/image2.png" alt="" class="base-img" />
              </div>
            </div>
          </div>

          <!-- Dynamic Flipping Book Leaves -->
          <div class="book-leaves" id="bookLeaves">
            <!-- Leaves generated dynamically -->
          </div>
        </div>
      </div>
      
      <!-- Virtual scroll height driving page flips -->
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
    `,this.container.appendChild(s)}initBookPages(){const e=document.getElementById("bookLeaves");if(e){e.innerHTML="",this.pages=[];for(let s=0;s<this.chapters.length-1;s++){const o=this.chapters[s],n=this.chapters[s+1],i=document.createElement("div");i.className="book-leaf",i.dataset.leafIndex=s,i.innerHTML=`
        <!-- Front side of turning page (Facing right initially) -->
        <div class="leaf-face leaf-front">
          <div class="page-photo-wrap">
            <img src="${o.img}" alt="" class="p-img-base" />
            <div class="p-img-reveal">
              <img src="${o.img}" alt="" class="p-img-color" />
            </div>
            <div class="page-sheen"></div>
          </div>
          <div class="page-corner-curl"></div>
        </div>

        <!-- Back side of turning page (Facing left when turned) -->
        <div class="leaf-face leaf-back">
          <div class="page-content">
            <span class="folio-tag">CHAPTER 0${n.id}</span>
            <h2 class="book-chapter-title">${n.title}</h2>
          </div>
          <div class="page-shadow-back"></div>
        </div>
      `,e.appendChild(i);const t={element:i,reveal:i.querySelector(".p-img-reveal"),index:s,hoverProgress:0,isHovered:!1};i.addEventListener("mouseenter",()=>{t.isHovered=!0}),i.addEventListener("mouseleave",()=>{t.isHovered=!1}),this.pages.push(t)}}}initLenis(){this.lenis=new m({duration:1.2,easing:e=>Math.min(1,1.001-Math.pow(2,-10*e)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",e=>{this.currentScroll=e.scroll,this.targetVelocity=e.velocity*.01})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;const e=document.documentElement.scrollHeight-window.innerHeight,s=e>0?this.currentScroll/e:0,o=this.pages.length,n=s*o,i=document.getElementById("bookWrapper");if(i){const t=this.mouse.x*6,r=12-this.mouse.y*6;i.style.transform=`rotateX(${r}deg) rotateY(${t}deg) scale(1)`}this.pages.forEach(t=>{t.isHovered?t.hoverProgress=Math.min(1,t.hoverProgress+.08):t.hoverProgress=Math.max(0,t.hoverProgress-.04);const r=t.hoverProgress*100;t.reveal&&(t.reveal.style.clipPath=`polygon(0 0, ${r}% 0, ${r}% 100%, 0 100%)`);const d=n-t.index,a=Math.max(0,Math.min(1,d)),c=(a<.5?2*a*a:1-Math.pow(-2*a+2,2)/2)*-180,l=Math.sin(a*Math.PI),h=l*45,g=this.scrollVelocity*25*l;t.element.style.transform=`
        rotateY(${c}deg)
        rotateZ(${g}deg)
        translateZ(${h}px)
      `,c<-90?t.element.style.zIndex=Math.round(10+t.index*5):t.element.style.zIndex=Math.round(10+(o-t.index)*5)})}startLoop(){const e=s=>{this.isDestroyed||(this.lenis&&this.lenis.raf(s),this.update(),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy(),window.removeEventListener("mousemove",this.onMouseMove);const e=document.getElementById("two-d5-root");e&&e.remove()}}export{f as TwoD5Scroller};
