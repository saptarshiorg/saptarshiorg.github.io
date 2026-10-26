/* EVORA fast-data layer: parallel prefetch of every API at page open, in-flight de-dupe,
   stale-while-revalidate disk cache (Cache API) for the first seconds of a visit, network-first after. */
(function(){
  if (!window.fetch || !window.caches || window.__evFast) return;
  window.__evFast = 1;
  var orig = window.fetch.bind(window), C = window.EV_CONFIG || {}, T0 = Date.now();
  var inflight = {}, CN = 'ev-data-v1';
  var HOSTS = /^(docs\.google\.com|raw\.githubusercontent\.com|sonujson-v5\.pages\.dev|vidapi\.ru|iptv-org\.github\.io|api\.allorigins\.win|corsproxy\.io)$/;
  function keyOf(u){ try { var x = new URL(u, location.href); x.searchParams.delete('t'); return x.href; } catch(e){ return u; } }
  function hostOK(u){ try { return HOSTS.test(new URL(u, location.href).hostname); } catch(e){ return false; } }
  function ttl(u){ return /docs\.google\.com/.test(u) ? 600000 : /vidapi|iptv/.test(u) ? 1800000 : 180000; }  /* max age usable instantly */
  function meta(){ try { return JSON.parse(localStorage.getItem('ev_fm') || '{}'); } catch(e){ return {}; } }
  function setMeta(k){ try { var m = meta(); m[k] = Date.now(); localStorage.setItem('ev_fm', JSON.stringify(m)); } catch(e){} }

  function net(input, init, key){
    if (inflight[key]) return inflight[key].then(function(r){ return r.clone(); });
    var p = orig(input, init).then(function(res){
      if (res && res.ok){ var cp = res.clone(); caches.open(CN).then(function(c){ return c.put(key, cp); }).then(function(){ setMeta(key); }).catch(function(){}); }
      return res;
    });
    inflight[key] = p;
    var done = function(){ setTimeout(function(){ if (inflight[key] === p) delete inflight[key]; }, 0); };
    p.then(done, done);
    return p.then(function(r){ return r.clone(); });
  }

  window.fetch = function(input, init){
    var url = typeof input === 'string' ? input : (input && input.url);
    var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    if (method !== 'GET' || !url || !hostOK(url)) return orig(input, init);
    var key = keyOf(url), age = Date.now() - (meta()[key] || 0), warm = Date.now() - T0 < 20000;
    return caches.open(CN).then(function(c){ return c.match(key); }).catch(function(){ return null; }).then(function(hit){
      if (hit && warm && age < ttl(url)){                      /* instant paint from last visit; refresh quietly for next time */
        net(input, init, key).catch(function(){});
        return hit;
      }
      var n = net(input, init, key);
      if (!hit) return n;
      return new Promise(function(res){                         /* network wins if quick, else cached copy after 3.5s / on error */
        var t = setTimeout(function(){ res(hit); }, 3500);
        n.then(function(r){ clearTimeout(t); res(r); }, function(){ clearTimeout(t); res(hit); });
      });
    });
  };

  /* ---- prefetch everything in parallel, right now ---- */
  try {
    var urls = [C.FANCODE_CNPTV, C.FANCODE_WORLD, C.SONYLIV_API].concat(C.WILLOW_APIS || []);
    if (C.SHEET_ID && C.SHEET_URL) ['SETTINGS','TICKER','NAVBAR','HERO SLIDES','MATCH CARDS','LIVE CHANNELS','CATEGORIES','BROADCAST','SCHEDULE','SOCIAL LINKS','FOOTER','WATCH POPUP','PANELS'].forEach(function(n){ urls.push(C.SHEET_URL(C.SHEET_ID, n)); });
    ['movies','tvshows'].forEach(function(p){ urls.push('https://vidapi.ru/' + p + '/latest/page-1.json'); });
    urls.forEach(function(u){ if (u) window.fetch(u).catch(function(){}); });
  } catch(e){}
})();

/* No splash loader on every page: show it only on the first home visit of a session.
   Section pages (/movies, /tv, /live, /sports, /search, /vip) and repeat visits skip it. */
(function(){
  try{
    var home=/(^\/$|\/index\.html$|\/$)/.test(location.pathname)||location.pathname==='';
    var seen=sessionStorage.getItem('ev_loader_seen')==='1';
    if(!home){
      var st=document.createElement('style');
      st.textContent='#cms-loader{display:none!important}';
      document.head.appendChild(st);
    }
    sessionStorage.setItem('ev_loader_seen','1');
  }catch(e){}
})();
try{localStorage.removeItem('ev_ui_mode');}catch(e){}
;

/* dark theme only */
(function(){var d=document.documentElement;d.setAttribute('data-theme','dark');d.style.colorScheme='dark';try{localStorage.removeItem('sx-theme');}catch(e){}})();

;

/* EV WebView compatibility (evstreams.pages.dev)
   - remembers the real UA, then hides the "; wv" / "Version/x" markers from this page's own scripts
   - makes sure every iframe (embed, StreamPulse, FanCode, Multiview) is allowed autoplay / fullscreen / DRM
   - in a WebView shows a "Not playing? Reload / Open in browser" chip on third-party embeds
   NOTE: the HTTP User-Agent and X-Requested-With header that embed hosts see are set by the app itself
   (see WebViewSetup.kt) - a web page cannot change them. */
(function(){
  try{
    var ua=navigator.userAgent||''; window.__evRealUA=ua;
    window.EV_WV=/; wv\)/i.test(ua)||(/Android/i.test(ua)&&/Version\/[\d.]+/i.test(ua)&&/Chrome\/[\d.]+/i.test(ua))||/(iPhone|iPod|iPad)/i.test(ua)&&!/Safari\//i.test(ua)&&!navigator.standalone||!!(window.ReactNativeWebView||window.flutter_inappwebview||window.AndroidBridge);
    if(window.EV_WV){
      var clean=ua.replace('; wv)',')').replace(/\sVersion\/[\d.]+/,'');
      try{ Object.defineProperty(Navigator.prototype,'userAgent',{get:function(){return clean;},configurable:true}); }catch(e){}
      try{ Object.defineProperty(navigator,'userAgent',{get:function(){return clean;},configurable:true}); }catch(e){}
    }
  }catch(e){}
  var ALLOW='autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; accelerometer; gyroscope; web-share';
  function fix(f){
    try{
      if(f.getAttribute('allow')!==ALLOW) f.setAttribute('allow',ALLOW);
      f.setAttribute('allowfullscreen',''); f.setAttribute('webkitallowfullscreen',''); f.setAttribute('mozallowfullscreen','');
    }catch(e){}
  }
  function scan(root){ try{ (root.querySelectorAll?root.querySelectorAll('iframe'):[]).forEach(fix); if(root.tagName==='IFRAME') fix(root); }catch(e){} }
  try{
    new MutationObserver(function(ms){ ms.forEach(function(m){ m.addedNodes&&m.addedNodes.forEach(function(n){ if(n.nodeType===1) scan(n); }); }); })
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  document.addEventListener('DOMContentLoaded',function(){ scan(document); });

  var t1=0,t2=0;
  function chip(){ var c=document.getElementById('ev-embed-help'); if(c) return c;
    var wrap=document.getElementById('stream-player-frame-wrap')||document.getElementById('stream-player-overlay'); if(!wrap) return null;
    c=document.createElement('div'); c.id='ev-embed-help';
    c.style.cssText='position:absolute;left:50%;bottom:14px;transform:translateX(-50%);z-index:9;display:none;gap:8px;align-items:center;background:rgba(12,13,19,.92);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:6px 8px 6px 14px;font:600 12px/1 "Google Sans",system-ui,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.5)';
    c.innerHTML='<span>Not playing?</span><button type="button" data-a="r" style="all:unset;cursor:pointer;background:#6d28ff;padding:6px 10px;border-radius:999px">Reload</button><button type="button" data-a="o" style="all:unset;cursor:pointer;background:rgba(255,255,255,.16);padding:6px 10px;border-radius:999px">Open in browser</button><button type="button" data-a="x" aria-label="Hide" style="all:unset;cursor:pointer;padding:6px 8px;opacity:.7">\u2715</button>';
    c.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return; var a=b.getAttribute('data-a'), u=c.getAttribute('data-src')||'';
      if(a==='x') c.style.display='none';
      else if(a==='r'){ var f=document.getElementById('stream-player-frame'); if(f&&u){ f.removeAttribute('srcdoc'); f.src='about:blank'; setTimeout(function(){ f.src=u; },150); } c.style.display='none'; evEmbedWatch(u); }
      else if(a==='o'&&u){
        window.__sxAllowPopup=true;
        try{ var m=/^https?:\/\/(.+)$/i.exec(u); if(/Android/i.test(window.__evRealUA||'')&&m){ location.href='intent://'+m[1]+'#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(u)+';end'; return; } }catch(_){}
        try{ var w=window.open(u,'_blank'); if(!w) location.href=u; }catch(_){}
      }
    });
    wrap.appendChild(c); return c; }
  window.evEmbedWatch=function(u){
    clearTimeout(t1); clearTimeout(t2);
    var c0=document.getElementById('ev-embed-help'); if(c0) c0.style.display='none';
    return; /* help chip disabled */
    var c=document.getElementById('ev-embed-help'); if(c) c.style.display='none';
    if(!window.EV_WV && !(window.matchMedia && matchMedia('(pointer:coarse)').matches)) return;
    t1=setTimeout(function(){
      var ov=document.getElementById('stream-player-overlay'); if(!ov||!ov.classList.contains('open')) return;
      var f=document.getElementById('stream-player-frame'); if(!f||f.hasAttribute('srcdoc')) return;
      var c=chip(); if(!c) return; c.setAttribute('data-src',u); c.style.display='flex';
      t2=setTimeout(function(){ c.style.display='none'; },15000);
    },9000);
  };
})();

;

/* Consistent team-name style: "IND vs WI", "India vs West Indies", "Real Madrid vs FC Barcelona".
   Only touches "A vs B" titles, so channel / movie names are never altered. */
(function(){
  var ACR={fc:1,cf:1,sc:1,ac:1,afc:1,usa:1,uae:1,uk:1,nz:1,sa:1,wi:1,psg:1,rcb:1,csk:1,kkr:1,srh:1,dc:1,lsg:1,gt:1,rr:1,mi:1,pbks:1,ind:1,aus:1,pak:1,eng:1,sl:1,ban:1,afg:1,zim:1};
  var MINOR={of:1,and:1,the:1,de:1,la:1,del:1,di:1,da:1,du:1,von:1,van:1,al:1,el:1};
  function side(t){
    t=String(t).replace(/\s+/g,' ').trim();
    if(!t) return t;
    var words=t.split(' ');
    if(words.length===1){
      var w=words[0];
      if(/^[A-Za-z0-9.&-]{1,4}$/.test(w)&&(w===w.toUpperCase()||(w===w.toLowerCase()&&w.length<=3))) return w.toUpperCase();
    }
    return words.map(function(w,i){
      var lo=w.toLowerCase(),up=w.toUpperCase();
      if(w!==lo&&w!==up) return w;                                   /* McIlroy, PSG-style mixes stay as written */
      if(ACR[lo]||(w===up&&w.length<=3&&words.length>1&&/[A-Z]/.test(w))) return up; /* FC, CF, USA, UAE */
      if(i>0&&MINOR[lo]) return lo;
      return lo.charAt(0).toUpperCase()+lo.slice(1);
    }).join(' ');
  }
  var _L='english|hindi|bengali|bangla|tamil|telugu|kannada|malayalam|marathi|gujarati|punjabi|odia|oriya|urdu|assamese|bhojpuri|nepali|sinhala|spanish|arabic|french|portuguese|german|italian|russian|indonesian|thai|vietnamese|turkish|multi(?:[ -]?(?:audio|language|lang))?';
  var _G='[\\[\\(\\{]\\s*(?:'+_L+')(?:\\s*(?:[,/&+|]|and|-)\\s*(?:'+_L+'))*\\s*(?:audio|commentary|feed|dub|language)?\\s*[\\]\\)\\}]';
  window.evLangRe=new RegExp('\\s*'+_G,'gi');
  window.evIsLangTag=function(t){ return new RegExp('^\\s*'+_G+'\\s*$','i').test(String(t||'')); };
  window.evStripLang=function(t){ return String(t==null?'':t).replace(window.evLangRe,'').replace(/\s{2,}/g,' ').trim(); };
  window.evTeamName=function(str){
    if(str==null) return '';
    str=String(str);
    var m=str.match(/^(.+?)\s+(?:vs\.?|v|x)\s+(.+?)(\s*[\(\[\|\-\u2013\u2014].*)?$/i);
    if(!m) return str;
    return side(m[1])+' vs '+side(m[2])+(m[3]&&!window.evIsLangTag(m[3])?m[3]:'');
  };
})();

;
(function(){try{window.__hsmEarly={};window.__hsmKick=function(){if(window.__hsmKicked)return;window.__hsmKicked=true;['movies','tvshows'].forEach(function(p){var u='https://vidapi.ru/'+p+'/latest/page-1.json',ac=window.AbortController?new AbortController():null,tm=ac?setTimeout(function(){ac.abort();},4500):0;window.__hsmEarly[p]=fetch(u,ac?{signal:ac.signal}:undefined).then(function(r){clearTimeout(tm);if(!r.ok)throw 0;return r.json();}).catch(function(){return null;});});};window.__hsmKick();window.addEventListener('sx:feeds-ready',function(){window.__hsmKick();});}catch(e){}})();
;

/* PERF: pause 1s+ interval timers while the tab is hidden; console.log off unless ?debug */
(function(){
  var si=window.setInterval;
  window.setInterval=function(fn,ms){
    if(typeof fn!=='function'||!(ms>=1000)) return si.apply(window,arguments);
    var a=Array.prototype.slice.call(arguments,2);
    return si.call(window,function(){ if(document.hidden) return; fn.apply(null,a); },ms);
  };
  if(!/[?&]debug\b/.test(location.search)) console.log=function(){};
})();

;

/* Mixed content: when this page is served over https, ask the browser to upgrade every
   http:// sub-request (images, iframes, player XHR/fetch, HLS/DASH segments) to https://
   instead of blocking it. On an http:// page nothing is changed, so http and https
   both keep working. */
(function(){ try { if (location.protocol === 'https:') {
  var m = document.createElement('meta'); m.httpEquiv = 'Content-Security-Policy'; m.content = 'upgrade-insecure-requests';
  document.head.appendChild(m);
} } catch(e){} })();

;

  // ↑↑↑  PASTE YOUR GOOGLE SHEETS ID ABOVE  ↑↑↑

/* Offline-first app shell: JS/CSS come from the service-worker cache (instant) after the first visit. */
(function(){
  if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol)) return;
  addEventListener('load',function(){ navigator.serviceWorker.register('/sw.js').catch(function(){}); });
})();

/* Section pages (/movies /tv /live): the home content sits hidden behind the full-screen section, so
   don't lay it out or paint it — thousands of fewer elements for the browser to style. Closing the section
   returns to home, which renders everything normally. */
(function(){
  if(!/^\/(movies|tv|live)(\.html)?\/?$/.test(location.pathname)) return;
  var st=document.createElement('style');
  st.textContent='#hero-section,#sxTabPanels,#sxs-home,.social-bar,body>footer{display:none!important}';
  document.head.appendChild(st);
})();

/* EVORA rotating loader messages: every circular section loader gets short, context-aware lines that change every ~2.4s */
(function(){
  var SETS = {
    movies:['Getting the best movies for you','Picking fresh releases','Lining up top-rated titles','Almost ready for movie night'],
    tv:['Finding binge-worthy shows','Loading the latest episodes','Gathering trending series','Setting up your watchlist'],
    live:['Tuning into live channels','Checking who is on air','Finding the clearest signals','Warming up your channels'],
    sports:['Getting high quality sports feeds','Finding live matches near kickoff','Syncing scores and servers','Lining up the best streams'],
    generic:['Getting things ready','Fetching the latest for you','Hang tight, almost there','Loading something good']
  };
  function ctx(el){
    var t='', n=el, i=0;
    while(n && n!==document.body && i++<6){ t+=' '+(n.id||'')+' '+(typeof n.className==='string'?n.className:''); n=n.parentElement; }
    t=t.toLowerCase();
    if(/movie|film|poster/.test(t)) return 'movies';
    if(/\btv\b|tvshow|series|show/.test(t)) return 'tv';
    if(/channel|live-?tv|epg|ch-/.test(t)) return 'live';
    if(/fixture|match|smo|fcx|sport|schedule|slide|hero|hsm|sxs/.test(t)) return 'sports';
    return 'generic';
  }
  function mk(host, abs){
    if(host.__evm) return; host.__evm=1;
    var set=SETS[ctx(host)]||SETS.generic, i=Math.floor(Math.random()*set.length);
    var d=document.createElement('div'); d.className='ev-msg'+(abs?' ev-msg-abs':''); d.textContent=set[i];
    host.appendChild(d);
    var iv=setInterval(function(){
      if(!d.isConnected){ clearInterval(iv); return; }
      d.style.opacity=0;
      setTimeout(function(){ i=(i+1)%set.length; d.textContent=set[i]; d.style.opacity=1; },260);
    },2400);
  }
  function scan(){
    try{
      document.querySelectorAll(':is(div,section,ul):not(.sk-row):has(> .sk), :is(div,section):has(> .sk-row), .mh-slide.mh-sk').forEach(function(h){ if(h.offsetParent!==null || h.classList.contains('mh-sk')) mk(h,true); });
      document.querySelectorAll('.ev-rl-wrap, .hsm-loading, .sxs-empty, .epg-no-results').forEach(function(h){ if(h.querySelector('.ev-rl')) mk(h,false); });
    }catch(e){}
  }
  function start(){ scan(); new MutationObserver(function(){ clearTimeout(start.t); start.t=setTimeout(scan,60); }).observe(document.documentElement,{childList:true,subtree:true}); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
