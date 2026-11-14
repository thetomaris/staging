/* Kinetic Insights · design flags. See DESIGN-OPTIONS.md.
   Everything here is OFF by default. Switch a flag to true to turn it on for everyone,
   or preview it with ?opt=cursor,texture (or ?opt=all, ?opt=none) in the URL.
   ?review adds a small switcher panel. Both are remembered for the browser session. */
window.KI_FLAGS = {
  heroWords:      false, // 17  faint words drift in the hero and settle toward the headline
  boardroomStory: false, // Fortune 50 boardroom story: keep false until Gail approves it
  cursor:         false, // 10  soft circle that follows the cursor with a slight lag
  sitBack:        false, // 11  text blocks lean forward slightly, then settle back
  network:        false, // 12  network of people, connections draw in on scroll
  texture:        false, // 13  subtle paper / linen texture
  heroObject:     false, // 14  one object photo in the hero (placeholder image)
  kMotion:        false, // 15  the K of the wordmark moves almost imperceptibly on load
  mobileSnap:     false  // 16  mobile: one idea per screen, scroll snapping, reading-time markers
};
window.KI_CLASS = {heroWords:'opt-words',boardroomStory:'opt-boardroom',cursor:'opt-cursor',sitBack:'opt-sitback',network:'opt-network',texture:'opt-texture',heroObject:'opt-heroobject',kMotion:'opt-k',mobileSnap:'opt-snap'};
(function(){
  var d=document.documentElement, F=window.KI_FLAGS, C=window.KI_CLASS, ss=null;
  d.classList.remove('no-js'); d.classList.add('js');
  try{ss=window.sessionStorage}catch(e){}
  var q=new URLSearchParams(location.search), o=q.get('opt');
  if(o!==null&&ss){try{ss.setItem('ki-opt',o)}catch(e){}}
  if(o===null&&ss){try{o=ss.getItem('ki-opt')}catch(e){}}
  if(q.has('review')&&ss){try{ss.setItem('ki-review','1')}catch(e){}}
  if(o&&o!=='none'){o.split(',').forEach(function(k){k=k.trim();if(k==='all'){for(var f in F)if(f!=='boardroomStory')F[f]=true}else if(k in F)F[k]=true})}
  for(var f in F){if(F[f])d.classList.add(C[f])}
  if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))d.classList.add('motion');
})();
