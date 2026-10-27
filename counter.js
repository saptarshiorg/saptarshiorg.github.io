/* EVORA - visitor counter. Uses EV_CONFIG.COUNTER_URL + COUNTER_KEY (see config.js). */
(function(){
  var C = window.EV_CONFIG || {};
  if (!C.COUNTER_URL) return;

  var st = document.createElement('style');
  st.textContent = '.ev-counter{display:inline-flex;align-items:center;gap:6px;font:600 12px/1 "Google Sans",system-ui,sans-serif;opacity:.8;white-space:nowrap}.ev-counter[hidden]{display:none}.ev-counter b{font-weight:800}';
  document.head.appendChild(st);

  function pick(d){
    if (d == null) return null;
    if (typeof d === 'number') return d;
    if (typeof d === 'string') { var m = d.match(/\d+/); return m ? +m[0] : null; }
    var keys = ['count','value','hits','total','views','visits','data','result'];
    for (var i = 0; i < keys.length; i++) {
      if (d[keys[i]] != null) { var r = pick(d[keys[i]]); if (r != null) return r; }
    }
    return null;
  }

  function run(){
    var box = document.getElementById('ev-counter'), n = document.getElementById('ev-counter-n');
    if (!box || !n) return;
    var url = C.COUNTER_URL + '?key=' + encodeURIComponent(C.COUNTER_KEY || 'evora');
    var cacheK = 'ev_counter_' + (C.COUNTER_KEY || 'evora'), cached = null;
    try { cached = sessionStorage.getItem(cacheK); } catch(e){}
    if (cached) { n.textContent = Number(cached).toLocaleString(); box.hidden = false; return; } /* already counted this session */
    fetch(url, { cache: 'no-store' })
      .then(function(r){ return r.text(); })
      .then(function(t){
        var d; try { d = JSON.parse(t); } catch(e){ d = t; }
        var v = pick(d);
        if (v == null) return;
        n.textContent = Number(v).toLocaleString(); box.hidden = false;
        try { sessionStorage.setItem(cacheK, String(v)); } catch(e){}
      })
      .catch(function(){ /* counter is non-essential; stay hidden */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
