(() => {
 const viewer=document.querySelector('.concept-viewer');
 if(!viewer) return;
 viewer.addEventListener('contextmenu',event=>event.preventDefault());
 viewer.addEventListener('dragstart',event=>event.preventDefault());
 const cards=[...viewer.querySelectorAll('.concept-card')];
 const dotsHost=document.querySelector('.concept-dots');
 let current=0,gesture=null,suppressClickUntil=0;
 const dots=cards.map((card,index)=>{const dot=document.createElement('button');dot.type='button';dot.className='concept-dot';dot.setAttribute('aria-label',`第 ${index+1} 張：${card.querySelector('img').alt}`);dot.addEventListener('click',()=>show(index));dotsHost.append(dot);return dot;});
 function show(index){
  current=(index+cards.length)%cards.length;
  cards.forEach((card,i)=>{
   let distance=(i-current+cards.length)%cards.length;
   if(distance>cards.length/2) distance-=cards.length;
   const abs=Math.abs(distance);
   card.hidden=abs>2;
   if(abs<=2) card.querySelector("img").loading="eager";
   card.querySelector("img").fetchPriority=abs===0?"high":"low";
   card.style.setProperty('--x',`${distance*43}%`);
   card.style.setProperty('--scale',String(1-abs*.14));
   card.style.setProperty('--angle',`${distance*-12}deg`);
   card.style.setProperty('--opacity',String(abs===0?1:abs===1?.72:.42));
   card.style.setProperty('--z',String(10-abs));
   card.tabIndex=abs===0?0:-1;
   card.setAttribute('aria-current',String(abs===0));
   dots[i].setAttribute('aria-current',String(i===current));
  });
  document.querySelector('.concept-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  document.querySelector('.concept-title').textContent=cards[current].querySelector('img').alt;
 }
 cards.forEach((card,i)=>card.addEventListener('click',()=>{if(performance.now()>suppressClickUntil) show(i);}));
 viewer.querySelector('.concept-prev').addEventListener('click',()=>show(current-1));
 viewer.querySelector('.concept-next').addEventListener('click',()=>show(current+1));
 viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowLeft'?-1:1));}});
 viewer.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0||event.target.closest('.concept-arrow'))return;
  gesture={id:event.pointerId,x:event.clientX,y:event.clientY,drag:false};
 });
 viewer.addEventListener('pointermove',event=>{
  if(!gesture||gesture.id!==event.pointerId)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)&&!gesture.drag){gesture.drag=true;viewer.setPointerCapture(event.pointerId);viewer.classList.add('is-dragging');}
 });
 function finish(event){
  if(!gesture||gesture.id!==event.pointerId)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(gesture.drag){suppressClickUntil=performance.now()+350;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))show(current+(dx<0?1:-1));}
  gesture=null;viewer.classList.remove('is-dragging');
  if(viewer.hasPointerCapture(event.pointerId))viewer.releasePointerCapture(event.pointerId);
 }
 viewer.addEventListener('pointerup',finish);
 viewer.addEventListener('pointercancel',event=>{gesture=null;viewer.classList.remove('is-dragging');if(viewer.hasPointerCapture(event.pointerId))viewer.releasePointerCapture(event.pointerId);});
 viewer.addEventListener('pointerleave',()=>{if(gesture&&!gesture.drag)gesture=null;});
 show(0);
})();
