/* Shared behavior for project/about articles:
   1) Contents nav scroll-spy
   2) Gallery lightbox (builds its own DOM; reads .gallery .g-link with data-caption) */
(function(){
  /* ---- contents scroll-spy ---- */
  var nav = document.querySelector('.contents');
  if(nav && ('IntersectionObserver' in window)){
    var navLinks = {};
    nav.querySelectorAll('a').forEach(function(a){ navLinks[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          nav.querySelectorAll('a').forEach(function(a){ a.classList.remove('active'); });
          var a = navLinks[e.target.id]; if(a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach(function(s){ obs.observe(s); });
  }

  /* ---- gallery lightbox ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery .g-link'));
  if(!links.length) return;

  var lb = document.createElement('div');
  lb.className = 'lightbox'; lb.id = 'lightbox';
  lb.setAttribute('aria-hidden','true'); lb.setAttribute('role','dialog'); lb.setAttribute('aria-label','Image viewer');
  lb.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close (Esc)">&times;</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous image">&lsaquo;</button>' +
    '<button class="lb-btn lb-next" aria-label="Next image">&rsaquo;</button>' +
    '<figure class="lb-figure"><img class="lb-img" src="" alt=""><figcaption class="lb-cap"></figcaption></figure>';
  document.body.appendChild(lb);

  var lbImg = lb.querySelector('.lb-img'), lbCap = lb.querySelector('.lb-cap'), idx = 0;
  function preload(i){ if(i<0||i>=links.length) return; var im = new Image(); im.src = links[i].getAttribute('href'); }
  function render(){
    var a = links[idx], cap = a.getAttribute('data-caption') || '';
    lbImg.src = a.getAttribute('href'); lbImg.alt = cap;
    lbCap.innerHTML = (cap ? cap + ' &nbsp;&middot;&nbsp; ' : '') + '<span class="idx">' + (idx+1) + ' / ' + links.length + '</span>';
    preload(idx+1); preload(idx-1);
  }
  function open(i){ idx=i; render(); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.classList.add('lb-open'); }
  function close(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.classList.remove('lb-open'); lbImg.src=''; }
  function go(d){ idx=(idx+d+links.length)%links.length; render(); }
  links.forEach(function(a,i){ a.addEventListener('click', function(e){ e.preventDefault(); open(i); }); });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); go(-1); });
  lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); go(1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
  document.addEventListener('keydown', function(e){ if(!lb.classList.contains('open')) return; if(e.key==='Escape') close(); else if(e.key==='ArrowLeft') go(-1); else if(e.key==='ArrowRight') go(1); });
  var x0=null;
  lb.addEventListener('touchstart', function(e){ x0=e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', function(e){ if(x0===null) return; var dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>40) go(dx<0?1:-1); x0=null; });
})();
