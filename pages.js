/* EVORA multi-page router. Loaded LAST on movies/tv/live/sports pages.
   - sidebar buttons navigate between real pages
   - the page's own section opens automatically
   - closing a section overlay returns to home */
(function(){
  var PAGE = document.body.getAttribute('data-page') || 'home';
  /* Clean URLs (/movies, /tv, /live, /sports) when hosted (Cloudflare Pages etc. serve movies.html at /movies);
     real file names when the project is opened straight from disk (file://). */
  var HOSTED = /^https?:$/.test(location.protocol);
  var URLS = HOSTED ? { home:'/', search:'/search', movies:'/movies', tv:'/tv', live:'/live', sports:'/sports' }
                    : { home:'index.html', search:'search.html', movies:'movies.html', tv:'tv.html', live:'live.html', sports:'sports.html' };
  var OPEN = {
    search:function(){ if(window.openSxSearch) openSxSearch(); },
    movies:function(){ if(window.hsmOpen) hsmOpen('movie'); else if(window.openMoviesOverlay) openMoviesOverlay(); },
    tv:function(){ if(window.hsmOpen) hsmOpen('tv'); },
    live:function(){ if(window.openLiveTV) openLiveTV(); },
    sports:function(){ if(window.sxSwitchTab){ sxSwitchTab('matches'); var e=document.getElementById('sxTabPanels'); if(e) e.scrollIntoView(); } }
  };
  var LABEL = { 'Home':'home', 'Search':'search', 'Movies':'movies', 'TV Shows':'tv', 'Live TV':'live', 'Matches':'sports' };

  /* sidebar: capture clicks before the single-page handlers run */
  function wireRail(){
    var rail = document.getElementById('hs-rail'); if(!rail || rail.__evPages) return !!rail;
    rail.__evPages = true;
    rail.addEventListener('click', function(e){
      var a = e.target.closest('a'); if(!a) return;
      var key = LABEL[a.getAttribute('title')]; if(!key) return;
      if(key === PAGE) return;                       /* already here: let normal handler run */
      e.preventDefault(); e.stopImmediatePropagation();
      location.href = URLS[key];
    }, true);
    rail.querySelectorAll('a').forEach(function(x){ x.classList.toggle('on', LABEL[x.getAttribute('title')] === PAGE); });
    return true;
  }

  /* back to home when the section is closed */
  function watchClose(){
    if(PAGE === 'home' || PAGE === 'sports') return;
    var ids = { movies:['movies-overlay','hsm-overlay'], tv:['tv-overlay','hsm-overlay'], live:['livetv-overlay'], search:['sx-search-overlay'] }[PAGE] || [];
    var targets = ids.map(function(i){ return document.getElementById(i); }).filter(Boolean);
    if(!targets.length) return;
    var opened = false;
    var mo = new MutationObserver(function(){
      var anyOpen = targets.some(function(t){ return t.classList.contains('open'); });
      if(anyOpen) opened = true; else if(opened){ location.href = URLS.home; }
    });
    targets.forEach(function(t){ mo.observe(t,{attributes:true,attributeFilter:['class']}); });
  }

  var tries = 0;
  (function boot(){
    var ready = wireRail();
    var fn = OPEN[PAGE];
    if(PAGE !== 'home' && fn && (ready || tries > 40)){ try{ fn(); }catch(e){ console.warn('[pages] open failed', e); } setTimeout(watchClose, 400); return; }
    if(PAGE === 'home') return;
    if(tries++ < 80) setTimeout(boot, 150);
  })();
  document.title = ({movies:'Movies',tv:'TV Shows',live:'Live TV',sports:'Sports',search:'Search'}[PAGE] ? ({movies:'Movies',tv:'TV Shows',live:'Live TV',sports:'Sports',search:'Search'}[PAGE] + ' · EVORA') : document.title);
})();
