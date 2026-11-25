/* ---- блок 1 ---- */
{
const $=s=>document.querySelector(s),root=document.documentElement,home=$('#home');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
if(reduce){const a=$('#turbA');if(a)a.remove()}

/* тема */
const toggle=$('#toggle');
const setTheme=t=>{root.dataset.theme=t;toggle.setAttribute('aria-pressed',t==='dark');try{localStorage.setItem('mtn-theme',t)}catch(e){}};
toggle.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));
setTheme(root.dataset.theme==='dark'?'dark':'light');
$('#stars').innerHTML=Array.from({length:50},()=>`<b style="left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*75).toFixed(1)}%;animation-delay:${(Math.random()*3).toFixed(2)}s;opacity:${(.4+Math.random()*.6).toFixed(2)}"></b>`).join('');
{let d='M20 318';for(let x=20;x<1000;x+=40)d+=`Q${x+20} ${x%80?306:330} ${x+40} 318`;$('#socks').setAttribute('d',d+'L1000 420L20 420Z')}

/* пасхалки */
const EGGS=[
  {id:'bird',name:'Птицу Емъ',short:'Птицу Емъ',hint:'кот — хищник. дай ему поохотиться',q:'Птицу Емъ',msg:'Птицу емъ. Остались только твёрдые знаки.'},
  {id:'sleep',name:'Автостопом по фазе сна',short:'АПФС',hint:'коты много спят. и им что-то снится',q:'Автостопом по фазе сна',msg:'Ты съездил автостопом по фазе сна.'},
  {id:'rust',name:'Кишлак',short:'Кишлак',hint:'время у котов идёт иначе',q:'Кишлак',msg:'11:11. Загадывай. На смене ржавый Макс.'},
  {id:'boat',name:'Капсайз',short:'Капсайз',hint:'не раскачивай чай',q:'Капсайз',msg:'Капсайз! Лифчик утонул, сайт перевернулся — но выплыл.'}
];
let found=store.get('mtn-eggs',[]);if(!Array.isArray(found))found=[];found=found.filter(x=>EGGS.some(e=>e.id===x));
const toastEl=$('#toast');let tt=0;
const toast=(m,s)=>{toastEl.innerHTML=esc(m)+(s?`<small>${esc(s)}</small>`:'');toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),3600)};
const cassette=(e,open)=>`<svg viewBox="0 0 160 100" aria-hidden="true"><rect class="cb" x="3" y="3" width="154" height="94" rx="12"/><rect class="lb" x="16" y="12" width="128" height="30" rx="6"/><text class="lt" x="80" y="33" text-anchor="middle">${open?esc(e.short):'???'}</text><rect x="38" y="52" width="84" height="30" rx="15" fill="none" stroke="var(--ink)" stroke-width="2"/>${[58,102].map(x=>`<g class="reel"><circle class="rl" cx="${x}" cy="67" r="11"/><path class="sp" d="M${x} 59v16M${x-8} 67h16"/></g>`).join('')}</svg>`;
const renderEggs=()=>{
  $('#eggN').textContent=`${found.length}/4`;$('#eggs').classList.toggle('on',found.length>0);root.classList.toggle('allfound',found.length===4);
  $('#tapes').innerHTML=EGGS.map(e=>found.includes(e.id)
    ?`<div class="tape open">${cassette(e,1)}<b>${esc(e.name)}</b><a href="https://open.spotify.com/search/${encodeURIComponent(e.q)}" target="_blank" rel="noopener">Слушать в Spotify →</a></div>`
    :`<div class="tape">${cassette(e,0)}<span class="q">${esc(e.hint)}</span></div>`).join('');
  if(found.length===4)$('#station').textContent='Секретная волна';
};
const unlock=id=>{const e=EGGS.find(x=>x.id===id);const isNew=!found.includes(id);if(isNew){found.push(id);store.set('mtn-eggs',found);renderEggs()}
  toast(e.msg,isNew?(found.length===4?'все 4 кассеты собраны — радио поймало секретную волну':`пасхалка ${found.length}/4 · кассета открыта в «Радио»`):'');};
renderEggs();

/* логотип */
const svg=$('#logo'),stage=$('#stage'),ext=$('#ext'),light=$('#light'),gsh=$('#gsh');
const NL=reduce?10:18;
ext.innerHTML=Array.from({length:NL},(_,k)=>{const i=NL-k,p=Math.round(i/NL*100);return `<use href="#glyph" data-i="${i}" style="color:color-mix(in srgb,var(--sideDark) ${p}%,var(--side))"/>`}).join('');
const layers=[...ext.children].map(el=>({el,i:+el.dataset.i}));
const pupils=[...svg.querySelectorAll('.pupil')].map(el=>({el,cx:+el.dataset.cx,cy:+el.dataset.cy,x:0,y:0,tx:0,ty:0,s:1}));
const S={dx:.35,dy:1.25,tdx:.35,tdy:1.25,lx:300,ly:60,tlx:300,tly:60,rx:0,ry:0,trx:0,try_:0};
let lastMove=0;
const toSvg=(x,y)=>{const m=svg.getScreenCTM();if(!m)return null;const pt=svg.createSVGPoint();pt.x=x;pt.y=y;return pt.matrixTransform(m.inverse())};
const fromSvg=(x,y)=>{const m=svg.getScreenCTM();if(!m)return null;const pt=svg.createSVGPoint();pt.x=x;pt.y=y;return pt.matrixTransform(m)};
const look=p=>{for(const e of pupils){const dx=p.x-e.cx,dy=p.y-e.cy,d=Math.hypot(dx,dy)||1,r=Math.min(10,d/9);e.tx=dx/d*r;e.ty=dy/d*r}};
const point=(x,y)=>{
  lastMove=performance.now();
  if(home.hidden)return;
  const p=toSvg(x,y);if(!p)return;look(p);
  const vx=505-p.x,vy=220-p.y,d=Math.hypot(vx,vy)||1,k=Math.min(1,d/260);
  S.tdx=vx/d*1.35*k;S.tdy=vy/d*1.35*k;if(Math.hypot(S.tdx,S.tdy)<.5){S.tdx=.35;S.tdy=1.25}
  S.tlx=p.x;S.tly=Math.min(p.y,300);
  const r=stage.getBoundingClientRect();S.trx=Math.max(-1,Math.min(1,((x-r.left)/r.width-.5)*2));S.try_=Math.max(-1,Math.min(1,((y-r.top)/r.height-.5)*2));
};
addEventListener('pointermove',e=>point(e.clientX,e.clientY),{passive:true});
addEventListener('touchmove',e=>{const t=e.touches[0];if(t)point(t.clientX,t.clientY)},{passive:true});
addEventListener('keydown',()=>{lastMove=performance.now();if(sleeping&&!dreaming)wake()});
document.addEventListener('click',()=>{if(sleeping&&!dreaming)wake()});
const L=(a,b,k)=>a+(b-a)*k;
const frame=()=>{
  const now=performance.now();
  if(!home.hidden){
    if(bird.state&&now-lastMove>1200){const r=birdEl.getBoundingClientRect();const p=toSvg(r.left+r.width/2,r.top+r.height/2);if(p)look(p)}
    S.dx=L(S.dx,S.tdx,.1);S.dy=L(S.dy,S.tdy,.1);
    for(const l of layers)l.el.setAttribute('transform',`translate(${(S.dx*l.i).toFixed(2)} ${(S.dy*l.i).toFixed(2)})`);
    gsh.setAttribute('cx',(505+S.dx*14).toFixed(1));
    S.lx=L(S.lx,S.tlx,.12);S.ly=L(S.ly,S.tly,.12);light.setAttribute('cx',S.lx.toFixed(1));light.setAttribute('cy',S.ly.toFixed(1));
    const dil=bird.state?1.3:1;
    for(const e of pupils){e.x=L(e.x,e.tx,.2);e.y=L(e.y,e.ty,.2);e.s=L(e.s,dil,.1);e.el.setAttribute('transform',`translate(${(e.cx+e.x).toFixed(2)} ${(e.cy+e.y).toFixed(2)}) scale(${e.s.toFixed(3)})`)}
    if(!reduce){S.rx=L(S.rx,S.trx,.06);S.ry=L(S.ry,S.try_,.06);svg.style.transform=`rotateY(${(S.rx*7).toFixed(2)}deg) rotateX(${(-S.ry*5).toFixed(2)}deg)`}
    if(bird.state)moveBird(now);
    if(!sleeping&&lastMove>0&&now-lastMove>20000)sleep();
  }
  requestAnimationFrame(frame);
};

/* Автостопом по фазе сна: кот засыпает, во сне — дорога; кликни по сну */
let sleeping=false,dreaming=false,orbClicks=[];
const sleep=()=>{if(sleeping)return;sleeping=true;svg.classList.add('sleep');stage.classList.add('sleeping')};
function wake(){if(!sleeping)return;sleeping=false;svg.classList.remove('sleep');stage.classList.remove('sleeping');stage.classList.remove('hop');void stage.offsetWidth;stage.classList.add('hop')}
const enterDream=()=>{if(dreaming)return;dreaming=true;home.classList.add('dreaming');$('#dbar').classList.add('on');
  const end=()=>{if(!dreaming)return;dreaming=false;home.classList.remove('dreaming');$('#dbar').classList.remove('on');document.removeEventListener('click',end);wake();unlock('sleep')};
  setTimeout(()=>document.addEventListener('click',end),400);setTimeout(end,9000)};
$('#dream').addEventListener('click',e=>{e.stopPropagation();enterDream()});
$('#orb').addEventListener('click',e=>{e.stopPropagation();const t=performance.now();orbClicks=orbClicks.filter(x=>t-x<2000);orbClicks.push(t);if(orbClicks.length>=3){orbClicks=[];sleep();lastMove=performance.now()+3000;toast('Кот уснул. Интересно, что ему снится?')}});

/* Птицу Емъ: птица садится коту на ухо */
const birdEl=$('#bird'),sky=$('#sky');
const bird={state:'',t0:0,from:null,to:null};
const perch=()=>{const sr=sky.getBoundingClientRect(),p=fromSvg(140,66);return p?{x:p.x-sr.left-24,y:p.y-sr.top-34}:{x:100,y:60}};
const spawn=()=>{if(bird.state||document.hidden||home.hidden)return setTimeout(spawn,8000);
  const W=sky.clientWidth;bird.state='in';bird.t0=performance.now();bird.from={x:-60,y:20+Math.random()*60};birdEl.className='bird on';birdEl.style.opacity='';birdEl.querySelector('svg').style.transform=''};
function moveBird(now){
  const sr=sky.getBoundingClientRect(),W=sky.clientWidth;let x,y;
  if(bird.state==='in'){const pr=Math.min(1,(now-bird.t0)/2600),to=perch(),e=1-(1-pr)**3;x=L(bird.from.x,to.x,e);y=L(bird.from.y,to.y,e)-Math.sin(pr*Math.PI)*40;if(pr>=1){bird.state='sit';bird.t0=now;birdEl.classList.add('sit')}}
  else if(bird.state==='sit'){const to=perch();x=to.x;y=to.y;if(now-bird.t0>14000){bird.state='out';bird.t0=now;bird.from={x,y};birdEl.classList.remove('sit')}}
  else{const pr=(now-bird.t0)/2200;x=L(bird.from.x,W+80,pr);y=bird.from.y-pr*120;if(pr>=1){bird.state='';birdEl.className='bird';setTimeout(spawn,18000+Math.random()*12000);return}}
  birdEl.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
}
birdEl.addEventListener('click',e=>{
  e.stopPropagation();if(!bird.state)return;bird.state='';
  const br=birdEl.getBoundingClientRect(),sr=sky.getBoundingClientRect(),h=fromSvg(500,186);
  birdEl.style.transition='transform .3s ease-in,opacity .3s';birdEl.style.opacity='0';
  if(h)birdEl.style.transform=`translate(${h.x-sr.left-24}px,${h.y-sr.top-20}px) scale(.2)`;
  setTimeout(()=>{birdEl.style.transition='';birdEl.className='bird'},350);
  for(let i=0;i<7;i++){const f=document.createElement('span');f.className='feather';f.textContent='ъ';f.style.left=(br.left-sr.left+14+Math.random()*20)+'px';f.style.top=(br.top-sr.top+6)+'px';f.style.setProperty('--fx',(Math.random()*120-60)+'px');f.style.setProperty('--fr',(Math.random()*540-270)+'deg');sky.appendChild(f);setTimeout(()=>f.remove(),1900)}
  svg.classList.add('chomp');stage.classList.remove('hop');void stage.offsetWidth;stage.classList.add('hop');
  setTimeout(()=>svg.classList.remove('chomp'),1600);setTimeout(spawn,22000);unlock('bird');
});
setTimeout(spawn,6000);

/* Капсайз: кораблик тонет — сайт делает оверкиль */
const cup=$('#cup');
cup.addEventListener('click',()=>{if(cup.classList.contains('cap'))return;cup.classList.add('cap');
  setTimeout(()=>{if(!reduce){home.style.transformOrigin=`50% ${scrollY-home.offsetTop+innerHeight/2}px`;home.classList.add('capsize')}
    setTimeout(()=>{home.classList.remove('capsize');home.style.transformOrigin='';unlock('boat')},reduce?0:3400)},700);
  setTimeout(()=>cup.classList.remove('cap'),5200)});

/* Кишлак: три клика по часам — 11:11 */
const clock=$('#clock');let fake=0,clk=[];
const tick=()=>{if(fake)return;const d=new Date();clock.textContent=`у котов ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`};
tick();setInterval(tick,10000);
clock.addEventListener('click',()=>{const t=performance.now();clk=clk.filter(x=>t-x<1600);clk.push(t);
  if(clk.length>=3){clk=[];fake=1;clock.textContent='11:11';root.classList.add('rust');
    if(location.hash==='#about')location.hash='#top';scrollTo({top:0,behavior:reduce?'auto':'smooth'});
    setTimeout(()=>{const s=$('#shoot');s.classList.remove('go');void s.offsetWidth;s.classList.add('go');unlock('rust')},700);
    setTimeout(()=>{root.classList.remove('rust');fake=0;tick()},9000)}});

requestAnimationFrame(frame);

/* меню и коты */
const menu=[
  {h:'Чай',items:[['Молочный улун','мягкий, сливочный, на двоих','290 ₽'],['Рыжий имбирь','имбирь, апельсин, мёд','260 ₽'],['Ночной ройбуш','без кофеина, ваниль','270 ₽'],['Матча','на овсяном или обычном','340 ₽']]},
  {h:'Время и еда',items:[['Капсула-нап','20 минут, плед, белый шум','350 ₽'],['Час у окна','стол, розетка, кот — если повезёт','200 ₽'],['Сырники','три штуки, сметана','320 ₽'],['Печенье «Лапки»','шесть штук, для людей','180 ₽']]}
];
$('#menuList').innerHTML=menu.map(g=>`<div><h3>${esc(g.h)}</h3>${g.items.map(([n,d,p])=>`<div class="item"><div>${esc(n)}<small>${esc(d)}</small></div><b>${esc(p)}</b></div>`).join('')}</div>`).join('');
const face=c=>`<svg viewBox="0 0 110 100" aria-hidden="true">
<path d="M16 48L22 8L50 28ZM94 48L88 8L60 28Z" fill="${c.fur}" stroke="${c.edge||c.fur}" stroke-width="7" stroke-linejoin="round"/>
<path d="M24 36L27 18L39 28ZM86 36L83 18L71 28Z" fill="${c.ear}"/>
<rect x="10" y="28" width="90" height="64" rx="32" fill="${c.fur}" stroke="${c.edge||'none'}" stroke-width="2.5"/>
${c.st?`<path d="M55 30v10M45 31l2 9M65 31l-2 9" stroke="${c.st}" stroke-width="4" stroke-linecap="round"/>`:''}
<ellipse cx="38" cy="58" rx="10" ry="11" fill="${c.eye}"/><ellipse cx="72" cy="58" rx="10" ry="11" fill="${c.eye}"/>
<ellipse cx="39" cy="59" rx="${c.slit?2.5:4.5}" ry="8" fill="#0a0806"/><ellipse cx="73" cy="59" rx="${c.slit?2.5:4.5}" ry="8" fill="#0a0806"/>
<circle cx="35" cy="54" r="2.6" fill="#fff"/><circle cx="69" cy="54" r="2.6" fill="#fff"/>
<path d="M27 52q11-10 22 0M61 52q11-10 22 0" fill="none" stroke="${c.lid}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M50 72h10l-5 5z" fill="#d9707a"/>
<path d="M45 81q5 4 10 0q5 4 10 0" fill="none" stroke="${c.ml}" stroke-width="2" stroke-linecap="round"/></svg>`;
const cats=[
  {n:'Михалыч',role:'главный работник',boss:1,t:'Мега пухлый, очень красивый и абсолютно рыжий. Лично отвечает за атмосферу: лежит в центре зала и одним взглядом решает, кому сегодня достанется место у окна. Гладить можно, но с уважением.',fur:'#ff8b2c',st:'#c8571a',ear:'#f2a08a',eye:'#f4b634',ml:'#7a3610',lid:'#4a1e08'},
  {n:'Дексик',role:'дневная смена',t:'Тот самый рыжий кот из логотипа. Встречает гостей и проверяет, правильно ли заварен улун.',fur:'#ff8a2e',st:'#c8571a',ear:'#f2a08a',eye:'#f4b634',ml:'#7a3610',lid:'#4a1e08'},
  {n:'Сёма',role:'ночная смена',edge:'#5a4d78',t:'Чёрный кот из ночного логотипа. Появляется после заката, охраняет капсулы для сна и молча одобряет твои дедлайны.',fur:'#1f1d26',ear:'#4a3346',eye:'#e3f25a',slit:1,ml:'#8a84a8',lid:'#000'},
  {n:'Миса',role:'отдел обнимашек',t:'Серая, пушистая и деликатная. Ложится на клавиатуру ровно тогда, когда ты начинаешь писать.',fur:'#9aa0aa',st:'#6c727c',ear:'#e9b4bf',eye:'#7fc6d9',ml:'#4a4e58',lid:'#2a2d33'},
];
const chub=c=>`<svg viewBox="0 0 150 120" aria-hidden="true">
<path d="M22 50L28 12L58 34ZM128 50L122 12L92 34Z" fill="${c.fur}" stroke="${c.fur}" stroke-width="7" stroke-linejoin="round"/>
<path d="M29 40L32 22L44 32ZM121 40L118 22L106 32Z" fill="${c.ear}"/>
<path d="M14 72L2 78L13 82L4 92L18 92L12 102L28 96Z M136 72L148 78L137 82L146 92L132 92L138 102L122 96Z" fill="${c.fur}"/>
<ellipse cx="75" cy="70" rx="64" ry="46" fill="${c.fur}"/>
<ellipse cx="75" cy="92" rx="34" ry="18" fill="#ffd2a6"/>
<path d="M75 30v12M63 31l2 10M87 31l-2 10" stroke="${c.st}" stroke-width="4.5" stroke-linecap="round"/>
<path d="M30 60q8-4 14 2M120 60q-8-4-14 2" stroke="${c.st}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<ellipse cx="52" cy="66" rx="11" ry="9" fill="${c.eye}"/><ellipse cx="98" cy="66" rx="11" ry="9" fill="${c.eye}"/>
<ellipse cx="53" cy="68" rx="4" ry="6" fill="#0a0806"/><ellipse cx="99" cy="68" rx="4" ry="6" fill="#0a0806"/>
<path d="M40 64Q52 52 64 64Z M86 64Q98 52 110 64Z" fill="${c.fur}"/>
<path d="M40 64Q52 58 64 64M86 64Q98 58 110 64" fill="none" stroke="${c.lid}" stroke-width="3" stroke-linecap="round"/>
<path d="M69 80h12l-6 6z" fill="#d9707a"/>
<path d="M62 91q6.5 6 13 0q6.5 6 13 0" fill="none" stroke="${c.ml}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M56 106q19 8 38 0" fill="none" stroke="${c.st}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
<path d="M34 84L8 80M34 90L8 94M116 84L142 80M116 90L142 94" stroke="${c.ml}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></svg>`;
$('#catList').innerHTML=cats.map(c=>`<div class="cat blob${c.boss?' boss':''}">${c.boss?`<span class="crown">главный</span>`+chub(c):face(c)}<h3>${esc(c.n)}</h3><span class="role">${esc(c.role)}</span><p>${esc(c.t)}</p></div>`).join('');

/* радио */
let ac=null,master,an,playing=false,purrG,rainG,beatOn=true,nextT=0,step=0,timer=0;
const vol=$('#vol'),playBtn=$('#play');
const noiseBuf=(sec,type)=>{const b=ac.createBuffer(1,ac.sampleRate*sec,ac.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;if(type==='brown'){last=(last+.02*w)/1.02;d[i]=last*3.5}else if(type==='crackle'){d[i]=Math.random()<.0007?(Math.random()*2-1)*.8:0}else d[i]=w}return b};
const loop=(buf,node)=>{const s=ac.createBufferSource();s.buffer=buf;s.loop=true;s.connect(node);s.start();return s};
const initAudio=()=>{
  ac=new (window.AudioContext||window.webkitAudioContext)();
  master=ac.createGain();master.gain.value=vol.value/100*.8;an=ac.createAnalyser();an.fftSize=128;master.connect(an);an.connect(ac.destination);
  const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=380;purrG=ac.createGain();purrG.gain.value=0;
  const am=ac.createGain();am.gain.value=.5;const lfo=ac.createOscillator();lfo.frequency.value=23;const lg=ac.createGain();lg.gain.value=.5;lfo.connect(lg);lg.connect(am.gain);lfo.start();
  loop(noiseBuf(2,'brown'),lp);lp.connect(am);am.connect(purrG);purrG.connect(master);
  const hp=ac.createBiquadFilter();hp.type='bandpass';hp.frequency.value=2500;hp.Q.value=.4;rainG=ac.createGain();rainG.gain.value=0;loop(noiseBuf(2,'white'),hp);hp.connect(rainG);rainG.connect(master);
  const cg=ac.createGain();cg.gain.value=.35;loop(noiseBuf(3,'crackle'),cg);cg.connect(master);
};
const mtof=m=>440*2**((m-69)/12);
const chordsA=[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]],chordsB=[[50,53,57,61],[55,58,62,65],[48,51,55,58],[53,57,60,63]];
const note=(f,t,dur,g,type)=>{const o=ac.createOscillator(),e=ac.createGain(),lp=ac.createBiquadFilter();o.type=type;o.frequency.value=f;o.detune.value=Math.random()*8-4;lp.type='lowpass';lp.frequency.value=1100;e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+.04);e.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(lp);lp.connect(e);e.connect(master);o.start(t);o.stop(t+dur+.05)};
const kick=t=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(master);o.start(t);o.stop(t+.32);
  const ms=(t-ac.currentTime)*1000;setTimeout(()=>{if(!reduce){stage.classList.remove('nod');void stage.offsetWidth;stage.classList.add('nod')}},Math.max(0,ms))};
let nb=null;const hiss=(t,g,f,d)=>{nb=nb||noiseBuf(1,'white');const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),e=ac.createGain();s.buffer=nb;fl.type=f>3000?'highpass':'bandpass';fl.frequency.value=f;e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl);fl.connect(e);e.connect(master);s.start(t);s.stop(t+d+.02)};
const spb=60/76/2;
const sched=()=>{const chords=found.length===4?chordsB:chordsA;while(nextT<ac.currentTime+.15){const s=step%32,bar=Math.floor(step/8)%4;
  if(s%8===0){chords[bar].forEach(m=>note(mtof(m),nextT,spb*8.2,.07,'triangle'));note(mtof(chords[bar][0]-12),nextT,spb*6,.12,'sine')}
  if(s%8===3||s%8===6){const c=chords[bar];note(mtof(c[(step*7)%4]+12),nextT,spb*2,.035,'sine')}
  if(beatOn){if(s%8===0||s%8===5)kick(nextT);if(s%8===4)hiss(nextT,.25,1800,.18);hiss(nextT,s%2?.03:.05,8000,.05)}
  nextT+=spb;step++}};
const setPlay=on=>{playing=on;$('#pIcon').innerHTML=on?'<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>':'<path d="M7 4l13 8-13 8z"/>';playBtn.setAttribute('aria-label',on?'Пауза':'Играть');$('#sub').textContent=on?'играет · 76 bpm · кот кивает в такт':'на паузе · 76 bpm'};
playBtn.addEventListener('click',async()=>{try{if(!ac)initAudio();if(playing){await ac.suspend();clearInterval(timer);setPlay(false)}else{await ac.resume();nextT=ac.currentTime+.05;timer=setInterval(sched,25);setPlay(true);drawViz()}}catch(e){$('#sub').textContent='браузер не дал включить звук'}});
vol.addEventListener('input',()=>{if(master)master.gain.value=vol.value/100*.8});
const chip=(id,fn)=>{const b=$(id);b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);fn(on)})};
chip('#tPurr',on=>{if(!ac)initAudio();purrG.gain.setTargetAtTime(on?.55:0,ac.currentTime,.3);if(on&&!playing)ac.resume()});
chip('#tRain',on=>{if(!ac)initAudio();rainG.gain.setTargetAtTime(on?.12:0,ac.currentTime,.4);if(on&&!playing)ac.resume()});
chip('#tBeat',on=>{beatOn=on});
const cv=$('#viz'),cx=cv.getContext('2d');
const sizeCv=()=>{const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d};
const ro=new ResizeObserver(sizeCv);ro.observe(cv);
const drawViz=()=>{const W=cv.width,H=cv.height,n=48,data=new Uint8Array(an?an.frequencyBinCount:64);if(an)an.getByteFrequencyData(data);
  cx.clearRect(0,0,W,H);const col=getComputedStyle(root).getPropertyValue('--accent').trim()||'#ff6b1a';cx.fillStyle=col;const bw=W/n;
  for(let i=0;i<n;i++){const v=(data[Math.floor(i*data.length/n/1.4)]||0)/255,h=Math.max(H*.04,v*H*.9);cx.globalAlpha=.35+v*.65;cx.beginPath();cx.roundRect?cx.roundRect(i*bw+bw*.2,(H-h)/2,bw*.6,h,bw*.3):cx.rect(i*bw+bw*.2,(H-h)/2,bw*.6,h);cx.fill()}
  cx.globalAlpha=1;if(playing||(ac&&ac.state==='running'))requestAnimationFrame(drawViz)};
sizeCv();setTimeout(drawViz,100);

/* spotify */
$('#spGo').addEventListener('click',()=>{
  const v=$('#spUrl').value.trim(),m=v.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]{10,40})/),out=$('#spOut');
  if(!m){out.innerHTML='<p class="small" style="margin:0">Не похоже на ссылку Spotify. Скопируй её через «Поделиться → Копировать ссылку».</p>';return}
  const [,t,id]=m;
  out.innerHTML=`<iframe src="https://open.spotify.com/embed/${t}/${id}" allow="autoplay; clipboard-write; encrypted-media; fullscreen" loading="lazy" title="Spotify"></iframe><p style="margin:10px 0 0"><a class="btn ghost" href="https://open.spotify.com/${t}/${id}" target="_blank" rel="noopener">Открыть в Spotify</a></p>`;
  store.set('mtn-sp',v);
});
{const s=store.get('mtn-sp','');if(s)$('#spUrl').value=s}

/* бронь */
const fTime=$('#fTime');fTime.innerHTML=Array.from({length:13},(_,i)=>`<option>${String(10+i).padStart(2,'0')}:00</option>`).join('');fTime.value='15:00';
const fDate=$('#fDate'),iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);fDate.min=iso(new Date());fDate.value=iso(new Date());
{const n=store.get('mtn-name','');if(n)$('#fName').value=n}
$('#form').addEventListener('submit',e=>{e.preventDefault();const name=$('#fName').value.trim(),err=$('#err'),ok=$('#ok');
  if(!name){err.textContent='Напиши имя — коту надо знать, кого встречать.';$('#fName').focus();return}
  if(!fDate.value){err.textContent='Выбери дату.';return}
  err.textContent='';store.set('mtn-name',name);
  const fmt=document.querySelector('input[name=fmt]:checked').value,d=new Date(fDate.value+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
  ok.textContent=`${name}, место отмечено: ${d}, ${fTime.value}, гостей: ${$('#fPpl').value}, формат — ${fmt}. Это демо: заявка никуда не отправляется.`;ok.classList.add('on')});
}

/* ---- блок 2 ---- */
{
const $=s=>document.querySelector(s);
const home=$('#home'),about=$('#about');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MIR=g=>`<g transform="matrix(-1 0 0 1 400 0)">${g}</g>`;
const EP='M123 196Q150 182 178 186Q184 220 177 248Q151 255 124 248Q116 224 123 196Z';
const eyeHalf=`<path fill="#121014" d="${EP}"/><path fill="#4a4552" opacity=".85" d="M134 232Q151 245 168 232Q160 241 151 242Q140 241 134 232Z"/><path fill="none" stroke="#3a3542" stroke-width="2" stroke-linecap="round" d="M142 204q8 10 2 22M152 202q-6 12 4 22"/><circle fill="#fff" cx="135" cy="198" r="2.6" opacity=".9"/>`;
const EYES=`<g class="pe"><g class="eyes">${eyeHalf}${MIR(eyeHalf)}</g></g>`;
const lashHalf=`<path d="M112 200Q150 178 188 184M114 201l-11-3M116 206l-10 3"/>`;
const LASH=`<g class="ln lash" stroke-width="6">${lashHalf}${MIR(lashHalf)}</g>`;
const BLUSH=(y)=>`<ellipse fill="#f4a3b2" cx="116" cy="${y}" rx="16" ry="8.5"/><ellipse fill="#f4a3b2" cx="284" cy="${y}" rx="16" ry="8.5"/>`;
const studs=x=>Array.from({length:5},(_,i)=>`<circle cx="${x}" cy="${440+i*12}" r="2.8" fill="#b4b6be"/>`).join('');

/* ===== Хоши ===== */
function hoshi(){
  const sk='#ece5d4',bl='#2a2930';
  const shoe=`<path class="o" fill="#f4f1ea" d="M122 504Q116 524 130 532Q136 547 153 540Q164 551 178 541Q191 550 201 537Q214 534 210 504Z"/>
    <path class="ln" stroke="#c9c3b6" stroke-width="2.5" d="M128 522Q150 529 172 522T206 520"/>
    <path class="o" fill="#18171c" d="M136 500Q138 478 164 478L196 480Q208 488 208 506L134 508Z"/>
    <path fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="4 3" d="M156 484Q182 482 202 492M150 500H204"/>
    <path class="o" fill="#f4f1ea" d="M124 506Q124 486 146 484L154 485L154 508L126 510Z"/>
    <path class="ln" stroke="#b9b4a8" stroke-width="2" d="M131 491l3 15M138 488l2 19M145 486l1 21"/>
    <path fill="none" stroke="#1b1717" stroke-width="9" stroke-linecap="round" d="M160 486q10-9 20 0M170 482q10-9 20 0"/>
    <path fill="none" stroke="#f4f1ea" stroke-width="5" stroke-linecap="round" d="M160 486q10-9 20 0M170 482q10-9 20 0"/>`;
  const sleeveDown=`<path class="o" fill="${bl}" d="M144 306Q108 340 112 396L140 400Q140 352 164 322Z"/><path d="M114 386l26 4" stroke="#45444d" stroke-width="3"/><circle class="o" fill="${sk}" cx="125" cy="404" r="16"/>`;
  const sleeveHold=`<path class="o" fill="${bl}" d="M144 306Q112 346 150 382L170 366Q146 340 166 320Z"/><circle class="o" fill="${sk}" cx="166" cy="378" r="16"/>`;
  return `<svg class="fig hoshi" viewBox="-30 0 460 560" role="img" aria-label="Хоши">
  <g class="pb"><path class="o" fill="#1c1b20" d="M86 160Q70 250 84 336L104 312L114 342L134 316L148 340Q200 330 252 340L266 316L286 342L296 312L316 336Q330 250 314 160Z"/></g>
  <g class="legs">
    <path class="o" fill="#222128" d="M146 426L142 502L196 502L198 426Z"/><path class="o" fill="#222128" d="M202 426L204 502L258 502L254 426Z"/>
    ${studs(149)}${studs(251)}${shoe}${MIR(shoe)}
  </g>
  <g class="torso">
    <path class="o" fill="${bl}" d="M138 300Q124 360 132 432L268 432Q276 360 262 300Q200 286 138 300Z"/>
    <path class="o" fill="#36353d" d="M150 298Q200 326 250 298Q240 286 200 288Q160 286 150 298Z"/>
    <path fill="none" stroke="#3c3b44" stroke-width="2.5" d="M150 394Q152 382 166 382H234Q248 382 250 394L256 430M150 394L144 430"/>
    <text x="152" y="350" textLength="44" lengthAdjust="spacingAndGlyphs" class="aa">ALWAYS</text><text x="205" y="350" textLength="42" lengthAdjust="spacingAndGlyphs" class="aa">ALONE</text>
    <path d="M150 334l-4-8M196 334l3-9M206 334l-3-9M248 334l4-8M152 352l-5 8M246 352l5 8" stroke="#f1f1f1" stroke-width="1.6" stroke-linecap="round"/>
    <text x="156" y="363" textLength="38" lengthAdjust="spacingAndGlyphs" class="dv">the devil is</text><text x="207" y="363" textLength="34" lengthAdjust="spacingAndGlyphs" class="dv">inside me</text>
    <path d="M200 306V432" stroke="#9a9ca6" stroke-width="4"/><path d="M200 306V432" stroke="#e1e3e8" stroke-width="2" stroke-dasharray="2 2"/>
    <rect x="196" y="310" width="8" height="13" rx="2" fill="#d3d6dd" stroke="#1b1717" stroke-width="1.5"/>
  </g>
  <g class="a-down">${sleeveDown}${MIR(sleeveDown)}</g>
  <g class="a-hold">${sleeveDown}<path class="o" fill="${bl}" d="M246 314Q298 300 320 248L340 260Q318 318 262 336Z"/></g>
  <g class="a-hug">
    <path class="o" fill="${bl}" d="M146 310Q96 318 50 322L52 346Q104 344 152 334Z"/><circle class="o" fill="${sk}" cx="44" cy="334" r="16"/>
    <path class="o" fill="${bl}" d="M258 312Q170 334 68 352L72 374Q178 358 262 338Z"/><circle class="o" fill="${sk}" cx="62" cy="364" r="16"/>
  </g>
  <g class="ph">
    <ellipse class="o" fill="${sk}" cx="200" cy="198" rx="118" ry="110"/>
    <g class="pf">
      ${EYES}${LASH}
      <path class="ln shut" stroke-width="6" d="M122 224Q150 204 178 224M222 224Q250 204 278 224"/>
      ${BLUSH(266)}
      <path class="ln mIdle" stroke-width="3.5" d="M193 278Q200 273 207 278"/>
      <path class="ln kiss" stroke-width="5" d="M194 262q16 2 4 10q14 4-2 13"/>
    </g>
    <g class="pfr">
      <path class="o" fill="#1c1b20" d="M86 160Q76 240 92 318L104 296L112 322L122 288Q110 236 116 178Z"/>
      <path class="o" fill="#1c1b20" d="M314 160Q324 240 308 318L296 296L288 322L278 288Q290 236 284 178Z"/>
      <path class="o" fill="#1c1b20" d="M86 175Q86 120 200 112Q314 120 314 175L300 148L290 170L274 140L258 168L240 136L222 166L204 134L188 168L170 138L152 170L136 142L120 172L106 148Z"/>
      <path fill="none" stroke="#1c1b20" stroke-width="6" stroke-linecap="round" d="M200 134Q196 180 199 222M172 140Q166 170 167 200M230 140Q236 168 234 196"/>
      <path class="o" fill="#2b2a31" d="M76 170Q62 230 74 284Q88 296 104 280L106 182Z"/><path class="o" fill="#2b2a31" d="M324 170Q338 230 326 284Q312 296 296 280L294 182Z"/><path class="o" fill="#44434c" d="M66 274Q70 302 90 304Q108 300 108 280Q88 292 66 274Z"/><path class="o" fill="#44434c" d="M334 274Q330 302 310 304Q292 300 292 280Q312 292 334 274Z"/>
      <path class="o" fill="#2b2a31" d="M104 92L96 16L168 58Z"/><path class="o" fill="#2b2a31" d="M296 92L304 16L232 58Z"/>
      <path fill="#6a3e4e" d="M112 78L107 34L150 60Z"/><path fill="#6a3e4e" d="M288 78L293 34L250 60Z"/>
      <path class="o" fill="#2b2a31" d="M72 178Q68 52 200 44Q332 52 328 178Q312 138 200 130Q88 138 72 178Z"/>
      <path class="o" fill="#44434c" d="M66 180Q70 128 200 120Q330 128 334 180Q320 160 306 170Q290 148 272 164Q254 144 234 160Q214 140 196 160Q178 142 160 162Q140 146 122 166Q104 152 82 174Z"/><path fill="none" stroke="#5e5d68" stroke-width="2.5" stroke-linecap="round" d="M96 150q6-6 4-12M130 140q6-6 4-12M168 134q6-6 4-12M232 134q6-6 4-12M270 140q6-6 4-12M304 150q6-6 4-12"/>
      <path class="o" fill="#3e3d45" d="M190 90h20v10h-20z"/>
      <circle class="o" fill="#4a4952" cx="164" cy="96" r="25"/><circle class="o" fill="#4a4952" cx="236" cy="96" r="25"/>
      <circle fill="#9fb2bf" cx="164" cy="96" r="16"/><circle fill="#9fb2bf" cx="236" cy="96" r="16"/>
      <path fill="#fff" opacity=".7" d="M156 90q4-6 10-6l-2 5q-4 0-8 1zM228 90q4-6 10-6l-2 5q-4 0-8 1z"/>
      <circle class="o" fill="#c0392b" cx="300" cy="140" r="9"/><circle fill="#e3b54a" cx="312" cy="154" r="4"/>
    </g>
  </g>
  <g class="prop"><g transform="translate(330 232) rotate(-10) scale(.95) translate(-197 -298)">
    <path class="o" fill="#17161b" d="M168 300Q196 292 226 300L232 330Q262 334 286 352Q300 362 298 380L156 380Q150 340 168 300Z"/>
    <path class="ln" stroke="#4a4954" stroke-width="3" d="M176 312Q172 340 178 368M250 356Q276 360 290 372"/>
    <circle fill="#c9ccd3" cx="190" cy="330" r="3.6"/><circle fill="#c9ccd3" cx="208" cy="338" r="3.6"/><circle fill="#c9ccd3" cx="226" cy="346" r="3.6"/><circle fill="#c9ccd3" cx="246" cy="352" r="3.6"/>
    <path class="ln" stroke="#0c0c0f" stroke-width="2.5" d="M190 330L208 344L226 340L246 356"/>
    <path class="o" fill="#232229" d="M198 308Q244 312 268 342L254 354Q232 326 196 322Z"/>
    <path class="o" fill="#c9ccd3" stroke-width="2.5" d="M214 310l3-12 6 13zM232 316l6-11 3 13zM248 328l8-8 1 13z"/>
    <circle class="o" fill="#c9ccd3" stroke-width="2.5" cx="205" cy="315" r="6.5"/><path fill="#17161b" d="M202 314h2v2h-2zM206 314h2v2h-2z"/>
    <path class="o" fill="#0f0f12" d="M148 378L304 378Q309 404 302 432L150 432Q144 404 148 378Z"/>
    <path class="ln" stroke="#2c2b33" stroke-width="3" d="M170 384v44M190 384v44M210 384v44M230 384v44M250 384v44M270 384v44M286 384v44M150 402H304"/>
    <path class="o" fill="#c9ccd3" stroke-width="2.5" d="M146 386h9v38h-9zM297 386h9v38h-9z"/>
  </g><circle class="o" fill="${sk}" cx="334" cy="234" r="16"/></g>
</svg>`;
}

/* ===== Лунка ===== */
function lunka(id){
  const sk='#ece5d4',br='#4a3427';
  const sleeveDown=`<path class="o" fill="${br}" d="M144 306Q108 340 112 396L140 400Q140 352 164 322Z"/><circle class="o" fill="${sk}" cx="125" cy="404" r="16"/>`;
  const sleeveHold=`<path class="o" fill="${br}" d="M144 306Q112 346 150 382L170 366Q146 340 166 320Z"/><circle class="o" fill="${sk}" cx="166" cy="378" r="16"/>`;
  const boot=`<path class="o" fill="#3a2a20" d="M136 498Q136 484 152 484L198 484L200 518L130 518Q128 506 136 498Z"/><path class="o" fill="#231811" d="M128 516H202V528H128z"/>`;
  return `<svg class="fig lunka" viewBox="-30 0 460 560" role="img" aria-label="Лунка">
  <defs>
    <pattern id="camo${id}" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#55633f"/><path fill="#2f3a28" d="M4 8q14-8 22 4t-6 14q-16 2-16-18zM34 36q14-6 20 6t-10 12q-14 0-10-18z"/><path fill="#7a8757" d="M30 4q10 2 12 12t-12 4q-6-8 0-16zM6 38q10-2 14 8t-10 8q-8-6-4-16z"/></pattern>
    <pattern id="leo${id}" width="34" height="20" patternUnits="userSpaceOnUse"><rect width="34" height="20" fill="#e9d3a8"/><path fill="#4a2e1a" d="M6 6a3 2.4 0 1 0 .1 0zM22 4a2.6 2 0 1 0 .1 0zM14 14a3 2.2 0 1 0 .1 0zM29 14a2.4 2 0 1 0 .1 0z"/></pattern>
  </defs>
  <g class="pb"><path class="o" fill="#d9d8df" d="M86 160Q72 260 90 350L108 322L118 356L136 326Q200 336 264 326L282 356L292 322L310 350Q328 260 314 160Z"/>
    <path class="ln" stroke="#8b8a95" stroke-width="3" d="M100 220Q96 280 106 330M298 220Q304 280 294 330"/></g>
  <g class="legs">
    <path class="o" fill="url(#camo${id})" d="M142 422L138 500L198 500L198 422Z"/><path class="o" fill="url(#camo${id})" d="M202 422L202 500L262 500L258 422Z"/>
    ${boot}${MIR(boot)}
  </g>
  <g class="torso">
    <path class="o" fill="${br}" d="M136 300Q122 360 130 426L270 426Q278 360 264 300Q200 286 136 300Z"/>
    <path class="o" fill="url(#leo${id})" d="M130 404L270 404L272 432L128 432Z"/>
    <path class="ln" stroke="#2a1d15" stroke-width="3" d="M200 330V404"/>
    <path class="o" fill="#9e3b2b" d="M140 294Q200 330 260 294L262 318Q200 352 138 318Z"/>
    <path class="o" fill="#9e3b2b" d="M150 318L178 320L172 420L146 416Z"/>
    <path class="ln" stroke="#e7b7ad" stroke-width="4" d="M150 356L176 358M149 366L175 368M147 398L173 400"/>
    <path class="ln" stroke-width="3" d="M150 416l-2 10M158 417l-1 10M166 418v10"/>
    <g class="scarf2"><path class="o" fill="#9e3b2b" d="M244 310Q300 298 342 326L332 348Q296 324 250 334Z"/>
    <path class="ln" stroke="#e7b7ad" stroke-width="4" d="M296 310l-6 20M306 314l-6 20"/><path class="ln" stroke-width="3" d="M340 330l10 4M336 340l10 5"/></g>
  </g>
  <g class="a-down">${sleeveDown}${MIR(sleeveDown)}</g>
  <g class="a-hold">${MIR(sleeveDown)}<path class="o" fill="${br}" d="M154 314Q100 300 66 254L46 266Q80 320 138 336Z"/></g>
  <g class="ph">
    <ellipse class="o" fill="${sk}" cx="200" cy="198" rx="118" ry="110"/>
    <g class="pf">
      <path class="ln bags" stroke="#9c86c2" stroke-width="4" opacity=".8" d="M128 262Q151 270 174 262M226 262Q249 270 272 262"/>
      ${EYES}${LASH}
      <path class="ln shut" stroke-width="6" d="M122 226Q150 204 178 226M222 226Q250 204 278 226M122 226l-10-3M278 226l10-3"/>
      ${BLUSH(274)}
      <path class="ln mIdle" stroke-width="3.5" d="M193 284Q200 279 207 284"/>
      <path class="ln kiss" stroke-width="3.5" d="M191 280Q200 289 209 280"/>
    </g>
    <g class="pfr">
      <path class="o" fill="#d9d8df" d="M86 160Q74 250 92 340L104 316L112 344L124 306Q110 240 116 178Z"/>
      <path class="o" fill="#d9d8df" d="M314 160Q326 250 308 340L296 316L288 344L276 306Q290 240 284 178Z"/>
      <path class="o" fill="#d9d8df" d="M86 178Q86 120 200 114Q314 120 314 178L298 152L286 176L268 146L254 174L236 142L218 172L200 138L184 172L166 144L150 174L134 146L118 176L104 154Z"/>
      <path fill="none" stroke="#1b1717" stroke-width="8" stroke-linecap="round" d="M200 136Q196 182 199 226M170 144Q164 172 166 202M232 142Q238 170 236 198"/>
      <path fill="none" stroke="#d9d8df" stroke-width="4" stroke-linecap="round" d="M200 136Q196 182 199 226M170 144Q164 172 166 202M232 142Q238 170 236 198"/>
      <rect class="o" fill="#f3f1e8" x="170" y="152" width="24" height="9" rx="4.5" transform="rotate(-10 182 156)"/>
      <rect class="o" fill="#f3f1e8" x="208" y="148" width="24" height="9" rx="4.5" transform="rotate(8 220 152)"/>
      <path class="ln" stroke="#8b8a95" stroke-width="3" d="M200 140L196 170M254 150L250 172M134 150L138 172M100 200Q96 250 104 300"/>
      <path class="o" fill="#5a3a24" d="M70 170Q54 230 66 292Q84 306 104 290L108 184Z"/><path class="o" fill="#f2e2c8" d="M60 280Q64 308 86 310Q106 306 108 286Q86 298 60 280Z"/>
      <path class="o" fill="#5a3a24" d="M330 170Q346 230 334 292Q316 306 296 290L292 184Z"/><path class="o" fill="#f2e2c8" d="M340 280Q336 308 314 310Q294 306 292 286Q314 298 340 280Z"/>
      <path class="o" fill="#5a3a24" d="M68 176Q64 48 200 40Q336 48 332 176Q312 134 200 126Q88 134 68 176Z"/>
      <path fill="#f2e2c8" opacity=".9" d="M128 74Q150 56 182 66Q164 82 128 74zM236 60Q262 52 280 70Q258 74 236 60z"/>
      <path class="o" fill="#f2e2c8" d="M64 180Q68 126 200 116Q332 126 336 180Q322 160 308 172Q292 148 272 166Q252 142 232 162Q212 138 192 162Q172 140 152 164Q132 144 114 168Q96 150 80 174Z"/>
    </g>
  </g>
  <g class="prop"><g transform="translate(52 236) rotate(74) scale(1.02) translate(-136 -364)">
    <path class="o" fill="#2f74d0" d="M136 352Q200 328 256 350Q266 360 256 374Q200 396 136 376Q128 364 136 352Z"/>
    <path class="ln" stroke="#8fc0ff" stroke-width="3" d="M156 356q8 8 16 0M180 351q8 8 16 0M204 350q8 8 16 0M228 352q8 8 16 0M168 370q8 8 16 0M192 372q8 8 16 0M216 370q8 8 16 0"/>
    <path class="o" fill="#4b93ef" d="M252 362Q290 312 334 314Q308 346 314 362Q308 378 334 410Q290 412 252 362Z"/>
    <path class="ln" stroke="#1f5aa8" stroke-width="2.5" d="M264 360L322 326M266 362H318M264 364L322 398"/>
    <path class="o" fill="#7fb6ff" d="M132 354Q124 364 132 374Q140 364 132 354Z"/>
  </g><circle class="o" fill="${sk}" cx="52" cy="240" r="16"/></g>
</svg>`;
}

/* ===== вкладка ===== */
const heroW=$('#heroFig .fw'),wMe=$('#wMe'),wFr=$('#wFr'),duo=$('#duo');
heroW.innerHTML=hoshi();wMe.innerHTML=hoshi();wFr.innerHTML=lunka('b');
const heroF=heroW.querySelector('svg'),meF=wMe.querySelector('svg'),frF=wFr.querySelector('svg');
heroF.classList.add('hold');
const figs=[heroF,meF,frF].map(el=>({el,hx:0,hy:0,next:1+Math.random()*3}));
let mx=innerWidth/2,my=innerHeight/2,running=false;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
let prev=0;
const loop=t=>{if(!running)return;const dt=Math.min(.05,(t-prev)/1000||0);prev=t;
  for(const f of figs){const r=f.el.getBoundingClientRect();if(!r.width)continue;
    const tx=Math.max(-1,Math.min(1,(mx-(r.left+r.width/2))/(r.width*1.4))),ty=Math.max(-1,Math.min(1,(my-(r.top+r.height*.36))/(r.height*1.2)));
    f.hx+=(tx-f.hx)*.12;f.hy+=(ty-f.hy)*.12;f.el.style.setProperty('--hx',f.hx.toFixed(3));f.el.style.setProperty('--hy',f.hy.toFixed(3));
    f.next-=dt;if(f.next<0){f.next=2.5+Math.random()*3.5;f.el.classList.add('blinking');setTimeout(()=>f.el.classList.remove('blinking'),140)}}
  requestAnimationFrame(loop)};
const route=()=>{
  const isAbout=location.hash==='#about';
  home.hidden=isAbout;about.hidden=!isAbout;
  document.querySelectorAll('.links a').forEach(a=>a.classList.toggle('cur',isAbout&&a.getAttribute('href')==='#about'));
  if(isAbout){scrollTo(0,0);if(!running){running=true;requestAnimationFrame(loop)}}
  else{running=false;const t=location.hash&&document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView()}
};
addEventListener('hashchange',route);

/* клик — прыжок и реплика */
const says={hoshi:['это New Rock, не трогай','мяу?','кастом или ничего','хоши тут'],lunka:['…','хвост не отдам','буль','лунка спит стоя']};
const bubble=(wrap,txt)=>{let b=wrap.querySelector('.say');if(!b){b=document.createElement('span');b.className='say';wrap.appendChild(b)}b.textContent=txt;b.classList.remove('on');void b.offsetWidth;b.classList.add('on')};
[[heroW,'hoshi'],[wMe,'hoshi'],[wFr,'lunka']].forEach(([w,k])=>w.addEventListener('click',()=>{w.classList.remove('hop');void w.offsetWidth;w.classList.add('hop');const a=says[k];bubble(w,a[Math.random()*a.length|0])}));

/* виды и обнимашки */
const hugBtn=$('#hug');let hugging=false;
const setHug=on=>{hugging=on;duo.classList.toggle('hugging',on);meF.classList.toggle('hug',on);frF.classList.toggle('hug',on);hugBtn.textContent=on?'Отпустить':'Обнять'};
document.querySelectorAll('.duoBar .chip').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.duoBar .chip').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const v=b.dataset.v;duo.classList.remove('only-me','only-fr');if(v!=='both'){duo.classList.add('only-'+v);setHug(false)}
  meF.classList.toggle('hold',v==='me');frF.classList.toggle('hold',v==='fr');
  hugBtn.disabled=v!=='both';hugBtn.style.opacity=v==='both'?'':'.4'}));
hugBtn.addEventListener('click',()=>setHug(!hugging));
route();
}
