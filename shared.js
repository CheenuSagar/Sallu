// ── FLOATING PARTICLES
const canvas=document.getElementById('fc'),ctx=canvas.getContext('2d');
const EMOJIS=['🌸','✨','💖','☁️','🎀','⭐','💫','🌷','💕','🌙','🌺','💝'];
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize(); window.addEventListener('resize',resize);
function spawnP(){particles.push({x:Math.random()*W,y:H+40,emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)],size:13+Math.random()*16,speed:.55+Math.random()*.9,drift:(Math.random()-.5)*.55,alpha:0,fadeIn:true,phase:Math.random()*Math.PI*2});}
function loopP(){ctx.clearRect(0,0,W,H);particles.forEach(p=>{p.y-=p.speed;p.x+=p.drift+Math.sin(Date.now()*.0008+p.phase)*.35;if(p.fadeIn){p.alpha=Math.min(1,p.alpha+.024);if(p.alpha>=1)p.fadeIn=false;}if(p.y<H*.32)p.alpha=Math.max(0,p.alpha-.013);ctx.globalAlpha=p.alpha*.5;ctx.font=p.size+'px serif';ctx.fillText(p.emoji,p.x,p.y);});ctx.globalAlpha=1;particles=particles.filter(p=>p.alpha>0||p.y>0);if(Math.random()<.042)spawnP();requestAnimationFrame(loopP);}
loopP();

// ── CURSOR
const spEmojis=['✨','💫','🌸','💖','⭐','💕'];
let lastSp=0,mx=0,my=0,ox=0,oy=0,trailT=0;
const cOut=document.getElementById('cursor-outer'),cIn=document.getElementById('cursor-inner'),cEm=document.getElementById('cursor-emoji');
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  if(cIn){cIn.style.left=mx+'px';cIn.style.top=my+'px';}
  if(cEm){cEm.style.left=mx+'px';cEm.style.top=my+'px';}
  if(Date.now()-trailT>80){trailT=Date.now();const t=document.createElement('div');t.textContent=EMOJIS[Math.floor(Math.random()*EMOJIS.length)];t.style.cssText=`position:fixed;left:${mx}px;top:${my}px;pointer-events:none;z-index:999990;font-size:${.7+Math.random()*.5}rem;transform:translate(-50%,-50%);animation:trail-fade .7s ease forwards;`;document.body.appendChild(t);setTimeout(()=>t.remove(),750);}
  if(Date.now()-lastSp<120)return;lastSp=Date.now();const el=document.createElement('div');el.className='sparkle';el.textContent=spEmojis[Math.floor(Math.random()*spEmojis.length)];el.style.left=(mx-10)+'px';el.style.top=(my-10)+'px';document.body.appendChild(el);setTimeout(()=>el.remove(),720);
});
if(cOut){(function anim(){ox+=(mx-ox)*.13;oy+=(my-oy)*.13;cOut.style.left=ox+'px';cOut.style.top=oy+'px';requestAnimationFrame(anim);})();}
const hoverSel='a,button,.polaroid,.mem-card,.quiz-opt,.pw-key,.wish-note';
document.addEventListener('mouseover',e=>{if(e.target.closest(hoverSel)&&cOut){cOut.style.width='54px';cOut.style.height='54px';cOut.style.borderColor='var(--purple)';cOut.style.background='rgba(165,94,234,.08)';if(cIn){cIn.style.width='4px';cIn.style.height='4px';}}});
document.addEventListener('mouseout',e=>{if(e.target.closest(hoverSel)&&cOut){cOut.style.width='36px';cOut.style.height='36px';cOut.style.borderColor='var(--pink)';cOut.style.background='transparent';if(cIn){cIn.style.width='8px';cIn.style.height='8px';}}});
document.addEventListener('mousedown',()=>{if(cOut)cOut.style.transform='translate(-50%,-50%) scale(.75)';if(cIn)cIn.style.transform='translate(-50%,-50%) scale(1.5)';});
document.addEventListener('mouseup',()=>{if(cOut)cOut.style.transform='translate(-50%,-50%) scale(1)';if(cIn)cIn.style.transform='translate(-50%,-50%) scale(1)';});

// ── REVEAL
const revObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));
const tObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.1});
document.querySelectorAll('.t-item').forEach((el,i)=>{el.style.transitionDelay=(i*.13)+'s';tObs.observe(el);});

// ── NAV ACTIVE + SCROLL
const navEl=document.getElementById('nav'),topBtn=document.getElementById('top-btn');
window.addEventListener('scroll',()=>{const sy=window.scrollY;if(navEl)navEl.classList.toggle('scrolled',sy>60);if(topBtn)topBtn.classList.toggle('show',sy>400);let cur='';document.querySelectorAll('section').forEach(s=>{if(sy>=s.offsetTop-180)cur=s.id;});document.querySelectorAll('nav a[href^="#"]').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));},{passive:true});
document.querySelectorAll('nav a').forEach(a=>{a.addEventListener('click',e=>{const href=a.getAttribute('href');if(href&&href.startsWith('#')){e.preventDefault();document.querySelector(href)?.scrollIntoView({behavior:'smooth',block:'start'});}});});

// ── LIGHTBOX
let lbImages=[],lbIdx=0;
window.openLightbox=function(src,cap,arr,idx){
  document.getElementById('lb-img').src=src;
  document.getElementById('lb-cap').textContent=cap;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
  lbImages=arr||[];lbIdx=idx||0;
  if(document.getElementById('lb-prev'))document.getElementById('lb-prev').style.display=arr&&arr.length>1?'flex':'none';
  if(document.getElementById('lb-next'))document.getElementById('lb-next').style.display=arr&&arr.length>1?'flex':'none';
};
window.closeLightbox=function(){document.getElementById('lightbox').classList.remove('open');document.body.style.overflow='';};
window.lbNav=function(dir){lbIdx=(lbIdx+dir+lbImages.length)%lbImages.length;const item=lbImages[lbIdx];document.getElementById('lb-img').src=item.src;document.getElementById('lb-cap').textContent=item.cap;};
document.getElementById('lightbox')?.addEventListener('click',function(e){if(e.target===this)closeLightbox();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight'&&lbImages.length)lbNav(1);if(e.key==='ArrowLeft'&&lbImages.length)lbNav(-1);});

// ── POLAROID TILT
document.querySelectorAll('.polaroid').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const dx=(e.clientX-r.left-r.width/2)/(r.width/2);const dy=(e.clientY-r.top-r.height/2)/(r.height/2);card.style.transform=`rotate(0deg) scale(1.05) translateY(-10px) rotateY(${dx*12}deg) rotateX(${-dy*12}deg)`;});card.addEventListener('mouseleave',()=>{card.style.transform='';});});

// ── MUSIC
const audio=document.getElementById('bg-music'),mBtn=document.getElementById('music-btn');
let playing=false;
window.toggleMusic=function(){if(playing){audio.pause();if(mBtn)mBtn.textContent='🎵';if(mBtn)mBtn.classList.remove('playing');}else{audio.play().catch(()=>{});if(mBtn)mBtn.textContent='🔊';if(mBtn)mBtn.classList.add('playing');}playing=!playing;};

// ── SALLU
(function(){
  const sallu=document.getElementById('sallu'),bubble=document.getElementById('khi-bubble'),khiText=document.getElementById('khi-text');
  if(!sallu||!bubble)return;
  const phrases=['Khi khi khi! 😸','Teri smile best hai! 🌸','Hehe gotcha! ✨','Khi khi surprise! 🎀','Main Sallu hoon! 🐱','Khi khi aapko pakad liya! 💕','Khi khi khi khi! 😹'];
  const faces=['🐱','🐸','🐼','🦊','🐨','🐻','🦁','🐯'];
  let faceIdx=0,khiTimer;
  function randomKhi(){const p=phrases[Math.floor(Math.random()*phrases.length)];if(khiText)khiText.textContent=p;bubble.classList.add('show');clearTimeout(khiTimer);khiTimer=setTimeout(()=>bubble.classList.remove('show'),2800);}
  setInterval(randomKhi,9000+Math.random()*6000);setTimeout(randomKhi,3500);
  window.salluClick=function(){faceIdx=(faceIdx+1)%faces.length;const span=sallu.querySelector('span:first-child');if(span)span.textContent=faces[faceIdx];randomKhi();for(let i=0;i<8;i++){setTimeout(()=>{const c=document.createElement('div');c.textContent=['🌸','✨','💖','💫'][Math.floor(Math.random()*4)];const r=sallu.getBoundingClientRect();c.style.cssText=`position:fixed;left:${r.left+r.width/2}px;top:${r.top}px;pointer-events:none;z-index:9999;font-size:1rem;`;document.body.appendChild(c);c.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${(Math.random()-.5)*80}px,-60px) scale(.4)`,opacity:0}],{duration:700,easing:'ease-out'}).onfinish=()=>c.remove();},i*60);}};
  window.addEventListener('scroll',()=>{let cur='';document.querySelectorAll('section').forEach(s=>{if(window.scrollY>=s.offsetTop-200)cur=s.id;});if(cur!==window._lastSec&&Math.random()>.5){window._lastSec=cur;setTimeout(randomKhi,600);}},{passive:true});
})();

// ── CONFETTI
window.launchConfetti=function(){const cols=['#ff6b8b','#a55eea','#ffb3c6','#d4aaff','#ffd6e8'],ems=['🌸','💖','✨','🎀','💫','⭐'];for(let i=0;i<70;i++){setTimeout(()=>{const el=document.createElement('div');const isE=Math.random()>.45;el.style.cssText=`position:fixed;top:-20px;left:${Math.random()*100}vw;z-index:99998;pointer-events:none;`;if(isE){el.textContent=ems[Math.floor(Math.random()*ems.length)];el.style.fontSize='1.4rem';}else{el.style.width=el.style.height=(6+Math.random()*8)+'px';el.style.background=cols[Math.floor(Math.random()*cols.length)];el.style.borderRadius='2px';}document.body.appendChild(el);el.animate([{transform:'translateY(0) rotate(0deg)',opacity:1},{transform:`translateY(105vh) rotate(${720}deg)`,opacity:.2}],{duration:1800+Math.random()*1400,easing:'cubic-bezier(.25,.46,.45,.94)'}).onfinish=()=>el.remove();},i*35);}};
