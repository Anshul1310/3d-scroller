import{L as v}from"./lenis-BRqnZd4Q.js";class w{constructor(e){this.container=e||document.body,this.lenis=null,this.rafId=null,this.currentScroll=0,this.scrollVelocity=0,this.targetVelocity=0,this.isDestroyed=!1,this.cards=[],this.numCards=10,this.images=["/image1.png","/image2.png","/image3.png"],this.mouse={x:0,y:0,targetX:0,targetY:0},this.onMouseMove=t=>{this.mouse.targetX=(t.clientX/window.innerWidth-.5)*2,this.mouse.targetY=(t.clientY/window.innerHeight-.5)*2}}mount(){this.renderDOM(),this.initLenis(),this.initCards(),window.addEventListener("mousemove",this.onMouseMove),this.startLoop()}renderDOM(){const e=document.getElementById("two-d2-root");e&&e.remove();const t=document.createElement("div");t.id="two-d2-root",t.className="two-d2-root",t.innerHTML=`
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
    `,this.container.appendChild(t)}initCards(){const e=document.getElementById("deckTrack");if(e){e.innerHTML="",this.cards=[];for(let t=0;t<this.numCards;t++){const r=this.images[t%this.images.length],i=document.createElement("div");i.className="deck-card",i.dataset.index=t,i.innerHTML=`
        <div class="deck-card-inner">
          <div class="deck-media">
            <img src="${r}" alt="" class="d-img-base" />
            <div class="d-img-reveal">
              <img src="${r}" alt="" class="d-img-color" />
            </div>
            <div class="deck-glare"></div>
          </div>
          <div class="deck-index-tag">0${t+1}</div>
        </div>
      `,e.appendChild(i);const n={element:i,inner:i.querySelector(".deck-card-inner"),reveal:i.querySelector(".d-img-reveal"),index:t,progress:t/(this.numCards-1),hoverProgress:0,isHovered:!1};i.addEventListener("mouseenter",()=>{n.isHovered=!0}),i.addEventListener("mouseleave",()=>{n.isHovered=!1}),this.cards.push(n)}}}initLenis(){this.lenis=new v({duration:1.2,easing:e=>Math.min(1,1.001-Math.pow(2,-10*e)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1}),this.lenis.on("scroll",e=>{this.currentScroll=e.scroll,this.targetVelocity=e.velocity*.012})}update(){this.scrollVelocity+=(this.targetVelocity-this.scrollVelocity)*.12,this.targetVelocity*=.88,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;const e=document.documentElement.scrollHeight-window.innerHeight,t=e>0?this.currentScroll/e:0,r=window.innerWidth,i=(this.numCards-1)*360,n=t*i;this.cards.forEach(s=>{s.isHovered?s.hoverProgress=Math.min(1,s.hoverProgress+.08):s.hoverProgress=Math.max(0,s.hoverProgress-.04);const c=s.hoverProgress*100;s.reveal&&(s.reveal.style.clipPath=`polygon(0 0, ${c}% 0, ${c}% 100%, 0 100%)`);const a=s.index*360-n,o=a/(r*.5),h=Math.max(-55,Math.min(55,o*-45)),l=Math.max(-400,100-Math.abs(a)*.65),d=Math.abs(o)*35,m=Math.max(.68,Math.min(1.15,1-Math.abs(o)*.28)),u=Math.max(-18,Math.min(18,this.scrollVelocity*35))*(1-Math.abs(o)*.3)+o*4,g=Math.max(.2,Math.min(1,1.1-Math.abs(o)*.7));s.element.style.transform=`
        translate3d(${a+this.mouse.x*20}px, ${d+this.mouse.y*10}px, ${l}px)
        rotateY(${h}deg)
        rotateZ(${u}deg)
        scale(${m})
      `,s.element.style.opacity=g.toFixed(3),s.element.style.zIndex=Math.round(100+l)})}startLoop(){const e=t=>{this.isDestroyed||(this.lenis&&this.lenis.raf(t),this.update(),this.rafId=requestAnimationFrame(e))};this.rafId=requestAnimationFrame(e)}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),this.lenis&&this.lenis.destroy(),window.removeEventListener("mousemove",this.onMouseMove);const e=document.getElementById("two-d2-root");e&&e.remove()}}export{w as TwoD2Scroller};
