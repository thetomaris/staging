/* Kinetic Insights · site behaviour. Calm, slow, and off under prefers-reduced-motion. */
(function(){
  var d=document.documentElement;
  var motion=d.classList.contains('motion');
  function clamp(v){return v<0?0:v>1?1:v}
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function progress(el,start,span){var r=el.getBoundingClientRect(),vh=innerHeight;return clamp((vh*start-r.top)/(r.height+vh*span))}

  /* ---------- reveal ---------- */
  var els=$$('.rv,.seats,.sitback');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')})}
  else{
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(e){io.observe(e)});
  }

  /* ---------- 1 hero: scattered words settle into the headline ---------- */
  var hero=$('.hero2');
  if(hero){
    var drift=$('.drift',hero),h1=$('h1',hero);
    if(motion&&drift&&h1&&d.classList.contains('opt-words')){
      var W=hero.clientWidth,H=hero.clientHeight,hr=h1.getBoundingClientRect(),br=hero.getBoundingClientRect();
      var cx=hr.left-br.left+hr.width*.35, cy=hr.top-br.top+hr.height*.5;
      var spans=$$('span',drift), n=spans.length, small=W<720;
      spans.forEach(function(s,i){
        if(small&&i%2){s.remove();return}
        var sw=s.offsetWidth||120, x=small?Math.random()*Math.max(0,W-sw-32)+16:W*.58+Math.random()*Math.max(0,W*.42-sw-32), y=Math.random()*(H*.84)+H*.06;
        var dx=(Math.random()-.5)*60, dy=(Math.random()-.5)*40;
        s.style.left=x+'px';s.style.top=y+'px';
        s.style.setProperty('--x1',dx+'px');s.style.setProperty('--y1',dy+'px');
        s.style.setProperty('--x2',(cx+(Math.random()-.5)*hr.width*.5-x)+'px');s.style.setProperty('--y2',(cy+(Math.random()-.5)*hr.height*.4-y)+'px');
      });
      drift.getBoundingClientRect();
      setTimeout(function(){drift.classList.add('on')},80);
      setTimeout(function(){drift.classList.add('settle');hero.classList.add('settled')},2200);
      setTimeout(function(){drift.remove()},6000);
    } else { if(drift)drift.remove(); hero.classList.add('settled') }
  }

  /* ---------- 3 pulse to wave ---------- */
  var pulses=$$('.pulse svg');
  function drawPulse(svg,p){
    var W=1200,H=120,m=H/2,k=1+(1-p)*9,f=2.2+(1-p)*12,A=18+(1-p)*30,pts=[];
    for(var x=0;x<=W;x+=3){var s=Math.sin((x/W)*f*Math.PI*2-Math.PI/2);var y=m-A*(s<0?-1:1)*Math.pow(Math.abs(s),k);pts.push((x?'L':'M')+x+' '+y.toFixed(1))}
    svg.querySelector('path').setAttribute('d',pts.join(''));
  }
  pulses.forEach(function(s){drawPulse(s,motion?0:1)});

  /* ---------- 5 nine-month line: drawn on scroll, teal to orange ---------- */
  var T=[30,90,95],O=[194,97,26];
  function mix(p){return 'rgb('+T.map(function(t,i){return Math.round(t+(O[i]-t)*p)}).join(',')+')'}
  var arcs=$$('.arc2 svg');
  arcs.forEach(function(svg){var p=$('.shaft',svg),L=p.getTotalLength();$$('circle',svg).forEach(function(c){var pt=p.getPointAtLength(L*(+c.dataset.f));c.setAttribute('cx',pt.x);c.setAttribute('cy',pt.y)})});

  /* ---------- 12 network ---------- */
  var nets=$$('.network svg');

  /* ---------- portraits sharpen ---------- */
  var ports=$$('.portrait');

  function onScroll(){
    pulses.forEach(function(s){if(motion)drawPulse(s,progress(s,.95,.55))});
    arcs.forEach(function(svg){
      var pr=motion?progress(svg,.92,.5):1,col=mix(pr),sh=$('.shaft',svg);
      sh.style.strokeDashoffset=1-pr;sh.style.stroke=col;
      $$('circle',svg).forEach(function(c){var on=pr>=+c.dataset.f;c.classList.toggle('on',on);c.style.stroke=col;c.style.fill=on?col:''});
    });
    nets.forEach(function(svg){if(!d.classList.contains('opt-network'))return;var pr=motion?progress(svg,.95,.35):1;$$('line',svg).forEach(function(l,i,a){var t=clamp(pr*a.length-i*.85);l.style.strokeDashoffset=1-t})});
    ports.forEach(function(p){p.style.setProperty('--s',motion?progress(p,.95,.2).toFixed(3):1)});
  }
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();

  /* ---------- presence beats ---------- */
  var beats=$$('.beats');
  function onBeats(){beats.forEach(function(bt){
    var ch=[].slice.call(bt.children),pr=motion?progress(bt,.9,.25):1;
    ch.forEach(function(el,k){el.classList.toggle('on',pr>=(k+.5)/(ch.length+.5))});
  })}
  addEventListener('scroll',onBeats,{passive:true});onBeats();

  /* ---------- engagement story (pinned) ---------- */
  var a3=$('.arc3');
  if(a3){
    var sh3=$('.shaft',a3),L3=sh3.getTotalLength(),dot=$('.dot',a3),cs3=$$('circle.ph',a3),it3=$$('.arc3-phase .item',a3),cur=-1;
    cs3.forEach(function(c){var pt=sh3.getPointAtLength(L3*(+c.dataset.f));c.setAttribute('cx',pt.x);c.setAttribute('cy',pt.y)});
    var onA3=function(){
      var r=a3.getBoundingClientRect(),vh=innerHeight-72,pr=motion?clamp((72-r.top)/Math.max(1,r.height-vh)):1;
      var lp=clamp(pr/.9),col=mix(lp);
      sh3.style.strokeDashoffset=1-lp;sh3.style.stroke=col;
      var pt=sh3.getPointAtLength(L3*lp);dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);dot.style.fill=col;
      var idx=0;cs3.forEach(function(c,k){var on=lp>=+c.dataset.f-.01;c.classList.toggle('on',on);c.style.stroke=col;c.style.fill=on?col:'';if(on)idx=k});
      a3.classList.toggle('ghost-on',lp>.8);a3.classList.toggle('hold-on',lp>.97);
      if(motion&&idx!==cur){cur=idx;it3.forEach(function(x,k){x.classList.toggle('on',k===idx)})}
    };
    addEventListener('scroll',onA3,{passive:true});addEventListener('resize',onA3);onA3();
  }

  /* ---------- 4 the turn ---------- */
  var turns=$$('.turn');
  if(turns.length&&'IntersectionObserver' in window){
    var tio=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){setTimeout(function(){x.target.classList.add('on')},1400);tio.unobserve(x.target)}})},{threshold:.8});
    turns.forEach(function(t){tio.observe(t)});
  } else turns.forEach(function(t){t.classList.add('on')});

  /* ---------- 10 cursor circle ---------- */
  if(d.classList.contains('opt-cursor')&&motion&&matchMedia('(hover:hover)').matches){
    var c=document.createElement('div');c.className='cursor';document.body.appendChild(c);
    var tx=-100,ty=-100,x=-100,y=-100;
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY});
    (function loop(){x+=(tx-x)*.08;y+=(ty-y)*.08;c.style.transform='translate('+x+'px,'+y+'px)';requestAnimationFrame(loop)})();
  }

  /* ---------- 16 reading-time markers ---------- */
  $$('main>section').forEach(function(s){
    var w=(s.innerText||'').split(/\s+/).length;if(w<25)return;
    var sec=Math.max(10,Math.round(w/220*60/10)*10),m=document.createElement('p');
    m.className='rt pad';m.textContent=sec>=60&&sec%60===0?(sec/60)+(sec===60?' minute':' minutes'):sec+' seconds';
    s.insertBefore(m,s.firstChild);
  });

  /* ---------- 7 application, one question at a time ---------- */
  var form=$('form.waitlist-form');
  if(form){
    var steps=$$('.step',form),i=0,bar=$('.progress i'),back=$('.back',form),next=$('.next',form),cnt=$('.count',form),err=$('.err',form);
    var R=['i','ii','iii','iv','v'];
    function show(n,focus){
      steps.forEach(function(s,k){s.classList.toggle('active',k===n)});i=n;
      bar.style.width=((n+1)/steps.length*100)+'%';
      cnt.textContent=R[n]+' / '+R[steps.length-1];
      back.hidden=n===0;
      next.textContent=n===steps.length-1?'Put my name on the list':'Continue';
      err.textContent='';
      if(focus){var q=$('.q',steps[n]);if(q){q.setAttribute('tabindex','-1');q.focus({preventScroll:true})}scrollTo({top:0})}
    }
    function valid(n){
      var s=steps[n],ok=true;
      $$('input[required]',s).forEach(function(inp){if(inp.type==='radio'){if(!$('input[name="'+inp.name+'"]:checked',s))ok=false}else if(!inp.value.trim()||(inp.type==='email'&&!/^\S+@\S+\.\S+$/.test(inp.value)))ok=false});
      var oth=$('input[value="Something else"]:checked',s);if(oth&&!$('.other input',s).value.trim())ok=false;
      if(!ok)err.textContent=n===steps.length-1?'Please add your name and a valid email.':'Please choose one to continue.';
      return ok;
    }
    function submit(){
      var to=form.getAttribute('action');
      if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){location.href=to;return}
      next.disabled=true;
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()})
        .then(function(r){if(!r.ok)throw 0;location.href=to})
        .catch(function(){next.disabled=false;err.textContent='Something went wrong. Please try again, or write to gail@kineticinsights.com.'});
    }
    next.addEventListener('click',function(){if(!valid(i))return;if(i<steps.length-1)show(i+1,true);else submit()});
    back.addEventListener('click',function(){if(i>0)show(i-1,true)});
    form.addEventListener('submit',function(e){e.preventDefault();next.click()});
    $$('input[type=radio]',form).forEach(function(r){r.addEventListener('change',function(){
      var s=r.closest('.step'),o=$('.other',s);
      if(o){o.classList.toggle('show',r.value==='Something else');if(r.value==='Something else'){$('input',o).focus();return}}
      err.textContent='';setTimeout(function(){if(steps[i]===s&&i<steps.length-1)show(i+1,true)},motion?650:0);
    })});
    form.addEventListener('input',function(){err.textContent=''});
    show(0,false);
  }

  /* ---------- review switcher ---------- */
  var rv=null;try{rv=sessionStorage.getItem('ki-review')}catch(e){}
  if(rv&&window.KI_FLAGS){
    var p=document.createElement('div');p.className='review';p.innerHTML='<b>Design options</b>';
    Object.keys(KI_FLAGS).forEach(function(k){
      var l=document.createElement('label'),cb=document.createElement('input');cb.type='checkbox';cb.checked=d.classList.contains(KI_CLASS[k]);
      cb.onchange=function(){var on=$$('input',p).filter(function(x){return x.checked}).map(function(x){return x.dataset.k});try{sessionStorage.setItem('ki-opt',on.join(',')||'none')}catch(e){}location.reload()};
      cb.dataset.k=k;l.appendChild(cb);l.appendChild(document.createTextNode(' '+k));p.appendChild(l);
    });
    document.body.appendChild(p);
  }
})();
