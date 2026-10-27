
/* ══════════════════════════════════════════════════════════════════════
   SPORT DETECTOR — files every match under the right sport.
   Reads the category, the match/game name and any other text on the entry
   (league, event, tournament…). A sport keyword found ANYWHERE counts
   ("Wimbledon", "ATP", "tennis" → Tennis). Category text that is only a
   50%+ fuzzy match of a sport name ("Tenis", "Foot ball") also counts.
   Used by the Matches tab sport selector AND the "MORE MATCHES" rail.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var RAW = {
    'Cricket': ['cricket','ipl','bbl','psl','cpl','t20','t20i','odi','ranji','wpl','icc','the hundred','sa20','ilt20','lpl','bpl','wicket','test match','mumbai indians','chennai super kings','royal challengers','knight riders','sunrisers','rajasthan royals','gujarat titans','lucknow super giants','punjab kings'],
    'Football': ['football','soccer','association football','futsal','beach soccer','fifa','uefa','premier league','epl','la liga','laliga','bundesliga','serie a','ligue 1','mls','isl','i league','champions league','europa league','conference league','nations league','afc','caf','conmebol','copa america','copa libertadores','fa cup','carabao cup','asean cup','fc','cf','ea sports fc','efootball'],
    'American Football': ['american football','flag football','arena football','canadian football','nfl','ncaaf','super bowl','cfl'],
    'Australian Rules Football': ['australian rules football','australian rules','afl','aussie rules'],
    'Gaelic Football': ['gaelic football','gaa'],
    'Rugby': ['rugby','rugby union','rugby league','rugby sevens','six nations','super rugby','nrl'],
    'Baseball': ['baseball','mlb','npb','kbo','softball','t ball','tee ball','kickball','rounders','pesapallo','stoolball','lapta','brannboll'],
    'Basketball': ['basketball','3x3 basketball','nba','wnba','ncaab','euroleague','fiba','nbl'],
    'Netball': ['netball'],
    'Handball': ['handball','beach handball'],
    'Kabaddi': ['kabaddi','pkl','pro kabaddi'],
    'Kho Kho': ['kho kho','ultimate kho kho'],
    'Goalball': ['goalball'], 'Dodgeball': ['dodgeball'],
    'Tennis': ['tennis','real tennis','soft tennis','platform tennis','beach tennis','atp','wta','wimbledon','roland garros','french open','us open','australian open','grand slam','davis cup','billie jean king cup','itf','sky tennis'],
    'Table Tennis': ['table tennis','ping pong','wtt','ttfi','utt'],
    'Badminton': ['badminton','speed badminton','bwf','thomas cup','uber cup','sudirman cup'],
    'Squash': ['squash','racquetball','frontenis'],
    'Pickleball': ['pickleball'], 'Padel': ['padel'], 'Jai Alai': ['jai alai','pelota','basque pelota'],
    'Boxing': ['boxing','wbc','wba','ibf','wbo'],
    'Kickboxing': ['kickboxing','muay thai','muay boran','savate','lethwei','glory kickboxing'],
    'MMA': ['mma','ufc','bellator','pfl','one championship','cage warriors','pankration','sanda','krav maga'],
    'Wrestling': ['wrestling','freestyle wrestling','greco roman wrestling','beach wrestling','mongolian wrestling','wwe','aew','pwl','nxt','kushti','ssirum'],
    'Martial Arts': ['karate','judo','brazilian jiu jitsu','bjj','taekwondo','wushu','sambo','aikido','kendo','capoeira','hapkido','silat','kurash','gatka','silambam','thang ta','kalari','kalaripayattu','mallakhamb'],
    'Sumo': ['sumo'],
    'Fencing': ['fencing'],
    'Athletics': ['athletics','track and field','diamond league','sprinting','hurdles','steeplechase','relay','race walking','cross country running','trail running','ultra running','mountain running','high jump','long jump','triple jump','pole vault','shot put','discus','javelin','hammer throw','decathlon','heptathlon','pentathlon','marathon','half marathon'],
    'Swimming': ['swimming','open water swimming','finswimming','artistic swimming'],
    'Diving': ['diving','high diving'],
    'Water Polo': ['water polo','underwater hockey','underwater rugby'],
    'Surfing': ['surfing','bodyboarding','windsurfing','kitesurfing'],
    'Sailing': ['sailing'],
    'Rowing': ['rowing'],
    'Canoeing': ['canoeing','kayaking','rafting','dragon boat','dragon boat racing','stand up paddleboarding','sup','canoe sprint','canoe slalom'],
    'Powerboating': ['jet ski','powerboat racing','powerboating'],
    'Cycling': ['cycling','road cycling','track cycling','mountain biking','bmx','bmx racing','bmx freestyle','cyclocross','gravel cycling','downhill mountain biking','cycle speedway','artistic cycling','tour de france','giro d italia','vuelta','uci'],
    'Motorsport': ['motorsport','f1','f2','f3','formula 1','formula one','formula 2','formula 3','formula e','indycar','nascar','rally','rallycross','karting','motocross','supercross','motogp','moto gp','moto2','moto3','superbike','wsbk','speedway','endurance racing','drag racing','drifting','hill climb','off road racing','air racing','grand prix','wrc','le mans'],
    'Golf': ['golf','mini golf','disc golf','pga','lpga','liv golf','ryder cup','dp world tour'],
    'Archery': ['archery'], 'Darts': ['darts','pdc'],
    'Snooker': ['snooker','billiards','carom','pool billiards'],
    'Bowling': ['bowling','ten pin bowling','nine pin bowling','bocce','petanque','lawn bowls'],
    'Curling': ['curling'], 'Croquet': ['croquet'],
    'Horse Racing': ['horse racing','dressage','show jumping','eventing','horseball','equestrian','rodeo','barrel racing','reining','tent pegging','vaulting'],
    'Polo': ['polo'],
    'Climbing': ['climbing','sport climbing','bouldering','speed climbing','mountaineering','ice climbing'],
    'Skateboarding': ['skateboarding','inline skating','roller skating','parkour','freerunning'],
    'Skiing': ['skiing','alpine skiing','cross country skiing','freestyle skiing','ski jumping','speed skiing','biathlon','nordic combined'],
    'Snowboarding': ['snowboarding'],
    'Ice Skating': ['figure skating','speed skating','short track speed skating','short track','ice skating'],
    'Ice Hockey': ['ice hockey','nhl','khl','stanley cup','bandy'],
    'Hockey': ['hockey','field hockey','fih','hockey india league','hil'],
    'Sliding Sports': ['luge','bobsleigh','bobsled','skeleton racing','snowmobile racing'],
    'Air Sports': ['skydiving','base jumping','bungee jumping','paragliding','hang gliding','wingsuit flying','aeromodelling','drone racing','hot air ballooning','paramotoring','canopy piloting'],
    'Gymnastics': ['gymnastics','artistic gymnastics','rhythmic gymnastics','trampoline','aerobic gymnastics','acrobatic gymnastics','teamgym','cheerleading','dancesport','breakdancing'],
    'Sepak Takraw': ['sepak takraw','takraw'],
    'Yogasana': ['yogasana','yoga'],
    'Hurling': ['hurling','shinty','camogie'],
    'Buzkashi': ['buzkashi'],
    'Volleyball': ['volleyball','beach volleyball','vnl','prime volleyball','footvolley','frescobol'],
    'Chess': ['chess','fide','xiangqi','shogi','draughts','checkers','contract bridge','speedcubing'],
    'Esports': ['esports','e sports','valorant','csgo','cs2','counter strike','dota','dota 2','pubg','pubg mobile','bgmi','free fire','league of legends','fortnite','rocket league','overwatch','rainbow six','starcraft','warcraft','street fighter','tekken','mortal kombat','super smash bros','call of duty','mobile legends'],
    'Shooting': ['shooting','sport shooting','air rifle','air pistol','rifle shooting','pistol shooting','trap shooting','skeet shooting','sporting clays','practical shooting'],
    'Archery ': [],
    'Swimming ': []
  };
  delete RAW['Archery '];
  delete RAW['Swimming '];
  var GENERIC = /^(sports?|live|other|others|misc|general|various|more|events?|special events?)?$/i;
  function norm(s){ return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function flat(x){ return Array.isArray(x) ? x.map(flat).join(' ') : norm(x); }
  function lev(a, b){
    var m = a.length, n = b.length, i, j, d = [];
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    return d[m][n];
  }
  var SP = {};
  Object.keys(RAW).forEach(function(name){
    var kws = RAW[name].slice(); var nm = norm(name); if (kws.indexOf(nm) < 0) kws.push(nm);
    SP[name] = kws.map(function(k){
      k = norm(k);
      var re = new RegExp('(^| )' + k + (k.indexOf(' ') < 0 && k.length >= 5 ? '[a-z]*' : '') + '( |$)');
      return { k: k, re: re, len: k.length, single: k.indexOf(' ') < 0 };
    });
  });
  var NAMES = Object.keys(SP);

  function detect(cat, title, blob){
    var c = flat(cat), t = flat(title), b = flat(blob);
    if (GENERIC.test(c)) c = '';
    var srcs = [[c, 4, true], [t, 2, false], [b, 1, false]].filter(function(x){ return x[0]; });
    if (!srcs.length) return '';
    var best = '', bestScore = 0;
    // pass 1 — a sport keyword appears as a word anywhere
    NAMES.forEach(function(name){
      var total = 0;
      srcs.forEach(function(s){
        var hit = false, len = 0;
        SP[name].forEach(function(K){ if (K.re.test(s[0])){ hit = true; if (K.len > len) len = K.len; } });
        if (hit) total += s[1] + len / 1000;
      });
      if (total > bestScore){ bestScore = total; best = name; }
    });
    if (best) return best;
    // pass 2 — fuzzy: category text ≥50% like a sport name, other text ≥80%
    srcs.forEach(function(s){
      var need = s[2] ? 0.5 : 0.8;
      s[0].split(' ').forEach(function(tok){
        if (tok.length < 4) return;
        NAMES.forEach(function(name){
          SP[name].forEach(function(K){
            if (!K.single || K.len < 5 || K.k[0] !== tok[0]) return;
            var sim = 1 - lev(tok, K.k) / Math.max(tok.length, K.len);
            var sc = sim * s[1];
            if (sim >= need && sc > bestScore){ bestScore = sc; best = name; }
          });
        });
      });
    });
    return best;
  }
  window.sxDetectSport = detect;
  // Women's / under-age tag of a team or title: "India Women" and "India" are DIFFERENT teams.
  // League / legends tag of a team or title: "West Indies" and "West Indies Champions" are DIFFERENT teams
  // (so India v West Indies never merges with India Champions v West Indies Champions).
  window.sxLeagueTag = function(t){
    t = String(t == null ? '' : t).toLowerCase().replace(/champions\s+(league|trophy|cup)/g, ' ');
    var m = t.match(/\b(champions?|legends?|masters?)\b/g);
    return m ? m.map(function(x){ return x.replace(/s$/, ''); }).sort().join() : '';
  };
  // Generic "different squad / side" test for ANY two team names: India vs India A, Sri Lanka vs Sri Lanka A,
  // Brazil vs Brazil U20, Ireland vs Northern Ireland, Club vs Club II / Reserves / Academy ... are NOT the same team.
  window.sxTeamVariant = function(a, b){
    var tok = function(x){ return String(x == null ? '' : x).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean); };
    var Q = /^(a|b|c|d|ii|iii|iv|2|3|xi|u\d{2}|reserves?|academy|youth|juniors?|shaheens?|emerging|development)$/;
    var D = /^(north|northern|south|southern|east|eastern|west|western)$/;
    var ta = tok(a), tb = tok(b);
    if (!ta.length || !tb.length) return false;
    var qa = ta.filter(function(w){ return Q.test(w); }).sort().join(), qb = tb.filter(function(w){ return Q.test(w); }).sort().join();
    if (qa !== qb) return true;
    var sh = ta.length <= tb.length ? ta : tb, lo = ta.length <= tb.length ? tb : ta;
    if (sh.length < lo.length && sh.every(function(w){ return lo.indexOf(w) >= 0; })) {
      var extra = lo.filter(function(w){ return sh.indexOf(w) < 0; });
      if (extra.some(function(w){ return D.test(w); })) return true;
    }
    return false;
  };
  window.sxQual = function(t){
    t = String(t == null ? '' : t).toLowerCase(); var q = [];
    if (/\b(women'?s?|woman|ladies|girls)\b|\(w\)/.test(t)) q.push('w');
    var u = t.match(/\bu[- ]?(\d{2})\b/); if (u) q.push('u' + u[1]);
    return q.join();
  };

  // Same sport? ("Soccer" == "Football", "CRICKET" == "Cricket")
  function key(s){ var d = detect(s, '', ''); return d ? d.toLowerCase() : norm(s); }
  window.sxSameSport = function(a, b){ var x = key(a), y = key(b); return !!x && x === y; };

  // Every useful text field of an API entry (skips URLs / streams / logos).
  window.sxBlob = function(o){
    var out = [];
    (function w(x, d){
      if (x == null || d > 3 || out.length > 40) return;
      if (typeof x === 'string'){
        var s = x.trim();
        if (s && s.length <= 90 && !/^(https?:|\/\/)|\.(m3u8|mpd|png|jpe?g|webp|svg)/i.test(s)) out.push(s);
        return;
      }
      if (Array.isArray(x)){ x.slice(0, 10).forEach(function(y){ w(y, d + 1); }); return; }
      if (typeof x === 'object') Object.keys(x).forEach(function(k){
        if (/stream|server|channel|url|link|logo|flag|image|poster|thumb|icon|key|kid|license|token|drm|lang/i.test(k)) return;
        w(x[k], d + 1);
      });
    })(o, 0);
    return out.join(' | ');
  };

  // Sport of a MATCH CARDS sheet row. A blank / generic sport cell is filled
  // from the game name, team names and details; different spellings of the
  // same sport ("Soccer" / "Football") collapse into the first one seen.
  window._sxSheetSportSpell = {};
  window.sxSheetSport = function(c){
    var raw = String((c && (c.sport || c.sports)) || '').trim();
    var generic = GENERIC.test(raw);
    var teams = [c.team1_full_name, c.team2_full_name, c.team1_code, c.team2_code, c.details, c.tournament, c.btn_text];
    var det = generic ? detect('', [c.game], teams) : detect(raw, '', '');
    if (generic && !det) return 'Other';
    var k = (det || raw).toLowerCase();
    var map = window._sxSheetSportSpell;
    if (!map[k]) map[k] = generic ? det : raw;
    return map[k];
  };
})();

;

// Header scroll transparency effect
(function(){
  const header = document.querySelector('header');
  function updateHeaderScroll(){
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeaderScroll, {passive: true});
  updateHeaderScroll();
})();

;

(function(){
  // Device name: broad UA-based browser + OS/platform guess, including
  // Smart TV platforms (Tizen/WebOS/Android TV/Fire TV/Roku etc). Shown on
  // PC and TV navbars; hidden on phones/tablets (which keep the hamburger).
  // ---- OS / platform (used for both the label text and the logo icon) ----
  function osName(){
    var ua = navigator.userAgent || '';
    if (/Tizen/i.test(ua)) return 'Samsung TV';
    if (/Web[O0]S|LG Browser|NetCast/i.test(ua)) return 'LG TV';
    if (/GoogleTV|Google TV/i.test(ua)) return 'Google TV';
    if (/AFT|AmazonWebAppPlatform|Silk-Accelerated/i.test(ua)) return 'Fire TV';
    if (/Roku/i.test(ua)) return 'Roku';
    if (/Xbox/i.test(ua)) return 'Xbox';
    if (/PlayStation/i.test(ua)) return 'PlayStation';
    if (/Android.*(TV|BRAVIA|AFT)/i.test(ua) || /Android TV/i.test(ua)) return 'Android TV';
    if (/CrKey/i.test(ua)) return 'Chromecast';
    if (/CrOS/i.test(ua)) return 'Chrome OS';
    if (/Windows NT 10\.0/i.test(ua)) return 'Windows 10/11';
    if (/Windows NT 6\.3/i.test(ua)) return 'Windows 8.1';
    if (/Windows NT 6\.2/i.test(ua)) return 'Windows 8';
    if (/Windows NT 6\.1/i.test(ua)) return 'Windows 7';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'iPadOS';
    if (/iPhone|iPod/i.test(ua)) return 'iOS';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/CrOS|Linux/i.test(ua)) return 'Linux';
    return 'Unknown OS';
  }
  function browserName(){
    var ua = navigator.userAgent || '';
    var uaData = navigator.userAgentData;
    if (navigator.brave && typeof navigator.brave.isBrave === 'function') return 'Brave';
    if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
    if (/EdgA|EdgiOS|Edg\//i.test(ua)) return 'Edge';
    if (/OPR\/|Opera/i.test(ua)) return 'Opera';
    if (/YaBrowser/i.test(ua)) return 'Yandex';
    if (/Vivaldi/i.test(ua)) return 'Vivaldi';
    if (/UCBrowser/i.test(ua)) return 'UC Browser';
    if (/MiuiBrowser/i.test(ua)) return 'Mi Browser';
    if (/HeyTapBrowser/i.test(ua)) return 'OPPO Browser';
    if (/DuckDuckGo/i.test(ua)) return 'DuckDuckGo';
    if (/FxiOS/i.test(ua)) return 'Firefox';
    if (/CriOS/i.test(ua)) return 'Chrome';
    if (/Silk\//i.test(ua)) return 'Silk';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    if (/Chrome\//i.test(ua)) return 'Chrome';
    if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
    if (uaData && uaData.brands && uaData.brands.length) return uaData.brands[uaData.brands.length - 1].brand;
    return 'Browser';
  }
  function deviceName(){
    return browserName() + ' · ' + osName();
  }
  // ---- OS logo icon — simple, generic pictograms (not exact brand artwork) ----
  // used in place of a random device ID so people can see at a glance what
  // platform they're on, rather than a meaningless ID string.
  function osIconSvg(os){
    var W = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M3 5.5 11 4.3V11.4H3V5.5ZM12.2 4.1 21 2.8V11.4H12.2V4.1ZM3 12.6H11V19.7L3 18.5V12.6ZM12.2 12.6H21V21.2L12.2 20V12.6Z"/></svg>';
    var APPLE = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M16.365 1.43c0 1.14-.428 2.06-1.284 2.887-.94.9-2.024 1.41-3.106 1.32-.09-1.11.42-2.27 1.28-3.09.86-.83 2.15-1.35 3.11-1.117ZM20.6 17.06c-.42.98-.93 1.9-1.55 2.77-.83 1.17-1.51 1.98-2.03 2.43-.8.75-1.65 1.13-2.56 1.15-.65.01-1.44-.19-2.35-.6-.92-.4-1.76-.6-2.53-.6-.8 0-1.67.2-2.6.6-.94.41-1.7.63-2.29.65-.87.04-1.74-.35-2.6-1.16-.56-.5-1.28-1.34-2.15-2.55-.94-1.29-1.71-2.79-2.32-4.51-.65-1.85-.98-3.65-.98-5.39 0-1.99.43-3.71 1.29-5.15.85-1.43 1.98-2.32 3.4-2.65 1.02-.25 2.19.03 3.5.85.6.37 1.05.56 1.35.56.23 0 .74-.22 1.53-.66.87-.48 1.79-.72 2.75-.72.98.02 1.87.29 2.66.79-1.4.87-2.09 2.09-2.07 3.65.02 1.28.5 2.35 1.42 3.19.42.4.9.7 1.42.92-.11.34-.24.67-.38.98Z"/></svg>';
    var ANDROID = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M6.5 10v6a1 1 0 0 0 1 1h.5v3a1.2 1.2 0 0 0 2.4 0v-3h1.2v3a1.2 1.2 0 0 0 2.4 0v-3h.5a1 1 0 0 0 1-1v-6h-9ZM5.7 10a1.1 1.1 0 0 0-1.1 1.1v4.4a1.1 1.1 0 1 0 2.2 0v-4.4A1.1 1.1 0 0 0 5.7 10Zm12.6 0a1.1 1.1 0 0 0-1.1 1.1v4.4a1.1 1.1 0 1 0 2.2 0v-4.4a1.1 1.1 0 0 0-1.1-1.1ZM8.4 5.9 7.3 4.1a.35.35 0 0 1 .6-.37l1.14 1.86a5.9 5.9 0 0 1 4.9 0l1.15-1.86a.35.35 0 1 1 .6.37L14.6 5.9c1.72.94 2.9 2.63 3 4.6H5.4c.1-1.97 1.28-3.66 3-4.6ZM9 8a.6.6 0 1 0 0-1.2A.6.6 0 0 0 9 8Zm6 0a.6.6 0 1 0 0-1.2.6.6 0 0 0 0 1.2Z"/></svg>';
    var LINUX = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2.4c1.9 0 3 1.5 3 3.4 0 1.1-.3 1.7-.3 2.7 0 .5.2.9.6 1.5.9 1.3 2.4 3.1 2.4 5 0 1.5-.9 2.6-2.2 3.1.1.5.1 1 0 1.4-.2.9-1 1.6-2 1.7-.7.1-1.3-.1-1.8-.5-.4.3-.9.5-1.4.5-.5 0-1-.2-1.4-.5-.5.4-1.1.6-1.8.5-1-.1-1.8-.8-2-1.7-.1-.4-.1-.9 0-1.4-1.3-.5-2.2-1.6-2.2-3.1 0-1.9 1.5-3.7 2.4-5 .4-.6.6-1 .6-1.5 0-1-.3-1.6-.3-2.7 0-1.9 1.1-3.4 3-3.4Zm-1.6 3.5a.85.85 0 1 0 1.6.4.85.85 0 0 0-1.6-.4Zm3.2 0a.85.85 0 1 0 1.6.4.85.85 0 0 0-1.6-.4Z"/></svg>';
    var CHROMEOS = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/><path d="M12 3v5.6M6 16.8 3.6 20.9M18 16.8l2.4 4.1"/></svg>';
    var TV = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="5.5" width="19" height="12" rx="1.2"/><path d="M8.5 21h7M12 17.5V21"/></svg>';
    var XBOX = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M7 7c2 3 3 4.2 5 4.2S15 10 17 7M7 17c2-3 3-4.2 5-4.2S15 14 17 17"/></svg>';
    var PLAYSTATION = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 15.5V6.2c0-.9.9-1.5 1.7-1.1l1.6.7c.8.4 1.3 1.2 1.3 2.1v9.4M13.5 9.3l6 2.2c1 .4 1 1.8 0 2.1L14.8 15"/></svg>';
    var CAST = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M3 5.5v3a10 10 0 0 1 10 10h3A13 13 0 0 0 3 5.5ZM3 12v3a4 4 0 0 1 4 4h3a7 7 0 0 0-7-7Zm0 5.5v2.7h2.7A2.7 2.7 0 0 0 3 17.5Z"/></svg>';
    var UNKNOWN = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M9.3 9.3a2.7 2.7 0 1 1 3.9 2.4c-.8.4-1.2 1-1.2 1.9"/><circle cx="12" cy="16.7" r=".3" fill="currentColor"/></svg>';

    switch (os) {
      case 'Windows 10/11': case 'Windows 8.1': case 'Windows 8': case 'Windows 7': case 'Windows':
        return W;
      case 'macOS': case 'iOS': case 'iPadOS':
        return APPLE;
      case 'Android': case 'Android TV':
        return ANDROID;
      case 'Linux':
        return LINUX;
      case 'Chrome OS':
        return CHROMEOS;
      case 'Xbox':
        return XBOX;
      case 'PlayStation':
        return PLAYSTATION;
      case 'Chromecast':
        return CAST;
      case 'Samsung TV': case 'LG TV': case 'Google TV': case 'Fire TV': case 'Roku':
        return TV;
      default:
        return UNKNOWN;
    }
  }
  var nameEl = document.getElementById('nav-device-name');
  var idEl = document.getElementById('nav-device-id');
  var os = osName();
  if (nameEl) nameEl.textContent = browserName() + ' · ' + os;
  if (idEl) { idEl.innerHTML = osIconSvg(os); idEl.setAttribute('title', os); }
})();

;

function fpxLoad(card, url, name) {
  if (!url || url === '#') return;
  openStreamPlayer(url, name || 'Live Stream', 'channel');
}
function fpxSelectChange(sel) {
  const idx = sel.value;
  if (idx === '') return;
  const realCards = document.querySelectorAll('#fpx-grid .fpx-card:not(.fpx-empty-slot)');
  const card = realCards[idx];
  if (card) card.click();
  sel.selectedIndex = 0;
}

// ── FIFA WORLD CUP TOGGLE ──────────────────────────────────────────────
// The 2026 tournament is over. Flip this to true whenever FIFA (or the
// next World Cup) needs to come back — every nav entry point, the panel
// renderer, and the registry fail-safe below all read this one flag, so
// nothing else needs to change.
window.SX_FIFA_ENABLED = false;

// Hide every FIFA nav entry point (quick-nav item, tab-switcher strip
// button, mobile tab bar item) while the toggle above is off. Nothing
// here is deleted — re-showing it is just SX_FIFA_ENABLED = true.
document.addEventListener('DOMContentLoaded', () => {
  if (window.SX_FIFA_ENABLED) return;
  document.querySelectorAll('[data-sxtab="fifa"]').forEach(el => {
    el.style.display = 'none';
  });
});

// Mobile quick-strip layout fix: on the 2-column grid, if the number of
// currently VISIBLE buttons is odd, the last visible one spans the full
// width so it doesn't sit alone with an empty gap beside it. Recomputed
// on load/resize so it stays correct whether FIFA is shown or hidden.
function sxLayoutWatchStrip(){
  const strip = document.getElementById('watch-ch-strip');
  if (!strip) return;
  const btns = Array.from(strip.querySelectorAll('.wcs-btn'));
  btns.forEach(b => b.classList.remove('wcs-span-full'));
  const visible = btns.filter(b => getComputedStyle(b).display !== 'none');
  if (visible.length % 2 === 1) {
    visible[visible.length - 1].classList.add('wcs-span-full');
  }
}
document.addEventListener('DOMContentLoaded', sxLayoutWatchStrip);
window.addEventListener('resize', sxLayoutWatchStrip);

// ── FIFA panel: CMS-driven from its own "FIFA CHANNELS" sheet tab ──
window.renderFifaPanel = function(rows) {
  const grid = document.getElementById('fpx-grid');
  const countEl = document.getElementById('fpx-ch-count');
  if (!grid) return;
  const sorted = (rows||[]).slice().sort((a,b) => (parseFloat(a.sort_order)||0) - (parseFloat(b.sort_order)||0));
  const liveCount = sorted.filter(r => (r.coming_soon||'').toUpperCase() !== 'TRUE').length;
  if (countEl) countEl.textContent = liveCount + (liveCount === 1 ? ' CHANNEL' : ' CHANNELS');

  // Mobile row-pairing: walk sorted rows, pairing each 4K/diamond card with the
  // next non-diamond card into the same grid-row (col-4k left, col-hd right),
  // mirroring the original hand-curated layout. Solo/caze/coming-soon cards
  // outside a pair fall back to natural grid flow (no row/col class).
  let rowNum = 1;
  const cards = [];
  let i = 0;
  let inTail = false;
  while (i < sorted.length) {
    const r = sorted[i];
    const style = (r.style||'').toLowerCase();
    const isDiamondSolo = style === 'diamond-solo';
    const isDiamond = style === 'diamond' || isDiamondSolo;
    const isCaze = style === 'caze';

    if (isCaze) inTail = true;

    if (isDiamondSolo) { cards.push({row:r, rowNum:null, col:null}); i++; continue; }

    if (!inTail && isDiamond) {
      rowNum++;
      const next = sorted[i+1];
      const nextIsHD = next && !((next.style||'').toLowerCase().startsWith('diamond')) && (next.coming_soon||'').toUpperCase() !== 'TRUE' && (next.style||'').toLowerCase() !== 'caze';
      cards.push({row:r, rowNum, col:'4k'});
      if (nextIsHD) { cards.push({row:next, rowNum, col:'hd'}); i += 2; continue; }
      i++; continue;
    }
    // Lone HD-style card (including "coming soon" placeholders) with no preceding
    // diamond partner this round: pair with an empty slot, same as the original layout
    const looksLikeHDSlot = (r.quality_badge||'').toUpperCase() === 'HD' || (r.coming_soon||'').toUpperCase() === 'TRUE';
    if (!inTail && looksLikeHDSlot && !isDiamond) {
      rowNum++;
      cards.push({row:null, rowNum, col:'4k', empty:true});
      cards.push({row:r, rowNum, col:'hd'});
      i++; continue;
    }
    // Everything else (caze, coming-soon, misc): natural flow, shared trailing row
    cards.push({row:r, rowNum:'tail', col:null});
    i++;
  }

  grid.innerHTML = cards.map(({row:r, rowNum, col, empty}) => {
    if (empty) return `<div class="fpx-card fpx-empty-slot fpx-row-${rowNum}" aria-hidden="true"><span class="fpx-empty-lbl">Empty</span></div>`;

    const isComingSoon = (r.coming_soon||'').toUpperCase() === 'TRUE';
    const style = (r.style||'').toLowerCase();
    const isDiamondSolo = style === 'diamond-solo';
    const isDiamond = style === 'diamond' || isDiamondSolo;
    const isCaze = style === 'caze';
    const badge = (r.quality_badge||'').toUpperCase();
    const is4K = badge === '4K';

    let cardCls = 'fpx-card';
    if (isDiamondSolo) cardCls += ' fpx-diamond fpx-sx-solo';
    else if (isDiamond) cardCls += ' fpx-diamond';
    if (col === '4k') cardCls += ' fpx-col-4k';
    if (col === 'hd') cardCls += ' fpx-col-hd';
    if (rowNum && rowNum !== 'tail') cardCls += ` fpx-row-${rowNum}`;
    if (rowNum === 'tail') cardCls += ' fpx-row-8';
    if (isComingSoon) cardCls += ' fpx-coming-soon';

    const cazeStyle = isCaze ? ' style="background:linear-gradient(135deg,rgba(80,60,10,0.55),rgba(40,30,0,0.85));border-color:rgba(157,107,255,0.5);box-shadow:0 0 14px rgba(157,107,255,0.18);"' : '';
    const safeName = (r.channel_name||'').replace(/'/g,"\\'");
    const watchUrl = r.watch_url || ('https://saptarshixtrasports.pages.dev/india/' + (r.channel_name||'').toLowerCase().replace(/[^a-z0-9]+/g,''));
    const onclick = isComingSoon ? '' : ` onclick="fpxLoad(this,'${watchUrl}','${safeName}')"`;
    const badgeImg = is4K ? `<img loading=lazy decoding=async class="fpx-4k-badge-big" src="https://png.pngtree.com/png-vector/20221016/ourmid/pngtree-4k-ultra-hd-icon-badges-png-image_6345247.png" alt="4K Ultra HD">` : '';
    const liveDot = isComingSoon ? '' : '<div class="fpx-live-dot"></div>';
    const subLabel = r.sub_label ? `<div class="fpx-sub-label">${r.sub_label}</div>` : '';
    const flag = r.flag_emoji ? `<span class="fpx-premium"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${r.flag_emoji}</span>` : '';

    let meta;
    if (isComingSoon) {
      meta = '<span class="fpx-pill-soon">SOON</span>';
    } else if (flag) {
      meta = `<div class="fpx-meta">${flag}</div>`;
    } else if (is4K) {
      meta = `<div class="fpx-meta"><span class="fpx-pill fpx-pill-4k">4K</span><span class="fpx-free4k-lbl">${r.sub_label||'Live'}</span></div>`;
    } else if (badge === 'HD') {
      meta = `<div class="fpx-meta"><span class="fpx-pill">HD</span><span class="fpx-live-lbl">Live</span></div>`;
    } else {
      meta = '';
    }
    const nameStyle = isComingSoon ? ' style="opacity:.5;"' : '';
    const overlay = isComingSoon ? '<div class="fpx-soon-overlay"><span>COMING SOON</span></div>' : '<div class="fpx-thumb-ov"></div>';

    return `<div class="${cardCls}"${cazeStyle}${onclick} title="${isComingSoon?'Coming Soon':''}">
      <div class="fpx-thumb-wrap">
        <img loading=lazy decoding=async class="fpx-thumb" src="${r.icon_url||''}" alt="${r.channel_name||''}" onerror="this.src='https://via.placeholder.com/320x180/0a1830/fce8f5?text=${encodeURIComponent(r.channel_name||'')}'">
        ${badgeImg}
        ${overlay}
        ${liveDot}
      </div>
      <div class="fpx-body">
        <div class="fpx-name"${nameStyle}>${r.channel_name||''}</div>
        ${subLabel}
        ${meta}
      </div>
    </div>`;
  }).join('');

  const selectEl = document.getElementById('fpx-ch-select');
  if (selectEl) {
    const realCards = Array.from(grid.querySelectorAll('.fpx-card:not(.fpx-empty-slot)'));
    selectEl.innerHTML = '<option value="">Jump to channel…</option>' +
      realCards.map((c, i) => {
        const nm = (c.querySelector('.fpx-name') || {}).textContent || ('Channel ' + (i + 1));
        const soon = c.classList.contains('fpx-coming-soon');
        return `<option value="${i}"${soon ? ' disabled' : ''}>${nm}${soon ? ' (Soon)' : ''}</option>`;
      }).join('');
  }
};

// ── PANELS registry: lets panels (FIFA, future ones) be added,
// removed, or hidden from a sheet without touching this code. Each active
// row's tab_name sheet is fetched and routed by panel_id to its renderer.
window._panelRenderers = {
  fifa: window.renderFifaPanel
};

async function renderPanelsFromRegistry(panelRows) {
  // Fail-safe default: if the PANELS tab doesn't exist yet (fetch returned
  // null/empty), assume FIFA is active so the site doesn't break before
  // this tab is set up.
  const usingDefault = !panelRows || !panelRows.length;
  const rows = (usingDefault
    ? [
        {panel_id:'fifa', tab_name:'FIFA CHANNELS', active_true_false: window.SX_FIFA_ENABLED ? 'TRUE' : 'FALSE'}
      ]
    : panelRows.filter(r => (r.active_true_false||'').toUpperCase() !== 'FALSE')
  ).filter(r => (r.panel_id||'').toLowerCase() !== 'fifa' || window.SX_FIFA_ENABLED);

  for (const p of rows) {
    const renderer = window._panelRenderers[(p.panel_id||'').toLowerCase()];
    const wrapEl = document.getElementById((p.panel_id||'') + '-panel-wrap');
    if (wrapEl) wrapEl.style.display = '';
    if (!renderer || !p.tab_name) continue;
    try {
      const data = await fetchSheet(p.tab_name);
      renderer(active(data || []));
    } catch (e) {
      console.warn('Panel fetch failed for', p.tab_name, e);
    }
  }
  // Hide panel wrappers for any registered-but-inactive / unregistered panel ids
  Object.keys(window._panelRenderers).forEach(id => {
    const isActive = rows.some(r => (r.panel_id||'').toLowerCase() === id);
    if (!isActive) {
      const wrapEl = document.getElementById(id + '-panel-wrap');
      if (wrapEl) wrapEl.style.display = 'none';
    }
  });
}

;

// Tab-specific hero content — swapped into the real hero-slide (not an extra banner),
// desktop/PC only. "matches" intentionally has no entry: that tab shows the normal
// CMS-driven hero carousel untouched.
const SX_TAB_HERO = {
  fifa:   { bg:'https://i.postimg.cc/qRN055zQ/Chat-GPT-Image-Jul-5-2026-09-57-55-AM.png',
            title:'FIFA World Cup',
            sub:'Every match of the FIFA World Cup 2026, live in HD — group stage to the final.' }
  // "livetv" intentionally has no entry: that tab shows NO hero at all
  // (see sxUpdateHeroOverride — the whole hero-section is hidden instead).
};
window.__sxCurrentTab = 'matches';

function sxIsDesktop(){
  return window.matchMedia && window.matchMedia('(min-width:901px)').matches;
}

function sxUpdateHeroOverride(name){
  const ov = document.getElementById('sxHeroOverride');
  const heroSection = document.getElementById('hero-section');

  // Live TV is a fully separate tab: no hero, no slides, no custom banner —
  // just the Live TV panel content on its own.
  if (name === 'livetv') {
    if (heroSection) heroSection.classList.add('sx-hero-fully-hidden');
    if (ov) ov.classList.remove('active');
    if (typeof slideInterval !== 'undefined') clearInterval(slideInterval);
    return;
  }
  if (heroSection) heroSection.classList.remove('sx-hero-fully-hidden');

  if (!ov) return;
  const data = SX_TAB_HERO[name];

  if (data && sxIsDesktop()) {
    const bg = document.getElementById('sxHeroOverrideBg');
    const t  = document.getElementById('sxHeroOverrideTitle');
    const s  = document.getElementById('sxHeroOverrideSub');
    if (bg) bg.style.backgroundImage = `url('${data.bg}')`;
    if (t)  t.textContent = data.title;
    if (s)  s.textContent = data.sub;
    ov.classList.add('active');
    if (typeof slideInterval !== 'undefined') clearInterval(slideInterval);
  } else {
    ov.classList.remove('active');
    if (typeof goSlide === 'function' && typeof currentSlide !== 'undefined') {
      goSlide(currentSlide);
      if (typeof startSlider === 'function') startSlider();
    }
  }
}

// Re-check the hero override if the viewport crosses the desktop breakpoint
// (e.g. rotating a tablet, resizing a browser window).
let sxResizeT;
window.addEventListener('resize', () => {
  clearTimeout(sxResizeT);
  sxResizeT = setTimeout(() => sxUpdateHeroOverride(window.__sxCurrentTab), 150);
});

// ── Cross-section nav bar: tapping any bottom-tab / quick-strip button now
//    closes whichever full-screen section overlay is currently open before
//    opening the new one, so switching sections never needs the old Back
//    button first. Each open*() below calls this once, right at the start.
//    FanCode / Prime / Willow stay outside this: they're plain embed pages,
//    keep their own in-page Back button, and sit above the nav bar (so the
//    nav bar isn't shown while inside them).
function sxCloseAllOverlays(){
  const ids = ['livetv-overlay','movies-overlay','fifa-overlay','ott-overlay','fancode-overlay','prime-overlay','willow-overlay','adminchat-overlay','sx-search-overlay','sx-fav-overlay'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
  const mp = document.getElementById('matches-panel');
  if (mp) mp.classList.remove('active');
  sxHeaderHome();
}
window.sxCloseAllOverlays = sxCloseAllOverlays;

// ── Every full-screen overlay in the site (section pages + modals), all of
//    which show/hide purely via the .open class. Home uses this full list
//    (sxCloseAllOverlays above only covers the "section" pages) so that no
//    matter which page or popup is on screen, tapping Home tears every one
//    of them down — nothing is left stacked above the home page's z-index.
const SX_ALL_OVERLAY_IDS = [
  'livetv-overlay','movies-overlay','fifa-overlay','ott-overlay','fancode-overlay',
  'prime-overlay','willow-overlay','vip-overlay',
  'stream-player-overlay','adminchat-overlay','adminchat-discord-popup',
  'va-tv-modal','sx-cast-help-overlay','dmca-overlay','sx-search-overlay','sx-fav-overlay'
];
function goHome(){
  SX_ALL_OVERLAY_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
  sxHeaderHome();
  document.body.style.overflow = '';
  window.__sxCurrentTab = null;
  document.querySelectorAll('.sx-tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'home'));
  if (window.__mtabSetActive) window.__mtabSetActive(null);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.goHome = goHome;

// ══════════════════════════════════════════════════════════════════════
// GLOBAL NAV BAR — relocated (not cloned) into whichever in-site "page"
// overlay is currently open, so the same header (logo/nav/VIP/login)
// always sits pinned at the very top of Live TV, Movies, FIFA and the
// VIP page. Deliberately NOT used for the stream player, FanCode,
// Prime Video or Willow OTT overlays — those stay full-bleed/immersive.
// ══════════════════════════════════════════════════════════════════════
const SX_HEADER_TOPBARS = ['livetv-topbar','movies-topbar','fifa-topbar'];
function sxHeaderHome(){
  const header = document.querySelector('header');
  const anchor = document.getElementById('sx-header-anchor');
  if (!header || !anchor) return;
  if (header.nextSibling !== anchor) anchor.parentNode.insertBefore(header, anchor);
  SX_HEADER_TOPBARS.forEach(id => {
    const tb = document.getElementById(id);
    if (tb) tb.style.top = '';
  });
}
function sxHeaderInto(containerId, topbarId){
  sxHeaderHome();
  const header = document.querySelector('header');
  const container = document.getElementById(containerId);
  if (!header || !container) return;
  container.insertBefore(header, container.firstChild);
  const topbar = topbarId ? document.getElementById(topbarId) : null;
  function sync(){ if (topbar) topbar.style.top = header.offsetHeight + 'px'; }
  sync();
  requestAnimationFrame(sync);
  setTimeout(sync, 300);
}
window.addEventListener('resize', function(){
  const header = document.querySelector('header');
  if (!header) return;
  SX_HEADER_TOPBARS.forEach(id => {
    const tb = document.getElementById(id);
    if (tb && tb.style.top) tb.style.top = header.offsetHeight + 'px';
  });
});

function sxSwitchTab(name){
  if (name === 'matches') { openMatches(); return; }
  if (name === 'ott') { openOTT(); return; }
  if (name === 'fancode') { openFanCode(); return; }
  if (name === 'prime') { openPrime(); return; }
  if (name === 'willow') { openWillow(); return; }
  if (name === 'fifa') { openFifa(); return; }
}
window.sxSwitchTab = sxSwitchTab;

// ══════════════════════════════════════════════════════════════════════
// FAVOURITES — heart button on any channel card saves it here
// (localStorage, survives reloads). Favourites is channels-only — no
// match/team/sport favouriting. SEARCH — one box that filters both
// MATCH CARDS and LIVE CHANNELS together (search still covers matches;
// only favouriting is channels-only).
// ══════════════════════════════════════════════════════════════════════
const SX_FAV_KEY = 'sx_favourites_v1';
function sxLoadFavs(){
  try { const v = JSON.parse(localStorage.getItem(SX_FAV_KEY)); return v && v.channels ? v : {channels:{}}; }
  catch(e){ return {channels:{}}; }
}
function sxSaveFavs(favs){ try { localStorage.setItem(SX_FAV_KEY, JSON.stringify(favs)); } catch(e){} }
function sxIsFav(type, key){ const f = sxLoadFavs(); return !!(f[type] && f[type][key]); }
function sxChanFavKey(c){ return (c.channel_name||'').toLowerCase().trim(); }
window.sxChanFavKey = sxChanFavKey;

// Safely round-trips a data object through an HTML attribute (base64 of a
// UTF-8 JSON string) — sidesteps every quote-escaping issue that comes
// from embedding a whole match/channel row inside an onclick="" string.
function sxEncPayload(obj){ try { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); } catch(e){ return ''; } }
function sxDecPayload(str){ try { return JSON.parse(decodeURIComponent(escape(atob(str)))); } catch(e){ return null; } }

function sxHeartBtnHtml(type, key, rowObj){
  const active = sxIsFav(type, key) ? ' is-fav' : '';
  const enc = sxEncPayload(rowObj);
  return `<button type="button" class="sx-heart-btn${active}" data-fav-type="${type}" data-fav-key="${escJs(key)}" onclick="event.stopPropagation();event.preventDefault();sxToggleFav('${type}','${escJs(key)}','${enc}');" aria-label="Favourite"><svg viewBox="0 0 24 24"><path d="M12 21s-6.7-4.35-9.33-8.2C1.02 10.28 1.7 6.86 4.6 5.3c2.2-1.18 4.6-.5 6 1.2.4.48.75 1 1.4 1 .65 0 1-.52 1.4-1 1.4-1.7 3.8-2.38 6-1.2 2.9 1.56 3.58 4.98 1.93 7.5C18.7 16.65 12 21 12 21z"/></svg></button>`;
}
window.sxHeartBtnHtml = sxHeartBtnHtml;

function sxToggleFav(type, key, enc){
  const favs = sxLoadFavs();
  if (!favs[type]) favs[type] = {};
  if (favs[type][key]) {
    delete favs[type][key];
  } else {
    const payload = sxDecPayload(enc);
    if (payload) favs[type][key] = payload;
  }
  sxSaveFavs(favs);
  const nowFav = !!favs[type][key];
  document.querySelectorAll('.sx-heart-btn[data-fav-type="'+type+'"]').forEach(b => {
    if (b.getAttribute('data-fav-key') === key) b.classList.toggle('is-fav', nowFav);
  });
  const favOverlay = document.getElementById('sx-fav-overlay');
  if (favOverlay && favOverlay.classList.contains('open') && typeof sxRenderFavouritesOverlay === 'function') sxRenderFavouritesOverlay();
}
window.sxToggleFav = sxToggleFav;

// Builds one full clickable channel row (thumb/meta/badges/watch + heart),
// reused by the Live TV browser, Search results and the Favourites page.
function sxChannelRowOuterHtml(c, favKeyOverride){
  const isLive = (c.status_live_off||'').toUpperCase() === 'LIVE';
  const grp = c.group || 'Other';
  const rowClassMap = {'FanCode':'fancode-row','Star Sports':'star-row','Sony Sports':'sony-row','fox':'fox-row','International':'intl-row','ZEE':'zee-row','News':'news-row','sky':'sky-row','espn':'espn-row','tnt':'tnt-row','willow':'willow-row'};
  let rowClass = 'epg-row' + (rowClassMap[grp] ? ' '+rowClassMap[grp] : '');
  const streamUrl = c.watch_url || '#';
  const isRawStream = (typeof sxIsRawStreamUrl === 'function') && sxIsRawStreamUrl(streamUrl);
  if (isRawStream) rowClass += ' epg-row-raw-stream';
  const playEnc = sxEncPayload({url: streamUrl, name: c.channel_name || 'Live Stream', raw: !!isRawStream});
  const isHD = (c.quality||'').toUpperCase() === 'HD' || (c.quality||'').toUpperCase() === '4K';
  const hdBadge = isHD ? `<span class="epg-badge epg-badge-hd">${(c.quality||'HD').toUpperCase()}</span>` : '';
  const liveBadge = isLive
    ? '<span class="epg-badge epg-badge-live"><span class="epg-live-blip"></span>LIVE</span>'
    : '<span class="epg-badge epg-badge-off">OFF AIR</span>';
  const premiumBadge = grp === 'FanCode' ? '<span class="epg-premium-icon" title="FanCode Premium"></span>' : '';
  const vlcBadge = isRawStream ? '<img loading=lazy decoding=async class="epg-vlc-icon" src="https://images.icon-icons.com/1381/PNG/512/vlc_93519.png" alt="VLC" title="Direct stream \u2014 plays in VLC" onerror="this.style.display=\'none\'">' : '';
  const indiaAlert = (grp === 'Star Sports' || grp === 'Sony Sports' || grp === 'ZEE') ? '<div class="epg-india-alert">Outside India/Sri Lanka? Use VPN</div>' : '';
  const favKey = favKeyOverride || sxChanFavKey(c);
  const flagHtml = (typeof countryFlagHTML === 'function') ? countryFlagHTML(c.country) : '';
  const logoHtml = (typeof window.chLogoHTML === 'function') ? window.chLogoHTML(c) : `<div class="epg-logo-box"><img loading=lazy decoding=async src="${c.icon_url||''}" alt=""></div>`;
  return `
    <div class="${rowClass}" role="button" tabindex="0" onclick="sxOpenChannelPayload('${playEnc}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();sxOpenChannelPayload('${playEnc}');}">
      <div class="epg-thumb">
        ${flagHtml}
        ${logoHtml}
        ${sxHeartBtnHtml('channels', favKey, c)}
      </div>
      <div class="epg-meta">
        <div class="epg-group-tag">${grp}</div>
        <div class="epg-name-row">
          <div class="epg-name">${c.channel_name||''}${premiumBadge}</div>
          <span class="epg-free-badge">FREE</span>
        </div>
        ${indiaAlert}
        <div class="epg-desc">Watch endless programming on this 24/7 channel broadcast.</div>
        <div class="epg-now">24/7 Channel</div>
      </div>
      <div class="epg-badges">${liveBadge}${hdBadge}${vlcBadge}</div>
      <div class="epg-watch">
        <span>Watch</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </div>`;
}
window.sxChannelRowOuterHtml = sxChannelRowOuterHtml;

function sxOpenChannelPayload(enc){
  const p = sxDecPayload(enc);
  if (!p) return;
  if (p.raw && typeof sxOpenVlcPopup === 'function') sxOpenVlcPopup(p.url, p.name);
  else if (typeof openStreamPlayer === 'function') openStreamPlayer(p.url, p.name, 'channel');
}
window.sxOpenChannelPayload = sxOpenChannelPayload;

// Builds one match card (thumb/body), reused by Search results. Favourites
// is channels-only, so match cards never show a heart/favourite button.
function sxMatchCardHtml(c){
  const teamsLine = `${c.team1_full_name||c.team1_code||''} vs ${c.team2_full_name||c.team2_code||''}`;
  const isLive = (typeof matchStatusText === 'function') && matchStatusText(c).toLowerCase() === 'live';
  const isFinished = (typeof isMatchFinished === 'function') && isMatchFinished(c);
  const badge = isLive
    ? '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span>'
    : isFinished ? '<span class="fx2-badge">FINISHED</span>' : '<span class="fx2-badge">⏰ UPCOMING</span>';
  const bannerSrc = c.banner_url || c.banner_image_url || c._fcxBanner || '';
  const thumbInner = bannerSrc
    ? `<img loading=lazy decoding=async src="${bannerSrc}" alt="" class="fx2-thumb-img" onerror="this.style.display='none'">`
    : `<div class="fx2-thumb-teams">
        <div class="fx2-thumb-team">${img(c.team1_icon_url,c.team1_code||'','')}</div>
        <div class="fx2-thumb-vs">VS</div>
        <div class="fx2-thumb-team">${img(c.team2_icon_url,c.team2_code||'','')}</div>
      </div>`;
  return `
  <div class="smo-card fx2-card">
    <div class="fx2-thumb">
      ${thumbInner}
      ${badge}
    </div>
    <div class="fx2-body">
      <div class="fx2-title-row">
        <div class="fx2-title">${teamsLine}</div>
        <span class="fx2-free">FREE</span>
      </div>
      <div class="fx2-meta">
        <span class="fx2-tag">${c.game||''}</span>
        <span class="fx2-date">${(typeof smoCardDateLabel==='function')?smoCardDateLabel(c):''}</span>
      </div>
      ${(typeof sxWatchBtnHtml==='function')?sxWatchBtnHtml(c,'smo-btn'):''}
    </div>
  </div>`;
}
window.sxMatchCardHtml = sxMatchCardHtml;

// Same visual card, wired for a FanCode match object ({id,title,tournament,
// category,image,status,time} — see window._fcxMatchesCache) instead of a
// sheet MATCH CARDS row, so FanCode-only fixtures can appear in Search too.
function sxFcxMatchCardHtml(m){
  const isLive = m.status === 'LIVE';
  const isCompleted = m.status === 'COMPLETED';
  const badge = isLive
    ? '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span>'
    : isCompleted ? '<span class="fx2-badge">FINISHED</span>' : '<span class="fx2-badge">⏰ UPCOMING</span>';
  return `
  <div class="smo-card fx2-card">
    <div class="fx2-thumb">
      <img loading=lazy decoding=async src="${m.image||''}" alt="" class="fx2-thumb-img" onerror="this.style.display='none'">
      ${badge}
    </div>
    <div class="fx2-body">
      <div class="fx2-title-row">
        <div class="fx2-title">${m.title||''}</div>
        <span class="fx2-free">FREE</span>
      </div>
      <div class="fx2-meta">
        <span class="fx2-tag">${m.tournament||m.category||'FanCode'}</span>
      </div>
      ${(typeof fcxWatchBtnHtml === 'function') ? fcxWatchBtnHtml(m,'smo-btn') : ''}
    </div>
  </div>`;
}
window.sxFcxMatchCardHtml = sxFcxMatchCardHtml;

// ── Search: filters MATCH CARDS + LIVE CHANNELS together ──
let SX_SEARCH_FILTER = 'all';
function openSxSearch(){
  sxCloseAllOverlays();
  document.getElementById('sx-search-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'search'));
  sxHeaderInto('sx-search-overlay', null);
  SX_SEARCH_FILTER = 'all';
  document.querySelectorAll('#sx-search-chips .sx-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === 'all'));
  const inp = document.getElementById('sx-search-input');
  if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 60); }
  const bar = document.querySelector('.sx-search-bar');
  if (bar) bar.classList.remove('has-text');
  sxRunSearch('');
  try{ if (typeof window.vaInit === 'function'){ window.vaInit(); window.vaInit = null; } }catch(e){}
  try{ ['movie','tv'].forEach(function(t){ if (window.vaPools && !vaPools[t].all.length && !vaPools[t].loading && typeof vaBulkPreload==='function') vaBulkPreload(t); }); }catch(e){}
}
function closeSxSearch(){
  document.getElementById('sx-search-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
}
window.openSxSearch = openSxSearch;
window.closeSxSearch = closeSxSearch;

function sxSetSearchFilter(f){
  SX_SEARCH_FILTER = f;
  document.querySelectorAll('#sx-search-chips .sx-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === f));
  const inp = document.getElementById('sx-search-input');
  sxRunSearch(inp ? inp.value : '');
}
window.sxSetSearchFilter = sxSetSearchFilter;

function sxClearSearch(){
  const inp = document.getElementById('sx-search-input');
  if (inp) { inp.value = ''; inp.focus(); }
  const bar = document.querySelector('.sx-search-bar');
  if (bar) bar.classList.remove('has-text');
  sxRunSearch('');
}
window.sxClearSearch = sxClearSearch;

// ── Fuzzy / "nearly-equal" search helpers ──────────────────────────
// Lets a search for "India vs Australia", "india v australia", a partial
// name, or even a small typo ("austrailia") still find the right matches
// and channels, instead of requiring an exact substring of the whole query.
function sxLevenshtein(a, b) {
  a = a || ''; b = b || '';
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]; dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = a[i-1] === b[j-1] ? prev : 1 + Math.min(prev, dp[j], dp[j-1]);
      prev = tmp;
    }
  }
  return dp[n];
}
// Splits a query into keyword tokens, treating "vs"/"v"/"versus" (and
// commas/&) as separators — so "India vs Australia" is read as two team
// keywords rather than one literal phrase that has to match verbatim.
function sxSearchTokens(q) {
  // Split on vs/v/versus/,/& first, then split each part into words so word
  // ORDER no longer matters ("sports star" finds "Star Sports"). Every word
  // must still match somewhere, so multi-word queries stay precise.
  const out = [];
  (q || '').toLowerCase()
    .split(/\s+vs\.?\s+|\s+v\s+|\s+versus\s+|,|&/g)
    .forEach(part => part.split(/\s+/).forEach(w => {
      w = w.replace(/[^\p{L}\p{N}]+/gu, '');
      if (w) out.push(w);
    }));
  // filler words ("the", "of", "live"...) would now match almost everything, so drop them when real words remain
  const real = out.filter(w => !SX_STOP.has(w));
  return real.length ? real : out;
}
window.sxSearchTokens = sxSearchTokens;
// ── RELATED search ──────────────────────────────────────────────
// Words that mean (almost) the same thing, so "soccer" also finds football,
// "film" finds movies, "ipl" finds Indian Premier League, etc.
const SX_STOP = new Set(['the','of','a','an','in','on','at','and','or','for','to','is','vs','v','live','watch','online','free','full','match','matches','today','hd']);
const SX_ALIAS = (function(){
  const groups = [
    ['football','soccer','fifa','futbol'],['movie','movies','film','films','cinema'],['tv','television','show','shows','series','serial'],
    ['cricket','ipl','odi','t20','test','bbl','psl','wpl','cpl','icc'],['ipl','indian premier league'],['bbl','big bash'],['epl','premier league','english premier league'],
    ['ucl','champions league','uefa'],['wc','world cup','worldcup'],['f1','formula 1','formula one','formula','grand prix','motorsport','racing'],
    ['mma','ufc','fight','fighting','boxing'],['wwe','wrestling','smackdown','raw'],['nba','basketball'],['nfl','american football'],['mlb','baseball'],
    ['nhl','ice hockey','hockey'],['kabaddi','pkl'],['badminton','bwf','shuttle'],['tennis','atp','wta','wimbledon','grand slam'],
    ['news','headlines'],['music','songs','song'],['kids','cartoon','cartoons','animation','animated','children'],['sports','sport','games'],
    ['india','ind','indian'],['australia','aus','australian'],['england','eng','english'],['pakistan','pak','pakistani'],['bangladesh','ban'],['srilanka','sri lanka','sl'],
    ['southafrica','south africa','rsa'],['newzealand','new zealand','nz'],['westindies','west indies','wi'],['afghanistan','afg'],['usa','america','american','us']
  ];
  const m = {};
  groups.forEach(g => g.forEach(w => { (m[w] = m[w] || new Set()); g.forEach(x => { if (x !== w) m[w].add(x); }); }));
  return m;
})();
function sxTokenVariants(token){
  const out = [token];
  const al = SX_ALIAS[token];
  if (al) al.forEach(x => out.push(x));
  // plural / suffix forms: "movies"->"movie", "cricketers"->"cricketer"
  if (token.length > 4 && /s$/.test(token)) out.push(token.slice(0, -1));
  return out;
}
const SX_WORD_RE = /[^\p{L}\p{N}]+/u;
// Score one keyword against one field: 3 = starts a word, 2 = appears inside,
// 1 = RELATED (alias / same word-stem / small typo / run-together words), 0 = unrelated.
function sxTokenFieldScore(token, text) {
  if (!token || !text) return 0;
  const hay = String(text).toLowerCase();
  const words = hay.split(SX_WORD_RE).filter(Boolean);
  let best = 0;
  const variants = sxTokenVariants(token);
  for (let vi = 0; vi < variants.length; vi++){
    const v = variants[vi], isMain = vi === 0;
    if (hay.includes(v)){
      const sc = words.some(w => w.startsWith(v)) ? 3 : 2;
      best = Math.max(best, isMain ? sc : 2);
      if (best === 3) return 3;
      continue;
    }
    if (isMain && v.length >= 4){
      // words run together / split differently: "supercup" ~ "super cup"
      if (hay.replace(SX_WORD_RE, '').includes(v)) best = Math.max(best, 2);
      for (let i = 0; i < words.length; i++){
        const w = words[i];
        if (w.length < 3) continue;
        // same stem: "cricketer" ~ "cricket", "football" ~ "footballer"
        if (w.length >= 4 && (v.includes(w) || w.includes(v))) { best = Math.max(best, 1); continue; }
        let k = 0; const mx = Math.min(v.length, w.length);
        while (k < mx && v[k] === w[k]) k++;
        if (k >= 4 && k >= Math.min(v.length, w.length) - 2) { best = Math.max(best, 1); continue; }
        // typo tolerance
        if (Math.abs(v.length - w.length) <= 2){
          const tol = v.length >= 7 ? 2 : 1;
          if (sxLevenshtein(v, w) <= tol) best = Math.max(best, 1);
        }
      }
    }
  }
  return best;
}
// OR-style: an item is kept if ANY keyword matches (or relates to) any field,
// and ranked by how many keywords it covers — so exact/complete matches come
// first and everything related follows. 0 = no relation at all.
function sxHaystackScore(tokens, fields) {
  if (!tokens.length) return 1;
  let total = 0, hit = 0;
  for (const token of tokens) {
    let bestForToken = 0;
    for (const f of fields) { const sc = sxTokenFieldScore(token, f); if (sc > bestForToken) bestForToken = sc; if (sc === 3) break; }
    if (bestForToken > 0) { hit++; total += bestForToken; }
  }
  if (!hit) return 0;
  return hit * 100 + total + (hit === tokens.length ? 1000 : 0);
}
window.sxHaystackScore = sxHaystackScore;

// Universal search: sheet + FanCode + SonyLIV matches, live channels, movies, TV shows.
let SX_SEARCH_TIMER = 0;
function sxSearchTyped(v){
  const bar = document.querySelector('.sx-search-bar');
  if (bar) bar.classList.toggle('has-text', !!(v||'').length);
  clearTimeout(SX_SEARCH_TIMER);
  SX_SEARCH_TIMER = setTimeout(() => sxRunSearch(v), (v||'').trim() ? 90 : 0);
}
window.sxSearchTyped = sxSearchTyped;

function sxsEsc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function sxsNorm(t){
  t = String(t == null ? '' : t).toLowerCase();
  try { t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch(e){}
  return t.replace(/&/g, ' and ').replace(/[^a-z0-9\u0080-\uffff]+/g, ' ').trim();
}
function sxsPop(m){ return m._p === undefined ? (m._p = parseFloat(m.popularity) || 0) : m._p; }

// Movies / TV Shows live in the shared catalogue pools (vaPools) the Movies and TV pages already fill.
function sxCatalogSearch(type, q, limit){
  const pool = (window.vaPools && vaPools[type] && vaPools[type].all) || [];
  const qn = sxsNorm(q);
  if (!qn) return [];
  const toks = qn.split(' ').filter(Boolean);
  const keyToks = toks.filter(t => !SX_STOP.has(t)); const rt = keyToks.length ? keyToks : toks;
  const res = [], strictIdx = new Set();
  // pass 1 (fast, whole library): every word present
  for (let i = 0; i < pool.length; i++){
    const m = pool[i];
    if (m._n === undefined){ m._n = sxsNorm(m.title); m._s = ' ' + m._n + ' ' + (m.year || ''); }
    const s = m._s;
    let all = true, allW = true;
    for (let k = 0; k < toks.length; k++){
      if (s.indexOf(toks[k]) < 0){ all = false; break; }
      if (s.indexOf(' ' + toks[k]) < 0) allW = false;
    }
    if (all){
      res.push({ m, sc: m._n === qn ? 5000 : m._n.indexOf(qn) === 0 ? 4000 : s.indexOf(' ' + qn) >= 0 ? 3000 : allW ? 2500 : 2000 });
      strictIdx.add(i);
    }
  }
  // pass 2 (slow fuzzy / related): only when exact hits are few, so big libraries never lag
  if (res.length < 24){
    const t0 = performance.now();
    for (let i = 0; i < pool.length && res.length < 400; i++){
      if ((i & 255) === 0 && performance.now() - t0 > 30) break; // hard time budget: never block typing
      if (strictIdx.has(i)) continue;
      const m = pool[i];
      const r = sxHaystackScore(rt, [m._s + ' ' + String(m.genre || '').toLowerCase()]);
      if (r) res.push({ m, sc: Math.min(r, 1900) });
    }
  }
  res.sort((a, b) => b.sc - a.sc || sxsPop(b.m) - sxsPop(a.m));
  return { total: res.length, list: res.slice(0, limit).map(x => x.m) };
}
function sxCatalogPopular(type, limit){
  const pool = (window.vaPools && vaPools[type] && vaPools[type].all) || [];
  const top = [];
  for (let i = 0; i < pool.length; i++){
    const m = pool[i], p = sxsPop(m);
    if (top.length < limit || p > sxsPop(top[top.length - 1])){
      top.push(m); top.sort((a, b) => sxsPop(b) - sxsPop(a));
      if (top.length > limit) top.pop();
    }
  }
  return top;
}
function sxPosterHtml(m, type, i){
  const t = sxsEsc(m.title || 'Untitled');
  const g = m.genre ? String(m.genre).split(/[,|]/)[0].trim() : '';
  const r = parseFloat(m.rating);
  const sub = sxsEsc([m.year, g, r ? '★ ' + r.toFixed(1) : ''].filter(Boolean).join(' · '));
  return `<button type="button" class="sxs-poster" onclick="sxSearchPlay('${type}',${i})" title="${t}">` +
    `<span class="pi"><span class="pf">${t}</span>` +
    (m.poster_url ? `<img loading="lazy" decoding="async" src="${sxsEsc(m.poster_url)}" alt="${t}" onerror="this.remove()">` : '') +
    `<i class="tg">${type === 'tv' ? 'TV' : 'MOVIE'}</i></span>` +
    `<span class="pt">${t}</span><span class="ps">${sub}</span></button>`;
}
window._sxSearchStash = { movie: [], tv: [] };
window.sxSearchPlay = function(type, i){
  const m = (window._sxSearchStash[type] || [])[i];
  if (!m) return;
  const label = m.title + (m.year ? ' (' + m.year + ')' : '');
  try {
    if (type === 'tv'){ vaPendingTvItem = { id: m.tmdb_id || m.imdb_id, title: m.title }; vaOpenTvModal(label); }
    else openStreamPlayer(vaBuildEmbedUrl(m.embed_url), label, 'movie');
  } catch(e){ console.warn('search play failed', e); }
};

// Cross-source de-dupe for Search: a FanCode / SonyLIV / Willow entry is hidden when the same fixture is already
// listed by the Sheet card (which carries all its servers) or by a higher-priority source.
function sxFcxDup(m){ try { return typeof fcxHasSheetCard === 'function' && fcxHasSheetCard(m); } catch(e){ return false; } }
function sxGrpDup(g){ try { return !!(window.LMX && LMX.hideGroup && LMX.hideGroup(g)); } catch(e){ return false; } }

function sxSonyCardHtml(g){
  const n = (g.servers || []).length;
  return '<div class="smo-card fx2-card" data-live="1" data-finished="0" data-start-ms="0">' +
    '<div class="fx2-thumb">' +
      (g.poster ? '<img loading="lazy" decoding="async" src="' + sxsEsc(g.poster) + '" alt="' + sxsEsc(g.title) + '" class="fx2-thumb-img" onerror="this.style.display=\'none\'">' : '') +
      '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span>' +
    '</div>' +
    '<div class="fx2-body">' +
      '<div class="fx2-title-row"><div class="fx2-title">' + sxsEsc(g.title) + '</div><span class="fx2-free">FREE</span></div>' +
      '<div class="fx2-meta"><span class="fx2-tag">SonyLIV · ' + sxsEsc(g.category || 'Sports') + '</span>' +
        '<span class="fx2-date">' + n + (n === 1 ? ' language' : ' languages') + '</span></div>' +
      '<div class="smo-timer" style="visibility:hidden"><div class="timer-label">STARTS IN</div><div class="timer-display">--:--:--</div></div>' +
      '<a class="smo-btn" href="javascript:void(0)" onclick="event.stopPropagation();return slxOpenWatch(\'' + g.key + '\')">▶ Watch Now</a>' +
    '</div></div>';
}

function sxWlxCardHtml(g){
  const n = (g.servers || []).length, live = g.status === 'LIVE';
  const when = (typeof window.wlxFmt === 'function' && g.start) ? window.wlxFmt(g.start) : (g.timeText || 'TBA');
  return '<div class="smo-card fx2-card" data-live="' + (live ? 1 : 0) + '" data-finished="0" data-start-ms="' + (g.start ? g.start.getTime() : 0) + '">' +
    '<div class="fx2-thumb">' +
      (g.poster ? '<img loading="lazy" decoding="async" src="' + sxsEsc(g.poster) + '" alt="' + sxsEsc(g.title) + '" class="fx2-thumb-img" onerror="this.style.display=\'none\'">' : '') +
      (live ? '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span>' : '<span class="fx2-badge">⏰ UPCOMING</span>') +
    '</div>' +
    '<div class="fx2-body">' +
      '<div class="fx2-title-row"><div class="fx2-title">' + sxsEsc(g.title) + '</div><span class="fx2-free">FREE</span></div>' +
      '<div class="fx2-meta"><span class="fx2-tag">Willow · ' + sxsEsc(g.tour || 'Cricket') + '</span><span class="fx2-date">' + sxsEsc(when) + '</span></div>' +
      (n ? '<a class="smo-btn" href="javascript:void(0)" onclick="event.stopPropagation();return wlxOpenWatch(\'' + g.key + '\')">' + (live ? '▶ Watch Now' : '⏰ ' + sxsEsc(when)) + '</a>'
         : '<span class="smo-btn" style="opacity:.6;pointer-events:none;">' + (live ? 'NO STREAM YET' : '⏰ ' + sxsEsc(when)) + '</span>') +
    '</div></div>';
}

function sxRunSearch(qRaw){
  const raw = qRaw || '';
  const q = raw.toLowerCase().trim();
  const tokens = sxSearchTokens(q);
  const resultsEl = document.getElementById('sx-search-results');
  if (!resultsEl) return;
  const bar = document.querySelector('.sx-search-bar');
  if (bar) bar.classList.toggle('has-text', !!raw.length);

  const F = SX_SEARCH_FILTER;
  const want = k => F === 'all' || F === k;
  const isSheetLive = c => { try { return matchStatusText(c).toLowerCase() === 'live'; } catch(e){ return false; } };
  const sheetAll = window._matchCardsData || [], fcxAll = window._fcxMatchesCache || [],
        sonyAll = window._slxGroups || [], chAll = window._cmsChannels || [];
  const LIM = 40, PLIM = 36;

  const R = { sheet: [], willow: [], fcx: [], sony: [], ch: [], movie: [], tv: [] };
  const N = { sheet: 0, willow: 0, fcx: 0, sony: 0, ch: 0, movie: 0, tv: 0 };
  window._sxSearchStash = { movie: [], tv: [] };

  if (!q){
    R.sheet = sheetAll.filter(isSheetLive).map(c => sxMatchCardHtml(c));
    R.fcx   = fcxAll.filter(m => m.status === 'LIVE' && !sxFcxDup(m)).map(m => sxFcxMatchCardHtml(m));
    R.sony  = sonyAll.filter(g => g.status === 'LIVE' && !sxGrpDup(g)).map(g => sxSonyCardHtml(g));
    R.willow = (window._wlxGroups || []).filter(g => g.status === 'LIVE' && !sxGrpDup(g)).map(g => sxWlxCardHtml(g));
    R.ch    = chAll.filter(c => (c.status_live_off || '').toUpperCase() === 'LIVE');
    if (want('movie')) R.movie = sxCatalogPopular('movie', 18);
    if (want('tv'))    R.tv    = sxCatalogPopular('tv', 18);
    Object.keys(R).forEach(k => N[k] = R[k].length);
  } else {
    R.sheet = sheetAll
      .map(c => ({ s: sxHaystackScore(tokens, [c.team1_full_name||'', c.team1_code||'', c.team2_full_name||'', c.team2_code||'', c.game||'', c.details||'', c.sport||c.sports||'']), h: c }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.h);
    R.fcx = fcxAll
      .map(m => ({ s: sxHaystackScore(tokens, [m.title||'', m.tournament||'', m.category||'']), h: m }))
      .filter(x => x.s > 0 && !sxFcxDup(x.h)).sort((a, b) => b.s - a.s).map(x => x.h);
    R.sony = sonyAll
      .map(g => ({ s: sxHaystackScore(tokens, [g.title||'', g.category||'', g.tour||'', (g.teams||[]).join(' ')]), h: g }))
      .filter(x => x.s > 0 && !sxGrpDup(x.h)).sort((a, b) => b.s - a.s).map(x => x.h);
    R.willow = (window._wlxGroups || [])
      .map(g => ({ s: sxHaystackScore(tokens, [g.title||'', g.tour||'', g.category||'', 'willow', (g.teams||[]).join(' ')]), h: g }))
      .filter(x => x.s > 0 && !sxGrpDup(x.h)).sort((a, b) => b.s - a.s).map(x => x.h);
    R.ch = chAll
      .map(c => ({ s: sxHaystackScore(tokens, [c.channel_name||'', c.group||'']), h: c }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.h);
    N.sheet = R.sheet.length; N.willow = R.willow.length; N.fcx = R.fcx.length; N.sony = R.sony.length; N.ch = R.ch.length;
    R.sheet = R.sheet.slice(0, LIM).map(c => sxMatchCardHtml(c));
    R.fcx   = R.fcx.slice(0, LIM).map(m => sxFcxMatchCardHtml(m));
    R.sony  = R.sony.slice(0, LIM).map(g => sxSonyCardHtml(g));
    R.willow = R.willow.slice(0, LIM).map(g => sxWlxCardHtml(g));
    R.ch    = R.ch.slice(0, LIM);
    const mv = sxCatalogSearch('movie', q, PLIM), tv = sxCatalogSearch('tv', q, PLIM);
    N.movie = mv.total || 0; N.tv = tv.total || 0;
    R.movie = mv.list || []; R.tv = tv.list || [];
  }

  // chip counts
  const cnt = { all: N.sheet+N.willow+N.fcx+N.sony+N.ch+N.movie+N.tv, willow: N.willow, matches: N.sheet, fancode: N.fcx, sony: N.sony, channels: N.ch, movie: N.movie, tv: N.tv };
  document.querySelectorAll('#sx-search-chips .sx-chip').forEach(ch => {
    const b = ch.querySelector('.n'); if (!b) return;
    const v = cnt[ch.dataset.filter];
    b.textContent = (q && v) ? (v > 999 ? '999+' : v) : '';
  });

  const sec = (title, count, body, cls) =>
    `<section class="sxs-sec ${cls || ''}"><div class="sxs-sec-h"><span>${title}</span><em>${count}</em></div>${body}</section>`;
  const grid = arr => `<div class="smo-section sxs-grid">${arr.join('')}</div>`;
  let html = '', shown = 0;

  if (want('matches') && R.sheet.length){ html += sec(q ? 'Matches' : 'Live matches', N.sheet, grid(R.sheet)); shown += R.sheet.length; }
  if (want('willow') && R.willow.length){ html += sec(q ? 'Willow' : 'Live on Willow', N.willow, grid(R.willow)); shown += R.willow.length; }
  if (want('fancode') && R.fcx.length){ html += sec(q ? 'FanCode' : 'Live on FanCode', N.fcx, grid(R.fcx)); shown += R.fcx.length; }
  if (want('sony') && R.sony.length){ html += sec(q ? 'SonyLIV' : 'Live on SonyLIV', N.sony, grid(R.sony)); shown += R.sony.length; }
  if (want('channels') && R.ch.length){
    html += sec(q ? 'Live channels' : 'Live channels now', N.ch, `<div class="epg-list">` + R.ch.map(c => sxChannelRowOuterHtml(c)).join('') + `</div>`);
    shown += R.ch.length;
  }
  if (want('movie') && R.movie.length){
    window._sxSearchStash.movie = R.movie;
    html += sec(q ? 'Movies' : 'Popular movies', q ? N.movie : '', `<div class="sxs-posters">` + R.movie.map((m, i) => sxPosterHtml(m, 'movie', i)).join('') + `</div>` +
      (q && N.movie > R.movie.length ? `<div class="sxs-more">Showing top ${R.movie.length} of ${N.movie} related results</div>` : ''));
    shown += R.movie.length;
  }
  if (want('tv') && R.tv.length){
    window._sxSearchStash.tv = R.tv;
    html += sec(q ? 'TV shows' : 'Popular TV shows', q ? N.tv : '', `<div class="sxs-posters">` + R.tv.map((m, i) => sxPosterHtml(m, 'tv', i)).join('') + `</div>` +
      (q && N.tv > R.tv.length ? `<div class="sxs-more">Showing top ${R.tv.length} of ${N.tv} related results</div>` : ''));
    shown += R.tv.length;
  }

  if (!shown){
    const loading = (window.vaPools && ((vaPools.movie && !vaPools.movie.all.length) || (vaPools.tv && !vaPools.tv.all.length)));
    html = q
      ? `<div class="sxs-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.3" y1="15.3" x2="20" y2="20"/></svg><b>Nothing found for “${sxsEsc(raw.trim())}”</b><span>Try a team, tournament, channel, movie or show name${loading ? ' — the movie and TV library is still loading' : ''}.</span></div>`
      : `<div class="sxs-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.3" y1="15.3" x2="20" y2="20"/></svg><b>Search everything</b><span>Matches, FanCode, SonyLIV, live channels, movies and TV shows.</span></div>`;
  } else if (q){
    html = `<div class="sxs-sum"><b>${cnt.all}</b> result${cnt.all === 1 ? '' : 's'} for “${sxsEsc(raw.trim())}”</div>` + html;
  }
  resultsEl.innerHTML = html;
}
window.sxRunSearch = sxRunSearch;

// "/" or Ctrl/Cmd+K opens search, Esc closes it
document.addEventListener('keydown', function(e){
  const ov = document.getElementById('sx-search-overlay');
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '') || (e.target && e.target.isContentEditable);
  if (ov && ov.classList.contains('open')){ if (e.key === 'Escape'){ closeSxSearch(); } return; }
  if (!typing && (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'))){ e.preventDefault(); openSxSearch(); }
});


// ── Favourites: matches + channels saved via any heart button ──
function openFavourites(){
  sxCloseAllOverlays();
  document.getElementById('sx-fav-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'favourites'));
  sxHeaderInto('sx-fav-overlay', null);
  sxRenderFavouritesOverlay();
}
function closeFavourites(){
  document.getElementById('sx-fav-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
}
window.openFavourites = openFavourites;
window.closeFavourites = closeFavourites;

// Favourites is channels-only — no matches, teams, or sports here.
function sxRenderFavouritesOverlay(){
  const wrap = document.getElementById('sx-fav-results');
  if (!wrap) return;
  const favs = sxLoadFavs();
  const chanEntries = Object.entries(favs.channels||{});
  if (!chanEntries.length) {
    wrap.innerHTML = `<div class="epg-no-results">No favourite channels yet. Tap the heart on any channel card to save it here.</div>`;
    return;
  }
  wrap.innerHTML = `<div class="epg-list">` + chanEntries.map(([key,c]) => sxChannelRowOuterHtml(c, key)).join('') + `</div>`;
}
window.sxRenderFavouritesOverlay = sxRenderFavouritesOverlay;

;

// ══════════════════════════════════════════════════════════════════════
// FCX — FanCode match data + carousel + grid, integrated straight into
// the page (this used to be an iframe pointed at a separately-hosted
// FanCode site). Everything lives in its own closure so nothing here
// touches the rest of the app's globals. openFanCode()/closeFanCode()
// call fcxInit()/fcxStop() below to start and pause it.
// ══════════════════════════════════════════════════════════════════════
(function(){
  const FCX_API_CNPTV = EV_CONFIG.FANCODE_CNPTV;
  const FCX_API_WORLD = EV_CONFIG.FANCODE_WORLD;

  let fcxMatches = [];
  let fcxSlide = 0;
  let fcxRefreshTimer = null;
  let fcxAutoplayTimer = null;
  let fcxListenersBound = false;

  function fcxParseTime(str){
    if(!str) return null;
    const m = String(str).match(/(\d{1,2}):(\d{2}):(\d{2})\s+(AM|PM)\s+(\d{1,2})-(\d{1,2})-(\d{4})/i);
    if(!m) return new Date(str);
    let [,h,mm,ss,ampm,d,mo,y] = m;
    h=+h; mm=+mm; d=+d; mo=+mo; y=+y;
    if(ampm.toUpperCase()=='PM'&&h<12)h+=12;
    if(ampm.toUpperCase()=='AM'&&h==12)h=0;
    return new Date(y,mo-1,d,h,mm,+ss);
  }

  function fcxFormatTime(date){
    if(!date) return 'TBA';
    const dp = date.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}).toUpperCase();
    let h = date.getHours();
    const mm = String(date.getMinutes()).padStart(2,'0');
    const ap = h>=12?'PM':'AM';
    h=h%12; if(h===0)h=12;
    return `${dp}, ${h}:${mm} ${ap}`;
  }

  // Cards/slides link straight into the existing play.html player — that
  // page is already set up separately and just needs the match id.
  function fcxPlayUrl(m){
    return `play.html?id=${encodeURIComponent(m.id)}_eng&s=0`;
  }

  function fcxBuildSlide(m){
    const isLive = m.status === 'LIVE';
    return `
      <div class="fcx-carousel-slide">
        <img src="${m.image}" alt="${m.title}" class="fcx-slide-bg" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22300%22%3E%3Crect fill=%22%23111%22 width=%22800%22 height=%22300%22/%3E%3C/svg%3E'">
        <div class="fcx-slide-content">
          <div class="fcx-slide-status">${m.status}</div>
          <div class="fcx-slide-title">${m.title}</div>
          <div class="fcx-slide-meta"><span>${m.tournament}</span></div>
          <div class="fcx-slide-time">${fcxFormatTime(m.time)}</div>
          <div class="fcx-slide-actions">
            <button class="fcx-slide-btn" ${m.status === 'COMPLETED' ? 'disabled' : `onclick="return fcxOpenWatchById('${escJs(String(m.id))}')"`}>${isLive ? 'WATCH NOW' : 'VIEW DETAILS'}</button>
          </div>
        </div>
      </div>
    `;
  }

  function fcxUpdateCarousel(){
    const track = document.getElementById('fcxCarouselTrack');
    if (track) track.style.transform = `translateX(${-fcxSlide*100}%)`;
    document.querySelectorAll('#fcxDotsContainer .fcx-dot').forEach((d,i) => d.classList.toggle('fcx-active', i===fcxSlide));
  }

  function fcxBuildCard(m){
    let badge = m.status==='LIVE' ? '<span class="fcx-badge">● LIVE</span>' : m.status==='COMPLETED' ? '<span class="fcx-badge">✓ COMPLETED</span>' : '<span class="fcx-badge fcx-upcoming">UPCOMING</span>';
    return `
      <article class="fcx-card">
        <div class="fcx-thumb-wrap">
          <img src="${m.image}" alt="${m.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23111%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E'">
          ${badge}
        </div>
        <div class="fcx-meta">
          <div class="fcx-teams">${m.title}</div>
          <div class="fcx-event">${m.tournament}</div>
          <div class="fcx-card-time">${fcxFormatTime(m.time)}</div>
          <div class="fcx-actions">
            <button class="fcx-btn ${m.status==='UPCOMING'?'fcx-btn-upcoming':''}" ${m.status==='COMPLETED'?'disabled':`onclick="return fcxOpenWatchById('${escJs(String(m.id))}')"`}>
              ${m.status==='LIVE'?'WATCH NOW':m.status==='COMPLETED'?'MATCH OVER':fcxFormatTime(m.time)}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function fcxRender(list){
    const track = document.getElementById('fcxCarouselTrack');
    const dots = document.getElementById('fcxDotsContainer');
    const grid = document.getElementById('fcxGrid');
    if (!track || !dots || !grid) return;

    if (!list.length){
      grid.innerHTML = '<div class="fcx-empty-state">No matches found</div>';
      track.innerHTML = '<div class="fcx-carousel-slide fcx-loading-state"><p>No matches</p></div>';
      dots.innerHTML = '';
      return;
    }

    track.innerHTML = list.map(fcxBuildSlide).join('');
    dots.innerHTML = list.map((m,i) => `<div class="fcx-dot ${i===0?'fcx-active':''}" data-i="${i}"></div>`).join('');
    fcxSlide = 0;
    fcxUpdateCarousel();
    grid.innerHTML = list.map(fcxBuildCard).join('');
  }

  function fcxLoad(){
    Promise.all([
      fetch(FCX_API_CNPTV).then(r=>r.json()).catch(()=>({matches:[]})),
      fetch(FCX_API_WORLD).then(r=>r.json()).catch(()=>({matches:[]}))
    ]).then(([cnptv, world]) => {
      // India source (fan.json): match_id -> cnptv_cdn m3u8 (only present once
      // CNP-TV has the match up; empty string otherwise).
      const fcxIndiaMap = {};
      (cnptv && cnptv.matches || []).forEach(x => { if (x && x.match_id && x.cnptv_cdn) fcxIndiaMap[String(x.match_id)] = x.cnptv_cdn; });
      fcxMatches = (world.matches||[]).map(m => ({
        id: m.match_id,
        india: fcxIndiaMap[String(m.match_id)] || '',
        title: m.title||'Match',
        tournament: m.tournament||'',
        category: (m.category||'').trim(),
        image: m.image||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22300%22%3E%3Crect fill=%22%23222%22 width=%22800%22 height=%22300%22/%3E%3C/svg%3E',
        status: String(m.status||'').toUpperCase(),
        time: fcxParseTime(m.startTime)
      })).sort((a,b) => (a.time?.getTime() || Infinity) - (b.time?.getTime() || Infinity));

      const q = (document.getElementById('fcxSearchInput')?.value || '').trim().toLowerCase();
      try { window._fcxMatchesCache = fcxMatches; if (window.LMX && LMX.applyBanners) LMX.applyBanners(); } catch (e) {}   // Willow banner beats FanCode's before anything renders
      fcxRender(q ? fcxMatches.filter(m => m.title.toLowerCase().includes(q) || m.tournament.toLowerCase().includes(q)) : fcxMatches);

      // Push every refresh out to the home Matches tab + hero slides bridge
      // (defined further down, outside this closure) so FanCode matches
      // keep showing up there even while the FanCode panel itself is closed.
      window._fcxMatchesCache = fcxMatches;
      // If the player is open on a FanCode match, re-check whether the India
      // source has appeared since it was opened.
      if (typeof window.spRefreshFcxSwitch === 'function') window.spRefreshFcxSwitch();
      // If the sheet has already loaded, re-run its render — this both
      // re-checks every card for a FanCode cross-link (fcxAugmentSheetCards)
      // and re-appends FanCode's own sections at the end. Otherwise fall
      // back to appending FanCode's sections on their own.
      if (window._matchCardsRawRows && typeof renderMatchCards === 'function') {
        renderMatchCards(window._matchCardsRawRows);
      } else if (typeof window.fcxAppendHomeSections === 'function') {
        window.fcxAppendHomeSections();
      }
      if (typeof window.fcxAppendHeroSlides === 'function') window.fcxAppendHeroSlides();
      if (typeof window.fcxAppendFixturesPreview === 'function') window.fcxAppendFixturesPreview();
    }).catch(err => {
      console.error('FCX load error:', err);
      const grid = document.getElementById('fcxGrid');
      if (grid) grid.innerHTML = '<div class="fcx-empty-state">Error loading matches. Please refresh.</div>';
    });
  }

  function fcxBindListeners(){
    if (fcxListenersBound) return;
    fcxListenersBound = true;

    document.getElementById('fcxSearchInput')?.addEventListener('input', function(){
      const q = this.value.trim().toLowerCase();
      fcxRender(q ? fcxMatches.filter(m => m.title.toLowerCase().includes(q) || m.tournament.toLowerCase().includes(q)) : fcxMatches);
    });

    document.getElementById('fcxDotsContainer')?.addEventListener('click', e => {
      const dot = e.target.closest('.fcx-dot');
      if (dot) { fcxSlide = +dot.dataset.i; fcxUpdateCarousel(); }
    });

    document.getElementById('fcxPrevBtn')?.addEventListener('click', () => {
      if (!fcxMatches.length) return;
      fcxSlide = (fcxSlide - 1 + fcxMatches.length) % fcxMatches.length;
      fcxUpdateCarousel();
    });

    document.getElementById('fcxNextBtn')?.addEventListener('click', () => {
      if (!fcxMatches.length) return;
      fcxSlide = (fcxSlide + 1) % fcxMatches.length;
      fcxUpdateCarousel();
    });
  }

  // Called by openFanCode() — panel is already populated (data loads at
  // page load now, see bottom of this file) so this just binds the
  // search/dot listeners once and starts the carousel autoplay.
  window.fcxInit = function(){
    fcxBindListeners();
    fcxRender(fcxMatches);
    clearInterval(fcxAutoplayTimer);
    fcxAutoplayTimer = setInterval(() => {
      if (fcxMatches.length > 1) { fcxSlide = (fcxSlide + 1) % fcxMatches.length; fcxUpdateCarousel(); }
    }, 8000);
  };

  // Called by closeFanCode() — pauses just the panel's own carousel
  // autoplay while it's off-screen; the background data refresh below
  // keeps running so the Matches tab / hero slides stay live.
  window.fcxStop = function(){
    clearInterval(fcxAutoplayTimer); fcxAutoplayTimer = null;
  };

  // Kick off the FanCode match feed right away at page load (not only when
  // the FanCode panel is opened) so these matches can also be surfaced in
  // the Matches tab and homescreen hero slides — see fcxAppendHomeSections()
  // / fcxAppendHeroSlides() further down.
  fcxLoad();
  fcxRefreshTimer = setInterval(fcxLoad, 30000);
})();

// ══════════════════════════════════════════════════════════════════════
// FCX BRIDGE — surfaces the same FanCode matches (cached above on
// window._fcxMatchesCache every 30s) inside the main Matches tab and the
// homescreen hero carousel, as their own "FanCode" section/slides. Kept
// deliberately separate from the sheet-driven MATCH CARDS schema (team1_
// code/team2_code/etc.) rather than merged into it, so nothing else that
// already reads that schema has to change shape to accommodate FCX data.
// ══════════════════════════════════════════════════════════════════════
window._fcxMatchesCache = [];

function fcxJsUrl(m){
  return `play.html?id=${encodeURIComponent(m.id)}_eng&s=0`;
}

// ── FanCode category → sport (cross-merge with the sheet) ─────────────
// The Matches page never shows "FanCode" as a sport any more. Each FanCode
// match carries its own "category" in the JSON feed (e.g. "Cricket",
// "Football"); that's what gets used as the sport. If that category matches
// a sport already coming from the MATCH CARDS sheet — compared
// case-insensitively, so "CRICKET" / "Cricket" / "cricket" are all one —
// the FanCode tournaments are merged INTO that existing sheet sport instead
// of creating a duplicate entry next to it.
window._smoSheetSports = window._smoSheetSports || [];
function fcxGroupCategory(cards){
  const hit = (cards || []).find(m => (m.category || '').trim());
  return hit ? hit.category.trim() : 'Other';
}
function fcxResolveSport(category){
  const cat = (category || '').trim();
  const extra = Array.prototype.slice.call(arguments, 1);   // tournament / match titles — sport can hide in these
  const generic = /^(sports?|live|other|events?)?$/i.test(cat);
  const det = window.sxDetectSport ? window.sxDetectSport(generic ? '' : cat, extra, '') : '';
  if (!cat && !det) return 'Other';
  const sheetSports = window._smoSheetSports || [];
  const merged = sheetSports.find(sp => (sp || '').trim().toLowerCase() === cat.toLowerCase())
    || (det && sheetSports.find(sp => window.sxDetectSport(sp, '', '') === det));
  if (merged) return merged;   // merged → use the sheet's exact spelling
  return det || (generic ? 'Other' : cat);
}
// Look a cached FanCode match back up by id (used by the watch-screen
// handlers wired into inline onclick attributes).
function fcxFindById(id){
  return (window._fcxMatchesCache || []).find(m => String(m.id) === String(id)) || null;
}
// Opens the same full-screen server selector the sheet matches use, for a
// FanCode match — including before kickoff, where it shows the red
// "Match will be live at …" notice instead of a playable stream.
function fcxOpenWatchById(id){
  const m = fcxFindById(id);
  if (!m) return false;
  const isLive = m.status === 'LIVE';
  const servers = [{
    url: fcxJsUrl(m), text: 'FanCode',
    fcxLive: isLive, fcxTime: fcxFmtMatchTime(m)
  }].concat(window.LMX ? window.LMX.serversForFcx(m) : []);
  try {   // a Sheet row for the same fixture: its own servers join the list too
    const row = (window._matchCardsData || []).filter(c => fcxTitleHasTeam(m.title || '', c.team1_code, c.team1_full_name) && fcxTitleHasTeam(m.title || '', c.team2_code, c.team2_full_name))[0];
    if (row) sxGetMatchServers(row).forEach(s => { if (!servers.some(x => String(x.url).trim() === String(s.url).trim())) servers.push(s); });
  } catch (e) {}
  openMatchWatchScreen(servers, {
    name: m.title || 'Live Stream',
    fcxId: m.id,
    // FanCode events are single-image, not two-team fixtures — no team
    // icon fields at all, so the banner fallback above always kicks in.
    team1_code: '', team1_full_name: '', team1_icon_url: '',
    team2_code: '', team2_full_name: '', team2_icon_url: '',
    date_label: fcxFmtMatchTime(m),
    details: m.tournament || m.category || '',
    countdown: (m.time && !isNaN(m.time.getTime())) ? m.time.toISOString() : '',
    status: isLive ? 'live' : (m.status === 'COMPLETED' ? 'finished' : 'upcoming'),
    banner: m.image || ''
  });
  return false;
}
function fcxStatusRank(m){
  if (m.status === 'LIVE') return 0;
  if (m.status === 'COMPLETED') return 2;
  return 1; // UPCOMING / unknown
}
// Start time in ms for a FanCode match — used as the tiebreak inside a
// status tier so upcoming matches sort soonest-first (same rule the sheet
// side applies via countdown_to_iso_datetime), instead of just keeping
// feed order.
function fcxStartMs(m){
  return (m && m.time instanceof Date && !isNaN(m.time.getTime())) ? m.time.getTime() : Infinity;
}
function fcxFmtMatchTime(m){
  if (!m.time) return 'TBA';
  const dp = m.time.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}).toUpperCase();
  let h = m.time.getHours();
  const mm = String(m.time.getMinutes()).padStart(2,'0');
  const ap = h>=12?'PM':'AM';
  h=h%12; if(h===0)h=12;
  return `${dp}, ${h}:${mm} ${ap}`;
}

// Shared "Watch Now" control for every FanCode card (Matches tab, home
// fixtures preview, hero slides) — before kickoff it just shows the date/
// time (not clickable), and only turns into a real, working "Watch Now"
// once the match is actually live. `cls` lets each spot keep its own
// button styling (smo-btn vs btn-slide-watch).
function fcxWatchBtnHtml(m, cls){
  cls = cls || 'smo-btn';
  if (m.status === 'LIVE') {
    return `<a class="${cls}" href="javascript:void(0)" onclick="event.stopPropagation();return fcxOpenWatchById('${escJs(String(m.id))}')">▶ Watch Now</a>`;
  }
  if (m.status === 'COMPLETED') {
    return `<a class="${cls}" href="javascript:void(0)" style="opacity:.6;" onclick="event.stopPropagation();return fcxOpenWatchById('${escJs(String(m.id))}')">MATCH OVER</a>`;
  }
  // Not started yet — still clickable: opens the server selector, which
  // shows the red "Match will be live at …" notice.
  return `<a class="${cls}" href="javascript:void(0)" onclick="event.stopPropagation();return fcxOpenWatchById('${escJs(String(m.id))}')">⏰ ${fcxFmtMatchTime(m)}</a>`;
}

// True if `title` mentions this team — either its short code as a whole
// word (e.g. "IND" in "IND vs PAK, 1st T20I") or its full name as a
// substring (e.g. "India" in "India tour of Pakistan").
const FCX_TEAM_AL = { ind:'india', pak:'pakistan', eng:'england', aus:'australia', nz:'new zealand', nzl:'new zealand', sl:'sri lanka', sa:'south africa', rsa:'south africa', wi:'west indies',
  ban:'bangladesh', afg:'afghanistan', zim:'zimbabwe', ire:'ireland', ned:'netherlands', sco:'scotland', nep:'nepal', uae:'united arab emirates', usa:'united states', bra:'brazil', arg:'argentina', esp:'spain', fra:'france', ger:'germany', por:'portugal' };
function fcxTeamVariants(x){
  x = String(x || '').trim().toLowerCase(); if (!x) return [];
  const out = [];
  if (FCX_TEAM_AL[x]) out.push(FCX_TEAM_AL[x]);
  Object.keys(FCX_TEAM_AL).forEach(k => { if (FCX_TEAM_AL[k] === x) out.push(k); });
  return out;
}
function fcxTitleHasTeam(title, code, fullName){
  if (fcxTitleHasTeamExact(title, code, fullName)) return true;
  const alts = fcxTeamVariants(code).concat(fcxTeamVariants(fullName));
  return alts.some(a => fcxTitleHasTeamExact(title, a, a));
}
function fcxTitleHasTeamExact(title, code, fullName){
  // "Victoria Women" in the title must not match the men's "Victoria" row (and vice-versa), same for U19 etc.
  if (window.sxQual && sxQual(title) !== sxQual(fullName || code)) {
    // title-level tag only counts when the team name itself is what carries it — compare with the tag on the team side
    if (sxQual(title) && !sxQual(fullName || code)) return false;
    if (!sxQual(title) && sxQual(fullName || code)) return false;
  }
  const t = (title || '').toLowerCase();
  const c = (code || '').trim().toLowerCase();
  const f = (fullName || '').trim().toLowerCase();
  const hit = s => {
    const ls = String(s || '').toLowerCase();
    const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // whole-word only: "ind" / "india" must NOT match inside "Indies", "wi" not inside "Wiltshire", etc.
    // The words right next to the team must not turn it into a different side: "India A", "Brazil U20", "Club II",
    // "Northern Ireland" are not "India", "Brazil", "Club", "Ireland".
    return [c, f].some(n => {
      if (!n || n.length < 2) return false;
      const m = new RegExp('(^|[^a-z0-9])(?:([a-z0-9]+)\\s+)?' + esc(n) + '(?:\\s+([a-z0-9]+))?($|[^a-z0-9])', 'i').exec(ls);
      if (!m) return false;
      if (m[3] && /^(a|b|c|ii|iii|iv|xi|u\d{2}|reserves?|academy|youth|juniors?|shaheens?|emerging|development)$/.test(m[3]) && !new RegExp('\\b' + m[3] + '\\b').test(n)) return false;
      if (m[2] && /^(north|northern|south|southern|east|eastern|west|western)$/.test(m[2]) && !new RegExp('\\b' + m[2] + '\\b').test(n)) return false;
      return true;
    });
  };
  // "TEAM 1 v TEAM 2" title: the team must sit in ONE side and carry the SAME Champions/Legends/Masters tag as that side,
  // so "West Indies" never matches "West Indies Champions" (and "India" never matches "India Champions").
  const sides = String(title || '').replace(/\[[^\]]*\]/g, ' ').split(/\s+(?:vs\.?|v\.?|versus)\s+/i);
  if (sides.length >= 2 && window.sxLeagueTag) {
    const want = sxLeagueTag(fullName || code), sep = /\s*[,|\-\u2013\u2014(:]\s*/;
    return sides.some((s, i) => {
      if (!hit(s)) return false;
      if (i > 0 && i < sides.length - 1) return true;
      const p = s.split(sep);
      return sxLeagueTag(i === 0 ? p[p.length - 1] : p[0]) === want;
    });
  }
  return hit(title);
}

// Finds the best FanCode match for a sheet MATCH CARDS row, by checking
// that BOTH its teams (short code or full name, either field) are
// mentioned in the FanCode match's title. Prefers a live one, then
// whatever's not finished, then just the first hit.
function fcxFindSheetMatch(card){
  const list = window._fcxMatchesCache || [];
  const cand = list.filter(m => {
    const title = m.title || '';
    return fcxTitleHasTeam(title, card.team1_code, card.team1_full_name) &&
           fcxTitleHasTeam(title, card.team2_code, card.team2_full_name);
  });
  if (!cand.length && window.LMX && LMX.rowLinksFcx) list.forEach(m => { if (m.status !== 'COMPLETED' && LMX.rowLinksFcx(card, m)) cand.push(m); });
  if (!cand.length) return null;
  return cand.find(m => m.status === 'LIVE') || cand.find(m => m.status !== 'COMPLETED') || cand[0];
}

// Reverse of fcxFindSheetMatch(): given a FanCode match, is there ALREADY a
// sheet MATCH CARDS row for this exact fixture (same two teams, in EITHER
// order — "India vs Afghanistan" and "Afghanistan vs India" are the same
// fixture; fcxTitleHasTeam() only checks each team's presence in the
// title, never their position, so team order can never cause a miss). If so,
// fcxAugmentSheetCards() below has already (or will) fold this stream into
// that row as an extra server — so fcxAppendHomeSections must NOT also
// render it as its own separate card, or the same fixture shows twice
// (once as the sheet's card, once as FanCode's).
function fcxHasSheetCard(m){
  const rows = window._matchCardsRawRows || [];
  const title = m.title || '';
  if (rows.some(c =>
    fcxTitleHasTeam(title, c.team1_code, c.team1_full_name) &&
    fcxTitleHasTeam(title, c.team2_code, c.team2_full_name)
  )) return true;
  return !!(window.LMX && LMX.fcxSheetRow && LMX.fcxSheetRow(m));   // same loose/league-aware rule the unified linker uses
}

// For every sheet MATCH CARDS row that has a matching FanCode stream (same
// two teams), drops that stream into the next empty server slot (btn_url /
// btn_url_2 .. btn_url_5) as an extra "FanCode" option — the row's own
// banner/thumbnail and its other configured servers are untouched, this
// only adds one more choice to the Watch Now server list. Runs every time
// MATCH CARDS re-renders, so it re-checks (and fills in) as FanCode's own
// feed updates every 30s.
function fcxAugmentSheetCards(cards){
  const urlSlots = ['btn_url', 'btn_url_2', 'btn_url_3', 'btn_url_4', 'btn_url_5'];
  const textSlots = ['btn_text', 'btn_text_2', 'btn_text_3', 'btn_text_4', 'btn_text_5'];
  (cards || []).forEach(c => {
    c._fcxOverflow = null;
    const already = textSlots.some(t => (c[t] || '').trim().toLowerCase() === 'fancode');
    if (already) return;
    const fm = fcxFindSheetMatch(c);
    if (!fm) return;
    const emptyIdx = urlSlots.findIndex(s => {
      const v = (c[s] || '').toString().trim();
      return !v || v === '#';
    });
    if (emptyIdx === -1) { c._fcxOverflow = fm; c._fcxBanner = fm.image; return; } // all 5 slots taken — added as an extra server instead
    c[urlSlots[emptyIdx]] = fcxJsUrl(fm);
    c[textSlots[emptyIdx]] = 'FanCode';
    c._fcxBanner = fm.image; // let the card's thumbnail fall back to FanCode's own banner too
  });
}

// Groups the cached FanCode matches by tournament/series — live-first
// ordering both across groups (a tournament with a live match sorts
// first) and within each group — shared by the Matches-tab sections
// below and by renderMatchCards() when it folds "FanCode" into the top
// sport selector.
// Loose-match normaliser for tournament/event names: lowercase, punctuation
// stripped, whitespace collapsed. The sheet and FanCode's own feed rarely
// spell a series identically — "India tour of Afghanistan", "India Tour Of
// Afghanistan 2026", "IND tour of AFG, T20I Series" — so an exact string
// match misses most real duplicates. Normalising first catches the
// punctuation/case cases; the caller then also checks containment.
function smoNormGameName(name){
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')   // strip commas, dashes, etc.
    .replace(/\s+/g, ' ')
    .trim();
}
window.smoNormGameName = smoNormGameName;

// Matches a tournament name against a list of game/event names already on
// the page — normalised equality first, then containment either way (e.g.
// "india tour of afghanistan" inside "india tour of afghanistan 2026 2nd
// t20i"), so the sheet's game column and FanCode's own tournament label
// land on ONE shared section instead of two. Ignores an empty/near-empty
// normalised name (guards against everything matching everything on a
// stray short label). Returns the EXISTING spelling so both sources render
// under one label.
function smoMatchExistingGame(list, name){
  const n = smoNormGameName(name);
  if (n.length < 3) return '';
  let exact = '';
  let contains = '';
  (list || []).some(g => {
    const gn = smoNormGameName(g);
    if (!gn) return false;
    if (gn === n) { exact = g; return true; }
    if (!contains && gn.length >= 3 && (gn.includes(n) || n.includes(gn))) contains = g;
    return false;
  });
  return exact || contains;
}
window.smoMatchExistingGame = smoMatchExistingGame;

// Full "live first, then soonest-upcoming first" sort for any flat list of
// sibling card elements, read off the data-live / data-start-ms attributes
// every match card (sheet-driven or FanCode) now carries. This is the one
// ordering rule used everywhere a match list is rendered or merged:
//   1) LIVE cards first
//   2) everything else by start time ascending (countdown_to_iso_datetime
//      for sheet cards, FanCode's own start time for FanCode cards) — so
//      e.g. an Oct 2, 7 AM match lists before an Oct 3 match regardless of
//      which source it came from.
// Needed because FanCode cards get merged into already-rendered lists by
// simple DOM insertion (append/insertBefore) rather than a full re-sort,
// which on its own could leave a live or soon-starting FanCode match
// sitting under sheet cards that just happened to render first.
function sxSortCardsLiveThenTime(cards, moveFn) {
  if (!cards || cards.length < 2) return;
  // 3-tier: LIVE(0) < upcoming(1) < finished(2) — a finished card's start
  // time is in the past, so without this it would sort AHEAD of upcoming
  // cards (smaller ms) inside a merged section. data-finished is stamped
  // on every card (sheet + FanCode) that can carry a FINISHED badge.
  const rank = c => c.dataset.live === '1' ? 0 : (c.dataset.finished === '1' ? 2 : 1);
  const startMs = c => { const v = c.dataset.startMs; return (v !== undefined && v !== '' && !isNaN(Number(v))) ? Number(v) : Infinity; };
  // FanCode and sheet/"iso" cards are equal power — no source-based
  // tiebreak. Whichever actually starts sooner sorts first, full stop.
  cards.slice().sort((a, b) => rank(a) - rank(b) || startMs(a) - startMs(b)).forEach(moveFn);
}
// Section-scoped convenience wrapper (Matches tab: sheet + merged-in
// FanCode cards inside the same game/category section).
function sxReorderSectionLiveFirst(sectionEl) {
  if (!sectionEl) return;
  sxSortCardsLiveThenTime(
    Array.from(sectionEl.querySelectorAll(':scope > .smo-card')),
    c => sectionEl.appendChild(c)
  );
}
// Whole-category-section-level "does it contain a live card at all" check —
// used only to decide which game/category SECTION floats to the top when a
// brand-new FanCode-only section is appended after the sheet-driven render
// (see fcxAppendHomeSections below). This is a coarser, boolean version of
// the per-card sort above — it moves a whole section, not individual cards.
function sxFloatLiveCardsToTop(siblings, isLiveEl, moveFn) {
  if (!siblings || siblings.length < 2) return;
  const live = siblings.filter(isLiveEl);
  if (!live.length || live.length === siblings.length) return;
  const rest = siblings.filter(el => !isLiveEl(el));
  live.concat(rest).forEach(moveFn);
}
// Full section-level reorder for the Matches tab ("All" view), combining
// BOTH sheet-driven ("iso"/MATCH CARDS) sections and FanCode-only sections
// into ONE ordering — replaces sxFloatLiveCardsToTop's boolean-only pass,
// which kept sheet sections and appended FanCode sections as two separate
// blocks and never sorted the non-live ones by how soon they start. Rule
// (mirrors the per-card rule sxSortCardsLiveThenTime already applies inside
// each section):
//   1) any section containing a LIVE match, first
//   2) sections with at least one still-upcoming (non-live, non-finished)
//      match — soonest start time across the section, ascending, so e.g.
//      an Oct 2 tournament lists before an Oct 3 one regardless of source
//   3) sections that are entirely FINISHED matches — pushed to the bottom
// FanCode and sheet sections are equal power — no source-based tiebreak.
// If a sheet section's soonest match is earlier than a FanCode section's,
// the sheet section sorts first (and vice versa), purely on time.
function sxReorderAllSectionsLiveThenTime(container) {
  if (!container) return;
  const secs = Array.from(container.querySelectorAll(':scope > .smo-section'));
  if (secs.length < 2) return;
  const info = secs.map(sec => {
    const cards = Array.from(sec.querySelectorAll(':scope > .smo-card'));
    const hasLive = cards.some(c => c.dataset.live === '1');
    const activeCards = cards.filter(c => c.dataset.finished !== '1');
    const hasUpcoming = activeCards.some(c => c.dataset.live !== '1');
    const tier = hasLive ? 0 : (hasUpcoming ? 1 : 2);
    const relevant = activeCards.length ? activeCards : cards;
    let soonest = Infinity;
    relevant.forEach(c => {
      const v = Number(c.dataset.startMs);
      if (!isNaN(v)) soonest = Math.min(soonest, v);
    });
    return { sec, tier, soonest };
  });
  info.sort((a, b) => a.tier - b.tier || a.soonest - b.soonest);
  info.forEach(i => container.appendChild(i.sec));
}

function fcxTournamentGroups(){
  const all = window._fcxMatchesCache || [];
  if (!all.length) return [];
  // Keyed by category+tournament together — never by tournament alone —
  // so two matches that both happen to have no tournament name (or the
  // same tournament name) but different categories can never end up in
  // the same group/section. See the block comment above this function.
  const groups = new Map();
  all.forEach(m => {
    const cat = (m.category || '').trim() || 'Other';
    const label = (m.tournament || '').trim() || cat;
    const key = cat + '||' + label;
    if (!groups.has(key)) groups.set(key, { label, cards: [] });
    groups.get(key).cards.push(m);
  });
  const entries = Array.from(groups.values()).map(g => [g.label, g.cards]);
  // Sort FanCode matches: LIVE first, then UPCOMING by date (ascending/soonest first), then COMPLETED
  entries.forEach(([, cards]) => cards.sort((a,b) => {
    const statusA = fcxStatusRank(a); // 0=LIVE, 1=UPCOMING, 2=COMPLETED
    const statusB = fcxStatusRank(b);
    if (statusA !== statusB) return statusA - statusB; // Primary sort by status
    // Within same status: sort UPCOMING matches by date ascending (soonest first)
    return fcxStartMs(a) - fcxStartMs(b); // Secondary sort by time ascending
  }));
  // Group-level ordering: LIVE groups first; among the rest, groups that
  // still have an UPCOMING match sort by that match's soonest start time
  // ascending (not just "has live" true/false); groups that are entirely
  // COMPLETED sink to the very end. Matches the sheet-side groupEntries
  // rule in renderMatchCards() so both sources order the same way before
  // sxReorderAllSectionsLiveThenTime does the final cross-source merge.
  const groupTier = cards => {
    if (cards.some(m => m.status === 'LIVE')) return 0;
    if (cards.some(m => m.status !== 'COMPLETED')) return 1;
    return 2;
  };
  const groupSoonest = cards => {
    const upcoming = cards.filter(m => m.status !== 'COMPLETED');
    const pool = upcoming.length ? upcoming : cards;
    return pool.reduce((min, m) => Math.min(min, fcxStartMs(m)), Infinity);
  };
  entries.sort((a, b) => {
    const tierA = groupTier(a[1]), tierB = groupTier(b[1]);
    if (tierA !== tierB) return tierA - tierB;
    return groupSoonest(a[1]) - groupSoonest(b[1]);
  });
  return entries;
}

// Re-appends FanCode matches into the Matches tab (#match-overlay) as their
// own set of sections — one per tournament/series, same as the sheet-driven
// groups are one per game/event — after every sheet-driven MATCH CARDS
// render AND every FCX refresh, so it survives being wiped by either 30s
// cycle, whichever runs last. Card markup mirrors the sheet-driven .fx2-card
// cards exactly (same thumb, badge, and reserved timer-block structure) so
// FanCode and normal match cards always come out the same size in the grid.
window.fcxAppendHomeSections = function(){
  const el = document.getElementById('match-overlay');
  if (!el) return;
  el.querySelectorAll('.fcx-smo-section').forEach(s => s.remove());
  el.querySelectorAll('.fcx-smo-card').forEach(c => c.remove());
  const entries = fcxTournamentGroups();
  if (!entries.length) return;

  const timers = [];
  entries.forEach(([tournamentRaw, cardsAll]) => {
    // Drop any FanCode match that's already represented by a sheet card
    // (same fixture) — it's already cross-linked as an extra server there,
    // not shown a second time as its own card here.
    const cards = cardsAll.filter(m => !fcxHasSheetCard(m));
    if (!cards.length) return;
    // If the sheet already rendered a section for this exact tournament,
    // these FanCode cards belong INSIDE it — one tournament, one section,
    // one dropdown entry — rather than in a duplicate section below it.
    const existingGameName = smoMatchExistingGame(
      Array.from(el.querySelectorAll(':scope > .smo-section')).map(sec => sec.dataset.game || ''),
      tournamentRaw
    );
    const existingSec = existingGameName
      ? Array.from(el.querySelectorAll(':scope > .smo-section')).find(sec => sec.dataset.game === existingGameName)
      : null;
    const tournament = existingSec ? (existingSec.dataset.game || tournamentRaw) : tournamentRaw;
    let cardsHtml = '';
    cards.forEach(m => {
      const isLive = m.status === 'LIVE';
      const isFinished = m.status === 'COMPLETED';
      const uid = 'fcx-' + m.id;
      const badgeId = 'smo-badge-' + uid;
      const liveBadgeHtml = `<span class="fx2-badge fx2-badge-live" id="${badgeId}"><span class="fx2-live-dot"></span>LIVE</span>`;
      const badge = isLive
        ? liveBadgeHtml
        : isFinished
        ? `<span class="fx2-badge" id="${badgeId}">FINISHED</span>`
        : `<span class="fx2-badge" id="${badgeId}">⏰ UPCOMING</span>`;
      const countdown = (!isLive && !isFinished && m.time) ? m.time.toISOString() : '';
      const timerId = 'smo-timer-' + uid;
      const timerWrapId = 'smo-timerwrap-' + uid;
      // Always render the timer wrapper — even hidden — so every card
      // reserves the exact same vertical space as the sheet-driven cards,
      // whether or not this particular match has a countdown to show.
      const timerBlock = `<div class="smo-timer" id="${timerWrapId}" style="visibility:${countdown ? 'visible' : 'hidden'}"><div class="timer-label">STARTS IN</div><div class="timer-display" id="${timerId}">--:--:--</div></div>`;
      cardsHtml += `
      <div class="smo-card fx2-card${existingSec ? ' fcx-smo-card' : ''}" data-live="${isLive?'1':'0'}" data-finished="${isFinished?'1':'0'}" data-start-ms="${fcxStartMs(m)}">
        <div class="fx2-thumb">
          <img loading=lazy decoding=async src="${m.image}" alt="${escJs(m.title)}" class="fx2-thumb-img" onerror="this.style.display='none'">
          ${badge}
        </div>
        <div class="fx2-body">
          <div class="fx2-title-row">
            <div class="fx2-title">${m.title}</div>
            <span class="fx2-free">FREE</span>
          </div>
          <div class="fx2-meta">
            <span class="fx2-tag">${tournament}</span>
            <span class="fx2-date">${fcxFmtMatchTime(m)}</span>
          </div>
          ${timerBlock}
          ${fcxWatchBtnHtml(m, 'smo-btn')}
        </div>
      </div>`;
      if (countdown) timers.push({ timerDisplayId: timerId, timerWrapId, badgeId, liveBadgeHtml, target: countdown });
    });
    if (existingSec) {
      // Merge: drop the cards straight into the sheet's own section, then
      // re-sort so a live FanCode match jumps above any non-live sheet
      // cards already sitting there (and vice versa).
      existingSec.insertAdjacentHTML('beforeend', cardsHtml);
      sxReorderSectionLiveFirst(existingSec);
    } else {
      el.insertAdjacentHTML('beforeend',
        `<div class="smo-section fcx-smo-section"><div class="smo-section-label">${tournament}</div>${cardsHtml}</div>`);
      // Tag via the DOM property (not an HTML attribute string) — same
      // convention renderMatchCards uses for its own sections — so a
      // tournament name with a quote in it can't break the markup, and the
      // sport/game toolbars (which read these two properties) can filter it.
      const secs = el.querySelectorAll('.fcx-smo-section');
      const sec = secs[secs.length - 1];
      if (sec) { sec.dataset.game = tournament; sec.dataset.sport = fcxResolveSport(fcxGroupCategory(cards), tournament, cards.map(m => m.title)); }
    }
  });
  // Every section is now in the DOM — sheet-driven sections (possibly with
  // FanCode cards merged straight in above) AND brand-new FanCode-only
  // sections appended just above. Do ONE full reorder across all of them —
  // live first, then ascending by soonest upcoming start time, finished
  // last — instead of the old boolean-only float, which only ever floated
  // live sections up and left the rest (sheet vs FanCode) as two separate,
  // un-interleaved blocks.
  sxReorderAllSectionsLiveThenTime(el);
  timers.forEach(({ timerDisplayId, timerWrapId, badgeId, liveBadgeHtml, target }) => {
    setTimeout(() => {
      wireAutoLiveCountdown(target, { timerDisplayId, timerWrapId, badgeId, liveBadgeHtml });
    }, 100);
  });
  // These sections were added after the last filter pass — re-apply the
  // current sport/tournament selection so they respect it too.
  if (typeof smoApplyFilter === 'function') smoApplyFilter();
};

// Re-appends live + soonest-upcoming FanCode matches into the homescreen
// "Matches" preview grid (#fixtures-grid, built by renderFixtures()) —
// capped to 4 so the sheet-driven preview still leads. Card markup is the
// exact bare <a class="fx2-card"> anchor renderFixtures() itself uses (no
// timer block there either), so sizing matches the sheet cards exactly.
window.fcxAppendFixturesPreview = function(){
  const grid = document.getElementById('fixtures-grid');
  if (!grid) return;
  grid.querySelectorAll('.fcx-fixture-card').forEach(c => c.remove());
  // Same "today only" rule as the sheet-driven preview above.
  const list = (window._fcxMatchesCache || [])
    .filter(m => m.status !== 'COMPLETED')
    .filter(m => !fcxHasSheetCard(m)) // already shown as a sheet card — don't duplicate it here
    .filter(m => (typeof fcxIsTodayMatch === 'function') ? fcxIsTodayMatch(m) : true)
    .slice()
    // Sort FanCode matches: LIVE first, then UPCOMING by date (ascending/soonest first)
    .sort((a,b) => {
      const statusA = fcxStatusRank(a); // 0=LIVE, 1=UPCOMING, 2=COMPLETED
      const statusB = fcxStatusRank(b);
      if (statusA !== statusB) return statusA - statusB; // Primary sort by status
      return fcxStartMs(a) - fcxStartMs(b); // Secondary sort by time ascending
    })
    .slice(0, 4);
  if (!list.length) return;
  // Sheet had zero fixtures (just the empty-state box) — clear it and make
  // sure there's still a "View All" link through to the full Matches tab.
  const emptyBox = grid.querySelector('.smo-empty-box');
  if (emptyBox) emptyBox.remove();
  let viewAll = grid.querySelector('.fx2-viewall');
  if (!viewAll && !grid.children.length) {
    grid.insertAdjacentHTML('beforeend', `
    <a class="fx2-viewall" href="#sxTabPanels" onclick="event.preventDefault();openMatches();">
      <span class="fx2-viewall-arrow">→</span>
      <span class="fx2-viewall-text">VIEW ALL</span>
    </a>`);
    viewAll = grid.querySelector('.fx2-viewall');
  }
  const cardsHtml = list.map(m => {
    const isLive = m.status === 'LIVE';
    const tag = 'a';
    const clickAttr = isLive
      ? ` href="javascript:void(0)" onclick="return fcxOpenWatchById('${escJs(String(m.id))}')"`
      : ` href="javascript:void(0)" onclick="return fcxOpenWatchById('${escJs(String(m.id))}')"`;
    return `
    <${tag} class="fx2-card fcx-fixture-card" data-live="${isLive?'1':'0'}" data-start-ms="${fcxStartMs(m)}"${clickAttr}>
      <div class="fx2-thumb">
        <img loading=lazy decoding=async src="${m.image}" alt="${escJs(m.title)}" class="fx2-thumb-img" onerror="this.style.display='none'">
        ${isLive ? '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span>' : ''}
      </div>
      <div class="fx2-body">
        <div class="fx2-title-row">
          <div class="fx2-title">${m.title}</div>
          <span class="fx2-free">FREE</span>
        </div>
        <div class="fx2-meta">
          <span class="fx2-tag">${m.tournament||m.category||'Live Sports'}</span>
          <span class="fx2-date">${fcxFmtMatchTime(m)}</span>
        </div>
      </div>
    </${tag}>`;
  }).join('');
  if (viewAll) viewAll.insertAdjacentHTML('beforebegin', cardsHtml);
  else grid.insertAdjacentHTML('beforeend', cardsHtml);

  // The FanCode cards just added were inserted right before "View All" —
  // i.e. at the end of whatever sheet-driven cards render() already put
  // in the grid — regardless of live/start-time. Fully re-sort the whole
  // grid now that both sources are present: live first, then soonest
  // upcoming first (by countdown_to_iso_datetime for sheet cards / start
  // time for FanCode cards alike), same rule as the initial sheet-only
  // render.
  sxSortCardsLiveThenTime(
    Array.from(grid.children).filter(c => c !== viewAll && c.classList.contains('fx2-card')),
    c => grid.insertBefore(c, viewAll || null)
  );
};

// Re-appends the latest 3 FanCode matches as extra slides into the real,
// visible mobile hero carousel (#slides-container) — live matches first,
// then soonest-upcoming, so there's always something here even with
// nothing live right now. The desktop .hero-slide-card grid is hidden
// site-wide via CSS so it's skipped. Inserted right before the trailing
// "all channels" banner slide, which always stays last.
window.fcxAppendHeroSlides = function(){
  const container = document.getElementById('slides-container');
  if (!container || typeof totalSlides === 'undefined') return;
  container.querySelectorAll('.fcx-hero-slide').forEach(s => s.remove());
  container.querySelectorAll('.fcx-hero-dot').forEach(d => d.remove());
  const picks = (window._fcxMatchesCache || [])
    .filter(m => m.status !== 'COMPLETED')
    .filter(m => !fcxHasSheetCard(m)) // already shown as a sheet card — don't duplicate it here
    .slice()
    // Sort FanCode matches: LIVE first, then UPCOMING by date (ascending/soonest first)
    .sort((a,b) => {
      const statusA = fcxStatusRank(a); // 0=LIVE, 1=UPCOMING, 2=COMPLETED
      const statusB = fcxStatusRank(b);
      if (statusA !== statusB) return statusA - statusB; // Primary sort by status
      return fcxStartMs(a) - fcxStartMs(b); // Secondary sort by time ascending
    })
    .slice(0, 3);
  if (!picks.length) return;
  const slides = container.querySelectorAll(':scope > .slide');
  const bannerSlide = slides.length ? slides[slides.length - 1] : null;
  const dotsWrap = container.querySelector('.slide-dots');
  picks.forEach((m, j) => {
    const isLive = m.status === 'LIVE';
    const idx = totalSlides + j;
    const slide = document.createElement('div');
    slide.className = 'slide fcx-hero-slide';
    slide.dataset.origTitle = '';
    slide.innerHTML = `
      <div class="slide-bg" style="background-image:url('${m.image}')"></div>
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:14px;">
          <span class="slide-sport-badge${isLive?' slide-badge-live':''}">${isLive?'LIVE NOW':'⏰ '+fcxFmtMatchTime(m)}</span>
        </div>
        <div class="slide-title">${m.title}</div>
        <div class="slide-sub">${m.tournament||m.category||'Live Sports'}</div>
        <div class="slide-btns">
          ${fcxWatchBtnHtml(m, 'btn-slide-watch')}
        </div>
      </div>`;
    if (bannerSlide) container.insertBefore(slide, bannerSlide);
    else if (dotsWrap) container.insertBefore(slide, dotsWrap);
    else container.appendChild(slide);
    if (dotsWrap) {
      const dot = document.createElement('div');
      dot.className = 'dot fcx-hero-dot';
      dot.onclick = () => { goSlide(idx); startSlider(); };
      // Keep the trailing "all channels" banner dot last.
      if (dotsWrap.lastElementChild) dotsWrap.insertBefore(dot, dotsWrap.lastElementChild);
      else dotsWrap.appendChild(dot);
    }
  });
  totalSlides += picks.length;
};

;

'use strict';

/* CSV / Google Sheet loader moved to api.js */
// Looks across every plausible column name for the active/inactive flag,
// instead of only "active" then "active_true_false". This matters because
// toObj() only normalizes PUNCTUATION/CASE in a header, not its wording — if
// a sheet's column is literally spelled differently (extra word, renamed,
// typo'd) the old code silently fell through to "" (treated as active) and
// a FALSE row would keep showing up with no error anywhere.
const ACTIVE_FLAG_KEYS = ['active_true_false', 'active', 'is_active', 'isactive', 'enabled', 'show', 'visible'];
function activeFlagRaw(r) {
  for (const k of ACTIVE_FLAG_KEYS) {
    if (r[k] !== undefined && r[k] !== null && String(r[k]).trim() !== '') return r[k];
  }
  return '';
}
function isRowActive(r) {
  // Strip stray wrapping quotes (some sheet exports/CSV tools leave these
  // in) before comparing, then treat any of the common "off" spellings —
  // not just an exact "FALSE" — as inactive.
  const a = String(activeFlagRaw(r)).trim().replace(/^['"]+|['"]+$/g, '').toUpperCase();
  return a !== 'FALSE' && a !== 'NO' && a !== 'N' && a !== '0' && a !== 'OFF';
}
function active(rows) {
  if (!rows) return [];
  return rows.filter(isRowActive);
}

function setProgress(pct, text) { try { var m=document.getElementById('ldr-msg'); if(m && text) m.textContent=text; } catch(e){} }

// ── Slide auto-play ──────────────────────────────────────────
let slideInterval, currentSlide = 0, totalSlides = 0;
function goSlide(n) {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove('active','active-pair'));
  dots.forEach(d => d.classList.remove('active'));
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}
function startSlider() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => goSlide(currentSlide + 1), 5000);
}

// ── Countdown timers ─────────────────────────────────────────
// onComplete (optional) fires exactly once, the moment the countdown hits zero —
// used to auto-flip a card to LIVE without any manual CMS edit.
function startCountdown(el, target, onComplete) {
  let handle;
  let fired = false;
  function update() {
    if (!el.isConnected) { if (handle) clearInterval(handle); return; } // card was re-rendered away
    const diff = new Date(target) - Date.now();
    if (diff <= 0) {
      el.textContent = 'LIVE';
      if (handle) clearInterval(handle);
      if (!fired) { fired = true; if (onComplete) onComplete(); }
      return;
    }
    const d = Math.floor(diff/86400000),
          h = Math.floor((diff%86400000)/3600000),
          m = Math.floor((diff%3600000)/60000),
          s = Math.floor((diff%60000)/1000);
    // Hide leading zero units (days, then hours) — minutes and seconds
    // always stay visible even when they're 0.
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (d > 0 || h > 0) parts.push(`${h}h`);
    parts.push(`${m}m`);
    parts.push(`${s}s`);
    el.textContent = parts.join(' ');
  }
  update();
  handle = setInterval(update, 1000); // tick every second so seconds stay live
}

// Wires up a countdown so that when it hits zero, the badge auto-switches to
// LIVE and the "STARTS IN" timer is hidden — WITHOUT changing the layout, so
// the Watch Live button underneath never shifts position. The timer's space
// is preserved (visibility:hidden), only its content disappears.
function wireAutoLiveCountdown(target, opts) {
  const { timerDisplayId, timerWrapId, badgeId, liveBadgeHtml } = opts;
  const displayEl = document.getElementById(timerDisplayId);
  if (!displayEl) return;
  startCountdown(displayEl, target, () => {
    const wrapEl = document.getElementById(timerWrapId);
    if (wrapEl) wrapEl.style.visibility = 'hidden'; // keeps its space, button doesn't move
    const badgeEl = document.getElementById(badgeId);
    if (badgeEl) badgeEl.outerHTML = liveBadgeHtml;
  });
}

// ── Maintenance banner ───────────────────────────────────────
// Shown in place of a section's real content when the SETTINGS sheet has
// maintain_channels / maintain_matches = "YES". `reason` is that same
// settings row's "notes" column, shown as the reason for the maintenance.
function sxMaintenanceHtml(reason) {
  return `<div class="sx-maintenance-box">
    <div class="sx-maintenance-icon">🛠️</div>
    <div class="sx-maintenance-title">Under Maintenance</div>
    ${reason ? `<div class="sx-maintenance-note">${reason}</div>` : ''}
  </div>`;
}
// Reads a SETTINGS!value cell for `key`, trimmed/uppercased: "YES",
// "ISSUE", "NOTIFY", or "" if unset/anything else.
function sxSettingMode(key) {
  const v = (window._settings && window._settings[key]) || '';
  return v.toString().trim().toUpperCase();
}
function sxIsMaintenanceOn(key) {
  return sxSettingMode(key) === 'YES';
}
function sxMaintenanceReason(key) {
  return (window._settingsNotes && window._settingsNotes[key]) || '';
}
// Creates/updates/removes a small ISSUE or NOTIFY banner as a sibling
// placed immediately BEFORE the element at `anchorId` — never inside it —
// so re-rendering that element's innerHTML (search, filters, 30s
// auto-refresh) never wipes the banner back out. "YES" and "" both mean
// "no banner here" (YES uses the full-replace maintenance box instead,
// handled separately by the caller).
function sxUpsertNotice(anchorId, bannerId, mode, reason) {
  const anchor = document.getElementById(anchorId);
  if (!anchor || !anchor.parentNode) return;
  let banner = document.getElementById(bannerId);
  if (mode !== 'ISSUE' && mode !== 'NOTIFY') {
    if (banner) banner.remove();
    return;
  }
  // NOTIFY with nothing to say has nothing to show.
  if (mode === 'NOTIFY' && !reason) {
    if (banner) banner.remove();
    return;
  }
  if (!banner) {
    banner = document.createElement('div');
    banner.id = bannerId;
    anchor.parentNode.insertBefore(banner, anchor);
  }
  if (mode === 'ISSUE') {
    banner.className = 'sx-issue-banner';
    banner.innerHTML = `<span class="sx-issue-icon">⚠️</span><span class="sx-issue-text">${reason || 'Some playback issues may be affecting this section right now.'}</span>`;
  } else {
    banner.className = 'sx-notify-banner';
    banner.innerHTML = `<span class="sx-notify-icon">🔔</span><span class="sx-notify-text">${reason}</span>`;
  }
}

// ── Image with fallback ──────────────────────────────────────
function img(src, alt, cls='', fb='') {
  if (!src) return fb ? `<span style="font-size:32px">${fb}</span>` : '';
  return `<img loading=lazy decoding=async src="${src}" alt="${alt}" class="${cls}" onerror="this.style.display='none'">`;
}

// ── RENDER FUNCTIONS ─────────────────────────────────────────

function renderSettings(rows) {
  if (!rows) return;
  const s = {};
  const notes = {};
  rows.forEach(r => {
    if (r.setting_key) {
      s[r.setting_key] = r.value;
      // The SETTINGS sheet's own "notes" column, on that same row, is used
      // as the maintenance reason for maintain_channels / maintain_matches
      // (and is available generically for any other setting_key too).
      if (r.notes !== undefined && r.notes !== '') notes[r.setting_key] = r.notes;
    }
  });
  window._settings = s;
  window._settingsNotes = notes;

  // NOTE: every DOM write below is null-guarded on purpose. Previously several
  // lines called .textContent/.src straight on document.getElementById(...)
  // with no null check — the moment ANY one of those ids was missing from the
  // page (e.g. the ticker bar, which has now been removed entirely) it threw
  // and silently killed every setting queued after it in this function
  // (icon_url, footer, QR, etc. never got applied). Guarding each one means a
  // single missing/renamed element can no longer take the rest down with it.
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el[attr] = val; };

  if (s.site_title)      { document.title = s.site_title; setText('page-title', s.site_title); }
  if (s.site_favicon_url){ setAttr('favicon', 'href', s.site_favicon_url); }
  if (s.ticker_label)    { setText('ticker-label', s.ticker_label); } // ticker bar removed — no-op if absent
  if (s.youtube_url)     { const b = document.getElementById('yt-btn'); if (b) { b.href = s.youtube_url; b.textContent = `▶ ${s.youtube_label||'YouTube'}`; } }
  if (s.cta_title)       { setText('cta-title', s.cta_title); }
  if (s.cta_subtitle)    { setText('cta-sub', s.cta_subtitle); }
  if (s.cta_btn1_text)   { const b = document.getElementById('cta-btn1'); if (b) { b.textContent = s.cta_btn1_text; b.href = s.cta_btn1_url||'#'; } }
  if (s.cta_btn2_text)   { const b = document.getElementById('cta-btn2'); if (b) { b.textContent = s.cta_btn2_text; b.href = s.cta_btn2_url||'#'; } }
  if (s.social_bar_text) { setText('social-text', s.social_bar_text); }
  if (s.footer_tagline)  { setText('footer-tagline', s.footer_tagline); }
  if (s.footer_copy)     { setText('footer-copy', s.footer_copy); }
  /* footer logo is a fixed site asset now — no sheet override */
  if (s.qr_title)        { setText('qr-title', s.qr_title); }
  if (s.qr_sub)          { setText('qr-sub', s.qr_sub); }
  if (s.qr_image_url)    { setAttr('qr-img', 'src', s.qr_image_url); }
  if (s.qr_btn_text)     { const b = document.getElementById('qr-btn'); if (b) { b.textContent = s.qr_btn_text; b.href = s.qr_btn_url||'#'; } }
  if (s.watch_popup_footer){ setText('watch-modal-footer', s.watch_popup_footer); }

  // Logo — nav bar, drawer, header watermark and footer all use the same
  // fixed asset as the loading screen. Deliberately NOT sheet-driven: the
  // icon_url / footer_icon_url columns are ignored so the brand mark can
  // never go missing or change from a CMS edit.
}

function renderTicker(rows) {
  if (!rows) return;
  const track = document.getElementById('ticker-track');
  if (!track) return; // ticker bar removed from markup — nothing to render into
  const items = active(rows);
  const html = [...items, ...items].map(r =>
    `<div class="ticker-item"><span>●</span> ${r.emoji||''} ${r.text}</div>`
  ).join('');
  track.innerHTML = html;
}

function renderNav(rows) {
  // NOTE: nav is now hardcoded to match the requested bar
  // (Home / Live TV / Matches / OTT) instead of reading
  // labels from the NAVBAR sheet. Sheet rows are ignored here on purpose.
  const desktop = document.getElementById('nav-desktop');
  const drawerNav = document.getElementById('drawer-nav');
  const NAV_ITEMS = [
    { label:'Home',     href:'#', sxtab:'home', onclick:"goHome();return false;" },
    { label:'Live TV',  href:'#sxTabPanels', sxtab:'livetv', onclick:"openLiveTV();return false;" },
    { label:'Matches',  href:'#sxTabPanels', sxtab:'matches', onclick:"sxSwitchTab('matches');return false;" },
    { label:'Search',   href:'#sxTabPanels', sxtab:'search', onclick:"openSxSearch();return false;" },
    { label:'Favourites', href:'#sxTabPanels', sxtab:'favourites', onclick:"openFavourites();return false;" },
    { label:'OTT',      href:'#sxTabPanels', sxtab:'ott', onclick:"openOTT();return false;" },
  ];
  let dHtml = '', mHtml = '';
  NAV_ITEMS.forEach((r, i) => {
    const activeCls = i===0 ? ' class="active"' : '';
    const target = r.blank ? ' target="_blank" rel="noopener"' : '';
    const click = r.onclick ? ` onclick="${r.onclick}"` : '';
    const sxtab = r.sxtab ? ` data-sxtab="${r.sxtab}"` : '';
    dHtml += `<a href="${r.href}"${activeCls}${sxtab}${target}${click}>${r.label}</a>`;
    const mclick = r.onclick ? ` onclick="closeDrawer();${r.onclick}"` : ' onclick="closeDrawer()"';
    mHtml += `<a href="${r.href}"${sxtab}${target}${mclick}>${r.label}</a>`;
  });
  // GOLD — hamburger drawer only (desktop already has the header button)
  mHtml += `<a href="#" class="drawer-vip" onclick="closeDrawer();openVip();return false;"><span class="drawer-vip-icon"><svg viewBox="0 0 24 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.5a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zm20 0a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zm-10-2a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zM2 7.8l4.6 3.4L12 5l5.4 6.2L22 7.8 20 17H4L2 7.8z"/></svg></span>GOLD</a>`;
  desktop.innerHTML = dHtml;
  drawerNav.innerHTML = mHtml;
  // MOVIES — reuses the nav-movies-link / drawer-movies styling that was
  // already defined for this (previously pointed offsite); now opens the
  // in-site VidAPI-powered Movies overlay instead.
  desktop.innerHTML += `<a href="#" class="nav-movies-link" data-sxtab="movies" onclick="openMoviesOverlay();return false;"><img loading=lazy decoding=async class="movies-logo-icon" src="https://static.vecteezy.com/system/resources/thumbnails/050/699/896/small/movie-night-illustration-cinema-poster-concept-banner-design-for-movie-theater-png.png" alt="Movies">MOVIES</a>`;
  drawerNav.innerHTML += `<a href="#" class="drawer-movies" data-sxtab="movies" onclick="closeDrawer();openMoviesOverlay();return false;"><img loading=lazy decoding=async class="movies-logo-icon" src="https://static.vecteezy.com/system/resources/thumbnails/050/699/896/small/movie-night-illustration-cinema-poster-concept-banner-design-for-movie-theater-png.png" alt="Movies">MOVIES</a>`;
}
function renderNav_CMS_UNUSED(rows) {
  if (!rows) return;
  const items = active(rows);
  const desktop = document.getElementById('nav-desktop');
  const drawerNav = document.getElementById('drawer-nav');
  let dHtml = '', mHtml = '';
  items.forEach(r => {
    const t = (r.type||'normal').toLowerCase();
    const cls = t==='live' ? 'nav-live-btn' : t==='watch' ? 'nav-watch-btn' : '';
    const mCls = t==='live' ? 'drawer-live' : t==='watch' ? 'drawer-watch' : '';
    const active = r.active_true_false === 'TRUE' ? ' class="active"' : '';
    dHtml += `<a href="${r.href||'#'}" class="${cls}"${active}>${r.label}</a>`;
    mHtml += `<a href="${r.href||'#'}" class="${mCls}" onclick="closeDrawer()">${r.label}</a>`;
  });
  dHtml += `<a href="https://saptarshiorg.github.io/movies/" target="_blank" rel="noopener" class="nav-movies-link"><img loading=lazy decoding=async class="movies-logo-icon" src="https://static.vecteezy.com/system/resources/thumbnails/050/699/896/small/movie-night-illustration-cinema-poster-concept-banner-design-for-movie-theater-png.png" alt="Movies">MOVIES</a>`;
  mHtml += `<a href="https://saptarshiorg.github.io/movies/" target="_blank" rel="noopener" class="drawer-movies" onclick="closeDrawer()"><img loading=lazy decoding=async class="movies-logo-icon" src="https://static.vecteezy.com/system/resources/thumbnails/050/699/896/small/movie-night-illustration-cinema-poster-concept-banner-design-for-movie-theater-png.png" alt="Movies">MOVIES</a>`;
  desktop.innerHTML = dHtml;
  drawerNav.innerHTML = mHtml;
}

// ── Hero banner "#" routing ─────────────────────────────────────────────
// HERO SLIDES sheet: if a row's btn1_url is exactly "#", its "location"
// column (livetv / matches / fancode / fifa) sends the click to that
// in-site panel instead of trying to open a stream player with "#".
// Any other btn1_url value plays as a normal stream, same as before.
function sxHeroWatch(url, location, title) {
  const u = (url || '').trim();
  if (u === '#') {
    const loc = (location || '').trim().toLowerCase();
    if (loc === 'ott')      { openOTT(); return; }
    if (loc === 'fancode') { openFanCode(); return; }
    if (loc === 'prime') { openPrime(); return; }
    if (loc === 'willow') { openWillow(); return; }
    if (loc === 'fifa')    { openFifa(); return; }
    if (loc === 'livetv')  { openLiveTV(); return; }
    if (loc === 'matches') { sxSwitchTab('matches'); return; }
    return; // blank/unrecognised location — do nothing rather than break
  }
  openStreamPlayer(u, title, 'stream');
}

function renderSlides(rows, channelRows) {
  const slides = active(rows || []);

  // ── DESKTOP: Hotstar-style 1:1 cards ───────────────────────
  const track = document.getElementById('hero-cards-track');
  const cardDotsEl = document.getElementById('hero-card-dots');
  if (track) {
    let cardHtml = '';
    slides.forEach((s, i) => {
      const liveBadge = s.show_live_badge === 'TRUE'
        ? `<span class="hsc-live-badge">LIVE</span>` : '';
      const btn2 = s.btn2_text
        ? `<a href="${s.btn2_url||'#'}" class="hsc-btn-outline" target="_blank" rel="noopener">${s.btn2_text}</a>` : '';
      cardHtml += `
      <div class="hero-slide-card${i===0?' active-card':''}" data-orig-title="${encodeURIComponent(s.title||'')}" onclick="sxHeroWatch('${escJs(s.btn1_url||'#')}','${escJs(s.location||'')}','${escJs(s.title||'Live Stream')}')">
        <div class="hsc-banner">
          <div class="hsc-banner-bg" style="background-image:url('${s.bg_image_url}')"></div>
          <div class="hsc-banner-overlay"></div>
          <div class="hsc-badge-row">
            <span class="hsc-sport-badge">${s.sport_badge||''}</span>
            ${liveBadge}
          </div>
        </div>
        <div class="hsc-info">
          <div>
            <div class="hsc-title">${s.title||''}</div>
            <div class="hsc-sub">${s.subtitle||''}</div>
          </div>
          <div class="hsc-btn-row">
            <a href="#" class="hsc-btn-watch" onclick="event.preventDefault();event.stopPropagation();sxHeroWatch('${escJs(s.btn1_url||'#')}','${escJs(s.location||'')}','${escJs(s.title||'Live Stream')}')">▶ ${s.btn1_text||'Watch'}</a>
            ${btn2}
          </div>
        </div>
      </div>`;
    });
    track.innerHTML = cardHtml;
    // card dots (visual indicator only, scrolls to card)
    if (cardDotsEl) {
      cardDotsEl.innerHTML = slides.map((_, i) =>
        `<button class="dot${i===0?' active':''}" onclick="scrollToCard(${i})"></button>`
      ).join('');
    }
    // Intersection observer to update active dot
    setTimeout(() => {
      const cards = track.querySelectorAll('.hero-slide-card');
      const dots = cardDotsEl ? cardDotsEl.querySelectorAll('.dot') : [];
      const wrap = document.getElementById('hero-cards-track-wrap');
      if (wrap && cards.length > 1) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const idx = [...cards].indexOf(entry.target);
              cards.forEach(c => c.classList.remove('active-card'));
              dots.forEach(d => d.classList.remove('active'));
              entry.target.classList.add('active-card');
              if (dots[idx]) dots[idx].classList.add('active');
            }
          });
        }, { root: wrap, threshold: 0.75 });
        cards.forEach(c => obs.observe(c));
      }
    }, 200);
  }

  window.scrollToCard = function(idx) {
    const cards = document.querySelectorAll('.hero-slide-card');
    if (cards[idx]) cards[idx].scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  };

  // ── MOBILE: full-width slides ───────────────────────────────
  const container = document.getElementById('slides-container');
  if (!container) return;
  let html = '';
  slides.forEach((s, i) => {
    const isLive = s.show_live_badge === 'TRUE';
    const heroBadge = isLive
      ? `<span class="slide-sport-badge slide-badge-live">LIVE NOW</span>`
      : (s.sport_badge ? `<span class="slide-sport-badge">${s.sport_badge}</span>` : '');
    const btn2 = s.btn2_text ? `<a href="${s.btn2_url||'#'}" class="btn-slide-outline" target="_blank" rel="noopener">${s.btn2_text}</a>` : '';
    html += `
    <div class="slide${i===0?' active':''}" data-orig-title="${encodeURIComponent(s.title||'')}">
      <div class="slide-bg" style="background-image:url('${s.bg_image_url}')"></div>
      <div class="slide-overlay"></div>
      <div class="slide-content" id="slide-content-${i}">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:14px;">
          ${heroBadge}
        </div>
        <div class="slide-title">${s.title||''}</div>
        <div class="slide-sub">${s.subtitle||''}</div>
        <div class="slide-btns">
          <a href="#" class="btn-slide-watch" onclick="event.preventDefault();sxHeroWatch('${escJs(s.btn1_url||'#')}','${escJs(s.location||'')}','${escJs(s.title||'Live Stream')}')">${s.btn1_text||'Watch Now'}</a>
          ${btn2}
        </div>
      </div>
    </div>`;
  });
  const dotsHtml = slides.map((_, i) =>
    `<div class="dot${i===0?' active':''}" onclick="goSlide(${i});startSlider()"></div>`
  ).join('');

  // ── Channels banner — always appended as the LAST slide in the
  //    rotation (lowest priority), after every real hero slide. If the
  //    sheet has zero active rows this ends up being the only slide.
  //    Only channels with a real logo are used (no generic placeholder
  //    icon), laid out as a full-bleed wall behind the title/button —
  //    same visual weight as a normal hero slide's background image.
  const channels = active(channelRows || []).filter(ch => (ch.icon_url || '').trim()).slice(0, 60);
  const logosHtml = channels.map(ch =>
    `<div class="hfl-logo" title="${escJs(ch.channel_name || '')}"><img loading=lazy decoding=async src="${ch.icon_url}" alt="${escJs(ch.channel_name || '')}" onerror="this.parentElement.style.display='none'"></div>`
  ).join('');
  const bannerIdx = slides.length;
  html += `
    <div class="slide${bannerIdx===0?' active':''}" data-orig-title="">
      <div class="slide-bg"></div>
      ${channels.length ? `<div class="hero-fallback-logowall">${logosHtml}</div>` : ''}
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:14px;">
          <span class="slide-sport-badge">LIVE CHANNELS</span>
        </div>
        <div class="slide-title">All Your Channels, One Tap Away</div>
        <div class="slide-sub">${channels.length ? `${channels.length}+ live channels ready to stream.` : 'Live channels ready to stream.'}</div>
        <div class="slide-btns">
          <a href="#" class="btn-slide-watch" onclick="event.preventDefault();openLiveTV()">Watch Live TV</a>
        </div>
      </div>
    </div>`;
  const allDotsHtml = dotsHtml + `<div class="dot${bannerIdx===0?' active':''}" onclick="goSlide(${bannerIdx});startSlider()"></div>`;


  container.innerHTML = html + `<div class="slide-dots">${allDotsHtml}</div>` + `
<div id="sxHeroOverride" class="sx-hero-override">
  <div class="slide-bg" id="sxHeroOverrideBg"></div>
  <div class="slide-overlay"></div>
  <div class="slide-content">
    <div class="slide-title" id="sxHeroOverrideTitle"></div>
    <div class="slide-sub" id="sxHeroOverrideSub"></div>
  </div>
</div>`;
  totalSlides = slides.length + 1;
  currentSlide = 0;
  goSlide(0);
  startSlider();
}

// ── Route match-card links: a real URL opens in a new tab as before.
//    Any "#" link (empty, "#", or "#some-section") now stays on THIS
//    site (same tab, no new window) and jumps straight to that section —
//    e.g. "#fifa-panel" switches to the FIFA tab, "#wt20-panel" switches
//    to the WT20 tab, anything else scrolls to that element on the page.
function escJs(s) { return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function matchWatchHref(url) {
  const u = (url || '').trim();
  return (u && u !== '#') ? u : '#channels-section';
}
function matchWatchTarget(url) {
  return '_self';
}
function sxGoToMatchUrl(e, rawUrl, name) {
  const target = matchWatchHref(rawUrl);
  if (target.charAt(0) !== '#') {
    if (e && e.preventDefault) e.preventDefault();
    openStreamPlayer(target, name || 'Live Stream', 'match');
    return false;
  }
  if (target.charAt(0) === '#') {
    if (e && e.preventDefault) e.preventDefault();
    const hash = target.slice(1);
    const tabMap = { 'fifa-panel': 'fifa', 'fancode-panel': 'fancode', 'prime-panel': 'prime', 'willow-panel': 'willow', 'matches-panel': 'matches' };
    if (hash === 'livetv-panel') {
      openLiveTV();
    } else if (tabMap[hash]) {
      sxSwitchTab(tabMap[hash]);
    } else {
      openLiveTV();
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    return false;
  }
  return true;
}

// ── Multi-server support for MATCH CARDS ─────────────────────────────
// Sheet tab "MATCH CARDS" can have up to 5 server slots per row:
//   btn_url / btn_text  →  Server 1 (falls back to "Server 1" if btn_text blank)
//   btn_url_2 / btn_text_2  →  Server 2
//   btn_url_3 / btn_text_3  →  Server 3
//   btn_url_4 / btn_text_4  →  Server 4
//   btn_url_5 / btn_text_5  →  Server 5
// Blank / "#" slots are ignored. Tapping "Watch Now" always opens the
// full-screen match watch screen (match details on the left, server
// list on the right) as long as at least one server URL is filled —
// even with just one server, the screen still opens (single entry
// list) instead of playing directly.
function sxGetMatchServers(m) {
  m = m || {};
  const raw = [
    { url: m.btn_url,   text: m.btn_text   || 'Server 1' },
    { url: m.btn_url_2, text: m.btn_text_2 || 'Server 2' },
    { url: m.btn_url_3, text: m.btn_text_3 || 'Server 3' },
    { url: m.btn_url_4, text: m.btn_text_4 || 'Server 4' },
    { url: m.btn_url_5, text: m.btn_text_5 || 'Server 5' }
  ];
  // FanCode when the sheet row had no free slot left
  if (m._fcxOverflow && typeof fcxJsUrl === 'function') raw.push({ url: fcxJsUrl(m._fcxOverflow), text: 'FanCode' });
  // Extra servers folded in by the LMX merge layer (SonyLIV languages, SonyLIV channels, ...)
  // — no 5-slot limit, de-duplicated by URL.
  (m._lmxServers || []).forEach(function(x){
    if (!raw.some(function(r){ return r.url && String(r.url).trim() === x.url; }))
      raw.push({ url: x.url, text: x.text, icon: x.icon, sub: x.sub, playName: x.playName, appOnly: !!x.appOnly });
  });
  
  // AUTO-CONNECT LOGIC: If a server name matches LIVE CHANNELS but has no URL,
  // auto-fill it with the channel's watch_url
  const liveChannels = window._cmsChannels || [];
  raw.forEach(server => {
    const serverName = (server.text || '').trim().toLowerCase();
    // If server has no URL, try to find matching LIVE CHANNELS entry
    if ((!server.url || !String(server.url).trim() || String(server.url).trim() === '#') && serverName) {
      const matchedChannel = liveChannels.find(c => 
        (c.channel_name || '').trim().toLowerCase() === serverName
      );
      if (matchedChannel && matchedChannel.watch_url) {
        server.url = matchedChannel.watch_url;
        server.auto_connected = true; // Mark as auto-connected
      }
    }
  });
  
  const servers = raw.filter(s => s.url && String(s.url).trim() && String(s.url).trim() !== '#');
  // The FanCode entry (see fcxAugmentSheetCards) was filled in from
  // whatever FanCode's feed said up to 30s ago — re-check its live status
  // fresh, right now, so the watch screen only lets "Watch Now" actually
  // work once the match has actually started.
  if (typeof fcxFindSheetMatch === 'function') {
    const fm = fcxFindSheetMatch(m);
    servers.forEach(s => {
      if ((s.text || '').trim().toLowerCase() === 'fancode') {
        s.fcxLive = !!fm && fm.status === 'LIVE';
        s.fcxTime = (fm && typeof fcxFmtMatchTime === 'function') ? fcxFmtMatchTime(fm) : '';
      }
    });
  }
  return servers;
}
// URI-encoded JSON of a match row's server list — safe to drop straight into
// a single-quoted string inside an inline onclick="" attribute (no raw
// quotes/backslashes survive encodeURIComponent).
function sxServersEnc(m) { return encodeURIComponent(JSON.stringify(sxGetMatchServers(m))); }

// Match a MATCH CARDS server label (btn_text, e.g. "Star Sports 1") against
// the LIVE TV CMS channel list (window._cmsChannels, from the LIVE TV sheet
// tab) by channel_name — case/whitespace-insensitive exact match. Returns
// that channel's icon_url if found, else '' (caller falls back to the
// plain numbered badge).
function sxFindLiveTvLogoForLabel(label) {
  const n = (label || '').trim().toLowerCase();
  if (!n) return '';
  const list = window._cmsChannels || [];
  const hit = list.find(c => (c.channel_name || '').trim().toLowerCase() === n);
  return (hit && hit.icon_url) || '';
}

// Keyword-based server-logo fallback: when a server's label (btn_text /
// FanCode title) mentions a known broadcaster — even loosely, not an exact
// LIVE TV channel-name match — swap in that broadcaster's logo instead of
// the plain numbered badge. Checked in this order: SonyLIV / Sony first,
// then Star Sports / Hotstar / Star.
const SX_SERVER_KEYWORD_LOGOS = [
  { re: /sony|sliv/i,              url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/SonyLIV_2020.png' },
  { re: /star|hotstar/i,           url: 'https://i.pinimg.com/originals/3d/65/03/3d650388af374546ea7341abb6d57f00.png' }
];
function sxServerKeywordLogo(label) {
  const n = (label || '').trim();
  if (!n) return '';
  for (const { re, url } of SX_SERVER_KEYWORD_LOGOS) {
    if (re.test(n)) return url;
  }
  return '';
}

// URI-encoded JSON of the match-detail fields shown on the left panel of
// the full-screen watch screen. Same encodeURIComponent trick so it can
// sit inside an inline onclick="" attribute without breaking on quotes.
function sxMatchInfoEnc(m, name) {
  m = m || {};
  const info = {
    name: name || '',
    team1_code: m.team1_code || '', team1_full_name: m.team1_full_name || '', team1_icon_url: m.team1_icon_url || '',
    team2_code: m.team2_code || '', team2_full_name: m.team2_full_name || '', team2_icon_url: m.team2_icon_url || '',
    date_label: smoCardDateLabel(m), details: m.details || '',
    countdown: m.countdown_to_iso_datetime || m.countdown_to || '',
    status: matchStatusText(m).toLowerCase(),
    banner: m.banner_url || m.banner_image_url || m._fcxBanner || ''
  };
  return encodeURIComponent(JSON.stringify(info));
}

// Shared "Watch Now" control for sheet MATCH CARDS rows (Matches tab,
// home fixtures preview, hero slides) — same gating FanCode's own cards
// use: before kickoff it just shows the scheduled date/time (not
// clickable), and only turns into a real, working Watch Now once the
// match is actually live (or once it's finished, shows that instead).
function sxWatchBtnHtml(c, cls) {
  cls = cls || 'smo-btn';
  const status = matchStatusText(c).toLowerCase();
  const label = (c.team1_code||'')+' vs '+(c.team2_code||'');
  if (status === 'live') {
    return `<a class="${cls}" href="${matchWatchHref(c.btn_url)}" onclick="return sxHandleMatchWatch(event,'${sxServersEnc(c)}','${escJs(c.btn_url)}','${escJs(label)}','${sxMatchInfoEnc(c,label)}')">▶ Watch Now</a>`;
  }
  if (isMatchFinished(c)) {
    return `<a class="${cls}" href="javascript:void(0)" style="opacity:.6;" onclick="return sxHandleMatchWatch(event,'${sxServersEnc(c)}','${escJs(c.btn_url)}','${escJs(label)}','${sxMatchInfoEnc(c,label)}')">MATCH OVER</a>`;
  }
  // Not started yet — clicking still opens the server selector; the watch
  // screen itself carries the red "Match will be live at …" notice.
  return `<a class="${cls}" href="javascript:void(0)" onclick="return sxHandleMatchWatch(event,'${sxServersEnc(c)}','${escJs(c.btn_url)}','${escJs(label)}','${sxMatchInfoEnc(c,label)}')">⏰ ${smoCardDateLabel(c) || 'UPCOMING'}</a>`;
}

// "Match will be live at …" time string for the watch screen's red notice.
// Full date + time for a sheet MATCH CARDS row's card meta line — same
// "DD MON, H:MM AM/PM" style FanCode's own cards use, computed from the
// sheet's countdown_to_iso_datetime/countdown_to column when present, so
// normal cards show a real time instead of just whatever short text the
// sheet's date_label column happens to hold. Falls back to date_label
// (then '') if there's no usable ISO datetime.
function smoCardDateLabel(c) {
  const iso = (c && (c.countdown_to_iso_datetime || c.countdown_to) || '').trim();
  if (iso) {
    const d = new Date(iso);
    if (!isNaN(d.getTime())) {
      const dp = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase();
      let h = d.getHours();
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ap = h >= 12 ? 'PM' : 'AM';
      h = h % 12; if (h === 0) h = 12;
      return `${dp}, ${h}:${mm} ${ap}`;
    }
  }
  return (c && c.date_label) || '';
}
window.smoCardDateLabel = smoCardDateLabel;

// Prefers the exact scheduled ISO datetime, falling back to whatever the
// sheet's date_label says.
function sxFmtMatchStartTime(info) {
  const iso = (info && info.countdown || '').trim();
  if (iso) {
    const d = new Date(iso);
    if (!isNaN(d.getTime())) {
      const dp = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase();
      let h = d.getHours();
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ap = h >= 12 ? 'PM' : 'AM';
      h = h % 12; if (h === 0) h = 12;
      return `${dp}, ${h}:${mm} ${ap}`;
    }
  }
  return (info && info.date_label) || 'the scheduled time';
}

// Card click / Watch Now handler — routes to the full-screen match watch
// screen when there's more than one server, otherwise falls straight
// through to sxGoToMatchUrl exactly like before. serversEnc / matchInfoEnc
// are URI-encoded JSON strings built by sxServersEnc / sxMatchInfoEnc.
/* Redirect links: URLs that must open on their own site instead of the in-app player
   (YouTube channel / @handle / streams / watch / youtu.be pages — NOT /embed/ links). */
function sxIsRedirectUrl(url) {
  const u = String(url || '').trim();
  if (!/^https?:\/\//i.test(u)) return false;
  let p; try { p = new URL(u); } catch (err) { return false; }
  const h = p.hostname.replace(/^(www|m)\./, '');
  if (h === 'youtu.be') return true;
  if (h === 'youtube.com') return !/^\/embed\//.test(p.pathname);
  return false;
}
function sxRedirectTo(url) {
  const w = window.open(url, '_blank', 'noopener');
  if (!w) window.location.href = url; // popup blocked -> same tab
}

function sxHandleMatchWatch(e, serversEnc, fallbackUrl, name, matchInfoEnc) {
  let servers = [];
  try { servers = JSON.parse(decodeURIComponent(serversEnc || '')); } catch (err) { servers = []; }
  // Always open the server selector — even when the card has NO stream
  // links yet (the selector then shows an empty "no servers" state).
  if (e && e.preventDefault) e.preventDefault();
  if (e && e.stopPropagation) e.stopPropagation();
  // Redirect-only links (YouTube channel/streams/watch pages) can't be embedded:
  // if the match's only stream is one of these, go straight to YouTube.
  const _valid = (servers || []).filter(function (sv) { return sv && sv.url && String(sv.url).trim(); });
  if (_valid.length === 1 && sxIsRedirectUrl(_valid[0].url)) { sxRedirectTo(_valid[0].url); return false; }
  if (!_valid.length && sxIsRedirectUrl(fallbackUrl)) { sxRedirectTo(fallbackUrl); return false; }
  let info = { name };
  try { info = JSON.parse(decodeURIComponent(matchInfoEnc || '')); } catch (err) { /* keep fallback */ }
  openMatchWatchScreen(servers || [], info);
  return false;
}

function openMatchWatchScreen(servers, info) {
  info = info || {};
  const label = info.name || 'Live Stream';

  const isLive = info.status === 'live';
  const isFinished = info.status === 'finished';
  const uid = Math.random().toString(36).slice(2);
  const badgeId = 'mws-badge-' + uid;
  const liveBadgeHtml = `<div class="smo-live-badge" id="${badgeId}"><div class="live-dot-r"></div>LIVE</div>`;
  const badgeHtml = isLive
    ? liveBadgeHtml
    : isFinished
      ? `<div class="smo-upcoming-badge" id="${badgeId}">FINISHED</div>`
      : `<div class="smo-upcoming-badge" id="${badgeId}">⏰ UPCOMING</div>`;

  const showTimer = !isLive && !isFinished && info.countdown;
  const timerId = 'mws-timer-' + uid;
  const timerWrapId = 'mws-timerwrap-' + uid;

  // No team logos to show (common for FanCode matches, which are single-
  // image events, not two-team fixtures) — fall back to a full-screen
  // banner image instead of the empty team-vs-team layout, with the
  // badge/details/date/timer block kept exactly as-is underneath it.
  const noTeamLogos = !info.team1_icon_url && !info.team2_icon_url;
  const bannerSrc = info.banner || '';
  const leftEl = document.getElementById('mwsLeft');
  if (leftEl) {
    const infoBlock = `
      <div class="mws-badge-row">${badgeHtml}</div>
      ${info.details ? `<div class="mws-details">${info.details}</div>` : ''}
      ${info.date_label ? `<div class="mws-date">${info.date_label}</div>` : ''}
      ${showTimer ? `<div id="${timerWrapId}"><div class="mws-timer-label">Starts in</div><div class="mws-timer" id="${timerId}">--:--:--</div></div>` : ''}
    `;
    if (noTeamLogos) {
      leftEl.classList.add('mws-left-banner');
      leftEl.innerHTML = `
        ${bannerSrc ? `<img loading=lazy decoding=async class="mws-fallback-banner" src="${bannerSrc}" alt="${label}" onerror="this.style.display='none'">` : ''}
        <div class="mws-fallback-scrim"></div>
        <div class="mws-fallback-content">
          ${infoBlock}
        </div>
      `;
      renderMwsMoreLive(info);
    } else {
      const oldMoreLive = document.getElementById('mwsMoreLive');
      if (oldMoreLive) oldMoreLive.remove();
      leftEl.classList.remove('mws-left-banner');
      leftEl.innerHTML = `
        ${infoBlock}
        <div class="mws-teams">
          <div class="mws-team">
            ${img(info.team1_icon_url, '', 'mws-team-logo', '')}
            <div class="mws-team-code">${info.team1_code || ''}</div>
            <div class="mws-team-full">${info.team1_full_name || ''}</div>
          </div>
          <div class="mws-vs">VS</div>
          <div class="mws-team">
            ${img(info.team2_icon_url, '', 'mws-team-logo', '')}
            <div class="mws-team-code">${info.team2_code || ''}</div>
            <div class="mws-team-full">${info.team2_full_name || ''}</div>
          </div>
        </div>
      `;
    }
  }
  if (showTimer) {
    setTimeout(() => {
      wireAutoLiveCountdown(info.countdown, { timerDisplayId: timerId, timerWrapId, badgeId, liveBadgeHtml });
    }, 30);
  }

  const bgEl = document.getElementById('mwsBg');
  const bgSrc = info.team1_icon_url || bannerSrc || '';
  if (bgEl) bgEl.style.backgroundImage = bgSrc ? `url('${bgSrc}')` : '';

  const titleEl = document.getElementById('mwsRightTitle');
  if (titleEl) titleEl.textContent = label;

  const body = document.getElementById('mwsRightBody');
  if (body) {
    // FanCode (auto-cross-linked from a matching FanCode stream, see
    // fcxAugmentSheetCards) always lists first, with its own logo and a
    // gold "High Priority" badge, ahead of the sheet's own servers.
    const FCX_LOGO = 'https://www.fancode.com/skillup-uploads/fc-web-logo/fc_logo_white_bg.svg';
    // Locked-state icon for the FanCode server row — a plain SVG lock, not
    // the clock emoji it used to show (no time icon needed there, and no
    // emoji-based icons in this row at all).
    const MWS_LOCK_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
    // Ready-to-play icon for every server row — a proper filled SVG
    // triangle in a soft magenta disc, not the plain "▶" glyph (which
    // renders inconsistently across fonts/platforms and looks flat).
    const MWS_PLAY_SVG = '<span class="mws-play-disc"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.72L9.5 4.27A1 1 0 0 0 8 5.14z"/></svg></span>';
    const isFcxServer = s => (s.text || '').trim().toLowerCase() === 'fancode';
    const sortedServers = (servers || []).slice().sort((a, b) => (isFcxServer(a) ? 0 : 1) - (isFcxServer(b) ? 0 : 1));
    // Match hasn't started yet — the server list still opens, topped with a
    // red notice telling the visitor exactly when it goes live.
    // Kickoff gate — applies to the WHOLE list, FanCode and sheet servers
    // alike. Until the match actually starts, nothing here is playable.
    const matchNotStarted = !isLive && !isFinished;
    const startText = sxFmtMatchStartTime(info);
    window._mwsLockMsg = 'Match will be live at ' + startText;
    const notLiveNotice = matchNotStarted
      ? `<div class="mws-notlive">⏰ Match will be live at ${startText}</div>`
      : '';
    // Sheet/Live-TV servers unlock 30 minutes before kickoff (or once the
    // match is live/finished) — they don't need the actual live signal
    // FanCode's own row still requires. FanCode itself only ever unlocks
    // via its own API status (s.fcxLive, checked below), never early.
    const MWS_PREMATCH_UNLOCK_MS = 30 * 60 * 1000; // 30 minutes
    const mwsStartMs = (() => {
      const d = new Date((info && info.countdown) || '');
      return isNaN(d.getTime()) ? null : d.getTime();
    })();
    const sheetServersLocked = !isLive && !isFinished &&
      !(mwsStartMs !== null && Date.now() >= mwsStartMs - MWS_PREMATCH_UNLOCK_MS);
    body.innerHTML = notLiveNotice + sortedServers.map((s, i) => {
      const isFcx = isFcxServer(s);
      if (isFcx) {
        // FanCode only ever unlocks once its own API says the match is
        // actually live (s.fcxLive) — never early, unlike the sheet/Live-TV
        // servers below which get a 30-minute pre-match head start.
        const fcxReady = !!s.fcxLive || !sheetServersLocked;   // unlocks 30 min before start, like every other source
        const priorityBadge = `<span style="display:inline-block;background:#F5C518;color:#111;font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:2px 7px;margin-left:8px;vertical-align:middle;">High Priority</span>`;
        const clickAttr = fcxReady
          ? ` type="button" onclick="closeMatchWatchScreen();sxGoToMatchUrl(null,'${escJs(s.url)}','${escJs(label)}')"`
          : ` type="button" onclick="mwsLockedServerTap(this)"`;
        return `
        <button class="mws-server-btn mws-server-btn-fcx${fcxReady ? '' : ' mws-server-locked'}"${clickAttr}>
          <img loading=lazy decoding=async class="mws-server-logo-lg" src="${FCX_LOGO}" alt="FanCode" onerror="this.style.display='none'">
          <span class="mws-server-info">
            <span class="mws-server-label">${s.text || 'FanCode'}${priorityBadge}</span>
            <span class="mws-server-sub">${fcxReady ? 'Tap to play this stream' : (s.fcxTime ? 'Starts ' + s.fcxTime : 'Not live yet')}</span>
          </span>
          <span class="mws-server-play">${fcxReady ? MWS_PLAY_SVG : MWS_LOCK_SVG}</span>
        </button>`;
      }
      // Only a name that actually matches a LIVE CHANNELS row gets the
      // 16:9 thumbnail treatment. A keyword-guessed logo (no real match)
      // or no logo at all falls back to the plain small icon/number.
      const liveChannelLogo = (/youtube\.com|youtu\.be|youtube-nocookie/i.test(s.url || '') || /^\s*(youtube|yt)\b/i.test(s.text || '')) ? null : sxFindLiveTvLogoForLabel(s.text);
      const _yt = /youtube\.com|youtu\.be|youtube-nocookie/i.test(s.url || '') || /^\s*(youtube|yt)\b/i.test(s.text || '');
      const keywordLogo = _yt ? ('data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 46"><rect width="64" height="46" rx="12" fill="#FF0000"/><path d="M26 13.5v19l17-9.5z" fill="#fff"/></svg>')) : (liveChannelLogo ? null : (s.icon || sxServerKeywordLogo(s.text)));
      const iconHtml = liveChannelLogo
        ? `<span class="mws-server-thumb"><img loading=lazy decoding=async src="${liveChannelLogo}" alt="" onerror="this.outerHTML='<span class=\\'mws-server-num\\'>${i + 1}</span>'"></span>`
        : keywordLogo
          ? `<img loading=lazy decoding=async class="mws-server-icon" src="${keywordLogo}" alt="" onerror="this.outerHTML='<span class=\\'mws-server-num\\'>${i + 1}</span>'">`
          : `<span class="mws-server-num">${i + 1}</span>`;
      const isRawStream = !sheetServersLocked && sxIsRawStreamUrl(s.url);
      const vlcIcon = isRawStream ? `<img loading=lazy decoding=async class="mws-vlc-icon" src="https://images.icon-icons.com/1381/PNG/512/vlc_93519.png" alt="VLC" title="Direct stream \u2014 plays in VLC" onerror="this.style.display='none'">` : '';
      // Auto-connected badge for servers linked from LIVE CHANNELS
      const autoConnectBadge = s.auto_connected ? `<span class="mws-auto-badge" title="Auto-connected from LIVE TV">📡 LIVE TV</span>` : '';
      const srvClick = sheetServersLocked
        ? `onclick="mwsLockedServerTap(this)"`
        : isRawStream
          ? `onclick="closeMatchWatchScreen();sxOpenVlcPopup('${escJs(s.url)}','${escJs(label)}')"`
          : `onclick="closeMatchWatchScreen();sxGoToMatchUrl(null,'${escJs(s.url)}','${escJs(s.playName || label)}')"`;
      return `
      <button type="button" class="mws-server-btn${sheetServersLocked ? ' mws-server-locked' : ''}${isRawStream ? ' mws-server-btn-raw' : ''}" ${srvClick}>
        ${iconHtml}
        <span class="mws-server-info">
          <span class="mws-server-label">${s.text || ('Server ' + (i + 1))}${vlcIcon}${autoConnectBadge}</span>
          <span class="mws-server-sub">${sheetServersLocked ? 'Locked until ' + startText : (s.sub || 'Tap to play this stream')}</span>
        </span>
        <span class="mws-server-play">${sheetServersLocked ? MWS_LOCK_SVG : MWS_PLAY_SVG}</span>
      </button>`;
    }).join('');
  }

  const overlay = document.getElementById('mwsOverlay');
  if (overlay) overlay.classList.add('open');
}

// "More Live Matches" strip — only shown for the FanCode banner-fallback
// case (single-image events with no team logos). Lists every OTHER
// currently-live FanCode match (excluding this one, by id) as a small
// banner + title card underneath the server list, so a visitor watching
// one live FanCode event can jump straight into another without closing
// this screen and hunting through the Matches tab. Rebuilt fresh on every
// openMatchWatchScreen() call and removed outright when not applicable.
function renderMwsMoreLive(info) {
  const body = document.getElementById('mwsRightBody');
  if (!body) return;
  const old = document.getElementById('mwsMoreLive');
  if (old) old.remove();

  const all = window._fcxMatchesCache || [];
  const curFm = info.fcxId ? fcxFindById(info.fcxId) : null;
  const curSp = curFm ? fcxResolveSport(curFm.category, curFm.tournament, curFm.title) : sxDetectSport(info.details || '', info.name || '', '');
  const others = all.filter(m =>
    m.status === 'LIVE' &&
    (info.fcxId ? String(m.id) !== String(info.fcxId) : m.title !== info.name) &&
    (!curSp || curSp === 'Other' || sxSameSport(fcxResolveSport(m.category, m.tournament, m.title), curSp))
  ).slice(0, 8);

  const wrap = document.createElement('div');
  wrap.id = 'mwsMoreLive';
  wrap.className = 'mws-more-live';
  wrap.innerHTML = `
    ${others.length ? `
    <div class="mws-more-title">More Live Matches</div>
    <div class="mws-more-row">
      ${others.map(m => `
        <button type="button" class="mws-more-card" onclick="fcxOpenWatchById('${escJs(String(m.id))}')">
          <div class="mws-more-thumb">
            <img loading=lazy decoding=async src="${m.image}" alt="${escJs(m.title)}" onerror="this.style.display='none'">
            <span class="mws-more-live-badge"><span class="live-dot-r"></span>LIVE</span>
          </div>
          <span class="mws-more-name">${m.title}</span>
        </button>
      `).join('')}
    </div>
    ` : ''}
    <div class="mws-ad-box">
      <div class="mws-ad-title">YOUR AD HERE</div>
      <div class="mws-ad-contact">Contact Discord: <span class="mws-ad-handle">rishi.ev</span></div>
    </div>
  `;
  body.appendChild(wrap);
}

// Tapping any locked (pre-kickoff) server: shake the row red, buzz the
// device where that's supported, and pop the red "not live yet" toast.
// Nothing navigates — the stream genuinely isn't up yet.
let _mwsToastTimer = null;
function mwsShowLockToast(msg) {
  let el = document.getElementById('mwsLockToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mwsLockToast';
    el.className = 'mws-lock-toast';
    document.body.appendChild(el);
  }
  el.innerHTML = `<span>⏰</span><span>${msg}</span>`;
  // restart the transition cleanly if it's already showing
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(_mwsToastTimer);
  _mwsToastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
function mwsLockedServerTap(btn) {
  const msg = window._mwsLockMsg || 'This match has not started yet';
  if (btn) {
    btn.classList.remove('mws-shake');
    void btn.offsetWidth;
    btn.classList.add('mws-shake');
    setTimeout(() => btn.classList.remove('mws-shake'), 500);
  }
  try { if (navigator.vibrate) navigator.vibrate([35, 45, 35]); } catch (e) {}
  mwsShowLockToast(msg);
  return false;
}
window.mwsLockedServerTap = mwsLockedServerTap;

function closeMatchWatchScreen() {
  const overlay = document.getElementById('mwsOverlay');
  if (overlay) overlay.classList.remove('open');
}

// ── Inject match card data into desktop hero slide cards ─────────────────────
// Looks for a hero slide whose ORIGINAL sheet title is written as
// "TEAM1 v TEAM2" (e.g. "IND v SRI") — team codes matching team1_code /
// team2_code in the MATCH CARDS sheet, in either order. When found,
// picks the best matching match card (preferring one that's currently
// "upcoming", then "live", then whatever's left) and returns it.
function sxFindHeroTitleMatch(rawTitle, matchCards) {
  const t = (rawTitle || '').trim();
  const m = t.match(/^([A-Za-z0-9]{2,6})\s+v\s+([A-Za-z0-9]{2,6})$/i);
  if (!m) return null;
  const code1 = m[1].toLowerCase();
  const code2 = m[2].toLowerCase();
  const candidates = matchCards.filter(mc => {
    const a = (mc.team1_code || '').trim().toLowerCase();
    const b = (mc.team2_code || '').trim().toLowerCase();
    return (a === code1 && b === code2) || (a === code2 && b === code1);
  });
  if (!candidates.length) return null;
  const byStatus = s => candidates.find(mc => matchStatusText(mc).trim().toLowerCase() === s);
  return byStatus('upcoming') || byStatus('live') || candidates[0];
}

// Replaces hsc-info (title/sub/btns) in a hero-slide-card whose original
// title is a "TEAM1 v TEAM2" pattern (e.g. "IND v SRI") with the matching
// match card's live team data, found by team1_code/team2_code — not by
// position. Slides whose title isn't that pattern, or that have no
// matching match card, are left exactly as configured in HERO SLIDES.
function injectMatchInfoIntoHeroCards(matchCards) {
  const heroCards = document.querySelectorAll('.hero-slide-card');
  const fallbackBanner = 'https://raw.githubusercontent.com/saptarshiorg/saptarshiorg.github.io/main/ChatGPT%20Image%20Jun%207,%202026,%2010_27_17%20AM.png';
  const track = document.getElementById('hero-cards-track');
  const cardDotsEl = document.getElementById('hero-card-dots');
  const heroSection = document.getElementById('hero-section');

  // No match cards at all → hide hero section on PC only (pc-no-featured CSS).
  // Mobile keeps showing slides normally. Other sections (FIFA, channels) unaffected.
  if (!matchCards.length) {
    document.body.classList.add('pc-no-featured');
    return;
  }
  // Match cards exist — ensure hero is visible
  document.body.classList.remove('pc-no-featured');
  if (heroSection) heroSection.classList.remove('no-match-cards');

  const usedMatchCards = [];

  heroCards.forEach((card, i) => {
    const rawTitle = decodeURIComponent(card.dataset.origTitle || '');
    const m = sxFindHeroTitleMatch(rawTitle, matchCards);

    // Title isn't a "TEAM1 v TEAM2" pattern, or no match found for it —
    // leave this slide exactly as the sheet configured it.
    if (!m) return;
    usedMatchCards.push(m);
    card._sxMatch = m;

    const isLive = matchStatusText(m).toLowerCase() === 'live';
    const badgeId = 'hsc-badge-' + i;
    const liveBadgeHtml = `<div class="smo-live-badge" id="${badgeId}" style="margin-bottom:5px;font-size:9px;padding:2px 7px"><div class="live-dot-r" style="width:5px;height:5px"></div>LIVE</div>`;
    const badge = isLive
      ? liveBadgeHtml
      : `<div class="smo-upcoming-badge" id="${badgeId}" style="margin-bottom:5px;font-size:9px;padding:2px 7px">⏰ UPCOMING</div>`;

    const countdown = m.countdown_to_iso_datetime || m.countdown_to || '';
    const timerId = 'hsc-timer-' + i;
    const timerWrapId = 'hsc-timerwrap-' + i;
    // Always render the timer wrapper — reserving its space — whether the
    // match is live, has no countdown value at all, or is upcoming, so the
    // Watch Live button sits in the exact same spot in every case.
    const timerBlock = `<div class="smo-timer" id="${timerWrapId}" style="margin:3px 0 4px;visibility:${(!isLive && countdown) ? 'visible' : 'hidden'}"><div class="timer-label" style="font-size:8px">STARTS IN</div><div class="timer-display" id="${timerId}" style="font-size:13px">--:--:--</div></div>`;

    const infoEl = card.querySelector('.hsc-info');
    if (!infoEl) return;

    const teamsLine = `${m.team1_full_name||m.team1_code||''} vs ${m.team2_full_name||m.team2_code||''}`;
    // Same banner takeover as the mobile slides / match cards: a row's own
    // banner_url/banner_image_url (or a cross-matched FanCode banner) wins
    // and the two-team-logo layout is dropped.
    const bannerSrc = m.banner_url || m.banner_image_url || m._fcxBanner || '';
    const bgEl = card.querySelector('.hsc-banner-bg');
    if (bannerSrc && bgEl) bgEl.style.backgroundImage = `url('${bannerSrc}')`;

    infoEl.innerHTML = bannerSrc ? `
      <div style="flex:1;min-height:0;overflow:hidden;">
        ${badge}
        <div class="smo-name" style="font-size:12px;line-height:1.2;text-align:center;margin-top:2px;">${teamsLine}</div>
        ${timerBlock}
      </div>
      <div class="hsc-btn-row" style="margin-top:6px;flex-shrink:0;">
        <a href="${matchWatchHref(m.btn_url)}" class="hsc-btn-watch" style="font-size:10px;padding:6px 8px;" onclick="event.stopPropagation();return sxHandleMatchWatch(event,'${sxServersEnc(m)}','${escJs(m.btn_url)}','${escJs((m.team1_code||'')+' vs '+(m.team2_code||''))}','${sxMatchInfoEnc(m,(m.team1_code||'')+' vs '+(m.team2_code||''))}')">▶ Watch Now</a>
      </div>` : `
      <div style="flex:1;min-height:0;overflow:hidden;">
        ${badge}
        <div style="display:flex;align-items:center;justify-content:space-between;gap:3px;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;min-width:0;">
            ${img(m.team1_icon_url,'','smo-logo','')}
            <div class="smo-name" style="font-size:12px;line-height:1.1;text-align:center">${m.team1_code||''}</div>
            <div class="smo-full" style="font-size:9px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">${m.team1_full_name||''}</div>
          </div>
          <div class="smo-vs" style="font-size:11px;flex-shrink:0;padding:0 2px">VS</div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;min-width:0;">
            ${img(m.team2_icon_url,'','smo-logo','')}
            <div class="smo-name" style="font-size:12px;line-height:1.1;text-align:center">${m.team2_code||''}</div>
            <div class="smo-full" style="font-size:9px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">${m.team2_full_name||''}</div>
          </div>
        </div>
        ${timerBlock}
      </div>
      <div class="hsc-btn-row" style="margin-top:6px;flex-shrink:0;">
        <a href="${matchWatchHref(m.btn_url)}" class="hsc-btn-watch" style="font-size:10px;padding:6px 8px;" onclick="event.stopPropagation();return sxHandleMatchWatch(event,'${sxServersEnc(m)}','${escJs(m.btn_url)}','${escJs((m.team1_code||'')+' vs '+(m.team2_code||''))}','${sxMatchInfoEnc(m,(m.team1_code||'')+' vs '+(m.team2_code||''))}')">▶ Watch Now</a>
      </div>`;

    card.setAttribute('onclick', `return sxHandleMatchWatch(event,'${sxServersEnc(m)}','${escJs(m.btn_url)}','${escJs((m.team1_code||'')+' vs '+(m.team2_code||''))}','${sxMatchInfoEnc(m,(m.team1_code||'')+' vs '+(m.team2_code||''))}')`);

    if (!isLive && countdown) {
      setTimeout(() => {
        wireAutoLiveCountdown(countdown, { timerDisplayId: timerId, timerWrapId, badgeId, liveBadgeHtml });
      }, 150);
    }
  });

  // PC hero (#hs-hero) reads title / match info from these cards — refresh it
  try { if (window.hsHeroRefresh) window.hsHeroRefresh(); } catch (e) {}

  // ── Create extra hero cards for match cards that weren't already
  // matched into a "TEAM1 v TEAM2" titled slide above ──────────────
  const extra = matchCards.filter(mc => !usedMatchCards.includes(mc));
  if (!extra.length || !track) return;

  extra.forEach((m, j) => {
    const i = heroCards.length + j; // global index for timer IDs
    const isLive = matchStatusText(m).toLowerCase() === 'live';
    const badgeId = 'hsc-badge-' + i;
    const liveBadgeHtml = `<div class="smo-live-badge" id="${badgeId}" style="margin-bottom:5px;font-size:9px;padding:2px 7px"><div class="live-dot-r" style="width:5px;height:5px"></div>LIVE</div>`;
    const badge = isLive
      ? liveBadgeHtml
      : `<div class="smo-upcoming-badge" id="${badgeId}" style="margin-bottom:5px;font-size:9px;padding:2px 7px">⏰ UPCOMING</div>`;

    const countdown = m.countdown_to_iso_datetime || m.countdown_to || '';
    const timerId = 'hsc-timer-' + i;
    const timerWrapId = 'hsc-timerwrap-' + i;
    // Always render the timer wrapper — reserving its space — whether the
    // match is live, has no countdown value at all, or is upcoming, so the
    // Watch Live button sits in the exact same spot in every case.
    const timerBlock = `<div class="smo-timer" id="${timerWrapId}" style="margin:3px 0 4px;visibility:${(!isLive && countdown) ? 'visible' : 'hidden'}"><div class="timer-label" style="font-size:8px">STARTS IN</div><div class="timer-display" id="${timerId}" style="font-size:13px">--:--:--</div></div>`;

    const div = document.createElement('div');
    div.className = 'hero-slide-card';
    div._sxMatch = m;
    div.setAttribute('onclick', `return sxHandleMatchWatch(event,'${sxServersEnc(m)}','${escJs(m.btn_url)}','${escJs((m.team1_code||'')+' vs '+(m.team2_code||''))}','${sxMatchInfoEnc(m,(m.team1_code||'')+' vs '+(m.team2_code||''))}')`);
    const teamsLine = `${m.team1_full_name||m.team1_code||''} vs ${m.team2_full_name||m.team2_code||''}`;
    const bannerSrc = m.banner_url || m.banner_image_url || m._fcxBanner || '';
    const bgImg = bannerSrc || fallbackBanner;
    div.innerHTML = `
      <div class="hsc-banner">
        <div class="hsc-banner-bg" style="background-image:url('${bgImg}')"></div>
        <div class="hsc-banner-overlay"></div>
        <div class="hsc-badge-row">
          <span class="hsc-sport-badge">${m.sport_badge||m.sport||''}</span>
        </div>
      </div>
      <div class="hsc-info">
        ${bannerSrc ? `
        <div style="flex:1;min-height:0;overflow:hidden;">
          ${badge}
          <div class="smo-name" style="font-size:12px;line-height:1.2;text-align:center;margin-top:2px;">${teamsLine}</div>
          ${timerBlock}
        </div>` : `
        <div style="flex:1;min-height:0;overflow:hidden;">
          ${badge}
          <div style="display:flex;align-items:center;justify-content:space-between;gap:3px;">
            <div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;min-width:0;">
              ${img(m.team1_icon_url,'','smo-logo','')}
              <div class="smo-name" style="font-size:12px;line-height:1.1;text-align:center">${m.team1_code||''}</div>
              <div class="smo-full" style="font-size:9px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">${m.team1_full_name||''}</div>
            </div>
            <div class="smo-vs" style="font-size:11px;flex-shrink:0;padding:0 2px">VS</div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;min-width:0;">
              ${img(m.team2_icon_url,'','smo-logo','')}
              <div class="smo-name" style="font-size:12px;line-height:1.1;text-align:center">${m.team2_code||''}</div>
              <div class="smo-full" style="font-size:9px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">${m.team2_full_name||''}</div>
            </div>
          </div>
          ${timerBlock}
        </div>`}
        <div class="hsc-btn-row" style="margin-top:6px;flex-shrink:0;">
          <a href="${matchWatchHref(m.btn_url)}" class="hsc-btn-watch" style="font-size:10px;padding:6px 8px;" onclick="event.stopPropagation();return sxHandleMatchWatch(event,'${sxServersEnc(m)}','${escJs(m.btn_url)}','${escJs((m.team1_code||'')+' vs '+(m.team2_code||''))}','${sxMatchInfoEnc(m,(m.team1_code||'')+' vs '+(m.team2_code||''))}')">▶ Watch Now</a>
        </div>
      </div>`;

    track.appendChild(div);

    // Add a dot for this extra card
    if (cardDotsEl) {
      const btn = document.createElement('button');
      btn.className = 'dot';
      btn.setAttribute('onclick', `scrollToCard(${i})`);
      cardDotsEl.appendChild(btn);
    }

    if (!isLive && countdown) {
      setTimeout(() => {
        wireAutoLiveCountdown(countdown, { timerDisplayId: timerId, timerWrapId, badgeId, liveBadgeHtml });
      }, 150);
    }
  });
}

// Same "TEAM1 v TEAM2" title-detection as injectMatchInfoIntoHeroCards, but
// applied to the carousel that's ACTUALLY visible on the site — the
// #slides-container / .slide markup built in the "MOBILE: full-width
// slides" part of renderSlides (the .hero-cards-section grid above this
// is hidden by CSS on every screen size, so match data injected there
// never reaches a real visitor). A slide titled e.g. "IND v SRI" gets its
// content swapped for the matching MATCH CARDS row: team logos, badge,
// live countdown, and a Watch Now button wired to the same multi-server
// popup used everywhere else on the site. Slides that don't match the
// pattern (or have no matching match card) are left exactly as configured.
function injectMatchInfoIntoSlides(matchCards) {
  const slides = document.querySelectorAll('#slides-container .slide');
  slides.forEach((slide, i) => {
    const rawTitle = decodeURIComponent(slide.dataset.origTitle || '');
    const m = sxFindHeroTitleMatch(rawTitle, matchCards);
    if (!m) return;

    const isLive = matchStatusText(m).toLowerCase() === 'live';
    const badgeId = 'slide-badge-' + i;
    const liveBadgeHtml = `<div class="smo-live-badge" id="${badgeId}"><div class="live-dot-r"></div>LIVE</div>`;
    const badge = isLive
      ? liveBadgeHtml
      : `<div class="smo-upcoming-badge" id="${badgeId}">⏰ UPCOMING</div>`;

    const countdown = m.countdown_to_iso_datetime || m.countdown_to || '';
    const timerId = 'slide-timer-' + i;
    const timerWrapId = 'slide-timerwrap-' + i;
    const timerBlock = `<div class="smo-timer" id="${timerWrapId}" style="margin:2px 0 10px;visibility:${(!isLive && countdown) ? 'visible' : 'hidden'}"><div class="timer-label">STARTS IN</div><div class="timer-display" id="${timerId}">--:--:--</div></div>`;

    const watchBtn = sxWatchBtnHtml(m, 'btn-slide-watch');

    const contentEl = slide.querySelector('.slide-content');
    if (!contentEl) return;

    const teamsLine = `${m.team1_full_name||m.team1_code||''} vs ${m.team2_full_name||m.team2_code||''}`;
    // A row's own banner_url/banner_image_url (or a cross-matched FanCode
    // banner) takes over the whole slide background and drops the
    // two-team-logo layout, matching the FanCode-style banner slides —
    // same as the match cards themselves.
    const bannerSrc = m.banner_url || m.banner_image_url || m._fcxBanner || '';
    const bgEl = slide.querySelector('.slide-bg');
    if (bannerSrc && bgEl) bgEl.style.backgroundImage = `url('${bannerSrc}')`;

    contentEl.innerHTML = bannerSrc ? `
      <div style="margin-bottom:10px;">${badge}</div>
      <div class="slide-title">${teamsLine}</div>
      <div class="slide-sub">${m.game||''}</div>
      ${timerBlock}
      <div class="slide-btns">${watchBtn}</div>
    ` : `
      <div style="margin-bottom:10px;">${badge}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:18px;margin-bottom:6px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;min-width:0;max-width:110px;">
          ${img(m.team1_icon_url,'','smo-logo','')}
          <div class="smo-name" style="font-size:13px;text-align:center;">${m.team1_code||''}</div>
          <div class="smo-full" style="font-size:10px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${m.team1_full_name||''}</div>
        </div>
        <div class="smo-vs" style="font-size:13px;flex-shrink:0;">VS</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;min-width:0;max-width:110px;">
          ${img(m.team2_icon_url,'','smo-logo','')}
          <div class="smo-name" style="font-size:13px;text-align:center;">${m.team2_code||''}</div>
          <div class="smo-full" style="font-size:10px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${m.team2_full_name||''}</div>
        </div>
      </div>
      ${timerBlock}
      <div class="slide-btns">${watchBtn}</div>
    `;

    if (!isLive && countdown) {
      setTimeout(() => {
        wireAutoLiveCountdown(countdown, { timerDisplayId: timerId, timerWrapId, badgeId, liveBadgeHtml });
      }, 150);
    }
  });
}

// Global store for match cards — populated before renderSlides is called if needed,
// but init() runs HERO SLIDES first then MATCH CARDS. We defer hero card info injection
// until match cards are available via a second-pass update function.
window._matchCardsData = [];

// ── Match status helpers ──────────────────────────────────────────
// A match counts as "live" if either the sheet's status column already
// says so, OR its countdown_to_iso_datetime has passed — so matches that
// are only ever scheduled with a start time (no manual sheet edit)
// automatically flip to live everywhere status is checked: match-card
// sorting/filtering, the LIVE NOW toolbar tab, and the home screen
// preview — not just the cosmetic per-card countdown badge.
const MATCH_FINISHED_RE = /finished|ended|\bover\b|complete|full[\s-]?time|\bft\b/i;
function rawMatchStatusText(c) {
  return (c.status_live_upcoming || c.status || '').trim();
}
function isMatchFinished(c) {
  return MATCH_FINISHED_RE.test(rawMatchStatusText(c));
}
function matchIsAutoLive(c) {
  if (isMatchFinished(c)) return false; // a finished match never auto-flips live
  const iso = (c.countdown_to_iso_datetime || c.countdown_to || '').trim();
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (isNaN(t)) return false;
  return Date.now() >= t;
}
function matchStatusText(c) {
  const raw = rawMatchStatusText(c);
  if (raw.toLowerCase() === 'live') return raw;
  if (c && c._lmxLive && !/finish|complet|ended|over/i.test(raw)) return 'Live'; // a FanCode / SonyLIV / API feed says it's live
  if (matchIsAutoLive(c)) return 'Live';
  return raw;
}

// ── Auto-hide cards 15 hours after their scheduled start ──────────────
// Once countdown_to_iso_datetime (or countdown_to) is 15+ hours in the
// past, the match card disappears from the match-overlay/hero on its own —
// no need to manually mark the sheet row inactive after every match.
const SMO_HIDE_AFTER_MS = 12 * 60 * 60 * 1000; // 12 hours
function smoHideAtMs(c) {
  const iso = (c.countdown_to_iso_datetime || c.countdown_to || '').trim();
  if (!iso) return null; // no scheduled time given — never auto-hide
  const t = new Date(iso).getTime();
  if (isNaN(t)) return null; // unparsable date — don't silently drop the card
  return t + SMO_HIDE_AFTER_MS;
}
// ── Same-day helpers (home screen only) ───────────────────────────────
// The home screen's Matches preview is limited to TODAY's fixtures. A card
// counts as today's when its scheduled start (countdown_to_iso_datetime /
// countdown_to) falls on the current local calendar day — or when it's
// currently live, since a live match is by definition on right now even if
// it started just before midnight.
function sxIsSameLocalDay(d) {
  if (!d || isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear()
      && d.getMonth() === now.getMonth()
      && d.getDate() === now.getDate();
}
function sxMatchStartDate(c) {
  const iso = ((c && (c.countdown_to_iso_datetime || c.countdown_to)) || '').trim();
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}
function sxIsTodayMatch(c) {
  if (matchStatusText(c).toLowerCase() === 'live') return true;
  return sxIsSameLocalDay(sxMatchStartDate(c));
}
// A card counts as "tomorrow's" when its scheduled start falls on the
// calendar day right after today (local time).
function sxIsNextLocalDay(d) {
  if (!d || isNaN(d.getTime())) return false;
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return d.getFullYear() === t.getFullYear()
      && d.getMonth() === t.getMonth()
      && d.getDate() === t.getDate();
}
function sxIsNextDayMatch(c) {
  return sxIsNextLocalDay(sxMatchStartDate(c));
}
// From 10 PM (22:00) local time onward, tomorrow's matches are allowed to
// start showing on the home screen preview alongside today's — so the
// home screen "warms up" with next-day fixtures the night before instead
// of the preview going empty/thin late at night.
function sxNextDayPreviewUnlocked() {
  return new Date().getHours() >= 22;
}
// Home-screen eligibility: live matches always qualify; same-day matches
// always qualify; next-day matches only qualify once the 10 PM unlock
// above has kicked in.
function sxIsHomeEligibleMatch(c) {
  if (matchStatusText(c).toLowerCase() === 'live') return true;
  if (sxIsSameLocalDay(sxMatchStartDate(c))) return true;
  return sxNextDayPreviewUnlocked() && sxIsNextDayMatch(c);
}
function fcxIsTodayMatch(m) {
  if (!m) return false;
  if (m.status === 'LIVE') return true;
  return sxIsSameLocalDay(m.time);
}

function smoIsExpired(c) {
  const hideAt = smoHideAtMs(c);
  return hideAt !== null && Date.now() >= hideAt;
}

// Currently-selected event/game in the toolbar. 'ALL' shows every event's
// cards stacked (the original behaviour); any other value filters the
// match-overlay down to just that one game/event.
window._smoActiveGame = window._smoActiveGame || 'ALL';

// Currently-selected SPORT (from the MATCH CARDS sheet's "sport"/"sports"
// column, e.g. CRICKET, FOOTBALL). This is one tier above the game/event
// toolbar above: pick a sport first, and the event toolbar + sections below
// narrow down to just that sport's games, rendered exactly as before.
// 'ALL' shows every sport's games stacked (original behaviour).
window._smoActiveSport = window._smoActiveSport || 'ALL';

// Sequential-selection gate: when there's a real sport tier (2+ sports),
// the game/event toolbar and match cards stay hidden — replaced by a
// "select a sport above" prompt — until the visitor taps a sport tab.
// Persisted on window so it survives the 30s auto re-render.
// "All Sports" is the default view from the very first render — no click
// needed before matches show. (Still tracked so smoSelectSport()'s own
// picks keep working exactly as before.)
window._smoSportChosen = true;

function smoBuildToolbar(gameNames) {
  const wrap = document.getElementById('smo-toolbar');
  const tabsEl = document.getElementById('smo-game-tabs');
  const selectEl = document.getElementById('smo-game-select');
  if (!wrap || !tabsEl || !selectEl) return;

  // No events at all → nothing to switch between, hide the toolbar.
  // (With just one game category, the toolbar still shows — ALL vs
  // LIVE NOW is a useful distinction even for a single sport.)
  if (!gameNames || gameNames.length < 1) {
    wrap.style.display = 'none';
    window._smoActiveGame = 'ALL';
    return;
  }
  wrap.style.display = '';

  // Keep the current selection if it's still a valid choice, otherwise reset.
  const validSelections = ['ALL', 'LIVE_NOW'].concat(gameNames);
  if (validSelections.indexOf(window._smoActiveGame) === -1) {
    window._smoActiveGame = 'ALL';
  }

  selectEl.innerHTML = '<option value="ALL">All Tournaments</option><option value="LIVE_NOW">Live Now</option>';
  gameNames.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    selectEl.appendChild(opt);
  });
  selectEl.value = window._smoActiveGame;
  selectEl.onchange = () => smoSelectGame(selectEl.value);

  // "ALL" and "LIVE NOW" are always the first two tiles — with a 4-column
  // grid that puts them side by side at the very start of row 1, followed
  // by the game categories (already live-first ordered by renderMatchCards).
  tabsEl.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'smo-game-tab smo-game-tab-big' + (window._smoActiveGame === 'ALL' ? ' active' : '');
  allBtn.dataset.game = 'ALL';
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => smoSelectGame('ALL'));
  tabsEl.appendChild(allBtn);

  const liveBtn = document.createElement('button');
  liveBtn.type = 'button';
  liveBtn.className = 'smo-game-tab smo-game-tab-big smo-game-tab-live' + (window._smoActiveGame === 'LIVE_NOW' ? ' active' : '');
  liveBtn.dataset.game = 'LIVE_NOW';
  liveBtn.innerHTML = '<span class="smo-tab-live-dot"></span>Live Now';
  liveBtn.addEventListener('click', () => smoSelectGame('LIVE_NOW'));
  tabsEl.appendChild(liveBtn);

  gameNames.forEach(g => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'smo-game-tab' + (window._smoActiveGame === g ? ' active' : '');
    btn.dataset.game = g;
    btn.textContent = g;
    btn.addEventListener('click', () => smoSelectGame(g));
    tabsEl.appendChild(btn);
  });
}

function smoSelectGame(name) {
  window._smoActiveGame = name;
  const selectEl = document.getElementById('smo-game-select');
  if (selectEl) selectEl.value = name;
  document.querySelectorAll('.smo-game-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.game === name);
  });
  smoApplyFilter();
}

// ── Sport selector toolbar (parent tier above the event/game toolbar) ──
// sportNames is the live-first-ordered list of distinct sport values
// found in the MATCH CARDS sheet's "sport"/"sports" column this render.
function smoBuildSportToolbar(sportNames) {
  const wrap = document.getElementById('smo-sport-toolbar');
  const tabsEl = document.getElementById('smo-sport-tabs');
  const selectEl = document.getElementById('smo-sport-select');
  if (!wrap || !tabsEl) return;

  // Fewer than 2 sports (e.g. the sheet has no sport column filled in yet,
  // or every row is the same sport) — nothing meaningful to switch
  // between, so hide the tier entirely and just show every game as before.
  if (!sportNames || sportNames.length < 2) {
    wrap.style.display = 'none';
    window._smoActiveSport = 'ALL';
    window._smoSportChosen = true; // nothing to pick, so don't gate the games below
    return;
  }
  wrap.style.display = '';

  const validSelections = ['ALL'].concat(sportNames);
  if (validSelections.indexOf(window._smoActiveSport) === -1) {
    window._smoActiveSport = 'ALL';
  }

  // Dropdown (the only visible control on both PC and mobile now).
  if (selectEl) {
    selectEl.innerHTML = '<option value="ALL">All Sports</option>';
    sportNames.forEach(sp => {
      const opt = document.createElement('option');
      opt.value = sp;
      opt.textContent = sp;
      selectEl.appendChild(opt);
    });
    selectEl.value = window._smoActiveSport;
    selectEl.onchange = () => smoSelectSport(selectEl.value);
  }

  tabsEl.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'smo-sport-tab smo-sport-tab-all' + (window._smoActiveSport === 'ALL' ? ' active' : '');
  allBtn.dataset.sport = 'ALL';
  allBtn.textContent = 'All Sports';
  allBtn.addEventListener('click', () => smoSelectSport('ALL'));
  tabsEl.appendChild(allBtn);

  sportNames.forEach(s => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'smo-sport-tab' + (window._smoActiveSport === s ? ' active' : '');
    btn.dataset.sport = s;
    btn.textContent = s;
    btn.addEventListener('click', () => smoSelectSport(s));
    tabsEl.appendChild(btn);
  });
}

// Selecting a sport narrows the event/game toolbar below it down to just
// that sport's games (event selection resets to "All Events" for the newly
// chosen sport, since the previous pick may not exist inside it), then
// re-applies the visibility filter — the game sections themselves are
// untouched, just shown/hidden exactly like the existing event filter.
function smoSelectSport(name) {
  window._smoActiveSport = name;
  window._smoActiveGame = 'ALL';
  window._smoSportChosen = true; // sport picked — game selector + matches unlock below
  const sportSelectEl = document.getElementById('smo-sport-select');
  if (sportSelectEl) sportSelectEl.value = name;
  document.querySelectorAll('.smo-sport-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sport === name);
  });
  const allGames = window._smoAllGameOrder || [];
  const gameToSport = window._smoGameToSport || {};
  const gameNames = (name === 'ALL') ? allGames : allGames.filter(g => gameToSport[g] === name);

  const promptEl = document.getElementById('smo-sport-prompt');
  const overlaySection = document.getElementById('match-overlay-section');
  if (promptEl) promptEl.style.display = 'none';
  if (overlaySection) overlaySection.style.display = '';

  smoBuildToolbar(gameNames);
  smoApplyFilter();
}
window.smoSelectSport = smoSelectSport;

function smoApplyFilter() {
  const name = window._smoActiveGame || 'ALL';
  const sportName = window._smoActiveSport || 'ALL';
  const el = document.getElementById('match-overlay');
  if (!el) return;
  const sections = el.querySelectorAll('.smo-section');
  let anyVisible = false;
  const now = Date.now();
  sections.forEach(sec => {
    // "ALL" and "LIVE NOW" aren't tied to a single game — every section
    // is a candidate; a specific game name only matches its own section.
    const matchesGame = (name === 'ALL' || name === 'LIVE_NOW') || (sec.dataset.game === name);
    // Sport tier sits above the game tier — a section only shows when it
    // also belongs to the currently-selected sport (or "ALL" is selected).
    const matchesSport = (sportName === 'ALL') || (sec.dataset.sport === sportName);
    let hasVisibleCard = false;
    sec.querySelectorAll('.smo-card').forEach(card => {
      const expireAt = card.dataset.expireAt ? parseInt(card.dataset.expireAt, 10) : null;
      const isExpired = expireAt !== null && now >= expireAt;
      const passesLiveFilter = (name !== 'LIVE_NOW') || card.dataset.live === '1';
      const show = matchesGame && matchesSport && passesLiveFilter && !isExpired;
      card.style.display = show ? '' : 'none';
      if (show) hasVisibleCard = true;
    });
    const show = matchesGame && matchesSport && hasVisibleCard;
    if (show && sec.dataset.vis === '0') {   // was hidden, now shown -> soft enter
      sec.classList.remove('smo-enter'); void sec.offsetWidth; sec.classList.add('smo-enter');
      setTimeout(() => sec.classList.remove('smo-enter'), 450);
    }
    sec.dataset.vis = show ? '1' : '0';
    if (show) sec.style.removeProperty('display');
    else sec.style.setProperty('display', 'none', 'important');
    if (show) anyVisible = true;
  });
  // Only manage a "filtered to nothing" message when there are sections to
  // filter in the first place — if there were no cards at all, leave the
  // genuine "NO MATCHES LISTED" box (rendered by renderMatchCards) alone.
  if (!sections.length) return;
  let filterEmptyBox = el.querySelector('.smo-filter-empty-box');
  if (!anyVisible) {
    if (!filterEmptyBox) {
      filterEmptyBox = document.createElement('div');
      filterEmptyBox.className = 'smo-empty-box smo-filter-empty-box';
      el.appendChild(filterEmptyBox);
    }
    filterEmptyBox.textContent = (name === 'LIVE_NOW') ? 'NO MATCHES LIVE RIGHT NOW' : 'NO MATCHES FOR THIS EVENT';
    filterEmptyBox.style.display = '';
  } else if (filterEmptyBox) {
    filterEmptyBox.style.display = 'none';
  }
}
window.smoSelectGame = smoSelectGame;

// Re-checks every open match card against its 15h auto-hide deadline —
// catches cards that cross the line while the page is left open (the sheet
// itself is only fetched once on load, so this doesn't need a refetch).
function smoSweepExpiredCards() {
  const now = Date.now();
  let changed = false;
  document.querySelectorAll('#match-overlay .smo-card[data-expire-at]').forEach(card => {
    const t = parseInt(card.dataset.expireAt, 10);
    if (t && now >= t && card.style.display !== 'none') {
      card.style.setProperty('display', 'none', 'important');
      changed = true;
    }
  });
  if (changed) smoApplyFilter();
}
setInterval(smoSweepExpiredCards, 60000);

// Re-runs the full MATCH CARDS render (sorting, category tabs, LIVE NOW
// filter eligibility, and the home-screen preview all rebuild from this)
// so matches that reach their scheduled kickoff time — auto-flipping to
// "live" via matchIsAutoLive() purely from the ISO datetime, with no
// manual sheet edit — actually move to the front and count as live
// everywhere, not just in the cosmetic per-card countdown badge.
// Updated to 60s to sync with sheet fetch interval
var _smoLastLiveSig = '';
setInterval(() => {
  // PERF: only rebuild when a match actually crossed its kickoff time since last render
  if (!window._matchCardsRawRows) return;
  const sig = (window._matchCardsData || []).map(c => matchIsAutoLive(c) ? 1 : 0).join('');
  if (sig === _smoLastLiveSig) return;
  _smoLastLiveSig = sig;
  renderMatchCards(window._matchCardsRawRows);
}, 60000);

function renderMatchCards(rows) {
  if (!rows) { console.warn('[MATCH CARDS] fetchSheet returned null — check the tab name is exactly "MATCH CARDS" and the sheet is shared ("Anyone with the link can view").'); return; }

  // ── SETTINGS!maintain_matches ────────────────────────────────
  //   YES    → full-replace: whole matches section shows the maintenance
  //            box instead of match cards; nothing else loads.
  //   ISSUE  → matches still load normally; a small ⚠️ banner (using the
  //            same row's "notes" column) is shown above them.
  //   NOTIFY → matches still load normally; the note is shown as a plain
  //            🔔 notice above them (nothing shown if there's no note).
  const smoMode = sxSettingMode('maintain_matches');
  const smoReason = sxMaintenanceReason('maintain_matches');
  sxUpsertNotice('match-overlay', 'sx-matches-notice', smoMode, smoReason);
  if (smoMode === 'YES') {
    window._matchCardsRawRows = rows;
    window._matchCardsData = [];
    const el = document.getElementById('match-overlay');
    if (el) el.innerHTML = sxMaintenanceHtml(smoReason);
    const promptEl = document.getElementById('smo-sport-prompt');
    if (promptEl) promptEl.style.display = 'none';
    const smoToolbarWrap = document.getElementById('smo-toolbar');
    if (smoToolbarWrap) smoToolbarWrap.style.display = 'none';
    const mSection = document.getElementById('match-overlay-section');
    if (mSection) mSection.style.display = '';
    if (typeof renderFixtures === 'function') renderFixtures();
    return;
  }

  window._matchCardsRawRows = rows; // cached so smoRefreshAutoLive() can re-render without refetching
  console.log('[MATCH CARDS] raw rows from sheet:', rows.length, rows);
  console.log('[MATCH CARDS] active-flag per row:', rows.map(r => ({ game: r.game, flag_used: activeFlagRaw(r), kept: isRowActive(r) })));
  const allActiveCards = active(rows);
  console.log('[MATCH CARDS] after active() filter:', allActiveCards.length, allActiveCards);
  // Drop anything already 15h+ past its scheduled start (countdown_to_iso_datetime)
  // so old matches disappear from the site on their own.
  const cards = allActiveCards.filter(c => !smoIsExpired(c));
  window._matchCardsData = cards; // store globally for hero card injection + home preview

  // ── Cross-link: if a live FanCode stream is for the same fixture as a
  // sheet MATCH CARDS row (matched by team name against the FCX title),
  // add it as an extra server on that row — the sheet card keeps its own
  // banner/thumbnail exactly as configured, this only adds a watch option.
  if (typeof fcxAugmentSheetCards === 'function') fcxAugmentSheetCards(cards);

  if (typeof renderFixtures === 'function') renderFixtures(); // home "Matches" preview now sources from this same data
  const el = document.getElementById('match-overlay');

  // ── Group cards by GAME (sport name column) ──────────────
  const groups = new Map();
  cards.forEach(c => {
    const key = (c.game || 'Other Matches').trim() || 'Other Matches';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(c);
  });

  let html = '';
  const timers = [];
  const gameOrder = [];
  // Sport (from the sheet's "sport"/"sports" column) belonging to each
  // rendered game/event section — parallel array to gameOrder, one entry
  // per section, filled in below as sections are built.
  const sportPerSection = [];
  window._sxSheetSportSpell = {};
  const sportOf = c => (window.sxSheetSport ? window.sxSheetSport(c) : ((c.sport || c.sports || '').trim() || 'Other'));

  // ── Live-first ordering ──────────────────────────────────────────
  // 1) Within each game/category group: LIVE matches first, then
  //    today's UPCOMING matches (soonest start first), then tomorrow's
  //    (and later) UPCOMING matches (also soonest-first), and FINISHED
  //    matches last.
  // 2) Groups (game categories) that contain at least one live match
  //    are moved ahead of groups that don't — so the category tabs
  //    and the sections on the page both show "what's live" first.
  //    Ties keep their original sheet order (stable sort).
  const cardDayTier = c => {
    const s = matchStatusText(c).toLowerCase();
    if (s === 'live') return 0;
    if (isMatchFinished(c)) return 3;
    return sxIsSameLocalDay(sxMatchStartDate(c)) ? 1 : 2; // 1 = today, 2 = next day+
  };
  const cardStartMs = c => {
    const d = sxMatchStartDate(c);
    return d ? d.getTime() : Infinity;
  };
  const groupEntries = Array.from(groups.entries());
  groupEntries.forEach(([, groupCards]) => {
    // Sort matches: LIVE first, then UPCOMING by date (ascending/soonest first), then COMPLETED
    groupCards.sort((a, b) => {
      const tierA = cardDayTier(a); // 0=LIVE, 1/2=UPCOMING (by day), 3=COMPLETED
      const tierB = cardDayTier(b);
      if (tierA !== tierB) return tierA - tierB; // Primary sort by day tier
      // Within same tier: sort by start time ascending (soonest first for UPCOMING)
      return cardStartMs(a) - cardStartMs(b);
    });
  });
  // Group-level ordering: LIVE groups first; among the rest, groups that
  // still have an UPCOMING match sort by that match's soonest start time
  // ascending (not just "has live" true/false, which left upcoming groups
  // in arbitrary sheet-row order); groups that are entirely FINISHED sink
  // to the very end. Final say on the merged (sheet + FanCode) order still
  // belongs to sxReorderAllSectionsLiveThenTime, called at the end of this
  // function via fcxAppendHomeSections — this just makes the sheet-only
  // starting order correct too.
  const groupTier = groupCards => {
    if (groupCards.some(c => matchStatusText(c).toLowerCase() === 'live')) return 0;
    if (groupCards.some(c => !isMatchFinished(c))) return 1;
    return 2;
  };
  const groupSoonest = groupCards => {
    const upcoming = groupCards.filter(c => !isMatchFinished(c));
    const pool = upcoming.length ? upcoming : groupCards;
    return pool.reduce((min, c) => Math.min(min, cardStartMs(c)), Infinity);
  };
  groupEntries.sort((a, b) => {
    const tierA = groupTier(a[1]), tierB = groupTier(b[1]);
    if (tierA !== tierB) return tierA - tierB;
    return groupSoonest(a[1]) - groupSoonest(b[1]);
  });

  groupEntries.forEach(([gameName, groupCards]) => {
    let sectionHtml = '';

    groupCards.forEach(c => {
      const dateLabel = smoCardDateLabel(c);

      const isLive = matchStatusText(c).toLowerCase() === 'live';
      const isFinished = isMatchFinished(c);
      const uid = Math.random().toString(36).slice(2);
      const cardId = 'smo-card-' + uid;
      const badgeId = 'smo-badge-' + uid;
      // Card style now matches the home-screen preview cards (fx2-card):
      // team-logo thumb with a badge pinned top-left, then a body with
      // title/FREE row, game+date meta row, countdown, and Watch Now.
      const liveBadgeHtml = `<span class="fx2-badge fx2-badge-live" id="${badgeId}"><span class="fx2-live-dot"></span>LIVE</span>`;
      const badge = isLive
        ? liveBadgeHtml
        : isFinished
        ? `<span class="fx2-badge" id="${badgeId}">FINISHED</span>`
        : `<span class="fx2-badge" id="${badgeId}">⏰ UPCOMING</span>`;
      const countdown = (isLive || isFinished) ? '' : (c.countdown_to_iso_datetime || c.countdown_to || '');
      const timerId = 'timer-' + uid;
      const timerWrapId = 'timerwrap-' + uid;
      const hideAt = smoHideAtMs(c);
      // Always render the timer wrapper — even when there's no start time at
      // all — so its height is always reserved and the Watch Live button
      // never shifts up/down depending on whether a countdown value exists.
      const timerBlock = `<div class="smo-timer" id="${timerWrapId}" style="visibility:${countdown ? 'visible' : 'hidden'}"><div class="timer-label">STARTS IN</div><div class="timer-display" id="${timerId}">--:--:--</div></div>`;

      const detailsHtml = c.details ? `<div class="smo-details">${c.details}</div>` : '';
      const teamsLine = `${c.team1_full_name||c.team1_code||''} vs ${c.team2_full_name||c.team2_code||''}`;
      // Banner takes priority over the two-team-logo layout when there is
      // one — either the sheet's own banner_url/banner_image_url column,
      // or (as a fallback) the banner from a cross-matched FanCode stream
      // for this fixture.
      const bannerSrc = c.banner_url || c.banner_image_url || c._fcxBanner || '';
      const thumbInner = bannerSrc
        ? `<img loading=lazy decoding=async src="${bannerSrc}" alt="${escJs(teamsLine)}" class="fx2-thumb-img" onerror="this.style.display='none'">`
        : `<div class="fx2-thumb-teams">
            <div class="fx2-thumb-team">${img(c.team1_icon_url,c.team1_code||'','')}</div>
            <div class="fx2-thumb-vs">VS</div>
            <div class="fx2-thumb-team">${img(c.team2_icon_url,c.team2_code||'','')}</div>
          </div>`;

      sectionHtml += `
      <div class="smo-card fx2-card" id="${cardId}" data-live="${isLive ? '1' : '0'}" data-finished="${isFinished ? '1' : '0'}" data-start-ms="${cardStartMs(c)}"${hideAt !== null ? ` data-expire-at="${hideAt}"` : ''}>
        <div class="fx2-thumb">
          ${thumbInner}
          ${badge}
        </div>
        <div class="fx2-body">
          <div class="fx2-title-row">
            <div class="fx2-title">${teamsLine}</div>
            <span class="fx2-free">FREE</span>
          </div>
          ${detailsHtml}
          <div class="fx2-meta">
            <span class="fx2-tag">${gameName}</span>
            <span class="fx2-date">${dateLabel}</span>
          </div>
          ${timerBlock}
          ${sxWatchBtnHtml(c, 'smo-btn')}
        </div>
      </div>`;

      if (!isLive && countdown) timers.push({ timerDisplayId: timerId, timerWrapId, badgeId, liveBadgeHtml, target: countdown });
    });

    if (sectionHtml) {
      gameOrder.push(gameName);
      sportPerSection.push(sportOf(groupCards[0]));
      html += `<div class="smo-section">`;
      html += `<div class="smo-section-label">${gameName}</div>`;
      html += sectionHtml;
      html += `</div>`; // close smo-section
    }
  });

  el.innerHTML = html.trim() ? html : `<div class="smo-empty-box">NO MATCHES LISTED</div>`;

  // Tag each rendered section with its game name and sport (via the DOM
  // property, not an HTML attribute string, so no escaping worries even if
  // a game/sport name from the sheet contains quotes) so the toolbars can
  // filter by them.
  const renderedSections = el.querySelectorAll(':scope > .smo-section');
  renderedSections.forEach((sec, i) => { sec.dataset.game = gameOrder[i]; sec.dataset.sport = sportPerSection[i]; });

  // Sports (parent tier), in first-appearance order — since groupEntries
  // above are already sorted live-first, this naturally puts a sport with
  // an early live match first too.
  const sportOrder = [...new Set(sportPerSection)];
  window._smoAllGameOrder = gameOrder;
  window._smoGameToSport = {};
  gameOrder.forEach((g, i) => { window._smoGameToSport[g] = sportPerSection[i]; });

  // Fold FanCode in using each match's own "category" from the JSON feed
  // (Cricket / Football / …) as its sport — "FanCode" is never shown as a
  // category here. When that category matches a sport already present in
  // the MATCH CARDS sheet (case-insensitive), the FanCode tournaments are
  // merged into that same sheet sport rather than added beside it; only a
  // genuinely new category creates a new entry in the sport dropdown.
  // Snapshot the sheet's own sports first so fcxResolveSport() compares
  // against them and not against categories it just added itself.
  window._smoSheetSports = sportOrder.slice();
  const fcxGroups = (typeof fcxTournamentGroups === 'function') ? fcxTournamentGroups() : [];
  fcxGroups.forEach(([tournament, fcxCards]) => {
    const sport = fcxResolveSport(fcxGroupCategory(fcxCards), tournament, fcxCards.map(m => m.title));
    if (!sportOrder.includes(sport)) sportOrder.push(sport);
    // A FanCode tournament whose name already exists as a sheet game/event
    // (compared case- and space-insensitively) is the SAME tournament —
    // it reuses that entry instead of adding a second, near-identical one
    // to the dropdown.
    const merged = smoMatchExistingGame(gameOrder, tournament);
    if (!merged) {
      gameOrder.push(tournament);
      window._smoGameToSport[tournament] = sport;
    }
  });

  // SonyLIV + API-feed matches: make sure their sports / events appear in the sport & event selectors too.
  if (window.LMX && typeof LMX.foldSports === 'function') LMX.foldSports(sportOrder, gameOrder, window._smoGameToSport);

  // ── Build/refresh the sport-selector toolbar (parent tier) ──
  smoBuildSportToolbar(sportOrder);

  // ── Sequential gate: with a real sport tier (2+ sports) and no pick
  // made yet, hide the game toolbar + match cards and show the "select a
  // sport above" prompt instead. Once smoSelectSport() runs, the flag
  // flips and this branch is skipped on every render after (incl. the
  // 30s auto-refresh) until the page reloads.
  const promptEl = document.getElementById('smo-sport-prompt');
  const smoToolbarWrap = document.getElementById('smo-toolbar');
  const overlaySection = document.getElementById('match-overlay-section');
  const needsSportPick = false; // matches show immediately — "All Sports" by default

  if (needsSportPick) {
    if (smoToolbarWrap) smoToolbarWrap.style.display = 'none';
    if (overlaySection) overlaySection.style.display = 'none';
    if (promptEl) promptEl.style.display = '';
  } else {
    if (promptEl) promptEl.style.display = 'none';
    // ── Build/refresh the event-selector toolbar (dropdown + PC tabs) ──
    // Scoped to the currently-selected sport, if any, so switching sports
    // narrows this list down to just that sport's games/events.
    const gameNamesForToolbar = (window._smoActiveSport && window._smoActiveSport !== 'ALL')
      ? gameOrder.filter(g => window._smoGameToSport[g] === window._smoActiveSport)
      : gameOrder;
    smoBuildToolbar(gameNamesForToolbar);
  }

  // ── Inject match card data into desktop hero slide cards ──────
  injectMatchInfoIntoHeroCards(cards);
  injectMatchInfoIntoSlides(cards);

  // Match overlay section stays visible either way — showing real cards,
  // or the "NO MATCHES LISTED" box above when there aren't any — unless
  // the sport-pick gate above is still active, in which case it stays
  // hidden behind the "select a sport" prompt.
  const mSection = document.getElementById('match-overlay-section');
  if (mSection && !needsSportPick) mSection.style.display = '';

  timers.forEach(({ timerDisplayId, timerWrapId, badgeId, liveBadgeHtml, target }) => {
    setTimeout(() => {
      wireAutoLiveCountdown(target, { timerDisplayId, timerWrapId, badgeId, liveBadgeHtml });
    }, 100);
  });

  // Re-apply whatever event is currently selected in the toolbar (defaults
  // to "All Events" the first time, keeps the visitor's choice on refresh).
  smoApplyFilter();

  // This render just rebuilt #match-overlay from scratch (wiping any
  // previously-appended FanCode section) — put it back using whatever FCX
  // data is currently cached, so it survives this 30s cycle too.
  if (typeof window.fcxAppendHomeSections === 'function') window.fcxAppendHomeSections();
  if (typeof window.slxAppendHomeSections === 'function') window.slxAppendHomeSections();
}

function renderChannels(rows) {
  if (!rows) return;

  // ── SETTINGS!maintain_channels ───────────────────────────────
  //   YES    → full-replace: channels preview + Live TV grid show the
  //            maintenance box instead of channels; nothing else loads.
  //   ISSUE  → channels still load normally; a small ⚠️ banner (using the
  //            same row's "notes" column) is shown above them.
  //   NOTIFY → channels still load normally; the note is shown as a plain
  //            🔔 notice above them (nothing shown if there's no note).
  const chMode = sxSettingMode('maintain_channels');
  const chReason = sxMaintenanceReason('maintain_channels');
  sxUpsertNotice('channelsPreviewGrid', 'sx-channels-preview-notice', chMode, chReason);
  sxUpsertNotice('chGrid', 'sx-channels-grid-notice', chMode, chReason);
  window._channelsMaintenance = (chMode === 'YES');
  if (window._channelsMaintenance) {
    window._cmsChannels = [];
    window._liveChannelNames = [];
    const previewGrid = document.getElementById('channelsPreviewGrid');
    if (previewGrid) previewGrid.innerHTML = sxMaintenanceHtml(chReason);
    if (typeof window.chBuildCategories === 'function') window.chBuildCategories();
    if (typeof window.chFilter === 'function') window.chFilter();
    return;
  }

  // Store CMS channels globally so the browser's Other group can include them
  window._cmsChannels = active(rows);
  // Store live channel names for CSS class matching
  window._liveChannelNames = active(rows).map(c => (c.channel_name || '').toLowerCase());
  if (typeof window.chBuildCategories === 'function') window.chBuildCategories();
  if (typeof window.chFilter === 'function') window.chFilter();
  renderChannelsPreview();
  // Apply 16:9 styling to live channel cards
  applyLiveChannelCardStyles();
}

// Apply 16:9 card styling to channels from LIVE CHANNELS sheet
function applyLiveChannelCardStyles() {
  const liveNames = window._liveChannelNames || [];
  const cards = document.querySelectorAll('.channel-card');
  cards.forEach(card => {
    const nameEl = card.querySelector('.channel-name');
    if (nameEl) {
      const channelName = nameEl.textContent.toLowerCase().trim();
      if (liveNames.some(name => name === channelName)) {
        card.classList.add('is-live-channel');
      } else {
        card.classList.remove('is-live-channel');
      }
    }
  });
}

// Home screen preview: show all categories as cards with "View All Channels" button
// Clicking any category opens the full Live TV browser filtered to that category
function renderChannelsPreview() {
  const grid = document.getElementById('channelsPreviewGrid');
  if (!grid) return;
  const OTHERS_LOGO = 'https://raw.githubusercontent.com/saptarshiorg/saptarshiorg.github.io/main/logo.png';
  const all = (window._cmsChannels || []).filter(c => (c.group || '').trim() !== 'News');
  if (!all.length) { grid.innerHTML = ''; return; }

  // One representative channel per section/group (Star Sports, Sony Sports,
  // FanCode, etc.) instead of just grabbing whichever channels happen to
  // sort first overall — so the home preview actually shows a spread of
  // categories. Within a group, a live channel is preferred over an
  // off-air one; groups with a live pick are shown first.
  const isLive = c => (c.status_live_off || '').toUpperCase() === 'LIVE';
  const groupOf = c => (c.group || '').trim() || 'Other';
  const byGroup = new Map();
  all.forEach(c => {
    const g = groupOf(c);
    const current = byGroup.get(g);
    if (!current || (!isLive(current) && isLive(c))) byGroup.set(g, c);
  });
  const preview = Array.from(byGroup.values())
    .sort((a, b) => (isLive(b) ? 1 : 0) - (isLive(a) ? 1 : 0));

  const channelCards = preview.map(c => {
    const grp = (c.group || '').trim() || 'Other';
    const live = isLive(c);
    const streamUrl = c.watch_url || '#';
    return `
    <a class="fx2-card" href="#sxTabPanels"
      onclick="event.preventDefault();openStreamPlayer('${escJs(streamUrl)}','${escJs(c.channel_name || 'Live Stream')}','channel');">
      <div class="fx2-thumb">
        <img loading=lazy decoding=async src="${c.icon_url || OTHERS_LOGO}" alt="" class="fx2-thumb-img" onerror="this.src='${OTHERS_LOGO}'">
        ${live ? '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span>' : ''}
        ${(typeof sxHeartBtnHtml === 'function') ? sxHeartBtnHtml('channels', sxChanFavKey(c), c) : ''}
      </div>
      <div class="fx2-body">
        <div class="fx2-title-row">
          <div class="fx2-title">${c.channel_name || ''}</div>
          <span class="fx2-free">FREE</span>
        </div>
        <div class="fx2-meta">
          <span class="fx2-tag">${grp}</span>
          <span class="fx2-date">24/7 Channel</span>
        </div>
      </div>
    </a>`;
  }).join('');

  const viewAllCard = `
    <a class="fx2-viewall" href="#sxTabPanels" onclick="event.preventDefault();openLiveTV();">
      <span class="fx2-viewall-arrow">→</span>
      <span class="fx2-viewall-text">VIEW ALL</span>
    </a>`;

  grid.innerHTML = channelCards + viewAllCard;
}

function renderFixtures(rows) {
  // Homepage "Matches" preview now pulls from the same MATCH CARDS data
  // as the full Matches page / hero cards, instead of the old FIXTURES
  // sheet — kept short on purpose ("View All" opens the full Matches
  // page). The full list lives in the Matches overlay.
  //
  // Ordering priority for the home preview:
  //   1) LIVE matches first (WORLD CUP-branded live ahead of other live)
  //   2) Today's UPCOMING matches next, soonest start time first
  //   3) Tomorrow's UPCOMING matches last — these only appear at all once
  //      it's past 10 PM the previous day (see sxNextDayPreviewUnlocked),
  //      also soonest-start-first
  // Finished matches never appear on the home preview. If nothing
  // qualifies, the section shows a "NO MATCHES LISTED" message instead of
  // an empty grid.
  const isWorldCup = c => /worl/i.test(c.game || '');
  const isLiveCard = c => matchStatusText(c).toLowerCase() === 'live';
  const fixtureDayTier = c => {
    if (isLiveCard(c)) return 0;
    return sxIsSameLocalDay(sxMatchStartDate(c)) ? 1 : 2; // 1 = today, 2 = tomorrow
  };
  const fixtureRank = c => {
    const tier = fixtureDayTier(c);
    if (tier === 0) return isWorldCup(c) ? 0 : 1; // live
    if (tier === 1) return isWorldCup(c) ? 2 : 3; // today, upcoming
    return isWorldCup(c) ? 4 : 5;                 // tomorrow, upcoming
  };
  const fixtureStartMs = c => {
    const d = sxMatchStartDate(c);
    return d ? d.getTime() : Infinity;
  };
  // Home screen shows live + today's matches, plus tomorrow's matches once
  // the 10 PM unlock has kicked in — anything further out is left for the
  // full Matches page ("Watch Next Matches").
  const source = (window._matchCardsData || [])
    .filter(c => !isMatchFinished(c))
    .filter(sxIsHomeEligibleMatch)
    .slice()
    .sort((a, b) => fixtureRank(a) - fixtureRank(b) || fixtureStartMs(a) - fixtureStartMs(b));
  const fx = source.slice(0, 11);
  const grid = document.getElementById('fixtures-grid');
  if (!grid) return;
  if (!fx.length) {
    grid.innerHTML = `
    <div class="smo-empty-box smo-empty-today">
      <span>No matches listed today</span>
      <button type="button" class="smo-next-btn" onclick="openMatches()">▶ Watch Next Matches</button>
    </div>`;
    if (typeof window.fcxAppendFixturesPreview === 'function') window.fcxAppendFixturesPreview();
    return;
  }
  grid.innerHTML = fx.map(c => {
    const isLive = matchStatusText(c).toLowerCase() === 'live';
    const thumb = (c.banner_url || c.banner_image_url || c._fcxBanner)
      ? `<img loading=lazy decoding=async src="${c.banner_url || c.banner_image_url || c._fcxBanner}" alt="" class="fx2-thumb-img" onerror="this.style.display='none'">`
      : `<div class="fx2-thumb-teams">
           <div class="fx2-thumb-team">${img(c.team1_icon_url,c.team1_code||'','')}</div>
           <div class="fx2-thumb-vs">VS</div>
           <div class="fx2-thumb-team">${img(c.team2_icon_url,c.team2_code||'','')}</div>
         </div>`;
    // Upcoming cards are clickable too now — they open the server selector
    // with the red "Match will be live at …" notice instead of doing nothing.
    const tag = 'a';
    const clickAttr = ` href="${isLive ? matchWatchHref(c.btn_url) : 'javascript:void(0)'}" onclick="return sxHandleMatchWatch(event,'${sxServersEnc(c)}','${escJs(c.btn_url)}','${escJs((c.team1_code||'')+' vs '+(c.team2_code||''))}','${sxMatchInfoEnc(c,(c.team1_code||'')+' vs '+(c.team2_code||''))}')"`;
    return `
    <${tag} class="fx2-card" data-live="${isLive?'1':'0'}" data-start-ms="${fixtureStartMs(c)}"${clickAttr}>
      <div class="fx2-thumb">
        ${thumb}
        ${isLive ? '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span>' : ''}
      </div>
      <div class="fx2-body">
        <div class="fx2-title-row">
          <div class="fx2-title">${c.team1_full_name||c.team1_code||''} vs ${c.team2_full_name||c.team2_code||''}</div>
          <span class="fx2-free">FREE</span>
        </div>
        <div class="fx2-meta">
          <span class="fx2-tag">${c.game||'Live Sports'}</span>
          <span class="fx2-date">${smoCardDateLabel(c)}</span>
        </div>
      </div>
    </${tag}>`;
  }).join('') + `
    <a class="fx2-viewall" href="#sxTabPanels" onclick="event.preventDefault();openMatches();">
      <span class="fx2-viewall-arrow">→</span>
      <span class="fx2-viewall-text">VIEW ALL</span>
    </a>`;

  // This just rebuilt #fixtures-grid from scratch — put back any FanCode
  // preview cards a prior FCX refresh had already added.
  if (typeof window.fcxAppendFixturesPreview === 'function') window.fcxAppendFixturesPreview();
}

function renderCategories(rows) {
  // Sports / Categories section was permanently removed — no-op.
  return;
}

function renderBroadcast(rows) {
  // Where to Watch / Broadcast section was permanently removed — no-op.
  return;
}

function renderSchedule(rows) {
  // Schedule section was permanently removed — no-op.
  return;
}

function renderSocial(rows) {
  if (!rows) return;
  const items = active(rows);
  const el = document.getElementById('social-links');
  el.innerHTML = items.map(s =>
    `<a class="social-link" href="${s.url||'#'}" target="_blank" rel="noopener">${s.icon_emoji||''} ${s.label}</a>`
  ).join('');
}

function renderFooter(rows) {
  // NOTE: footer nav is now hardcoded to mirror the main nav bar
  // (Home / Live TV / Matches / OTT / Movies) instead of reading
  // the old sports-category links (Cricket/Football/Tennis/Formula 1/
  // Watch Free/Channels/Schedule) from the FOOTER sheet. Sheet rows
  // are ignored here on purpose — same pattern as renderNav().
  const nav = document.getElementById('footer-nav');
  if (!nav) return;
  const FOOTER_ITEMS = [
    { label:'Home',     onclick:"goHome();return false;" },
    { label:'Live TV',  onclick:"openLiveTV();return false;" },
    { label:'Matches',  onclick:"sxSwitchTab('matches');return false;" },
    { label:'OTT',      onclick:"openOTT();return false;" },
    { label:'Movies',   onclick:"openMoviesOverlay();return false;" },
  ];
  nav.innerHTML = FOOTER_ITEMS.map(l => `<a href="#" onclick="${l.onclick}">${l.label}</a>`).join('');
}

function renderWatchPopup(rows) {
  if (!rows) return;
  const items = active(rows);
  const body = document.getElementById('watch-modal-body');

  const featured = items.filter(r => (r.is_featured_true_false||r.is_featured||'').toUpperCase()==='TRUE');
  const rest = items.filter(r => (r.is_featured_true_false||r.is_featured||'').toUpperCase()!=='TRUE');

  const badgeHtml = b => {
    const bm = {free:'badge-free FREE',nologin:'badge-nologin NO LOGIN',['4k']:'badge-4k 4K',unavail:'badge-unavail UNAVAIL'};
    if (!b || !bm[b.toLowerCase()]) return '';
    const [cls, txt] = bm[b.toLowerCase()].split(' ');
    return `<span class="${cls}">${txt}</span>`;
  };

  let html = '';
  featured.forEach(f => {
    html += `
    <a class="watch-sx-featured" href="${sxResolveFanCodeMatchUrl(f.watch_url||'#')}">
      <div class="watch-ch-logo">${img(f.icon_url,'',)}</div>
      <div class="watch-ch-info">
        <div class="watch-ch-name" style="font-size:16px;font-weight:900">${f.channel_name}</div>
        <div style="display:flex;gap:6px;margin-top:4px">${badgeHtml(f.badge)}</div>
      </div>
      <span class="watch-ch-arrow">›</span>
    </a>`;
  });

  const groups = [...new Set(rest.map(r => r.language_group))].filter(Boolean);
  groups.forEach(g => {
    const groupItems = rest.filter(r => r.language_group === g);
    html += `<div class="watch-lang-section"><div class="watch-lang-label">${g}</div><div class="watch-channels">`;
    groupItems.forEach(ch => {
      const isUnavail = (ch.badge||'').toLowerCase() === 'unavail';
      html += `
      <a class="watch-channel-btn${isUnavail?' unavail-card':''}" href="${sxResolveFanCodeMatchUrl(ch.watch_url||'#')}">
        <div class="watch-ch-logo">${img(ch.icon_url,'')}</div>
        <div class="watch-ch-info">
          <div class="watch-ch-name">${ch.channel_name}</div>
          <div style="margin-top:2px">${badgeHtml(ch.badge)}</div>
        </div>
        <span class="watch-ch-arrow">›</span>
      </a>`;
    });
    html += `</div></div>`;
  });

  body.innerHTML = html;
}

// ── MAIN INIT ────────────────────────────────────────────────
async function init() {
  const steps = [
    ['SETTINGS',     renderSettings,   15, 'Loading settings…'],
    ['TICKER',       renderTicker,     22, 'Loading live ticker…'],
    ['NAVBAR',       renderNav,        30, 'Building navigation…'],
    ['HERO SLIDES',  renderSlides,     38, 'Loading featured slides…'],
    ['MATCH CARDS',  renderMatchCards, 46, 'Loading match cards…'],
    ['LIVE CHANNELS',renderChannels,   54, 'Loading live channels…'],
    ['CATEGORIES',   renderCategories, 68, 'Loading categories…'],
    ['BROADCAST',    renderBroadcast,  74, 'Loading broadcast partners…'],
    ['SCHEDULE',     renderSchedule,   80, 'Loading schedule…'],
    ['SOCIAL LINKS', renderSocial,     86, 'Loading social links…'],
    ['FOOTER',       renderFooter,     92, 'Loading footer…'],
    ['WATCH POPUP',  renderWatchPopup, 98, 'Loading watch options…'],
  ];

  setProgress(40, 'Fetching CMS data…');

  // Fire every sheet fetch in parallel instead of one-by-one — this is the
  // single biggest speed win, since 13 sequential round-trips become 1 wait
  // for the slowest of them, run together.
  const results = await Promise.all(
    steps.map(([sheet]) => fetchSheet(sheet).catch(e => { console.warn(`Sheet "${sheet}" failed:`, e); return null; }))
  );

  // Render in the original, correct visual order once all data is back.
  const liveChannelsIdx = steps.findIndex(([sheet]) => sheet === 'LIVE CHANNELS');
  steps.forEach(([sheet, render, pct, label], i) => {
    setProgress(pct, label);
    try {
      // HERO SLIDES also gets the LIVE CHANNELS rows, so that if the sheet
      // has no active slides it can fall back to a channels banner instead
      // of rendering nothing.
      if (sheet === 'HERO SLIDES') {
        render(results[i], results[liveChannelsIdx]);
      } else {
        render(results[i]);
      }
    } catch (e) {
      console.warn(`Render step "${sheet}" failed, continuing:`, e);
    }
  });

  // PANELS registry: drives FIFA / WT20 / any future panels independently
  setProgress(99, 'Loading special events…');
  try {
    const panelRows = await fetchSheet('PANELS');
    await renderPanelsFromRegistry(panelRows);
  } catch (e) {
    console.warn('Panels step failed, continuing:', e);
  }

  setProgress(100, 'READY');
}

// ── UI HELPERS ───────────────────────────────────────────────
function isStreamPlayerActive() {
  const el = document.getElementById('stream-player-overlay');
  return !!(el && el.classList.contains('open'));
}
function toggleDrawer() {
  // Strictly block the nav drawer from opening while the stream player
  // is active — the player takes over the whole screen and the nav
  // should not be reachable behind/through it.
  if (isStreamPlayerActive()) return;
  document.getElementById('sideDrawer').classList.toggle('open');
  document.getElementById('drawerOverlay').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  const mts = document.getElementById('mts-hamburger');
  if (mts) mts.classList.toggle('open');
  // close QR if open
  document.getElementById('qr-panel').classList.remove('open');
  document.getElementById('nav-qr-btn').classList.remove('active');
}
function closeDrawer() {
  document.getElementById('sideDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  const mts = document.getElementById('mts-hamburger');
  if (mts) mts.classList.remove('open');
}
function openWatch() { document.getElementById('watchOverlay').classList.add('open'); }
function closeWatch() { document.getElementById('watchOverlay').classList.remove('open'); }
function toggleQr() {
  document.getElementById('qr-panel').classList.toggle('open');
  document.getElementById('nav-qr-btn').classList.toggle('active');
}

// ── GEO CHECK — Star Sports / Sony Sports / ZEE are India & Sri Lanka only.
// Detect the visitor's country once (client-side IP lookup) and, for those
// three categories, show a banner telling non-IN/LK visitors to use an
// Indian VPN. Non-blocking: browsing/watching still works either way.
(function(){
  const INDIA_LOCKED_GROUPS = ['Star Sports', 'Sony Sports', 'ZEE'];
  const ALLOWED_COUNTRIES = ['IN', 'LK'];
  window._sxCountry = null; // 'IN' | 'LK' | other ISO code | 'UNKNOWN'

  function updateGeoBanner(activeGrp) {
    const banner = document.getElementById('epg-geo-banner');
    const browser = document.getElementById('ch-browser');
    const country = window._sxCountry;
    const isForeign = country && country !== 'UNKNOWN' && !ALLOWED_COUNTRIES.includes(country);
    // The red card/badge styling for Star Sports, Sony Sports & ZEE cards
    // should only ever show for visitors outside India & Sri Lanka — never
    // for Indian/Sri Lankan users, and never before geo detection resolves.
    if (browser) browser.classList.toggle('geo-foreign', !!isForeign);
    if (!banner) return;
    const needsIndia = INDIA_LOCKED_GROUPS.includes(activeGrp);
    banner.style.display = (needsIndia && isForeign) ? 'flex' : 'none';
  }
  window._sxUpdateGeoBanner = updateGeoBanner;

  fetch(EV_CONFIG.IP_API)
    .then(r => r.json())
    .then(d => {
      window._sxCountry = (d && d.success && d.country_code) ? d.country_code : 'UNKNOWN';
    })
    .catch(() => { window._sxCountry = 'UNKNOWN'; })
    .finally(() => {
      // Re-check the banner against whatever tab is active once geo resolves,
      // in case the user already clicked Star/Sony/ZEE before detection finished.
      const catSel = document.getElementById('chCategorySelect');
      updateGeoBanner(catSel ? catSel.value : 'All');
      // Also correct the FanCode panel's mirror in case it was opened
      // before geo detection finished (it defaults to the India mirror).
      if (typeof sxApplyFanCodeUrl === 'function') sxApplyFanCodeUrl();
    });
})();

// ── Country name/code (from the sheet's "country" column) → ISO-3166 alpha-2
//    → small flag image (flagcdn.com, same source already used by the FIFA
//    bracket elsewhere on this page). Accepts full names, common
//    abbreviations, or a bare 2-letter code straight from the CMS.
const COUNTRY_TO_ISO2 = {
  'usa':'us','us':'us','united states':'us','united states of america':'us','america':'us',
  'uk':'gb','united kingdom':'gb','britain':'gb','great britain':'gb','england':'gb',
  'india':'in','bharat':'in',
  'canada':'ca','australia':'au','new zealand':'nz',
  'pakistan':'pk','bangladesh':'bd','sri lanka':'lk','nepal':'np','bhutan':'bt','afghanistan':'af',
  'uae':'ae','united arab emirates':'ae','saudi arabia':'sa','qatar':'qa','kuwait':'kw','bahrain':'bh','oman':'om',
  'germany':'de','france':'fr','spain':'es','italy':'it','portugal':'pt','netherlands':'nl','belgium':'be',
  'switzerland':'ch','austria':'at','sweden':'se','norway':'no','denmark':'dk','finland':'fi','poland':'pl',
  'ireland':'ie','scotland':'gb-sct','wales':'gb-wls','russia':'ru','ukraine':'ua','greece':'gr','turkey':'tr',
  'japan':'jp','south korea':'kr','korea':'kr','china':'cn','hong kong':'hk','taiwan':'tw','singapore':'sg',
  'malaysia':'my','indonesia':'id','philippines':'ph','thailand':'th','vietnam':'vn','myanmar':'mm',
  'brazil':'br','mexico':'mx','argentina':'ar','colombia':'co','chile':'cl','peru':'pe',
  'south africa':'za','nigeria':'ng','kenya':'ke','egypt':'eg','morocco':'ma',
  'israel':'il','iran':'ir','iraq':'iq','jordan':'jo','lebanon':'lb',
  'international':'', 'global':'', 'world':''
};
function countryFlagHTML(rawCountry){
  const raw = (rawCountry || '').trim();
  if (!raw) return '';
  let iso = raw.toLowerCase();
  if (COUNTRY_TO_ISO2.hasOwnProperty(iso)) iso = COUNTRY_TO_ISO2[iso];
  else if (/^[a-z]{2}$/.test(iso)) { /* already a bare ISO-2 code from the sheet */ }
  else iso = '';
  if (!iso) return '';
  return `<img class="epg-flag" src="https://flagcdn.com/w40/${iso}.png" alt="${raw}" title="${raw}" loading="lazy">`;
}

// ── CMS-DRIVEN CHANNELS BROWSER (reads LIVE CHANNELS sheet) — EPG list UI ──
(function(){
  const OTHERS_LOGO = 'https://raw.githubusercontent.com/saptarshiorg/saptarshiorg.github.io/main/logo.png';

  let chActiveGrp = 'All'; // EPG guide is open by default now — it's its own view

  // Category dropdown is built dynamically from whatever values appear in
  // the sheet's "group" column — no hardcoded categories anymore. Any
  // channel/category name placed in that column will just show up here.
  window.chBuildCategories = function() {
    const sel = document.getElementById('chCategorySelect');
    if (!sel) return;
    const prevVal = sel.value || chActiveGrp || 'All';
    const all = window._cmsChannels || [];
    const seen = new Set();
    const cats = [];
    all.forEach(c => {
      const grp = (c.group || '').trim() || 'Other';
      if (!seen.has(grp)) { seen.add(grp); cats.push(grp); }
    });
    sel.innerHTML = '<option value="All">All Channels</option>' +
      cats.map(g => `<option value="${g}">${g}</option>`).join('');
    sel.value = cats.includes(prevVal) ? prevVal : 'All';
    chActiveGrp = sel.value;
  };

  window.chOnCategoryChange = function() {
    const sel = document.getElementById('chCategorySelect');
    chActiveGrp = sel ? sel.value : 'All';
    if (window._sxUpdateGeoBanner) window._sxUpdateGeoBanner(chActiveGrp);
    chFilter();
  };

  // Used by quick-link buttons (e.g. the "News" shortcut) to jump straight
  // to a category. Falls back to "All" if that category isn't present.
  window.chSelectCategory = function(grp) {
    const sel = document.getElementById('chCategorySelect');
    if (!sel) return;
    const hasOption = [...sel.options].some(o => o.value === grp);
    sel.value = hasOption ? grp : 'All';
    chOnCategoryChange();
  };

  window.chClearSearch = function() {
    const input = document.getElementById('chSearchInput');
    if (!input) return;
    input.value = '';
    chFilter();
    input.focus();
  };

  function chLogoHTML(c) {
    const url = c.icon_url || OTHERS_LOGO;
    const initials = (c.channel_name || '?').slice(0, 4).toUpperCase();
    return `<div class="epg-logo-box">
      <img loading=lazy decoding=async src="${url}" alt="${c.channel_name||''}" onerror="this.parentElement.outerHTML='<div class=\\'epg-logo-ph\\'>${initials}</div>'">
    </div>`;
  }
  window.chLogoHTML = chLogoHTML;

  window.chFilter = function() {
    const grid = document.getElementById('chGrid');
    if (!grid) return;
    // Maintenance mode: show the notice instead of any search/category
    // results, and skip the rest of the filtering entirely.
    if (window._channelsMaintenance) {
      grid.style.display = 'flex';
      grid.innerHTML = sxMaintenanceHtml(sxMaintenanceReason('maintain_channels'));
      const countEl0 = document.getElementById('epgCount');
      if (countEl0) countEl0.textContent = '';
      return;
    }
    const qInput = document.getElementById('chSearchInput');
    const q = (qInput ? qInput.value : '').toLowerCase().trim();
    const sel = document.getElementById('chCategorySelect');
    if (sel) chActiveGrp = sel.value || 'All';
    const clearBtn = document.getElementById('epgSearchClear');
    const countEl = document.getElementById('epgCount');
    if (clearBtn) clearBtn.classList.toggle('show', !!q);

    const effectiveGrp = q ? 'All' : chActiveGrp;
    grid.style.display = 'flex';
    grid.innerHTML = '';

    // All channels now come straight from the LIVE CHANNELS sheet.
    // Category is whatever's in the sheet's "group" column — no fixed list.
    const all = window._cmsChannels || [];
    const filtered = all.filter(c => {
      const grp = c.group || 'Other';
      const matchGrp = effectiveGrp === 'All' || grp === effectiveGrp;
      const matchQ = !q || (c.channel_name||'').toLowerCase().includes(q);
      return matchGrp && matchQ;
    });

    if (countEl) {
      const liveN = filtered.filter(c => (c.status_live_off||'').toUpperCase() === 'LIVE').length;
      countEl.textContent = filtered.length
        ? `${filtered.length} channel${filtered.length===1?'':'s'} · ${liveN} live now`
        : '';
    }

    if (!filtered.length) {
      grid.innerHTML = '<div class="epg-no-results">No channels found. Try a different search or category.</div>';
      return;
    }

    function appendRow(c) {
      // Shared builder also used by Search + Favourites — adds the
      // tap-to-favourite heart button and keeps the exact same markup/
      // classes this row always had.
      const wrap = document.createElement('div');
      wrap.innerHTML = sxChannelRowOuterHtml(c).trim();
      grid.appendChild(wrap.firstElementChild);
    }

    if (effectiveGrp === 'All') {
      // Group by category, each with its own heading, in the order
      // categories first appear in the sheet.
      const order = [];
      const buckets = {};
      filtered.forEach(c => {
        const grp = c.group || 'Other';
        if (!buckets[grp]) { buckets[grp] = []; order.push(grp); }
        buckets[grp].push(c);
      });
      order.forEach(grp => {
        const heading = document.createElement('div');
        heading.className = 'epg-cat-heading';
        heading.textContent = grp;
        grid.appendChild(heading);
        buckets[grp].forEach(appendRow);
      });
    } else {
      filtered.forEach(appendRow);
    }
    // Apply 16:9 styling to live channel cards
    setTimeout(() => { applyLiveChannelCardStyles(); }, 0);
  };

  // Guide is open by default, showing "All" — category list is built
  // fresh from the sheet's group column as soon as channels arrive.
  document.addEventListener('DOMContentLoaded', () => {
    const g = document.getElementById('chGrid');
    if (g) g.style.display = 'flex';
    if (window._cmsChannels) { chBuildCategories(); chFilter(); }
  });
})();
// ── END CMS-DRIVEN CHANNELS BROWSER ──────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('cms-loader');
  let dismissed = false;

  // ── DEVELOPER BYPASS ─────────────────────────────────────────
  // Open the page with ?dev=1 (or #dev) to skip the wait entirely
  // and inspect the raw layout/markup instantly.
  const params = new URLSearchParams(location.search);
  const DEV_MODE = params.get('dev') === '1' || location.hash.includes('dev');

  function hideLoader() {
    if (dismissed) return;
    dismissed = true;
    loader.classList.add('done');
    setTimeout(() => loader.style.display = 'none', 500);
  }

  if (DEV_MODE) {
    console.info('🛠️ DEV MODE — loader skipped instantly.');
    dismissed = true;
    loader.style.display = 'none';
    init().catch(e => console.warn('DEV MODE: init() error (ignored):', e));
  } else {
    // YT-style pattern: only show the branded splash for a brief instant,
    // then reveal the real page frame — the grids/rows underneath already
    // hold shimmering skeleton placeholders (see .sk-* CSS + markup), so
    // the moment the splash lifts it reads as "already loaded, just data
    // filling in" rather than a blocking loading screen. A short fixed
    // timer replaces the old wait-for-full-init behavior; init() still
    // runs in the background exactly as before and simply swaps each
    // skeleton block for real content (via innerHTML) whenever it's ready.
    const BRAND_MIN_MS = 2300, BRAND_MAX_MS = 3800, _t0 = performance.now();   // logo animation: at least 1.3s, at most 2.6s
    const hideAfterMin = () => setTimeout(hideLoader, Math.max(0, BRAND_MIN_MS - (performance.now() - _t0)));
    const quickTimer = setTimeout(hideLoader, BRAND_MAX_MS);

    init()
      .then(() => {
        clearTimeout(quickTimer);
        hideAfterMin();
        
        // ── AUTO-REFRESH MATCH CARDS SHEET every 60 seconds ──
        // Fetches the latest MATCH CARDS data and re-renders to reflect live updates
        let _mcLastJson = '';
        setInterval(async () => {
          try {
            const matchCardsData = await fetchSheet('MATCH CARDS');
            if (matchCardsData) {
              // PERF: skip the full rebuild when the sheet hasn't changed
              const _j = JSON.stringify(matchCardsData);
              if (_j === _mcLastJson) return;
              _mcLastJson = _j;
              renderMatchCards(matchCardsData);
              console.log('[AUTO-REFRESH] MATCH CARDS sheet updated at', new Date().toLocaleTimeString());
            }
          } catch (e) {
            console.warn('[AUTO-REFRESH] MATCH CARDS fetch failed:', e);
          }
        }, 60000); // 60 seconds = 60,000 milliseconds
      })
      .catch(e => {
        console.warn('init() error (ignored):', e);
        clearTimeout(quickTimer);
        hideAfterMin();
      });
  }

  // Close QR panel on outside click
  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('nav-qr-wrap');
    if (wrap && !wrap.contains(e.target)) {
      document.getElementById('qr-panel').classList.remove('open');
      document.getElementById('nav-qr-btn').classList.remove('active');
    }
  });
});

;

(function(){
  // Bottom tabs get their active state synced by sxSwitchTab() via data-sxtab.
  window.__mtabSetActive = function(el){
    document.querySelectorAll('.mtab[data-sxtab]').forEach(t => t.classList.toggle('active', t === el));
  };
})();

;

function openAdminChat(){
  sxCloseAllOverlays();
  document.getElementById('adminchat-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'feedback'));
  sxHeaderInto('adminchat-overlay', null);
  clearTimeout(window.__adminchatPopupTimer);
  window.__adminchatPopupTimer = setTimeout(function(){
    document.getElementById('adminchat-discord-popup').classList.add('open');
  }, 1200);
}
function closeAdminChat(){
  document.getElementById('adminchat-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
  closeAdminChatDiscordPopup();
}
function closeAdminChatDiscordPopup(){
  clearTimeout(window.__adminchatPopupTimer);
  document.getElementById('adminchat-discord-popup').classList.remove('open');
}

;

// Casts whatever is currently open in the stream player to a TV. This
// only works for channels whose watch_url is a direct HLS (.m3u8) feed —
// the Cast receiver needs an actual media URL to fetch and play itself,
// so it can't reach into a cross-origin iframe embed the way our own
// player does. For embed-only channels we tell the user plainly rather
// than pretending to cast something that won't play.
var sxCastContext = null;
var sxCastAvailable = false;
var sxCurrentStreamRawUrl = '';

window['__onGCastApiAvailable'] = function(isAvailable){
  if (!isAvailable || !window.chrome || !chrome.cast || !cast.framework) return;
  try {
    sxCastContext = cast.framework.CastContext.getInstance();
    sxCastContext.setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });
    sxCastAvailable = true;
    sxCastContext.addEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      sxUpdateCastButtonState
    );
    sxUpdateCastButtonState();
  } catch (e) {
    console.warn('Cast init failed:', e);
  }
};

function sxUpdateCastButtonState(){
  var btn = document.getElementById('stream-player-cast');
  if (!btn || !sxCastContext) return;
  var connected = sxCastContext.getCastState() === cast.framework.CastState.CONNECTED;
  btn.classList.toggle('sp-cast-active', connected);
  btn.title = connected ? 'Casting to TV — tap to manage' : 'Cast to TV';
}

function sxIsHlsUrl(u){
  u = String(u || '').trim();
  if (!/^https?:\/\//i.test(u)) return false;
  try {
    var x = new URL(u);
    return /\.m3u8$/i.test(x.pathname) || /(^|&)(format|type)=(m3u8|hls)(&|$)/i.test(x.search.slice(1));
  } catch (e) {
    return /\.m3u8(\?|#|$)/i.test(u);
  }
}
// DASH (.mpd) manifests — played by dash.js inside the same SX 4K player.
function sxIsDashUrl(u){
  u = String(u || '').trim();
  if (!/^https?:\/\//i.test(u)) return false;
  try {
    var x = new URL(u);
    return /\.mpd(\/|$)/i.test(x.pathname) || /(^|&)(format|type)=(mpd|dash)(&|$)/i.test(x.search.slice(1));
  } catch (e) {
    return /\.mpd(\?|#|$)/i.test(u);
  }
}
// Any clear stream our own player can handle (HLS or DASH).
function sxIsStreamUrl(u){ return sxIsHlsUrl(u) || sxIsDashUrl(u); }
window.sxIsHlsUrl = sxIsHlsUrl; window.sxIsDashUrl = sxIsDashUrl; window.sxIsStreamUrl = sxIsStreamUrl;

// WebView detection (Android WebView / iOS WKWebView / in-app browsers) — passed into the
// player so stream errors read "Stream unavailable" there, but stay specific in a browser.
function sxIsWebView(){
  var ua = window.__evRealUA || navigator.userAgent || '';
  if (/; wv\)/i.test(ua)) return true;
  if (/Android/i.test(ua) && /Version\/[\d.]+/i.test(ua) && /Chrome\/[\d.]+/i.test(ua)) return true;
  if (/(iPhone|iPod|iPad)/i.test(ua) && !/Safari\//i.test(ua) && !navigator.standalone) return true;
  if (/\b(FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|Snapchat|GSA\/)/i.test(ua)) return true;
  try { if (window.ReactNativeWebView || window.flutter_inappwebview || window.AndroidBridge) return true; } catch(e){}
  return false;
}
window.sxIsWebView = sxIsWebView;
// http:// -> https:// when this page is https (avoids mixed-content blocking in Multiview slots).
function sxUpHttps(u){ u = String(u || ''); return (location.protocol === 'https:' && /^http:\/\//i.test(u)) ? u.replace(/^http:\/\//i, 'https://') : u; }

// Broader "is this a direct, playable stream link rather than a page/embed"
// check — DASH (.mpd) and plain .m3u playlists count too, not just .m3u8.
// Used to flag channel rows / match servers as "external player" cards
// (orange styling + VLC icon) instead of routing them through our own
// in-page iframe player, which can't play a raw manifest URL anyway.
function sxIsRawStreamUrl(u){
  if (!u) return false;
  // Clear HLS (.m3u8 over http/https) now plays in our own SX 4K player, so
  // it is no longer an "external player" link. Only DASH / plain .m3u / odd
  // manifests still go to the VLC popup.
  if (sxIsStreamUrl(u)) return false; // HLS and DASH (.mpd) both play in our own player now
  return /\.(m3u8|m3u|mpd)(\?|#|$)/i.test(u) || /[?&](format|type)=(m3u8|m3u|mpd|dash)/i.test(u);
}

// vlc://<url> is the scheme VLC's own installer/app registers on desktop
// (Windows/macOS) and mobile (iOS/Android) alike — handing it a raw
// manifest URL launches VLC directly with that stream loaded.
function sxVlcSchemeUrl(rawUrl){
  return 'vlc://' + rawUrl;
}

// MX Player (Android) intent link — only meaningful on Android, so this is
// only offered in the mobile branch of the popup below.
function sxMxPlayerUrl(rawUrl, title){
  return 'intent:' + rawUrl + '#Intent;package=com.mxtech.videoplayer.ad;S.title=' + encodeURIComponent(title || 'Live Stream') + ';end';
}

function sxCopyStreamLink(text){
  const done = () => sxCastToast('Stream link copied.');
  const fail = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { sxCastToast('Could not copy the link.'); }
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fail);
  } else {
    fail();
  }
}


// ── SX 4K PLAYER glue ────────────────────────────────────────────────────
var _sx4kTpl = null;
function sx4kDoc(url, title){
  if (_sx4kTpl === null){
    var el = document.getElementById('sx4k-player-src');
    _sx4kTpl = el ? el.textContent.replace(/<\\\/script/gi, '</script') : '';
  }
  var boot = 'window.SX4K_BOOT=' + JSON.stringify({ url: url, title: title || '', embed: true, webview: sxIsWebView() }).replace(/</g, '\\u003c') + ';';
  return _sx4kTpl.replace('/*__SX4K_BOOT__*/', function(){ return boot; });
}
window.addEventListener('message', function(e){
  var f = document.getElementById('stream-player-frame');
  if (!f || e.source !== f.contentWindow) return;
  var d = e.data;
  if (!d || typeof d.type !== 'string' || d.type.indexOf('sx4k:') !== 0) return;
  var u = sxCurrentStreamRawUrl || '';
  if (d.type === 'sx4k:vlc' && u){
    var n = (document.getElementById('stream-player-title') || {}).textContent || 'Live Stream';
    closeStreamPlayer();
    sxOpenVlcPopup(u, n);
  } else if (d.type === 'sx4k:copy' && u){
    sxCopyStreamLink(u);
  } else if (d.type === 'sx4k:cast'){
    try { sxCastCurrentStream(); } catch(err){}
  } else if (d.type === 'sx4k:fs'){
    try { spToggleFullscreen(); } catch(err){}
  }
});
// tell the embedded player whether the overlay is fullscreen (drives its fullscreen icon)
(function(){
  var ov = document.getElementById('stream-player-overlay'); if (!ov) return;
  var last = null;
  new MutationObserver(function(){
    var on = ov.classList.contains('sp-fs');
    if (on === last) return; last = on;
    var f = document.getElementById('stream-player-frame');
    try { f && f.contentWindow && f.contentWindow.postMessage({ type:'sx4k:fsstate', on:on }, '*'); } catch(e){}
  }).observe(ov, { attributes:true, attributeFilter:['class'] });
})();

// Full-screen popup offered for any raw HLS/DASH stream link (channel rows
// and match servers alike) instead of loading it in our own iframe player.
// Auto-attempts to hand the stream straight to VLC via the vlc:// scheme on
// both mobile and desktop; the popup itself stays open underneath with a
// manual retry plus a platform-appropriate fallback (MX Player on mobile,
// Copy Link on desktop) in case the OS has nothing registered for vlc://.
function sxOpenVlcPopup(rawUrl, name){
  name = name || 'Live Stream';
  let ov = document.getElementById('sx-vlc-popup-overlay');
  if (!ov){
    ov = document.createElement('div');
    ov.id = 'sx-vlc-popup-overlay';
    ov.className = 'sx-vlc-popup-overlay';
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) sxCloseVlcPopup(); });
  }
  const isMobile = sxIsMobileDevice();
  const vlcUrl = sxVlcSchemeUrl(rawUrl);
  const mxUrl = sxMxPlayerUrl(rawUrl, name);
  const fallbackBtn = isMobile
    ? `<a class="sx-vlc-popup-btn" href="${mxUrl}">Open in MX Player</a>`
    : `<button type="button" class="sx-vlc-popup-btn" onclick="sxCopyStreamLink('${escJs(rawUrl)}')">Copy Link</button>`;
  ov.innerHTML = `
    <div class="sx-vlc-popup-box">
      <button type="button" class="sx-vlc-popup-close" onclick="sxCloseVlcPopup()" aria-label="Close">&times;</button>
      <img loading=lazy decoding=async class="sx-vlc-popup-icon" src="https://images.icon-icons.com/1381/PNG/512/vlc_93519.png" alt="VLC" onerror="this.style.display='none'">
      <div class="sx-vlc-popup-title">${name}</div>
      <div class="sx-vlc-popup-sub">Direct stream link \u2014 plays best in an external player.</div>
      <div class="sx-vlc-popup-actions">
        <a class="sx-vlc-popup-btn sx-vlc-popup-btn-primary" href="${vlcUrl}">\u25B6 Open in VLC</a>
        ${fallbackBtn}
      </div>
    </div>`;
  ov.classList.add('open');
  // Auto-open VLC right away on both mobile and desktop; the popup and its
  // manual buttons stay up in case nothing is registered for vlc://.
  setTimeout(() => { window.location.href = vlcUrl; }, 60);
}
function sxCloseVlcPopup(){
  const ov = document.getElementById('sx-vlc-popup-overlay');
  if (ov) ov.classList.remove('open');
}

function sxCastToast(msg){
  var t = document.getElementById('sx-cast-toast');
  if (!t){
    t = document.createElement('div');
    t.id = 'sx-cast-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._sxCastToastTimer);
  window._sxCastToastTimer = setTimeout(function(){ t.classList.remove('show'); }, 3400);
}

function sxShowCastHelp(){
  var ov = document.getElementById('sx-cast-help-overlay');
  if (!ov){
    ov = document.createElement('div');
    ov.id = 'sx-cast-help-overlay';
    ov.className = 'sx-cast-help-overlay';
    ov.innerHTML =
      '<div class="sx-cast-help-box">' +
        '<div class="sx-cast-help-title">Cast this channel to your TV</div>' +
        '<p class="sx-cast-help-body">This channel streams through an embedded player, so one-tap Cast can\u2019t grab the video feed directly \u2014 only a direct stream link can be sent to a Cast device that way.</p>' +
        '<p class="sx-cast-help-body">You can still send this whole tab to your TV using your browser\u2019s built-in Cast (this mirrors everything on screen, including this player):</p>' +
        '<ol class="sx-cast-help-steps">' +
          '<li>Open the <b>\u22ee</b> menu in Chrome (top right)</li>' +
          '<li>Tap <b>Cast, save, and share</b> \u2192 <b>Cast\u2026</b></li>' +
          '<li>Pick your TV / Chromecast device</li>' +
        '</ol>' +
        '<button class="sx-cast-help-close" onclick="sxCloseCastHelp()">Got it</button>' +
      '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){ if (e.target === ov) sxCloseCastHelp(); });
  }
  ov.classList.add('open');
}
function sxCloseCastHelp(){
  var ov = document.getElementById('sx-cast-help-overlay');
  if (ov) ov.classList.remove('open');
}

function sxCastCurrentStream(){
  if (!sxCastAvailable || !sxCastContext){
    sxCastToast('Cast needs Chrome on an https:// page \u2014 open this site in Chrome to cast.');
    return;
  }
  var url = sxCurrentStreamRawUrl;
  if (!url){
    sxCastToast('Open a stream first, then cast it.');
    return;
  }
  if (!sxIsStreamUrl(url)){
    sxShowCastHelp();
    return;
  }
  var mediaInfo = new chrome.cast.media.MediaInfo(url, sxIsDashUrl(url) ? 'application/dash+xml' : 'application/x-mpegurl');
  mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
  mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
  mediaInfo.metadata.title = document.getElementById('stream-player-title').textContent || 'Live Stream';
  var request = new chrome.cast.media.LoadRequest(mediaInfo);

  function loadOnSession(session){
    if (!session) { sxCastToast('Could not connect to a Cast device.'); return; }
    session.loadMedia(request).then(
      function(){ sxCastToast('Casting to TV\u2026'); sxUpdateCastButtonState(); },
      function(err){ sxCastToast('Cast failed \u2014 this stream may be blocked for TV playback.'); }
    );
  }
  var session = sxCastContext.getCurrentSession();
  if (session){
    loadOnSession(session);
  } else {
    sxCastContext.requestSession().then(
      function(){ loadOnSession(sxCastContext.getCurrentSession()); },
      function(err){ if (err !== 'cancel') sxCastToast('Could not connect to a Cast device.'); }
    );
  }
}

// ── Ad-safety banner copy: mobile always points to Brave, desktop
// Chrome/Chromium points to the Adblock Plus extension. ──────────────
function sxIsMobileDevice(){
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}
function spSetAdblockBannerText(){
  const el = document.getElementById('sp-adblock-text');
  if (!el) return;
  el.innerHTML = sxIsMobileDevice()
    ? 'On mobile, always use the <b>Brave browser</b> \u2014 some ads on this stream may be harmful.'
    : 'On Chrome/Chromium, install <a href="https://chromewebstore.google.com/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb" target="_blank" rel="noopener">Adblock Plus</a> or use <b>Brave</b> \u2014 some ads on this stream may be harmful.';
}
spSetAdblockBannerText();

const SP_LOADING_DURATION_MS = 400;
const SP_LOADING_LABELS = {
  stream:  'Loading Stream',
  channel: 'Loading Channel',
  movie:   'Loading Movie',
  tv:      'Loading TV Shows',
  match:   'Loading Live Match'
};
function openStreamPlayer(url, name, type){
  if (!url || url === '#') return;
  // FanCode is embedded exactly like a Live TV channel: its /play.html?id=...
  // URL is assigned directly to the player's iframe. No JSON/HLS resolution
  // is performed by the parent page.
  if (/famcodexwebs\.pages\.dev/i.test(url)) {
    url = sxResolveFanCodeMatchUrl(url);
  }
  window._fcTok = null;
  if (!window._spServerKeep) window._spServers = null; // keep the server list only when switching server from the dropdown
  window._spServerKeep = false;
  window._spQ = null; try{ spQBtnUpdate(); spCloseQ(); }catch(e){}
  const label = name || 'Live Stream';
  const use4k = sxIsStreamUrl(url); // clear .m3u8 / .mpd from any source plays in the SX 4K player
  const isFcx = !!spFcxIdFromUrl(url); // play.html?id=..._eng FanCode links
  document.getElementById('stream-player-title').textContent = label;
  sxCurrentStreamRawUrl = url; // used by sxCastCurrentStream() below
  const src = url.includes('#') ? url : url + '#' + encodeURIComponent(label);
  spUpdateInfobar(type, label);
  if (use4k || isFcx) {
    const mEl = document.getElementById('sp-info-meta');
    if (mEl) mEl.insertAdjacentHTML('beforeend', '<span class="sp-info-4k">EVORA STREAMPULSE · AD FREE</span>');
  }
  spInitFcxSwitch(url, label);
  populateStreamPlayerRail(type, label);
  const adBanner = document.getElementById('sp-adblock-banner');
  if (adBanner) adBanner.style.display = (use4k || isFcx) ? 'none' : 'flex'; // ad-safety note is for third-party embeds
  // Loading overlay shows briefly while the stream spins up — the stream
  // itself starts loading immediately underneath, not after the delay.
  // Setting the iframe src here, before the overlay timer, means the
  // stream is already fetching in the background while the spinner is up.
  const loadingEl = document.getElementById('stream-player-loading');
  if (loadingEl){
    loadingEl.classList.remove('sp-loading-hide');
    loadingEl.style.display = 'flex';
  }
  const loadingLabelEl = document.getElementById('sp-loading-label');
  if (loadingLabelEl) loadingLabelEl.textContent = SP_LOADING_LABELS[type] || SP_LOADING_LABELS.stream;
  const loadingBarEl = document.getElementById('sp-loading-bar');
  if (loadingBarEl) {
    loadingBarEl.style.transition = 'none';
    loadingBarEl.style.width = '0%';
    void loadingBarEl.offsetWidth; // force reflow so the width change below actually animates
    loadingBarEl.style.transition = `width ${SP_LOADING_DURATION_MS}ms linear`;
    requestAnimationFrame(() => { loadingBarEl.style.width = '100%'; });
  }
  clearTimeout(window._spLoadingTimer);
  const spFrame = document.getElementById('stream-player-frame');
  if (use4k) {
    spFrame.srcdoc = sx4kDoc(url, label);
  } else {
    // FanCode uses the SAME plain iframe embedding path as Live TV channels.
    // Do not resolve its JSON/HLS here and do not inject a custom srcdoc.
    // The /play.html?id=..._eng&s=0 page is itself the player/embed page.
    spFrame.removeAttribute('srcdoc');
    spFrame.src = src;
    try{ window.evEmbedWatch && evEmbedWatch(src); }catch(e){}
  }
  document.getElementById('stream-player-overlay').classList.remove('rail-open','sv-open');
  document.getElementById('stream-player-overlay').classList.add('open');
  /* player opens inside the page (no automatic fullscreen); the fullscreen button still works */
  // Hide navbar when player opens
  const navbar = document.querySelector('.sx-topbar, [data-navbar]');
  if (navbar) navbar.style.display = 'none';
  const mobileTabbar = document.getElementById('mobile-tabbar');
  if (mobileTabbar) mobileTabbar.style.display = 'none';
  spShowTopbar();
  window._spLoadingTimer = setTimeout(() => {
    if (loadingEl) loadingEl.classList.add('sp-loading-hide');
  }, SP_LOADING_DURATION_MS);
}

// ── Bottom info bar: logo + name + tag/LIVE, matched against whichever
// dataset (channels or match cards) this stream came from. ──────────────
const SX_OTHER_LOGO = 'https://raw.githubusercontent.com/saptarshiorg/saptarshiorg.github.io/main/logo.png';
function spUpdateInfobar(type, label){
  const nameEl = document.getElementById('sp-info-name');
  const metaEl = document.getElementById('sp-info-meta');
  const logoWrap = document.getElementById('sp-info-logo');
  const logoImg = document.getElementById('sp-info-logo-img');
  if (nameEl) nameEl.textContent = evTeamName(label);
  if (!metaEl || !logoImg || !logoWrap) return;
  logoWrap.style.display = 'flex';

  if (type === 'match') {
    const m = (window._matchCardsData || []).find(c => ((c.team1_code||'') + ' vs ' + (c.team2_code||'')) === label);
    const live = m && matchStatusText(m).toLowerCase() === 'live';
    logoImg.src = (m && (m.team1_icon_url || m.team2_icon_url)) || '';
    metaEl.innerHTML = (live ? '<span class="sp-info-live">LIVE</span>' : '') + (m && m.game ? `<span>${m.game}</span>` : '');
    if (!logoImg.src) logoWrap.style.display = 'none';
  } else {
    const c = (window._cmsChannels || []).find(ch => (ch.channel_name || '') === label);
    const live = c && (c.status_live_off || '').toUpperCase() === 'LIVE';
    logoImg.src = (c && c.icon_url) || SX_OTHER_LOGO;
    logoImg.style.display = '';
    metaEl.innerHTML = (live ? '<span class="sp-info-live">LIVE</span>' : '') + (c && c.group ? `<span>${c.group}</span>` : '');
  }
}

// ── Rail sidebar (replaces a live-chat panel): "MORE CHANNELS" while
// watching a Live TV channel, "MORE MATCHES" while watching a match. ────
function populateStreamPlayerRail(type, currentLabel){
  const rail = document.getElementById('stream-player-rail-list');
  const titleEl = document.getElementById('stream-player-rail-title');
  if (!rail) return;
  const isMatch = type === 'match';
  if (titleEl) titleEl.textContent = isMatch ? 'MORE MATCHES' : 'MORE CHANNELS';
  if (type === 'movie' || type === 'tv') { try { if (spRelatedRail(rail, titleEl, type, currentLabel)) return; } catch (e) {} }

  if (isMatch) {
    // Only matches of the SAME sport as the one playing (tennis → tennis).
    let curSport = '';
    try {
      const sc = (window._matchCardsData || []).find(c => ((c.team1_code||'') + ' vs ' + (c.team2_code||'')) === currentLabel);
      const fm = (window._fcxMatchesCache || []).find(m => m.title === currentLabel);
      const lm = (window.LMX && LMX.items || []).find(i => i.title === currentLabel);
      curSport = sc ? sxSheetSport(sc)
        : fm ? fcxResolveSport(fm.category, fm.tournament, fm.title)
        : lm ? fcxResolveSport(lm.category, lm.title)
        : sxDetectSport('', currentLabel, '');
      if (curSport === 'Other') curSport = '';
    } catch (e) { curSport = ''; }
    const sameSp = s => !curSport || sxSameSport(s, curSport);
    if (titleEl && curSport) titleEl.textContent = 'MORE ' + curSport.toUpperCase() + ' MATCHES';
    const sheetList = (window._matchCardsData || []).filter(c => !isMatchFinished(c) && matchStatusText(c).toLowerCase() === 'live' && sameSp(sxSheetSport(c)));
    const sheetItems = sheetList.map(c => {
      const label = (c.team1_code||'') + ' vs ' + (c.team2_code||'');
      return `
      <button type="button" class="sp-rail-item${label===currentLabel?' active':''}" onclick="sxHandleMatchWatch(null,'${sxServersEnc(c)}','${escJs(c.btn_url)}','${escJs(label)}','${sxMatchInfoEnc(c,label)}')">
        <span class="sp-rail-thumb">${img(c.team1_icon_url||c.team2_icon_url,'','')}</span>
        <span class="sp-rail-info">
          <span class="sp-rail-name">${evTeamName(label)}</span>
          <span class="sp-rail-meta"><span class="sp-rail-live">LIVE</span>${c.game||''}</span>
        </span>
      </button>`;
    }).join('');
    // FanCode's own live matches were missing from this rail entirely —
    // it only ever read window._matchCardsData (sheet rows). Merge in
    // FanCode's live cache too, skip anything already listed as a sheet
    // row (fcxHasSheetCard — same fixture-dedup rule used elsewhere), and
    // skip the match currently playing. FanCode entries have no team
    // logos, so they get the wide banner thumb instead of the small
    // square team-icon thumb.
    const fcxList = (window._fcxMatchesCache || []).filter(m =>
      m.status === 'LIVE' &&
      m.title !== currentLabel &&
      (typeof fcxHasSheetCard !== 'function' || !fcxHasSheetCard(m)) &&
      sameSp(fcxResolveSport(m.category, m.tournament, m.title))
    );
    const fcxItems = fcxList.map(m => `
      <button type="button" class="sp-rail-item${m.title===currentLabel?' active':''}" onclick="fcxOpenWatchById('${escJs(String(m.id))}')">
        <span class="sp-rail-thumb sp-rail-thumb-banner"><img loading=lazy decoding=async src="${m.image}" alt="" onerror="this.style.display='none'"></span>
        <span class="sp-rail-info">
          <span class="sp-rail-name">${evTeamName(m.title)}</span>
          <span class="sp-rail-meta"><span class="sp-rail-live">LIVE</span>${m.tournament||''}</span>
        </span>
      </button>`
    ).join('');
    const items = sheetItems + fcxItems;
    const viewAll = `<button type="button" class="sp-rail-viewall" onclick="closeStreamPlayer();openMatches();">View All Matches</button>`;
    rail.innerHTML = (items || `<div class="sp-rail-empty">No other live ${curSport ? curSport + ' ' : ''}matches right now</div>`) + viewAll;
  } else {
    const list = (window._cmsChannels || []).filter(c => (c.status_live_off||'').toUpperCase() === 'LIVE');
    const items = list.map(c => {
      const name = c.channel_name || '';
      return `
      <button type="button" class="sp-rail-item${name===currentLabel?' active':''}" onclick="openStreamPlayer('${escJs(c.watch_url||'#')}','${escJs(name||'Live Stream')}','channel')">
        <span class="sp-rail-thumb"><img loading=lazy decoding=async src="${c.icon_url||SX_OTHER_LOGO}" alt="" onerror="this.src='${SX_OTHER_LOGO}'"></span>
        <span class="sp-rail-info">
          <span class="sp-rail-name">${evTeamName(name)}</span>
          <span class="sp-rail-meta"><span class="sp-rail-live">LIVE</span>${c.group||''}</span>
        </span>
      </button>`;
    }).join('');
    const viewAll = `<button type="button" class="sp-rail-viewall" onclick="closeStreamPlayer();openLiveTV();">View All Channels</button>`;
    rail.innerHTML = (items || `<div class="sp-rail-empty">No other live channels right now</div>`) + viewAll;
  }
}
window.populateStreamPlayerRail = populateStreamPlayerRail;
// Movies / TV: "More like this" = same-genre titles from the catalogue (not live channels)
window._spRel = [];
function spRelatedRail(rail, titleEl, type, label){
  const pool = (window.vaPools && vaPools.movie && vaPools.movie.all || []).concat(window.vaPools && vaPools.tv && vaPools.tv.all || []);
  if (!pool.length) return false;
  const base = String(label || '').toLowerCase().replace(/\s*\(\d{4}\)\s*$/, '').trim();
  const cur = pool.find(m => String(m.title || '').toLowerCase() === base);
  const g0 = cur && cur.genre ? String(cur.genre).split(/[,|]/)[0].trim().toLowerCase() : '';
  let list = pool.filter(m => m !== cur && m.poster_url && String(m.title || '').toLowerCase() !== base && (!g0 || String(m.genre || '').toLowerCase().indexOf(g0) > -1));
  if (list.length < 8) list = pool.filter(m => m !== cur && m.poster_url);
  list.sort((a, b) => (parseFloat(b.popularity) || 0) - (parseFloat(a.popularity) || 0));
  list = list.slice(0, 20); window._spRel = list;
  if (titleEl) titleEl.textContent = 'More like this';
  rail.innerHTML = list.map((m, i) => {
    const t = spServersEsc(m.title || ''), isTv = (window.vaPools && vaPools.tv && vaPools.tv.all.indexOf(m) > -1);
    return `<button type="button" class="sp-rail-item" onclick="spRelPlay(${i})"><span class="sp-rail-thumb sp-rail-thumb-banner"><img loading="eager" decoding="async" src="${spServersEsc(m.poster_url)}" alt="" onerror="this.style.display='none'"></span><span class="sp-rail-info"><span class="sp-rail-name">${t}</span><span class="sp-rail-meta">${spServersEsc([isTv ? 'TV' : 'MOVIE', m.year, m.genre ? String(m.genre).split(/[,|]/)[0].trim() : ''].filter(Boolean).join(' · '))}</span></span></button>`;
  }).join('');
  return list.length > 0;
}
window.spRelPlay = function(i){
  const m = window._spRel[i]; if (!m) return;
  const isTv = window.vaPools && vaPools.tv && vaPools.tv.all.indexOf(m) > -1;
  const label = m.title + (m.year ? ' (' + m.year + ')' : '');
  try {
    if (isTv) { closeStreamPlayer(); vaPendingTvItem = { id: m.tmdb_id || m.imdb_id, title: m.title }; vaOpenTvModal(label); }
    else { const ov = document.getElementById('stream-player-overlay'); if (ov) ov.scrollTop = 0; openStreamPlayer(vaBuildEmbedUrl(m.embed_url), label, 'movie'); }
  } catch (e) {}
};

/* ── Servers dropdown (top-right, replaces "Audio Language" in the reference UI) ── */
window._spServers = null; // { list:[{text,url,ready,raw,playName,sub}], idx } — set when a server is chosen from the match screen
function spServersEsc(t){ return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
const SP_CHECK = '<svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
const SP_LOCKI = '<svg class="lk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
function spServersRender(){
  const menu = document.getElementById('sp-servers-menu'); if (!menu) return;
  const st = window._spServers;
  let list = st && st.list && st.list.length ? st.list : [{ text:'Server 1', ready:true, url:'' }];
  let idx = st && st.list && st.list.length ? st.idx : 0;
  let html = list.map(function(x,i){
    const cls = 'sp-sv-item' + (i===idx?' on':'') + (x.ready?'':' lock');
    return '<button type="button" class="'+cls+'" role="menuitem" onclick="spPickServer('+i+')"><span class="mk">'+(i===idx?SP_CHECK:(x.ready?'':SP_LOCKI))+'</span><span class="nm">'+spServersEsc(x.text||('Server '+(i+1)))+'</span></button>';
  }).join('');
  const fc = window._spFcx;
  if (fc){
    const fm = (typeof fcxFindById==='function') ? fcxFindById(fc.id) : null;
    const hasIndia = !!(fm && fm.india);
    html += '<div class="sp-sv-sep"></div><div class="sp-sv-h">FanCode source</div>'+
      '<button type="button" class="sp-sv-item'+(fc.source==='world'?' on':'')+'" onclick="spSetFcxSource(\'world\');spServersRender()"><span class="mk">'+(fc.source==='world'?SP_CHECK:'')+'</span><span class="nm">World</span></button>'+
      '<button type="button" class="sp-sv-item'+(fc.source==='india'?' on':'')+(hasIndia?'':' lock')+'" '+(hasIndia?'':'disabled')+' onclick="spSetFcxSource(\'india\');spServersRender()"><span class="mk">'+(fc.source==='india'?SP_CHECK:(hasIndia?'':SP_LOCKI))+'</span><span class="nm">India</span></button>';
  }
  html += '<div class="sp-sv-sep"></div><button type="button" class="sp-sv-report" onclick="spReportIssue()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>Report an Issue</button>';
  menu.innerHTML = html;
}
function spToggleServers(e){
  if (e && e.stopPropagation) e.stopPropagation();
  const ov = document.getElementById('stream-player-overlay');
  const open = !ov.classList.contains('sv-open');
  if (open){ spServersRender(); spCloseRail(); try{ spCloseQ(); }catch(_){} }
  ov.classList.toggle('sv-open', open);
  const b = document.getElementById('sp-servers-btn'); if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) clearTimeout(window._spHideTimer);
}
function spCloseServers(){
  const ov = document.getElementById('stream-player-overlay'); if (!ov) return;
  ov.classList.remove('sv-open');
  const b = document.getElementById('sp-servers-btn'); if (b) b.setAttribute('aria-expanded','false');
}
function spPickServer(i){
  const st = window._spServers;
  if (!st || !st.list || !st.list[i]){ spCloseServers(); return; }
  const x = st.list[i];
  if (!x.ready){ sxCastToast('This server opens ' + (x.sub || 'before kickoff') ); return; }
  if (i === st.idx){ spCloseServers(); return; }
  const label = (document.getElementById('sp-info-name') || {}).textContent || 'Live Stream';
  spCloseServers();
  if (x.raw){ const keep = st; closeStreamPlayer(); try{ sxOpenVlcPopup(x.url, label); }catch(e){} return; }
  st.idx = i; window._spServerKeep = true;
  try { sxGoToMatchUrl(null, x.url, x.playName || label); } catch(e){ window._spServerKeep = false; }
}
function spReportIssue(){
  spCloseServers();
  try { sxCastToast('Stream not working? Tell us on Discord: rishi.ev'); } catch(e){}
}
window.spToggleServers = spToggleServers; window.spPickServer = spPickServer; window.spReportIssue = spReportIssue; window.spServersRender = spServersRender;
document.addEventListener('click', function(e){
  const ov = document.getElementById('stream-player-overlay');
  if (ov && ov.classList.contains('sv-open') && !e.target.closest('#sp-servers-menu') && !e.target.closest('#sp-servers-btn')) spCloseServers();
});
window.addEventListener('blur', function(){ try{ spCloseServers(); }catch(e){} }); // clicking into the player iframe
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') spCloseServers(); });

/* ── Quality / Picture / Speed menu — the player (iframe) reports its state, this menu sends commands back ── */
window._spQ = null;
function spQFrame(){ const f = document.getElementById('stream-player-frame'); return f && f.contentWindow; }
function spQSend(what, v){ try { const w = spQFrame(); if (w) w.postMessage({ type:'sx4k:cmd', what:what, v:v }, '*'); } catch(e){} }
function spQBtnUpdate(){
  const d = window._spQ, wrap = document.getElementById('sp-quality-wrap'), cur = document.getElementById('sp-quality-cur');
  if (!wrap) return;
  wrap.classList.toggle('show', !!d);
  if (d && cur){ const q = d.quality || {}; cur.textContent = (q.mode === 'auto' && q.items && q.items.length) ? 'Auto' : (q.cur || ''); }
}
function spQItem(on, label, sub, tag, js){
  return '<button type="button" class="sp-sv-item'+(on?' on':'')+'" role="menuitem" onclick="'+js+'"><span class="mk">'+(on?SP_CHECK:'')+'</span><span class="nm">'+spServersEsc(label)+(sub?'<small>'+spServersEsc(sub)+'</small>':'')+'</span>'+(tag?'<span class="tg">'+spServersEsc(tag)+'</span>':'')+'</button>';
}
function spQRender(){
  const menu = document.getElementById('sp-quality-menu'), d = window._spQ; if (!menu || !d) return;
  const q = d.quality || { items:[], mode:'auto' };
  let h = '';
  if (q.items && q.items.length){
    h += '<div class="sp-sv-h">Quality</div>' + q.items.map(function(it){
      return spQItem(String(it.id) === String(q.mode), it.label, it.sub, it.tag, "spQPick('q','"+String(it.id)+"')");
    }).join('') + '<div class="sp-sv-sep"></div>';
  }
  h += '<div class="sp-sv-h">Picture</div>' + spQItem(!!d.vivid, 'Vivid picture', '', '', "spQPick('vivid',0,1)");
  if (d.rates && d.rates.length){
    h += '<div class="sp-sv-sep"></div><div class="sp-sv-h">Speed</div>' + d.rates.map(function(r){
      return spQItem(+d.rate === +r, r === 1 ? 'Normal' : r + 'x', '', '', "spQPick('rate',"+r+")");
    }).join('');
  }
  h += '<div class="sp-sv-sep"></div>';
  if (d.pip) h += '<button type="button" class="sp-sv-report" onclick="spQPick(\'pip\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="12" y="11" width="6.5" height="5" rx="1"/></svg>Picture in picture</button>';
  h += '<button type="button" class="sp-sv-report" onclick="spQPick(\'dmca\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6z"/></svg>DMCA notice</button>';
  menu.innerHTML = h;
}
function spQPick(what, v, keep){
  spQSend(what, v);
  if (!keep) spCloseQ();   /* Vivid toggles in place, everything else closes the menu */
}
function spToggleQ(e){
  if (e && e.stopPropagation) e.stopPropagation();
  const ov = document.getElementById('stream-player-overlay'); if (!ov || !window._spQ) return;
  const open = !ov.classList.contains('q-open');
  if (open){ spQRender(); spQSend('hello'); try{ spCloseServers(); spCloseRail(); }catch(_){} clearTimeout(window._spHideTimer); }
  ov.classList.toggle('q-open', open);
  const b = document.getElementById('sp-quality-btn'); if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
}
function spCloseQ(){
  const ov = document.getElementById('stream-player-overlay'); if (!ov) return;
  ov.classList.remove('q-open');
  const b = document.getElementById('sp-quality-btn'); if (b) b.setAttribute('aria-expanded','false');
}
window.addEventListener('message', function(e){
  const f = document.getElementById('stream-player-frame');
  if (!f || e.source !== f.contentWindow) return;
  const d = e.data; if (!d || d.type !== 'sx4k:state') return;
  window._spQ = d; spQBtnUpdate();
  const ov = document.getElementById('stream-player-overlay');
  if (ov && ov.classList.contains('q-open')) spQRender();
});
document.addEventListener('click', function(e){
  const ov = document.getElementById('stream-player-overlay');
  if (ov && ov.classList.contains('q-open') && !e.target.closest('#sp-quality-menu') && !e.target.closest('#sp-quality-btn')) spCloseQ();
});
window.addEventListener('blur', function(){ try{ spCloseQ(); }catch(e){} });
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') spCloseQ(); });
window.spToggleQ = spToggleQ; window.spQPick = spQPick;

function spToggleRail(e){
  if (e && e.stopPropagation) e.stopPropagation();
  const ov = document.getElementById('stream-player-overlay');
  if (!ov) return;
  const open = !ov.classList.contains('rail-open');
  ov.classList.toggle('rail-open', open);
  if (open){ ov.classList.remove('sv-open','q-open'); clearTimeout(window._spHideTimer); }
  const b = document.getElementById('sp-info-rail'); if (b) b.classList.toggle('on', open);
}
function spCloseRail(){
  const ov = document.getElementById('stream-player-overlay'); if (!ov) return;
  ov.classList.remove('rail-open');
  const b = document.getElementById('sp-info-rail'); if (b) b.classList.remove('on');
}
document.addEventListener('click', function(e){
  const ov = document.getElementById('stream-player-overlay');
  if (ov && ov.classList.contains('rail-open') && !e.target.closest('#stream-player-rail') && !e.target.closest('#sp-info-rail')) spCloseRail();
});
window.addEventListener('blur', function(){ try{ spCloseRail(); }catch(e){} });   // clicking into the video
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') spCloseRail(); });
window.spToggleRail = spToggleRail;
function spToggleFullscreen(){
  const wrap = document.getElementById('stream-player-overlay');
  if (!wrap) return;
  const mob = window.matchMedia('(max-width:900px)').matches;
  const on = !!(document.fullscreenElement || document.webkitFullscreenElement) || wrap.classList.contains('sp-fs');
  if (!on) {
    if (mob) wrap.classList.add('sp-fs');
    let p; try { p = (wrap.requestFullscreen || wrap.webkitRequestFullscreen || wrap.mozRequestFullScreen || function(){ return Promise.reject(); }).call(wrap); } catch(e){ p = Promise.reject(); }
    if (mob) spLandscape(p);
  } else {
    wrap.classList.remove('sp-fs','sp-rot');
    try { if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || function(){}).call(document); } catch(e){}
    try { screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); } catch(e){}
  }
}
// phones: fullscreen = landscape. Real orientation lock first; if the WebView refuses, rotate the player with CSS.
function spLandscape(p){
  const wrap = document.getElementById('stream-player-overlay');
  const fallback = function(){ if (wrap && wrap.classList.contains('sp-fs') && window.innerHeight > window.innerWidth) wrap.classList.add('sp-rot'); };
  const lock = function(){
    try { const r = screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'); if (r && r.catch) r.catch(fallback); else if (!r) fallback(); } catch(e){ fallback(); }
  };
  if (p && p.then) p.then(lock, fallback); else lock();
  setTimeout(function(){ if (wrap && wrap.classList.contains('sp-fs') && window.innerHeight > window.innerWidth) fallback(); }, 700);
}
// any fullscreen change (our button OR the embed's own fullscreen button)
(function(){
  function chg(){
    const wrap = document.getElementById('stream-player-overlay'); if (!wrap || !window.matchMedia('(max-width:900px)').matches) return;
    const fs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (fs) { wrap.classList.add('sp-fs'); spLandscape(Promise.resolve()); }
    else { wrap.classList.remove('sp-fs','sp-rot'); try { screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); } catch(e){} }
  }
  document.addEventListener('fullscreenchange', chg); document.addEventListener('webkitfullscreenchange', chg);
  window.addEventListener('orientationchange', function(){ setTimeout(function(){ const w = document.getElementById('stream-player-overlay'); if (w && window.innerWidth > window.innerHeight) w.classList.remove('sp-rot'); }, 300); });
})();
window.spToggleFullscreen = spToggleFullscreen;

// ── FanCode source switch (inside the embedder) ──────────────────────
// World = FanCode's own feed through play.html (unchanged: play.html?id=…_eng&s=0).
// India = CNP-TV m3u8 from fan.json (cnptv_cdn), played by a tiny hls.js page
// injected into the same iframe via srcdoc — so it stays inside the embedder
// and needs nothing from play.html. Only offered while a FanCode match is
// playing; the India button stays disabled until fan.json has a link for it.
window._spFcx = null; // { id, label, world, source }
function spFcxIdFromUrl(url){
  const m = /(?:play|play\.html)\?id=([^&#]+?)(?:_eng)?(?:[&#]|$)/i.exec(String(url || ''));
  return m ? decodeURIComponent(m[1]) : '';
}
function spIndiaPlayerDoc(m3u8){
  const u = JSON.stringify(String(m3u8));
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%;background:#000;display:block}'
    + '#e{position:absolute;inset:0;display:none;align-items:center;justify-content:center;text-align:center;padding:24px;color:#fff;font:600 13px system-ui,sans-serif;background:#000}</style></head><body>'
    + '<video id="v" controls autoplay playsinline></video><div id="e">India source is not playing right now.<br>Try the World source.</div>'
    + '<script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js"><\/script>'
    + '<script>(function(){var u=' + u + ',v=document.getElementById("v"),e=document.getElementById("e");'
    + 'function bad(){e.style.display="flex";}'
    + 'if(window.Hls&&Hls.isSupported()){var h=new Hls({lowLatencyMode:true,enableWorker:false});h.loadSource(u);h.attachMedia(v);'
    + 'h.on(Hls.Events.MANIFEST_PARSED,function(){var p=v.play();if(p&&p.catch)p.catch(function(){v.muted=true;v.play().catch(function(){});});});'
    + 'h.on(Hls.Events.ERROR,function(_,d){if(d&&d.fatal){if(d.type===Hls.ErrorTypes.NETWORK_ERROR){try{h.startLoad();}catch(x){}setTimeout(function(){if(v.readyState<2)bad();},6000);}else if(d.type===Hls.ErrorTypes.MEDIA_ERROR){try{h.recoverMediaError();}catch(x){bad();}}else{bad();}}});}'
    + 'else if(v.canPlayType("application/vnd.apple.mpegurl")){v.src=u;v.addEventListener("error",bad);}else{bad();}'
    + '})();<\/script></body></html>';
}
function spRenderFcxSwitch(){
  const box = document.getElementById('sp-src-switch');
  const st = window._spFcx;
  if (!box) return;
  if (!st){ box.classList.remove('show'); box.innerHTML = ''; return; }
  const fm = (typeof fcxFindById === 'function') ? fcxFindById(st.id) : null;
  const india = fm && fm.india ? fm.india : '';
  box.innerHTML =
    `<button type="button" class="sp-src-btn${st.source === 'world' ? ' active' : ''}" onclick="spSetFcxSource('world')">World</button>` +
    `<button type="button" class="sp-src-btn${st.source === 'india' ? ' active' : ''}" ${india ? '' : 'disabled'} title="${india ? 'CNP-TV source' : 'India source not available for this match yet'}" onclick="spSetFcxSource('india')">India</button>`;
  box.classList.add('show');
}
function spInitFcxSwitch(url, label){
  const id = spFcxIdFromUrl(url);
  window._spFcx = id ? { id: id, label: label, world: url, source: 'world' } : null;
  spRenderFcxSwitch();
}
window.spRefreshFcxSwitch = function(){ if (window._spFcx) spRenderFcxSwitch(); };
function spSetFcxSource(which){
  const st = window._spFcx;
  if (!st || st.source === which) return;
  const frame = document.getElementById('stream-player-frame');
  window._fcTok = null;
  if (!frame) return;
  if (which === 'india'){
    const fm = fcxFindById(st.id);
    if (!fm || !fm.india) return;
    frame.srcdoc = spIndiaPlayerDoc(fm.india);
    sxCurrentStreamRawUrl = fm.india; // Cast works with a direct HLS link
  } else {
    fcLoadIntoFrame(frame, st.world, st.label || 'Live Stream');
  }
  st.source = which;
  spRenderFcxSwitch();
}

function closeStreamPlayer(){
  window._fcTok = null;
  document.getElementById('stream-player-overlay').classList.remove('open','rail-open','sp-idle','sv-open','q-open','sp-fs','sp-rot'); try{ screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); }catch(e){} try{ spCloseRail(); }catch(e){} window._spQ = null; try{ spQBtnUpdate(); }catch(e){}
  window._spServers = null; window._spServerKeep = false;
  try { if (document.fullscreenElement && document.exitFullscreen) { const p = document.exitFullscreen(); if (p && p.catch) p.catch(function(){}); } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen(); } catch(e){}
  document.getElementById('stream-player-frame').removeAttribute('srcdoc');
  document.getElementById('stream-player-frame').src = '';
  spInitFcxSwitch('', '');
  sxCurrentStreamRawUrl = '';
  clearTimeout(window._spHideTimer);
  clearTimeout(window._spLoadingTimer);
  const loadingEl = document.getElementById('stream-player-loading');
  if (loadingEl){
    // Reset so the next stream opened shows the loader again from the start.
    loadingEl.classList.remove('sp-loading-hide');
  }
  const loadingBarEl = document.getElementById('sp-loading-bar');
  if (loadingBarEl) { loadingBarEl.style.transition = 'none'; loadingBarEl.style.width = '0%'; }
  // Restore navbar when player closes
  const navbar = document.querySelector('.sx-topbar, [data-navbar]');
  if (navbar) navbar.style.display = '';
  const mobileTabbar = document.getElementById('mobile-tabbar');
  if (mobileTabbar) mobileTabbar.style.display = '';
}
// ── Floating back button / title overlay: shown briefly, then goes idle
// so it doesn't sit on top of the video permanently. In the idle state the
// title fades out completely but the back button never fades — it stays
// fully visible and clickable at all times so there's always a way back.
// Any pointer activity on the player (outside the iframe itself, since
// cross-origin iframes don't bubble events to the parent) brings the
// title/backdrop back to full visibility.
function spShowTopbar(){
  const tb = document.getElementById('stream-player-topbar');
  if (!tb) return;
  const _ov = document.getElementById('stream-player-overlay');
  tb.classList.remove('sp-idle'); if (_ov) _ov.classList.remove('sp-idle');
  clearTimeout(window._spHideTimer);
  window._spHideTimer = setTimeout(() => { if (_ov && (_ov.classList.contains('sv-open') || _ov.classList.contains('q-open') || _ov.classList.contains('rail-open'))) return; tb.classList.add('sp-idle'); if (_ov) _ov.classList.add('sp-idle'); }, 3200);
}
(function(){
  const overlay = document.getElementById('stream-player-overlay');
  if (!overlay) return;
  ['mousemove', 'touchstart', 'click'].forEach(evt => overlay.addEventListener(evt, spShowTopbar));
})();

// ══════════════════════════════════════════════════════════════════════
// MULTIVIEW — see the markup/CSS block above for the overlay + picker.
// ══════════════════════════════════════════════════════════════════════
window._mvSlots = [null, null, null, null]; // {url,name,isHls,muted}
window._mvLayout = 2;
window._mvPickerSlot = -1;

const MV_ICON_SOUND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
const MV_ICON_MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
const MV_ICON_SWAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
const MV_ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

function mvEscAttr(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }
function mvEscText(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function openMultiview(){
  if (document.getElementById('stream-player-overlay').classList.contains('open')) closeStreamPlayer();
  document.getElementById('sx-multiview-overlay').classList.add('open');
  const navbar = document.querySelector('.sx-topbar, [data-navbar]');
  if (navbar) navbar.style.display = 'none';
  const mobileTabbar = document.getElementById('mobile-tabbar');
  if (mobileTabbar) mobileTabbar.style.display = 'none';
  mvRenderGrid();
}
window.openMultiview = openMultiview;

function closeMultiview(){
  document.getElementById('sx-multiview-overlay').classList.remove('open');
  closeMvPicker();
  const navbar = document.querySelector('.sx-topbar, [data-navbar]');
  if (navbar) navbar.style.display = '';
  const mobileTabbar = document.getElementById('mobile-tabbar');
  if (mobileTabbar) mobileTabbar.style.display = '';
}
window.closeMultiview = closeMultiview;

function mvSetLayout(n){
  window._mvLayout = n;
  document.querySelectorAll('.mv-layout-btn').forEach(b => b.classList.toggle('active', +b.dataset.n === n));
  mvRenderGrid();
}
window.mvSetLayout = mvSetLayout;

function mvRenderGrid(){
  const grid = document.getElementById('mv-grid');
  if (!grid) return;
  const n = window._mvLayout;
  grid.className = 'mv-l' + n;
  let html = '';
  for (let i = 0; i < n; i++) html += mvSlotHtml(i);
  grid.innerHTML = html;
}

function mvSlotHtml(i){
  const s = window._mvSlots[i];
  if (!s) {
    return `<div class="mv-slot" id="mv-slot-${i}">
      <button type="button" class="mv-slot-empty" onclick="mvOpenPicker(${i})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        <span>Add Stream</span>
      </button>
    </div>`;
  }
  const media = s.isHls
    ? `<iframe id="mv-media-${i}" srcdoc="${mvEscAttr(mvHlsDoc(s.url, s.muted))}" allow="autoplay" title="${mvEscAttr(s.name)}"></iframe>`
    : `<iframe id="mv-media-${i}" src="${mvEscAttr(s.url)}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; accelerometer; gyroscope; web-share" webkitallowfullscreen mozallowfullscreen allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="${mvEscAttr(s.name)}"></iframe>`;
  const muteBtn = s.isHls
    ? `<button type="button" class="mv-slot-btn${s.muted?' mv-muted':''}" onclick="mvToggleMute(${i})" title="${s.muted?'Unmute':'Mute'}">${s.muted ? MV_ICON_MUTED : MV_ICON_SOUND}</button>`
    : '';
  return `<div class="mv-slot" id="mv-slot-${i}">
    ${media}
    <div class="mv-slot-bar">
      <span class="mv-slot-name">${mvEscText(s.name)}</span>
      ${muteBtn}
      <button type="button" class="mv-slot-btn" onclick="mvOpenPicker(${i})" title="Change stream">${MV_ICON_SWAP}</button>
      <button type="button" class="mv-slot-btn" onclick="mvRemoveSlot(${i})" title="Remove">${MV_ICON_CLOSE}</button>
    </div>
  </div>`;
}

// Tiny standalone HLS.js player doc, same technique as the FanCode
// India-source switch above (spIndiaPlayerDoc) — injected via srcdoc so
// each slot plays its own independent .m3u8 without touching the others.
function mvHlsDoc(m3u8, muted){
  const u = JSON.stringify(sxUpHttps(m3u8));
  const m = muted ? 'true' : 'false';
  if (typeof sxIsDashUrl === 'function' && sxIsDashUrl(m3u8)) {
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
      + '<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%;background:#000;display:block;object-fit:contain}</style></head><body>'
      + '<video id="v" autoplay playsinline' + (muted ? ' muted' : '') + '></video>'
      + '<script src="https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.7.4/dash.all.min.js"><\/script>'
      + '<script>(function(){var u=' + u + ',v=document.getElementById("v");v.muted=' + m + ';'
      + 'try{var p=dashjs.MediaPlayer().create();try{p.extend("RequestModifier",function(){return{modifyRequestURL:function(x){return location.protocol==="https:"?String(x).replace(/^http:\\/\\//i,"https://"):x;},modifyRequestHeader:function(x){return x;}};},true);}catch(e){}p.initialize(v,u,true);}catch(e){}'
      + '})();<\/script></body></html>';
  }
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%;background:#000;display:block;object-fit:contain}</style></head><body>'
    + '<video id="v" autoplay playsinline' + (muted ? ' muted' : '') + '></video>'
    + '<script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js"><\/script>'
    + '<script>(function(){var u=' + u + ',v=document.getElementById("v");v.muted=' + m + ';'
    + 'if(window.Hls&&Hls.isSupported()){var h=new Hls({lowLatencyMode:true,enableWorker:false});h.loadSource(u);h.attachMedia(v);'
    + 'h.on(Hls.Events.MANIFEST_PARSED,function(){var p=v.play();if(p&&p.catch)p.catch(function(){v.muted=true;v.play().catch(function(){});});});}'
    + 'else if(v.canPlayType("application/vnd.apple.mpegurl")){v.src=u;v.addEventListener("loadedmetadata",function(){v.play().catch(function(){});});}'
    + '})();<\/script></body></html>';
}

function mvToggleMute(i){
  const s = window._mvSlots[i];
  if (!s || !s.isHls) return;
  s.muted = !s.muted;
  mvRenderGrid();
}
window.mvToggleMute = mvToggleMute;

function mvRemoveSlot(i){
  window._mvSlots[i] = null;
  mvRenderGrid();
}
window.mvRemoveSlot = mvRemoveSlot;

function mvOpenPicker(i){
  window._mvPickerSlot = i;
  document.getElementById('mv-picker').classList.add('open');
  const searchEl = document.getElementById('mv-picker-search');
  if (searchEl) searchEl.value = '';
  mvRenderPickerList('');
  setTimeout(() => { if (searchEl) searchEl.focus(); }, 50);
}
window.mvOpenPicker = mvOpenPicker;

function closeMvPicker(){
  const el = document.getElementById('mv-picker');
  if (el) el.classList.remove('open');
}
window.closeMvPicker = closeMvPicker;

// Live channels + live sheet matches with a direct, embeddable watch URL.
// FanCode's own dynamic-server matches are left out here on purpose —
// they need the multi-server handshake in sxHandleMatchWatch(), which
// doesn't fit a plain single-URL multiview slot.
function mvPickerItems(){
  const items = [];
  (window._cmsChannels || []).forEach(c => {
    if ((c.status_live_off || '').toUpperCase() !== 'LIVE') return;
    const url = (c.watch_url || '').trim();
    if (!url || url === '#') return;
    items.push({ name: c.channel_name || 'Live Stream', meta: c.group || 'Live TV', icon: c.icon_url || '', url });
  });
  (window._matchCardsData || []).forEach(c => {
    if (typeof isMatchFinished === 'function' && isMatchFinished(c)) return;
    if (typeof matchStatusText === 'function' && matchStatusText(c).toLowerCase() !== 'live') return;
    const url = (c.btn_url || '').trim();
    if (!url || url === '#') return;
    items.push({ name: (c.team1_code || '') + ' vs ' + (c.team2_code || ''), meta: c.game || 'Live Match', icon: c.team1_icon_url || c.team2_icon_url || '', url });
  });
  return items;
}

function mvRenderPickerList(q){
  const list = document.getElementById('mv-picker-list');
  if (!list) return;
  const query = (q || '').toLowerCase();
  const items = mvPickerItems().filter(it => !query || it.name.toLowerCase().includes(query));
  if (!items.length) {
    list.innerHTML = '<div class="mv-pick-empty">No live streams found</div>';
    return;
  }
  list.innerHTML = items.map(it => `
    <button type="button" class="mv-pick-item" onclick="mvPick('${escJs(it.url)}','${escJs(it.name)}')">
      <span class="mv-pick-thumb">${it.icon ? `<img loading=lazy decoding=async src="${it.icon}" alt="" onerror="this.parentElement.style.display='none'">` : ''}</span>
      <span class="mv-pick-info">
        <span class="mv-pick-name">${mvEscText(it.name)}</span>
        <span class="mv-pick-meta">${mvEscText(it.meta)}</span>
      </span>
    </button>`).join('');
}
window.mvRenderPickerList = mvRenderPickerList;

function mvPick(url, name){
  const i = window._mvPickerSlot;
  if (i < 0) return;
  const isHls = typeof sxIsStreamUrl === 'function' && sxIsStreamUrl(url);
  if (!isHls && /famcodexwebs\.pages\.dev/i.test(url)) {
    alert("This stream can't be embedded in Multiview — open it from Matches on its own instead.");
    return;
  }
  window._mvSlots[i] = { url, name, isHls, muted: true };
  closeMvPicker();
  mvRenderGrid();
}
window.mvPick = mvPick;

// "Add to Multiview" button inside the normal single-stream player —
// drops the stream that's currently playing into the first open slot
// (or slot 0 if all four are full) and jumps straight into Multiview.
function mvAddFromPlayer(){
  const url = window.sxCurrentStreamRawUrl;
  if (!url) return;
  const nameEl = document.getElementById('sp-info-name');
  const name = (nameEl && nameEl.textContent) || 'Live Stream';
  const isHls = typeof sxIsStreamUrl === 'function' && sxIsStreamUrl(url);
  let slot = window._mvSlots.findIndex(s => !s);
  if (slot === -1) slot = 0;
  window._mvSlots[slot] = { url, name, isHls, muted: false };
  closeStreamPlayer();
  openMultiview();
}
window.mvAddFromPlayer = mvAddFromPlayer;

;

function openDmca(){
  document.getElementById('dmca-overlay').classList.add('open');
}
function closeDmca(){
  document.getElementById('dmca-overlay').classList.remove('open');
}

;

// Plays a brief logo splash over whichever panel overlay (Live TV / FIFA /
// FanCode) is about to open. Reuses the current nav logo (whatever the
// SETTINGS sheet's icon_url is set to) so it always matches the live logo
// instead of a second hardcoded image. One shared element, created lazily.
function sxPlayPanelIntro(){
  // Disabled site-wide: Live TV / FanCode / FIFA now open instantly —
  // no logo splash / loading screen in between anymore.
  return;
}

function openLiveTV(){
  sxCloseAllOverlays();
  sxPlayPanelIntro();
  document.getElementById('livetv-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'livetv'));
  sxHeaderInto('livetv-overlay', 'livetv-topbar');
}
function closeLiveTV(){
  document.getElementById('livetv-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
}

// Matches — moved off the homepage into its own full-page section, same
// treatment as Live TV / Movies (fixed overlay, own z-index, nav bar
// pinned at top). The homepage itself now only shows a condensed
// "Live & Upcoming Matches" preview (#fixtures-section) with a button
// through to this full page.
function openMatches(){
  sxCloseAllOverlays();
  document.getElementById('matches-panel').classList.add('active');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'matches'));
  if (window.__mtabSetActive) {
    const mt = document.querySelector('.mtab[data-sxtab="matches"]');
    if (mt) window.__mtabSetActive(mt);
  }
  sxHeaderInto('matches-panel', null);
}
function closeMatches(){
  document.getElementById('matches-panel').classList.remove('active');
  document.body.style.overflow = '';
  sxHeaderHome();
}
window.openMatches = openMatches;
window.closeMatches = closeMatches;

// ══════════════════════════════════════════════════════════════════════
// MOVIES — powered by VidAPI's public listing + embed API.
// /movies/latest/page-{n}.json and /tvshows/latest/page-{n}.json each
// return 24 titles/page (title, year, poster, rating, genre, popularity,
// embed_url). VidAPI doesn't document real "trending"/"top rated"
// endpoints, so those are the same paged pool re-sorted client-side by
// popularity / rating. Genre chips filter by the item's own "genre"
// string. Scrolling to the bottom auto-loads the next page (infinite
// scroll) instead of a manual "Load More" button.
// Every search bar carries a paste-an-ID fallback: typing/pasting an
// IMDB (tt…) or TMDB (numeric) ID reveals a ▶ Play button that opens
// it directly — for anything not in the loaded lists. All playback,
// loaded or pasted, goes through openStreamPlayer() as an iframe embed.
// ══════════════════════════════════════════════════════════════════════
const VIDAPI_LIST_BASE = EV_CONFIG.VIDAPI_LIST;
const VIDAPI_EMBED_BASE = EV_CONFIG.VIDAPI_EMBED;

const vaPools = {
  movie: { all: [], page: 1, totalPages: null, loading: false },
  tv:    { all: [], page: 1, totalPages: null, loading: false }
};
window.vaPools = vaPools;   // search reads window.vaPools — a top-level const is NOT a window property
let vaCurrentType = 'movie';      // 'movie' | 'tv'
let vaCurrentSort = 'popularity'; // 'popularity' | 'rating'
let vaCurrentGenre = '';
let vaSentinelObserver = null;
let vaPendingTvItem = null;       // { id, title } — for the season/episode modal
// How many matched cards are actually drawn into the DOM at once. The pool
// itself can hold tens of thousands of loaded titles (for instant search),
// but only a manageable slice of that is ever rendered — this grows as the
// user scrolls (see vaInitSentinel), not with how much is loaded.
let vaRenderLimit = 60;

function openMoviesOverlay(){
  sxCloseAllOverlays();
  document.getElementById('movies-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'movies'));
  // Movies loads automatically the instant this page opens — no manual
  // "Load Movies" tap gate. The background preload (bottom of file) usually
  // already kicked this off right after the site loaded; if it somehow
  // hasn't run yet, start it right now so there's no visible wait either way.
  if (typeof window.vaInit === 'function'){
    window.vaInit();
    window.vaInit = null;
  }
  sxHeaderInto('movies-overlay', 'movies-topbar');
}
function closeMoviesOverlay(){
  document.getElementById('movies-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
}

// Some networks/ISPs/corporate firewalls block the .ru domain outright or
// the response comes back without CORS headers, which makes a plain fetch()
// fail silently in the browser (rejected promise, no useful error shown to
// the visitor) — that's the main reason the Movies grid can get stuck on
// its loading skeleton forever. To make this resilient: try the direct
// request first, and if that fails, retry once through a public CORS
// proxy before giving up.
const VIDAPI_CORS_PROXY = EV_CONFIG.CORS_PROXY;
async function vaFetchPage(type, page){
  const path = type === 'tv' ? 'tvshows' : 'movies';
  const url = `${VIDAPI_LIST_BASE}/${path}/latest/page-${page}.json`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } catch (directErr) {
    try {
      const r2 = await fetch(VIDAPI_CORS_PROXY + encodeURIComponent(url));
      if (!r2.ok) throw new Error('HTTP ' + r2.status);
      return await r2.json();
    } catch (proxyErr) {
      throw directErr; // surface the original (usually more informative) error
    }
  }
}

async function vaLoadMoreCurrent(type){
  type = type || vaCurrentType;
  const pool = vaPools[type];
  if (pool.loading) return;
  if (pool.totalPages !== null && pool.page > pool.totalPages) return;
  pool.loading = true;
  // Only touch the visible "Loading more…" UI when we're loading the type
  // that's actually on screen — a background prefetch of the other type
  // (Movie vs TV Show) shouldn't flicker any loading indicator at all.
  const isVisible = type === vaCurrentType;
  const loadingEl = isVisible ? document.getElementById('vaLoadingMore') : null;
  if (loadingEl) loadingEl.style.display = '';
  // Retry a couple of times with a short backoff before giving up — a
  // single transient failure shouldn't leave the whole section stuck.
  const ATTEMPTS = 3;
  let lastErr = null;
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      const data = await vaFetchPage(type, pool.page);
      pool.totalPages = data.total_pages;
      pool.all.push(...(data.items || []));
      pool.page++;
      lastErr = null;
      break;
    } catch (e) {
      lastErr = e;
      console.warn('VidAPI fetch failed (attempt ' + (i + 1) + '/' + ATTEMPTS + '):', e);
      if (i < ATTEMPTS - 1) await new Promise(res => setTimeout(res, 700 * (i + 1)));
    }
  }
  pool.loading = false;
  if (loadingEl) loadingEl.style.display = 'none';
  if (!isVisible) return; // background prefetch — nothing to render yet
  const grid = document.getElementById('vaMovieGrid');
  if (lastErr && pool.all.length === 0) {
    // Show a real error + retry action instead of an endless skeleton/
    // "Loading…" placeholder that never explains what went wrong.
    if (grid) grid.innerHTML = `<div class="epg-no-results">Couldn't load movies right now — the movie service may be unreachable on this network.<br><button type="button" class="va-load-gate-btn" style="margin-top:14px;" onclick="vaRetryLoad()">↻ Retry</button></div>`;
  } else {
    vaRenderMovies();
  }
}
function vaRetryLoad(){
  const pool = vaPools[vaCurrentType];
  pool.totalPages = null; // clear any stale error state so the load loop runs again
  vaLoadMoreCurrent();
}

// ── Movie / TV toggle, Trending / Top Rated sort, genre chips ──
function vaSetType(type, el){
  vaCurrentType = type;
  vaRenderLimit = 60;
  document.querySelectorAll('.va-type-btn').forEach(b => b.classList.toggle('active', b === el));
  vaUpdateViewTitle();
  if (vaPools[vaCurrentType].all.length === 0) vaLoadMoreCurrent();
  else vaRenderMovies();
}
function vaSetSort(sort, el){
  vaCurrentSort = sort;
  vaRenderLimit = 60;
  document.querySelectorAll('.va-sort-btn').forEach(b => b.classList.toggle('active', b === el));
  vaUpdateViewTitle();
  vaRenderMovies();
}
function vaSetGenre(genre, el){
  vaCurrentGenre = genre;
  vaRenderLimit = 60;
  document.querySelectorAll('.va-genre-chip').forEach(b => b.classList.toggle('active', b === el));
  vaRenderMovies();
}
function vaUpdateViewTitle(){
  const el = document.getElementById('vaViewTitle');
  if (!el) return;
  const typeLabel = vaCurrentType === 'tv' ? 'TV Shows' : 'Movies';
  const sortLabel = vaCurrentSort === 'rating' ? 'Top Rated' : 'Trending';
  el.textContent = `🎬 ${sortLabel} ${typeLabel}`;
}

// ── Search bar + paste-an-ID fallback ──
function vaDetectId(raw){
  raw = (raw || '').trim();
  const imdb = raw.match(/tt\d{5,}/i);
  if (imdb) return { id: imdb[0], kind: 'imdb' };
  if (/^\d{2,8}$/.test(raw)) return { id: raw, kind: 'tmdb' };
  return null;
}
let vaDeepSearchToken = 0;

function vaFilterMovies(){
  const input = document.getElementById('vaMovieSearchInput');
  const raw = input ? input.value : '';
  const clearBtn = document.getElementById('vaMovieSearchClear');
  if (clearBtn) clearBtn.classList.toggle('show', !!raw.trim());
  const idInfo = vaDetectId(raw);
  const playBtn = document.getElementById('vaSearchPlayBtn');
  if (playBtn) playBtn.style.display = idInfo ? 'flex' : 'none';
  const q = idInfo ? '' : raw.toLowerCase().trim();
  vaRenderLimit = 60;
  const myToken = ++vaDeepSearchToken; // cancels any deep search still running from a previous keystroke
  vaRenderMovies(q);
  // Typed a name (not an ID) and nothing in what's already loaded matches it
  // — auto-search the rest of the API in the background, in concurrent
  // batches, until a match turns up or the whole catalog has been checked.
  // No extra click needed.
  if (!idInfo && q.length >= 2) {
    const pool = vaPools[vaCurrentType];
    const alreadyHasMatch = pool.all.some(m => (m.title || '').toLowerCase().includes(q));
    if (!alreadyHasMatch) vaDeepSearch(q, myToken);
  }
}
async function vaDeepSearch(query, myToken){
  const pool = vaPools[vaCurrentType];
  const countEl = document.getElementById('vaMovieCount');
  const grid = document.getElementById('vaMovieGrid');
  const CONCURRENCY = 10;
  while (true) {
    if (myToken !== vaDeepSearchToken) return; // superseded by a newer search
    if (pool.totalPages !== null && pool.page > pool.totalPages) break; // whole catalog checked
    if (countEl) countEl.textContent = `searching whole library for "${query}"… (${pool.all.length} checked so far)`;
    const batch = [];
    while (batch.length < CONCURRENCY && (pool.totalPages === null || pool.page <= pool.totalPages)) {
      batch.push(pool.page++);
    }
    if (!batch.length) break;
    const results = await Promise.allSettled(batch.map(p => vaFetchPage(vaCurrentType, p)));
    let gotAny = false;
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        pool.totalPages = r.value.total_pages;
        if (r.value.items && r.value.items.length) { pool.all.push(...r.value.items); gotAny = true; }
      }
    }
    if (myToken !== vaDeepSearchToken) return;
    const found = pool.all.some(m => (m.title || '').toLowerCase().includes(query));
    if (found) { vaRenderMovies(query); return; }
    if (!gotAny) break; // stop instead of looping forever on repeated fetch failures
  }
  if (myToken !== vaDeepSearchToken) return;
  vaRenderMovies(query);
  if (grid && !grid.children.length) {
    grid.innerHTML = `<div class="epg-no-results">No titles matching "${query}" found anywhere in the library. Try pasting its IMDB (tt…) or TMDB ID instead.</div>`;
  }
}
function vaClearMovieSearch(){
  const input = document.getElementById('vaMovieSearchInput');
  if (!input) return;
  input.value = '';
  vaFilterMovies();
  input.focus();
}
function vaPlayFromSearch(){
  const input = document.getElementById('vaMovieSearchInput');
  const idInfo = vaDetectId(input ? input.value : '');
  if (!idInfo) { vaToast('Enter a valid IMDB (tt…) or TMDB (numeric) ID.'); return; }
  if (vaCurrentType === 'tv') {
    vaPendingTvItem = { id: idInfo.id, title: idInfo.id };
    vaOpenTvModal();
  } else {
    openStreamPlayer(vaBuildEmbedUrl(`${VIDAPI_EMBED_BASE}/embed/movie/${idInfo.id}`), idInfo.id, 'movie');
  }
}

// ── Render ──
function vaRenderMovies(q){
  if (q === undefined) {
    const input = document.getElementById('vaMovieSearchInput');
    const raw = input ? input.value : '';
    q = vaDetectId(raw) ? '' : raw.toLowerCase().trim();
  }
  const grid = document.getElementById('vaMovieGrid');
  const countEl = document.getElementById('vaMovieCount');
  if (!grid) return;

  const pool = vaPools[vaCurrentType];
  let items = pool.all;
  if (vaCurrentGenre) {
    const g = vaCurrentGenre.toLowerCase();
    items = items.filter(m => (m.genre || '').toLowerCase().includes(g));
  }
  if (q) items = items.filter(m => (m.title || '').toLowerCase().includes(q));
  items = [...items].sort((a, b) => (parseFloat(b[vaCurrentSort]) || 0) - (parseFloat(a[vaCurrentSort]) || 0));

  // Only draw vaRenderLimit cards into the DOM at a time — with tens of
  // thousands of titles loaded into the pool, rendering every match at once
  // would freeze the page. The sentinel raises the limit as the user
  // scrolls (see vaInitSentinel), so browsing still feels like one long list.
  const matchedTotal = items.length;
  const visible = items.slice(0, vaRenderLimit);

  if (countEl) countEl.textContent = pool.all.length
    ? `${visible.length} of ${matchedTotal} matched · ${pool.all.length} loaded`
    : '';

  grid.innerHTML = '';
  if (!visible.length) {
    grid.innerHTML = pool.all.length
      ? '<div class="epg-no-results">No titles match that filter yet — keep scrolling to load more, or try a different search/genre.</div>'
      : '<div class="epg-no-results"><span class="ev-rl"></span></div>';
    return;
  }

  visible.forEach(m => {
    const card = document.createElement('div');
    card.className = 'va-movie-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    const label = m.title + (m.year ? ' (' + m.year + ')' : '');
    card.onclick = () => {
      if (vaCurrentType === 'tv') {
        vaPendingTvItem = { id: m.tmdb_id || m.imdb_id, title: m.title };
        vaOpenTvModal(label);
      } else {
        openStreamPlayer(vaBuildEmbedUrl(m.embed_url), label, 'movie');
      }
    };
    card.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.onclick(); } };
    card.innerHTML = `
      <div class="va-movie-poster">
        <img src="${m.poster_url || ''}" alt="${m.title || ''}" loading="lazy" onerror="this.style.display='none'">
        ${m.rating ? `<span class="va-movie-rating">★ ${m.rating}</span>` : ''}
      </div>
      <div class="va-movie-meta">
        <div class="va-movie-title">${m.title || ''}</div>
        <div class="va-movie-year">${m.year || ''}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── TV season/episode picker — the listing API's embed_url for TV
// items is show-level only, so this asks which episode before playing ──
function vaOpenTvModal(label){
  const titleEl = document.getElementById('vaTvModalTitle');
  if (titleEl) titleEl.textContent = label || (vaPendingTvItem && vaPendingTvItem.title) || 'Pick an episode';
  document.getElementById('vaTvSeasonInput').value = 1;
  document.getElementById('vaTvEpisodeInput').value = 1;
  document.getElementById('va-tv-modal').classList.add('open');
}
function vaCloseTvModal(){
  document.getElementById('va-tv-modal').classList.remove('open');
  vaPendingTvItem = null;
}
function vaPlayTvModal(){
  if (!vaPendingTvItem) return;
  const season = parseInt(document.getElementById('vaTvSeasonInput').value, 10) || 1;
  const episode = parseInt(document.getElementById('vaTvEpisodeInput').value, 10) || 1;
  const label = `${vaPendingTvItem.title} S${season}E${episode}`;
  const url = `${VIDAPI_EMBED_BASE}/embed/tv/${vaPendingTvItem.id}/${season}/${episode}`;
  vaCloseTvModal();
  openStreamPlayer(vaBuildEmbedUrl(url), label, 'tv');
}

// ── Player Settings — skin + colors + hide toggles, persisted in
// localStorage, applied to every VidAPI embed URL this tab opens.
// Only touches vaplayer.ru URLs, never other stream sources on the site. ──
function vaGetSettings(){
  try { return JSON.parse(localStorage.getItem('va_player_settings') || '{}'); }
  catch (e) { return {}; }
}
function vaSaveSettings(){
  const s = {
    skin: document.getElementById('vaSkinSelect').value,
    color: document.getElementById('vaColorAccent').value.replace('#',''),
    secondaryColor: document.getElementById('vaColorSecondary').value.replace('#',''),
    iconColor: document.getElementById('vaColorIcon').value.replace('#',''),
    hideTitle: document.getElementById('vaHideTitle').checked,
    hideControls: document.getElementById('vaHideControls').checked
  };
  try { localStorage.setItem('va_player_settings', JSON.stringify(s)); } catch (e) { /* ignore */ }
}
function vaResetSettings(){
  try { localStorage.removeItem('va_player_settings'); } catch (e) { /* ignore */ }
  vaApplySettingsToForm({});
}
function vaApplySettingsToForm(s){
  document.getElementById('vaSkinSelect').value = s.skin || '';
  document.getElementById('vaColorAccent').value = '#' + (s.color || 'ff6a1a');
  document.getElementById('vaColorSecondary').value = '#' + (s.secondaryColor || '101010');
  document.getElementById('vaColorIcon').value = '#' + (s.iconColor || 'ffffff');
  document.getElementById('vaHideTitle').checked = !!s.hideTitle;
  document.getElementById('vaHideControls').checked = !!s.hideControls;
}
function vaToggleSettings(){
  document.getElementById('va-settings-panel').classList.toggle('open');
}
function vaBuildEmbedUrl(url){
  if (!/vaplayer\.ru/i.test(url)) return url; // never touch non-VidAPI stream URLs
  const s = vaGetSettings();
  const params = new URLSearchParams();
  if (s.skin) params.set('skin', s.skin);
  if (s.color) params.set('color', s.color);
  if (s.secondaryColor) params.set('secondaryColor', s.secondaryColor);
  if (s.iconColor) params.set('iconColor', s.iconColor);
  if (s.hideTitle) params.set('showTitle', '0');
  if (s.hideControls) params.set('controls', 'false');
  const qs = params.toString();
  if (!qs) return url;
  return url + (url.includes('?') ? '&' : '?') + qs;
}

// ── Small reusable toast (reuses #sx-cast-toast's floating-bubble look) ──
function vaToast(message){
  if (typeof sxCastToast === 'function') sxCastToast(message);
}

// ── Infinite scroll — loads the next page of whichever pool is active
// once the user scrolls near the bottom, instead of a manual button ──
function vaInitSentinel(){
  const sentinel = document.getElementById('vaSentinel');
  if (!sentinel || vaSentinelObserver) return;
  vaSentinelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      vaRenderLimit += 60;   // reveal more of what's already loaded
      vaRenderMovies();
      vaLoadMoreCurrent();   // and keep topping the pool up from the API
    });
  }, { rootMargin: '400px' });
  vaSentinelObserver.observe(sentinel);
}

// ── First-open init, wired from openMoviesOverlay() ──
window.vaInit = function(){
  vaApplySettingsToForm(vaGetSettings());
  vaInitSentinel();
  vaSetType('movie', document.querySelector('.va-type-btn[data-type="movie"]'));
  // Also prefetch the first page of TV Shows right away, in the background
  // — so switching the Movie/TV Show toggle never shows a loading state
  // either, it's (almost always) already sitting in memory by then.
  vaLoadMoreCurrent('tv');
};

// ── Bulk background preload — after the site goes idle, fetches pages in
// concurrent batches (not one at a time) so a large chunk of the catalog is
// already in memory before anyone opens Movies: up to ~50,000 movies, and
// the full TV catalog (VidAPI only lists ~19K shows total, so "50,000" for
// TV just means "all of them" — the loop stops once totalPages is reached).
// Search (vaFilterMovies/vaDeepSearch) reads straight from this same pool.
const VA_BULK_TARGET = 50000;
const vaBulkPreloading = { movie: false, tv: false };

async function vaBulkPreload(type){
  if (vaBulkPreloading[type]) return;
  vaBulkPreloading[type] = true;
  const pool = vaPools[type];
  const CONCURRENCY = 8;
  try {
    while (pool.all.length < VA_BULK_TARGET) {
      if (pool.totalPages !== null && pool.page > pool.totalPages) break; // whole catalog loaded
      const batch = [];
      while (batch.length < CONCURRENCY && (pool.totalPages === null || pool.page <= pool.totalPages)) {
        batch.push(pool.page++);
      }
      if (!batch.length) break;
      const results = await Promise.allSettled(batch.map(p => vaFetchPage(type, p)));
      let gotAny = false;
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value) {
          pool.totalPages = r.value.total_pages;
          if (r.value.items && r.value.items.length) { pool.all.push(...r.value.items); gotAny = true; }
        }
      }
      if (!gotAny) break; // stop instead of hammering the API on repeated failures
      // if this pool's overlay is open and visible right now, keep the
      // count text live — otherwise just keep loading quietly in the background
      if (type === vaCurrentType) {
        const overlay = document.getElementById('movies-overlay');
        if (overlay && overlay.classList.contains('open')) vaRenderMovies();
      }
      await new Promise(res => setTimeout(res, 60)); // small pause between batches
    }
  } finally {
    vaBulkPreloading[type] = false;
  }
}

(function(){
  function kickoff(){
    // Pre-warm the Movies grid itself (not just the raw data pool) so the
    // very first page of posters is already rendered into #vaMovieGrid,
    // in place of the skeleton, before the user ever opens the overlay —
    // opening it then just reveals content instead of triggering a fetch.
    if (typeof window.vaInit === 'function'){
      window.vaInit();
      window.vaInit = null;
    }
    // (old idle bulk preload of the whole catalogue removed: Movies / TV Shows now load fully only when opened)
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(kickoff, { timeout: 300 });
  } else {
    setTimeout(kickoff, 50);
  }
})();

// Sheet-supplied match/hero/live-tv links point at famcodexwebs.pages.dev
// with a country path — /IN?...&q=1080 for India (1080p is India-only) or
// /WW?id=... for worldwide. For visitors outside India, an /IN link is
// auto-swapped to the /WW path with the q=1080 param stripped; /WW links
// and India visitors pass through untouched.
function sxResolveFanCodeMatchUrl(url){
  try {
    const u = new URL(url);
    if (!/famcodexwebs\.pages\.dev$/i.test(u.hostname)) return url;
    const isIndiaPath = /^\/IN\/?$/i.test(u.pathname);
    const isForeign = window._sxCountry && window._sxCountry !== 'IN';
    if (isIndiaPath && isForeign) {
      u.pathname = '/WW';
      u.searchParams.delete('q');
      return u.toString();
    }
  } catch (e) { /* not a valid absolute URL — leave it as-is */ }
  return url;
}
// A few anchors (e.g. the match-card WATCH button) link straight to a
// watch_url instead of routing through openStreamPlayer. This intercepts
// just the famcodexwebs.pages.dev links on click — geo-resolves IN→WW
// and keeps navigation in the current tab (no popup) — and leaves every
// other link's normal click-through behavior completely untouched.
function sxWatchLinkClick(evt, a){
  const raw = a.getAttribute('href') || '';
  if (!/famcodexwebs\.pages\.dev/i.test(raw)) return true; // navigate normally
  evt.preventDefault();
  const resolved = sxResolveFanCodeMatchUrl(raw);
  openStreamPlayer(resolved, (a.textContent || 'FanCode').trim() || 'FanCode', 'match');
  return false;
}
function openOTT(){
  sxCloseAllOverlays();
  sxPlayPanelIntro();
  document.getElementById('ott-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'ott'));
  sxHeaderInto('ott-overlay', 'ott-topbar');
}
function closeOTT(){
  document.getElementById('ott-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
}

function openFanCode(){
  sxCloseAllOverlays();
  sxPlayPanelIntro();
  document.getElementById('fancode-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'fancode'));
  sxHeaderInto('fancode-overlay', 'fancode-topbar');
  if (typeof window.fcxInit === 'function') window.fcxInit();
}
function closeFanCode(){
  document.getElementById('fancode-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
  if (typeof window.fcxStop === 'function') window.fcxStop();
}
function openPrime(){
  sxShowComingSoon('Prime Video');
}
function closePrime(){
  document.getElementById('prime-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
}
function openWillow(){
  if (!document.getElementById('willow-overlay')) { sxShowComingSoon('Willow OTT'); return; }
  sxCloseAllOverlays();
  sxPlayPanelIntro();
  document.getElementById('willow-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'willow'));
  sxHeaderInto('willow-overlay', 'willow-topbar');
  if (typeof window.wlxInit === 'function') window.wlxInit();
}
function closeWillow(){
  document.getElementById('willow-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
  if (typeof window.wlxStop === 'function') window.wlxStop();
}
function openFifa(){
  if (!window.SX_FIFA_ENABLED) return;
  sxCloseAllOverlays();
  sxPlayPanelIntro();
  document.getElementById('fifa-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  window.__sxCurrentTab = 'fifa';
  document.querySelectorAll('[data-sxtab]').forEach(el => el.classList.toggle('active', el.dataset.sxtab === 'fifa'));
  sxHeaderInto('fifa-overlay', 'fifa-topbar');
}
function closeFifa(){
  document.getElementById('fifa-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
}

;

/* ═══════════════════════════════════════════════════════════════════════
   VIP PLAYER — access-code gated M3U channel browser. All playback goes
   through the site's own openStreamPlayer() so channels open in the
   EVORA StreamPulse player, same as Live TV / match links.
═══════════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";

  var VIP_CODE = "592600";
  var PLAYLIST_URL = EV_CONFIG.IPTV_PLAYLIST;
  var BATCH_SIZE = 120;
  var INITIAL_RENDER = 120;
  var SEARCH_DEBOUNCE = 200;
  var MAX_CATEGORY_PILLS = 22;
  var PRIORITY_CATEGORIES = ["News","Sports","Entertainment","Movies","Kids","Music"];

  var vipAllChannels = [];
  var vipCategoryCounts = new Map();
  var vipActiveCategory = "All";
  var vipActiveQuery = "";
  var vipFilteredChannels = [];
  var vipRenderedCount = 0;
  var vipLoaded = false;

  var $ = function(id){ return document.getElementById(id); };

  function escapeHtml(str){
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function debounce(fn, wait){
    var t;
    return function(){
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function(){ fn.apply(ctx, args); }, wait);
    };
  }

  function formatNum(n){ return n.toLocaleString("en-US"); }

  /* ============================================================
     M3U parsing
     #EXTINF:-1 tvg-id="x" tvg-name="Name" tvg-logo="url" group-title="Group",Display Name
     https://stream-url
     ============================================================ */
  function parseM3U(text){
    var lines = text.split(/\r?\n/);
    var channels = [];
    var attrRegex = /([a-zA-Z0-9\-]+)=("([^"]*)"|'([^']*)')/g;
    var pendingName = "", pendingLogo = "", pendingGroup = "";

    for (var i = 0; i < lines.length; i++){
      var line = lines[i].trim();
      if (!line) continue;

      if (line.charAt(0) === "#"){
        if (line.indexOf("#EXTINF") === 0){
          var commaIdx = line.lastIndexOf(",");
          var attrsPart = commaIdx > -1 ? line.substring(0, commaIdx) : line;
          var titlePart = commaIdx > -1 ? line.substring(commaIdx + 1).trim() : "";

          var tvgName = "", tvgLogo = "", groupTitle = "";
          attrRegex.lastIndex = 0;
          var m;
          while ((m = attrRegex.exec(attrsPart)) !== null){
            var key = m[1].toLowerCase();
            var val = m[3] !== undefined ? m[3] : m[4];
            if (key === "tvg-name") tvgName = val;
            else if (key === "tvg-logo") tvgLogo = val;
            else if (key === "group-title") groupTitle = val;
          }

          pendingName = tvgName || titlePart || "Untitled Channel";
          pendingLogo = tvgLogo || "";
          pendingGroup = (groupTitle || "").trim() || "Uncategorized";
        }
        continue;
      }

      if (/^https?:\/\//i.test(line) || line.indexOf("://") > -1){
        channels.push({
          name: pendingName || "Untitled Channel",
          logo: pendingLogo,
          group: pendingGroup || "Uncategorized",
          url: line
        });
        pendingName = ""; pendingLogo = ""; pendingGroup = "";
      }
    }
    return channels;
  }

  function vipFetchPlaylist(){
    vipSetLoading("Loading channels\u2026", "Fetching the playlist and preparing your library");
    fetch(PLAYLIST_URL, { cache: "no-store" })
      .then(function(res){
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function(text){
        var channels = parseM3U(text);
        if (!channels.length) throw new Error("No channels found in playlist");
        vipOnReady(channels);
      })
      .catch(function(err){ vipOnError(err); });
  }

  function vipSetLoading(title, sub){
    $("vipLoadingStage").hidden = false;
    $("vipErrorStage").hidden = true;
    $("vipResultsStage").hidden = true;
    $("vipToolbar").hidden = true;
    $("vipLoadTitle").textContent = title;
    $("vipLoadSub").textContent = sub;
    $("vipStatDot").className = "vip-stat-dot pulse";
  }

  function vipOnError(err){
    console.error("VIP playlist load failed:", err);
    $("vipLoadingStage").hidden = true;
    $("vipResultsStage").hidden = true;
    $("vipToolbar").hidden = true;
    $("vipErrorStage").hidden = false;
    $("vipStatDot").className = "vip-stat-dot err";
    $("vipErrorDetail").textContent = "The channel list couldn't be reached right now. This is usually a temporary network or CORS restriction \u2014 please try again in a moment.";
  }

  function vipOnReady(channels){
    vipAllChannels = channels;
    vipLoaded = true;

    vipCategoryCounts = new Map();
    for (var i = 0; i < channels.length; i++){
      var g = channels[i].group || "Uncategorized";
      vipCategoryCounts.set(g, (vipCategoryCounts.get(g) || 0) + 1);
    }

    $("vipLoadingStage").hidden = true;
    $("vipErrorStage").hidden = true;
    $("vipResultsStage").hidden = false;
    $("vipToolbar").hidden = false;

    $("vipStatCount").textContent = formatNum(vipAllChannels.length);
    $("vipStatDot").className = "vip-stat-dot";

    vipBuildCategoryPills();
    vipApplyFilters();
  }

  /* ============================================================
     Category pills
     ============================================================ */
  function vipBuildCategoryPills(){
    var entries = Array.from(vipCategoryCounts.entries());
    var used = new Set();
    var ordered = [];

    PRIORITY_CATEGORIES.forEach(function(pc){
      var match = entries.find(function(e){ return e[0].toLowerCase() === pc.toLowerCase(); });
      if (match){ ordered.push(match); used.add(match[0]); }
    });

    var rest = entries
      .filter(function(e){ return !used.has(e[0]); })
      .sort(function(a,b){ return b[1] - a[1]; });

    var remainingSlots = Math.max(0, MAX_CATEGORY_PILLS - 1 - ordered.length);
    ordered = ordered.concat(rest.slice(0, remainingSlots));

    var frag = document.createDocumentFragment();
    frag.appendChild(vipMakePill("All", vipAllChannels.length, true));
    ordered.forEach(function(e){ frag.appendChild(vipMakePill(e[0], e[1], false)); });

    var catScroll = $("vipCatScroll");
    catScroll.innerHTML = "";
    catScroll.appendChild(frag);
  }

  function vipMakePill(label, count, isActive){
    var el = document.createElement("div");
    el.className = "vip-pill" + (isActive ? " active" : "");
    el.setAttribute("role", "tab");
    el.setAttribute("data-cat", label);
    el.setAttribute("aria-selected", isActive ? "true" : "false");
    el.innerHTML = "<span>" + escapeHtml(label) + "</span><span class=\"cnt\">" + formatNum(count) + "</span>";
    el.addEventListener("click", function(){
      vipActiveCategory = label;
      Array.prototype.forEach.call($("vipCatScroll").querySelectorAll(".vip-pill"), function(p){
        var on = p.getAttribute("data-cat") === label;
        p.classList.toggle("active", on);
        p.setAttribute("aria-selected", on ? "true" : "false");
      });
      vipApplyFilters();
    });
    return el;
  }

  /* ============================================================
     Filtering + batched rendering
     ============================================================ */
  function vipApplyFilters(){
    var q = vipActiveQuery.trim().toLowerCase();
    var cat = vipActiveCategory;

    if (!q && cat === "All"){
      vipFilteredChannels = vipAllChannels;
    } else {
      vipFilteredChannels = vipAllChannels.filter(function(ch){
        if (cat !== "All" && ch.group !== cat) return false;
        if (q){
          var hay = (ch.name + " " + ch.group).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
    }

    $("vipResultCount").textContent = (q || cat !== "All")
      ? formatNum(vipFilteredChannels.length) + " match" + (vipFilteredChannels.length === 1 ? "" : "es")
      : formatNum(vipFilteredChannels.length) + " channels";

    $("vipChannelGrid").innerHTML = "";
    vipRenderedCount = 0;

    if (vipFilteredChannels.length === 0){
      $("vipEmptyState").hidden = false;
      $("vipEmptyQuery").textContent = q ? ("\u201c" + q + "\u201d") : ("\u201c" + cat + "\u201d");
      $("vipLoadMoreHint").hidden = true;
      return;
    }

    $("vipEmptyState").hidden = true;
    vipRenderNextBatch(INITIAL_RENDER);
  }

  function vipRenderNextBatch(count){
    var start = vipRenderedCount;
    var end = Math.min(vipFilteredChannels.length, start + count);
    if (start >= end) return;

    var frag = document.createDocumentFragment();
    for (var i = start; i < end; i++) frag.appendChild(vipBuildCard(vipFilteredChannels[i]));
    $("vipChannelGrid").appendChild(frag);
    vipRenderedCount = end;

    var hint = $("vipLoadMoreHint");
    if (vipRenderedCount < vipFilteredChannels.length){
      hint.hidden = false;
      hint.textContent = "Showing " + formatNum(vipRenderedCount) + " of " + formatNum(vipFilteredChannels.length) + " \u2014 scroll for more";
    } else {
      hint.hidden = vipFilteredChannels.length <= INITIAL_RENDER;
      hint.textContent = "All " + formatNum(vipFilteredChannels.length) + " channels loaded";
    }
  }

  var VIP_PLACEHOLDER_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="2.5" y="6" width="19" height="13" rx="2.2"/><path d="M8 3l4 3 4-3"/><path d="M8.5 12.3l3-1.9v3.8l-3-1.9z"/>' +
    '</svg>';

  function vipBuildCard(ch){
    var card = document.createElement("div");
    card.className = "vip-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    var logoWrap = document.createElement("div");
    logoWrap.className = "vip-card-logo";
    if (ch.logo){
      var img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = "";
      img.src = ch.logo;
      img.addEventListener("error", function(){
        logoWrap.classList.add("placeholder");
        logoWrap.innerHTML = VIP_PLACEHOLDER_SVG;
      }, { once: true });
      logoWrap.appendChild(img);
    } else {
      logoWrap.classList.add("placeholder");
      logoWrap.innerHTML = VIP_PLACEHOLDER_SVG;
    }

    var name = document.createElement("div");
    name.className = "vip-card-name";
    name.textContent = ch.name;

    var group = document.createElement("div");
    group.className = "vip-card-group";
    group.textContent = ch.group;

    var play = document.createElement("div");
    play.className = "vip-card-play";
    play.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Play</span>';

    card.appendChild(logoWrap);
    card.appendChild(name);
    card.appendChild(group);
    card.appendChild(play);

    function go(){
      // Every stream funnels through the site's own player choke point —
      // clear .m3u8 opens in the EVORA StreamPulse (SX 4K) player, same as
      // Live TV / match links.
      if (typeof openStreamPlayer === "function") openStreamPlayer(ch.url, ch.name || "Live Stream", "channel");
    }
    card.addEventListener("click", go);
    card.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " "){ e.preventDefault(); go(); } });
    return card;
  }

  /* ============================================================
     Infinite scroll
     ============================================================ */
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting && vipRenderedCount < vipFilteredChannels.length) vipRenderNextBatch(BATCH_SIZE);
      });
    }, { root: null, rootMargin: "800px 0px 800px 0px", threshold: 0 });
    io.observe($("vipScrollSentinel"));
  }

  var vipOnSearch = debounce(function(){
    vipActiveQuery = $("vipSearchInput").value;
    $("vipSearchClear").classList.toggle("show", vipActiveQuery.length > 0);
    vipApplyFilters();
  }, SEARCH_DEBOUNCE);

  function vipWireOnce(){
    if (vipWireOnce._done) return;
    vipWireOnce._done = true;
    $("vipSearchInput").addEventListener("input", vipOnSearch);
    $("vipSearchClear").addEventListener("click", function(){
      $("vipSearchInput").value = "";
      vipActiveQuery = "";
      $("vipSearchClear").classList.remove("show");
      vipApplyFilters();
      $("vipSearchInput").focus();
    });
    $("vipRetryBtn").addEventListener("click", vipFetchPlaylist);
    $("vipLockBtn").addEventListener("click", vipLock);
    $("vip-gate-form").addEventListener("submit", function(e){
      e.preventDefault();
      vipCheckCode();
    });
  }

  /* ============================================================
     Access gate — code "592600", no payment, no pricing
     ============================================================ */
  function vipCheckCode(){
    var input = $("vip-gate-input");
    var code = (input.value || "").trim();
    if (code === VIP_CODE){
      try { localStorage.setItem("vipUnlocked", "1"); } catch(e){}
      input.value = "";
      $("vip-gate-err").textContent = "";
      vipShowPlayer();
    } else {
      $("vip-gate-err").textContent = "Incorrect access code.";
      input.value = "";
      input.focus();
    }
  }

  function vipLock(){
    try { localStorage.removeItem("vipUnlocked"); } catch(e){}
    $("vip-player").hidden = true;
    $("vip-gate").style.display = "flex";
    setTimeout(function(){ var i = $("vip-gate-input"); if (i) i.focus(); }, 50);
  }

  function vipShowPlayer(){
    $("vip-gate").style.display = "none";
    $("vip-player").hidden = false;
    if (!vipLoaded) vipFetchPlaylist();
  }

  function vipIsUnlocked(){
    try { return localStorage.getItem("vipUnlocked") === "1"; } catch(e){ return false; }
  }

  // Called by openVip() every time the VIP overlay opens.
  window.vipInit = function(){
    vipWireOnce();
    if (vipIsUnlocked()){
      vipShowPlayer();
    } else {
      $("vip-gate").style.display = "flex";
      $("vip-player").hidden = true;
      setTimeout(function(){ var i = $("vip-gate-input"); if (i) i.focus(); }, 200);
    }
  };
})();

;

function openVip(){
  var ov = document.getElementById('vip-overlay');
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0,0);
  ov.scrollTop = 0;
  sxHeaderInto('vip-overlay', null);
  if (window.vipInit) vipInit();
}
function closeVip(){
  document.getElementById('vip-overlay').classList.remove('open');
  document.body.style.overflow = '';
  sxHeaderHome();
}

;

(function(){
  // Block right-click context menu
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); }, false);

  // Block common devtools / view-source / save-page shortcuts
  document.addEventListener('keydown', function(e){
    const k = e.key;
    if (k === 'F12') { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (k === 'I' || k === 'i' || k === 'J' || k === 'j' || k === 'C' || k === 'c')) { e.preventDefault(); return false; }
    if (e.ctrlKey && (k === 'u' || k === 'U')) { e.preventDefault(); return false; }
    if (e.ctrlKey && (k === 's' || k === 'S')) { e.preventDefault(); return false; }
    if (e.metaKey && e.altKey && (k === 'I' || k === 'i' || k === 'J' || k === 'j' || k === 'C' || k === 'c')) { e.preventDefault(); return false; } // Mac Cmd+Opt+I/J/C
  }, false);

  // Best-effort DevTools-open detection: only active while the stream
  // player is open, and skipped entirely on Smart TV browsers (no real
  // devtools risk there, and TV browser viewport reporting triggers
  // false positives). If an open devtools panel is detected, silently
  // closes the player and returns to the main page (no visible warning).
  // Uses a widened-viewport heuristic (works for docked panels) plus a
  // debugger-timing check (catches most undocked/console usage).
  // Still just a speed bump, not real protection.
  function isTvBrowser(){
    var ua = navigator.userAgent || '';
    return /Tizen|Web[O0]S|LG Browser|NetCast|GoogleTV|Google TV|AFT|AmazonWebAppPlatform|Silk-Accelerated|Roku|Android.*(TV|BRAVIA)|CrKey/i.test(ua);
  }
  if (isTvBrowser()) return;

  var dtTripped = false;
  function isPlayerOpen(){
    var el = document.getElementById('stream-player-overlay');
    return !!(el && el.classList.contains('open'));
  }
  function dtTrip(){
    if (dtTripped) return;
    if (!isPlayerOpen()) return;
    dtTripped = true;
    if (typeof closeStreamPlayer === 'function') closeStreamPlayer();
    window.scrollTo(0, 0);
  }
  function dtReset(){ dtTripped = false; }
  var dtThreshold = 160;
  function checkSizeHeuristic(){
    if (!isPlayerOpen()) { dtReset(); return; }
    var widthDiff = window.outerWidth - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > dtThreshold || heightDiff > dtThreshold) dtTrip();
    else dtReset();
  }
  setInterval(checkSizeHeuristic, 800);
  window.addEventListener('resize', checkSizeHeuristic, false);

  (function debuggerLoop(){
    var start = performance.now();
    debugger;
    var delta = performance.now() - start;
    if (delta > 100) dtTrip(); else if (isPlayerOpen()) dtReset();
    setTimeout(debuggerLoop, 1000);
  })();
})();

;

(function(){
  // PC/desktop (fine pointer = mouse/trackpad) never gets D-pad nav or the
  // remote focus outline — that's strictly for Smart TV remotes / D-pad input.
  // Touchscreens (phones/tablets) are also excluded: they report the same
  // "coarse" pointer as a TV remote, but taps still focus buttons/links,
  // which was wrongly painting the pink remote-focus ring on every tap.
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) return;
  if (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) return;

  var CLICKABLE_SEL = '[onclick], a[href]:not([href="#"]), button';
  var focusedEl = null;

  function isVisible(el){
    if (!el || !(el.offsetWidth || el.offsetHeight || el.getClientRects().length)) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  // Make every clickable element keyboard/remote-focusable, once — except
  // the mobile bottom nav, the mobile top hamburger strip, and the
  // per-card favourite-heart buttons, which must never show the remote
  // focus ring (they're tap targets, not D-pad/TV navigation targets).
  function normalizeFocusables(root){
    var list;
    if (root && root.nodeType === 1) {
      list = Array.prototype.slice.call(root.querySelectorAll(CLICKABLE_SEL));
      if (root.matches(CLICKABLE_SEL)) list.unshift(root);
    } else {
      list = document.querySelectorAll(CLICKABLE_SEL);
    }
    Array.prototype.forEach.call(list, function(el){
      if (el.hasAttribute('data-remote-focusable')) return;
      if (el.closest('.mobile-tabbar, .mobile-topstrip, .sx-heart-btn')) return;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role') && el.tagName !== 'A' && el.tagName !== 'BUTTON') el.setAttribute('role', 'button');
      el.setAttribute('data-remote-focusable', '1');
    });
  }
  normalizeFocusables();
  // PERF: only look at newly added ELEMENTS (countdown text updates add text nodes -> ignored),
  // batched, and only scan the added subtrees instead of the whole document.
  var nfQueue = [], nfTimer = null;
  new MutationObserver(function(muts){
    for (var i = 0; i < muts.length; i++) {
      var add = muts[i].addedNodes;
      for (var j = 0; j < add.length; j++) if (add[j].nodeType === 1) nfQueue.push(add[j]);
    }
    if (!nfQueue.length || nfTimer) return;
    nfTimer = setTimeout(function(){
      var q = nfQueue; nfQueue = []; nfTimer = null;
      q.forEach(function(n){ if (n.isConnected) normalizeFocusables(n); });
    }, 200);
  }).observe(document.body, { childList: true, subtree: true });

  // Enter / OK activates the focused element (click handles Space natively for buttons/links).
  document.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
      var el = document.activeElement;
      if (el && el.hasAttribute('data-remote-focusable')) {
        e.preventDefault();
        el.click();
      }
    }
  }, false);

  // Track visible focus ring manually (works even for divs, which don't
  // always show a native focus ring consistently across TV browsers).
  document.addEventListener('focusin', function(e){
    if (focusedEl) focusedEl.classList.remove('remote-focus');
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-remote-focusable')) {
      focusedEl = e.target;
      focusedEl.classList.add('remote-focus');
      focusedEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, true);
  document.addEventListener('focusout', function(e){
    if (e.target === focusedEl) { focusedEl.classList.remove('remote-focus'); focusedEl = null; }
  }, true);

  // D-pad spatial navigation: find the nearest focusable element in the
  // pressed direction, using each element's on-screen position.
  function focusableRects(){
    return Array.prototype.slice.call(document.querySelectorAll('[data-remote-focusable]'))
      .filter(isVisible)
      .map(function(el){ return { el: el, r: el.getBoundingClientRect() }; });
  }
  function moveFocus(dir){
    var current = document.activeElement;
    var items = focusableRects();
    if (!items.length) return;
    if (!current || !current.hasAttribute || !current.hasAttribute('data-remote-focusable')) {
      items.sort(function(a,b){ return (a.r.top - b.r.top) || (a.r.left - b.r.left); });
      items[0].el.focus();
      return;
    }
    var cr = current.getBoundingClientRect();
    var cx = cr.left + cr.width/2, cy = cr.top + cr.height/2;
    var best = null, bestScore = Infinity;
    items.forEach(function(it){
      if (it.el === current) return;
      var ex = it.r.left + it.r.width/2, ey = it.r.top + it.r.height/2;
      var dx = ex - cx, dy = ey - cy;
      var primary, ok;
      if (dir === 'right') { ok = dx > 4; primary = dx; }
      else if (dir === 'left') { ok = dx < -4; primary = -dx; }
      else if (dir === 'down') { ok = dy > 4; primary = dy; }
      else { ok = dy < -4; primary = -dy; }
      if (!ok) return;
      var secondary = (dir === 'left' || dir === 'right') ? Math.abs(dy) : Math.abs(dx);
      var score = primary + secondary * 2.2; // penalize misalignment more than distance
      if (score < bestScore) { bestScore = score; best = it.el; }
    });
    if (best) best.focus();
  }
  document.addEventListener('keydown', function(e){
    var map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (map[e.key]) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return; // let typing/scrolling work normally
      e.preventDefault();
      moveFocus(map[e.key]);
    }
  }, false);

  // Numpad quick-jump: typing digits focuses the Nth visible card on
  // screen (1 = first card fully/partly in the viewport), like classic
  // remote channel-number entry. A short pause or Enter confirms.
  var digitBuffer = '';
  var digitTimer = null;
  function jumpToNumber(n){
    var items = focusableRects().filter(function(it){
      var r = it.r;
      return r.bottom > 0 && r.top < window.innerHeight;
    }).sort(function(a,b){ return (a.r.top - b.r.top) || (a.r.left - b.r.left); });
    var idx = n - 1;
    if (idx >= 0 && idx < items.length) items[idx].el.focus();
  }
  document.addEventListener('keydown', function(e){
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key >= '0' && e.key <= '9') {
      digitBuffer += e.key;
      if (digitBuffer.length > 3) digitBuffer = digitBuffer.slice(-3);
      clearTimeout(digitTimer);
      digitTimer = setTimeout(function(){
        jumpToNumber(parseInt(digitBuffer, 10));
        digitBuffer = '';
      }, 600);
    }
  }, false);
})();

;

(function(){
  var nativeOpen = window.open;
  window.__sxAllowPopup = false;
  window.open = function(){
    if (window.__sxAllowPopup) {
      window.__sxAllowPopup = false;
      return nativeOpen.apply(window, arguments);
    }
    console.warn('Blocked an unauthorized popup:', arguments[0]);
    return null;
  };

  var lastClickAt = 0;
  document.addEventListener('click', function(){ lastClickAt = Date.now(); }, true);
  var _coarse = window.matchMedia && matchMedia('(pointer:coarse)').matches;
  window.addEventListener('blur', function(){
    if (_coarse) return;   /* touch browsers: stealing focus back breaks taps on channels / embeds */
    if (Date.now() - lastClickAt < 600) {
      setTimeout(function(){ window.focus(); }, 50);
    }
  });
})();

;

function sxShowComingSoon(label){
  document.getElementById('sx-comingsoon-title').textContent = label + ' — Coming Soon';
  document.getElementById('sx-comingsoon-overlay').classList.add('open');
}
function closeComingSoon(){
  document.getElementById('sx-comingsoon-overlay').classList.remove('open');
}
window.sxShowComingSoon = sxShowComingSoon;
window.closeComingSoon = closeComingSoon;

;

/* ══════════════════════════════════════════════════════════════════════
   SX FLAG HELPER — team flags come ONLY from flagcdn.com, resolved from the
   country NAME or its ISO-3166 alpha-2 / alpha-3 code. The feed's own
   teamAFlag / teamBFlag images are no longer used.
   window.sxFlagUrl("India" | "IN" | "IND" | "Zimbabwe Women" ...) -> URL or ''
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  // "iso2 iso3 Name;Alias;Alias"
  var RAW = [
'af AFG Afghanistan','al ALB Albania','dz DZA Algeria','as ASM American Samoa','ad AND Andorra','ao AGO Angola','ai AIA Anguilla',
'ag ATG Antigua and Barbuda;Antigua','ar ARG Argentina','am ARM Armenia','aw ABW Aruba','au AUS Australia','at AUT Austria',
'az AZE Azerbaijan','bs BHS Bahamas;The Bahamas','bh BHR Bahrain','bd BGD Bangladesh','bb BRB Barbados','by BLR Belarus',
'be BEL Belgium','bz BLZ Belize','bj BEN Benin','bm BMU Bermuda','bt BTN Bhutan','bo BOL Bolivia','ba BIH Bosnia and Herzegovina;Bosnia',
'bw BWA Botswana','br BRA Brazil','vg VGB British Virgin Islands','bn BRN Brunei;Brunei Darussalam','bg BGR Bulgaria',
'bf BFA Burkina Faso','bi BDI Burundi','kh KHM Cambodia','cm CMR Cameroon','ca CAN Canada','cv CPV Cabo Verde;Cape Verde',
'ky CYM Cayman Islands','cf CAF Central African Republic','td TCD Chad','cl CHL Chile','cn CHN China;China PR;PR China','co COL Colombia',
'km COM Comoros','cg COG Congo Republic;Republic of the Congo;Congo;Congo Brazzaville','cd COD DR Congo;Congo DR;Democratic Republic of the Congo',
'ck COK Cook Islands','cr CRI Costa Rica','ci CIV Cote d Ivoire;Ivory Coast','hr HRV Croatia','cu CUB Cuba','cw CUW Curacao',
'cy CYP Cyprus','cz CZE Czechia;Czech Republic','dk DNK Denmark','dj DJI Djibouti','dm DMA Dominica','do DOM Dominican Republic',
'ec ECU Ecuador','eg EGY Egypt','sv SLV El Salvador','gq GNQ Equatorial Guinea','er ERI Eritrea','ee EST Estonia','sz SWZ Eswatini;Swaziland',
'et ETH Ethiopia','fo FRO Faroe Islands;Faroes','fj FJI Fiji','fi FIN Finland','fr FRA France','gf GUF French Guiana','pf PYF Tahiti;French Polynesia',
'ga GAB Gabon','gm GMB Gambia;The Gambia','ge GEO Georgia','de DEU Germany;GER','gh GHA Ghana','gi GIB Gibraltar','gr GRC Greece;GRE',
'gd GRD Grenada','gp GLP Guadeloupe','gu GUM Guam','gt GTM Guatemala','gn GIN Guinea','gw GNB Guinea-Bissau;Guinea Bissau','gy GUY Guyana',
'ht HTI Haiti','hn HND Honduras','hk HKG Hong Kong','hu HUN Hungary','is ISL Iceland','in IND India','id IDN Indonesia',
'ir IRN Iran;IR Iran','iq IRQ Iraq','ie IRL Ireland;Republic of Ireland','il ISR Israel','it ITA Italy','jm JAM Jamaica','jp JPN Japan',
'jo JOR Jordan','kz KAZ Kazakhstan','ke KEN Kenya','xk XKX Kosovo','kw KWT Kuwait','kg KGZ Kyrgyzstan;Kyrgyz Republic','la LAO Laos',
'lv LVA Latvia','lb LBN Lebanon','ls LSO Lesotho','lr LBR Liberia','ly LBY Libya','li LIE Liechtenstein','lt LTU Lithuania',
'lu LUX Luxembourg','mo MAC Macau;Macao','mg MDG Madagascar','mw MWI Malawi','my MYS Malaysia','mv MDV Maldives','ml MLI Mali',
'mt MLT Malta','mq MTQ Martinique','mr MRT Mauritania','mu MUS Mauritius','mx MEX Mexico','md MDA Moldova','mc MCO Monaco','mn MNG Mongolia',
'me MNE Montenegro','ms MSR Montserrat','ma MAR Morocco','mz MOZ Mozambique','mm MMR Myanmar;Burma','na NAM Namibia','np NPL Nepal',
'nl NLD Netherlands;Holland;NED','nc NCL New Caledonia','nz NZL New Zealand','ni NIC Nicaragua','ne NER Niger','ng NGA Nigeria',
'kp PRK North Korea;Korea DPR;DPR Korea','mk MKD North Macedonia;Macedonia','no NOR Norway','om OMN Oman','pk PAK Pakistan','ps PSE Palestine',
'pa PAN Panama','pg PNG Papua New Guinea','py PRY Paraguay','pe PER Peru','ph PHL Philippines','pl POL Poland','pt PRT Portugal',
'pr PRI Puerto Rico','qa QAT Qatar','ro ROU Romania','ru RUS Russia','rw RWA Rwanda','kn KNA Saint Kitts and Nevis;St Kitts and Nevis',
'lc LCA Saint Lucia;St Lucia','vc VCT Saint Vincent and the Grenadines;St Vincent and the Grenadines','ws WSM Samoa','sm SMR San Marino',
'st STP Sao Tome and Principe','sa SAU Saudi Arabia','sn SEN Senegal','rs SRB Serbia','sc SYC Seychelles','sl SLE Sierra Leone',
'sg SGP Singapore','sx SXM Sint Maarten','sk SVK Slovakia','si SVN Slovenia','sb SLB Solomon Islands','so SOM Somalia','za ZAF South Africa;RSA',
'kr KOR South Korea;Korea Republic;Korea;Republic of Korea','ss SSD South Sudan','es ESP Spain','lk LKA Sri Lanka','sd SDN Sudan',
'sr SUR Suriname','se SWE Sweden','ch CHE Switzerland;SUI','sy SYR Syria','tw TWN Chinese Taipei;Taiwan','tj TJK Tajikistan','tz TZA Tanzania',
'th THA Thailand','tl TLS East Timor;Timor-Leste;Timor Leste','tg TGO Togo','to TON Tonga','tt TTO Trinidad and Tobago','tn TUN Tunisia',
'tr TUR Turkey;Turkiye','tm TKM Turkmenistan','tc TCA Turks and Caicos Islands;Turks and Caicos','ug UGA Uganda','ua UKR Ukraine',
'ae ARE United Arab Emirates;UAE','gb GBR United Kingdom;UK;Great Britain','us USA USA;United States;United States of America;America',
'vi VIR US Virgin Islands;U S Virgin Islands;United States Virgin Islands','uy URY Uruguay','uz UZB Uzbekistan','vu VUT Vanuatu',
've VEN Venezuela','vn VNM Vietnam;Viet Nam','ye YEM Yemen','zm ZMB Zambia','zw ZWE Zimbabwe',
'gb-eng ENG England','gb-sct SCO Scotland','gb-wls WAL Wales','gb-nir NIR Northern Ireland'
  ];
  var MAP = {};
  function key(s){
    return String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  RAW.forEach(function(row){
    var m = /^(\S+)\s+(\S+)\s+(.+)$/.exec(row); if (!m) return;
    var iso2 = m[1];
    MAP[key(iso2)] = iso2;               // ISO alpha-2   (e.g. "in", "gb-eng")
    MAP[key(m[2])] = iso2;               // ISO alpha-3   (e.g. "ind")
    m[3].split(';').forEach(function(n){ MAP[key(n)] = iso2; });   // names + aliases
  });
  // "Zimbabwe Women", "India U19", "Brazil Under 20", "Japan (W)" -> base country
  var SUFFIX = /\s+(women|womens|woman|ladies|w|men|mens|u ?\d{2}|under ?\d{2}|olympic|olympics|reserves?|b|a|national team|nt)$/;
  window.sxFlagUrl = function(name){
    var k = key(name), guard = 0;
    if (!k) return '';
    while (guard++ < 3 && !MAP.hasOwnProperty(k) && SUFFIX.test(k)) k = k.replace(SUFFIX, '');
    var iso = MAP.hasOwnProperty(k) ? MAP[k] : '';
    return iso ? 'https://flagcdn.com/w80/' + iso + '.png' : '';
  };
})();

;

/* ══════════════════════════════════════════════════════════════════════
   SLX BRIDGE — SonyLIV LIVE matches (kajju027/SonyLiv-Events-Json).
   • Only LIVE entries that carry a direct HLS (.m3u8) link are kept, so
     every stream plays inside the EVORA StreamPulse (SX 4K) player.
   • Same match in several languages ("Qatar vs India ... [ENG]" / "[TAM]")
     — and near-identical names ("Ind v Brazil" / "india v braxil") — are
     merged into ONE card; each language becomes a server in the selector.
   • One Matches-tab section per category (sport).
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var API  = EV_CONFIG.SONYLIV_API;
  var LOGO = 'https://upload.wikimedia.org/wikipedia/commons/f/f7/SonyLIV_2020.png';
  var REFRESH_MS = 60000;
  window._slxGroups = [];
  var lastSig = null;

  var LANGS = { ENG:'English', EN:'English', HIN:'Hindi', HI:'Hindi', TAM:'Tamil', TA:'Tamil',
    TEL:'Telugu', TE:'Telugu', KAN:'Kannada', KA:'Kannada', MAL:'Malayalam', ML:'Malayalam',
    BEN:'Bengali', BAN:'Bengali', BN:'Bengali', MAR:'Marathi', MR:'Marathi', GUJ:'Gujarati', GU:'Gujarati',
    PUN:'Punjabi', PA:'Punjabi', ODI:'Odia', ORI:'Odia', OD:'Odia', BHO:'Bhojpuri', URD:'Urdu', UR:'Urdu', ASM:'Assamese' };
  var ALIAS = { ind:'india', bra:'brazil', pak:'pakistan', eng:'england', aus:'australia', nz:'new zealand',
    sl:'sri lanka', sa:'south africa', wi:'west indies', ban:'bangladesh', afg:'afghanistan', jpn:'japan',
    qat:'qatar', tha:'thailand', chn:'china', kor:'south korea', irn:'iran', usa:'united states',
    rsa:'south africa', nzl:'new zealand', ned:'netherlands', ire:'ireland', zim:'zimbabwe', sco:'scotland', nep:'nepal', uae:'united arab emirates',
    oma:'oman', can:'canada', png:'papua new guinea', hk:'hong kong', esp:'spain', fra:'france', ger:'germany', por:'portugal', arg:'argentina',
    ita:'italy', bel:'belgium', cro:'croatia', mex:'mexico', uru:'uruguay', col:'colombia' };
  var GENERIC_CAT = /^(sports?|live|other|events?)?$/i;

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }
  function titleCase(s){ return String(s||'').toLowerCase().replace(/\b[a-z]/g, function(c){ return c.toUpperCase(); }); }

  // Start time of a feed entry (epoch s/ms, ISO string, ...) -> Date or null
  function slxStart(e){
    function conv(v){
      if (v == null || v === '' || typeof v === 'boolean') return null;
      var n = (typeof v === 'number') ? v : (/^\d{9,13}$/.test(String(v).trim()) ? Number(v) : NaN);
      if (!isNaN(n)) { if (n < 1e11) n *= 1000; var d0 = new Date(n); return d0.getFullYear() > 2000 ? d0 : null; }
      if (typeof v !== 'string' || !/\d{1,2}[:\/.-]\d{1,2}/.test(v)) return null;
      var d = new Date(v); return (!isNaN(d.getTime()) && d.getFullYear() > 2000) ? d : null;
    }
    var pref = ['start_time','startTime','start','start_date_time','startDateTime','start_date','event_start','event_start_time','match_start','match_time','scheduled_time','scheduled_at','schedule','kickoff','kick_off','start_epoch','timestamp','time','date'];
    for (var i = 0; i < pref.length; i++){ var r = conv(e[pref[i]]); if (r) return r; }
    for (var k in e){ if (/start|schedul|kick|epoch|time|date/i.test(k) && !/end|update|creat/i.test(k)){ var r2 = conv(e[k]); if (r2) return r2; } }
    return null;
  }
  function isHls(u){
    u = String(u || '').trim();
    if (typeof window.sxIsStreamUrl === 'function') return window.sxIsStreamUrl(u);
    return /^https?:\/\/[^#?]+\.(m3u8|mpd)(\?|#|$)/i.test(u);
  }
  function pickUrl(e){
    var c = [e.video_url, e.dai_url, e.pub_url];
    for (var i = 0; i < c.length; i++) if (c[i] && isHls(c[i])) return String(c[i]).trim();
    var all = (window.LMX && LMX.scan) ? LMX.scan(e) : [];                       // any other field holding m3u8 / mpd
    return all.length ? all[0] : '';
  }
  function langOf(e){
    var raw = (e.match_name || '') + ' ' + (e.event_name || '');
    var m = raw.match(/\[([^\]]+)\]/);
    if (m){
      var code = m[1].trim().toUpperCase();
      if (LANGS[code]) return LANGS[code];
      if (code.length > 3) return titleCase(code);
    }
    if (e.language) return LANGS[String(e.language).trim().toUpperCase()] || titleCase(e.language);
    return 'Default';
  }
  function normTeam(t){
    t = String(t||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
    return ALIAS[t] || t;
  }
  // Any date written anywhere in a title: "29 Sep 2026", "29th September", "Sep 29, 2026", "2026-09-29", "29/09/2026"
  var MON = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*';
  var DATE_SRC = '\\b\\d{1,2}(?:st|nd|rd|th)?\\s+' + MON + '\\.?(?:,?\\s*\\d{2,4})?\\b' +
                 '|\\b' + MON + '\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s*\\d{2,4})?\\b' +
                 '|\\b\\d{4}-\\d{2}-\\d{2}\\b|\\b\\d{1,2}[\\/.-]\\d{1,2}[\\/.-]\\d{2,4}\\b';
  function stripDates(s){ return String(s||'').replace(new RegExp(DATE_SRC, 'gi'), ' ').replace(/\s+/g, ' ').trim(); }
  function parse(name){
    var s = String(name||'').replace(/\[[^\]]*\]/g,' ')
      .replace(/^\s*(live|upcoming|completed)\s*[-:–—]\s*/i,'').replace(/\s+/g,' ').trim();
    var dm = new RegExp(DATE_SRC, 'i').exec(s);
    var date = dm ? dm[0].toLowerCase().replace(/[^a-z0-9]/g,'') : '';
    // teams / sport are read from the title WITH the date removed, so
    // "India vs Brazil - 29 Sep 2026" and "India vs Brazil" are the same match
    var bare = stripDates(s).replace(/\s+[-–—|]\s*(?=[-–—|]|$)/g, ' ').replace(/^[-–—|\s]+|[-–—|\s]+$/g, '');
    var parts = bare.split(/\s+[-–—|]\s+/).map(function(x){ return x.trim(); }).filter(Boolean);
    var head = parts[0] || bare;
    var vs = head.split(/\s+(?:vs\.?|v\.?|versus)\s+/i);
    return {
      clean: s,
      teams: vs.length >= 2 ? [normTeam(vs[0]), normTeam(vs[1])] : [normTeam(head)],
      sport: parts[1] || '',
      date: date
    };
  }
  function lev(a, b){
    var m = a.length, n = b.length, i, j, d = [];
    for (i = 0; i <= m; i++){ d[i] = [i]; }
    for (j = 1; j <= n; j++){ d[0][j] = j; }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    return d[m][n];
  }
  function sameTeam(a, b){
    if (a === b) return true;
    if (!a || !b) return false;
    if (window.sxLeagueTag && sxLeagueTag(a) !== sxLeagueTag(b)) return false;   // West Indies != West Indies Champions
    if (window.sxTeamVariant && sxTeamVariant(a, b)) return false;   // India != India A, Brazil != Brazil U20
    if (Math.min(a.length, b.length) >= 3 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)) return true;
    return 1 - lev(a, b) / Math.max(a.length, b.length) >= 0.78;
  }
  function sameDate(x, y){                                   // date written on only ONE side (or a year-less prefix of the other) = same day
    if (!x || !y) return true;
    return x === y || x.indexOf(y) === 0 || y.indexOf(x) === 0;
  }
  function sameMatch(A, B){
    var ca = GENERIC_CAT.test(A.cat || '') ? '' : A.cat.toLowerCase(), cb = GENERIC_CAT.test(B.cat || '') ? '' : B.cat.toLowerCase();
    if (ca && cb && ca !== cb) return false;                 // a generic "Sports" never blocks a merge
    if (!sameDate(A.p.date, B.p.date)) return false;
    var a = A.p.teams, b = B.p.teams;
    if (a.length !== b.length) return false;
    if (a.length === 1) return 1 - lev(a[0], b[0]) / Math.max(a[0].length, b[0].length, 1) >= 0.85;
    return (sameTeam(a[0], b[0]) && sameTeam(a[1], b[1])) || (sameTeam(a[0], b[1]) && sameTeam(a[1], b[0]));
  }

  function buildGroups(json){
    var list = (json && json.matches) || [];
    var items = [];
    list.forEach(function(e){
      if (!e) return;
      var stl = String(e.status || '').trim().toLowerCase();
      var st = stl === 'live' ? 'LIVE' : /^(ended|completed|finished|over)$/.test(stl) ? 'ENDED' : 'UPCOMING';
      var url = pickUrl(e) || '';                                                  // no stream yet -> still listed
      var name = e.match_name || e.event_name || '';
      var p = parse(name);
      var cat = String(e.category || '').trim();
      if (GENERIC_CAT.test(cat) && p.sport && !/^(day|match|round|game|innings|session|\d)/i.test(p.sport)) cat = p.sport;                         // "Sports" -> "Volleyball"
      if (!cat) cat = 'Other';
      if (st === 'ENDED') return;                                                  // never list finished matches
      var start = slxStart(e);
      if (st !== 'LIVE') return;                                                    // SonyLIV: ONLY matches that are live right now
      items.push({ e:e, url:url, lang:langOf(e), p:p, cat:cat, st:st, start:start, drm: !!(window.LMX && LMX.hasDrm(e, true)) });
    });
    var groups = [];
    items.forEach(function(it){
      var g = groups.find(function(x){ return sameMatch(x.ref, it); });
      if (!g){ g = { ref: it, items: [] }; groups.push(g); }
      g.items.push(it);
    });
    return groups.map(function(g, idx){
      var order = { English:0, Hindi:1 };
      g.items.sort(function(a, b){
        var oa = a.lang in order ? order[a.lang] : 9, ob = b.lang in order ? order[b.lang] : 9;
        return oa - ob || a.lang.localeCompare(b.lang);
      });
      var seen = {};
      var title = g.items.reduce(function(best, it){ return it.p.clean.length > best.length ? it.p.clean : best; }, g.ref.p.clean);
      var servers = g.items.filter(function(it){ return it.url; }).map(function(it, si){
        seen[it.lang] = (seen[it.lang] || 0) + 1;
        var label = it.lang === 'Default' ? 'Server ' + (si + 1)
          : (seen[it.lang] > 1 ? it.lang + ' ' + seen[it.lang] : it.lang);
        return { url: it.url, text: label, icon: LOGO, sub: 'SonyLIV · tap to play', playName: title + ' · ' + label, appOnly: !!it.drm };
      });
      var poster = ''; g.items.forEach(function(it){ if (!poster && it.e.poster) poster = it.e.poster; });
      var gS = null, gT = '';
      g.items.forEach(function(it){
        if (it.start && (!gS || it.start < gS)) gS = it.start;
        if (!gT) gT = String(it.e.tournament || it.e.tournament_name || it.e.series || it.e.series_name || it.e.league || it.e.competition || '').trim();
        if (!gT && it.e.event_name) {   /* SonyLIV feed: event_name = tournament, sometimes wrapped as "Upcoming - A vs B - Tournament" */
          gT = String(it.e.event_name).replace(/^\s*(upcoming|live|completed|ended|finished)\s*[-:\u2013\u2014]\s*/i, '')
            .split(/\s+[-\u2013\u2014]\s+/).filter(function(p){ return p && !/\b(vs?\.?|versus)\b/i.test(p); }).join(' - ').replace(/\s+/g, ' ').trim();
        }
      });
      var gStatus = g.items.some(function(it){ return it.st === 'LIVE'; }) ? 'LIVE' : g.items.every(function(it){ return it.st === 'ENDED'; }) ? 'ENDED' : 'UPCOMING';
      return { key: 'slx' + idx, status: gStatus, title: title, category: g.ref.cat, blob: (window.sxBlob ? sxBlob(g.ref.e) : ''), poster: poster, servers: servers, teams: g.ref.p.teams, date: g.ref.p.date, start: gS, tour: gT };
    });
  }

  function findGroup(key){ return (window._slxGroups || []).find(function(g){ return g.key === key; }) || null; }

  window.slxOpenWatch = function(key){
    var g = findGroup(key);
    if (!g || typeof openMatchWatchScreen !== 'function') return false;
    if (g.servers.length && window.LMX && LMX.items){            /* merged entry carries Sheet + FanCode + Willow servers too */
      var hit = LMX.items.filter(function(it){ return it.servers.some(function(s){ return s.url === g.servers[0].url; }); })[0];
      if (hit) return LMX.open(hit.key);
    }
    openMatchWatchScreen(g.servers, {
      name: g.title,
      team1_code:'', team1_full_name:'', team1_icon_url:'',
      team2_code:'', team2_full_name:'', team2_icon_url:'',
      date_label: g.servers.length + (g.servers.length === 1 ? ' language' : ' languages') + ' available',
      details: g.category,
      countdown: '', status: 'live', banner: g.poster || ''
    });
    return false;
  };

  window.slxAppendHomeSections = function(){
    var el = document.getElementById('match-overlay');
    if (!el) return;
    el.querySelectorAll('.slx-smo-section').forEach(function(s){ s.remove(); });
    var groups = window._slxGroups || [];
    if (!groups.length) return;
    var byCat = {}, order = [];
    groups.forEach(function(g){ if (!byCat[g.category]){ byCat[g.category] = []; order.push(g.category); } byCat[g.category].push(g); });
    order.forEach(function(cat){
      var cards = byCat[cat].map(function(g){
        var n = g.servers.length;
        return '<div class="smo-card fx2-card" data-live="1" data-finished="0" data-start-ms="0">' +
          '<div class="fx2-thumb">' +
            (g.poster ? '<img loading=lazy decoding=async src="' + esc(g.poster) + '" alt="' + esc(g.title) + '" class="fx2-thumb-img" onerror="this.style.display=\'none\'">' : '') +
            '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span>' +
          '</div>' +
          '<div class="fx2-body">' +
            '<div class="fx2-title-row"><div class="fx2-title">' + esc(g.title) + '</div><span class="fx2-free">FREE</span></div>' +
            '<div class="fx2-meta"><span class="fx2-tag">' + esc(g.category) + '</span>' +
              '<span class="fx2-date">' + n + (n === 1 ? ' language' : ' languages') + '</span></div>' +
            '<div class="smo-timer" style="visibility:hidden"><div class="timer-label">STARTS IN</div><div class="timer-display">--:--:--</div></div>' +
            '<a class="smo-btn" href="javascript:void(0)" onclick="event.stopPropagation();return slxOpenWatch(\'' + g.key + '\')">▶ Watch Now</a>' +
          '</div></div>';
      }).join('');
      el.insertAdjacentHTML('beforeend', '<div class="smo-section slx-smo-section"><div class="smo-section-label">SonyLIV · ' + esc(cat) + '</div>' + cards + '</div>');
      var secs = el.querySelectorAll('.slx-smo-section');
      var sec = secs[secs.length - 1];
      if (sec){
        sec.dataset.game = 'SonyLIV · ' + cat;
        sec.dataset.sport = (typeof fcxResolveSport === 'function') ? fcxResolveSport(cat) : cat;
      }
    });
    if (typeof sxReorderAllSectionsLiveThenTime === 'function') sxReorderAllSectionsLiveThenTime(el);
    if (typeof smoApplyFilter === 'function') smoApplyFilter();
  };

  function load(){
    fetch(API + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function(r){ return r.json(); })
      .then(function(json){
        var groups = buildGroups(json);
        var sig = JSON.stringify(groups.map(function(g){ return [g.title, g.status, g.category, g.servers.map(function(s){ return s.text + s.url; })]; }));
        var el = document.getElementById('match-overlay');
        var present = !!(el && el.querySelector('.slx-smo-section'));
        window._slxGroups = groups;
        if (sig === lastSig && (present || !groups.length)) return;
        lastSig = sig;
        if (window._matchCardsRawRows && typeof renderMatchCards === 'function') renderMatchCards(window._matchCardsRawRows);
        else window.slxAppendHomeSections();
      })
      .catch(function(err){ console.error('SLX load error:', err); });
  }
  load();
  setInterval(load, REFRESH_MS);
})();

;

/* ======================================================================
   WLX BRIDGE - Willow OTT matches (sonujson-v5.pages.dev/Data/willow.json)
   Same pattern as FCX (FanCode) + SLX (SonyLIV):
   - own feed with CORS fallback chain (direct -> allorigins -> corsproxy)
   - every entry becomes a "group" in window._wlxGroups
   - LMX (unified layer) reads _wlxGroups: servers are folded into matching
     Sheet / FanCode / SonyLIV fixtures, otherwise shown as their own card,
     Live-Now block, sport selector and global search all pick it up
   - Willow OTT panel (openWillow) lists every Willow match
   - streams: any m3u8/mpd found anywhere in the entry (CnpTV etc.);
     entries with a drm_key are flagged app-only like the other feeds
   ====================================================================== */
(function(){
  'use strict';
  var APIS    = EV_CONFIG.WILLOW_APIS;      /* add backup feed URLs here */
  var PROXIES = EV_CONFIG.WILLOW_PROXIES;
  var LOGO    = 'https://bobgoldpr.com/wp-content/uploads/2024/05/logo-transparent-cb-1.png';
  var REFRESH_MS = 45000, TIMEOUT_MS = 8000, LMX_HORIZON_H = 48;
  var IST = 330 * 60000, MONS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  window._wlxGroups = [];
  var lastSig = null, slide = 0, autoTimer = null, bound = false;

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function escJs(s){ return String(s == null ? '' : s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }

  /* "4:30 PM IST" | "Live at 9 PM IST" | "Tomorrow 5 PM IST" | "Tue, Oct 6 5 PM IST" -> Date */
  function parseWhen(str){
    var s = String(str || '').trim(); if (!s) return null;
    var MR = '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?';
    var iso = s.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2})?)(Z|[+-]\d{2}:?\d{2})?$/i);
    if (iso){ var dd = new Date(iso[1] + 'T' + iso[2] + (iso[3] || '+05:30')); if (!isNaN(dd.getTime())) return dd; }
    var h, mi, m = s.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (m){ h = +m[1]; mi = +(m[2] || 0); var pm = /pm/i.test(m[3]); if (pm && h < 12) h += 12; if (!pm && h === 12) h = 0; }
    else { var m24 = s.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/); if (!m24) return null; h = +m24[1]; mi = +m24[2]; }
    var now = new Date(Date.now() + IST);
    var y = now.getUTCFullYear(), mo = now.getUTCMonth(), d = now.getUTCDate(), fixedYear = false;
    var i2 = s.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    var dm = s.match(new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+' + MR + '(?:,?\\s*(\\d{4}))?', 'i'));     /* 6 Oct 2026 */
    var md = s.match(new RegExp('\\b' + MR + '\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?:,?\\s*(\\d{4}))?', 'i'));   /* Oct 6, 2026 */
    var found = false;
    if (i2){ y = +i2[1]; mo = +i2[2] - 1; d = +i2[3]; fixedYear = true; found = true; }
    else if (dm){ d = +dm[1]; mo = MONS.indexOf(dm[2].toLowerCase()); if (dm[3]){ y = +dm[3]; fixedYear = true; } found = true; }
    else if (md){ mo = MONS.indexOf(md[1].toLowerCase()); d = +md[2]; if (md[3]){ y = +md[3]; fixedYear = true; } found = true; }
    if (found){
      var t = Date.UTC(y, mo, d, h, mi) - IST;
      if (!fixedYear && t < Date.now() - 200 * 864e5) t = Date.UTC(y + 1, mo, d, h, mi) - IST;   /* year rollover */
      return new Date(t);
    }
    if (/tomorrow/i.test(s)) d += 1;
    return new Date(Date.UTC(y, mo, d, h, mi) - IST);
  }
  function hasDate(e){
    if (['start_time','startTime','start','timestamp','datetime','date_time','start_ts'].some(function(k){ return e[k] != null && e[k] !== ''; })) return true;
    return /\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}\b|tomorrow/i.test(whenText(e));
  }
  function whenText(e){ return [e.date || e.match_date || e.start_date, e.time || e.match_time].filter(Boolean).join(' '); }
  function parseWhenEntry(e){
    var keys = ['start_time','startTime','start','timestamp','datetime','date_time','start_ts'];
    for (var i = 0; i < keys.length; i++){
      var v = e[keys[i]]; if (v == null || v === '') continue;
      if (typeof v === 'number' || /^\d{9,13}$/.test(String(v))){ var n = +v; if (n < 1e11) n *= 1000; var dd = new Date(n); if (!isNaN(dd.getTime())) return dd; }
      var w = parseWhen(v); if (w) return w;
    }
    return parseWhen(whenText(e));
  }
  function fmtTime(d){
    if (!d || isNaN(d.getTime())) return 'TBA';
    var dp = d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }).toUpperCase();
    var h = d.getHours(), mm = String(d.getMinutes()).padStart(2,'0'), ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return dp + ', ' + h + ':' + mm + ' ' + ap;
  }

  /* "World Championship of Legends 2026 - 3rd Match - A vs B" -> { title:"A vs B", tour:"World Championship ... - 3rd Match", teams:[A,B] } */
  function parseName(name){
    var segs = String(name || '').split(/\s+-\s*|\s*-\s+/).map(function(x){ return x.trim(); }).filter(Boolean);
    var vi = -1; segs.forEach(function(sg, i){ if (/\s(?:vs\.?|v)\s/i.test(sg)) vi = i; });
    if (vi < 0) return { title: String(name || 'Match').trim(), tour: '', teams: null };
    var title = segs[vi], tour = segs.filter(function(_, i){ return i !== vi; }).join(' - ');
    var t = title.replace(/\s+in\s+[A-Za-z ]+\d{4}$/i, '').split(/\s+(?:vs\.?|v)\s+/i).map(function(x){ return x.trim(); });
    /* Legends / masters league sides are NOT the national teams - keep them out of cross-merging */
    var lg = t.length === 2 && /champions|legends|masters|\bxi\b|academy|select/i.test(t.join(' '));   /* league sides: matched strictly, never by prefix */
    var teams = t.length === 2 ? t : null;
    return { title: title, tour: tour, teams: teams, lg: lg };
  }

  function isStream(u){
    u = String(u || '').trim();
    if (!/^https?:\/\//i.test(u)) return false;
    if (typeof window.sxIsStreamUrl === 'function') return window.sxIsStreamUrl(u);
    return /\.(m3u8|mpd)(\?|#|\/|$)/i.test(u);
  }
  function walk(o, out, depth){
    if (o == null || depth > 5) return out;
    if (typeof o === 'string'){ var u = o.trim(); if (isStream(u) && out.indexOf(u) < 0) out.push(u); return out; }
    if (Array.isArray(o)){ o.forEach(function(x){ walk(x, out, depth + 1); }); return out; }
    if (typeof o === 'object') Object.keys(o).forEach(function(k){ walk(o[k], out, depth + 1); });
    return out;
  }
  function streamsOf(e){
    var urls = (window.LMX && LMX.scan) ? LMX.scan(e) : [];
    if (!urls.length) urls = walk(e, [], 0);                    /* nested CnpTV block that LMX.scan skipped */
    return urls;
  }

  function build(json){
    var list = (json && (json.Matches || json.matches)) || [];
    var out = [], ended = []; window._wlxEnded = ended;
    list.forEach(function(e, idx){
      if (!e) return;
      var stl = String(e.status || '').trim().toLowerCase();
      var st = stl === 'live' ? 'LIVE' : /^(ended|completed|finished|over)$/.test(stl) ? 'ENDED' : 'UPCOMING';
      var p = parseName(e.event_name);
      var drm = !!(window.LMX && LMX.hasDrm && LMX.hasDrm(e, true));
      var urls = streamsOf(e);
      var servers = urls.map(function(u, i){
        return { url: u, text: urls.length > 1 ? 'Willow ' + (i + 1) : 'Willow', icon: LOGO, sub: 'Willow \u00b7 tap to play', playName: p.title, appOnly: drm };
      });
      var grp = ({ key: 'wlx' + idx, id: e.id || '', status: st, title: p.title, tour: p.tour, category: 'Cricket', blob: '',
        poster: e.image || '', servers: servers, teams: p.teams, lg: p.lg, dateKnown: hasDate(e), date: '', start: parseWhenEntry(e), timeText: whenText(e) });
      (st === 'ENDED' ? ended : out).push(grp);
    });
    return out;
  }

  /* direct first, then each CORS proxy */
  function getJson(){
    var attempts = [];
    APIS.forEach(function(a){ PROXIES.forEach(function(p){ attempts.push([a, p]); }); });
    var i = 0;
    function next(){
      if (i >= attempts.length) return Promise.reject(new Error('all Willow sources failed'));
      var a = attempts[i][0], p = attempts[i][1]; i++;
      var u = a + (a.indexOf('?') < 0 ? '?' : '&') + 't=' + Date.now();
      if (p) u = p + encodeURIComponent(u);
      var ac = window.AbortController ? new AbortController() : null;
      var tm = ac ? setTimeout(function(){ ac.abort(); }, TIMEOUT_MS) : 0;
      return fetch(u, ac ? { cache:'no-store', signal: ac.signal } : { cache:'no-store' })
        .then(function(r){ clearTimeout(tm); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function(j){ if (!j || !(j.Matches || j.matches)) throw new Error('bad payload'); return j; })
        .catch(function(err){ clearTimeout(tm); return next(); });
    }
    return next();
  }

  /* ---------- LMX bridge: groups visible to the unified layer ---------- */
  window.wlxForLmx = function(){
    return (window._wlxGroups || []).slice();        /* every Willow match, live / upcoming / any date in the future */
  };

  /* ---------- open a match in the shared server selector ---------- */
  window.wlxOpenWatch = function(key){
    var g = (window._wlxGroups || []).filter(function(x){ return x.key === key; })[0];
    if (!g || typeof openMatchWatchScreen !== 'function') return false;
    if (g.servers.length && window.LMX && LMX.items){            /* prefer the merged LMX entry: it carries servers from every other source too */
      var hit = LMX.items.filter(function(it){ return it.servers.some(function(s){ return s.url === g.servers[0].url; }); })[0];
      if (hit) return LMX.open(hit.key);
    }
    var live = g.status === 'LIVE', n = g.servers.length;
    openMatchWatchScreen(g.servers.map(function(s){ return { url:s.url, text:s.text, icon:s.icon, sub:s.sub, playName:s.playName, appOnly:!!s.appOnly }; }), {
      name: g.title, team1_code:'', team1_full_name:'', team1_icon_url:'', team2_code:'', team2_full_name:'', team2_icon_url:'',
      date_label: live ? n + (n === 1 ? ' server' : ' servers') + ' available' : fmtTime(g.start),
      details: g.tour || g.category, countdown: (!live && g.start) ? g.start.toISOString() : '',
      status: live ? 'live' : 'upcoming', banner: g.poster || ''
    });
    return false;
  };

  /* ---------- Willow OTT panel ---------- */
  function filtered(){
    var q = ((document.getElementById('wlxSearchInput') || {}).value || '').trim().toLowerCase();
    var l = (window._wlxGroups || []).slice().sort(function(a, b){
      var ra = a.status === 'LIVE' ? 0 : 1, rb = b.status === 'LIVE' ? 0 : 1;
      return ra - rb || ((a.start ? a.start.getTime() : 9e15) - (b.start ? b.start.getTime() : 9e15));
    });
    return q ? l.filter(function(g){ return (g.title + ' ' + g.tour).toLowerCase().indexOf(q) >= 0; }) : l;
  }
  var PH = "this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22300%22%3E%3Crect fill=%22%23111%22 width=%22800%22 height=%22300%22/%3E%3C/svg%3E'";
  function btn(g, cls){
    var live = g.status === 'LIVE';
    if (!g.servers.length) return '<button class="' + cls + (live ? '' : ' fcx-btn-upcoming') + '" disabled>' + (live ? 'NO STREAM YET' : '\u23f0 ' + esc(fmtTime(g.start))) + '</button>';
    return '<button class="' + cls + (live ? '' : ' fcx-btn-upcoming') + '" onclick="return wlxOpenWatch(\'' + escJs(g.key) + '\')">' + (live ? 'WATCH NOW' : '\u23f0 ' + esc(fmtTime(g.start))) + '</button>';
  }
  function render(){
    var track = document.getElementById('wlxTrack'), dots = document.getElementById('wlxDots'), grid = document.getElementById('wlxGrid');
    if (!track || !dots || !grid) return;
    var list = filtered();
    if (!list.length){
      grid.innerHTML = '<div class="fcx-empty-state">No matches found</div>';
      track.innerHTML = '<div class="fcx-carousel-slide fcx-loading-state"><p>No matches</p></div>'; dots.innerHTML = ''; return;
    }
    var hero = list.slice(0, 6);
    track.innerHTML = hero.map(function(g){
      return '<div class="fcx-carousel-slide"><img src="' + esc(g.poster) + '" alt="' + esc(g.title) + '" class="fcx-slide-bg" onerror="' + PH + '">' +
        '<div class="fcx-slide-content"><div class="fcx-slide-status">' + (g.status === 'LIVE' ? '\u25cf LIVE' : 'UPCOMING') + '</div>' +
        '<div class="fcx-slide-title">' + esc(g.title) + '</div><div class="fcx-slide-meta"><span>' + esc(g.tour) + '</span></div>' +
        '<div class="fcx-slide-time">' + esc(fmtTime(g.start)) + '</div><div class="fcx-slide-actions">' + btn(g, 'fcx-slide-btn') + '</div></div></div>';
    }).join('');
    dots.innerHTML = hero.map(function(_, i){ return '<div class="fcx-dot ' + (i === 0 ? 'fcx-active' : '') + '" data-i="' + i + '"></div>'; }).join('');
    slide = 0; upd();
    grid.innerHTML = list.map(function(g){
      var live = g.status === 'LIVE';
      return '<article class="fcx-card"><div class="fcx-thumb-wrap"><img src="' + esc(g.poster) + '" alt="' + esc(g.title) + '" loading="lazy" onerror="' + PH + '">' +
        (live ? '<span class="fcx-badge">\u25cf LIVE</span>' : '<span class="fcx-badge fcx-upcoming">UPCOMING</span>') + '</div>' +
        '<div class="fcx-meta"><div class="fcx-teams">' + esc(g.title) + '</div><div class="fcx-event">' + esc(g.tour) + '</div>' +
        '<div class="fcx-card-time">' + esc(fmtTime(g.start)) + '</div><div class="fcx-actions">' + btn(g, 'fcx-btn') + '</div></div></article>';
    }).join('');
  }
  function upd(){
    var t = document.getElementById('wlxTrack'); if (t) t.style.transform = 'translateX(' + (-slide * 100) + '%)';
    document.querySelectorAll('#wlxDots .fcx-dot').forEach(function(d, i){ d.classList.toggle('fcx-active', i === slide); });
  }
  function bind(){
    if (bound) return; bound = true;
    var si = document.getElementById('wlxSearchInput'); if (si) si.addEventListener('input', function(){ render(); renderSchedule(); });
    var dt = document.getElementById('wlxDots'); if (dt) dt.addEventListener('click', function(e){ var d = e.target.closest('.fcx-dot'); if (d){ slide = +d.dataset.i; upd(); } });
    function n(){ return document.querySelectorAll('#wlxDots .fcx-dot').length; }
    var pv = document.getElementById('wlxPrev'), nx = document.getElementById('wlxNext');
    if (pv) pv.addEventListener('click', function(){ if (n()){ slide = (slide - 1 + n()) % n(); upd(); } });
    if (nx) nx.addEventListener('click', function(){ if (n()){ slide = (slide + 1) % n(); upd(); } });
  }

  /* ---------- dated schedule: every Willow match, which player runs it, what it is linked to ---------- */
  window.wlxFmt = function(d){ return fmtTime(d); };
  function istParts(d){
    if (!d || isNaN(d.getTime())) return { date: 'TBA', time: '' };
    return { date: d.toLocaleDateString('en-IN', { timeZone:'Asia/Kolkata', weekday:'short', day:'2-digit', month:'short', year:'numeric' }),
             time: d.toLocaleTimeString('en-IN', { timeZone:'Asia/Kolkata', hour:'numeric', minute:'2-digit', hour12:true }).toUpperCase() + ' IST' };
  }
  function playerOf(g){
    if (!g.servers.length) return 'No stream yet';
    var s = g.servers[0];
    if (s.appOnly) return 'App only (DRM)';
    return 'SX 4K / EVORA StreamPulse (' + ((window.sxIsDashUrl && sxIsDashUrl(s.url)) ? 'dash.js' : 'hls.js') + ')';
  }
  function linkOf(g){
    if (g.status === 'ENDED') return '-';
    var L = window.LMX, hit = (L && L.items && g.servers.length) ? L.items.filter(function(it){ return it.servers.some(function(s){ return g.servers.some(function(x){ return x.url === s.url; }); }); })[0] : null;
    if (!hit) return g.servers.length ? 'Willow only' : '-';
    var tags = [];
    if (hit.sheet) tags.push('Sheet'); if (hit.fcx) tags.push('FanCode');
    if (hit.servers.some(function(s){ return /sonyliv/i.test(s.sub || ''); })) tags.push('SonyLIV');
    return tags.length ? tags.join(' + ') : 'Willow only';
  }
  function schedRows(){
    var q = ((document.getElementById('wlxSearchInput') || {}).value || '').trim().toLowerCase();
    var rank = { LIVE: 0, UPCOMING: 1, ENDED: 2 };
    var all = (window._wlxGroups || []).concat(window._wlxEnded || []).slice().sort(function(a, b){
      return rank[a.status] - rank[b.status] || (a.status === 'ENDED' ? -1 : 1) * ((a.start ? a.start.getTime() : 9e15) - (b.start ? b.start.getTime() : 9e15));
    });
    return q ? all.filter(function(g){ return (g.title + ' ' + g.tour).toLowerCase().indexOf(q) >= 0; }) : all;
  }
  function renderSchedule(){
    var el = document.getElementById('wlxSchedule'); if (!el) return;
    var rows = schedRows();
    if (!rows.length){ el.innerHTML = '<div class="fcx-empty-state">No Willow matches found</div>'; return; }
    el.innerHTML = '<table class="wlx-sch"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Match</th><th>Status</th><th>Player</th><th>Linked with</th><th></th></tr></thead><tbody>' +
      rows.map(function(g, i){
        var p = istParts(g.start), cls = g.status === 'LIVE' ? 'live' : g.status === 'UPCOMING' ? 'up' : '';
        var act = (g.servers.length && g.status !== 'ENDED') ? '<button onclick="return wlxOpenWatch(\'' + escJs(g.key) + '\')">' + (g.status === 'LIVE' ? 'Watch' : 'Open') + '</button>' : '';
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(p.date) + '</td><td>' + esc(p.time) + '</td><td><b>' + esc(g.title) + '</b><div style="opacity:.6;font-size:12px">' + esc(g.tour) + '</div></td>' +
          '<td><span class="wlx-st ' + cls + '">' + g.status + '</span></td><td>' + esc(playerOf(g)) + '</td><td>' + esc(linkOf(g)) + '</td><td>' + act + '</td></tr>';
      }).join('') + '</tbody></table>';
  }
  document.addEventListener('click', function(ev){
    if (!ev.target || ev.target.id !== 'wlxCopy') return;
    var txt = schedRows().map(function(g){ var p = istParts(g.start); return p.date + ' ' + p.time + ' | ' + g.title + (g.tour ? ' (' + g.tour + ')' : '') + ' | ' + g.status; }).join('\n');
    try { navigator.clipboard.writeText(txt); ev.target.textContent = 'Copied'; setTimeout(function(){ ev.target.textContent = 'Copy list'; }, 1500); } catch(_){}
  });

  /* ---------- homepage hero slides: live / next Willow matches (like FanCode's) ---------- */
  window.wlxAppendHeroSlides = function(){
    var container = document.getElementById('slides-container');
    if (!container || typeof totalSlides === 'undefined') return;
    container.querySelectorAll('.wlx-hero-slide').forEach(function(s){ s.remove(); });
    var L = window.LMX;
    /* slides the HERO SLIDES sheet already provides (everything except our own FanCode/Willow additions and the trailing channels banner) */
    var AL = { ind:'india', pak:'pakistan', eng:'england', aus:'australia', nz:'new zealand', sl:'sri lanka', sa:'south africa', wi:'west indies', ban:'bangladesh', afg:'afghanistan' };
    function nz(s){ s = String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); return AL[s] || s; }
    var all0 = Array.prototype.slice.call(container.querySelectorAll(':scope > .slide'));
    var sheetTitles = all0.filter(function(s, i){
      return !s.classList.contains('fcx-hero-slide') && !s.classList.contains('wlx-hero-slide') && i < all0.length - 1;
    }).map(function(s){
      var o = ''; try { o = decodeURIComponent(s.dataset.origTitle || ''); } catch(_){}
      var el = s.querySelector('.slide-title');
      return nz(o || (el ? el.textContent : ''));
    }).filter(Boolean);
    function sheetHasSlide(g){
      var gt = nz(g.title);
      return sheetTitles.some(function(st){
        if (g.teams && g.teams.length === 2) return st.indexOf(nz(g.teams[0])) >= 0 && st.indexOf(nz(g.teams[1])) >= 0;
        return gt && (st === gt || st.indexOf(gt) >= 0 || gt.indexOf(st) >= 0);
      });
    }
    var picks = (window._wlxGroups || []).filter(function(g){
      if (g.status === 'ENDED' || !g.servers.length) return false;
      if (sheetHasSlide(g)) return false;             /* the sheet's own banner wins - no duplicate Willow slide */
      var hit = (L && L.items) ? L.items.filter(function(it){ return it.servers.some(function(s){ return s.url === g.servers[0].url; }); })[0] : null;
      return !(hit && hit.fcx);                       /* already a FanCode hero slide: don't duplicate it */
    }).sort(function(a, b){
      var ra = a.status === 'LIVE' ? 0 : 1, rb = b.status === 'LIVE' ? 0 : 1;
      return ra - rb || ((a.start ? a.start.getTime() : 9e15) - (b.start ? b.start.getTime() : 9e15));
    }).slice(0, 3);
    var slides = container.querySelectorAll(':scope > .slide');
    var banner = slides.length ? slides[slides.length - 1] : null;
    var dotsWrap = container.querySelector('.slide-dots');
    picks.forEach(function(g){
      var live = g.status === 'LIVE', sl = document.createElement('div');
      sl.className = 'slide wlx-hero-slide'; sl.dataset.origTitle = '';
      sl.innerHTML = '<div class="slide-bg" style="background-image:url(\'' + esc(g.poster) + '\')"></div><div class="slide-overlay"></div>' +
        '<div class="slide-content"><div style="display:flex;gap:8px;align-items:center;margin-bottom:14px;"><span class="slide-sport-badge' + (live ? ' slide-badge-live' : '') + '">' + (live ? 'LIVE NOW' : '\u23f0 ' + esc(fmtTime(g.start))) + '</span></div>' +
        '<div class="slide-title">' + esc(g.title) + '</div><div class="slide-sub">Willow \u00b7 ' + esc(g.tour || 'Cricket') + '</div>' +
        '<div class="slide-btns"><a href="#" class="btn-slide-watch" onclick="event.preventDefault();return wlxOpenWatch(\'' + escJs(g.key) + '\')">' + (live ? 'Watch Now' : 'Details') + '</a></div></div>';
      if (banner) container.insertBefore(sl, banner); else if (dotsWrap) container.insertBefore(sl, dotsWrap); else container.appendChild(sl);
    });
    /* rebuild dots + count so every dot jumps to the right slide */
    var all = container.querySelectorAll(':scope > .slide');
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      all.forEach(function(_, i){ var d = document.createElement('div'); d.className = 'dot' + (i === currentSlide ? ' active' : ''); d.onclick = function(){ goSlide(i); startSlider(); }; dotsWrap.appendChild(d); });
    }
    totalSlides = all.length;
  };
  /* renderSlides() rebuilds the whole carousel (and wipes appended slides) - re-add Willow after every rebuild */
  (function(){
    var tries = 0, iv = setInterval(function(){
      if (typeof window.renderSlides === 'function' && !window.renderSlides.__wlx){
        var orig = window.renderSlides;
        window.renderSlides = function(){ var r = orig.apply(this, arguments); try { if (window.fcxAppendHeroSlides) window.fcxAppendHeroSlides(); } catch(_){} try { window.wlxAppendHeroSlides(); } catch(_){} return r; };
        window.renderSlides.__wlx = true; clearInterval(iv);
      } else if (++tries > 50) clearInterval(iv);
    }, 400);
  })();
  window.wlxInit = function(){
    bind(); render(); renderSchedule(); clearInterval(autoTimer);
    autoTimer = setInterval(function(){ var c = document.querySelectorAll('#wlxDots .fcx-dot').length; if (c > 1){ slide = (slide + 1) % c; upd(); } }, 8000);
  };
  window.wlxStop = function(){ clearInterval(autoTimer); autoTimer = null; };

  /* ---------- load + refresh ---------- */
  function load(){
    getJson().then(function(json){
      var groups = build(json); window._wlxLoaded = true;
      var sig = JSON.stringify(groups.map(function(g){ return [g.id, g.status, g.title, g.timeText, g.servers.map(function(s){ return s.url; })]; }));
      window._wlxGroups = groups;
      if (sig === lastSig) return;
      lastSig = sig;
      if (window._matchCardsRawRows && typeof renderMatchCards === 'function') renderMatchCards(window._matchCardsRawRows);   /* sheet re-render -> LMX.augment + render */
      else if (typeof window.slxAppendHomeSections === 'function') window.slxAppendHomeSections();                              /* = LMX.render */
      if (typeof window.fcxAppendFixturesPreview === 'function') { try { window.fcxAppendFixturesPreview(); } catch(_){} }
      try { if (window.LMX && LMX.applyBanners) LMX.applyBanners(); } catch(_){}
      try { window.wlxAppendHeroSlides(); } catch(_){}
      var ov = document.getElementById('willow-overlay'); if (ov && ov.classList.contains('open')){ render(); renderSchedule(); }
      var so = document.getElementById('sx-search-overlay'), si2 = document.getElementById('sx-search-input');   /* keep open search in sync */
      if (so && so.classList.contains('open') && typeof sxRunSearch === 'function') sxRunSearch(si2 ? si2.value : '');
    }).catch(function(err){
      window._wlxLoaded = true;
      console.error('WLX load error:', err);
      var grid = document.getElementById('wlxGrid');
      if (grid && !(window._wlxGroups || []).length) grid.innerHTML = '<div class="fcx-empty-state">Error loading Willow matches. Please refresh.</div>';
    });
  }
  load();
  setInterval(load, REFRESH_MS);
})();

;

/* Sheet + API feeds load first; Movies/TV catalogues wait for this signal. */
(function(){
  var t0 = Date.now(), iv = setInterval(function(){
    var sheet = window._matchCardsData && window._matchCardsData.length;
    if ((sheet && window._wlxLoaded) || Date.now() - t0 > 2000){
      clearInterval(iv); window.__sxFeedsReady = true;
      try { window.dispatchEvent(new Event('sx:feeds-ready')); } catch(e){}
    }
  }, 150);
})();

;

/* ══════════════════════════════════════════════════════════════════════
   LMX — UNIFIED LIVE-MATCH LAYER
   Sits over the Google-Sheet MATCH CARDS, FanCode (FCX) and SonyLIV (SLX)
   sources. SonyLIV entries are merged by fixture and its available servers
   are folded into matching sheet/FanCode fixtures where applicable.
   2. That list is matched against the Sheet rows and FanCode matches:
        - Sheet row  -> servers are folded into that row's server selector
          (no 5-slot limit) and the row is flagged LIVE if a feed says so.
        - FanCode    -> servers are added to FanCode's server selector.
        - otherwise  -> shown as its own card in the Matches tab, filed under
          its SPORT (Cricket / Football / ...), and the sport shows in the
          sport + event selectors.
   3. Homescreen "LIVE NOW" block lists EVERY live match from every source
      (never capped, not "today only"), one card per fixture.
   4. Stream scanner: any m3u8 / mpd / dash / hls link found anywhere in an
      API entry is picked up. DRM (kid/key/license) entries are skipped.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var ALIAS = { ind:'india', bra:'brazil', pak:'pakistan', eng:'england', aus:'australia', nz:'new zealand',
    sl:'sri lanka', sa:'south africa', wi:'west indies', ban:'bangladesh', afg:'afghanistan', jpn:'japan',
    qat:'qatar', tha:'thailand', chn:'china', kor:'south korea', irn:'iran', usa:'united states',
    rsa:'south africa', nzl:'new zealand', ned:'netherlands', ire:'ireland', zim:'zimbabwe', sco:'scotland', nep:'nepal', uae:'united arab emirates',
    oma:'oman', can:'canada', png:'papua new guinea', hk:'hong kong', esp:'spain', fra:'france', ger:'germany', por:'portugal', arg:'argentina',
    ita:'italy', bel:'belgium', cro:'croatia', mex:'mexico', uru:'uruguay', col:'colombia' };
  var CAT_SYN = { soccer:'football', 'association football':'football' };
  var items = [];

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function escJs(s){ return String(s == null ? '' : s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }
  function norm(t){ t = String(t||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim(); return ALIAS[t] || t; }
  function lev(a, b){
    var m = a.length, n = b.length, i, j, d = [];
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    return d[m][n];
  }
  function sameTeam(a, b){
    if (window.sxQual && sxQual(a) !== sxQual(b)) return false;   // India ≠ India Women ≠ India U19
    if (window.sxLeagueTag && sxLeagueTag(a) !== sxLeagueTag(b)) return false;   // West Indies ≠ West Indies Champions
    if (window.sxTeamVariant && sxTeamVariant(a, b)) return false;   // India != India A, Brazil != Brazil U20
    a = norm(a); b = norm(b);
    if (!a || !b) return false;
    if (a === b) return true;
    if (Math.min(a.length, b.length) >= 3 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)) return true;
    return 1 - lev(a, b) / Math.max(a.length, b.length) >= 0.78;
  }
  function LCAT(cat, title, blob){
    var d = window.sxDetectSport ? window.sxDetectSport(cat, [title], blob) : '';
    return d || cat || 'Other';
  }
  var LMX_DATE = new RegExp('\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?(?:,?\\s*\\d{2,4})?\\b|\\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s*\\d{2,4})?\\b|\\b\\d{4}-\\d{2}-\\d{2}\\b|\\b\\d{1,2}[\\/.-]\\d{1,2}[\\/.-]\\d{2,4}\\b', 'gi');
  function stripDates(s){ return String(s||'').replace(LMX_DATE, ' ').replace(/\s+/g, ' ').trim(); }
  function catKey(c){
    c = String(c||'').trim().toLowerCase();
    if (/^(sports?|live|other|events?)?$/.test(c)) return '';
    return CAT_SYN[c] || c;
  }

  /* ── Stream scanner (m3u8 / mpd / dash / hls, no DRM) ── */
  function isStream(u){
    u = String(u||'').trim();
    if (!/^https?:\/\//i.test(u)) return false;
    if (typeof window.sxIsStreamUrl === 'function') return window.sxIsStreamUrl(u);
    return /\.(m3u8|mpd)(\?|#|\/|$)/i.test(u);
  }
  var DRM_KEYS_ENTRY  = /^(kid|keyid|key_id|license|license_url|licenseurl|license_key|drm_license|drm_license_url|clearkey|clear_key|drm_key|widevine|playready)$/i;
  var DRM_KEYS_STREAM = /^(kid|key|keyid|key_id|license|license_url|licenseurl|license_key|drm_license|drm_license_url|clearkey|clear_key|drm_key|widevine|playready)$/i;
  function hasDrm(o, isEntry){
    if (!o || typeof o !== 'object') return false;
    var re = isEntry ? DRM_KEYS_ENTRY : DRM_KEYS_STREAM;
    for (var k in o){
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      var v = o[k];
      if (re.test(k) && v && typeof v !== 'object' && String(v).toLowerCase() !== 'false' && String(v) !== '0') return true;
      if (/^(drm|is_drm|isdrm|drm_protected)$/i.test(k) && (v === true || /^(true|yes|1)$/i.test(String(v)))) return true;
    }
    return false;
  }
  function scan(o, out, depth){
    out = out || []; depth = depth || 0;
    if (o == null || depth > 5) return out;
    if (typeof o === 'string'){ var u = o.trim(); if (isStream(u) && out.indexOf(u) < 0) out.push(u); return out; }
    if (Array.isArray(o)){ o.forEach(function(x){ scan(x, out, depth + 1); }); return out; }
    if (typeof o === 'object'){
      if (depth > 0 && hasDrm(o)) return out;
      Object.keys(o).forEach(function(k){ scan(o[k], out, depth + 1); });
    }
    if (depth === 0){   // HLS first, DASH after
      var h = out.filter(function(x){ return !(window.sxIsDashUrl && window.sxIsDashUrl(x)); });
      var d = out.filter(function(x){ return window.sxIsDashUrl && window.sxIsDashUrl(x); });
      return h.concat(d);
    }
    return out;
  }

  /* ── Build the SonyLIV list ── */
  function fmtTime(d){
    if (!d) return 'TBA';
    var dp = d.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}).toUpperCase();
    var h = d.getHours(), mm = String(d.getMinutes()).padStart(2,'0'), ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return dp + ', ' + h + ':' + mm + ' ' + ap;
  }
  function cloneServer(s){ return { url:s.url, text:s.text, icon:s.icon, sub:s.sub, playName:s.playName, appOnly:!!s.appOnly }; }
  function relabel(it){
    var seen = {};
    it.servers.forEach(function(s){
      var base = s._base || (s._base = s.text);
      seen[base] = (seen[base] || 0) + 1;
      s.text = seen[base] > 1 ? base + ' ' + seen[base] : base;
    });
  }
  function addServers(it, list){
    var have = {};
    it.servers.forEach(function(s){ have[s.url] = 1; });
    list.forEach(function(s){ if (have[s.url]) return; have[s.url] = 1; it.servers.push(cloneServer(s)); });
  }
  /* league / legends sides ("India Champions"): whole-name equality only - "India" must never merge with "India Champions" */
  function sn(s){
    var w = String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\b(team|cc)\b/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
    if (w[0] && ALIAS[w[0]]) w[0] = ALIAS[w[0]];
    return w.join(' ');
  }
  function strictTeam(a, b){ a = sn(a); b = sn(b); return !!a && a === b; }
  function strictInTitle(title, team){
    var tm = sn(team); if (!tm) return false;
    var parts = String(title || '').replace(/\[[^\]]*\]/g, ' ').split(/\s+(?:vs\.?|v\.?|versus)\s+/i);
    if (parts.length < 2) return false;
    return parts.some(function(p){ return (' ' + sn(p) + ' ').indexOf(' ' + tm + ' ') >= 0; });
  }
  function startNear(a, b, hrs){ return !(a && b) || Math.abs(a - b) <= hrs * 36e5; }

  /* LOOSE LINK: "SA Champions" == "South Africa Champions" == "South Africa" (words, not prefixes).
     Needs: every core word of each side present on the matching side of the other title, same women/U-age tag,
     and both sides league-style or both national (so "India" never merges with "India Champions"). */
  var NOISE = { champions:1, champion:1, legends:1, legend:1, masters:1, team:1, cc:1, xi:1, the:1, of:1, and:1 };
  function words(s){ return String(s || '').toLowerCase().replace(/\[[^\]]*\]/g, ' ').replace(/women'?s?|woman|ladies/g, ' w ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean); }
  function core(s){
    var w = words(s), q = [], c = [];
    w.forEach(function(x){ if (x === 'w' || /^u\d{2}$/.test(x)) q.push(x); else if (!NOISE[x]) c.push(x); });
    if (c.length === 1 && ALIAS[c[0]]) c = ALIAS[c[0]].split(' ');
    return { c: c, q: q.sort().join() };
  }
  function subset(a, b){ return a.length && a.every(function(x){ return b.indexOf(x) >= 0; }); }
  function sideLoose(team, part){
    var a = core(team), b = core(part), bw = b.c.concat(words(part).filter(function(x){ return NOISE[x]; }));
    if (a.q !== b.q) return false;
    return subset(a.c, bw);
  }
  function leagueText(s){ return /legends|masters|champions|\bwcl\b/i.test(String(s || '')); }
  function looseFcx(it, m){
    if (!it.teams) return false;
    if (leagueText(it.tour + ' ' + it.title + ' ' + it.teams.join(' ')) !== leagueText((m.title || '') + ' ' + (m.tournament || ''))) return false;
    var parts = String(m.title || '').split(/\s+(?:vs\.?|v\.?|versus)\s+/i);
    if (parts.length < 2) return false;
    var p0 = parts[0], p1 = parts[parts.length - 1];
    return (sideLoose(it.teams[0], p0) && sideLoose(it.teams[1], p1)) || (sideLoose(it.teams[0], p1) && sideLoose(it.teams[1], p0));
  }
  function looseRow(it, c){
    var s1 = [c.team1_full_name, c.team1_code], s2 = [c.team2_full_name, c.team2_code];
    function eqc(team, arr){ var a = core(team); return arr.some(function(x){ if (!x) return false; var b = core(x); return a.q === b.q && a.c.length && a.c.join(' ') === b.c.join(' '); }); }
    var ok = (eqc(it.teams[0], s1) && eqc(it.teams[1], s2)) || (eqc(it.teams[0], s2) && eqc(it.teams[1], s1));
    if (!ok) return false;
    return leagueText(it.tour + ' ' + it.title + ' ' + it.teams.join(' ')) === leagueText([c.game, c.details, c.team1_full_name, c.team2_full_name].join(' '));
  }
  function fcxLinked(it, m){
    if (!it.teams) return false;
    var ok = (it.lg ? (strictInTitle(m.title, it.teams[0]) && strictInTitle(m.title, it.teams[1])) : (titleHas(m.title, it.teams[0]) && titleHas(m.title, it.teams[1]))) || looseFcx(it, m);
    if (!ok) return false;
    return !(it.status !== 'LIVE' && it.start && m.time instanceof Date && !isNaN(m.time.getTime()) && !startNear(it.start.getTime(), m.time.getTime(), 40));
  }
  function swapDom(oldU, newU){
    if (!oldU || !newU || oldU === newU) return;
    try {
      document.querySelectorAll('img').forEach(function(im){ if (im.getAttribute('src') === oldU) im.setAttribute('src', newU); });
      document.querySelectorAll('[style*="background-image"]').forEach(function(el){ var s = el.getAttribute('style') || ''; if (s.indexOf(oldU) >= 0) el.setAttribute('style', s.split(oldU).join(newU)); });
    } catch(e){}
  }
  /* WILLOW BANNER PRIORITY: when a match exists on Willow too, Willow's poster replaces FanCode's (sheet's own banner_url column still wins on sheet cards) */
  function applyBanners(){
    fresh();
    var fx = window._fcxMatchesCache || [], cards = window._matchCardsData || [];
    items.forEach(function(it){
      if (!it.wposter) return;
      fx.forEach(function(m){
        if (!m || m.image === it.wposter || !fcxLinked(it, m)) return;
        var old = m.image; if (m._img0 == null) m._img0 = old; m.image = it.wposter;
        cards.forEach(function(c){ if (c._fcxBanner && c._fcxBanner === old) c._fcxBanner = it.wposter; });
        swapDom(old, it.wposter);
      });
      classify(it);
      if (it.sheet && it.sheet._fcxBanner !== it.wposter){ var o2 = it.sheet._fcxBanner; it.sheet._fcxBanner = it.wposter; swapDom(o2, it.wposter); }
    });
  }
  var builtW = null, builtS = null;
  function fresh(){ if (builtW !== window._wlxGroups || builtS !== window._slxGroups){ build(); } }
  function titleKey(t){
    return norm(stripDates(String(t || '').replace(/\[[^\]]*\]/g, ' ').replace(/^\s*(live|upcoming|completed)\s*[-:\u2013\u2014]\s*/i, '')));
  }
  function sameFixture(a, b){
    if ((a.status === 'ENDED') !== (b.status === 'ENDED')) return false;   // a finished fixture never merges into a live/upcoming one
    if (a.status !== 'LIVE' && b.status !== 'LIVE' && a.start && b.start && Math.abs(a.start - b.start) > 18 * 36e5) return false;   // same two teams, different day = different match
    var ca = catKey(a.category), cb = catKey(b.category);
    if (ca && cb && ca !== cb) return false;
    if (a.teams && b.teams && a.lg !== b.lg && (a.lg || b.lg)){        /* strict league side vs a loose one: both must be strict-equal */
      return (strictTeam(a.teams[0], b.teams[0]) && strictTeam(a.teams[1], b.teams[1])) || (strictTeam(a.teams[0], b.teams[1]) && strictTeam(a.teams[1], b.teams[0]));
    }
    if (a.teams && b.teams && (a.lg || b.lg) && a.teams.length === 2 && b.teams.length === 2)
      return (strictTeam(a.teams[0], b.teams[0]) && strictTeam(a.teams[1], b.teams[1])) || (strictTeam(a.teams[0], b.teams[1]) && strictTeam(a.teams[1], b.teams[0]));
    if (a.teams && b.teams && a.teams.length === 2 && b.teams.length === 2)
      return (sameTeam(a.teams[0], b.teams[0]) && sameTeam(a.teams[1], b.teams[1])) ||
             (sameTeam(a.teams[0], b.teams[1]) && sameTeam(a.teams[1], b.teams[0]));
    if (a.teams && b.teams) return false;
    var ta = titleKey(a.title), tb = titleKey(b.title);   // "Day 10 - 29 Sep 2026" == "Day 10"
    if (!ta || !tb) return false;
    if (ta === tb) return true;
    /* "1st Unofficial Test - Day 3" == "1st Unofficial Test - Day 3 | India A Tour of New Zealand": one is the other plus the series name */
    var sh = ta.length <= tb.length ? ta : tb, lo = ta.length <= tb.length ? tb : ta;
    return sh.length >= 10 && (lo.indexOf(sh + ' ') === 0) && /\d|day|match|round|game|innings|session/.test(sh);
  }
  function build(){
    var raw = [];
    (window._slxGroups || []).forEach(function(g){
      raw.push({ src:'slx', gk:g.key, title:g.title, teams:(g.teams && g.teams.length === 2) ? g.teams : null, names:null,
        category:LCAT(g.category, g.title, g.blob), status:g.status || 'LIVE', start:g.start || null, tour:g.tour || '', poster:g.poster || '',
        t1:(g.teams && g.teams.length === 2 && window.sxFlagUrl) ? sxFlagUrl(g.teams[0]) : '', t2:(g.teams && g.teams.length === 2 && window.sxFlagUrl) ? sxFlagUrl(g.teams[1]) : '', servers:g.servers.map(cloneServer) });
    });
    (typeof window.wlxForLmx === 'function' ? window.wlxForLmx() : []).forEach(function(g){   // Willow OTT feed (WLX bridge)
      raw.push({ src:'wlx', gk:g.key, lg:!!g.lg, title:g.title, teams:(g.teams && g.teams.length === 2) ? g.teams : null, names:null,
        category:LCAT(g.category, g.title, g.blob), status:g.status || 'UPCOMING', start:(g.dateKnown || g.status === 'LIVE') ? (g.start || null) : null, tour:g.tour || '', poster:g.poster || '', wposter:g.poster || '',
        t1:'', t2:'', servers:g.servers.map(cloneServer) });
    });
    var out = [];
    raw = raw.filter(function(it){ return it.status !== 'ENDED'; });   // never list finished matches
    raw.forEach(function(it){
      var hit = out.filter(function(x){ return sameFixture(x, it); })[0];
      if (!hit){ out.push(it); return; }
      addServers(hit, it.servers);
      hit.lg = hit.lg || it.lg;
      if (it.wposter && !hit.wposter) hit.wposter = it.wposter;
      if (it.status === 'LIVE') hit.status = 'LIVE';
      else if (hit.status === 'ENDED' && it.status !== 'ENDED') hit.status = it.status;
      if (!hit.poster && it.poster) hit.poster = it.poster;
      if (!hit.start && it.start) hit.start = it.start;
      if (!hit.names && it.names) hit.names = it.names;
      var swp = hit.teams && it.teams && !(sameTeam(hit.teams[0], it.teams[0]) && sameTeam(hit.teams[1], it.teams[1]));
      var n1 = swp ? it.t2 : it.t1, n2 = swp ? it.t1 : it.t2;
      if (!hit.t1) hit.t1 = n1;
      if (!hit.t2) hit.t2 = n2;
      if (!hit.names && it.names) hit.names = swp ? [it.names[1], it.names[0]] : it.names;
    });
    out.forEach(function(it, i){ it.key = 'lmx' + i; relabel(it); if (it.wposter) it.poster = it.wposter; });   /* Willow banner beats SonyLIV's too */
    items = out; builtW = window._wlxGroups; builtS = window._slxGroups;
    return out;
  }

  /* ── Match a merged item to a Sheet row / FanCode match (fresh each call) ── */
  function eqAny(team, arr){ return arr.some(function(x){ return x && sameTeam(team, x); }); }
  function rowHas(c, a, b){
    var s1 = [c.team1_full_name, c.team1_code], s2 = [c.team2_full_name, c.team2_code];
    return (eqAny(a, s1) && eqAny(b, s2)) || (eqAny(a, s2) && eqAny(b, s1));
  }
  function titleHas(title, team){
    var t = String(title || '');
    var parts = t.replace(/\[[^\]]*\]/g,' ').split(/\s+(?:vs\.?|v\.?|versus)\s+/i);
    if (parts.length >= 2 && parts.some(function(p){ return sameTeam(p.split(/[,|\-–—(]/)[0], team); })) return true;
    return (typeof fcxTitleHasTeam === 'function') ? fcxTitleHasTeam(t, team, team) : false;
  }
  /* does sheet row c describe the same fixture as feed item it? (single rule shared by every source) */
  function rowMatches(it, c){
    if (!it || !it.teams || it.status === 'ENDED') return false;
    var lg = !!it.lg, live = it.status === 'LIVE', st = it.start ? it.start.getTime() : 0;
    if (typeof isMatchFinished === 'function' && isMatchFinished(c)) return false;
    var s1 = [c.team1_full_name, c.team1_code], s2 = [c.team2_full_name, c.team2_code];
    function ea(team, arr){ return arr.some(function(x){ return x && strictTeam(team, x); }); }
    var strict = (ea(it.teams[0], s1) && ea(it.teams[1], s2)) || (ea(it.teams[0], s2) && ea(it.teams[1], s1));
    if (!((lg ? strict : rowHas(c, it.teams[0], it.teams[1])) || looseRow(it, c))) return false;
    if (!live && st){ var cs = new Date(String(c.countdown_to_iso_datetime || c.countdown_to || '').trim()).getTime(); if (!isNaN(cs) && !startNear(st, cs, 40)) return false; }
    return true;
  }
  /* FanCode match -> pseudo feed item (teams split out of "A vs B") */
  function fcxPseudo(m){
    var t = String((m && m.title) || '').replace(/\[[^\]]*\]/g, ' ');
    var p = t.split(/\s+(?:vs\.?|v\.?|versus)\s+/i);
    if (p.length < 2) return null;
    var a = p[0].trim(), b = p[p.length - 1].split(/\s+[-|\u2022\u2013\u2014(,]\s*/)[0].trim();
    if (!a || !b) return null;
    return { teams: [a, b], lg: leagueText((m.tournament || '') + ' ' + t), tour: m.tournament || '', title: m.title || '',
             status: m.status === 'COMPLETED' ? 'ENDED' : (m.status || 'UPCOMING'),
             start: (m.time instanceof Date && !isNaN(m.time.getTime())) ? m.time : null };
  }
  function classify(it, cards){
    it.sheet = null; it.fcx = null;
    if (!it.teams || it.status === 'ENDED') return it;      // finished feed matches always get their own card
    cards = cards || window._matchCardsData || [];
    var lg = !!it.lg, live = it.status === 'LIVE', st = it.start ? it.start.getTime() : 0;
    it.sheet = cards.filter(function(c){ return rowMatches(it, c); })[0] || null;
    if (!it.sheet) it.fcx = (window._fcxMatchesCache || []).filter(function(m){
      if (m.status === 'COMPLETED') return false;
      if (!((lg ? (strictInTitle(m.title, it.teams[0]) && strictInTitle(m.title, it.teams[1])) : (titleHas(m.title, it.teams[0]) && titleHas(m.title, it.teams[1]))) || looseFcx(it, m))) return false;
      if (!live && st && m.time instanceof Date && !isNaN(m.time.getTime()) && !startNear(st, m.time.getTime(), 40)) return false;
      return true;
    })[0] || null;
    return it;
  }
  function extras(){
    return items.filter(function(it){ classify(it); return !it.sheet && !it.fcx; });
  }

  /* every server of every source for one fixture: Sheet (+its FanCode) -> FanCode -> SonyLIV -> Willow, de-duplicated by URL */
  function everyServer(it){
    fresh(); classify(it);
    var out = [], seen = {};
    function add(s){ if (!s || !s.url) return; var u = String(s.url).trim(); if (!u || u === '#' || seen[u]) return; seen[u] = 1; out.push(s); }
    if (it.sheet){ try { (sxGetMatchServers(it.sheet) || []).forEach(add); } catch(e){} }
    else if (it.fcx && typeof fcxJsUrl === 'function'){
      add({ url: fcxJsUrl(it.fcx), text: 'FanCode', fcxLive: it.fcx.status === 'LIVE', fcxTime: (typeof fcxFmtMatchTime === 'function') ? fcxFmtMatchTime(it.fcx) : '' });
    }
    it.servers.forEach(function(s){ add(cloneServer(s)); });
    return out;
  }

  /* ── Public API ── */
  var LMX = window.LMX = {
    everyServer: everyServer,
    applyBanners: applyBanners,
    /* the merged item (Sony+Willow) a feed group belongs to */
    itemFor: function(g){
      fresh();
      if (!g || !g.servers || !g.servers.length) return null;
      return items.filter(function(it){ return it.servers.some(function(s){ return s.url === g.servers[0].url; }); })[0] || null;
    },
    /* true when a Sony / Willow group is already shown elsewhere (sheet card, FanCode card, or its merged twin) */
    hideGroup: function(g){
      var it = LMX.itemFor(g); if (!it) return false;
      classify(it);
      if (it.sheet || it.fcx) return true;
      return !!(it.gk && g.key && it.gk !== g.key);
    },
    /* sheet row for a FanCode match, same rule as the unified linker */
    fcxSheetRow: function(m){
      var it = fcxPseudo(m); if (!it) return null;
      var cards = window._matchCardsData || [];
      return cards.filter(function(c){ return rowMatches(it, c); })[0] || null;
    },
    rowLinksFcx: function(c, m){
      var it = fcxPseudo(m); return !!it && rowMatches(it, c);
    },
    debug: function(){
      fresh();
      var fx = window._fcxMatchesCache || [], rows = (window._wlxGroups || []).map(function(g){
        var it = items.filter(function(x){ return x.servers.some(function(s){ return g.servers[0] && s.url === g.servers[0].url; }); })[0] || null;
        if (it) classify(it);
        var cand = fx.filter(function(m){ return /cricket/i.test(m.category || '') || /legends|champions|cricket/i.test((m.tournament || '') + (m.title || '')); }).map(function(m){ return m.title; }).slice(0, 6);
        return { willow: g.title, tour: g.tour, teams: g.teams ? g.teams.join(' | ') : '(none)', strictLeague: !!g.lg, status: g.status, streams: g.servers.length,
                 linkedSheet: it && it.sheet ? 'yes' : 'no', linkedFanCode: it && it.fcx ? it.fcx.title : 'no', fanCodeCricketTitles: it && !it.fcx ? cand.join(' ;; ') : '' };
      });
      if (console.table) console.table(rows); return rows;
    },
    scan: scan, hasDrm: hasDrm,
    get items(){ return items; },

    // Called by renderMatchCards — folds SonyLIV servers into matching Sheet rows.
    augment: function(cards){
      build();
      cards = cards || [];
      cards.forEach(function(c){ c._lmxServers = []; c._lmxLive = false; });
      items.forEach(function(it){
        classify(it, cards);
        if (!it.sheet) return;
        it.servers.forEach(function(s){ if (!it.sheet._lmxServers.some(function(x){ return x.url === s.url; })) it.sheet._lmxServers.push(cloneServer(s)); });
        if ((it.t1 || it.t2) && it.teams){
          var c = it.sheet, dir = eqAny(it.teams[0], [c.team1_full_name, c.team1_code]) || eqAny(it.teams[1], [c.team2_full_name, c.team2_code]);
          if (!(c.team1_icon_url || '').trim()) c.team1_icon_url = dir ? it.t1 : it.t2;
          if (!(c.team2_icon_url || '').trim()) c.team2_icon_url = dir ? it.t2 : it.t1;
        }
        if (it.status === 'LIVE') it.sheet._lmxLive = true;
      });
      if (typeof fcxFindSheetMatch === 'function') cards.forEach(function(c){
        var fm = fcxFindSheetMatch(c);
        if (fm && fm.status === 'LIVE') c._lmxLive = true;     // FanCode says live -> sheet row is live too
      });
    },

    // Extra servers for a FanCode match's selector.
    serversForFcx: function(m){
      var out = []; fresh();
      items.forEach(function(it){
        if (!it.teams) return;
        var ok = (it.lg ? (strictInTitle(m.title, it.teams[0]) && strictInTitle(m.title, it.teams[1])) : (titleHas(m.title, it.teams[0]) && titleHas(m.title, it.teams[1]))) || looseFcx(it, m);
        if (!ok) return;
        if (it.status !== 'LIVE' && it.start && m.time instanceof Date && !isNaN(m.time.getTime()) && !startNear(it.start.getTime(), m.time.getTime(), 40)) return;
        it.servers.forEach(function(s){ if (!out.some(function(x){ return x.url === s.url; })) out.push(cloneServer(s)); });
      });
      return out;
    },

    // Sports + events of standalone matches join the sport / event selectors.
    foldSports: function(sportOrder, gameOrder, g2s){
      g2s = g2s || {};
      extras().forEach(function(it){
        var cat = it.category || 'Other';
        var sport = (typeof fcxResolveSport === 'function') ? fcxResolveSport(cat) : cat;
        var k = catKey(cat);   // "Soccer" files under an existing "Football" sport
        var syn = k ? sportOrder.filter(function(x){ return catKey(x) === k; })[0] : '';
        if (syn) sport = syn;
        if (sportOrder.indexOf(sport) < 0) sportOrder.push(sport);
        var have = exactGame(gameOrder, cat);
        if (!have){ gameOrder.push(cat); g2s[cat] = sport; }
      });
    },

    open: function(key){
      var it = items.filter(function(x){ return x.key === key; })[0];
      if (!it || typeof openMatchWatchScreen !== 'function') return false;
      var live = it.status === 'LIVE', all = everyServer(it), n = all.length, sh = it.sheet || {};
      openMatchWatchScreen(all, {
        name: it.title,
        team1_code: sh.team1_code || '', team1_full_name: sh.team1_full_name || (it.names ? it.names[0] : ''), team1_icon_url: sh.team1_icon_url || it.t1 || '',
        team2_code: sh.team2_code || '', team2_full_name: sh.team2_full_name || (it.names ? it.names[1] : ''), team2_icon_url: sh.team2_icon_url || it.t2 || '',
        date_label: live ? (n + (n === 1 ? ' server' : ' servers') + ' available') : fmtTime(it.start),
        details: it.category || '',
        countdown: (!live && it.start) ? it.start.toISOString() : '',
        status: live ? 'live' : (it.status === 'ENDED' ? 'finished' : 'upcoming'),
        banner: it.poster || ''
      });
      return false;
    },

    renderSections: renderSections,
    renderHome: renderHome,
    render: function(){ renderSections(); renderHome(); }
  };
  window.lmxOpenWatch = LMX.open;
  window.lmxDebug = LMX.debug;

  function normGame(x){ return (typeof smoNormGameName === 'function') ? smoNormGameName(x) : String(x||'').toLowerCase().replace(/[^a-z0-9]/g,''); }
  function exactGame(list, name){
    var n = normGame(name); if (!n) return '';
    for (var i = 0; i < list.length; i++) if (normGame(list[i]) === n) return list[i];
    return '';
  }

  /* ── Matches tab: standalone matches, filed under their SPORT ── */
  function thumbHtml(it){
    var i1 = (it.t1 || '').trim(), i2 = (it.t2 || '').trim();
    if (i1 || i2)
      return '<div class="fx2-thumb-teams"><div class="fx2-thumb-team"><img loading=lazy decoding=async src="' + esc(i1) + '" alt="' + esc((it.names && it.names[0]) || '') + '" onerror="this.style.display=\'none\'"></div><div class="fx2-thumb-vs">VS</div><div class="fx2-thumb-team"><img loading=lazy decoding=async src="' + esc(i2) + '" alt="' + esc((it.names && it.names[1]) || '') + '" onerror="this.style.display=\'none\'"></div></div>';
    return it.poster ? '<img loading=lazy decoding=async src="' + esc(it.poster) + '" alt="' + esc(it.title) + '" class="fx2-thumb-img" onerror="this.style.display=\'none\'">' : '';
  }
  function cardHtml(it, timers){
    var live = it.status === 'LIVE', ended = it.status === 'ENDED', uid = it.key, badgeId = 'smo-badge-' + uid;
    var liveBadge = '<span class="fx2-badge fx2-badge-live" id="' + badgeId + '"><span class="fx2-live-dot"></span>LIVE</span>';
    var badge = live ? liveBadge : ended ? '<span class="fx2-badge" id="' + badgeId + '">FINISHED</span>' : '<span class="fx2-badge" id="' + badgeId + '">⏰ UPCOMING</span>';
    var countdown = (!live && !ended && it.start) ? it.start.toISOString() : '';
    var timerId = 'smo-timer-' + uid, wrapId = 'smo-timerwrap-' + uid;
    var timer = '<div class="smo-timer" id="' + wrapId + '" style="visibility:' + (countdown ? 'visible' : 'hidden') + '"><div class="timer-label">STARTS IN</div><div class="timer-display" id="' + timerId + '">--:--:--</div></div>';
    var thumb = thumbHtml(it);
    if (countdown) timers.push({ timerDisplayId:timerId, timerWrapId:wrapId, badgeId:badgeId, liveBadgeHtml:liveBadge, target:countdown });
    var n = it.servers.length;
    return '<div class="smo-card fx2-card lmx-smo-card" data-live="' + (live?1:0) + '" data-finished="' + (ended?1:0) + '" data-start-ms="' + (it.start ? it.start.getTime() : (live ? 0 : 8640000000000000)) + '">' +
      '<div class="fx2-thumb">' + thumb + badge + '</div>' +
      '<div class="fx2-body">' +
        '<div class="fx2-title-row"><div class="fx2-title">' + esc(it.title) + '</div><span class="fx2-free">FREE</span></div>' +
        '<div class="fx2-meta"><span class="fx2-tag">' + esc(it.category || 'Other') + '</span><span class="fx2-date">' + (ended ? 'Match over' : live ? n + (n === 1 ? ' server' : ' servers') : fmtTime(it.start)) + '</span></div>' +
        timer +
        (ended ? '<span class="smo-btn" style="opacity:.5;pointer-events:none;">MATCH OVER</span>'
          : !n ? '<span class="smo-btn" style="opacity:.6;pointer-events:none;">' + (live ? 'NO STREAM YET' : '⏰ ' + (it.start ? fmtTime(it.start) : 'NO STREAM YET')) + '</span>'
          : '<a class="smo-btn" href="javascript:void(0)" onclick="event.stopPropagation();return lmxOpenWatch(\'' + escJs(it.key) + '\')">' + (live ? '▶ Watch Now' : '⏰ ' + fmtTime(it.start)) + '</a>') +
      '</div></div>';
  }

  function renderSections(){
    var el = document.getElementById('match-overlay');
    if (!el) return;
    build();
    var ex = extras();
    var sig = ex.map(function(it){ return it.key + '|' + it.status + '|' + it.servers.length + '|' + (it.start ? it.start.getTime() : 0); }).join(';');
    var have = el.querySelectorAll('.lmx-smo-card').length;
    if (el.dataset.lmxSig === sig && have === ex.length) return;   // nothing changed: leave the DOM (and scroll position) alone
    el.dataset.lmxSig = sig;
    el.querySelectorAll('.lmx-smo-section').forEach(function(x){ x.remove(); });
    el.querySelectorAll('.lmx-smo-card').forEach(function(x){ x.remove(); });
    var byCat = {}, order = [];
    ex.forEach(function(it){ var c = it.category || 'Other'; if (!byCat[c]){ byCat[c] = []; order.push(c); } byCat[c].push(it); });
    var timers = [], g2s = window._smoGameToSport || {};
    order.forEach(function(cat){
      var html = byCat[cat].map(function(it){ return cardHtml(it, timers); }).join('');
      var secs = Array.prototype.slice.call(el.querySelectorAll(':scope > .smo-section'));
      var existingName = exactGame(secs.map(function(x){ return x.dataset.game || ''; }), cat);
      var existing = existingName ? secs.filter(function(x){ return x.dataset.game === existingName; })[0] : null;
      if (existing){
        existing.insertAdjacentHTML('beforeend', html);
        if (typeof sxReorderSectionLiveFirst === 'function') sxReorderSectionLiveFirst(existing);
      } else {
        el.insertAdjacentHTML('beforeend', '<div class="smo-section lmx-smo-section"><div class="smo-section-label">' + esc(cat) + '</div>' + html + '</div>');
        var all = el.querySelectorAll('.lmx-smo-section'), sec = all[all.length - 1];
        if (sec){
          sec.dataset.game = cat;
          sec.dataset.sport = g2s[cat] || ((typeof fcxResolveSport === 'function') ? fcxResolveSport(cat) : cat);
        }
      }
    });
    if (typeof sxReorderAllSectionsLiveThenTime === 'function') sxReorderAllSectionsLiveThenTime(el);
    timers.forEach(function(t){ setTimeout(function(){ if (typeof wireAutoLiveCountdown === 'function') wireAutoLiveCountdown(t.target, t); }, 100); });
    if (typeof smoApplyFilter === 'function') smoApplyFilter();
  }

  /* ── Homescreen: LIVE NOW — every live match from every source ── */
  function homeLive(){
    var list = [];
    // Sheet rows (with FanCode / SonyLIV / API servers already folded in)
    (window._matchCardsData || []).forEach(function(c){
      if (typeof matchStatusText !== 'function' || matchStatusText(c).toLowerCase() !== 'live') return;
      var name = (c.team1_full_name || c.team1_code || '') + ' vs ' + (c.team2_full_name || c.team2_code || '');
      var label = (c.team1_code || '') + ' vs ' + (c.team2_code || '');
      var sd = (typeof sxMatchStartDate === 'function') ? sxMatchStartDate(c) : null;
      var n = (typeof sxGetMatchServers === 'function') ? sxGetMatchServers(c).length : 0;
      var banner = c.banner_url || c.banner_image_url || c._fcxBanner || '';
      var thumb = banner
        ? '<img loading=lazy decoding=async src="' + esc(banner) + '" alt="" class="fx2-thumb-img" onerror="this.style.display=\'none\'">'
        : '<div class="fx2-thumb-teams"><div class="fx2-thumb-team"><img loading=lazy decoding=async src="' + esc(c.team1_icon_url||'') + '" alt="" onerror="this.style.display=\'none\'"></div><div class="fx2-thumb-vs">VS</div><div class="fx2-thumb-team"><img loading=lazy decoding=async src="' + esc(c.team2_icon_url||'') + '" alt="" onerror="this.style.display=\'none\'"></div></div>';
      list.push({ t: sd ? sd.getTime() : Infinity, name: name, tag: c.game || 'Live Sports', n: n, thumb: thumb,
        click: 'return sxHandleMatchWatch(event,\'' + sxServersEnc(c) + '\',\'' + escJs(c.btn_url) + '\',\'' + escJs(label) + '\',\'' + sxMatchInfoEnc(c, label) + '\')' });
    });
    // FanCode live matches not already a Sheet card
    (window._fcxMatchesCache || []).forEach(function(m){
      if (m.status !== 'LIVE') return;
      if (typeof fcxHasSheetCard === 'function' && fcxHasSheetCard(m)) return;
      var n = 1 + LMX.serversForFcx(m).length;
      list.push({ t: (typeof fcxStartMs === 'function') ? fcxStartMs(m) : Infinity, name: m.title || 'Live', tag: m.tournament || m.category || 'FanCode', n: n,
        thumb: '<img loading=lazy decoding=async src="' + esc(m.image || '') + '" alt="" class="fx2-thumb-img" onerror="this.style.display=\'none\'">',
        click: 'return fcxOpenWatchById(\'' + escJs(String(m.id)) + '\')' });
    });
    // SonyLIV / API-feed matches with no Sheet / FanCode twin
    extras().forEach(function(it){
      if (it.status !== 'LIVE') return;
      var thumb = thumbHtml(it);
      list.push({ t: it.start ? it.start.getTime() : Infinity, name: it.title, tag: it.category || 'Live Sports', n: it.servers.length, thumb: thumb,
        click: 'return lmxOpenWatch(\'' + escJs(it.key) + '\')' });
    });
    list.sort(function(a, b){ return a.t - b.t; });
    return list;
  }

  function renderHome(){
    var grid = document.getElementById('fixtures-grid');
    if (!grid || !grid.parentNode) return;
    var box = document.getElementById('lmx-live-box');
    var list = homeLive();
    if (!list.length){
      if (box) box.remove();
      grid.querySelectorAll('.fx2-card[data-live="1"]').forEach(function(c){ c.style.removeProperty('display'); });
      return;
    }
    if (!box){ box = document.createElement('div'); box.id = 'lmx-live-box'; grid.parentNode.insertBefore(box, grid); }
    box.innerHTML = '<div class="lmx-live-head"><span class="lmx-live-bar"></span>Live Now<span class="lmx-live-count">' + list.length + '</span></div>' +
      '<div class="lmx-live-grid">' + list.map(function(x){
        return '<a class="fx2-card" data-live="1" href="javascript:void(0)" onclick="' + x.click + '">' +
          '<div class="fx2-thumb">' + x.thumb + '<span class="fx2-badge fx2-badge-live"><span class="fx2-live-dot"></span>LIVE</span></div>' +
          '<div class="fx2-body"><div class="fx2-title-row"><div class="fx2-title">' + esc(x.name) + '</div><span class="fx2-free">FREE</span></div>' +
          '<div class="fx2-meta"><span class="fx2-tag">' + esc(x.tag) + '</span><span class="fx2-date">' + x.n + (x.n === 1 ? ' server' : ' servers') + '</span></div></div></a>';
      }).join('') + '</div>';
    // The live cards already shown above must not repeat in the preview grid below.
    grid.querySelectorAll('.fx2-card[data-live="1"]').forEach(function(c){ c.style.setProperty('display', 'none', 'important'); });
  }

  /* ── Take over the old per-source renderers ── */
  window.slxAppendHomeSections = function(){ LMX.render(); };   // end of renderMatchCards / SLX refresh

  // FanCode refresh (30s) rebuilds its own sections / preview: re-run ours afterwards so nothing doubles up.
  var _fcxSec = window.fcxAppendHomeSections;
  if (typeof _fcxSec === 'function') window.fcxAppendHomeSections = function(){ var r = _fcxSec.apply(this, arguments); try { renderSections(); } catch(e){ console.error('LMX', e); } return r; };
  var _fcxPrev = window.fcxAppendFixturesPreview;
  if (typeof _fcxPrev === 'function') window.fcxAppendFixturesPreview = function(){ var r = _fcxPrev.apply(this, arguments); try { renderHome(); } catch(e){ console.error('LMX', e); } return r; };

  if (window._matchCardsRawRows && typeof renderMatchCards === 'function') { try { renderMatchCards(window._matchCardsRawRows); } catch(e){} }
})();

;

/* Custom HERO SLIDES (sheet) -> PC + mobile heroes. A slide titled "TEAM v TEAM" (codes, either order) is linked to the
   matching MATCH CARDS item, so its Watch/tap opens that match's server selector. Other custom slides keep their own button. */
window.sxHeroCustom=function(base,all){
  var c=document.getElementById('slides-container'); if(!c) return [];
  var out=[];
  [].slice.call(c.querySelectorAll(':scope > .slide')).forEach(function(sl){
    if(sl.querySelector('.hfl-logo')||sl.classList.contains('fcx-hero-slide')) return;
    var orig=''; try{ orig=decodeURIComponent(sl.dataset.origTitle||''); }catch(e){}
    var g=function(q){ var e=sl.querySelector(q); return e?e.textContent.trim():''; };
    var bg=sl.querySelector('.slide-bg'), u=((bg&&bg.style.backgroundImage)||'').replace(/^url\(["']?/,'').replace(/["']?\)$/,'');
    var title=g('.slide-title')||orig; if(!u&&!title) return;
    var it=null, m=orig.trim().match(/^(.{2,40}?)\s+v(?:s|\.)?\s+(.{2,40})$/i);
    if(m){
      /* team codes OR team names (full/partial, any case) from the sheet, FanCode or SonyLIV title */
      var nz=function(x){ return String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,''); };
      var same=function(x,y){ x=nz(x); y=nz(y); if(!x||!y) return false; if(x===y) return true; return x.length>=4&&y.length>=4&&(x.indexOf(y)>-1||y.indexOf(x)>-1); };
      var A=m[1], B=m[2];
      var sides=function(mm){
        var out=[];
        if(mm.src==='s'&&mm.raw){ out.push([[mm.raw.team1_code,mm.raw.team1_full_name],[mm.raw.team2_code,mm.raw.team2_full_name]]); }
        var t=String(mm.title||'').match(/^(.+?)\s+v(?:s|\.)?\s+(.+?)(?:\s+[-|•].*)?$/i);
        if(t) out.push([[t[1]],[t[2]]]);
        return out;
      };
      var hit=function(grp,x){ return grp.some(function(v){ return same(v,x); }); };
      var fit=function(x){ return (x.members||[x]).concat([x]).some(function(mm){ return sides(mm).some(function(sd){
        return (hit(sd[0],A)&&hit(sd[1],B))||(hit(sd[0],B)&&hit(sd[1],A)); }); }); };
      it=(base||[]).filter(fit)[0]||(all||[]).filter(function(x){ return fit(x)&&!x.fin; })[0]||null;
    }
    var sub=g('.slide-sub'), img=u;
    if(it){
      var sm=(it.members||[]).filter(function(mm){ return mm.src==='s'; })[0];
      if(sm&&sm.raw){ var t1=sm.raw.team1_full_name||sm.raw.team1_code||'', t2=sm.raw.team2_full_name||sm.raw.team2_code||''; if(t1&&t2) title=t1+' vs '+t2; }
      if(!sub) sub=[it.tour, it.live?'Streaming live now':(it.time?'Starts '+it.time:'Today')].filter(Boolean).join(' \u2022 ');
      if(!img) img=it.img||'';
    }
    out.push({el:sl,title:title,img:img,badge:g('.slide-sport-badge'),sub:sub,it:it});
  });
  return out;
};

;

(function(){
  var NS='http://www.w3.org/2000/svg';
  function ic(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';}
  var D=function(f){return function(){if(window[f])window[f]();};};
  function im(sel){var e=document.querySelector(sel);return e&&e.src?'<img src="'+e.src+'" alt="">':null;}
  function cl(sel,fb){var e=document.querySelector(sel);if(!e)return fb;var c=e.cloneNode(true);c.removeAttribute('class');c.removeAttribute('width');c.removeAttribute('height');return c.outerHTML;}
  var items=[
    ['Home',ic('<path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>'),function(){if(window.goHome)goHome();else window.scrollTo({top:0});},1],
    ['Search',ic('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3L20 20"/>'),D('openSxSearch'),1],
    ['Live TV',ic('<rect x="2.5" y="5" width="19" height="13" rx="2"/><path d="M8 21h8M12 18v3"/>'),D('openLiveTV'),1],
    ['Matches',ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><circle cx="9" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1" fill="currentColor" stroke="none"/>'),function(){if(window.sxSwitchTab)sxSwitchTab('matches');var e=document.getElementById('sxTabPanels');if(e)e.scrollIntoView();},1],
    ['Movies',ic('<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12.5h18M6.5 8 9 3.5M12 8l2.5-4.5M17.5 8 20 4"/>'),function(){if(window.hsmOpen)hsmOpen('movie');else if(window.openMoviesOverlay)openMoviesOverlay();},1],
    ['TV Shows',ic('<rect x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M8 3l4 4 4-4\"/>'),function(){if(window.hsmOpen)hsmOpen('tv');},1],
    'sep',
    ['GOLD',ic('<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>'),D('openVip')],
    ['Discord',cl('.btn-discord svg',ic('<circle cx="12" cy="12" r="9"/>')),'https://discord.gg/w46C6mQgrY'],
    ['Telegram',cl('.btn-telegram svg',ic('<path d="M21 4L3 11l6 2.5L11.5 20l3-4.5L19 19z"/>')),'https://t.me/rishievofficial'],
  ];
  var rail=document.createElement('nav');rail.id='hs-rail';
  var logo=document.getElementById('nav-logo-img');
  var inn='<div class="in"><div class="logo"><img class="rail-logo-img" src="evora-mark.png" alt=""><span class="evw evw-rail"><span class="evw-a">EV</span><span class="evw-b">ORA</span></span></div>';
  items.forEach(function(it,i){
    if(it==='sep'){inn+='<div class="sep"></div>';return;}
    var tg=it[0];
    if(typeof it[2]==='string') inn+='<a href="'+it[2]+'" target="_blank" rel="noopener" title="'+tg+'">'+it[1]+'<span>'+tg+'</span></a>';
    else inn+='<a data-i="'+i+'" title="'+tg+'">'+it[1]+'<span>'+tg+'</span></a>';
  });
  rail.innerHTML=inn+'</div>';
  rail.addEventListener('click',function(e){var a=e.target.closest('a');if(!a||a.dataset.i===undefined)return;var it=items[+a.dataset.i];it[2]();
    if(it[3])rail.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a);});});
  document.body.appendChild(rail);
  /* QR popup lives inside the (now hidden) header: lift it out so the sidebar button can show it */
  var qp=document.getElementById('qr-panel');if(qp)document.body.appendChild(qp);
  rail.querySelector('a[data-i]').classList.add('on');
  document.body.appendChild(rail);

  /* hero built from the existing .hero-slide-card data (same click handlers) */
  var host=document.getElementById('hero-section'),track=document.getElementById('hero-cards-track');
  if(!host||!track)return;
  var hero=document.createElement('div');hero.id='hs-hero';
  hero.innerHTML='<button class="hs-edge l" type="button" aria-label="Previous">&#10094;</button><button class="hs-edge r" type="button" aria-label="Next">&#10095;</button><div class="bg on"></div><div class="bg"></div><div class="sh"></div><div class="txt"><div class="tag"></div><div class="lgs"></div><h1></h1><div class="sub"></div><div class="btns"><button class="go" type="button">&#9654;&nbsp; Watch Now</button><button class="plus" type="button" title="More matches">+</button></div></div><div class="thumbs"><div class="thw"></div><button class="nx" type="button" aria-label="Next">&#10095;</button></div>';
  host.insertBefore(hero,host.firstChild);
  var bgs=hero.querySelectorAll('.bg'),cur=0,slides=[],timer=null,flip=0,lastSig='';
  var FALLBACK_BG='https://raw.githubusercontent.com/saptarshiorg/saptarshiorg.github.io/main/ChatGPT%20Image%20Jun%207,%202026,%2010_27_17%20AM.png';
  function bgOf(c){var el=c.querySelector('.hsc-banner-bg');var m=el&&el.style.backgroundImage;return m||'';}
  /* PC hero = TODAY's matches only, merged from the sheet MATCH CARDS + FanCode API + SonyLIV API
     (same same-day list the Sports tab uses: live now, or scheduled on today's date). */
  function fromMatches(){
    var S=window.__sxs;if(!S)return [];
    var list=[];try{list=S.refresh()||[];}catch(e){try{list=S.all()||[];}catch(e2){}}
    var base=list.filter(function(it){return !it.fin;}), cu=window.sxHeroCustom?sxHeroCustom(base,list):[], used=cu.map(function(c){return c.it;}).filter(Boolean);
    var mm=base.filter(function(it){return used.indexOf(it)<0;}).slice(0,12).map(function(it){
      var title=String(it.title||'Match').replace(/\s+v\s+/i,' vs ');
      var sm=(it.members||[]).filter(function(m){return m.src==='s';})[0];
      if(sm&&sm.raw){var t1=sm.raw.team1_full_name||sm.raw.team1_code||'',t2=sm.raw.team2_full_name||sm.raw.team2_code||'';if(t1&&t2)title=t1+' vs '+t2;}
      var parts=[];if(it.tour)parts.push(it.tour);
      /* Google Sheet (MATCH CARDS) data: team logos + match details */
      var lg=null,sr=sm&&sm.raw;
      if(sr){ var i1=sr.team1_icon_url||'',i2=sr.team2_icon_url||''; if(i1||i2) lg={a:i1,b:i2,an:(sr.team1_code||''),bn:(sr.team2_code||'')};
        if(sr.details&&parts.indexOf(sr.details)<0) parts.push(sr.details); }
      parts.push(it.live?'Streaming live now':(it.time?'Starts '+it.time:'Today'));
      return {lg:lg,bg:'url("'+(it.img||FALLBACK_BG)+'")',title:title,live:!!it.live,sp:String(it.sport||'').trim(),sub:parts.join('  \u2022  '),go:function(){try{S.open(it);}catch(e){}}};
    });
    var cc=cu.map(function(c){
      var sr=c.it&&((c.it.members||[]).filter(function(m){return m.src==='s';})[0]||{}).raw, lg=null;
      if(sr&&(sr.team1_icon_url||sr.team2_icon_url)) lg={a:sr.team1_icon_url||'',b:sr.team2_icon_url||'',an:sr.team1_code||'',bn:sr.team2_code||''};
      return {lg:lg,bg:'url("'+(c.img||FALLBACK_BG)+'")',title:c.title,live:c.it?!!c.it.live:false,sp:c.badge||'',sub:c.sub,
        go:function(){ if(c.it){ try{S.open(c.it);}catch(e){} } else { var b=c.el&&c.el.querySelector('.btn-slide-watch'); if(b) b.click(); } }};
    });
    return cc.concat(mm);
  }
  function show(i){
    if(!slides.length)return; cur=(i+slides.length)%slides.length; var c=slides[cur];
    var n=bgs[flip^1],o=bgs[flip];n.style.backgroundImage=c.bg||'url("'+FALLBACK_BG+'")';n.classList.add('on');o.classList.remove('on');flip^=1;
    var tag=hero.querySelector('.tag');tag.innerHTML='';
    if(c.live){var b=document.createElement('b');b.className='lv';b.innerHTML='<i></i>LIVE';tag.appendChild(b);}
    if(c.sp){var sp=document.createElement('span');sp.textContent=c.sp;tag.appendChild(sp);}
    var lgs=hero.querySelector('.lgs'); if(lgs){ lgs.innerHTML='';
      if(c.lg){ [[c.lg.a,c.lg.an],[c.lg.b,c.lg.bn]].forEach(function(t,k){ if(k){ var v=document.createElement('b'); v.textContent='VS'; lgs.appendChild(v); }
        var w=document.createElement('span'); w.className='tl';
        if(t[0]){ var im=document.createElement('img'); im.alt=t[1]||''; im.src=t[0]; im.onerror=function(){ im.remove(); w.textContent=t[1]||''; }; w.appendChild(im); } else w.textContent=t[1]||'';
        lgs.appendChild(w); }); } }
    hero.querySelector('h1').textContent=c.title||'';
    hero.querySelector('.sub').textContent=c.sub||'';
    var tw=hero.querySelector('.thw'); if(tw){ [].forEach.call(tw.children,function(t,k){ t.classList.toggle('on',k===cur); }); var at=tw.children[cur]; if(at) tw.scrollTo({left:Math.max(0,at.offsetLeft-tw.offsetLeft-16),behavior:'smooth'}); }
  }
  function build(){
    var a=fromMatches();
    var sig=a.map(function(x){return x.title+'|'+x.bg+'|'+x.live+'|'+x.sub+'|'+x.sp+'|'+(x.lg?x.lg.a+x.lg.b:'');}).join('~');
    if(sig===lastSig)return; lastSig=sig;
    slides=a;
    hero.style.display=slides.length?'':'none';      /* nothing to show -> no empty hero */
    if(!slides.length){clearInterval(timer);return;}
    var tw=hero.querySelector('.thw'); if(tw){ tw.innerHTML=''; slides.forEach(function(c,k){ var t=document.createElement('div'); t.className='th'; t.title=c.title||''; t.style.backgroundImage=c.bg||'url("'+FALLBACK_BG+'")'; t.onclick=function(){ show(k); restart(); }; tw.appendChild(t); }); }
    cur=Math.min(cur,slides.length-1);show(cur);restart();
  }
  function restart(){clearInterval(timer);timer=setInterval(function(){show(cur+1);},6500);}
  hero.querySelector('.nx').onclick=function(){ show(cur+1); restart(); };
  hero.querySelector('.hs-edge.l').onclick=function(){ show(cur-1); restart(); };
  hero.querySelector('.hs-edge.r').onclick=function(){ show(cur+1); restart(); };
  hero.querySelector('.go').onclick=function(){slides[cur]&&slides[cur].go&&slides[cur].go();};
  hero.querySelector('.plus').onclick=function(){window.sxSwitchTab&&sxSwitchTab('matches');var e=document.getElementById('sxTabPanels');e&&e.scrollIntoView({behavior:'smooth'});};
  var pend=null;new MutationObserver(function(){clearTimeout(pend);pend=setTimeout(build,120);}).observe(track,{childList:true,subtree:true,characterData:true});
  build();
  setInterval(build,6000);                            /* picks up FanCode / SonyLIV / sheet data as it loads */
  window.hsHeroRefresh=function(){clearTimeout(pend);pend=setTimeout(build,60);};
  window.hsHeroNav={count:function(){return slides.length;},index:function(){return cur;},go:function(i){show(i);restart();},next:function(){show(cur+1);restart();},prev:function(){show(cur-1);restart();}};

  /* arrow buttons on the horizontal rails */
  ['channelsPreviewGrid','fixtures-grid'].forEach(function(id){
    var g=document.getElementById(id);if(!g||!g.parentNode)return;
    var w=document.createElement('div');w.className='hs-rowwrap';g.parentNode.insertBefore(w,g);w.appendChild(g);
    ['l','r'].forEach(function(s){var b=document.createElement('button');b.className='hs-rowbtn '+s;b.type='button';b.innerHTML=s==='l'?'&#10094;':'&#10095;';
      b.onclick=function(){g.scrollBy({left:(s==='l'?-1:1)*g.clientWidth*.8,behavior:'smooth'});};w.appendChild(b);});
  });
})();

;

(function(){ var s=document.getElementById('ott-section'); if(s) s.remove(); })();

;

(function(){
  /* ═════════ helpers ═════════ */
  var ROW_SIZE=20;
  var GENRES=[['Action','Action'],['Comedy','Comedy'],['Thriller','Thriller'],['Horror','Horror'],['Sci-Fi','Sci-Fi'],['Drama','Drama'],['Animation','Anime & Animation'],['Fantasy','Fantasy'],['Documentary','Documentary']];
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function num(v){return parseFloat(v)||0;}
  function P(m){return m._p===undefined?(m._p=num(m.popularity)):m._p;}
  function R(m){return m._r===undefined?(m._r=num(m.rating)):m._r;}
  function T(m){return m._t||(m._t=(m.title||'').toLowerCase());}
  function idOf(m){return String(m.tmdb_id||m.imdb_id||m.embed_url||((m.title||'')+'|'+(m.year||'')));}
  function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}

  /* ═════════ DATA LAYER — one independent database per catalog ═════════
     Movies and TV Shows each get their own loader, pool, cache and page.
     Loaders start immediately (page 1 is even requested from <head>), run 14 pages in parallel,
     retry failures, de-duplicate, and keep going until the last page is in. */
  var CACHE_KEY='hsm_cache_v2_';
  var DB={};
  ['movie','tv'].forEach(function(t){DB[t]={type:t,pool:vaPools[t],ids:new Set(),expected:0,done:false,running:false,next:2,failQ:[],attempts:{},inflight:0,fail:0,pages:[],sc:null};});
  var PATH={movie:'movies',tv:'tvshows'};
  var MOBL=!!(window.matchMedia&&matchMedia('(max-width:900px)').matches);

  function sync(db){   /* guards against anything else having pushed into the pool */
    var a=db.pool.all;
    if(a.length===db.expected)return;
    var seen=new Set(),out=[];
    for(var i=0;i<a.length;i++){var k=idOf(a[i]);if(!seen.has(k)){seen.add(k);out.push(a[i]);}}
    a.length=0;for(var j=0;j<out.length;j++)a.push(out[j]);
    db.ids=seen;db.expected=a.length;
  }
  function addItems(db,items){
    for(var i=0;i<items.length;i++){var m=items[i],k=idOf(m);if(!db.ids.has(k)){db.ids.add(k);db.pool.all.push(m);db.expected++;}}
  }
  function notify(db){db.pages.forEach(function(pg){pg.schedule();});}
  function seedCache(db){
    try{var raw=localStorage.getItem(CACHE_KEY+db.type);if(raw){var arr=JSON.parse(raw);if(arr&&arr.length){addItems(db,arr);}}}catch(e){}
  }
  function saveCache(db){
    try{
      var top=db.pool.all.slice().sort(function(a,b){return P(b)-P(a);}).slice(0,320).map(function(m){return {title:m.title,year:m.year,poster_url:m.poster_url,rating:m.rating,genre:m.genre,popularity:m.popularity,tmdb_id:m.tmdb_id,imdb_id:m.imdb_id,embed_url:m.embed_url};});
      localStorage.setItem(CACHE_KEY+db.type,JSON.stringify(top));
    }catch(e){}
  }
  async function fetchInto(db,p){
    var d=null;
    if(p===1&&window.__hsmEarly&&window.__hsmEarly[PATH[db.type]]){d=await window.__hsmEarly[PATH[db.type]];window.__hsmEarly[PATH[db.type]]=null;}
    if(!d)d=await vaFetchPage(db.type,p);
    if(d&&d.total_pages)db.pool.totalPages=d.total_pages;
    addItems(db,(d&&d.items)||[]);
    db.fail=0;notify(db);
  }
  async function worker(db){
    while(true){
      var p=null;
      if(db.failQ.length)p=db.failQ.shift();
      else if(db.next<=db.pool.totalPages)p=db.next++;
      else if(db.inflight===0)break;
      else{await sleep(120);continue;}
      db.inflight++;
      try{await fetchInto(db,p);}
      catch(e){
        var a=db.attempts[p]=(db.attempts[p]||0)+1;db.fail++;
        if(a<10){db.failQ.push(p);db.inflight--;await sleep(Math.min(4000,300*a));continue;}
      }
      db.inflight--;
    }
  }
  /* LITE LOAD (home, startup, hero, search box opening): only the first few pages - enough for the home rows - then STOP.
     The full catalogue is only pulled when the person actually opens Movies / TV Shows (hsmLoadAll) or starts typing in search. */
  var LITE_PAGES=3;
  function startLite(db){
    if(db.running||db.done||db.litePromise)return db.litePromise;
    seedCache(db);notify(db);
    async function one(p){for(var a=0;a<4;a++){try{await fetchInto(db,p);return true;}catch(e){await sleep(500*(a+1));}}return false;}
    db.litePromise=(async function(){
      var ok=await one(1);
      if(ok){
        var tp=Math.min(LITE_PAGES,db.pool.totalPages||1),ps=[];
        for(var p=2;p<=tp;p++)ps.push(one(p));
        var r=await Promise.all(ps);
        db.liteOk=r.every(Boolean);
      }
      db.litePromise=ok?db.litePromise:null;   /* page 1 failed -> allow a later retry */
      return ok;
    })();
    return db.litePromise;
  }
  async function start(db){
    if(db.running||db.done)return;
    db.running=true;
    if(db.litePromise){try{await db.litePromise;}catch(e){}}
    if(db.liteOk&&db.next<LITE_PAGES+1)db.next=LITE_PAGES+1;   /* pages 1..LITE_PAGES are already in memory */
    seedCache(db);notify(db);
    while(!db.pool.totalPages){
      try{await fetchInto(db,1);}catch(e){db.fail++;notify(db);await sleep(Math.min(5000,500*db.fail));}
    }
    var ws=[];for(var i=0;i<14;i++)ws.push(worker(db));
    await Promise.all(ws);
    db.done=true;db.running=false;saveCache(db);db.sc=null;notify(db);
  }
  setTimeout(function(){saveCache(DB.movie);saveCache(DB.tv);},12000);

  /* route the site's old loaders into this one */
  /* old callers (home hero, search box, old pages) only ever get the light load; the full load is on demand */
  window.vaLoadMoreCurrent=function(t){startLite(DB[t||'movie']);};
  window.vaBulkPreload=function(t){startLite(DB[t]);};
  window.hsmLoadAll=function(t){ if(DB[t])start(DB[t]); };
  var _hsmGo=false;
  function hsmGo(){ if(_hsmGo)return; _hsmGo=true; try{window.__hsmKick&&window.__hsmKick();}catch(e){} startLite(DB.movie); setTimeout(function(){startLite(DB.tv);},700); }
  window.addEventListener('sx:feeds-ready',function(){setTimeout(hsmGo,0);});
  if(window.__sxFeedsReady)setTimeout(hsmGo,0);
  setTimeout(hsmGo,1200);   /* safety net: Movies/TV never wait longer than this */
  window.vaDeepSearch=async function(){};
  window.vaInit=function(){};
  window.vaRenderMovies=function(){DB.movie.pages.concat(DB.tv.pages).forEach(function(pg){pg.schedule();});};

  /* ═════════ sorted views (per catalog) ═════════ */
  function sorted(db){
    var n=db.pool.all.length,c=db.sc,now=Date.now(),gap=n<3000?0:n<30000?1500:n<100000?4000:10000;
    if(!c||(c.len!==n&&now-c.at>gap)){
      var all=db.pool.all;
      c={len:n,at:now,pop:all.slice().sort(function(a,b){return P(b)-P(a);}),rate:all.filter(function(m){return R(m)>0;}).sort(function(a,b){return R(b)-R(a);})};
      db.sc=c;
    }
    return c;
  }
  function spec(db,srcKey,test){return {db:db,srcKey:srcKey,src:sorted(db)[srcKey],test:test,i:0,seen:new Set()};}
  function take(sp,n){
    var r=[];
    while(r.length<n){
      if(sp.i>=sp.src.length){
        var fresh=sorted(sp.db)[sp.srcKey];
        if(fresh===sp.src)break;
        sp.src=fresh;sp.i=0;continue;
      }
      var m=sp.src[sp.i++],k=idOf(m);
      if(sp.seen.has(k))continue;
      if(!sp.test||sp.test(m)){sp.seen.add(k);r.push(m);}
    }
    return r;
  }

  /* ═════════ cards ═════════ */
  function play(m,type){
    var label=m.title+(m.year?' ('+m.year+')':'');
    if(type==='tv'){vaPendingTvItem={id:m.tmdb_id||m.imdb_id,title:m.title};vaOpenTvModal(label);}
    else openStreamPlayer(vaBuildEmbedUrl(m.embed_url),label,'movie');
  }
  function card(m,type){
    var c=document.createElement('div');
    c.className='hsm-card';c._m=m;c._ty=type;c.setAttribute('role','button');c.tabIndex=0;
    c.title=m.title||'';c.setAttribute('aria-label',m.title||'Play');
    c.innerHTML=(m.poster_url?'<img src="'+esc(m.poster_url)+'" alt="'+esc(m.title)+'" loading="lazy">':'<div class="ft">'+esc(m.title)+'</div>');
    var im=c.querySelector('img');
    if(im)im.onerror=function(){im.remove();c.insertAdjacentHTML('beforeend','<div class="ft">'+esc(m.title)+'</div>');};
    c.onclick=function(){play(m,type);};
    c.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play(m,type);}};
    return c;
  }

  /* ═════════ PAGE — a complete, self-contained section (own search, rows, status) ═════════ */
  function Page(type,host,overlayId){
    var db=DB[type],title=type==='tv'?'TV Shows':'Movies';
    var pg={type:type,db:db};
    host.innerHTML=
      '<div class="hsm-page">'+
        '<div class="hsm-switch"><button type="button" data-go="movie"'+(type==='movie'?' class="on"':'')+'>Movies</button><button type="button" data-go="tv"'+(type==='tv'?' class="on"':'')+'>TV Shows</button></div>'+
        '<div class="hsm-head"><h1 class="hsm-sec-title">'+title+'</h1>'+
          '<div class="hsm-search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>'+
          '<input type="text" autocomplete="off" placeholder="Search all '+(type==='tv'?'TV shows':'movies')+', or paste an IMDB/TMDB ID\u2026">'+
          '<button type="button" class="hsm-clear" aria-label="Clear">&#10005;</button><button type="button" class="hsm-idbtn">\u25B6 Play ID</button></div></div>'+
        '<div class="hsm-loadbar"><div class="hsm-loadtxt"></div><button type="button" class="hsm-loadbtn">\u2B07 Load all '+title+'</button></div>'+
        '<div class="hsm-status"></div><div class="hsm-body"></div><div class="hsm-sentinel"></div>'+
      '</div>';
    var body=host.querySelector('.hsm-body'),input=host.querySelector('input'),status=host.querySelector('.hsm-status'),loadbar=host.querySelector('.hsm-loadbar'),loadtxt=host.querySelector('.hsm-loadtxt'),loadbtn=host.querySelector('.hsm-loadbtn'),
        clear=host.querySelector('.hsm-clear'),idbtn=host.querySelector('.hsm-idbtn'),sentinel=host.querySelector('.hsm-sentinel'),
        ov=document.getElementById(overlayId);
    var lastKey='',lastAt=0,timer=0,scrolls={},wants={},lastSearchSig='',limit=60,lastTotal=0;

    host.querySelectorAll('.hsm-switch button').forEach(function(b){b.onclick=function(){window.hsmOpen(b.getAttribute('data-go'));};});

    function isOpen(){return ov&&ov.classList.contains('open');}
    function query(){var raw=input.value;return vaDetectId(raw)?'':raw.toLowerCase().trim();}
    function setStatus(){
      var n=db.pool.all.length,q=query(),txt,started=db.running||db.done;
      if(q)txt=lastTotal.toLocaleString()+' result'+(lastTotal===1?'':'s')+(db.done?' \u00b7 whole library searched':started?' \u00b7 searching whole library\u2026 '+n.toLocaleString()+' checked':' \u00b7 only loaded titles searched');
      else txt=db.done?'':started?'Loading full library\u2026 '+n.toLocaleString()+' titles':'';
      if(!db.done&&started&&db.fail>=3)txt+=' \u00b7 connection problem, retrying\u2026';
      status.textContent=txt;
      /* Load button: shown until the person taps it; hidden while loading and once complete */
      loadbar.style.display=started?'none':'flex';
      if(!started)loadtxt.textContent=n.toLocaleString()+' '+title.toLowerCase()+' ready \u00b7 tap Load once to get the full library';
    }
    loadbtn.onclick=function(){
      if(db.running||db.done)return;
      loadbtn.disabled=true;
      start(db);            /* one tap loads everything */
      setStatus();
      setTimeout(function(){loadbtn.disabled=false;},800);
    };

    function addRow(host2,key,rowTitle,sp,first){
      if(first.length<3)return;
      var row=document.createElement('section');row.className='hsm-row';
      row.innerHTML='<h2 class="hsm-row-title">'+esc(rowTitle)+'</h2><div class="hsm-wrap"><button class="hsm-btn l" type="button" aria-label="Scroll left">&#10094;</button><div class="hsm-track"></div><button class="hsm-btn r" type="button" aria-label="Scroll right">&#10095;</button></div>';
      var tr=row.querySelector('.hsm-track'),shown=0;
      function add(items){items.forEach(function(m){tr.appendChild(card(m,type));});shown+=items.length;}
      add(first);
      while(wants[key]&&shown<wants[key]){var more=take(sp,ROW_SIZE);if(!more.length)break;add(more);}
      function extend(){
        if(tr.scrollLeft+tr.clientWidth<tr.scrollWidth-900)return;
        var more=take(sp,ROW_SIZE);if(more.length){add(more);wants[key]=shown;}
      }
      tr.addEventListener('scroll',function(){scrolls[key]=tr.scrollLeft;extend();},{passive:true});
      row.querySelector('.l').onclick=function(){tr.scrollBy({left:-tr.clientWidth*.85,behavior:'smooth'});};
      row.querySelector('.r').onclick=function(){tr.scrollBy({left:tr.clientWidth*.85,behavior:'smooth'});};
      host2.appendChild(row);
      if(scrolls[key])tr.scrollLeft=scrolls[key];
    }

    /* ═════ fast search engine ═════ */
    var curIds=[],cardCache=new Map(),scache=null;
    function getCard(m){
      var id=idOf(m),c=cardCache.get(id);
      if(!c){
        c=card(m,type);cardCache.set(id,c);
        if(cardCache.size>900){var k=cardCache.keys().next().value;cardCache.delete(k);}
      }
      return c;
    }
    function norm(t){
      t=String(t==null?'':t).toLowerCase();
      try{t=t.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}catch(e){}
      return t.replace(/&/g,' and ').replace(/[^a-z0-9\u0080-\uffff]+/g,' ').trim();
    }
    function prep(m){
      if(m._n===undefined){m._n=norm(m.title);m._s=' '+m._n+' '+(m.year||'');}
    }
    /* word-start matching ("ava" finds "Avatar", not "Java"); mode 's' = substring fallback */
    function score(m,qn,toks,mode){
      prep(m);var s=m._s,i;
      if(mode==='s'){for(i=0;i<toks.length;i++){if(s.indexOf(toks[i])<0)return -1;}return 100;}
      for(i=0;i<toks.length;i++){if(s.indexOf(' '+toks[i])<0)return -1;}
      var n=m._n;
      if(n===qn)return 1000;
      if(n.indexOf(qn)===0)return 800;
      if(s.indexOf(' '+qn)>=0)return 600;
      return 300;
    }
    function scan(src,from,qn,toks,mode,out){
      for(var i=from;i<src.length;i++){var m=src[i],sc=score(m,qn,toks,mode);if(sc>=0)out.push({m:m,s:sc});}
    }
    function runSearch(q){
      var qn=norm(q),all=db.pool.all,n=all.length;
      if(!qn)return {list:[],total:0};
      var toks=qn.split(' '),c=scache;
      if(c&&c.q===qn&&c.mode==='w'){                 /* same query, library grew: only scan the new titles */
        if(c.n!==n){scan(all,c.n,qn,toks,'w',c.items);c.n=n;c.sorted=null;}
      }else if(c&&c.q===qn&&c.mode==='s'&&c.n===n){
        /* unchanged */
      }else{
        var items=[],mode='w';
        if(c&&c.mode==='w'&&c.q&&qn.indexOf(c.q)===0&&c.n<=n){   /* user kept typing: narrow the previous hits */
          var prev=c.items;
          for(var i=0;i<prev.length;i++){var sc=score(prev[i].m,qn,toks,'w');if(sc>=0)items.push({m:prev[i].m,s:sc});}
          scan(all,c.n,qn,toks,'w',items);
        }else scan(all,0,qn,toks,'w',items);
        if(!items.length){mode='s';scan(all,0,qn,toks,'s',items);}
        c=scache={q:qn,mode:mode,n:n,items:items,sorted:null};
      }
      if(!c.sorted){
        c.sorted=c.items.slice().sort(function(a,b){return b.s-a.s||P(b.m)-P(a.m);}).map(function(o){return o.m;});
      }
      return {list:c.sorted,total:c.sorted.length};
    }
    input.setAttribute('spellcheck','false');input.setAttribute('autocapitalize','off');input.setAttribute('enterkeyhint','search');

    pg.render=function(){
      sync(db);
      var q=query(),raw=input.value;
      clear.style.display=raw?'block':'none';
      idbtn.style.display=vaDetectId(raw)?'inline-block':'none';
      lastAt=Date.now();

      if(q){                                   /* ── search the WHOLE library (fast, ranked, incremental) ── */
        var res=runSearch(q);
        lastTotal=res.total;
        var shown=res.list.slice(0,limit);
        setStatus();
        if(!shown.length){
          var esig='empty|'+q+'|'+db.done;
          if(esig===lastSearchSig&&body.className==='hsm-body')return;
          lastSearchSig=esig;curIds=[];lastKey='';
          body.className='hsm-body';
          body.innerHTML='<div class="hsm-empty">'+(db.done?'No titles match \u201c'+esc(q)+'\u201d anywhere in the library. Try pasting its IMDB (tt\u2026) or TMDB ID instead.':'Searching the whole library\u2026 nothing yet for \u201c'+esc(q)+'\u201d.')+'</div>';
          return;
        }
        lastSearchSig='';lastKey='';
        var ids=shown.map(idOf),same=body.classList.contains('hsm-grid')&&ids.length>=curIds.length;
        if(same){for(var x=0;x<curIds.length;x++){if(curIds[x]!==ids[x]){same=false;break;}}}
        var frag=document.createDocumentFragment();
        if(same){                              /* results only grew -> append, no rebuild, no flicker */
          for(var y=curIds.length;y<shown.length;y++)frag.appendChild(getCard(shown[y]));
          if(shown.length>curIds.length)body.appendChild(frag);
        }else{                                 /* results changed -> swap in cached cards in one go */
          for(var z=0;z<shown.length;z++)frag.appendChild(getCard(shown[z]));
          body.className='hsm-body hsm-grid';
          if(body.replaceChildren)body.replaceChildren(frag);else{body.innerHTML='';body.appendChild(frag);}
        }
        curIds=ids;
        return;
      }

      lastSearchSig='';lastTotal=0;curIds=[];setStatus();   /* ── browse: rows ── */
      if(!db.pool.all.length){if(!body.children.length)body.innerHTML='<div class="hsm-loading"><span class="ev-rl"></span></div>';return;}
      var rows=[['trend','Trending Now',spec(db,'pop')],['rated','Top Rated',spec(db,'rate')]];
      GENRES.forEach(function(g){var k=g[0].toLowerCase();rows.push([k,g[1],spec(db,'pop',function(m){return (m.genre||'').toLowerCase().indexOf(k)>-1;})]);});
      /* 18+ erotic section (movies only, own row at the end, behind an age confirmation) */
      var adultOn=false,adultRow=null;
      if(type==='movie'&&typeof window.evIs18==='function'){
        var asp=spec(db,'pop',function(m){return window.evIs18(m);});
        var aitems=take(asp,ROW_SIZE);
        if(aitems.length){ adultRow=['adult','18+ Erotic Movies',asp,aitems]; adultOn=!!window._ev18rows; if(adultOn)rows.push(adultRow); }
      }
      rows.forEach(function(r){if(!r[3])r.push(take(r[2],ROW_SIZE));});
      var key=rows.map(function(r){return r[0]+':'+r[3].map(idOf).join(',');}).join(';')+(adultRow?'|18:'+(adultOn?1:0):'');
      if(key===lastKey&&body.classList.contains('hsm-rows'))return;
      lastKey=key;
      body.className='hsm-body hsm-rows';body.innerHTML='';
      var any=false;
      rows.forEach(function(r){if(r[3].length>=3)any=true;addRow(body,r[0],r[1],r[2],r[3]);});
      if(adultRow&&!adultOn){
        var gt=document.createElement('div');gt.className='hsm-18gate';
        gt.innerHTML='<div class="hsm-18t"><b>18+</b> Erotic Movies</div><p>Mature titles are kept in their own section. Confirm your age to view them.</p><button type="button">Show 18+ section</button>';
        gt.querySelector('button').onclick=function(){ var go=function(){window._ev18rows=1;lastKey='';pg.render();}; if(typeof window.evAge18==='function')window.evAge18('18+ Erotic Movies',go);else go(); };
        body.appendChild(gt);
      }
      if(!any)body.innerHTML='<div class="hsm-loading"><span class="ev-rl"></span></div>';
    };

    pg.schedule=function(){
      if(!isOpen()||timer)return;
      var n=db.pool.all.length,gap=!lastAt?0:n<3000?350:n<30000?1500:3000;
      timer=setTimeout(function(){timer=0;pg.render();},Math.max(0,gap-(Date.now()-lastAt)));
    };
    pg.show=function(){lastKey='';lastSearchSig='';pg.render();};

    var itimer=0;
    input.addEventListener('input',function(){
      limit=60;lastKey='';
      var raw=input.value;
      clear.style.display=raw?'block':'none';                  /* instant UI feedback */
      idbtn.style.display=vaDetectId(raw)?'inline-block':'none';
      if(itimer)clearTimeout(itimer);
      itimer=setTimeout(function(){itimer=0;requestAnimationFrame(function(){pg.render();});},raw?60:0);   /* coalesce fast typing */
    });
    clear.onclick=function(){input.value='';limit=60;lastKey='';scache=null;pg.render();input.focus();};
    input.addEventListener('keydown',function(e){if(e.key==='Enter'&&vaDetectId(input.value))idbtn.click();});
    idbtn.onclick=function(){
      var info=vaDetectId(input.value);
      if(!info){vaToast('Enter a valid IMDB (tt\u2026) or TMDB (numeric) ID.');return;}
      if(type==='tv'){vaPendingTvItem={id:info.id,title:info.id};vaOpenTvModal();}
      else openStreamPlayer(vaBuildEmbedUrl(VIDAPI_EMBED_BASE+'/embed/movie/'+info.id),info.id,'movie');
    };
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&query()&&isOpen()&&lastTotal>limit){limit+=60;pg.render();}});},{rootMargin:'700px'}).observe(sentinel);
    }
    db.pages.push(pg);
    return pg;
  }

  /* ═════════ build the two overlays ═════════ */
  var mEl=document.getElementById('movies-overlay');
  var mInner=document.getElementById('movies-page-inner');
  var tvEl=document.createElement('div');tvEl.id='tv-overlay';
  tvEl.innerHTML='<div id="tv-page-inner"></div>';
  document.body.appendChild(tvEl);
  var moviesPage=Page('movie',mInner,'movies-overlay');
  var tvPage=Page('tv',document.getElementById('tv-page-inner'),'tv-overlay');
  try{SX_ALL_OVERLAY_IDS.push('tv-overlay');}catch(e){}

  /* opening any other section closes TV Shows too */
  var oc=window.sxCloseAllOverlays;
  window.sxCloseAllOverlays=function(){tvEl.classList.remove('open');return oc.apply(this,arguments);};

  /* sidebar highlight: whichever of Movies / TV Shows is open turns white, like the other items */
  function railSync(name){
    var rail=document.getElementById('hs-rail');if(!rail)return;
    rail.querySelectorAll('a').forEach(function(a){var sp=a.querySelector('span');a.classList.toggle('on',!!sp&&sp.textContent===name);});
  }
  new MutationObserver(function(){if(mEl.classList.contains('open')){railSync('Movies');moviesPage.schedule();}}).observe(mEl,{attributes:true,attributeFilter:['class']});
  new MutationObserver(function(){if(tvEl.classList.contains('open')){railSync('TV Shows');tvPage.schedule();}}).observe(tvEl,{attributes:true,attributeFilter:['class']});

  var om=window.openMoviesOverlay;
  window.openMoviesOverlay=function(){om.apply(this,arguments);railSync('Movies');moviesPage.show();mEl.scrollTop=0;};
  window.openTvOverlay=function(){
    sxCloseAllOverlays();
    tvEl.classList.add('open');
    document.body.style.overflow='hidden';
    window.scrollTo(0,0);
    document.querySelectorAll('[data-sxtab]').forEach(function(el){el.classList.remove('active');});
    try{sxHeaderInto('tv-overlay',null);}catch(e){}
    railSync('TV Shows');tvPage.show();tvEl.scrollTop=0;
    /* full catalogue now loads only when the person taps the Load button */
  };
  window.hsmOpen=function(type){if(type==='tv')openTvOverlay();else openMoviesOverlay();};

  /* home only needs a few titles: light load now, the full libraries wait until Movies / TV Shows is opened */
  startLite(DB.movie);startLite(DB.tv);
  moviesPage.render();
})();

;

(function(){
  var panel=document.getElementById('matches-panel');if(!panel)return;
  var root=document.createElement('div');root.id='sxs-root';panel.appendChild(root);
  var sel={game:'',tour:''},all=[],lastSig='',t0=Date.now();
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function startMs(c){var t=new Date(String(c.countdown_to_iso_datetime||c.countdown_to||'').trim()).getTime();return isNaN(t)?Infinity:t;}
  function dupOf(m,sheet){
    var tl=String(m.title||'').toLowerCase();
    return sheet.some(function(c){var a=String(c.team1_full_name||c.team1_code||'').toLowerCase(),b=String(c.team2_full_name||c.team2_code||'').toLowerCase();return a&&b&&tl.indexOf(a)>-1&&tl.indexOf(b)>-1;});
  }
  var CODES={IND:'India',AUS:'Australia',ENG:'England',PAK:'Pakistan',SA:'South Africa',RSA:'South Africa',NZ:'New Zealand',SL:'Sri Lanka',BAN:'Bangladesh',AFG:'Afghanistan',WI:'West Indies',ZIM:'Zimbabwe',IRE:'Ireland',NED:'Netherlands',NEP:'Nepal',UAE:'UAE',USA:'USA',OMA:'Oman',SCO:'Scotland',CSK:'Chennai Super Kings',MI:'Mumbai Indians',RCB:'Royal Challengers Bengaluru',KKR:'Kolkata Knight Riders',DC:'Delhi Capitals',SRH:'Sunrisers Hyderabad',RR:'Rajasthan Royals',PBKS:'Punjab Kings',GT:'Gujarat Titans',LSG:'Lucknow Super Giants',ARG:'Argentina',BRA:'Brazil',FRA:'France',GER:'Germany',ESP:'Spain',POR:'Portugal',ITA:'Italy',NED_:'Netherlands',BEL:'Belgium',CRO:'Croatia',MAR:'Morocco',JPN:'Japan',KOR:'South Korea',MEX:'Mexico',CAN:'Canada'};
  function nm(x){x=String(x||'').trim();var u=x.toUpperCase();return (x&&x.length<=4&&CODES[u])?CODES[u]:x;}
  function vsParse(t){var m=String(t||'').match(/^(.{2,40}?)\s+(?:vs\.?|v|versus)\s+(.{2,40}?)(?:\s*[,|\-\u2013\u2014(].*)?$/i);return m?[nm(m[1]),nm(m[2])]:null;}
  /* ═════ TOURNAMENT NAMES: real (sheet / API) name first, auto-guessed when missing ═════ */
  var GENERIC_T=/^(other|others|sports?|live|events?|matches|match|cricket|football|soccer|tennis|hockey|basketball|kabaddi|badminton|baseball|rugby|golf|boxing|mma|ufc|wrestling|motorsport|racing|volleyball|table tennis|esports?|general|misc|live sports?|other matches)$/i;
  var KNOWN_T=[
    [/\bipl\b|indian premier league/i,'Indian Premier League'],[/\bwpl\b|women'?s premier league/i,'Women\u2019s Premier League'],
    [/t20 world cup|t20wc/i,'T20 World Cup'],[/(odi|cricket) world cup|\bcwc\b/i,'Cricket World Cup'],[/champions trophy/i,'Champions Trophy'],
    [/asia cup/i,'Asia Cup'],[/big bash|\bbbl\b/i,'Big Bash League'],[/\bpsl\b|pakistan super league/i,'Pakistan Super League'],
    [/\bcpl\b|caribbean premier league/i,'Caribbean Premier League'],[/\bsa20\b/i,'SA20'],[/\bilt20\b/i,'ILT20'],[/the hundred/i,'The Hundred'],
    [/\blpl\b|lanka premier league/i,'Lanka Premier League'],[/\bbpl\b|bangladesh premier league/i,'Bangladesh Premier League'],
    [/ranji/i,'Ranji Trophy'],[/duleep/i,'Duleep Trophy'],[/vijay hazare/i,'Vijay Hazare Trophy'],[/mushtaq ali/i,'Syed Mushtaq Ali Trophy'],
    [/ashes/i,'The Ashes'],[/border.?gavaskar/i,'Border-Gavaskar Trophy'],[/\bt20is?\b/i,'T20 Internationals'],[/\bodis?\b/i,'ODI Series'],[/\btests?\b(?!\s*(match)?\s*(cricket)?\s*tv)/i,'Test Series'],
    [/premier league(?!.*(indian|women|pakistan|caribbean|lanka|bangladesh))/i,'Premier League'],[/la ?liga/i,'La Liga'],[/serie a/i,'Serie A'],[/bundesliga/i,'Bundesliga'],[/ligue 1/i,'Ligue 1'],
    [/champions league|\bucl\b/i,'UEFA Champions League'],[/europa league|\buel\b/i,'UEFA Europa League'],[/conference league/i,'UEFA Conference League'],
    [/fifa world cup|world cup qualifier/i,'FIFA World Cup'],[/copa am[eé]rica/i,'Copa Am\u00e9rica'],[/\beuro(pean championship)?\s*20\d\d|uefa euro/i,'UEFA Euro'],[/nations league/i,'Nations League'],
    [/\bmls\b|major league soccer/i,'Major League Soccer'],[/indian super league|\bisl\b/i,'Indian Super League'],[/i-?league/i,'I-League'],[/fa cup/i,'FA Cup'],[/carabao|efl cup|league cup/i,'EFL Cup'],[/copa del rey/i,'Copa del Rey'],[/saudi pro league|roshn/i,'Saudi Pro League'],
    [/wimbledon/i,'Wimbledon'],[/us open/i,'US Open'],[/french open|roland garros/i,'French Open'],[/australian open/i,'Australian Open'],[/\batp\b/i,'ATP Tour'],[/\bwta\b/i,'WTA Tour'],[/davis cup/i,'Davis Cup'],
    [/\bnba\b/i,'NBA'],[/\bwnba\b/i,'WNBA'],[/\bnfl\b/i,'NFL'],[/\bnhl\b/i,'NHL'],[/\bmlb\b/i,'MLB'],
    [/formula ?(1|one)|\bf1\b|grand prix/i,'Formula 1'],[/motogp/i,'MotoGP'],[/\bufc\b/i,'UFC'],[/\bwwe\b/i,'WWE'],
    [/pro kabaddi|\bpkl\b/i,'Pro Kabaddi League'],[/hockey india|\bhil\b/i,'Hockey India League'],[/\bbwf\b|all england|thomas cup|uber cup/i,'BWF Badminton'],[/olympic/i,'Olympics'],[/commonwealth/i,'Commonwealth Games']
  ];
  var MATCHNO=/^(\d+\s*(st|nd|rd|th)?|match|game|round|rd|day|leg|final|semi|quarter|qualifier|eliminator|live|today|hd|highlights|replay|free|watch|stream|upcoming|completed)\b/i;
  function cleanTour(t){
    t=String(t||'').replace(/\[[^\]]*\]/g,' ').replace(/\s+/g,' ').trim();
    t=t.replace(/\s*[\u2014\u2013|]\s*(match|game|m|round|rd|leg|day|qualifier|eliminator|semi.?final|quarter.?final|final)\b.*$/i,'');
    t=t.replace(/\s+-\s+(match|game|round|rd|leg|day|qualifier|eliminator|semi.?final|quarter.?final|final)\b.*$/i,'');
    t=t.replace(/[,\s]+(\d+(st|nd|rd|th)\s+)?(match|game)\s*#?\d+.*$/i,'').replace(/\s*[\u2014\u2013|\-]\s*\d+(st|nd|rd|th)\b.*$/i,'');
    return t.replace(/^[\s\-\u2013\u2014|:,]+|[\s\-\u2013\u2014|:,]+$/g,'').trim();
  }
  function knownTour(txt){
    for(var i=0;i<KNOWN_T.length;i++){if(KNOWN_T[i][0].test(txt)){var y=String(txt).match(/\b(20\d\d)\b/);return KNOWN_T[i][1]+((y&&!/Series|Internationals|NBA|NFL|NHL|MLB|UFC|WWE/.test(KNOWN_T[i][1]))?' '+y[1]:'');}}
    return '';
  }
  function isGenericT(t,sport){t=String(t||'').trim();return !t||GENERIC_T.test(t)||(sport&&t.toLowerCase()===String(sport).trim().toLowerCase());}
  /* best tournament name we can derive from free text (title / details / category) */
  function guessTour(texts,sport){
    var all=(texts||[]).filter(Boolean).map(String);
    var k=knownTour(all.join(' | '));if(k)return k;
    for(var a=0;a<all.length;a++){
      var parts=all[a].split(/\s*[|\u2014\u2013]\s*|\s+-\s+|,\s*|:\s+/);
      for(var i=0;i<parts.length;i++){
        var p=cleanTour(parts[i]);
        if(!p||p.length<3||p.length>60)continue;
        if(/(\bvs?\.?\b|\bversus\b)/i.test(p)||MATCHNO.test(p)||isGenericT(p,sport))continue;
        return p;
      }
    }
    return '';
  }
  /* sheet row: tournament / series columns first, then details, then game — skipping plain sport names */
  function sheetTourReal(c,sport){
    var f=['game','tournament','tournament_name','series','series_name','league','competition','event','event_name'];   /* game = tournament; details = match info (1st T20I), never a tournament */
    for(var i=0;i<f.length;i++){var v=cleanTour(c[f[i]]);if(v&&!isGenericT(v,sport))return v;}
    return '';
  }
  function tourFallback(sport){return (sport&&!GENERIC_T.test(String(sport).trim())||/^(cricket|football|soccer|tennis|hockey|basketball|kabaddi)$/i.test(String(sport||'')))?String(sport).trim()+' Matches':'Other Matches';}
  function tkey(t){return nk(String(t||'').replace(/\b20\d\d(-\d\d)?\b/g,'').replace(/\b(men'?s|mens)\b/ig,''));}
  function guessTitle(c){
    var a=nm(c.team1_full_name||c.team1_code),b=nm(c.team2_full_name||c.team2_code);
    if(a&&b)return a+' v '+b;
    var p=vsParse(c.details)||vsParse(c.btn_text)||vsParse(c.title)||vsParse(c.name);
    if(p)return p[0]+' v '+p[1];
    return a||b||String(c.details||c.tournament||c.title||c.name||c.game||'Match').trim();
  }
  function fit(el){
    ((el&&el.querySelectorAll)?el:root).querySelectorAll('.sxs-bar').forEach(function(el){
      var fs=parseFloat(getComputedStyle(el).fontSize)||16;el.style.fontSize='';fs=parseFloat(getComputedStyle(el).fontSize)||16;
      while(el.scrollWidth>el.clientWidth+1&&fs>9){fs-=.5;el.style.fontSize=fs+'px';}
    });
  }
  function shortOf(n){n=String(n||'').trim();if(!n)return '';if(n.length<=4)return n.toUpperCase();var w=n.split(/\s+/).filter(Boolean);return (w.length>1?w.map(function(x){return x[0];}).join('').slice(0,3):n.slice(0,3)).toUpperCase();}
  function hue(n){var h=0;for(var i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%360;return 'hsl(335,'+(30+h%30)+'%,'+(16+h%12)+'%)';}
  function ini(n){var w=String(n||'?').trim().split(/\s+/);return (w.length>1?w[0][0]+w[1][0]:String(n||'?').slice(0,2)).toUpperCase();}
  function lgHtml(t){
    var u='<u style="--c:'+hue(t.n)+'">'+esc(ini(t.n))+'</u>';
    return t.i?'<img src="'+esc(t.i)+'" alt="" data-ini="'+esc(ini(t.n))+'" data-c="'+hue(t.n)+'" loading="lazy">':u;
  }
  function teamsOf(it){
    var c=it.raw||{};
    if(it.src==='s'){
      var a=nm(c.team1_full_name||c.team1_code),b=nm(c.team2_full_name||c.team2_code);
      if(a&&b)return [{n:a,s:(c.team1_code||shortOf(a)).toUpperCase(),i:c.team1_icon_url},{n:b,s:(c.team2_code||shortOf(b)).toUpperCase(),i:c.team2_icon_url}];
    }
    var p=vsParse(it.title);
    return p?[{n:p[0],s:shortOf(p[0])},{n:p[1],s:shortOf(p[1])}]:null;
  }
  function tmHtml(it){
    if(!it.tm)return '';
    return '<div class="sxs-tm">'+it.tm.map(function(t,k){return (k?'<b>v</b>':'')+'<div class="tm"><span class="lg">'+lgHtml(t)+'</span><em>'+esc(t.s)+'</em></div>';}).join('')+'</div>';
  }
  var RUN='<circle cx="15.5" cy="4.5" r="1.9"/><path d="M13 8.2 10.8 13.2M13 8.2l3.2 3.3 3-.9M13 8.2 9.8 10 6.6 8.8M10.8 13.2l3.4 3.2-1 4.4M10.8 13.2 7.6 15.6 4.8 18"/>';
  function runIcon(){
    document.querySelectorAll('#hs-rail a,.pcqn-item[data-sxtab="matches"],#wcs-matches,.mtab[data-sxtab="matches"]').forEach(function(el){
      var sp=el.querySelector('span'),isRail=el.closest('#hs-rail');
      if(isRail&&!(sp&&sp.textContent==='Sports'))return;
      var sv=el.querySelector('svg');if(!sv)return;
      sv.setAttribute('viewBox','0 0 24 24');sv.setAttribute('fill','none');sv.setAttribute('stroke','currentColor');sv.setAttribute('stroke-width',isRail?'2':'2.2');sv.setAttribute('stroke-linecap','round');sv.setAttribute('stroke-linejoin','round');
      sv.innerHTML=RUN;
    });
  }
  function sameDay(d){var n=new Date();return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()&&d.getDate()===n.getDate();}
  function dayKey(){var n=new Date();return n.getFullYear()+'-'+n.getMonth()+'-'+n.getDate();}
  function clock(ms){var d=new Date(ms),h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0'),ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+m+' '+ap;}
  function whenLabel(ms){
    if(!isFinite(ms))return '';var d=new Date(ms);
    if(sameDay(d))return 'Today, '+clock(ms);
    var t=new Date();t.setDate(t.getDate()+1);
    if(d.toDateString()===t.toDateString())return 'Tomorrow, '+clock(ms);
    return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}).toUpperCase()+', '+clock(ms);
  }
  function sportKey(x){return String(x||'Other').trim().toLowerCase();}
  /* ═════ one card per fixture: CMS sheet + FanCode + SonyLIV merged, every source becomes a server ═════ */
  function nk(t){return String(t||'').toLowerCase().replace(/\[[^\]]*\]/g,' ').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();}
  function lev(a,b){var m=a.length,n=b.length,d=[],i,j;for(i=0;i<=m;i++)d[i]=[i];for(j=1;j<=n;j++)d[0][j]=j;
    for(i=1;i<=m;i++)for(j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n];}
  function sameTeam(a,b){
    if(window.sxQual&&sxQual(a)!==sxQual(b))return false;            /* India != India Women != India U19 */
    if(window.sxLeagueTag&&sxLeagueTag(a)!==sxLeagueTag(b))return false;   /* West Indies != West Indies Champions */
    if(window.sxTeamVariant&&sxTeamVariant(a,b))return false;   /* India != India A, Brazil != Brazil U20 */
    a=nk(nm(a));b=nk(nm(b));if(!a||!b)return false;if(a===b)return true;
    if(Math.min(a.length,b.length)>=3&&(a.indexOf(b)===0||b.indexOf(a)===0))return true;
    var ta=a.split(' '),tb=b.split(' '),sh=ta.length<=tb.length?ta:tb,lo=ta.length<=tb.length?tb:ta;
    if(sh.length<lo.length&&sh.every(function(w){return w.length>=3&&lo.some(function(v){return v===w||(w.length>=4&&v.indexOf(w)===0);});}))return true;   /* "Madrid" in "Real Madrid" */
    if(ta.length===1&&tb.length===1&&Math.min(a.length,b.length)>=4){var n=0;while(n<a.length&&a[n]===b[n])n++;if(n>=4&&n/Math.min(a.length,b.length)>=0.8)return true;}   /* "Barca" ~ "Barcelona" */
    return 1-lev(a,b)/Math.max(a.length,b.length)>=0.8;
  }
  function sideEq(A,B){return A.some(function(a){return B.some(function(b){return sameTeam(a,b);});});}
  function cleanT(t){return String(t||'').replace(/\[[^\]]*\]/g,' ').replace(/^\s*(live|upcoming|completed)\s*[-:\u2013\u2014]\s*/i,'').replace(/\s+/g,' ').trim();}
  function sidesOf(it){
    var c=it.raw||{};
    if(it.src==='s'){
      var a=[c.team1_full_name,c.team1_code].filter(Boolean),b=[c.team2_full_name,c.team2_code].filter(Boolean);
      if(a.length&&b.length)return [a,b];
    }
    var p=vsParse(cleanT(it.title));return p?[[p[0]],[p[1]]]:null;
  }
  var MONRE='(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*';
  function dateInTitle(t){      /* "29 Sep 2026" / "Sep 29" written in a feed title -> noon of that day */
    t=String(t||'');var m=t.match(new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+'+MONRE+'\\.?(?:,?\\s*(\\d{4}))?','i')),d,mo,y;
    if(m){d=+m[1];mo=m[2];y=m[4];}else{m=t.match(new RegExp('\\b'+MONRE+'\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?','i'));if(!m)return NaN;mo=m[1];d=+m[2];y=m[3];}
    var x=new Date((y||new Date().getFullYear())+' '+mo.slice(0,3)+' '+d+' 12:00');return isNaN(x.getTime())?NaN:x.getTime();
  }
  function dateOK(x,y){
    var fa=isFinite(x.at),fb=isFinite(y.at);
    if(fa&&fb){
      if(!x.approx&&!y.approx&&Math.abs(x.at-y.at)<=6*3600e3)return true;                    /* same kickoff (tolerates midnight / small time differences) */
      return new Date(x.at).toDateString()===new Date(y.at).toDateString();                  /* same calendar day */
    }
    var k=fa?x:fb?y:null,u=fa?y:x;if(!k)return true;                                          /* neither has a date: names decide */
    if(u.live&&!k.live&&Math.abs(k.at-Date.now())>14*3600e3)return false;                      /* live now vs a fixture days away = different match */
    return true;
  }
  function sameFix(x,y){
    if(!!x.fin!==!!y.fin)return false;
    var A=x.sd,B=y.sd;
    if(A&&B){if(!((sideEq(A[0],B[0])&&sideEq(A[1],B[1]))||(sideEq(A[0],B[1])&&sideEq(A[1],B[0]))))return false;}
    else if(A||B)return false;
    else{var ta=nk(cleanT(x.title)),tb=nk(cleanT(y.title));if(!ta||ta!==tb)return false;}
    if(!dateOK(x,y))return false;
    var sa=x.sport,sb=y.sport;
    if(sa&&sb&&!/^(other|sports?|live|events?)$/i.test(sa)&&!/^(other|sports?|live|events?)$/i.test(sb)&&window.sxSameSport&&!sxSameSport(sa,sb))return false;
    return true;
  }
  function cloneSv(v){return {url:v.url,text:v.text,icon:v.icon,sub:v.sub,playName:v.playName,appOnly:!!v.appOnly,fcxLive:v.fcxLive,fcxTime:v.fcxTime};}
  /* every server of every source, de-duplicated by URL: CMS sheet servers -> FanCode -> SonyLIV languages */
  function getServers(it){
    var out=[];function add(v){if(!v||!v.url)return;var u=String(v.url).trim();if(!u||u==='#')return;if(out.some(function(o){return String(o.url).trim()===u;}))return;out.push(cloneSv(v));}
    (it.members||[it]).forEach(function(m){
      if(m.src==='s'){try{(sxGetMatchServers(m.raw)||[]).forEach(add);}catch(e){}}
      else if(m.src==='f'){
        try{add({url:fcxJsUrl(m.raw),text:'FanCode',fcxLive:m.raw.status==='LIVE',fcxTime:fcxFmtMatchTime(m.raw)});}catch(e){}
        try{((window.LMX&&LMX.serversForFcx(m.raw))||[]).forEach(add);}catch(e){}
      }else if(m.src==='x'){(m.raw.servers||[]).forEach(add);}
    });
    return out;
  }
  function openMerged(it){
    var sv=getServers(it);
    var sm=(it.members.filter(function(m){return m.src==='s';})[0]||{}).raw||{},xm=(it.members.filter(function(m){return m.src==='x';})[0]||{}).raw||{};
    var nmz=xm.names||[];
    openMatchWatchScreen(sv,{
      name:it.title,
      team1_code:sm.team1_code||'',team1_full_name:sm.team1_full_name||nmz[0]||'',team1_icon_url:sm.team1_icon_url||xm.t1||'',
      team2_code:sm.team2_code||'',team2_full_name:sm.team2_full_name||nmz[1]||'',team2_icon_url:sm.team2_icon_url||xm.t2||'',
      date_label:it.time||'',details:it.tour||it.sport||'',
      countdown:(!it.live&&!it.fin&&isFinite(it.at)&&!it.approx)?new Date(it.at).toISOString():'',
      status:it.live?'live':it.fin?'finished':'upcoming',banner:it.img||''
    });
  }
  var SRCN={s:'CMS',f:'FanCode',x:'SonyLIV'};
  function collect(){
    var raw=[],sheet=window._matchCardsData||[],fcx=window._fcxMatchesCache||[];
    /* ── source 1: CMS / Google-Sheet MATCH CARDS ── */
    sheet.forEach(function(c){
      var live=false,fin=false;try{live=matchStatusText(c).toLowerCase()==='live';fin=!live&&isMatchFinished(c);}catch(e){}
      var sp='Other';try{sp=(window.sxSheetSport?sxSheetSport(c):(c.sport||c.sports))||'Other';}catch(e){}
      raw.push({src:'s',raw:c,title:guessTitle(c),sport:String(sp).trim()||'Other',tour:sheetTourReal(c,sp),tourG:guessTour([c.game,guessTitle(c),c.btn_text,c.title],sp),live:live,fin:fin,at:startMs(c),img:c.banner_url||c.banner_image_url||c._fcxBanner||'',i1:c.team1_icon_url,i2:c.team2_icon_url,c1:c.team1_code,c2:c.team2_code});
    });
    /* ── source 2: FanCode API ── */
    fcx.forEach(function(m){
      var g='Other';try{g=fcxResolveSport(m.category,m.tournament,m.title)||'Other';}catch(e){g=m.category||'Other';}
      raw.push({src:'f',raw:m,title:(function(){var p=vsParse(m.title);return p?p[0]+' v '+p[1]:(m.title||m.tournament||'Match');})(),sport:g,tour:(function(){var v=cleanTour(m.tournament);return isGenericT(v,g)?'':v;})(),tourG:guessTour([m.title,m.tournament,m.category],g),live:m.status==='LIVE',fin:m.status==='COMPLETED',at:(m.time&&m.time.getTime&&!isNaN(m.time.getTime()))?m.time.getTime():Infinity,img:m.image||''});
    });
    /* ── source 3: SonyLIV API (already merged per language by LMX) ── */
    try{((window.LMX&&LMX.items)||[]).forEach(function(x){
      var st=x.status==='LIVE'?'L':x.status==='ENDED'?'E':'U';
      var sp=x.category||'Other';try{sp=fcxResolveSport(x.category,x.title)||sp;}catch(e){}
      var at=x.start?x.start.getTime():Infinity,approx=false;
      if(!isFinite(at)){var dt=dateInTitle(x.title);if(isFinite(dt)){at=dt;approx=true;}}                 /* date written in the title counts as its date */
      raw.push({src:'x',raw:x,title:x.title||'Match',sport:sp,tour:(function(){var v=cleanTour(x.tour);return isGenericT(v,sp)?'':v;})(),tourG:guessTour([x.title,x.tour,x.category],sp),live:st==='L',fin:st==='E',at:at,approx:approx,img:x.poster||''});
    });}catch(e){}
    raw.forEach(function(it){it.sd=sidesOf(it);});
    /* ── merge: same two teams (either order) + same date  ->  ONE card ── */
    var groups=[];
    raw.forEach(function(it){
      var g=groups.filter(function(g){return g.members.some(function(m){return sameFix(m,it);});})[0];
      if(g)g.members.push(it);else groups.push({members:[it]});
    });
    var out=groups.map(function(g){
      var ms=g.members,p=ms[0],it={};for(var k in p)it[k]=p[k];
      it.members=ms;it.live=ms.some(function(m){return m.live;});it.fin=!it.live&&ms.every(function(m){return m.fin;});
      var exact=ms.filter(function(m){return isFinite(m.at)&&!m.approx;})[0]||ms.filter(function(m){return isFinite(m.at);})[0];
      it.at=exact?exact.at:Infinity;it.approx=!!(exact&&exact.approx);
      var pick=function(f){for(var i=0;i<ms.length;i++){var v=f(ms[i]);if(v)return v;}return '';};
      it.img=pick(function(m){return m.img;});
      (function(){ var mn=ms.filter(function(m){return m.src==='s'&&m.raw&&(m.raw.banner_url||m.raw.banner_image_url);})[0], wx=ms.filter(function(m){return m.src==='x'&&m.raw&&m.raw.wposter;})[0]; if(mn)it.img=mn.raw.banner_url||mn.raw.banner_image_url; else if(wx)it.img=wx.raw.wposter; })();
      var _o={s:0,f:1,x:2},_by=ms.slice().sort(function(a,b){return _o[a.src]-_o[b.src];});
      var _real=_by.filter(function(m){return m.tour;})[0],_gs=_by.filter(function(m){return m.tourG;})[0];
      it.tourSrc=_real?_real.src:'';
      it.tour=_real?_real.tour:(_gs?_gs.tourG:'');
      var names=[];ms.forEach(function(m){var n=SRCN[m.src];if(names.indexOf(n)<0)names.push(n);});
      it.srcName=(names.length===1&&names[0]==='CMS')?'':names.join(' + ');
      var sp=pick(function(m){return !/^(other|sports?|live|events?)$/i.test(m.sport||'')&&m.sport;});it.sport=it.game=sp||p.sport;
      it.time=isFinite(it.at)?(it.approx?whenLabel(it.at).replace(/,\s*\d+:\d+\s*[AP]M/,''):whenLabel(it.at)):(p.src==='s'&&window.smoCardDateLabel?smoCardDateLabel(p.raw):'');
      if(ms.length>1)delete it.play;                                                                        /* a merged card always opens the combined server screen */
      return it;
    });
    /* ── SAME DAY ONLY: live right now, or scheduled / finished on today's calendar date ── */
    out=out.filter(function(it){   /* 12h after start time -> gone (API feeds that still report LIVE are kept) */
      if(isFinite(it.at)&&!it.approx&&Date.now()>=it.at+12*3600e3&&!it.members.some(function(m){return m.src!=='s'&&m.live;}))return false;
      return true;});
    out=out.filter(function(it){return it.live||!it.fin||(isFinite(it.at)&&sameDay(new Date(it.at)));});   /* every listed live + upcoming match (any date); finished ones only for today */
    var spell={};out.forEach(function(it){var k=sportKey(it.sport);try{var d=window.sxDetectSport?sxDetectSport(it.sport,'',''):'';if(d)k=d.toLowerCase();}catch(e){}if(!spell[k])spell[k]=it.sport;it.sport=it.game=spell[k];});
    out.forEach(function(it){if(!it.tour)it.tour=tourFallback(it.sport);});
    /* same tournament spelt differently by different sources -> ONE header (the sheet's own spelling wins) */
    var _disp={};
    out.forEach(function(it){var k=tkey(it.tour);if(!k)return;var d=_disp[k];if(!d||(it.tourSrc==='s'&&d.src!=='s'))_disp[k]={name:it.tour,src:it.tourSrc};});
    out.forEach(function(it){var k=tkey(it.tour);if(k&&_disp[k])it.tour=_disp[k].name;});
    out.forEach(function(it){it.tm=teamsOf(it);});
    out.sort(function(a,b){var ra=a.live?0:a.fin?2:1,rb=b.live?0:b.fin?2:1;return ra-rb||(ra===2?b.at-a.at:a.at-b.at);});
    return out;
  }
  function logo(src,code){return src?'<img src="'+esc(src)+'" alt="" onerror="this.replaceWith(document.createTextNode(\''+esc(code||'')+'\'))">':esc(code||'');}
  function card(it,k){
    var bg=it.img?'<img class="'+''+'" loading="lazy" decoding="async" src="'+esc(it.img)+'" alt="" onerror="this.style.display=\'none\'">':'';
    var th=bg+(it.img?'':(it.tm?tmHtml(it):'<div class="sxs-vs"><span>'+logo(it.i1,it.c1)+'</span><b>VS</b><span>'+logo(it.i2,it.c2)+'</span></div>'));
    var bd=it.live?'<i class="sxs-live"><u></u>LIVE</i>':it.fin?'<i class="sxs-end">ENDED</i>':(it.time?'<i class="sxs-time">'+esc(it.time)+'</i>':'');
    return '<div class="sxs-card" data-k="'+k+'" role="button" tabindex="0"><div class="sxs-th">'+th+bd+'</div><div class="sxs-bar" title="'+esc(evTeamName(it.title))+'">'+esc(evTeamName(it.title))+'</div></div>';
  }
  function row(title,inner){
    return '<section class="sxs-sec"><h2 class="sxs-t">'+esc(title)+'</h2><div class="sxs-wrap"><button class="sxs-btn l" type="button" aria-label="Scroll left">&#10094;</button><div class="sxs-track">'+inner+'</div><button class="sxs-btn r" type="button" aria-label="Scroll right">&#10095;</button></div></section>';
  }
  function tiles(list){
    var m={};
    list.forEach(function(it){if(it.fin)return;var key=it.tour||it.game,e=m[key]||(m[key]={name:key,n:0,live:0,it:it});e.n++;if(it.live)e.live++;});
    return Object.keys(m).map(function(k){return m[k];}).sort(function(a,b){return b.live-a.live||b.n-a.n;}).slice(0,14);
  }
  function render(){
    all=collect();
    var sig=all.map(function(i){return i.title+(i.live?'L':i.fin?'F':'U')+i.time;}).join('|')+'#'+sel.game+'#'+sel.tour+'#'+(sel.hero||'')+'#'+dayKey()+(all.length?'':(Date.now()-t0>8000?'e':'l'));
    if(sig===lastSig)return;lastSig=sig;try{hidePop();}catch(e){}
    var cnt={},lv={};all.forEach(function(i){cnt[i.sport]=(cnt[i.sport]||0)+1;if(i.live)lv[i.sport]=1;});
    var sports=Object.keys(cnt).sort(function(a,b){return (lv[b]?1:0)-(lv[a]?1:0)||cnt[b]-cnt[a];});
    if(sel.game&&!cnt[sel.game])sel.game='';
    if(sel.tour&&!all.some(function(i){return i.tour===sel.tour;}))sel.tour='';
    var dt=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});
    var h='<h1 class="sxs-h1">Sports</h1><div class="sxs-day">Today \u00B7 '+esc(dt)+(all.length?' \u00B7 '+all.length+' match'+(all.length>1?'es':''):'')+'</div>';
    if(all.length)h+='<div class="sxs-chips"><button class="sxs-chip'+(sel.game?'':' on')+'" data-g="">All</button>'+sports.map(function(g){return '<button class="sxs-chip'+(sel.game===g?' on':'')+'" data-g="'+esc(g)+'">'+esc(g)+'</button>';}).join('')+'</div>';
    if(!all.length){root.innerHTML=h+'<div class="sxs-empty">'+(Date.now()-t0>8000?'No matches scheduled for today. Check back soon.':'<span class="ev-rl"></span>')+'</div>';return;}
    var idx=function(it){return all.indexOf(it);};
    var list=sel.game?all.filter(function(i){return i.sport===sel.game;}):all;
    if(sel.tour)list=list.filter(function(i){return i.tour===sel.tour;});
    var live=list.filter(function(i){return i.live;});
    if(sel.tour)h+='<div class="sxs-chips"><button class="sxs-chip on" data-g="">\u2715 '+esc(sel.tour)+'</button></div>';
    /* ── Popular Tournaments rail ── */
    if(!sel.tour){
      var tl=tiles(list);
      if(tl.length>1)h+=row('Popular Tournaments',tl.map(function(t){
        return '<div class="sxs-tile sxs-tt" data-t="'+esc(t.name)+'" role="button" tabindex="0">'+(t.it&&t.it.img?'<img class="sxs-ti" decoding="async" alt="" src="'+esc(t.it.img)+'" onerror="this.remove()">':'')+'<u>'+esc(ini(t.name))+'</u><span>'+esc(t.name)+'</span>'+(t.live?'<i class="sxs-tl">LIVE</i>':'')+'</div>';
      }).join(''));
    }
    if(live.length)h+=row('Live Now',live.map(function(i){return card(i,idx(i));}).join(''));
    /* tournaments: ordinary rows further down the page (not a category list) */
    var tm={},order=[];
    list.forEach(function(i){
      if(i.live||i.fin)return;
      var k=i.tour||i.sport;
      if(!tm[k]){tm[k]={name:k,items:[],first:i.at};order.push(tm[k]);}
      tm[k].items.push(i);if(i.at<tm[k].first)tm[k].first=i.at;
    });
    order.sort(function(a,b){return a.first-b.first;});
    order.forEach(function(t){h+=row(t.name,t.items.map(function(i){return card(i,idx(i));}).join(''));});
    var fin=list.filter(function(i){return i.fin;});
    if(fin.length)h+=row('Completed Today',fin.map(function(i){return card(i,idx(i));}).join(''));
    if(!live.length&&!order.length&&!fin.length)h+='<div class="sxs-empty">No matches today for this sport.</div>';
    root.innerHTML=h;
    var w=root.querySelector('.sxs-th');if(w)root.style.setProperty('--sxs-h',w.offsetHeight+'px');
    requestAnimationFrame(fit);
  }
  window.addEventListener('resize',function(){clearTimeout(fit._t);fit._t=setTimeout(fit,150);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){requestAnimationFrame(fit);});
  function open(it){
    if(it.members&&it.members.length>1){var _n=0;try{_n=getServers(it).length;}catch(e){}if(_n){openMerged(it);return;}}
    /* SonyLIV-only cards (no sheet / FanCode twin) and any card with zero stream links: always open the server selector */
    if(it.members&&it.members.length&&!it.play){var _n2=0;try{_n2=getServers(it).length;}catch(e){}var _hx=it.members.some(function(m){return m.src==='x';});if(_hx||!_n2){openMerged(it);return;}}
    if(it.play){it.play();return;}
    if(it.members&&it.members[0]&&it.members[0].src!==it.src){it=it.members[0];}
    if(it.play){it.play();return;}
    var d=document.createElement('div');
    try{d.innerHTML=it.src==='s'?sxMatchCardHtml(it.raw):sxFcxMatchCardHtml(it.raw);}catch(e){return;}
    var a=d.querySelector('a.smo-btn,a');if(a)a.click();
  }
  root.addEventListener('click',function(e){
    var c=e.target.closest('.sxs-card'),t=e.target.closest('.sxs-tile'),ch=e.target.closest('.sxs-chip'),b=e.target.closest('.sxs-btn'),hb=e.target.closest('.sxs-hero-btn,.sxs-hth');
    if(hb){var hk=+hb.getAttribute('data-k'),hi=all[hk];if(hi){if(hb.classList.contains('sxs-hero-btn'))open(hi);else{sel.hero=hi.title;lastSig='';render();}}return;}
    if(b){var tr=b.parentNode.querySelector('.sxs-track');tr.scrollBy({left:(b.classList.contains('l')?-1:1)*tr.clientWidth*.85,behavior:'smooth'});return;}
    if(ch){sel={game:ch.getAttribute('data-g'),tour:''};lastSig='';render();return;}
    if(t){sel={game:'',tour:t.getAttribute('data-t')};lastSig='';render();panel.scrollTop=0;return;}
    if(c){var it=all[+c.getAttribute('data-k')];if(it)open(it);}
  });
  document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.dataset&&t.dataset.ini!==undefined&&t.closest('#sxs-root,#sxs-pop')){var u=document.createElement('u');u.style.setProperty('--c',t.dataset.c||'#9d6bff');u.textContent=t.dataset.ini;t.replaceWith(u);}},true);
  root.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&(e.target.classList.contains('sxs-card')||e.target.classList.contains('sxs-tile')||e.target.classList.contains('sxs-hth'))){e.preventDefault();e.target.click();}});
  /* ═════ hover preview card (Hotstar-style full info) ═════ */
  var pop=document.createElement('div');pop.id='sxs-pop';document.body.appendChild(pop);
  var popIt=null,showT=0,hideT=0,curCard=null;
  function canHover(){return window.matchMedia&&matchMedia('(min-width:901px) and (hover:hover)').matches;}
  function hidePop(){clearTimeout(showT);clearTimeout(hideT);pop.classList.remove('on');curCard=null;popIt=null;}
  function descOf(it){
    var st=it.live?'Streaming live right now':it.fin?'This match has finished':(it.time?'Starts '+it.time:'Coming up soon');
    var raw=it.raw||{},extra=String(raw.details&&raw.details!==it.tour?raw.details:'').trim();
    var d=it.title+(it.tour?' \u2014 '+it.tour:'')+(it.sport&&it.sport!==it.tour?' ('+it.sport+')':'')+'. '+st+'.';
    if(extra&&extra!==it.title&&typeof extra==='string'&&extra.length<140)d+=' '+extra+'.';
    return d.replace(/\.\./g,'.');
  }
  function showPop(c){
    var it=c.hasAttribute('data-r')?(window.__sxsReg||[])[+c.getAttribute('data-r')]:(c.hasAttribute('data-k')?all[+c.getAttribute('data-k')]:null);if(!it||!canHover())return;
    popIt=it;curCard=c;
    var th=c.querySelector('.sxs-th'),r=c.getBoundingClientRect(),tr=th.getBoundingClientRect();
    var W=Math.min(340,innerWidth-16);pop.style.width=W+'px';
    var nsv=0;try{nsv=it.chips?0:getServers(it).length;}catch(e){}
    var chips=it.chips||((it.live?'<i class="lv">LIVE NOW</i>':it.fin?'<i>ENDED</i>':'<i>UPCOMING</i>')+(it.sport?'<i>'+esc(it.sport)+'</i>':'')+(it.tour&&it.tour!==it.sport?'<i>'+esc(it.tour)+'</i>':'')+((it.time&&!it.live)?'<i>'+esc(it.time)+'</i>':'')+(nsv>1?'<i>'+nsv+' servers</i>':''));
    var sv=[];if(it.src==='s'){try{sv=sxGetMatchServers(it.raw)||[];}catch(e){}}else if(it.src==='f'){sv=[{text:'FanCode'}];try{if(window.LMX)sv=sv.concat(window.LMX.serversForFcx(it.raw)||[]);}catch(e){}}
    sv=it._sv=[];
    var srv=sv.length?'<div class="ps-row">'+sv.map(function(x,i){return '<span class="ps" data-s="'+i+'">'+esc(x.text||('Server '+(i+1)))+'</span>';}).join('')+'</div>':'';
    if(it.poster&&it.mraw){
      var mm=it.mraw,gs=String(mm.genre||'').split(/[,|]/).map(function(x){return x.trim();}).filter(Boolean).slice(0,3),rt=parseFloat(mm.rating),isTv=it.mtype==='tv';
      var pchips='<i>'+(isTv?'TV SHOW':'MOVIE')+'</i>'+(mm.year?'<i>'+esc(mm.year)+'</i>':'')+(rt?'<i>\u2605 '+rt.toFixed(1)+'</i>':'')+gs.map(function(g){return '<i>'+esc(g)+'</i>';}).join('');
      var pdesc=(isTv?'Stream ':'Watch ')+it.title+(mm.year?' ('+mm.year+')':'')+(gs.length?' \u2014 '+gs.join(', ').toLowerCase()+(isTv?' series':' movie'):'')+(rt?'. Rated '+rt.toFixed(1)+'/10':'')+'. '+(isTv?'Pick a season and episode to start.':'Free to stream in HD.');
      pop.innerHTML='<div class="sxs-th sxs-pth" style="--pbg:url(&quot;'+esc(it.img)+'&quot;)"><img src="'+esc(it.img)+'" alt=""></div><div class="pb"><div class="pt">'+esc(it.title)+'</div><div class="pm">'+pchips+'</div><p class="pd">'+esc(pdesc)+'</p><span class="pw">\u25B6 '+(isTv?'Watch Show':'Watch Movie')+'</span></div>';
    } else
    pop.innerHTML='<div class="sxs-th">'+th.innerHTML+'</div><div class="pb"><div class="pt">'+esc(it.title)+'</div><div class="pm">'+chips+'</div><p class="pd">'+esc(it.desc||descOf(it))+'</p>'+srv+'<span class="pw">'+(it.fin?'\u25B6 View':'\u25B6 Watch')+'</span></div>';
    var h=pop.offsetHeight,thH=W*9/16;
    var left=r.left+r.width/2-W/2,top=tr.top-(thH-tr.height)/2;
    var minL=(innerWidth>900?72:0)+8;
    left=Math.max(minL,Math.min(left,innerWidth-W-8));
    top=Math.max(8,Math.min(top,innerHeight-h-8));
    pop.style.left=left+'px';pop.style.top=top+'px';
    pop.classList.add('on');
  }
  function hoverBind(el){
  el.addEventListener('mouseover',function(e){
    if(!canHover())return;var c=e.target.closest('.sxs-card');if(!c)return;
    clearTimeout(hideT);if(c===curCard)return;clearTimeout(showT);
    showT=setTimeout(function(){showPop(c);},280);
  });
  el.addEventListener('mouseout',function(e){
    var c=e.target.closest('.sxs-card');if(!c)return;
    var to=e.relatedTarget;if(to&&(c.contains(to)||pop.contains(to)))return;
    clearTimeout(showT);hideT=setTimeout(hidePop,120);
  });
  }
  hoverBind(root);
  pop.addEventListener('mouseenter',function(){clearTimeout(hideT);});
  pop.addEventListener('mouseleave',function(){hideT=setTimeout(hidePop,120);});
  pop.addEventListener('click',function(e){
    var it=popIt,b=e.target.closest('.ps');hidePop();if(!it)return;
    if(b&&it._sv){var x=it._sv[+b.getAttribute('data-s')];
      if(x&&x.url&&!/fancode/i.test(x.text||'')&&x.fcxLive===undefined){openStreamPlayer(matchWatchHref(x.url),it.title,'match');return;}}
    open(it);
  });
  panel.addEventListener('scroll',hidePop,{passive:true});
  root.addEventListener('scroll',hidePop,true);
  window.addEventListener('blur',hidePop);
  window.addEventListener('resize',hidePop);

  window.__sxs={esc:esc,card:card,all:function(){return all;},refresh:function(){return (all=collect());},open:open,hover:hoverBind,fit:fit,tiles:tiles,ini:ini,
    openTour:function(n){try{window.openMatches();}catch(e){}sel={game:'',tour:n};lastSig='';render();try{panel.scrollTop=0;}catch(e){}}};
  /* labels: Matches -> Sports everywhere in the nav */
  function relabel(){
    document.querySelectorAll('#hs-rail a span,.pcqn-item[data-sxtab="matches"],#wcs-matches,.mtab[data-sxtab="matches"]').forEach(function(el){
      var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;
      while((n=w.nextNode())){if(/Matches/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/Live Matches|Matches/,'Sports');}
      if(el.getAttribute&&/Matches/.test(el.getAttribute('aria-label')||''))el.setAttribute('aria-label','Sports');
    });
  }
  function fixNav(){relabel();runIcon();}
  fixNav();setTimeout(fixNav,1500);setTimeout(fixNav,4000);
  var om=window.openMatches;
  window.openMatches=function(){var r=om.apply(this,arguments);sel={game:'',tour:''};lastSig='';t0=Date.now();render();return r;};
  setInterval(function(){if(panel.classList.contains('active'))render();},4000);
})();

;

(function(){
  var S=window.__sxs;if(!S)return;
  var esc=S.esc,REG=window.__sxsReg=[];
  function wrap(raw,kind,mk){if(raw._sxw)return raw._sxw;var w=mk(raw);w.kind=kind;w.ri=REG.push(w)-1;raw._sxw=w;return w;}
  function mvWrap(m,type){return wrap(m,type,function(m){
    var label=m.title+(m.year?' ('+m.year+')':'');
    return {title:m.title||'',img:m.poster_url||'',poster:true,mraw:m,mtype:type,play:function(){
      if(type==='tv'){vaPendingTvItem={id:m.tmdb_id||m.imdb_id,title:m.title};vaOpenTvModal(label);}
      else openStreamPlayer(vaBuildEmbedUrl(m.embed_url),label,'movie');}};});}
  function chWrap(c){return wrap(c,'ch',function(c){
    var live=(c.status_live_off||'').toUpperCase()==='LIVE',url=c.watch_url||'#',g=c.group||'Other',q=(c.quality||'').toUpperCase();
    return {title:c.channel_name||'Channel',img:c.icon_url||'',logo:true,live:live,
      chips:(live?'<i class="lv">LIVE NOW</i>':'<i>OFF AIR</i>')+'<i>'+esc(g)+'</i>'+((q==='HD'||q==='4K')?'<i>'+q+'</i>':''),
      desc:'Watch '+(c.channel_name||'this channel')+' live \u2014 a 24/7 channel from '+g+'.',
      play:function(){sxOpenChannelPayload(sxEncPayload({url:url,name:c.channel_name||'Live Stream',raw:!!(window.sxIsRawStreamUrl&&sxIsRawStreamUrl(url))}));}};});}
  function rc(w){
    var th=w.poster?(w.img?'<img loading="lazy" decoding="async" src="'+esc(w.img)+'" alt="" onerror="this.style.display=\'none\'">':'<div class="sxs-lo"><u>'+esc((w.title||'?').slice(0,2).toUpperCase())+'</u></div>')
      :'<div class="sxs-lo">'+(w.img?'<img loading="lazy" src="'+esc(w.img)+'" alt="" onerror="this.remove()">':'<u>'+esc((w.title||'?').slice(0,2).toUpperCase())+'</u>')+'</div>';
    var bd=w.live?'<i class="sxs-live"><u></u>LIVE</i>':'';
    return '<div class="sxs-card'+(w.poster?' sxs-po':'')+'" data-r="'+w.ri+'" role="button" tabindex="0"><div class="sxs-th">'+th+bd+'</div><div class="sxs-bar" title="'+esc(evTeamName(w.title))+'">'+esc(evTeamName(w.title))+'</div></div>';
  }
  function row(title,inner,va){
    return '<section class="sxs-sec"><h2 class="sxs-t">'+esc(title)+(va?'<a class="sxs-va" data-va="'+va+'">View All \u203A</a>':'')+'</h2><div class="sxs-wrap"><button class="sxs-btn l" type="button" aria-label="Scroll left">&#10094;</button><div class="sxs-track">'+inner+'</div><button class="sxs-btn r" type="button" aria-label="Scroll right">&#10095;</button></div></section>';
  }
  function after(el){
    el.querySelectorAll('.sxs-wrap').forEach(function(w){var t=w.querySelector('.sxs-th');if(t)w.style.setProperty('--sxs-h',t.offsetHeight+'px');});
    requestAnimationFrame(function(){S.fit(el);});
  }
  function bind(el,extra){
    S.hover(el);
    el.addEventListener('click',function(e){
      var b=e.target.closest('.sxs-btn'),va=e.target.closest('.sxs-va'),c=e.target.closest('.sxs-card'),ch=e.target.closest('.sxs-chip'),pt=e.target.closest('.hs-pop .sxs-tile');
      if(pt){S.openTour(pt.getAttribute('data-t'));return;}
      if(b){var tr=b.parentNode.querySelector('.sxs-track');tr.scrollBy({left:(b.classList.contains('l')?-1:1)*tr.clientWidth*.85,behavior:'smooth'});return;}
      if(va){var v=va.getAttribute('data-va');if(v==='m')openMatches();else if(v==='live'){if(window.openLiveTV)openLiveTV();}else if(window.hsmOpen)hsmOpen(v);return;}
      if(ch&&extra){extra(ch);return;}
      if(c){if(c.hasAttribute('data-k')){var it=S.all()[+c.getAttribute('data-k')];if(it)S.open(it);}else{var w=REG[+c.getAttribute('data-r')];if(w)w.play();}}
    });
    el.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('sxs-card')){e.preventDefault();e.target.click();}});
  }
  function top(arr,n){
    return arr.map(function(m){return [parseFloat(m.popularity)||0,m];}).sort(function(a,b){return b[0]-a[0];}).slice(0,n).map(function(x){return x[1];});
  }

  /* ═════ HOME ═════ */
  var fs=document.getElementById('fixtures-section');
  if(fs){
    var hr=document.createElement('div');hr.id='sxs-home';fs.parentNode.insertBefore(hr,fs.nextSibling);bind(hr);
    var hsig='',cache={m:[],t:[],mg:[],tg:[],n:-1,tn:-1,at:0};
    var homeRender=function(){
      var A=S.refresh(),lv=A.filter(function(i){return i.live;}).slice(0,12),up=A.filter(function(i){return !i.live&&!i.fin;}).slice(0,12),ms=lv.concat(up),now=Date.now();
      if(now-cache.at>6000||cache.n<0){
        if(cache.n!==vaPools.movie.all.length){cache.mg=top(vaPools.movie.all,window.__hsN||60);cache.m=cache.mg.slice(0,16);cache.n=vaPools.movie.all.length;}
        if(cache.tn!==vaPools.tv.all.length){cache.tg=top(vaPools.tv.all,window.__hsN||60);cache.t=cache.tg.slice(0,16);cache.tn=vaPools.tv.all.length;}
        cache.at=now;
      }
      var sig=S.tiles(A).map(function(t){return t.name+t.live;}).join('|')+'@'+ms.map(function(i){return i.title+(i.live?'L':'U')+i.time;}).join('|')+'#'+cache.m.map(function(m){return m.title;}).join(',')+'#'+cache.t.map(function(m){return m.title;}).join(',')+'#'+cache.mg.length+'/'+cache.tg.length+'#'+(window._cmsChannels||[]).map(function(c){return (c.status_live_off||'')[0]||'-';}).join('');
      if(sig===hsig)return;hsig=sig;
      var h='';
      /* mobile Sports home only: Popular Tournaments rail (CSS hides it everywhere else) */
      var ptl=S.tiles(A);
      if(ptl.length>1)h+=row('Popular Tournaments',ptl.map(function(t){return '<div class="sxs-tile sxs-tt" data-t="'+esc(t.name)+'" role="button" tabindex="0">'+(t.it&&t.it.img?'<img class="sxs-ti" decoding="async" alt="" src="'+esc(t.it.img)+'" onerror="this.remove()">':'')+'<u>'+esc(S.ini(t.name))+'</u><span>'+esc(t.name)+'</span>'+(t.live?'<i class="sxs-tl">LIVE</i>':'')+'</div>';}).join('')).replace('<section class="sxs-sec"','<section class="sxs-sec hs-pop"');
      if(lv.length)h+=row('Live Now',lv.map(function(i){return S.card(i,A.indexOf(i));}).join(''),'m');
      if(up.length)h+=row('Upcoming Today',up.map(function(i){return S.card(i,A.indexOf(i));}).join(''),'m');
      if(cache.m.length)h+=row('Movies',cache.m.map(function(m){return rc(mvWrap(m,'movie'));}).join(''),'movie');
      if(cache.t.length)h+=row('TV Shows',cache.t.map(function(m){return rc(mvWrap(m,'tv'));}).join(''),'tv');
      /* mobile-only vertical grids (shown by CSS in TV / Movies tabs): Live TV channels + TV Shows combined */
      var gsec=function(title,inner,va,k){return '<section class="sxs-sec hs-gsec hs-g-'+k+'"><h2 class="sxs-t">'+esc(title)+(va?'<a class="sxs-va" data-va="'+va+'">View All \u203A</a>':'')+'</h2><div class="sxs-grid hs-mgrid">'+inner+'</div></section>';};
      var chs=(window._cmsChannels||[]).filter(function(c){return c.channel_name;}).sort(function(a,b){return ((b.status_live_off||'').toUpperCase()==='LIVE')-((a.status_live_off||'').toUpperCase()==='LIVE');}).slice(0,120);
      if(chs.length)h+=gsec('Live TV',chs.map(function(c){return rc(chWrap(c));}).join(''),'live','live');
      if(cache.tg.length)h+=gsec('TV Shows',cache.tg.map(function(m){return rc(mvWrap(m,'tv'));}).join(''),'','tv');
      if(cache.mg.length)h+=gsec('Movies',cache.mg.map(function(m){return rc(mvWrap(m,'movie'));}).join(''),'','movies');
      h+='<div id="hs-more" style="height:80px"></div>';
      hr.innerHTML=h;after(hr);
      try{var mo=document.getElementById('hs-more');if(mo&&window.__hsIO){window.__hsIO.disconnect();window.__hsIO.observe(mo);}}catch(e){}
    };
    window.__hsN=60;
    window.__hsIO=window.IntersectionObserver?new IntersectionObserver(function(es){
      if(!es.some(function(e){return e.isIntersecting;}))return;
      var tot=Math.max(vaPools.movie.all.length,vaPools.tv.all.length);
      if(window.__hsN>=tot)return;
      window.__hsN+=90;cache.n=-1;cache.tn=-1;
      homeRender();
    },{rootMargin:'1200px 0px'}):null;
    homeRender();setInterval(homeRender,5000);
  }

  /* ═════ LIVE TV page ═════ */
  var lp=document.getElementById('livetv-page-inner'),ov=document.getElementById('livetv-overlay');
  if(lp){
    var lr=document.createElement('div');lr.id='sxs-live';
    lr.innerHTML='<h1 class="sxs-h1">Live TV</h1><div class="sxs-sb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" autocomplete="off" spellcheck="false" placeholder="Search channels\u2026"></div><div class="sxs-lbody"></div>';
    lp.insertBefore(lr,lp.firstChild);
    var lb=lr.querySelector('.sxs-lbody'),inp=lr.querySelector('input'),st={g:'',q:''},lsig='',ltm=0;
    /* channel category = dropdown (next to the search box) */
    var sbx=lr.querySelector('.sxs-sb'),lbar=document.createElement('div');lbar.className='sxs-lbar';
    sbx.parentNode.insertBefore(lbar,sbx);lbar.appendChild(sbx);
    var cs=document.createElement('select');cs.className='sxs-sel';cs.setAttribute('aria-label','Channel category');
    cs.innerHTML='<option value="">All Categories</option>';lbar.appendChild(cs);
    cs.addEventListener('change',function(){st.g=cs.value;lsig='';liveRender();});
    bind(lr,function(ch){st.g=ch.getAttribute('data-g');lsig='';liveRender();});
    var liveRender=function(){
      var all=(window._cmsChannels||[]).filter(function(c){return c.channel_name;});
      var q=st.q.toLowerCase().trim();
      var sig=all.length+'|'+all.map(function(c){return (c.status_live_off||'')[0];}).join('')+'#'+st.g+'#'+q;
      if(sig===lsig)return;lsig=sig;
      if(!all.length){lb.innerHTML='<div class="sxs-empty"><span class="ev-rl"></span></div>';return;}
      var gm={},gs=[];all.forEach(function(c){var g=(c.group||'Other').trim()||'Other';(gm[g]=gm[g]||[]).push(c);});
      gs=Object.keys(gm).sort(function(a,b){return gm[b].length-gm[a].length;});
      var opts='<option value="">All Categories ('+all.length+')</option>'+gs.map(function(g){return '<option value="'+esc(g)+'">'+esc(g)+' ('+gm[g].length+')</option>';}).join('');
      if(cs.dataset.sig!==opts){cs.innerHTML=opts;cs.dataset.sig=opts;}
      cs.value=st.g;
      var h='';
      var byLive=function(a,b){return ((b.status_live_off||'').toUpperCase()==='LIVE')-((a.status_live_off||'').toUpperCase()==='LIVE');};
      if(q||st.g){
        var l=all.filter(function(c){return (!st.g||(c.group||'Other').trim()===st.g)&&(!q||(c.channel_name||'').toLowerCase().indexOf(q)>-1);}).sort(byLive);
        h+=l.length?'<section class="sxs-sec"><div class="sxs-grid">'+l.map(function(c){return rc(chWrap(c));}).join('')+'</div></section>':'<div class="sxs-empty">No channels found.</div>';
      }else{
        var lv=all.filter(function(c){return (c.status_live_off||'').toUpperCase()==='LIVE';});
        if(lv.length>2)h+=row('Live Now',lv.slice(0,24).map(function(c){return rc(chWrap(c));}).join(''));
        gs.forEach(function(g){h+=row(g,gm[g].slice().sort(byLive).slice(0,30).map(function(c){return rc(chWrap(c));}).join(''));});
      }
      lb.innerHTML=h;after(lr);
    };
    inp.addEventListener('input',function(){clearTimeout(ltm);ltm=setTimeout(function(){st.q=inp.value;liveRender();},80);});
    liveRender();
    setInterval(function(){if(ov&&ov.classList.contains('open'))liveRender();},4000);
    if(ov)new MutationObserver(function(){if(ov.classList.contains('open')){lsig='';liveRender();}}).observe(ov,{attributes:true,attributeFilter:['class']});
  }
})();

;

(function(){
  var ov=document.createElement('div');ov.id='sxv';document.body.appendChild(ov);
  var tm=0,cur=null;
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function close(){ov.classList.remove('open');ov.innerHTML='';clearInterval(tm);cur=null;}
  var PLAY='<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.72L9.5 4.27A1 1 0 0 0 8 5.14z"/></svg>';
  var LOCK='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var FCX='https://www.fancode.com/skillup-uploads/fc-web-logo/fc_logo_white_bg.svg';
  var YT='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 46"><rect width="64" height="46" rx="12" fill="#FF0000"/><path d="M26 13.5v19l17-9.5z" fill="#fff"/></svg>');
  function isYt(x){return /youtube\.com|youtu\.be|youtube-nocookie/i.test(x.url||'')||/^\s*(youtube|yt)\b/i.test(x.text||'');}
  function fmt(ms){var t=Math.max(0,Math.floor(ms/1000)),d=Math.floor(t/86400),h=Math.floor(t%86400/3600),m=Math.floor(t%3600/60),s=t%60,p=function(n){return String(n).padStart(2,'0');};return (d?d+'d ':'')+p(h)+':'+p(m)+':'+p(s);}
  function build(servers,info){
    info=info||{};cur={servers:servers,info:info};
    var label=info.name||'Live Stream',live=info.status==='live',fin=info.status==='finished';
    var startMs=(function(){var d=new Date(info.countdown||'');return isNaN(d.getTime())?null:d.getTime();})();
    var started=live||fin,locked=!started&&!(startMs!==null&&Date.now()>=startMs-30*60*1000);
    var startText='';try{startText=sxFmtMatchStartTime(info);}catch(e){}
    var isF=function(x){return (x.text||'').trim().toLowerCase()==='fancode';};
    var list=(servers||[]).slice().sort(function(a,b){return (isF(a)?0:1)-(isF(b)?0:1);});
    var bg=info.banner||'';
    var hero=(bg?'<img class="bg" src="'+esc(bg)+'" alt="" onerror="this.style.display=\'none\'">':'')+
      ((!bg&&(info.team1_icon_url||info.team2_icon_url))?'<div class="sxv-tm"><img src="'+esc(info.team1_icon_url||'')+'" alt="" onerror="this.style.visibility=\'hidden\'"><b>v</b><img src="'+esc(info.team2_icon_url||'')+'" alt="" onerror="this.style.visibility=\'hidden\'"></div>':'');
    var badge=live?'<span class="sxv-bd lv"><u></u>LIVE NOW</span>':fin?'<span class="sxv-bd">FINISHED</span>':'<span class="sxv-bd">UPCOMING</span>';
    var meta=[info.details,info.date_label].filter(Boolean).map(esc).join(' \u00b7 ');
    var cd=(!started&&startMs)?'<span class="sxv-cd" id="sxvCd"></span>':'';
    var items=list.map(function(x,i){
      var f=isF(x),ready=f?!!x.fcxLive:!locked,raw=false;try{raw=!f&&ready&&sxIsRawStreamUrl(x.url);}catch(e){}
      var lg=f?FCX:(isYt(x)?YT:(sxFindLiveTvLogoForLabel(x.text)||x.icon||sxServerKeywordLogo(x.text)||''));
      var ic=lg?'<img src="'+esc(lg)+'" alt="" loading="lazy" onerror="this.outerHTML=\'<i>'+(i+1)+'</i>\'">':'<i>'+(i+1)+'</i>';
      var sub=!ready?(f?(x.fcxTime?'Starts '+esc(x.fcxTime):'Not live yet'):'Opens '+esc(startText||'before kickoff')):(raw?'Direct stream \u2022 opens in VLC':esc(x.sub||'Tap to play'));
      return '<button type="button" class="sxv-s'+(ready?'':' lock')+(f?' pri':'')+'" data-i="'+i+'" data-ok="'+(ready?1:0)+'"><span class="sxv-ic">'+ic+'</span><span class="sxv-in"><div class="sxv-n">'+esc(x.text||('Server '+(i+1)))+(f?'<em>PRIORITY</em>':'')+(x.auto_connected?'<em style="background:#6d28ff;color:#fff">LIVE TV</em>':'')+'</div><div class="sxv-sub">'+sub+'</div></span><span class="sxv-go">'+(ready?PLAY:LOCK)+'</span></button>';
    }).join('');
    cur.list=list;cur.label=label;cur.msg='Match will be live at '+startText;
    ov.innerHTML='<div class="sxv-box"><button class="sxv-x" type="button" aria-label="Close">&#10005;</button><div class="sxv-hero">'+hero+'<div class="sxv-hi">'+badge+'<h2 class="sxv-t">'+esc(evTeamName(label))+'</h2><div class="sxv-m">'+meta+cd+'</div></div></div><div class="sxv-body">'+
      ((!started)?'<div class="sxv-note" id="sxvNote">\u23F0 Match will be live at '+esc(startText||'kickoff time')+'</div>':'')+
      '<h3 class="sxv-h">Choose a server</h3>'+(items?'<div class="sxv-list">'+items+'</div>':'<div class="sxv-empty">No servers available yet.</div>')+'</div></div>';
    ov.classList.add('open');
    clearInterval(tm);
    var c=document.getElementById('sxvCd');
    if(c&&startMs){var tick=function(){var d=startMs-Date.now();if(d<=0){clearInterval(tm);var i2=Object.assign({},info,{status:'live'});if(cur&&cur.info===info)build(servers,i2);return;}c.textContent='Starts in '+fmt(d);};tick();tm=setInterval(tick,1000);}
  }
  ov.addEventListener('click',function(e){
    if(e.target===ov||e.target.closest('.sxv-x')){close();return;}
    var b=e.target.closest('.sxv-s');if(!b||!cur)return;
    if(b.getAttribute('data-ok')!=='1'){var n=document.getElementById('sxvNote');if(n){n.classList.remove('shake');void n.offsetWidth;n.classList.add('shake');}return;}
    var pi=+b.getAttribute('data-i'),x=cur.list[pi],label=cur.label;
    var btns=ov.querySelectorAll('.sxv-s'),srv=cur.list.map(function(y,j){var bb=btns[j],f2=(y.text||'').trim().toLowerCase()==='fancode',rw=false;try{rw=!f2&&sxIsRawStreamUrl(y.url);}catch(e){}return {text:y.text,url:y.url,playName:y.playName,ready:bb?bb.getAttribute('data-ok')==='1':true,raw:rw,sub:'before kickoff'};});
    close();
    try{if(!(x.text||'').toLowerCase().trim().match(/^fancode$/)&&sxIsRawStreamUrl(x.url))sxOpenVlcPopup(x.url,label);else{window._spServers={list:srv,idx:pi};window._spServerKeep=true;sxGoToMatchUrl(null,x.url,x.playName||label);}}catch(err){window._spServerKeep=false;sxGoToMatchUrl(null,x.url,label);}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('open'))close();});
  window.openMatchWatchScreen=build;
  var oc=window.closeMatchWatchScreen;window.closeMatchWatchScreen=function(){close();if(oc)try{oc();}catch(e){}};
})();

;
/* sxs end */
;

(function(){
  function build(){
    if(document.getElementById('hsm-bar'))return;
    var bar=document.createElement('div');bar.id='hsm-bar';
    var logo=document.getElementById('nav-logo-img');
    bar.innerHTML='<div class="hsm-logo"><span class="evw evw-bar"><span class="evw-a">EV</span><span class="evw-b">ORA</span></span><b>EVORA</b></div><button class="hsm-search" type="button" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3 20 20"/></svg></button>';
    var ham=document.getElementById('mts-hamburger');
    if(ham && window.matchMedia('(max-width:900px)').matches)bar.insertBefore(ham,bar.firstChild);        /* same button, same drawer behaviour */
    bar.querySelector('.hsm-search').onclick=function(){if(window.openSxSearch)openSxSearch();};
    document.body.appendChild(bar);
    var L={home:'Home',matches:'Sports',search:'Search',livetv:'Live TV',favourites:'Favourites'};
    document.querySelectorAll('.mtab[data-sxtab]').forEach(function(t){
      if(t.querySelector('.mtab-l'))return;
      var sp=document.createElement('span');sp.className='mtab-l';sp.textContent=L[t.getAttribute('data-sxtab')]||t.getAttribute('aria-label')||'';t.appendChild(sp);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();

;

(function(){
  function mobile(){return window.matchMedia&&matchMedia('(max-width:900px)').matches;}
  var hero,dots,sx=0,sy=0,n=-1,cur=-1;
  function sync(){
    if(!mobile()||!window.hsHeroNav)return;
    hero=hero||document.getElementById('hs-hero');if(!hero)return;
    if(!dots){dots=document.createElement('div');dots.id='hsm-dots';hero.appendChild(dots);}
    var c=hsHeroNav.count(),i=hsHeroNav.index();
    if(c!==n){n=c;dots.innerHTML=new Array(c+1).join('<i></i>');cur=-1;}
    if(i!==cur){cur=i;[].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===i);});}
    dots.style.display=c>1?'flex':'none';
  }
  setInterval(sync,1000);
  document.addEventListener('touchstart',function(e){
    var h=e.target.closest&&e.target.closest('#hs-hero');if(!h||!mobile())return;
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;
  },{passive:true});
  document.addEventListener('touchend',function(e){
    var h=e.target.closest&&e.target.closest('#hs-hero');if(!h||!mobile()||!window.hsHeroNav)return;
    var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.5){dx<0?hsHeroNav.next():hsHeroNav.prev();}
  },{passive:true});
})();

;

(function(){
  var last='';
  setInterval(function(){
    var ov=document.getElementById('sx-search-overlay');
    if(!ov||!ov.classList.contains('open')||!window.vaPools||typeof sxRunSearch!=='function')return;
    var sig=vaPools.movie.all.length+'|'+vaPools.tv.all.length+'|'+((window._cmsChannels||[]).length);
    if(sig===last)return;last=sig;
    var inp=document.getElementById('sx-search-input');sxRunSearch(inp?inp.value:'');
  },1200);
})();

;

(function(){
  var mq=window.matchMedia('(max-width:900px)');
  var SECTIONS=['livetv-overlay','movies-overlay','fifa-overlay','ott-overlay','fancode-overlay','prime-overlay','willow-overlay','vip-overlay','adminchat-overlay','sx-search-overlay','sx-fav-overlay'];
  var bar=document.createElement('div');bar.id='sx-secbar';
  bar.innerHTML='<button type="button" class="sxb-back" aria-label="Back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>'
    +'<button type="button" class="sxb-menu" aria-label="Menu"><span class="sxb-ham"><i></i><i></i><i></i></span></button>';
  var ov=document.createElement('div');ov.id='sx-mdrawer-ov';
  var dr=document.createElement('nav');dr.id='sx-mdrawer';
  document.body.appendChild(bar);document.body.appendChild(ov);document.body.appendChild(dr);

  function build(){
    var rail=document.getElementById('hs-rail');
    if(!rail||dr.dataset.built)return;
    var logo=rail.querySelector('.logo img');
    var h='<div class="mdl">'+(logo&&logo.src?'<img src="'+logo.src+'" alt="EVORA">':'')+'</div>';
    rail.querySelectorAll('.in > *').forEach(function(n,i){
      if(n.classList.contains('logo'))return;
      if(n.classList.contains('sep')){h+='<div class="mdsep"></div>';return;}
      if(n.tagName==='A'){h+='<a data-k="'+i+'">'+n.innerHTML+'</a>';}
    });
    dr.innerHTML=h;dr.dataset.built='1';
    var src=[];rail.querySelectorAll('.in > *').forEach(function(n){if(!n.classList.contains('logo')&&!n.classList.contains('sep')&&n.tagName==='A')src.push(n);});
    var idx=0;
    dr.querySelectorAll('a').forEach(function(a){
      var target=src[idx++];
      a.addEventListener('click',function(e){
        e.preventDefault();closeM();
        if(!target)return;
        var href=target.getAttribute('href');
        if(href&&/^https?:/i.test(href)){window.open(href,'_blank','noopener');return;}
        target.click(); /* same handler the PC sidebar uses */
      });
    });
  }
  function openM(){build();dr.classList.add('open');ov.classList.add('open');}
  function closeM(){dr.classList.remove('open');ov.classList.remove('open');var m=document.getElementById('mts-hamburger');if(m)m.classList.remove('open');}
  ov.addEventListener('click',closeM);

  /* the existing hamburger (home top bar) opens the same drawer on phones */
  var _t=window.toggleDrawer,_c=window.closeDrawer;
  window.toggleDrawer=function(){
    if(!mq.matches){return _t&&_t.apply(this,arguments);}
    if(typeof isStreamPlayerActive==='function'&&isStreamPlayerActive())return;
    dr.classList.contains('open')?closeM():openM();
  };
  window.closeDrawer=function(){closeM();return _c&&_c.apply(this,arguments);};

  bar.querySelector('.sxb-menu').addEventListener('click',function(){window.toggleDrawer();});
  bar.querySelector('.sxb-back').addEventListener('click',function(){
    if(dr.classList.contains('open')){closeM();return;}
    var mp=document.getElementById('matches-panel');if(mp)mp.classList.remove('active');
    if(typeof goHome==='function')goHome();
  });

  function sectionOpen(){
    if(!mq.matches)return false;
    var sp=document.getElementById('stream-player-overlay');
    if(sp&&sp.classList.contains('open'))return false;
    for(var i=0;i<SECTIONS.length;i++){var e=document.getElementById(SECTIONS[i]);if(e&&e.classList.contains('open'))return true;}
    var mp=document.getElementById('matches-panel');
    return !!(mp&&mp.classList.contains('active'));
  }
  function sync(){
    var on=sectionOpen();
    bar.classList.toggle('show',on);
    if(!on&&dr.classList.contains('open')&&!mq.matches)closeM();
  }
  setInterval(sync,600);sync();
})();

;

/* FanCode streams (formerly play.html): the stream is resolved here and played in the
   EVORA StreamPulse player, so FanCode has exactly the same controls and UI. */
var FC_JSON_URL = EV_CONFIG.FANCODE_JSON;
var FC_LANG = {eng:'ENGLISH',hin:'HINDI',tam:'TAMIL',tel:'TELUGU',ben:'BENGALI',mar:'MARATHI'};
var FC_Q = [['1080p',1920,1080,5000000],['720p',1280,720,3000000],['540p',960,540,1800000],['480p',854,480,1200000],['360p',640,360,800000],['240p',426,240,400000]];
var _fcJson = null, _fcJsonT = 0, _fcBlob = '';
function fcFetchJson(){
  if (_fcJson && Date.now() - _fcJsonT < 15000) return Promise.resolve(_fcJson);
  return fetch(FC_JSON_URL, {cache:'no-store'}).then(function(r){
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function(d){ _fcJson = d; _fcJsonT = Date.now(); return d; });
}
function fcResolve(data, id, si){
  var ui = id.indexOf('_');
  var matchId = ui > -1 ? id.slice(0, ui) : id;
  var langCode = ui > -1 ? id.slice(ui + 1) : 'eng';
  var list = Array.isArray(data) ? data : (data && Array.isArray(data.matches) ? data.matches : []);
  if (!list.length) throw new Error('No matches in feed');
  var m = null;
  for (var i = 0; i < list.length; i++) if (String(list[i].match_id) === String(matchId)) { m = list[i]; break; }
  if (!m) throw new Error('Match not found in feed');
  var st = m.streams || {};
  if (si === 0) {
    var as = m.auto_streams || {}, keys = Object.keys(as);
    if (!keys.length) throw new Error('Match not started yet');
    var lang = FC_LANG[langCode] || m.language || keys[0];
    var al = as[lang] || as[keys[0]];
    if (!al || !al.streams || !Object.keys(al.streams).length) throw new Error('Stream URLs empty for this match');
    return {multi: al.streams};
  }
  var u = si === 1 ? st.fancode_lk_cdn : si === 2 ? st.fancode_np_cdn : si === 3 ? st.fancode_bd_cdn : null;
  if (!u) throw new Error('Regional stream not available');
  return {single: u};
}
function fcMasterUrl(streams){
  var t = '#EXTM3U\n#EXT-X-VERSION:3\n', first = '';
  FC_Q.forEach(function(q){
    var u = streams[q[0]];
    if (!u) return;
    if (!first) first = u;
    t += '#EXT-X-STREAM-INF:BANDWIDTH=' + q[3] + ',RESOLUTION=' + q[1] + 'x' + q[2] + ',NAME="' + q[0] + '"\n' + u + '\n';
  });
  if (!first) throw new Error('All quality URLs empty for this match');
  var url;
  try {
    if (_fcBlob) { try { URL.revokeObjectURL(_fcBlob); } catch(e){} }
    _fcBlob = URL.createObjectURL(new Blob([t], {type:'application/vnd.apple.mpegurl'}));
    url = _fcBlob;
  } catch(e) { url = first; }
  return {url: url, best: first};
}
function fcStatusDoc(msg){
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'
   + 'html,body{margin:0;height:100%;background:#000;color:#fff;font:600 14px "Google Sans","Helvetica Neue",Helvetica,Arial,sans-serif}'
   + 'body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:24px}'
   + 'i{width:30px;height:30px;border:3px solid rgba(255,255,255,.18);border-top-color:#fff;border-radius:50%;animation:r .9s linear infinite}'
   + '@keyframes r{to{transform:rotate(360deg)}}small{opacity:.55;font-weight:500}</style></head><body><i></i>'
   + '<div>' + String(msg).replace(/[<>&]/g, '') + '</div><small>Retrying automatically…</small></body></html>';
}
/* url looks like play?id=<matchId>_eng&s=0 — kept as the FanCode link format used across the site */
function fcLoadIntoFrame(frame, url, label){
  var q = ''; try { q = String(url || '').split('#')[0].split('?')[1] || ''; } catch(e){}
  var sp = new URLSearchParams(q);
  var id = sp.get('id') || '', si = parseInt(sp.get('s') || '0', 10) || 0;
  var tok = {}; window._fcTok = tok;
  function alive(){
    var ov = document.getElementById('stream-player-overlay');
    return window._fcTok === tok && ov && ov.classList.contains('open');
  }
  function go(){
    if (!alive()) return;
    if (!id) { frame.srcdoc = fcStatusDoc('Missing match ID'); return; }
    fcFetchJson().then(function(data){
      if (!alive()) return;
      var r = fcResolve(data, id, si), play, raw;
      if (r.multi) { var mm = fcMasterUrl(r.multi); play = mm.url; raw = mm.best; }
      else { play = raw = r.single; }
      sxCurrentStreamRawUrl = raw; // Cast gets a direct HLS link
      frame.srcdoc = sx4kDoc(play, label);
    }).catch(function(e){
      if (!alive()) return;
      frame.srcdoc = fcStatusDoc((e && e.message) || 'Stream unavailable');
      setTimeout(go, 8000);
    });
  }
  go();
}
window.fcLoadIntoFrame = fcLoadIntoFrame;

;

(function(){
  var mq=window.matchMedia('(max-width:900px)');
  /* 1 — stacked-card positions + swipe */
  function updPos(){
    var c=document.getElementById('slides-container'); if(!c) return;
    var sl=[].slice.call(c.querySelectorAll(':scope > .slide')); if(!sl.length) return;
    var a=sl.findIndex(function(s){return s.classList.contains('active');}); if(a<0)a=0;
    sl.forEach(function(s,i){
      var o=i-a, d=o<0?-1:(o>3?3:o);
      if(s.dataset.o!==String(d)){ s.dataset.o=d; s.style.setProperty('--o',Math.max(0,d)); }
    });
  }
  function initHero(){
    var c=document.getElementById('slides-container'); if(!c||c._apInit) return; c._apInit=1;
    new MutationObserver(updPos).observe(c,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    var x0=null,y0=0;
    c.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY;},{passive:true});
    c.addEventListener('touchend',function(e){
      if(x0===null) return; var dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; x0=null;
      if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){ try{ goSlide(currentSlide+(dx<0?1:-1)); startSlider(); }catch(_){} }
    },{passive:true});
    updPos();
  }

  function hsVoice(pill){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    function fallback(){ if(window.openSxSearch) openSxSearch(); }
    if(!SR){ fallback(); return; }
    if(pill._rec){ try{pill._rec.stop();}catch(_){} return; }
    var r=new SR(), got=false; pill._rec=r;
    r.lang='en-IN'; r.interimResults=false; r.maxAlternatives=1;
    pill.classList.add('listening');
    pill.querySelectorAll('.hp-ask').forEach(function(b){b.lastChild.textContent='Listening…';});
    r.onresult=function(e){
      got=true; var q=(e.results[0][0].transcript||'').trim();
      if(window.openSxSearch) openSxSearch();
      setTimeout(function(){
        var inp=document.getElementById('sx-search-input'); if(!inp) return;
        inp.value=q; inp.dispatchEvent(new Event('input',{bubbles:true}));
        var bar=document.querySelector('.sx-search-bar'); if(bar&&q) bar.classList.add('has-text');
      },120);
    };
    r.onerror=function(){ if(!got) fallback(); };
    r.onend=function(){
      pill._rec=null; pill.classList.remove('listening');
      pill.querySelectorAll('.hp-ask').forEach(function(b){b.lastChild.textContent='Ask';});
    };
    try{ r.start(); }catch(_){ pill._rec=null; pill.classList.remove('listening'); fallback(); }
  }
  /* 2 — nav profile + logo */
  function build(){
    var bar=document.getElementById('hsm-bar');
    var nav=document.getElementById('mobile-tabbar');
    if(nav && !nav.querySelector('.mtab-prof')){
      var pr=document.createElement('a'); pr.className='mtab mtab-prof'; pr.href='#'; pr.setAttribute('aria-label','Menu');
      pr.setAttribute('aria-label','Community'); pr.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/><circle cx="9" cy="12" r=".6" fill="currentColor"/><circle cx="12.5" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>'; pr.onclick=function(e){e.preventDefault(); if(window.hsOpenCommunity) hsOpenCommunity();};
      nav.appendChild(pr);
      var home=nav.querySelector('.mtab[data-sxtab="home"]'), logo=document.getElementById('nav-logo-img');
      if(home && !home.querySelector('.mtab-logo')){ var im=document.createElement('span'); im.className='mtab-logo evw-tab'; im.textContent='EVORA'; home.insertBefore(im,home.firstChild); }
    }
    /* 3 — floating pill */
    if(!document.getElementById('hs-pill')){
      var mic='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
      var pill=document.createElement('div'); pill.id='hs-pill'; pill.className='cmp';
      pill.innerHTML=
        '<div class="hp-exp"><div class="hp-main glass"><button data-g="tv">TV</button><i></i><button data-g="movies">Movies</button><i></i><button data-g="sports">Sports</button><i></i><button data-g="live">Live TV</button><button class="hp-chev" data-g="cmp">&#8963;</button></div><button class="hp-mic glass" data-g="ask">'+mic+'</button></div>'+
        '<div class="hp-cmp"><button class="hp-lab glass" data-g="lab">Sports</button><button class="hp-x glass" data-g="exp">&#10005;</button><button class="hp-ask glass" data-g="ask">'+mic+'Ask</button></div>';
      document.body.appendChild(pill);
      pill.addEventListener('click',function(e){
        var b=e.target.closest('button'); if(!b) return; var g=b.dataset.g;
        if(g==='tv'||g==='movies'||g==='sports'||g==='live'){ if(window.hsSetMode) hsSetMode(g); }
        else if(g==='lab'){ window.scrollTo({top:0,behavior:'smooth'}); }
        else if(g==='ask') hsVoice(pill);
        else if(g==='cmp'){ pill.className='cmp'; pill._m=1; }
        else if(g==='exp'){ if(window.__hsMode&&window.__hsMode!=='all'){ hsSetMode('all'); } else { pill.className='exp'; pill._m=1; } }
      });
      var lab=pill.querySelector('.hp-lab');
      function label(){ lab.textContent=({all:'For You',tv:'TV',movies:'Movies',sports:'Sports',live:'Live TV'})[window.__hsMode||'all']; }
      window.__hsPillLabel=label; label();
      window.addEventListener('scroll',function(){
        if(window.scrollY<80){ if(!pill._m) pill.className='exp'; } else { pill._m=0; if(pill.className==='exp') pill.className='cmp'; }
        label();
      },{passive:true});
      pill.className=window.scrollY<80?'exp':'cmp';
    }
  }
  function boot(){ initHero(); build(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);}); else setTimeout(boot,300);
  /* hero is rendered later by renderSlides — keep retrying briefly */
  var n=0,t=setInterval(function(){ initHero(); build(); if(++n>40) clearInterval(t); },500);
})();

;

(function(){
  function build(){
    if(document.getElementById('hs-community')) return;
    var d=document.querySelector('.btn-discord svg'), t=document.querySelector('.btn-telegram svg');
    var dl=(document.querySelector('.btn-discord')||{}).href||'https://discord.gg/w46C6mQgrY';
    var tl=(document.querySelector('.btn-telegram')||{}).href||'https://t.me/rishievofficial';
    var o=document.createElement('div'); o.id='hs-community';
    o.innerHTML='<h1>Join our community</h1><p class="hc-sub">Get live match alerts, new channel links and support from other fans — pick your platform.</p>'+
      '<a class="hc-card" href="'+dl+'" target="_blank" rel="noopener"><div class="hc-ic">'+(d?d.outerHTML:'')+'</div><div class="hc-t">Discord</div><div class="hc-d">Chat with the community, request channels and get quick help.</div><span class="hc-go">Join Discord</span></a>'+
      '<a class="hc-card" href="'+tl+'" target="_blank" rel="noopener"><div class="hc-ic">'+(t?t.outerHTML:'')+'</div><div class="hc-t">Telegram</div><div class="hc-d">Instant updates, announcements and link drops on our channel.</div><span class="hc-go">Join Telegram</span></a>';
    document.body.appendChild(o);
    var nav=document.getElementById('mobile-tabbar');
    if(nav) nav.addEventListener('click',function(e){ var a=e.target.closest('.mtab'); if(a && !a.classList.contains('mtab-prof')) hsCloseCommunity(); },true);
  }
  window.hsCloseCommunity=function(){ var o=document.getElementById('hs-community'); if(o) o.classList.remove('open'); var p=document.querySelector('.mtab-prof'); if(p) p.classList.remove('active'); };
  window.hsOpenCommunity=function(){
    build(); var o=document.getElementById('hs-community'); if(!o) return;
    if(o.classList.contains('open')){ hsCloseCommunity(); return; }
    try{ if(window.sxCloseAllOverlays) sxCloseAllOverlays(); }catch(_){}
    o.classList.add('open'); o.scrollTop=0;
    var p=document.querySelector('.mtab-prof'); if(p) p.classList.add('active');
    document.querySelectorAll('.mobile-tabbar .mtab[data-sxtab]').forEach(function(x){x.classList.remove('active');});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();

;

(function(){
  var MODES=['all','tv','movies','sports','live'], mq=window.matchMedia('(max-width:900px)');
  window.__hsMode='all';
  function setBody(m){ MODES.forEach(function(x){document.body.classList.remove('hs-m-'+x);}); document.body.classList.add('hs-m-'+m); }
  window.hsSetMode=function(m){
    if(MODES.indexOf(m)<0) m='all';
    window.__hsMode=m; setBody(m);
    var pill=document.getElementById('hs-pill');
    if(pill){ pill.querySelectorAll('.hp-main button[data-g]').forEach(function(b){ b.classList.toggle('on',b.dataset.g===m); });
      if(window.__hsPillLabel) window.__hsPillLabel(); pill._m=0; pill.className=(m==='all'&&window.scrollY<80)?'exp':'cmp'; }
    try{ if(window.hsCloseCommunity) hsCloseCommunity(); if(window.goHome) goHome(); }catch(_){}
    window.scrollTo({top:0,behavior:'smooth'});
    hsBuildHero(true);
    if(m==='live'){ setTimeout(function(){ try{ if(window.openLiveTV) openLiveTV(); }catch(_){} },60); }
  };
  setBody('all');

  /* ── movie / TV hero ── */
  var host=null, state={sig:'',cur:0,items:[],timer:0};
  var own={movie:[],tv:[]},tried={};
  function pool(t){ var a=[]; try{ a=(window.vaPools&&vaPools[t]&&vaPools[t].all)||[]; }catch(e){} return a.length?a:own[t]; }
  function ensure(){ ['movie','tv'].forEach(function(t){ if(pool(t).length||tried[t]) return; tried[t]=1;
    try{ vaFetchPage(t,1).then(function(d){ own[t]=(d&&d.items)||[]; if(!own[t].length) tried[t]=0; }).catch(function(){ tried[t]=0; }); }catch(e){ tried[t]=0; } }); }
  function topN(arr,n){ return arr.filter(function(m){return m.poster_url;}).slice().sort(function(a,b){return (parseFloat(b.popularity)||0)-(parseFloat(a.popularity)||0);}).slice(0,n); }
  function play(m,type){
    var label=(m.title||'')+(m.year?' ('+m.year+')':'');
    try{
      if(type==='tv'){ vaPendingTvItem={id:m.tmdb_id||m.imdb_id,title:m.title}; vaOpenTvModal(label); }
      else openStreamPlayer(vaBuildEmbedUrl(m.embed_url),label,'movie');
    }catch(e){}
  }
  function esc(t){ return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function pos(){
    if(!host) return; var cs=[].slice.call(host.querySelectorAll('.mh-slide'));
    cs.forEach(function(c,i){ var o=i-state.cur, d=o<0?-1:(o>3?3:o); c.dataset.o=d; c.style.setProperty('--o',Math.max(0,d)); });
  }
  function go(n){ var l=state.items.length; if(!l) return; state.cur=(n+l)%l; pos(); start(); }
  function start(){ clearInterval(state.timer); if(state.items.length>1) state.timer=setInterval(function(){ if(!document.hidden) go(state.cur+1); },5000); }
  var FB='https://raw.githubusercontent.com/saptarshiorg/saptarshiorg.github.io/main/ChatGPT%20Image%20Jun%207,%202026,%2010_27_17%20AM.png';
  function sportsItems(){
    var S=window.__sxs, out=[];
    if(S){
      var list=[]; try{ list=S.refresh()||[]; }catch(e){ try{ list=S.all()||[]; }catch(e2){} }
      var base=list.filter(function(it){return !it.fin;}), cu=window.sxHeroCustom?sxHeroCustom(base,list):[], used=cu.map(function(c){return c.it;}).filter(Boolean);
      out=base.filter(function(it){return used.indexOf(it)<0;}).slice(0,12).map(function(it){
        var title=String(it.title||'Match').replace(/\s+v\s+/i,' vs ');
        var sm=(it.members||[]).filter(function(m){return m.src==='s';})[0];
        if(sm&&sm.raw){ var t1=sm.raw.team1_full_name||sm.raw.team1_code||'',t2=sm.raw.team2_full_name||sm.raw.team2_code||''; if(t1&&t2) title=t1+' vs '+t2; }
        var parts=[]; if(it.tour) parts.push(it.tour); parts.push(it.live?'Streaming live now':(it.time?'Starts '+it.time:'Today'));
        var sp=String(it.sport||'').trim();
        return {t:'sport',img:it.img||FB,title:title,badge:(it.live?'LIVE':'')+(sp?(it.live?' \u2022 ':'')+sp:'')||'Sports',sub:parts.join(' \u2022 '),src:it};
      });
      out=cu.map(function(c){ return {t:'sport',img:c.img||FB,title:c.title,badge:c.badge||(c.it&&c.it.live?'LIVE':'Sports'),sub:c.sub,src:c.it||null,el:c.el}; }).concat(out);
    }
    if(out.length) return out;
    var c=document.getElementById('slides-container'); if(!c) return [];
    return [].slice.call(c.querySelectorAll(':scope > .slide')).filter(function(sl){return !sl.querySelector('.hfl-logo');}).map(function(sl){
      var bg=sl.querySelector('.slide-bg'), u=((bg&&bg.style.backgroundImage)||'').replace(/^url\(["']?/,'').replace(/["']?\)$/,'');
      var g=function(q){ var e=sl.querySelector(q); return e?e.textContent.trim():''; };
      return {t:'sport',img:u,title:g('.slide-title'),badge:g('.slide-sport-badge')||'Sports',sub:g('.slide-sub')};
    }).filter(function(x){return x.img&&x.title;});
  }
  function playSport(it){
    if(it.src&&window.__sxs){ try{ __sxs.open(it.src); }catch(e){} return; }
    if(it.el){ var wb=it.el.querySelector('.btn-slide-watch'); if(wb){ wb.click(); return; } }
    var c=document.getElementById('slides-container'); if(!c) return;
    var sl=[].slice.call(c.querySelectorAll(':scope > .slide')).filter(function(s){var t=s.querySelector('.slide-title');return t&&t.textContent.trim()===it.title;})[0];
    var b=sl&&sl.querySelector('.btn-slide-watch'); if(b) b.click();
  }
  function hsBuildHero(force){
    if(!host){
      host=document.getElementById('hs-mhero');
      if(!host){ var hs=document.getElementById('hero-section'); if(!hs) return; host=document.createElement('div'); host.id='hs-mhero'; hs.parentNode.insertBefore(host,hs);
        var x0=null,y0=0;
        host.addEventListener('click',function(e){ var c=e.target.closest('.mh-slide'); if(!c) return; if(c.dataset.o!=='0'){ if(+c.dataset.o>0){ e.stopPropagation(); go(+c.dataset.i); } return; } var it=state.items[+c.dataset.i]; if(!it) return; if(it.t==='sport') playSport(it); else play(it.m,it.t); });
      }
    }
    var mv=pool('movie'), tv=pool('tv'), m=window.__hsMode, items=[];
    if(m==='sports') items=sportsItems();
    else if(m==='movies') items=topN(mv,8).map(function(x){return {m:x,t:'movie'};});
    else if(m==='tv') items=topN(tv,8).map(function(x){return {m:x,t:'tv'};});
    else if(mq.matches){ var spA=sportsItems(), lvA=spA.filter(function(x){return x.src&&x.src.live;}); items=(lvA.length?lvA:spA.slice(0,4)).slice(0,10);
      var t1=topN(tv,1)[0], m1=topN(mv,1)[0]; if(t1) items.push({m:t1,t:'tv'}); if(m1) items.push({m:m1,t:'movie'}); }
    else { var sp=sportsItems().slice(0,3), a=topN(tv,3), b=topN(mv,3);
      for(var i=0;i<3;i++){ if(sp[i]) items.push(sp[i]); if(a[i]) items.push({m:a[i],t:'tv'}); if(b[i]) items.push({m:b[i],t:'movie'}); } }
    if(!items.length){ ensure(); if(state.sig!=='loading'){ host.innerHTML='<div class="mh-slide mh-sk" data-o="0"></div>'; state.sig='loading'; state.items=[]; } return; }
    var sig=m+'#'+items.map(function(i){return (i.m||i).title;}).join('|');
    if(sig===state.sig&&!force) return;
    if(sig===state.sig&&host.children.length) { pos(); return; }
    state.sig=sig; state.items=items; state.cur=0;
    var yr=new Date().getFullYear();
    host.innerHTML=items.map(function(it,i){
      if(it.t==='sport') return '<div class="mh-slide" data-i="'+i+'"><div class="mh-bg mh-land" data-bg="'+esc(it.img)+'"></div><div class="mh-info"><span class="mh-badge">'+esc(it.badge||'Sports')+'</span><div class="mh-t">'+esc(it.title)+'</div><div class="mh-m">'+esc(it.sub||'')+'</div></div><button class="mh-play" type="button" aria-label="Play"></button></div>';
      var x=it.m;
      return '<div class="mh-slide" data-i="'+i+'"><div class="mh-bg" data-bg="'+esc(x.poster_url)+'"></div><div class="mh-info"><span class="mh-badge">'+(parseInt(x.year)>=yr?'New Release':(it.t==='tv'?'TV Show':'Movie'))+'</span><div class="mh-t">'+esc(x.title)+'</div><div class="mh-m">'+(x.year?esc(x.year)+' \u2022 ':'')+(it.t==='tv'?'TV Show':'Movie')+'</div></div><button class="mh-play" type="button" aria-label="Play"></button></div>'; }).join('');
    pos(); start();
  }
  window.hsBuildHero=hsBuildHero;
  window.__hsHero={go:go,cur:function(){return state.cur;},len:function(){return state.items.length;},stop:function(){clearInterval(state.timer);}};

  /* ── tag + number the home rails ── */
  function tag(){
    var hr=document.getElementById('sxs-home'); if(!hr) return false;
    hr.querySelectorAll(':scope > section.sxs-sec:not(.hs-gsec)').forEach(function(sec){
      var h=sec.querySelector('.sxs-t'); if(!h) return; var t=(h.firstChild&&h.firstChild.nodeValue||h.textContent||'').trim();
      if(/live now|upcoming/i.test(t)) sec.classList.add('hs-k-sports');
      else if(/^(top 10 )?movies/i.test(t)){ sec.classList.add('hs-k-movies'); if(h.firstChild&&h.firstChild.nodeType===3) h.firstChild.nodeValue='Top 10 Movies'; }
      else if(/tv shows/i.test(t)) sec.classList.add('hs-k-tv');
    });
    return true;
  }
  var obs=null;
  function init(){
    if(!document.body) return;
    if(!document.body.className.match(/hs-m-/)) setBody(window.__hsMode);
    var hr=document.getElementById('sxs-home');
    if(hr&&!obs){ obs=new MutationObserver(tag); obs.observe(hr,{childList:true}); }
    tag(); hsBuildHero(false);
    try{ if(window.vaPools&&!pool('movie').length&&typeof vaBulkPreload==='function'&&!vaPools.movie.loading) vaBulkPreload('movie'); if(window.vaPools&&!pool('tv').length&&typeof vaBulkPreload==='function'&&!vaPools.tv.loading) vaBulkPreload('tv'); }catch(_){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  setInterval(init,5000);
})();

;

(function(){
  var mq=window.matchMedia('(max-width:900px)');
  function wrap(){
    var f=window.hsSetMode; if(!f||f.__sp) return false;
    var w=function(m){
      var r=f.apply(this,arguments);
      if(m==='sports' && mq.matches){
        // sports data (FanCode/SonyLIV/sheet) can land after the tap: rebuild the hero a few times
        [150,700,1800,4000].forEach(function(t){ setTimeout(function(){
          if(window.__hsMode!=='sports') return;
          try{ document.body.classList.remove('hs-m-all','hs-m-tv','hs-m-movies','hs-m-live'); document.body.classList.add('hs-m-sports'); }catch(_){}
          try{ window.hsBuildHero&&hsBuildHero(true); }catch(_){}
          if(t===150) window.scrollTo({top:0});
        },t); });
      }
      return r;
    };
    w.__sp=1; window.hsSetMode=w; return true;
  }
  if(!wrap()){ var n=0,iv=setInterval(function(){ if(wrap()||++n>40) clearInterval(iv); },250); }
})();

;

(function(){
  var mq=window.matchMedia('(max-width:900px)');
  /* pill: TV button also covers Live TV on mobile */
  var n=0,iv=setInterval(function(){
    var b=document.querySelector('#hs-pill .hp-main button[data-g="tv"]');
    if(b){ b.textContent='TV'; clearInterval(iv); } else if(++n>60) clearInterval(iv);
  },250);
  /* LIVE TV / TV SHOWS switch at the top of the mobile TV section */
  document.body.classList.add('hs-tvsub-shows');
  var k=0,iv2=setInterval(function(){
    var hr=document.getElementById('sxs-home');
    if(hr){ clearInterval(iv2);
      if(!document.getElementById('hs-tvswitch')){
        var sw=document.createElement('div'); sw.id='hs-tvswitch';
        sw.innerHTML='<button type="button" data-s="live">LIVE TV</button><button type="button" data-s="shows">TV SHOWS</button>';
        var tgt=document.getElementById('hs-mhero')||document.getElementById('hero-section')||hr;   /* very top, above the hero slides */
        tgt.parentNode.insertBefore(sw,tgt);
        sw.addEventListener('click',function(e){
          var b=e.target.closest('button'); if(!b) return; var v=b.dataset.s;
          document.body.classList.toggle('hs-tvsub-live',v==='live');
          document.body.classList.toggle('hs-tvsub-shows',v==='shows');
        });
      }
    } else if(++k>80) clearInterval(iv2);
  },250);
  /* middle EV button = real home (For You): live-match hero slides + 1 TV show + 1 movie */
  document.addEventListener('click',function(e){
    if(!mq.matches) return;
    var t=e.target.closest&&e.target.closest('.mtab[data-sxtab="home"]'); if(!t) return;
    if(window.hsSetMode&&window.__hsMode&&window.__hsMode!=='all') hsSetMode('all');
  },true);
})();

;

(function(){
  var mq=window.matchMedia('(max-width:900px)');
  /* mobile top-bar logo = Home button */
  document.addEventListener('click',function(e){
    if(!mq.matches) return;
    var t=e.target.closest&&e.target.closest('#hsm-bar .hsm-logo'); if(!t) return;
    e.preventDefault();
    try{
      if(window.hsSetMode) hsSetMode('all'); else if(window.goHome) goHome();
      if(window.goHome) goHome();
    }catch(_){}
    window.scrollTo({top:0,behavior:'smooth'});
  },true);
})();

;

(function(){
  'use strict';
  var mq = window.matchMedia('(max-width:900px)');
  function $(s, r){ return (r || document).querySelector(s); }
  function esc(t){ return String(t == null ? '' : t).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'%27'}[c]; }); }

  /* ═══════════ A. FASTER DATA: dedupe + stale-while-revalidate + race direct/proxy ═══════════ */
  (function(){
    var orig = window.vaFetchPage;
    if (typeof orig !== 'function') return;
    var BASE = EV_CONFIG.VIDAPI_LIST, PROXY = EV_CONFIG.CORS_PROXY, LS = 'ev:p1:';
    var inflight = {}, pcDone = {};

    function preconnect(u){
      try {
        var o = new URL(u).origin; if (pcDone[o] || o === location.origin) return; pcDone[o] = 1;
        var l = document.createElement('link'); l.rel = 'preconnect'; l.href = o; document.head.appendChild(l);
      } catch(e){}
    }
    /* smaller poster files for cards when the host is TMDB-style (…/t/p/<size>/…); other hosts untouched */
    function upgrade(d){
      if (!d || !d.items) return d;
      d.items.forEach(function(m, i){
        var u = m && m.poster_url; if (!u) return;
        if (i === 0) preconnect(u);
        if (/\/t\/p\/(original|w\d+)\//.test(u)) m.poster_url = u.replace(/\/t\/p\/(original|w\d+)\//, '/t/p/w342/');
      });
      return d;
    }
    /* direct request first; if it is slow (blocked / throttled .ru) or fails, the proxy joins the race */
    function race(url){
      return new Promise(function(res, rej){
        var done = false, proxied = false, errs = 0, timer = 0;
        function win(d){ if (done) return; done = true; clearTimeout(timer); res(d); }
        function fail(e){ errs++; if (!proxied) { startProxy(); return; } if (errs >= 2 && !done) { done = true; clearTimeout(timer); rej(e); } }
        function req(u){ fetch(u).then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(win, fail); }
        function startProxy(){ if (proxied) return; proxied = true; req(PROXY + encodeURIComponent(url)); }
        req(url); timer = setTimeout(startProxy, 2200);
      });
    }
    window.vaFetchPage = function(type, page){
      var path = type === 'tv' ? 'tvshows' : 'movies', url = BASE + '/' + path + '/latest/page-' + page + '.json', key = path + ':' + page;
      if (inflight[key]) return inflight[key];
      var cached = null;
      if (page === 1) { try { cached = JSON.parse(localStorage.getItem(LS + path)); } catch(e){} }
      var net = race(url).then(function(d){
        upgrade(d);
        if (page === 1) { try { localStorage.setItem(LS + path, JSON.stringify(d)); } catch(e){} }
        return d;
      });
      var p;
      if (cached && cached.items && cached.items.length) { upgrade(cached); net.catch(function(){}); p = Promise.resolve(cached); }   /* instant on repeat visits, refreshed in background */
      else p = net;
      inflight[key] = p;
      setTimeout(function(){ delete inflight[key]; }, 5000);
      return p;
    };
  })();

  /* ═══════════ B. IMAGES: async decode + fade-in for every card / tile ═══════════ */
  (function(){
    var SEL = '.sxs-th,.hsm-card,.evc-th,.sxs-hth';
    function prep(img){
      if (img._ev) return; img._ev = 1;
      try { img.decoding = 'async'; if (!img.getAttribute('loading')) img.loading = 'lazy'; } catch(e){}
      if (img.complete && img.naturalWidth) return;
      img.classList.add('ev-f');
      var ok = function(){ img.classList.add('ev-ok'); };
      img.addEventListener('load', ok, { once: true });
      img.addEventListener('error', ok, { once: true });
      setTimeout(ok, 7000);   /* never leave an image invisible */
    }
    var q = [], raf = 0;
    function flush(){
      raf = 0; var n = q; q = [];
      n.forEach(function(el){
        if (el.nodeType !== 1) return;
        if (el.tagName === 'IMG') { if (el.closest(SEL) && !el.closest('#sxs-pop,#hsm-pop,#evt-pop')) prep(el); return; }
        var imgs = el.querySelectorAll ? el.querySelectorAll('img') : [];
        for (var i = 0; i < imgs.length; i++) if (imgs[i].closest(SEL) && !imgs[i].closest('#sxs-pop,#hsm-pop,#evt-pop')) prep(imgs[i]);
      });
    }
    new MutationObserver(function(ms){
      for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) q.push(ms[i].addedNodes[j]);
      if (!raf) raf = requestAnimationFrame(flush);
    }).observe(document.body, { childList: true, subtree: true });
  })();

  /* ═══════════ C. HERO: lazy + prioritised banner loading, finger-follow swipe ═══════════ */
  (function(){
    var H = function(){ return window.__hsHero; };

    /* — only the visible + next slides download their banner; the first one gets top priority — */
    function hydrate(){
      var api = H(), host = $('#hs-mhero'); if (!host) return;
      if (!api) { [].forEach.call(host.querySelectorAll('.mh-bg[data-bg]'), function(b){ if (b._ev) return; b._ev = 1; b.style.backgroundImage = "url('" + b.getAttribute('data-bg') + "')"; b.classList.add('ev-in'); }); return; }
      var sl = [].slice.call(host.querySelectorAll('.mh-slide')), l = sl.length, cur = api.cur();
      sl.forEach(function(s, i){
        var bg = s.querySelector('.mh-bg'); if (!bg || bg._ev) return;
        var ahead = (i - cur + l) % l, back = (cur - i + l) % l;
        if (!(ahead <= 2 || back <= 1)) return;
        bg._ev = 1;
        var u = bg.getAttribute('data-bg'); if (!u) { bg.classList.add('ev-in'); return; }
        var hi = u.replace(/\/t\/p\/(original|w\d+)\//, '/t/p/w780/'), tried = false, im = new Image();
        im.decoding = 'async'; try { if (i === cur) im.fetchPriority = 'high'; } catch(e){}
        var show = function(src){ bg.style.backgroundImage = "url('" + src + "')"; bg.classList.add('ev-in'); };
        im.onload = function(){ show(im.src); };
        im.onerror = function(){ if (!tried && hi !== u) { tried = true; im.src = u; } else { bg.classList.add('ev-in'); } };
        im.src = hi;
      });
    }
    var hraf = 0;
    function schedule(){ if (!hraf) hraf = requestAnimationFrame(function(){ hraf = 0; hydrate(); }); }
    function watch(){
      var host = $('#hs-mhero'); if (!host || host._evw) return !!host;
      host._evw = 1;
      new MutationObserver(schedule).observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-o'] });
      schedule(); return true;
    }
    var w = 0, wi = setInterval(function(){ if (watch() || ++w > 120) clearInterval(wi); }, 250);

    /* — swipe: the front card follows the finger, next card scales up, release decides (distance or flick) — */
    var drag = null, lastDrag = 0;
    function peers(front){
      var host = front.parentNode; return { next: host.querySelector('.mh-slide[data-o="1"]') };
    }
    document.addEventListener('touchstart', function(e){
      if (!mq.matches) return;
      var host = e.target.closest && e.target.closest('#hs-mhero'); if (!host) return;
      var api = H(); if (!api || api.len() < 2) return;
      var front = host.querySelector('.mh-slide[data-o="0"]'); if (!front) return;
      var t = e.touches[0];
      drag = { x: t.clientX, y: t.clientY, t: Date.now(), dx: 0, mode: '', front: front, next: peers(front).next, w: front.offsetWidth || 320, raf: 0 };
      api.stop();
    }, { passive: true });

    document.addEventListener('touchmove', function(e){
      if (!drag) return;
      var t = e.touches[0], dx = t.clientX - drag.x, dy = t.clientY - drag.y;
      if (!drag.mode) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        drag.mode = Math.abs(dx) > Math.abs(dy) * 1.1 ? 'x' : 'y';
        if (drag.mode === 'x') { drag.front.classList.add('ev-drag'); if (drag.next) drag.next.classList.add('ev-drag'); }
      }
      if (drag.mode !== 'x') return;
      drag.dx = dx;
      if (!drag.raf) drag.raf = requestAnimationFrame(function(){
        if (!drag) return; drag.raf = 0;
        var d = drag.dx, p = Math.min(1, Math.abs(d) / drag.w);
        drag.front.style.transform = 'translate3d(' + d + 'px,0,0) rotate(' + (d / drag.w * 5) + 'deg)';
        if (drag.next && d < 0) drag.next.style.transform = 'translate3d(' + ((1 - p) * 24) + 'px,0,0) scale(' + (0.945 + 0.055 * p) + ')';
      });
    }, { passive: true });

    function end(){
      if (!drag) return;
      var d = drag; drag = null; if (d.raf) cancelAnimationFrame(d.raf);
      var api = H();
      d.front.classList.remove('ev-drag'); d.front.style.transform = '';
      if (d.next) { d.next.classList.remove('ev-drag'); d.next.style.transform = ''; }
      if (!api) return;
      var cur = api.cur();
      if (d.mode === 'x') {
        lastDrag = Date.now();
        var v = Math.abs(d.dx) / Math.max(1, Date.now() - d.t);
        var commit = Math.abs(d.dx) > d.w * 0.2 || (v > 0.45 && Math.abs(d.dx) > 24);
        if (commit && d.dx > 0) { d.front.classList.add('ev-exit-r'); setTimeout(function(){ d.front.classList.remove('ev-exit-r'); }, 480); }
        api.go(commit ? (d.dx < 0 ? cur + 1 : cur - 1) : cur);
      } else api.go(cur);   /* tap / vertical scroll: just restart autoplay */
    }
    document.addEventListener('touchend', end, { passive: true });
    document.addEventListener('touchcancel', end, { passive: true });
    /* a swipe must not also count as a tap on the card */
    document.addEventListener('click', function(e){
      if (Date.now() - lastDrag < 350 && e.target.closest && e.target.closest('#hs-mhero')) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  })();

  /* ═══════════ D. MOBILE LIVE TV: search + categories + square tiles with blurred backdrop ═══════════ */
  (function(){
    var S = { g: '', q: '', limit: 60, sig: '', list: [], chipSig: '' };
    var root, grid, chipsEl, countEl, inputEl, sBox, more, io;
    function chans(){ return (window._cmsChannels || []).filter(function(c){ return c && c.channel_name; }); }
    function isLive(c){ return String(c.status_live_off || '').toUpperCase() === 'LIVE'; }
    function grp(c){ return String(c.group || 'Other').trim() || 'Other'; }
    function visible(){ var b = document.body.classList; return mq.matches && b.contains('hs-m-tv') && b.contains('hs-tvsub-live'); }

    function filtered(){
      var q = S.q.toLowerCase().trim();
      return chans().filter(function(c){
        if (S.g === '__live') { if (!isLive(c)) return false; } else if (S.g && grp(c) !== S.g) return false;
        return !q || String(c.channel_name).toLowerCase().indexOf(q) > -1 || grp(c).toLowerCase().indexOf(q) > -1;
      }).sort(function(a, b){ return (isLive(b) ? 1 : 0) - (isLive(a) ? 1 : 0); });
    }
    function buildChips(){
      var a = chans(), m = {}, live = 0;
      a.forEach(function(c){ var g = grp(c); m[g] = (m[g] || 0) + 1; if (isLive(c)) live++; });
      var gs = Object.keys(m).sort(function(x, y){ return m[y] - m[x]; });
      var h = '<button type="button" class="evl-chip' + (!S.g ? ' on' : '') + '" data-g="">All<em>' + a.length + '</em></button>'
        + (live ? '<button type="button" class="evl-chip' + (S.g === '__live' ? ' on' : '') + '" data-g="__live"><u></u>Live Now<em>' + live + '</em></button>' : '')
        + gs.map(function(g){ return '<button type="button" class="evl-chip' + (S.g === g ? ' on' : '') + '" data-g="' + esc(g) + '">' + esc(g) + '<em>' + m[g] + '</em></button>'; }).join('');
      if (h !== S.chipSig) { S.chipSig = h; chipsEl.innerHTML = h; }
    }
    function card(c, i){
      var n = String(c.channel_name || 'Channel'), img = c.icon_url || '', ini = n.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || 'TV';
      return '<div class="evc" role="button" tabindex="0" data-k="' + i + '"><span class="evc-th' + (img ? '' : ' noimg') + '" data-ini="' + esc(ini) + '">'
        + (img ? '<img class="bgi" loading="lazy" decoding="async" alt="" src="' + esc(img) + '"><img class="fg" loading="lazy" decoding="async" alt="" src="' + esc(img) + '">' : '')
        + (isLive(c) ? '<b class="evc-live">LIVE</b>' : '') + '</span><span class="evc-n">' + esc(n) + '</span><span class="evc-g">' + esc(grp(c)) + '</span></div>';
    }
    function render(force){
      if (!root) return;
      buildChips();
      var list = filtered();
      var sig = list.length + '|' + S.g + '|' + S.q + '|' + S.limit + '|' + list.slice(0, S.limit).map(function(c){ return (c.channel_name || '') + (isLive(c) ? 1 : 0) + (c.icon_url ? 1 : 0); }).join(',');
      if (sig === S.sig && !force) return;
      S.sig = sig; S.list = list;
      var live = list.filter(isLive).length;
      countEl.textContent = list.length ? (list.length + ' channel' + (list.length === 1 ? '' : 's') + (live ? ' \u00b7 ' + live + ' live' : '')) : '';
      grid.innerHTML = list.length ? list.slice(0, S.limit).map(card).join('')
        : '<div class="evl-empty">' + (chans().length ? 'No channels found.' : 'Loading channels\u2026') + '</div>';
      more.style.display = list.length > S.limit ? 'block' : 'none';
    }
    function openCh(c){
      if (!c) return;
      try {
        var url = c.watch_url || '#';
        sxOpenChannelPayload(sxEncPayload({ url: url, name: c.channel_name || 'Live Stream', raw: !!(window.sxIsRawStreamUrl && sxIsRawStreamUrl(url)) }));
      } catch(e){}
    }
    function init(){
      var anchor = document.getElementById('hs-tvswitch');
      if (!anchor) return false;
      if (document.getElementById('ev-lt')) return true;
      root = document.createElement('div'); root.id = 'ev-lt';
      root.innerHTML = '<div class="evl-bar"><div class="evl-s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>'
        + '<input type="search" placeholder="Search channels\u2026" autocomplete="off" spellcheck="false" enterkeyhint="search"><button type="button" class="evl-x" aria-label="Clear">&#10005;</button></div>'
        + '<div class="evl-chips"></div><div class="evl-count"></div></div><div class="evl-grid"></div><div class="evl-more"></div>';
      anchor.parentNode.insertBefore(root, anchor.nextSibling);
      grid = $('.evl-grid', root); chipsEl = $('.evl-chips', root); countEl = $('.evl-count', root);
      inputEl = $('input', root); sBox = $('.evl-s', root); more = $('.evl-more', root);
      var tm = 0;
      inputEl.addEventListener('input', function(){
        sBox.classList.toggle('has', !!inputEl.value);
        clearTimeout(tm); tm = setTimeout(function(){ S.q = inputEl.value; S.limit = 60; render(); }, 120);
      });
      $('.evl-x', root).addEventListener('click', function(){ inputEl.value = ''; sBox.classList.remove('has'); S.q = ''; S.limit = 60; render(); });
      chipsEl.addEventListener('click', function(e){
        var b = e.target.closest('.evl-chip'); if (!b) return;
        S.g = b.getAttribute('data-g') || ''; S.limit = 60; render(true);
        try { b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); } catch(_){}
      });
      grid.addEventListener('click', function(e){ var el = e.target.closest('.evc'); if (el) openCh(S.list[+el.getAttribute('data-k')]); });
      grid.addEventListener('keydown', function(e){ if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('evc')) { e.preventDefault(); e.target.click(); } });
      /* logo failed to load → show the channel's initials instead of a broken image */
      grid.addEventListener('error', function(e){
        var im = e.target; if (!im || im.tagName !== 'IMG') return;
        var th = im.closest('.evc-th'); if (!th) return; th.classList.add('noimg');
        [].forEach.call(th.querySelectorAll('img'), function(x){ x.remove(); });
      }, true);
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function(es){ if (es[0].isIntersecting && S.list.length > S.limit) { S.limit += 60; render(true); } }, { rootMargin: '600px 0px' });
        io.observe(more);
      }
      return true;
    }
    var tries = 0, ti = setInterval(function(){ if (init() || ++tries > 160) clearInterval(ti); }, 250);
    /* refresh while the Live TV view is on screen (channel LIVE/OFF flags change) and whenever the tab/mode flips */
    setInterval(function(){ if (root && visible()) render(); }, 4000);
    new MutationObserver(function(){ if (root && visible()) render(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ═══════════ E. SEARCH: paste/type an IMDB (tt…) or TMDB id → opens the player ═══════════ */
  (function(){
    var bar, cur = null;
    function detect(raw){
      raw = String(raw || '').trim();
      var m = raw.match(/tt\d{5,}/i); if (m) return { id: m[0].toLowerCase(), kind: 'IMDB' };
      if (/^\d{2,8}$/.test(raw)) return { id: raw, kind: 'TMDB' };
      return null;
    }
    function playMovie(id){
      var base = (typeof VIDAPI_EMBED_BASE !== 'undefined') ? VIDAPI_EMBED_BASE : 'https://vaplayer.ru';
      try { openStreamPlayer(vaBuildEmbedUrl(base + '/embed/movie/' + id), id, 'movie'); } catch(e){ console.warn(e); }
    }
    function playTv(id){
      try { vaPendingTvItem = { id: id, title: id }; vaOpenTvModal(id); } catch(e){ console.warn(e); }
    }
    function ensure(){
      if (bar) return bar;
      var top = $('#sx-search-overlay .sxs2-top'); if (!top) return null;
      bar = document.createElement('div'); bar.id = 'ev-idplay';
      bar.innerHTML = '<div class="t">ID detected: <b></b></div><div class="b"><button type="button" class="m">\u25B6 Play Movie</button><button type="button" class="v">\u25B6 TV Show</button></div>';
      top.appendChild(bar);
      $('.m', bar).addEventListener('click', function(){ if (cur) playMovie(cur.id); });
      $('.v', bar).addEventListener('click', function(){ if (cur) playTv(cur.id); });
      return bar;
    }
    function update(){
      var inp = document.getElementById('sx-search-input'); if (!inp) return;
      cur = detect(inp.value);
      var b = ensure(); if (!b) return;
      b.classList.toggle('show', !!cur);
      if (cur) $('.t b', b).textContent = cur.kind + ' ' + cur.id;
    }
    function wire(){
      var inp = document.getElementById('sx-search-input'); if (!inp) return false;
      if (inp._ev) return true; inp._ev = 1;
      inp.placeholder = 'Search, or paste IMDB (tt\u2026) / TMDB id';
      inp.addEventListener('input', update);
      inp.addEventListener('keydown', function(e){ if (e.key === 'Enter') { var d = detect(inp.value); if (d) { e.preventDefault(); inp.blur(); playMovie(d.id); } } });
      /* pasting a complete tt id opens it straight away */
      inp.addEventListener('paste', function(){ setTimeout(function(){
        var v = inp.value.trim(); update();
        if (/^tt\d{5,}$/i.test(v)) { inp.blur(); playMovie(v.toLowerCase()); }
      }, 0); });
      var ov = document.getElementById('sx-search-overlay');
      if (ov) new MutationObserver(update).observe(ov, { attributes: true, attributeFilter: ['class'] });
      var clr = $('#sx-search-overlay .sx-search-clear'); if (clr) clr.addEventListener('click', function(){ setTimeout(update, 0); });
      return true;
    }
    var n = 0, iv = setInterval(function(){ if (wire() || ++n > 80) clearInterval(iv); }, 250);
  })();
})();


;

(function(){
  function build(){
    var sel=document.getElementById('smo-game-select'), tb=document.getElementById('smo-toolbar');
    if(!sel||!tb) return;
    var box=document.getElementById('ev-pop-slider');
    if(!box){
      box=document.createElement('div'); box.id='ev-pop-slider';
      box.innerHTML='<div class="evp-h">Popular Tournaments</div><div class="evp-track"></div>';
      tb.parentNode.insertBefore(box,tb);
      box.addEventListener('click',function(e){
        var c=e.target.closest('.evp-chip'); if(!c) return;
        if(typeof smoSelectGame==='function') smoSelectGame(c.dataset.game);
      });
    }
    var opts=[].slice.call(sel.options);
    var sig=opts.map(function(o){return o.value;}).join('|');
    var track=box.querySelector('.evp-track');
    if(box.dataset.sig!==sig){
      box.dataset.sig=sig;
      track.innerHTML=opts.map(function(o){
        var live=o.value==='LIVE_NOW';
        var label=o.value==='ALL'?'All':(live?'Live Now':o.textContent);
        return '<button type="button" class="evp-chip'+(live?' live':'')+'" data-game="'+
          o.value.replace(/"/g,'&quot;')+'">'+label.replace(/</g,'&lt;')+'</button>';
      }).join('');
    }
    box.style.display=(tb.style.display==='none'||opts.length<2)?'none':'';
    [].forEach.call(track.children,function(c){ c.classList.toggle('active',c.dataset.game===sel.value); });
  }
  function init(){
    build();
    var sel=document.getElementById('smo-game-select');
    if(sel){ new MutationObserver(build).observe(sel,{childList:true}); sel.addEventListener('change',build); }
    var tb=document.getElementById('smo-toolbar');
    if(tb) new MutationObserver(build).observe(tb,{attributes:true,attributeFilter:['style']});
    document.addEventListener('click',function(){ setTimeout(build,50); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

;

(function(){
  function tag(){
    var r=document.getElementById('sx-search-results'); if(!r) return;
    r.querySelectorAll('.fx2-thumb,.sxs-poster .pi,.epg-thumb').forEach(function(box){
      if(box.dataset.evbg) return;
      var im=box.querySelector('img'); var u=im&&(im.currentSrc||im.getAttribute('src'));
      if(!u) return;
      box.dataset.evbg='1';
      box.style.setProperty('--evbg','url("'+u.replace(/"/g,'%22')+'")');
    });
  }
  function init(){
    var r=document.getElementById('sx-search-results'); if(!r) return;
    new MutationObserver(tag).observe(r,{childList:true,subtree:true});
    tag();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

;

(function(){
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition, rec=null, active=false, msgT=null, finalTxt='';
  function $(id){return document.getElementById(id);}
  function say(t,err,keep){
    var m=$('ev-voice-msg'); if(!m) return;
    clearTimeout(msgT); m.textContent=t||''; m.classList.toggle('show',!!t); m.classList.toggle('err',!!err);
    if(t&&!keep) msgT=setTimeout(function(){ m.classList.remove('show'); },3800);
  }
  function setUI(on){
    active=on;
    var b=$('ev-mic'), bar=document.querySelector('.sx-search-bar'), inp=$('sx-search-input');
    if(b){ b.classList.toggle('listening',on); b.setAttribute('aria-pressed',on?'true':'false'); }
    if(bar) bar.classList.toggle('ev-listening',on);
    if(inp){ if(on){ inp.dataset.ph=inp.placeholder; inp.placeholder='Listening\u2026 speak now'; } else if(inp.dataset.ph){ inp.placeholder=inp.dataset.ph; } }
  }
  function apply(text){
    var inp=$('sx-search-input'); if(!inp) return;
    inp.value=text;
    var bar=document.querySelector('.sx-search-bar'); if(bar) bar.classList.toggle('has-text',!!text);
    if(typeof sxSearchTyped==='function') sxSearchTyped(text); else if(typeof sxRunSearch==='function') sxRunSearch(text);
  }
  function stop(){ try{ rec&&rec.abort(); }catch(e){} setUI(false); say(''); }
  function start(){
    if(!SR){ say('Voice search isn\u2019t supported in this browser. Try Chrome or Safari.',true); return; }
    if(!window.isSecureContext){ say('Voice search needs a secure (https) page.',true); return; }
    if(active){ try{ rec.stop(); }catch(e){} return; }
    rec=new SR();
    rec.lang=(window.evVoiceLang?window.evVoiceLang():'en-IN');
    rec.interimResults=true; rec.continuous=false; rec.maxAlternatives=1;
    finalTxt='';
    rec.onstart=function(){ setUI(true); say('Listening\u2026',false,true); };
    rec.onresult=function(e){
      var interim='';
      for(var i=e.resultIndex;i<e.results.length;i++){
        var r=e.results[i]; if(r.isFinal) finalTxt+=r[0].transcript; else interim+=r[0].transcript;
      }
      apply((finalTxt+interim).trim());
    };
    rec.onerror=function(e){
      var c=e.error;
      if(c==='not-allowed'||c==='service-not-allowed') say('Microphone blocked. Allow mic access in your browser settings and try again.',true);
      else if(c==='no-speech') say('Didn\u2019t catch that. Tap the mic and try again.',true);
      else if(c==='audio-capture') say('No microphone found.',true);
      else if(c==='language-not-supported') say('This browser can\u2019t recognise that language. Pick another one.',true);
      else if(c==='network') say('Voice search needs an internet connection.',true);
      else if(c!=='aborted') say('Voice search error: '+c,true);
    };
    rec.onend=function(){
      setUI(false);
      var m=$('ev-voice-msg'); if(m&&!m.classList.contains('err')) say('');
      var inp=$('sx-search-input'); if(inp&&finalTxt.trim()){ apply(finalTxt.trim()); }
    };
    try{ rec.start(); }catch(err){ setUI(false); say('Couldn\u2019t start the microphone.',true); }
  }
  function init(){
    var b=$('ev-mic'); if(!b) return;
    b.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); start(); });
    var ov=$('sx-search-overlay');
    if(ov) new MutationObserver(function(){ if(!ov.classList.contains('open')&&active) stop(); }).observe(ov,{attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

;

(function(){
  var SEL=['#hs-hero h1','#hs-hero .sub','.mh-t','.mh-m','.slide-title','.slide-sub','.hsc-title',
    '.sxs-card[data-k] .sxs-bar','.fx2-title','.smo-name','.smo-vs','.sxv-t','#sxs-pop .pt','.sp-rail-name','.mws-more-title','.mws-right-title'].join(',');
  var QUICK=/[\[\(\{]/;
  function clean(el){
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n,list=[];
    while((n=w.nextNode())) list.push(n);
    list.forEach(function(t){
      var v=t.nodeValue; if(!v||!QUICK.test(v)) return;
      var nv=window.evStripLang(v); if(nv!==v.trim()&&nv!==v){ t.nodeValue=nv; }
    });
    if(el.title&&QUICK.test(el.title)) el.title=window.evStripLang(el.title);
  }
  var pend=false, queue=new Set();
  function flush(){
    pend=false; var arr=Array.from(queue); queue.clear();
    arr.forEach(function(r){
      if(!r||!r.isConnected) return;
      if(r.nodeType===1){ if(r.matches&&r.matches(SEL)) clean(r); r.querySelectorAll&&r.querySelectorAll(SEL).forEach(clean); }
      if(r.nodeType===3&&r.parentElement){ var p=r.parentElement.closest(SEL); if(p) clean(p); }
    });
  }
  function enq(x){ queue.add(x); if(!pend){ pend=true; requestAnimationFrame(flush); } }
  function init(){
    if(!window.evStripLang) return;
    new MutationObserver(function(ms){
      ms.forEach(function(m){
        if(m.type==='characterData'){ enq(m.target); }
        else m.addedNodes.forEach(function(n){ if(n.nodeType===1||n.nodeType===3) enq(n); });
      });
    }).observe(document.body,{childList:true,subtree:true,characterData:true});
    enq(document.body);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

;

(function(){
  function state(card){
    var b=card.querySelector('.fx2-badge'); var t=(b&&b.textContent||'').toUpperCase();
    return /LIVE/.test(t)?'live':/FINISH|OVER|ENDED/.test(t)?'finished':'upcoming';
  }
  function tag(){
    var r=document.getElementById('sx-search-results'); if(!r) return;
    r.querySelectorAll('.fx2-card').forEach(function(c){ var st=state(c); if(c.dataset.evs!==st) c.dataset.evs=st; });
  }
  function init(){
    var r=document.getElementById('sx-search-results'); if(!r) return;
    new MutationObserver(tag).observe(r,{childList:true,subtree:true}); tag();
    /* tap anywhere on a result row = tap its action button */
    r.addEventListener('click',function(e){
      if(!window.matchMedia('(max-width:900px)').matches) return;
      var card=e.target.closest('.fx2-card'); if(!card||e.target.closest('a,button')) return;
      var btn=card.querySelector('.smo-btn'); if(btn) btn.click();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

;

(function(){
  var L=[
  ['Afrikaans','af-ZA'],['Albanian','sq-AL'],['Amharic','am-ET'],['Arabic (Egypt)','ar-EG'],['Arabic (Saudi Arabia)','ar-SA'],['Arabic (UAE)','ar-AE'],['Arabic (Iraq)','ar-IQ'],
  ['Arabic (Jordan)','ar-JO'],['Arabic (Kuwait)','ar-KW'],['Arabic (Lebanon)','ar-LB'],['Arabic (Morocco)','ar-MA'],['Arabic (Algeria)','ar-DZ'],['Arabic (Tunisia)','ar-TN'],['Arabic (Qatar)','ar-QA'],
  ['Armenian','hy-AM'],['Azerbaijani','az-AZ'],['Basque','eu-ES'],['Bengali (India)','bn-IN'],['Bengali (Bangladesh)','bn-BD'],['Bulgarian','bg-BG'],['Burmese','my-MM'],['Catalan','ca-ES'],
  ['Chinese (Mandarin, Simplified)','zh-CN'],['Chinese (Mandarin, Taiwan)','zh-TW'],['Chinese (Cantonese)','yue-Hant-HK'],['Croatian','hr-HR'],['Czech','cs-CZ'],['Danish','da-DK'],['Dutch','nl-NL'],['Dutch (Belgium)','nl-BE'],
  ['English (India)','en-IN'],['English (US)','en-US'],['English (UK)','en-GB'],['English (Australia)','en-AU'],['English (Canada)','en-CA'],['English (NZ)','en-NZ'],['English (South Africa)','en-ZA'],
  ['English (Ireland)','en-IE'],['English (Singapore)','en-SG'],['English (Philippines)','en-PH'],['English (Nigeria)','en-NG'],['English (Kenya)','en-KE'],['English (Ghana)','en-GH'],['English (Tanzania)','en-TZ'],
  ['Estonian','et-EE'],['Filipino','fil-PH'],['Finnish','fi-FI'],['French (France)','fr-FR'],['French (Canada)','fr-CA'],['French (Belgium)','fr-BE'],['French (Switzerland)','fr-CH'],['Galician','gl-ES'],
  ['Georgian','ka-GE'],['German (Germany)','de-DE'],['German (Austria)','de-AT'],['German (Switzerland)','de-CH'],['Greek','el-GR'],['Gujarati','gu-IN'],['Hebrew','he-IL'],['Hindi','hi-IN'],['Hungarian','hu-HU'],
  ['Icelandic','is-IS'],['Indonesian','id-ID'],['Italian','it-IT'],['Japanese','ja-JP'],['Javanese','jv-ID'],['Kannada','kn-IN'],['Kazakh','kk-KZ'],['Khmer','km-KH'],['Korean','ko-KR'],['Lao','lo-LA'],
  ['Latvian','lv-LV'],['Lithuanian','lt-LT'],['Macedonian','mk-MK'],['Malay','ms-MY'],['Malayalam','ml-IN'],['Marathi','mr-IN'],['Mongolian','mn-MN'],['Nepali','ne-NP'],['Norwegian','nb-NO'],
  ['Persian','fa-IR'],['Polish','pl-PL'],['Portuguese (Brazil)','pt-BR'],['Portuguese (Portugal)','pt-PT'],['Punjabi','pa-Guru-IN'],['Romanian','ro-RO'],['Russian','ru-RU'],['Serbian','sr-RS'],['Sinhala','si-LK'],
  ['Slovak','sk-SK'],['Slovenian','sl-SI'],['Spanish (Spain)','es-ES'],['Spanish (Mexico)','es-MX'],['Spanish (US)','es-US'],['Spanish (Argentina)','es-AR'],['Spanish (Colombia)','es-CO'],['Spanish (Chile)','es-CL'],
  ['Spanish (Peru)','es-PE'],['Spanish (Venezuela)','es-VE'],['Sundanese','su-ID'],['Swahili (Kenya)','sw-KE'],['Swahili (Tanzania)','sw-TZ'],['Swedish','sv-SE'],['Tamil (India)','ta-IN'],['Tamil (Sri Lanka)','ta-LK'],
  ['Tamil (Singapore)','ta-SG'],['Tamil (Malaysia)','ta-MY'],['Telugu','te-IN'],['Thai','th-TH'],['Turkish','tr-TR'],['Ukrainian','uk-UA'],['Urdu (Pakistan)','ur-PK'],['Urdu (India)','ur-IN'],['Uzbek','uz-UZ'],
  ['Vietnamese','vi-VN'],['Zulu','zu-ZA']];
  var KEY='evVoiceLang', cur=null;
  function store(v){ try{ if(v===undefined) return localStorage.getItem(KEY); localStorage.setItem(KEY,v); }catch(e){ return null; } }
  function resolve(v){
    if(!v||v==='auto'){ var n=(navigator.language||'en-IN'); return n; }
    return v;
  }
  window.evVoiceLang=function(){ cur=cur||store()||'en-IN'; return resolve(cur); };
  function label(v){
    if(v==='auto') return 'Auto';
    var r=resolve(v), e=L.filter(function(x){return x[1]===r;})[0];
    return e? (e[1].split('-').slice(-2).join('-').replace('Guru-','').toUpperCase()) : r.toUpperCase();
  }
  function $(id){return document.getElementById(id);}
  function build(){
    var mic=$('ev-mic'), top=document.querySelector('#sx-search-overlay .sxs2-top');
    if(!mic||!top||$('ev-lang')) return;
    var b=document.createElement('button'); b.type='button'; b.id='ev-lang'; b.className='ev-lang'; b.title='Voice language'; b.setAttribute('aria-label','Voice search language');
    mic.parentNode.insertBefore(b,mic.nextSibling);
    var p=document.createElement('div'); p.id='ev-lang-panel'; p.setAttribute('role','dialog');
    p.innerHTML='<div class="evl-h">Voice search language</div><input type="text" id="evl-q" placeholder="Search language\u2026" autocomplete="off" spellcheck="false"><div class="evl-list" id="evl-list"></div><div class="evl-n">Languages shown are those your browser can recognise by voice (Chrome and Safari support a subset). Spoken words are matched against the titles on this site.</div>';
    top.style.position=top.style.position||'sticky'; top.appendChild(p);
    cur=cur||store()||'en-IN'; b.textContent=label(cur);
    function render(q){
      q=(q||'').toLowerCase().trim();
      var items=[['Auto (device language)','auto']].concat(L).filter(function(x){return !q||x[0].toLowerCase().indexOf(q)>-1||x[1].toLowerCase().indexOf(q)>-1;});
      var h=items.map(function(x){ var on=(x[1]===cur)?' on':''; return '<button type="button" class="evl-i'+on+'" data-v="'+x[1]+'">'+x[0]+'<small>'+(x[1]==='auto'?resolve('auto'):x[1])+'</small></button>'; }).join('');
      $('evl-list').innerHTML=h||'<div class="evl-empty">No language found</div>';
    }
    function open(){ render(''); $('evl-q').value=''; p.classList.add('open'); var a=p.querySelector('.evl-i.on'); if(a) a.scrollIntoView({block:'center'}); }
    function close(){ p.classList.remove('open'); }
    b.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); p.classList.contains('open')?close():open(); });
    $('evl-q').addEventListener('input',function(){ render(this.value); });
    p.addEventListener('click',function(e){
      e.stopPropagation(); var it=e.target.closest('.evl-i'); if(!it) return;
      cur=it.dataset.v; store(cur); b.textContent=label(cur); close();
      var m=$('ev-voice-msg'); if(m){ m.textContent='Voice language: '+it.firstChild.nodeValue; m.className='ev-voice-msg show'; setTimeout(function(){ m.classList.remove('show'); },2200); }
    });
    document.addEventListener('click',function(e){ if(!p.contains(e.target)&&e.target!==b) close(); });
    var ov=$('sx-search-overlay'); if(ov) new MutationObserver(function(){ if(!ov.classList.contains('open')) close(); }).observe(ov,{attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();

;

/* WebView image speed-up: no lazy-wait for card images, early connections to image hosts, top images get priority */
(function(){
  var SEL='#sxs-home,#sxs-root,#sxs-live,#hs-mhero,#sx-search-results,#movies-page-inner,#tv-page-inner,#livetv-page-inner,.slide,.hsm-card';
  var seen={}, n=0;
  function pre(u){
    try{
      var o=new URL(u,location.href).origin; if(seen[o]||o===location.origin||!/^https?:/.test(o)) return; seen[o]=1;
      var l=document.createElement('link'); l.rel='preconnect'; l.href=o; l.crossOrigin='anonymous'; document.head.appendChild(l);
      var d=document.createElement('link'); d.rel='dns-prefetch'; d.href=o; document.head.appendChild(d);
    }catch(e){}
  }
  function fast(img){
    if(img._evf) return; img._evf=1;
    try{
      if(img.closest(SEL)){
        img.loading='eager'; img.decoding='async';
        if(n++<10) img.fetchPriority='high';
      }
      if(img.src) pre(img.src);
    }catch(e){}
  }
  function scan(root){
    if(root.nodeType!==1) return;
    if(root.tagName==='IMG'){ fast(root); return; }
    var im=root.querySelectorAll?root.querySelectorAll('img'):[];
    for(var i=0;i<im.length;i++) fast(im[i]);
  }
  var q=[],raf=0;
  new MutationObserver(function(ms){
    for(var i=0;i<ms.length;i++) for(var j=0;j<ms[i].addedNodes.length;j++) q.push(ms[i].addedNodes[j]);
    if(!raf) raf=requestAnimationFrame(function(){ raf=0; var a=q; q=[]; a.forEach(scan); });
  }).observe(document.documentElement,{childList:true,subtree:true});
  [].forEach.call(document.images||[],fast);
  /* origins we know will serve posters / banners */
  ['https://image.tmdb.org'].forEach(pre);
})();

;

/* Keep links INSIDE the app: external links open in an in-page popup instead of leaving the WebView */
(function(){
  var box=null, fr=null, hostEl=null, cur='';
  function build(){
    if(box) return;
    box=document.createElement('div'); box.id='evlp';
    box.innerHTML='<div class="bar"><button type="button" data-a="x" aria-label="Close">\u2715</button><span class="host"></span><button type="button" data-a="r">Reload</button><button type="button" data-a="o">Open in browser</button></div><div class="ld"></div><iframe referrerpolicy="no-referrer" allow="fullscreen; autoplay; clipboard-write" allowfullscreen></iframe>';
    document.body.appendChild(box);
    fr=box.querySelector('iframe'); hostEl=box.querySelector('.host');
    fr.addEventListener('load',function(){ var l=box.querySelector('.ld'); if(l) l.style.display='none'; });
    box.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return; var a=b.getAttribute('data-a');
      if(a==='x') close();
      else if(a==='r'){ box.querySelector('.ld').style.display=''; fr.src=cur; }
      else if(a==='o'){ try{ window.__sxAllowPopup=true; var w=window.open(cur,'_blank','noopener'); if(!w) location.href=cur; }catch(_){} }
    });
    window.addEventListener('popstate',function(){ if(box.classList.contains('open')) close(true); });
  }
  function close(fromPop){
    if(!box) return; box.classList.remove('open'); try{ fr.src='about:blank'; }catch(_){}
    document.documentElement.style.overflow='';
    if(!fromPop && history.state && history.state.evlp){ try{ history.back(); }catch(_){} }
  }
  function show(url){
    build(); cur=url;
    try{ hostEl.textContent=new URL(url).host; }catch(_){ hostEl.textContent=url; }
    box.querySelector('.ld').style.display='';
    fr.src=url; box.classList.add('open'); document.documentElement.style.overflow='hidden';
    try{ history.pushState({evlp:1},''); }catch(_){}
  }
  window.evOpenLink=show;
  function isExternal(a){
    var h=a.getAttribute('href')||''; if(!/^https?:\/\//i.test(h)) return false;
    try{ var u=new URL(h,location.href); return u.origin!==location.origin; }catch(_){ return false; }
  }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button>0||e.ctrlKey||e.metaKey) return;
    var a=e.target.closest&&e.target.closest('a[href]'); if(!a) return;
    if(a.closest('#evlp')||a.hasAttribute('download')||a.hasAttribute('data-evlp-skip')) return;
    if(!isExternal(a)) return;
    e.preventDefault(); e.stopPropagation(); show(a.href);
  },true);
  /* trusted code that calls window.open(url) goes to the popup too */
  var prev=window.open;
  window.open=function(u){
    try{ if(u && /^https?:\/\//i.test(String(u)) && !window.__sxAllowPopup){ show(String(u)); return null; } }catch(_){}
    return prev.apply(window,arguments);
  };
})();
/* message / community icon: clearer chat-bubble icon, always opens the community panel */
(function(){
  var SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3.5 20.5l1.6-4.8A8.5 8.5 0 1 1 21 11.5z"/><circle cx="8.5" cy="11.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="11.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="11.5" r="1.1" fill="currentColor" stroke="none"/></svg>';
  var n=0,iv=setInterval(function(){
    var t=document.querySelector('.mobile-tabbar .mtab-prof');
    if(t){ if(!t._evfix){ t._evfix=1; t.innerHTML=SVG; t.setAttribute('aria-label','Community'); } clearInterval(iv); }
    else if(++n>80) clearInterval(iv);
  },250);
})();

;

/* 18+ titles: badge on every card (phone + PC) and an "I am 18+" confirmation before playing */
(function(){
  var BAD=/\b(xxx|porn\w*|erotic\w*|hentai|nude|naked|bdsm|fetish|kamasutra|uncensored|sexy|sex|sexual|sensual|seduc\w*|adult(s)? only|adult film|18\+|lust|call girl|escort|stripper|mistress|affair)\b/i;
  var CERT=/^(r|nc-?17|tv-?ma|a|x|18\+?|xxx)$/i;
  function is18(m){
    if(!m) return false;
    if(m.adult===true||m.adult==='1'||m.adult==='true'||m.adult===1||m.is_adult===true) return true;
    var c=String(m.certification||m.age_rating||m.rated||m.content_rating||'').trim(); if(c&&CERT.test(c)) return true;
    var g=String(m.genre||''); if(/\b(adult|erotic|erotica)\b/i.test(g)) return true;
    return BAD.test(String(m.title||''));
  }
  window.evIs18=is18;
  var idx={}, n=-1;
  function norm(t){ return String(t||'').toLowerCase().replace(/\s*\(\d{4}\)\s*$/,'').replace(/\s+s\d+e\d+\s*$/i,'').replace(/[^a-z0-9\u0080-\uffff]+/g,' ').trim(); }
  var dm=0,dt=0;
  function add18(m){ if(is18(m)){ var k=norm(m.title); if(k) idx[k]=1; } }
  function build(){
    var P=window.vaPools; if(!P) return;
    var am=(P.movie&&P.movie.all)||[], at=(P.tv&&P.tv.all)||[], t=am.length+at.length;
    if(t===n) return; n=t;
    if(am.length<dm||at.length<dt){ dm=0; dt=0; idx={}; }
    for(;dm<am.length;dm++) add18(am[dm]);
    for(;dt<at.length;dt++) add18(at[dt]);
  }
  function titleIs18(t){ build(); var k=norm(t); return !!(k&&(idx[k]||BAD.test(t))); }
  window.evTitleIs18=titleIs18;
  /* ── badges ── */
  var MAP=[['.va-movie-card','.va-movie-title','.va-movie-poster'],['.sxs-card.sxs-po','.sxs-bar','.sxs-th'],['.sxs-poster','.pt','.pi'],['.mh-slide','.mh-t',null],['.slide','.slide-title',null],['.hsm-card','.hsm-t',null]];
  function mark(root){
    build();
    MAP.forEach(function(r){
      var els=root.matches&&root.matches(r[0])?[root]:[]; if(root.querySelectorAll) els=els.concat([].slice.call(root.querySelectorAll(r[0])));
      els.forEach(function(el){
        if(el._e18===1) return;
        var te=el.querySelector(r[1]); if(!te) return;
        var t=te.getAttribute('title')||te.textContent; if(!t) return;
        el._e18=1;
        if(!titleIs18(t)) return;
        el.setAttribute('data-ev18','1');
        var host=r[2]?el.querySelector(r[2]):el; if(!host||host.querySelector(':scope > .ev18')) return;
        var b=document.createElement('i'); b.className='ev18'; b.textContent='18+'; host.appendChild(b);
      });
    });
  }
  var q=[],raf=0;
  new MutationObserver(function(ms){
    for(var i=0;i<ms.length;i++) for(var j=0;j<ms[i].addedNodes.length;j++){ var x=ms[i].addedNodes[j]; if(x.nodeType===1) q.push(x); }
    if(!raf) raf=requestAnimationFrame(function(){ raf=0; var a=q; q=[]; a.forEach(mark); });
  }).observe(document.documentElement,{childList:true,subtree:true});
  /* a slide / card can be re-used with new text: recheck when pools grow */
  setInterval(function(){ var l=n; build(); if(l!==n) mark(document.body); },6000);
  mark(document.body);
  /* ── confirmation ── */
  var gate=null,pending=null;
  function ok(){ try{ return sessionStorage.getItem('ev18ok')==='1'; }catch(e){ return !!window._ev18ok; } }
  function setOk(){ try{ sessionStorage.setItem('ev18ok','1'); }catch(e){} window._ev18ok=true; }
  function ask(title,go){
    if(ok()){ go(); return; }
    if(!gate){
      gate=document.createElement('div'); gate.id='ev18-gate';
      gate.innerHTML='<div class="bx" role="dialog" aria-modal="true"><div class="big">18+</div><h3>Adult content</h3><div class="t"></div><p>This title is meant for viewers aged 18 or older and may contain mature content. Please confirm your age to continue.</p><button type="button" class="y">Yes, I am 18 or older</button><button type="button" class="n">No, go back</button></div>';
      document.body.appendChild(gate);
      gate.querySelector('.y').onclick=function(){ setOk(); gate.classList.remove('open'); var g=pending; pending=null; if(g) g(); };
      gate.querySelector('.n').onclick=function(){ gate.classList.remove('open'); pending=null; };
      gate.addEventListener('click',function(e){ if(e.target===gate){ gate.classList.remove('open'); pending=null; } });
    }
    gate.querySelector('.t').textContent=title||'';
    pending=go; gate.classList.add('open');
  }
  window.evAge18=ask;
  /* wrap the play entry points (movies, TV episode picker, streams) */
  var osp=window.openStreamPlayer;
  if(typeof osp==='function') window.openStreamPlayer=function(url,name,type){
    var a=arguments,self=this;
    if((type==='movie'||type==='tv')&&titleIs18(name)&&!ok()){ ask(name,function(){ osp.apply(self,a); }); return; }
    return osp.apply(this,arguments);
  };
  var otm=window.vaOpenTvModal;
  if(typeof otm==='function') window.vaOpenTvModal=function(label){
    var a=arguments,self=this;
    if(titleIs18(label||(window.vaPendingTvItem&&vaPendingTvItem.title))&&!ok()){ ask(label,function(){ otm.apply(self,a); }); return; }
    return otm.apply(this,arguments);
  };
})();

;

/* Player (PC + phone): "More channels / matches / like this" list shows 5 items only */
(function(){
  var f=window.populateStreamPlayerRail; if(typeof f!=='function') return;
  window.populateStreamPlayerRail=function(){
    var r=f.apply(this,arguments);
    try{
      {
        var list=document.getElementById('stream-player-rail-list'); if(!list) return r;
        var items=list.querySelectorAll('.sp-rail-item');
        for(var i=5;i<items.length;i++) items[i].remove();
      }
    }catch(e){}
    return r;
  };
})();

;

(function(){
  var GEN=[['Action','Action'],['Comedy','Comedy'],['Thriller','Thriller'],['Horror','Horror'],['Sci-Fi','Sci-Fi'],['Drama','Drama'],['Animation','Anime & Animation'],['Fantasy','Fantasy'],['Documentary','Documentary']];
  var SORTS=[['latest','Latest'],['pop','Popular'],['rate','Top rated'],['az','A\u2013Z']];
  function mob(){return matchMedia('(max-width:900px)').matches;}
  function canHover(){return matchMedia('(min-width:901px) and (hover:hover)').matches;}
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function P(m){return m._p===undefined?(m._p=parseFloat(m.popularity)||0):m._p;}
  function R(m){return m._r===undefined?(m._r=parseFloat(m.rating)||0):m._r;}
  function T(m){return m._t||(m._t=(m.title||'').toLowerCase());}
  function play(m,type){
    var label=m.title+(m.year?' ('+m.year+')':'');
    if(type==='tv'){vaPendingTvItem={id:m.tmdb_id||m.imdb_id,title:m.title};vaOpenTvModal(label);}
    else openStreamPlayer(vaBuildEmbedUrl(m.embed_url),label,'movie');
  }
  function mk(m,type){
    var c=document.createElement('div');
    c.className='hsm-card';c._m=m;c._ty=type;c.setAttribute('role','button');c.tabIndex=0;
    c.title=m.title||'';c.setAttribute('aria-label',m.title||'Play');
    c.innerHTML=m.poster_url?'<img src="'+esc(m.poster_url)+'" alt="'+esc(m.title)+'" loading="lazy" decoding="async">':'<div class="ft">'+esc(m.title)+'</div>';
    var im=c.querySelector('img');
    if(im)im.onerror=function(){im.remove();c.insertAdjacentHTML('beforeend','<div class="ft">'+esc(m.title)+'</div>');};
    c.onclick=function(){play(m,type);};
    c.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play(m,type);}};
    return c;
  }

  /* ═════ "All titles": windowed grid — only the posters near the screen exist in the DOM ═════ */
  function VGrid(type,pageId,scrollId){
    var host=document.querySelector('#'+pageId+' .hsm-page'),sc=document.getElementById(scrollId);
    if(!host||!sc||!window.vaPools)return;
    var pool=vaPools[type],input=host.querySelector('input'),sent=host.querySelector('.hsm-sentinel');
    var sec=document.createElement('section');sec.className='hsm-all';
    sec.innerHTML='<div class="ha-head"><h2 class="hsm-row-title">All '+(type==='tv'?'TV Shows':'Movies')+'</h2><span class="ha-count"></span></div>'+
      '<div class="ha-ctl"><div class="ha-sorts">'+SORTS.map(function(s,i){return '<button type="button" class="ha-sort'+(i?'':' on')+'" data-s="'+s[0]+'">'+s[1]+'</button>';}).join('')+'</div>'+
      '<select class="ha-genre" aria-label="Genre"><option value="">All genres</option>'+GEN.map(function(g){return '<option value="'+g[0]+'">'+g[1]+'</option>';}).join('')+'</select></div><div class="hsm-vg"></div>';
    host.insertBefore(sec,sent);
    var vg=sec.querySelector('.hsm-vg'),cnt=sec.querySelector('.ha-count');
    var sort='latest',gk='',list=pool.all,scanned=0,snapN=-1,snapAt=0,lastLen=-1,lastGrow=0,cols=0,cw=0,rowH=0,gap=9,nodes=new Map(),raf=0;
    function gm(m){return (m.genre||'').toLowerCase().indexOf(gk)>-1;}
    function cmp(a,b){
      if(sort==='pop')return P(b)-P(a);
      if(sort==='rate')return R(b)-R(a);
      var x=T(a),y=T(b);return x<y?-1:x>y?1:0;
    }
    function reset(){list=null;scanned=0;snapN=-1;clearNodes();compute(true);render();}
    function compute(force){
      var all=pool.all,n=all.length,now=Date.now();
      if(n!==lastLen){lastLen=n;lastGrow=now;}
      if(sort==='latest'){                       /* arrival order: only ever appends, so nothing jumps while loading */
        if(!gk){list=all;return;}
        if(force||!list||list===all||n<scanned){list=[];scanned=0;}
        for(;scanned<n;scanned++){if(gm(all[scanned]))list.push(all[scanned]);}
        return;
      }
      var inGrid=vg.getBoundingClientRect().top<sc.getBoundingClientRect().top,settled=now-lastGrow>2500;
      if(force||!list||(n!==snapN&&now-snapAt>3000&&(settled||!inGrid))){
        var a=gk?all.filter(gm):all.slice();a.sort(cmp);list=a;snapN=n;snapAt=now;
      }
    }
    function clearNodes(){nodes.forEach(function(el){el.remove();});nodes.clear();}
    function layout(){
      var W=vg.clientWidth;if(!W)return false;
      var m=mob(),g=m?8:10,c=Math.max(2,Math.floor((W+g)/((m?104:150)+g))),w=(W-g*(c-1))/c;
      if(c!==cols||Math.abs(w-cw)>.5||g!==gap){cols=c;cw=w;gap=g;rowH=w*1.5+g;clearNodes();}
      return true;
    }
    function render(){
      if(sec.style.display==='none'||!list||!layout())return;
      var n=list.length,rows=Math.ceil(n/cols);
      vg.style.height=Math.max(0,rows*rowH-gap)+'px';
      var y0=sc.getBoundingClientRect().top-vg.getBoundingClientRect().top,vh=sc.clientHeight,buf=vh*1.2;
      var r0=Math.max(0,Math.floor((y0-buf)/rowH)),r1=Math.min(rows-1,Math.floor((y0+vh+buf)/rowH));
      if(r1<r0){clearNodes();return;}
      var from=r0*cols,to=Math.min(n,(r1+1)*cols);
      nodes.forEach(function(el,i){if(i<from||i>=to){el.remove();nodes.delete(i);}});
      var frag=document.createDocumentFragment();
      for(var i=from;i<to;i++){
        var el=nodes.get(i);
        if(el&&el._m===list[i])continue;
        if(el)el.remove();
        el=mk(list[i],type);
        el.style.cssText='left:'+((i%cols)*(cw+gap))+'px;top:'+(((i/cols)|0)*rowH)+'px;width:'+cw+'px;height:'+(cw*1.5)+'px';
        nodes.set(i,el);frag.appendChild(el);
      }
      vg.appendChild(frag);
    }
    function sched(){if(!raf)raf=requestAnimationFrame(function(){raf=0;render();});}
    function tick(){
      if(!sc.classList.contains('open'))return;
      sec.style.display=input&&input.value.trim()?'none':'';
      if(sec.style.display==='none')return;
      compute(false);
      cnt.textContent=list?list.length.toLocaleString()+' titles'+(Date.now()-lastGrow<3000?' \u00b7 still loading\u2026':''):'';
      render();
    }
    sc.addEventListener('scroll',sched,{passive:true});
    if(window.ResizeObserver)new ResizeObserver(sched).observe(vg);else window.addEventListener('resize',sched);
    sec.addEventListener('click',function(e){
      var b=e.target.closest('.ha-sort');if(!b)return;
      sort=b.getAttribute('data-s');
      sec.querySelectorAll('.ha-sort').forEach(function(x){x.classList.toggle('on',x===b);});
      reset();
    });
    sec.querySelector('.ha-genre').addEventListener('change',function(){gk=this.value.toLowerCase();reset();});
    if(input)input.addEventListener('input',tick);
    host.addEventListener('click',function(e){if(e.target.closest('.hsm-clear'))setTimeout(tick,0);});
    setInterval(tick,1000);
  }
  VGrid('movie','movies-page-inner','movies-overlay');
  VGrid('tv','tv-page-inner','tv-overlay');

  /* ═════ PC hover info card (same look as the homescreen preview) ═════ */
  var pop=document.createElement('div');pop.id='hsm-pop';document.body.appendChild(pop);
  var cur=null,showT=0,hideT=0,popM=null,popTy='';
  function hide(){clearTimeout(showT);clearTimeout(hideT);pop.classList.remove('on');cur=null;}
  function show(c){
    var m=c._m;if(!m||!canHover())return;
    cur=c;popM=m;popTy=c._ty;
    var tv=popTy==='tv',gs=String(m.genre||'').split(/[,|]/).map(function(x){return x.trim();}).filter(Boolean).slice(0,3),rt=parseFloat(m.rating),img=m.poster_url||'';
    var chips='<i>'+(tv?'TV SHOW':'MOVIE')+'</i>'+(m.year?'<i>'+esc(m.year)+'</i>':'')+(rt?'<i>\u2605 '+rt.toFixed(1)+'</i>':'')+gs.map(function(g){return '<i>'+esc(g)+'</i>';}).join('');
    var desc=(tv?'Stream ':'Watch ')+m.title+(m.year?' ('+m.year+')':'')+(gs.length?' \u2014 '+gs.join(', ').toLowerCase()+(tv?' series':' movie'):'')+(rt?'. Rated '+rt.toFixed(1)+'/10':'')+'. '+(tv?'Pick a season and episode to start.':'Free to stream in HD.');
    pop.innerHTML='<div class="hp-th" style="--pbg:url(&quot;'+esc(img)+'&quot;)">'+(img?'<img src="'+esc(img)+'" alt="">':'')+'</div><div class="pb"><div class="pt">'+esc(m.title)+'</div><div class="pm">'+chips+'</div><p class="pd">'+esc(desc)+'</p><span class="pw">\u25B6 '+(tv?'Watch Show':'Watch Movie')+'</span></div>';
    var W=Math.min(340,innerWidth-16);pop.style.width=W+'px';
    var r=c.getBoundingClientRect(),h=pop.offsetHeight,thH=W*9/16;
    var left=Math.max(72,Math.min(r.left+r.width/2-W/2,innerWidth-W-8)),top=Math.max(8,Math.min(r.top-(thH-r.height)/2,innerHeight-h-8));
    pop.style.left=left+'px';pop.style.top=top+'px';pop.classList.add('on');
  }
  document.addEventListener('mouseover',function(e){
    if(!canHover())return;
    var c=e.target.closest&&e.target.closest('.hsm-card');if(!c||!c._m)return;
    clearTimeout(hideT);if(c===cur)return;clearTimeout(showT);
    showT=setTimeout(function(){show(c);},280);
  });
  document.addEventListener('mouseout',function(e){
    var c=e.target.closest&&e.target.closest('.hsm-card');if(!c)return;
    var to=e.relatedTarget;if(to&&(c.contains(to)||pop.contains(to)))return;
    clearTimeout(showT);hideT=setTimeout(hide,120);
  });
  pop.addEventListener('mouseenter',function(){clearTimeout(hideT);});
  pop.addEventListener('mouseleave',function(){hideT=setTimeout(hide,120);});
  pop.addEventListener('click',function(){var m=popM,t=popTy;hide();if(m)play(m,t);});
  document.addEventListener('scroll',hide,{capture:true,passive:true});
  window.addEventListener('blur',hide);window.addEventListener('resize',hide);
})();

;

(function(){
  /* Recognised tournaments: any tile whose name contains the keyword gets the official logo as a banner + hover info.
     Order matters: ICC / IPL are tested before the generic "premier league" / "world cup" rules. */
  var T=[
    {k:'wcl',dark:1,re:/\bwcl\b|world championship of legends|world champion|legend/i,name:'World Championship of Legends',
     logo:'https://www.wclcricket.com/assets/wcl-bnw-season3-20260927.png',
     chips:['Cricket','Legends','T20'],
     desc:'The World Championship of Legends (WCL) is a T20 cricket tournament starring retired international greats. The first edition was played in England in 2024.'},
    {k:'icc',re:/\bicc\b|international cricket council|champions trophy|t20 world cup|cricket world cup|world test championship/i,name:'ICC',
     logo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3RBl2jouCdUHrLSHRm2lopxkCV4ZpMhGoAxdCVrLYQkBkYOWnNCkb50U&s=10',
     chips:['Cricket','Global'],
     desc:'The International Cricket Council is cricket\u2019s world governing body. It runs the men\u2019s and women\u2019s World Cups, the T20 World Cup, the Champions Trophy and the World Test Championship.'},
    {k:'ipl',re:/\bipl\b|indian premier league/i,name:'Indian Premier League',
     logo:'https://crystalpng.com/wp-content/uploads/2025/09/ipl-logo.png',
     chips:['Cricket','T20','India'],
     desc:'The Indian Premier League is a franchise T20 cricket league founded by the BCCI in 2008, played every spring across India.'},
    {k:'fifa',re:/\bfifa\b|(^|\s)world cup(?!.*(cricket|t20|odi))/i,name:'FIFA',
     logo:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/FIFA_logo_without_slogan.svg/1280px-FIFA_logo_without_slogan.svg.png',
     chips:['Football','Global'],
     desc:'FIFA is football\u2019s world governing body and organises the FIFA World Cup, held every four years. The 2026 edition is hosted by the USA, Canada and Mexico.'},
    {k:'epl',re:/^(english )?premier league|\bepl\b|english premier league/i,name:'Premier League',
     logo:'https://thumb.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1280px-Premier_League_Logo.svg.png',
     chips:['Football','England'],
     desc:'The Premier League is England\u2019s top football division, contested by 20 clubs from August to May.'},
    {k:'laliga',re:/la ?liga/i,name:'LaLiga',
     logo:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/1280px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png',
     chips:['Football','Spain'],
     desc:'LaLiga is Spain\u2019s top football division, with 20 clubs including Real Madrid, Barcelona and Atl\u00e9tico Madrid.'},
    {k:'isl',re:/\bisl\b|indian super league/i,name:'Indian Super League',
     logo:'https://images.seeklogo.com/logo-png/26/1/indian-super-league-logo-png_seeklogo-269160.png',
     chips:['Football','India'],
     desc:'The Indian Super League is the top tier of professional football in India, launched in 2014.'}
  ];
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function find(n){n=String(n||'');for(var i=0;i<T.length;i++)if(T[i].re.test(n))return T[i];return null;}
  window.evTournamentLogo=find;
  function deco(el){
    if(el._evt)return;el._evt=1;
    var t=find(el.getAttribute('data-t'));if(!t)return;
    el._tm=t;el.classList.add('evt');if(t.dark)el.classList.add('evt-dk');el.style.setProperty('--evl','url("'+t.logo+'")');
    var u=el.querySelector('u');if(!u)return;
    var im=new Image();im.className='evt-lg';im.alt=t.name;im.decoding='async';im.loading='lazy';
    im.onerror=function(){im.remove();u.style.display='';el.classList.remove('evt');};   /* logo blocked/dead -> original initials tile */
    im.src=t.logo;u.style.display='none';el.insertBefore(im,u);
  }
  function scan(r){
    if(r.matches&&r.matches('.sxs-tt'))deco(r);
    if(r.querySelectorAll)[].forEach.call(r.querySelectorAll('.sxs-tt[data-t]'),deco);
  }
  var q=[],raf=0;
  new MutationObserver(function(ms){
    for(var i=0;i<ms.length;i++)for(var j=0;j<ms[i].addedNodes.length;j++){var x=ms[i].addedNodes[j];if(x.nodeType===1)q.push(x);}
    if(!raf)raf=requestAnimationFrame(function(){raf=0;var a=q;q=[];a.forEach(scan);});
  }).observe(document.documentElement,{childList:true,subtree:true});
  scan(document.body);

  /* hover info (PC) */
  function canHover(){return matchMedia('(min-width:901px) and (hover:hover)').matches;}
  var pop=document.createElement('div');pop.id='evt-pop';document.body.appendChild(pop);
  var cur=null,showT=0,hideT=0;
  function hide(){clearTimeout(showT);clearTimeout(hideT);pop.classList.remove('on');cur=null;}
  function info(el){
    var name=el.getAttribute('data-t')||'',items=[];
    try{items=((window.__sxs&&__sxs.all())||[]).filter(function(i){return i.tour===name||i.game===name;});}catch(e){}
    var lv=0,up=0,sp=[];
    items.forEach(function(i){if(i.live)lv++;else if(!i.fin)up++;if(i.sport&&sp.indexOf(i.sport)<0)sp.push(i.sport);});
    return {n:items.length,lv:lv,up:up,sp:sp.slice(0,2)};
  }
  function show(el){
    if(!canHover())return;cur=el;
    var t=el._tm,name=el.getAttribute('data-t')||'',f=info(el),live=f.lv>0||!!el.querySelector('.sxs-tl');
    var chips=(live?'<i class="lv">LIVE NOW'+(f.lv>1?' \u00b7 '+f.lv:'')+'</i>':'')+
      (t?t.chips:f.sp).map(function(c){return '<i>'+esc(c)+'</i>';}).join('')+
      (f.n?'<i>'+f.n+' match'+(f.n>1?'es':'')+' today</i>':'');
    var desc=t?t.desc:(name+(f.sp.length?' \u2014 '+f.sp.join(' & ').toLowerCase():'')+'. '+(f.n?f.n+' match'+(f.n>1?'es':'')+' on today'+(f.lv?', '+f.lv+' live right now':(f.up?', '+f.up+' still to come':''))+'.':'No matches scheduled right now.')+' Pick it to see every fixture and stream.');
    var ue=el.querySelector('u'),ini=ue?ue.textContent:name.slice(0,2).toUpperCase();
    var head=t?'<div class="tb'+(t.dark?' dk':'')+'"><img src="'+esc(t.logo)+'" alt="" onerror="this.remove()"></div>':'<div class="tb gen"><b class="ini">'+esc(ini)+'</b></div>';
    if(t)pop.style.setProperty('--evl','url("'+t.logo+'")');
    pop.innerHTML=head+'<div class="pb"><div class="pt">'+esc(t?t.name:name)+'</div><div class="pm">'+chips+'</div><p class="pd">'+esc(desc)+'</p><span class="pw">\u25B6 View matches</span></div>';
    var W=Math.min(340,innerWidth-16);pop.style.width=W+'px';
    var r=el.getBoundingClientRect(),h=pop.offsetHeight,thH=W*9/16;
    var left=Math.max(72,Math.min(r.left+r.width/2-W/2,innerWidth-W-8)),top=Math.max(8,Math.min(r.top-(thH-r.height)/2,innerHeight-h-8));
    pop.style.left=left+'px';pop.style.top=top+'px';pop.classList.add('on');
  }
  document.addEventListener('mouseover',function(e){
    if(!canHover())return;var el=e.target.closest&&e.target.closest('.sxs-tt');if(!el)return;
    clearTimeout(hideT);if(el===cur)return;clearTimeout(showT);showT=setTimeout(function(){show(el);},280);
  });
  document.addEventListener('mouseout',function(e){
    var el=e.target.closest&&e.target.closest('.sxs-tt');if(!el)return;
    var to=e.relatedTarget;if(to&&(el.contains(to)||pop.contains(to)))return;
    clearTimeout(showT);hideT=setTimeout(hide,120);
  });
  pop.addEventListener('mouseenter',function(){clearTimeout(hideT);});
  pop.addEventListener('mouseleave',function(){hideT=setTimeout(hide,120);});
  pop.addEventListener('click',function(){var el=cur;hide();if(el)el.click();});
  document.addEventListener('scroll',hide,{capture:true,passive:true});
  window.addEventListener('blur',hide);window.addEventListener('resize',hide);
})();

;

/* show a brief skeleton while the server list loads, then render it */
(function(){
  var t=setInterval(function(){
    if(typeof window.spToggleServers!=='function'||typeof window.spServersRender!=='function')return;
    clearInterval(t);
    var orig=window.spToggleServers;
    window.spToggleServers=function(e){
      var ov=document.getElementById('stream-player-overlay'),opening=ov&&!ov.classList.contains('sv-open');
      orig.apply(this,arguments);
      if(!opening)return;
      var m=document.getElementById('sp-servers-menu');if(!m)return;
      m.innerHTML='<div class="sp-sv-loading"><i></i><i></i><i></i></div>';
      setTimeout(function(){try{if(ov.classList.contains('sv-open'))window.spServersRender();}catch(_){}},650);
    };
  },300);
})();

;

/* Global search covers the whole movie/TV library: keep it loading and refresh results as it grows */
(function(){
  var last=0;
  setInterval(function(){
    try{
      var ov=document.getElementById('sx-search-overlay');if(!ov||!ov.classList.contains('open'))return;
      var inp=document.getElementById('sx-search-input');if(!inp||!inp.value.trim())return;
      var n=(vaPools.movie.all.length)+(vaPools.tv.all.length);
      if(n===last)return;last=n;
      if(document.activeElement===inp&&Date.now()-(window.__sxTypedAt||0)<600)return;
      sxRunSearch(inp.value);
    }catch(e){}
  },1500);
  var o=window.openSxSearch;
  if(typeof o==='function')window.openSxSearch=function(){try{vaBulkPreload('movie');vaBulkPreload('tv');}catch(e){}return o.apply(this,arguments);};
  /* opening search is light; typing a real query pulls the full catalogue once so results are complete */
  var _st=window.sxSearchTyped;
  if(typeof _st==='function')window.sxSearchTyped=function(v){try{if(String(v||'').trim().length>=2&&window.hsmLoadAll){hsmLoadAll('movie');hsmLoadAll('tv');}}catch(e){}return _st.apply(this,arguments);};
  document.addEventListener('input',function(e){if(e.target&&e.target.id==='sx-search-input')window.__sxTypedAt=Date.now();},true);
})();

;

/* Instagram: new tab on desktop; Instagram app on phones (Android intent, iOS universal link) */
window.evOpenIG=function(){
  var user='saaptaarshii',web='https://www.instagram.com/'+user,ua=navigator.userAgent||'';
  /* the site's in-page link viewer and popup blocker would swallow this link, so use a real anchor marked data-evlp-skip */
  function tab(){
    var a=document.createElement('a');a.href=web;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('data-evlp-skip','1');
    a.style.display='none';document.body.appendChild(a);a.click();a.remove();
  }
  try{
    if(/Android/i.test(ua)){
      location.href='intent://instagram.com/_u/'+user+'/#Intent;package=com.instagram.android;scheme=https;S.browser_fallback_url='+encodeURIComponent(web)+';end';
      return;
    }
  }catch(e){}
  tab();   /* desktop: new tab; iPhone/iPad: universal link opens the Instagram app */
};

;

/* PC: place the Servers / More panels directly under their buttons */
(function(){
  function put(ov,btn,w,xv,yv){
    if(!btn)return; var r=btn.getBoundingClientRect(); if(!r.width&&!r.height)return;
    ov.style.setProperty(xv,Math.max(8,Math.min(r.left,window.innerWidth-w-16))+'px');
    ov.style.setProperty(yv,(r.bottom+8)+'px');
  }
  function place(){
    var ov=document.getElementById('stream-player-overlay'); if(!ov||window.innerWidth<901)return;
    put(ov,document.getElementById('sp-servers-btn'),250,'--ev-sx','--ev-sy');
    put(ov,document.getElementById('sp-info-rail'),320,'--ev-rx','--ev-ry');
  }
  function init(){
    var ov=document.getElementById('stream-player-overlay'); if(!ov)return setTimeout(init,300);
    new MutationObserver(function(){place();}).observe(ov,{attributes:true,attributeFilter:['class']});
    window.addEventListener('resize',place);
    ov.addEventListener('click',function(e){ if(e.target.closest&&e.target.closest('#sp-servers-btn,#sp-info-rail')) place(); },true);
    place();
  }
  init();
})();

;

(function(){
  'use strict';
  var RAILS='.sxs-track,.hsm-track,.mws-more-row,.fixtures-grid,#ev-pop-slider .evp-track';
  var pos={}, touching=false, lastScroll=0, timers=new WeakMap();

  function railOf(t){ return (t && t.closest) ? t.closest(RAILS) : null; }
  function keyOf(tr){
    var s=tr.closest('section'), h=s&&s.querySelector('.sxs-t'); if(!h) return null;
    var t=((h.firstChild&&h.firstChild.nodeValue)||h.textContent||'').trim().toLowerCase().replace(/^top 10 /,'');
    return t||null;
  }
  function busy(){ return touching || (Date.now()-lastScroll) < 220; }

  /* 1. remember each home rail's position + mark rails as "moving" while they scroll */
  document.addEventListener('scroll',function(e){
    var t=e.target; if(!t||t===document||!t.matches||!t.matches(RAILS)) return;
    lastScroll=Date.now();
    t.classList.add('sx-scrolling');
    clearTimeout(timers.get(t));
    timers.set(t,setTimeout(function(){ t.classList.remove('sx-scrolling'); },140));
    var hr=document.getElementById('sxs-home');
    if(hr&&hr.contains(t)){ var k=keyOf(t); if(k) pos[k]=t.scrollLeft; }
  },{capture:true,passive:true});
  document.addEventListener('touchstart',function(e){ if(railOf(e.target)) touching=true; },{capture:true,passive:true});
  ['touchend','touchcancel'].forEach(function(n){
    document.addEventListener(n,function(){ touching=false; lastScroll=Date.now(); },{capture:true,passive:true});
  });

  /* 2. images in a rail load just before the rail comes into view, so cards never pop in mid-swipe */
  var io=window.IntersectionObserver?new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var t=e.target; io.unobserve(t);
      t.querySelectorAll('img[loading="lazy"]').forEach(function(i){ i.loading='eager'; });
      var hr=document.getElementById('sxs-home');
      if(hr&&hr.contains(t)){ var k=keyOf(t); if(k&&pos[k]>0&&Math.abs(t.scrollLeft-pos[k])>2) t.scrollLeft=pos[k]; }
    });
  },{rootMargin:'300px 0px'}):null;
  function watchAll(){
    if(!io) return;
    document.querySelectorAll('.sxs-track,.hsm-track,.mws-more-row,#ev-pop-slider .evp-track').forEach(function(t){
      if(t.__sxw) return; t.__sxw=1; io.observe(t);
    });
  }
  setInterval(watchAll,2500); watchAll();

  /* 3. the home rows are rebuilt (innerHTML) whenever data loads — that reset every rail to card 1 mid-swipe.
        Now: keep the swipe position across rebuilds, and hold a rebuild until the finger is up and the rail has stopped. */
  function restore(hr){
    hr.querySelectorAll('.sxs-track').forEach(function(t){
      var k=keyOf(t); if(k&&pos[k]>0) t.scrollLeft=pos[k];
    });
  }
  function hook(hr){
    if(hr.__sxHooked) return;
    var d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML'); if(!d||!d.set) return;
    hr.__sxHooked=true;
    var pending=null, timer=0;
    function apply(html,full){
      d.set.call(hr,html);
      restore(hr);
      watchAll();
      if(!full) return;
      try{   /* the page's own post-render steps ran against the old DOM while we waited — redo them */
        hr.querySelectorAll('.sxs-wrap').forEach(function(w){ var t=w.querySelector('.sxs-th'); if(t) w.style.setProperty('--sxs-h',t.offsetHeight+'px'); });
        if(window.__sxs&&window.__sxs.fit) requestAnimationFrame(function(){ window.__sxs.fit(hr); });
        var mo=hr.querySelector('#hs-more'); if(mo&&window.__hsIO){ window.__hsIO.disconnect(); window.__hsIO.observe(mo); }
      }catch(_){}
    }
    function flush(){
      if(busy()) return;
      clearInterval(timer); timer=0;
      if(pending!=null){ var h=pending; pending=null; apply(h,true); }
    }
    Object.defineProperty(hr,'innerHTML',{
      configurable:true,
      get:function(){ return d.get.call(this); },
      set:function(html){
        if(busy()){ pending=html; if(!timer) timer=setInterval(flush,160); return; }
        pending=null; apply(html,false);
      }
    });
  }
  var tries=0, iv=setInterval(function(){
    var hr=document.getElementById('sxs-home');
    if(hr){ hook(hr); clearInterval(iv); } else if(++tries>80) clearInterval(iv);
  },250);
})();

;

/* keep the theme last in cascade even when the app injects its own <style> blocks later */
(function(){
  function last(){['wt-css','wtd-css'].forEach(function(id){var s=document.getElementById(id);if(s&&s.nextElementSibling)document.body.appendChild(s);});}
  window.addEventListener('load',function(){last();setTimeout(last,2500);setTimeout(last,8000);});
  try{new MutationObserver(function(m){for(var i=0;i<m.length;i++)for(var j=0;j<m[i].addedNodes.length;j++){var n=m[i].addedNodes[j];if(n.tagName==='STYLE'&&n.id!=='wt-css'&&n.id!=='wtd-css'){clearTimeout(last._t);last._t=setTimeout(last,300);return;}}}).observe(document.head,{childList:true});}catch(e){}
})();

;

(function(){
  var F=[["56+ OTT Platforms Combined","A unified entertainment hub bringing multiple streaming services and content sources together."],["Live Cricket","International matches, T20 leagues, ODIs, Test cricket, domestic tournaments and live score updates."],["Live Football","International football, club competitions, domestic leagues, cups and major tournaments."],["All Other Live Sports","Basketball, tennis, badminton, hockey, volleyball, kabaddi, motorsports, athletics, wrestling, boxing, golf, esports and more."],["Live TV Channels","Sports, entertainment, movies, music, news, kids, lifestyle and regional television."],["Movies Library","Bollywood, Hollywood, regional cinema, Bengali movies, South Indian films, dubbed movies and international cinema."],["TV Shows & Series","Popular television shows, web series, dramas, reality shows, comedy series and exclusive productions."],["Short Films","Independent cinema, short movies, student films, regional short films and original creations."],["Web Series & Originals","Action, thriller, romance, comedy, crime, sci-fi, documentaries and more."],["Regional Entertainment","Bengali, Hindi, Tamil, Telugu, Malayalam, Kannada, Marathi, Punjabi and other language content."],["Kids & Family Entertainment","Cartoons, animated movies, educational programmes and family-friendly shows."],["News & Information","National and international news, business, technology, sports updates and current affairs."],["Music & Concerts","Music videos, live concerts, performances, interviews and entertainment specials."],["On-Demand Streaming","Watch available movies and shows whenever you want."],["Unified Search","Find available movies, TV shows, channels, sports events and other content from one search interface."],["Smart Categories","Explore content through sports, movies, series, live TV, short films, languages and genres."],["Live Match Centre","Match schedules, fixtures, live scores, results and upcoming-event information."],["Watchlist & Favourites","Save content for easy access, where supported."],["Continue Watching","Resume supported content from where you left off."],["Personalised Discovery","Discover recommendations based on your preferences, where supported."],["Multi-Device Experience","Access the platform on supported mobile devices, tablets, desktops and compatible Android applications."],["Up to 4K Ultra HD Streaming","Enjoy supported content in SD, HD, Full HD (1080p) and up to 4K Ultra HD (2160p), depending on stream availability, internet speed, device capabilities and provider restrictions."],["Modern Streaming Player","Playback controls, fullscreen, quality selection, subtitles and audio-track selection where supported."],["HLS & MPEG-DASH Support","Playback of compatible HLS and MPEG-DASH streams, subject to codec, DRM and platform restrictions."],["Adaptive Streaming","Automatically adjust playback quality when supported by the stream and player."],["Low-Data Experience","Lightweight interface, lazy-loaded content, efficient caching and responsive layouts for mobile networks."],["Fast Navigation","Simple menus, organised content sections and quick access to live events."],["Regular Content Updates","Keep listings, schedules and catalogues updated through authorised data sources."],["Regional Language Support","Discover content by language, region and available subtitle options."],["Premium-Style Interface","A clean, modern OTT experience with attractive content cards, banners and dedicated player screens."],["One Unified Entertainment Destination","Sports, movies, television, web series, short films and more in one organised platform."]];
  var $=function(id){return document.getElementById(id)}, o=$('evdl'); if(!o)return;
  var fe=$('evdl-feats'),h='';F.forEach(function(f,i){var n=i+1;h+='<div><h4><i>'+(n<10?'0'+n:n)+'</i>'+f[0].replace(/&/g,'&amp;')+'</h4><p>'+f[1].replace(/&/g,'&amp;')+'</p></div>'});fe.innerHTML=h;
  $('evdl-yr').textContent=new Date().getFullYear();
  /* device detect */
  var ua=navigator.userAgent,d=$('evdl-det');
  if(/Android/i.test(ua)){$('evdl-android').classList.add('rec');d.innerHTML='Detected: <b>Android</b>'}
  else if(/Windows NT (4|5|6\.[123])|Windows (95|98)/i.test(ua)){var m=ua.match(/Windows NT ([\d.]+)/),n={'6.1':'7','6.2':'8','6.3':'8.1'}[m&&m[1]]||(m&&m[1].charAt(0)==='5'?'XP':'98');$('evdl-old').classList.add('rec');d.innerHTML='Detected: <b>Windows '+n+'</b>'}
  else if(/Windows/i.test(ua)){$('evdl-win11').classList.add('rec');d.innerHTML='Detected: <b>Windows 10 / 11</b>'}
  else if(/iPhone|iPad|Mac/i.test(ua)){var os=/iPhone/i.test(ua)?'iOS':/iPad/i.test(ua)?'iPadOS':'macOS';d.innerHTML='Detected: <b>'+os+'</b>. The Apple app is in progress. Use the browser version.'}
  var prevFocus=null;
  function open(e){if(e&&e.preventDefault)e.preventDefault();prevFocus=document.activeElement;o.scrollTop=0;o.classList.add('open');o.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';try{if(location.hash!=='#download')history.pushState(null,'','#download')}catch(x){}setTimeout(function(){$('evdl-x').focus({preventScroll:true})},50)}
  function close(e){if(e&&e.preventDefault)e.preventDefault();if(!o.classList.contains('open'))return;o.classList.remove('open');o.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';try{if(location.hash==='#download')history.replaceState(null,'',location.pathname+location.search)}catch(x){}try{prevFocus&&prevFocus.focus&&prevFocus.focus({preventScroll:true})}catch(x){}}
  window.openDownload=open;window.closeDownload=close;
  $('evdl-x').addEventListener('click',close);
  $('evdl-web').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  window.addEventListener('hashchange',function(){if(location.hash==='#download')open();else if(o.classList.contains('open'))close()});
  if(location.hash==='#download')window.addEventListener('load',function(){open()});
  /* entry points: desktop nav, drawer, left rail */
  var ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16"/></svg>';
  function mk(host,cls,html){if(!host||host.querySelector('.evdl-lnk'))return;var a=document.createElement('a');a.href='#download';a.className='evdl-lnk '+cls;a.innerHTML=html;a.addEventListener('click',function(e){var dr=window.closeDrawer;if(cls==='dr'&&dr)try{dr()}catch(x){}open(e)});host.appendChild(a)}
  function inject(){
    mk($('nav-desktop'),'dk','Download');
    mk($('drawer-nav'),'dr','Download App');
    var r=$('hs-rail');if(r&&!r.querySelector('.evdl-lnk')){var inn=r.querySelector('.in'),a=document.createElement('a');a.className='evdl-lnk rl';a.title='Download app';a.innerHTML=ICON+'<span>Download app</span>';a.addEventListener('click',open);var seps=inn.querySelectorAll('.sep'),sp=seps[seps.length-1];if(sp)inn.insertBefore(a,sp);else inn.appendChild(a)}
  }
  inject();
  try{var mo=new MutationObserver(function(){clearTimeout(inject._t);inject._t=setTimeout(inject,60)});mo.observe(document.body,{childList:true,subtree:false});['nav-desktop','drawer-nav'].forEach(function(id){var el=$(id);el&&mo.observe(el,{childList:true})})}catch(x){}
  window.addEventListener('load',function(){inject();setTimeout(inject,1500);setTimeout(inject,5000)});
})();

;

/* smooth image fade-in */
(function(){function ok(i){i.classList.add('loaded')}
function bind(i){if(i.complete&&i.naturalWidth)ok(i);else{i.addEventListener('load',function(){ok(i)},{once:true});i.addEventListener('error',function(){ok(i)},{once:true})}}
function scan(r){(r.querySelectorAll?r.querySelectorAll('img[loading=lazy]:not(.loaded)'):[]).forEach(bind)}
document.addEventListener('DOMContentLoaded',function(){scan(document);try{new MutationObserver(function(m){m.forEach(function(x){x.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches&&n.matches('img[loading=lazy]'))bind(n);else scan(n)}})})}).observe(document.body,{childList:true,subtree:true})}catch(e){}});})();

;

/* WHITE TIGRESS — runtime layer: drifting stripes, ice-eye light, one soft reveal, contrast mapper */
(function(){
  'use strict';
  if(window.__wt) return; window.__wt=1;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var coarse=matchMedia('(pointer:coarse)').matches;

  /* 1 ── stripes + eye ─────────────────────────────── */
  function atmos(){
    var s=document.createElement('div'); s.id='wt-stripes';
    s.innerHTML='<i class="a"></i><i class="b"></i><i class="c"></i>';
    var e=document.createElement('div'); e.id='wt-eye';
    document.body.prepend(s); document.body.prepend(e);
    if(reduce) return;
    var ia=s.children, y=0, tx=0, ty=0, ex=0, ey=0, raf=0;
    function tick(){
      raf=0;
      ex+=(tx-ex)*.08; ey+=(ty-ey)*.08;
      e.style.transform='translate3d('+ex.toFixed(1)+'px,'+ey.toFixed(1)+'px,0)';
      var f=[.06,-.04,.09];
      for(var i=0;i<3;i++){
        var base=i==1?'':'scaleX(-1) ';
        var k=i==2?' scale(.8)':'';
        ia[i].style.transform=base+'translate3d(0,'+(-y*f[i]).toFixed(1)+'px,0)'+k;
      }
      if(Math.abs(tx-ex)>.5||Math.abs(ty-ey)>.5) raf=requestAnimationFrame(tick);
    }
    function kick(){ if(!raf) raf=requestAnimationFrame(tick); }
    addEventListener('scroll',function(){ y=scrollY; kick(); },{passive:true});
    if(!coarse){
      addEventListener('pointermove',function(ev){ tx=ev.clientX; ty=ev.clientY; e.classList.add('on'); kick(); },{passive:true});
      document.addEventListener('pointerleave',function(){ e.classList.remove('on'); });
    }
  }

  /* 2 ── single soft reveal for sections ───────────── */
  function reveal(){
    if(reduce||!('IntersectionObserver' in window)) return;
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('wt-in'); io.unobserve(en.target); } });
    },{rootMargin:'0px 0px -8% 0px',threshold:.05});
    var seen=new WeakSet();
    function scan(){
      document.querySelectorAll('section.section,.hero-cards-section').forEach(function(el){
        if(seen.has(el)) return; seen.add(el);
        var r=el.getBoundingClientRect();
        if(r.top<innerHeight*.9) return;          /* already on screen: leave alone */
        el.classList.add('wt-rv'); io.observe(el);
      });
    }
    scan(); setTimeout(scan,1500);
    setTimeout(function(){ document.querySelectorAll('.wt-rv:not(.wt-in)').forEach(function(el){
      var r=el.getBoundingClientRect(); if(r.height===0) el.classList.add('wt-in'); }); },4000);
  }

  /* 3 ── contrast mapper: dark legacy surfaces → pelt ── */
  var RGB=/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\s*\)/;
  function parse(c){
    var m=RGB.exec(c); if(!m) return null;
    var a=m[4]===undefined?1:(m[4].slice(-1)=='%'?parseFloat(m[4])/100:parseFloat(m[4]));
    return {r:+m[1],g:+m[2],b:+m[3],a:a};
  }
  function lum(c){ return (0.2126*c.r+0.7152*c.g+0.0722*c.b)/255; }
  function sat(c){ var mx=Math.max(c.r,c.g,c.b),mn=Math.min(c.r,c.g,c.b); return mx? (mx-mn)/mx : 0; }
  var SKIP='VIDEO,IMG,CANVAS,IFRAME,SVG,PATH,SCRIPT,STYLE,NOSCRIPT,LINK,META,HEAD,PICTURE,SOURCE,USE';
  function hasPic(cs){ return /url\(/.test(cs.backgroundImage); }
  function lightGradient(el,cs){
    var b=cs.backgroundImage, n=0, dark=0, m, re=/rgba?\([^)]*\)/g;
    while((m=re.exec(b))){ var c=parse(m[0]); if(c&&c.a>.3){ n++; if(lum(c)<.4&&sat(c)<.45) dark++; } }
    return n&&dark===n;
  }
  function clearEl(el){
    if(el.dataset.wtbg){ el.style.removeProperty('background-color'); el.style.removeProperty('background-image'); delete el.dataset.wtbg; }
    if(el.dataset.wtfg){ el.style.removeProperty('color'); el.style.removeProperty('-webkit-text-fill-color'); delete el.dataset.wtfg; }
  }
  function ancestorsBusy(el){
    var p=el.parentElement, i=0;
    while(p&&i<6){
      if(p.dataset&&p.dataset.wtkeep!==undefined) return true;
      if(!p.dataset.wtbg){
        var pc=getComputedStyle(p);
        if(hasPic(pc)||/gradient/.test(pc.backgroundImage)) return true;
      }
      p=p.parentElement; i++;
    }
    return false;
  }
  function fix(el){
    if(document.documentElement.getAttribute('data-theme')==='dark')return;
    if(el.nodeType!==1||SKIP.indexOf(el.tagName.toUpperCase())>-1||el.closest('svg')) return;
    if(el.id==='wt-stripes'||el.id==='wt-eye') return;
    if(el.closest('#hs-hero,#sxs-pop,#hsm-pop,#evt-pop,#va-tv-modal,#hs-rail,#sxv,.fcx-carousel-slide,#dmca-modal,.footer-vip,.sxs-time,.sxs-end,.sxs-live,.sxs-tl,.hsm-vg')) return;
    var cn=typeof el.className==='string'?el.className:'';
    if(/(^|[\s_-])(bg|bgi|th|thumb|poster|img|image|cover|banner|slide|backdrop|art)([\s_-]|$)/i.test(cn)) return;
    if(el.style&&el.style.backgroundImage&&!el.dataset.wtbg) return;
    var cs=getComputedStyle(el);
    if(cs.getPropertyValue('--wt-dark').trim()==='1'||el.closest('#stream-player-overlay,[data-wtkeep]')) return;
    var ownDark=false, ownSolid=false;
    var bg=parse(cs.backgroundColor);
    if(bg&&bg.a>.35){
      var l=lum(bg), s=sat(bg);
      if(s<.5&&l<.42){
        var tgt=l<.2?'255,255,255':'238,241,246';
        el.style.setProperty('background-color','rgba('+tgt+','+Math.min(1,bg.a+.1).toFixed(2)+')','important');
        el.dataset.wtbg=1;
      } else ownSolid=(s>=.5)||l<.42;
    }
    if(!el.dataset.wtbg && cs.backgroundImage!=='none' && !hasPic(cs) && /gradient/.test(cs.backgroundImage)){
      if(lightGradient(el,cs)){
        el.style.setProperty('background-image','none','important');
        el.style.setProperty('background-color','#EEF1F6','important');
        el.dataset.wtbg=1;
      }
    }
    /* text */
    var col=parse(cs.color);
    if(col&&col.a>.2&&lum(col)>.66&&sat(col)<.3&&!ownSolid&&!(el.dataset.wtbg===undefined&&hasPic(cs))){
      if(el.dataset.wtbg||!ancestorsBusy(el)){
        el.style.setProperty('color',col.a<.8?'rgba(20,22,27,.62)':'#14161B','important');
        el.style.setProperty('-webkit-text-fill-color','currentColor','important');
        el.dataset.wtfg=1;
      }
    }
    /* borders that were white-on-black hairlines */
    var bc=parse(cs.borderTopColor);
    if(bc&&bc.a>0&&bc.a<.35&&lum(bc)>.8&&parseFloat(cs.borderTopWidth)>0){
      el.style.setProperty('border-color','rgba(20,22,27,.08)','important');
    }
  }

  var queue=[], busy=false;
  function pump(){
    busy=true;
    var t=performance.now();
    while(queue.length&&performance.now()-t<9){ fix(queue.shift()); }
    if(queue.length) requestAnimationFrame(pump); else busy=false;
  }
  function enqueue(root){
    if(root.nodeType!==1) return;
    queue.push(root);
    var w=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT), n;
    while((n=w.nextNode())) queue.push(n);
    if(!busy) requestAnimationFrame(pump);
  }
  var pending=new Set(), timer=0;
  function flush(){
    timer=0; var items=Array.from(pending); pending.clear();
    items.forEach(function(n){ if(n.isConnected) enqueue(n); });
  }
  function observe(){
    new MutationObserver(function(ms){
      ms.forEach(function(m){
        if(m.type==='childList'){ m.addedNodes.forEach(function(n){ if(n.nodeType===1&&n.id!=='wt-stripes'&&n.id!=='wt-eye') pending.add(n); }); }
        else if(m.type==='attributes'&&m.target.nodeType===1){
          clearEl(m.target); pending.add(m.target);       /* class flip: re-map just this node */
        }
      });
      if(!timer) timer=setTimeout(flush,120);
    }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }

  window.__wtSweep1=function(){ enqueue(document.body); };
  function start(){
    atmos(); reveal();
    enqueue(document.body); observe();
    setTimeout(function(){ enqueue(document.body); },2500);   /* catch late-built UI */
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();


;

/* contrast sweep: pale greys → readable greys, white-on-white → ink (skips photos, hero, player, dark buttons) */
(function(){
  var RGB=/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\s*\)/;
  function P(c){var m=RGB.exec(c);if(!m)return null;var a=m[4]===undefined?1:(m[4].slice(-1)=='%'?parseFloat(m[4])/100:parseFloat(m[4]));return{r:+m[1],g:+m[2],b:+m[3],a:a};}
  function L(c){return(.2126*c.r+.7152*c.g+.0722*c.b)/255;}
  function S(c){var x=Math.max(c.r,c.g,c.b),n=Math.min(c.r,c.g,c.b);return x?(x-n)/x:0;}
  var SKIP={SCRIPT:1,STYLE:1,IMG:1,VIDEO:1,CANVAS:1,IFRAME:1,SVG:1,PATH:1,INPUT:1};
  function bgOf(el){ /* effective background luminance, or -1 when over a picture/gradient/unknown */
    var p=el,i=0;
    while(p&&i<14){
      if(p.closest&&0){}
      var cs=getComputedStyle(p);
      if(p.id==='hs-hero'||p.id==='stream-player-overlay'||(p.dataset&&p.dataset.wtkeep!==undefined)) return -1;
      if(cs.backgroundImage!=='none') return -1;
      var b=P(cs.backgroundColor);
      if(b&&b.a>.6) return L(b);
      p=p.parentElement;i++;
    }
    return L({r:244,g:246,b:249});
  }
  function fix(el){
    if(document.documentElement.getAttribute('data-theme')==='dark')return;
    if(el.nodeType!==1||SKIP[el.tagName.toUpperCase()]||el.closest('svg,#hs-hero,#stream-player-overlay,[data-wtkeep],#wt-stripes,#sxs-pop,#hsm-pop,#evt-pop,#va-tv-modal,#hs-rail,#sxv,.fcx-carousel-slide,#dmca-modal,.footer-vip,.sxs-time,.sxs-end,.sxs-live,.sxs-tl,.hsm-vg')) return;
    var has=false,n=el.firstChild;while(n){if(n.nodeType===3&&n.nodeValue.trim()){has=true;break;}n=n.nextSibling;}
    if(!has) return;
    var cs=getComputedStyle(el),c=P(cs.color);if(!c||c.a<.15) return;
    var l=L(c),s=S(c);
    if(s>.35) return;                                   /* coloured text (accent links) stays */
    if(l<.42) return;                                   /* already dark enough */
    var bl=bgOf(el);if(bl<.7) return;                   /* only on light surfaces */
    if(l>.85&&c.a>=.8) el.style.setProperty('color','#14161B','important');                 /* white → black */
    else el.style.setProperty('color',l>.7?'#4a505e':'#555b69','important');                  /* pale grey → readable grey */
    el.style.setProperty('-webkit-text-fill-color','currentColor','important');
    el.dataset.wtc2=1;
  }
  function sweep(root){
    if(root.nodeType!==1) return; fix(root);
    var w=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT),n,k=0,q=[];
    while((n=w.nextNode())&&k<4000){q.push(n);k++;}
    (function run(i){var t=performance.now();while(i<q.length&&performance.now()-t<8){fix(q[i++]);} if(i<q.length) requestAnimationFrame(function(){run(i);});})(0);
  }
  var pend=new Set(),tm=0;
  function flush(){tm=0;var a=Array.from(pend);pend.clear();a.forEach(function(n){if(n.isConnected) sweep(n);});}
  window.__wtSweep2=function(){ sweep(document.body); };
  function go(){
    sweep(document.body);
    setTimeout(function(){sweep(document.body);},3000);
    new MutationObserver(function(ms){
      ms.forEach(function(m){
        if(m.type==='childList') m.addedNodes.forEach(function(n){if(n.nodeType===1) pend.add(n);});
        else if(m.target.nodeType===1&&m.target.dataset&&m.target.dataset.wtc2){m.target.style.removeProperty('color');delete m.target.dataset.wtc2;pend.add(m.target);}
      });
      if(!tm) tm=setTimeout(flush,150);
    }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
})();

;

/* contrast guard: any text sitting on a plain light surface must be black (or a dark shade of it);
   plain dark surface -> white. Looks at real computed colours (incl. -webkit-text-fill-color), skips photos / gradients / player. */
(function(){
  var RGB=/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\s*\)/;
  function P(c){var m=RGB.exec(c||'');if(!m)return null;var a=m[4]===undefined?1:(m[4].slice(-1)=='%'?parseFloat(m[4])/100:parseFloat(m[4]));return{r:+m[1],g:+m[2],b:+m[3],a:a};}
  function lin(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);}
  function L(c){return .2126*lin(c.r)+.7152*lin(c.g)+.0722*lin(c.b);}
  function S(c){var x=Math.max(c.r,c.g,c.b),n=Math.min(c.r,c.g,c.b);return x?(x-n)/x:0;}
  function over(f,b){return{r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a),a:1};}
  function CR(a,b){var x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  var SKIP={SCRIPT:1,STYLE:1,IMG:1,VIDEO:1,CANVAS:1,IFRAME:1,SVG:1,PATH:1,INPUT:1,TEXTAREA:1,SELECT:1,OPTION:1,NOSCRIPT:1};
  var picKids=new WeakMap();
  function hasPicChild(p){            /* a photo / video / bg-image sibling sits behind the text -> background unknown */
    if(picKids.has(p)) return picKids.get(p);
    var r=false,k=p.children;
    for(var i=0;i<k.length&&i<24;i++){
      var t=k[i].tagName; if(t==='IMG'||t==='VIDEO'||t==='PICTURE'||t==='CANVAS'){r=true;break;}
      if(k[i].children.length===0&&!k[i].textContent.trim()){var cs=getComputedStyle(k[i]); if(/url\(/.test(cs.backgroundImage)){r=true;break;}}
    }
    picKids.set(p,r); return r;
  }
  function backdrop(el){
    var layers=[],p=el,i=0;
    while(p&&p.nodeType===1&&i<30){
      var cs=getComputedStyle(p);
      if(/url\(|gradient/.test(cs.backgroundImage)) return null;
      if(i<8&&p.parentElement&&hasPicChild(p.parentElement)&&p.parentElement!==document.body&&getComputedStyle(p.parentElement).backgroundColor==='rgba(0, 0, 0, 0)') return null;
      var b=P(cs.backgroundColor);
      if(b&&b.a>0){layers.push(b); if(b.a>=.98) break;}
      p=p.parentElement; i++;
    }
    var base=document.documentElement.getAttribute('data-theme')==='dark'?{r:10,g:11,b:15,a:1}:{r:244,g:246,b:249,a:1};
    for(var k=layers.length-1;k>=0;k--) base=over(layers[k],base);
    return base;
  }
  function paint(el,css){
    el.style.setProperty('color',css,'important'); el.style.setProperty('-webkit-text-fill-color',css,'important'); el.dataset.wtc3=1;
  }
  function fix(el){
    if(document.documentElement.getAttribute('data-theme')==='dark') return; /* dark theme: nothing to fix (measured 0 repaints) — skip the costly style scan */
    if(el.nodeType!==1||SKIP[el.tagName.toUpperCase()]||el.closest('svg,#stream-player-overlay,[data-wtkeep],#wt-stripes,#wt-eye,video,#sxs-pop,#hsm-pop,#evt-pop,#va-tv-modal,#hs-rail,#sxv,.fcx-carousel-slide,#dmca-modal,.footer-vip,.sxs-time,.sxs-end,.sxs-live,.sxs-tl,.hsm-vg')) return;
    var has=false,n=el.firstChild;while(n){if(n.nodeType===3&&n.nodeValue.trim()){has=true;break;}n=n.nextSibling;}
    if(!has) return;
    if(!el.offsetWidth&&!el.offsetHeight) return;
    var cs=getComputedStyle(el);
    if(cs.visibility==='hidden'||parseFloat(cs.opacity)<.05) return;
    if(/text/.test(cs.webkitBackgroundClip||cs.backgroundClip||'')) return;       /* gradient-clipped text */
    var c=P(cs.color), f=P(cs.webkitTextFillColor);
    if(f&&f.a>0&&(cs.webkitTextFillColor!==cs.color)) c=f;
    if(!c||c.a<.08) return;
    var B=backdrop(el); if(!B) return;
    var bl=L(B), eff=over(c,B), req=(parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.6&&parseInt(cs.fontWeight,10)>=700))?3:4.5;
    if(CR(eff,B)>=req) return;
    var neutral=S(c)<.35;
    if(bl>.4){                                              /* light surface -> black / dark shade */
      if(neutral){ paint(el,'#14161B'); return; }
      var r=c.r,g=c.g,b=c.b,t=0; do{ r*=.86;g*=.86;b*=.86;t++; }while(t<16&&CR(over({r:r,g:g,b:b,a:1},B),B)<req);
      paint(el,'rgb('+(r|0)+','+(g|0)+','+(b|0)+')');
    } else if(bl<.18){                                      /* dark surface -> white */
      if(neutral){ paint(el,'#ffffff'); return; }
      var r2=c.r,g2=c.g,b2=c.b,t2=0; do{ r2+=(255-r2)*.2;g2+=(255-g2)*.2;b2+=(255-b2)*.2;t2++; }while(t2<16&&CR(over({r:r2,g:g2,b:b2,a:1},B),B)<req);
      paint(el,'rgb('+(r2|0)+','+(g2|0)+','+(b2|0)+')');
    }
  }
  function clear(el){ if(el.dataset&&el.dataset.wtc3){ el.style.removeProperty('color'); el.style.removeProperty('-webkit-text-fill-color'); delete el.dataset.wtc3; } }
  var q=[],run=false;
  function pump(){ run=true; var t=performance.now(); while(q.length&&performance.now()-t<8){ try{fix(q.shift());}catch(e){} } if(q.length) requestAnimationFrame(pump); else run=false; }
  function enqueue(root){
    if(root.nodeType!==1) return; q.push(root);
    var w=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT),n,k=0; while((n=w.nextNode())&&k<6000){q.push(n);k++;}
    if(!run) requestAnimationFrame(pump);
  }
  var pend=new Set(),tm=0;
  function flush(){ tm=0; var a=Array.from(pend); pend.clear(); a.forEach(function(n){ if(n.isConnected) enqueue(n); }); }
  window.__wtSweep3=function(){ enqueue(document.body); };
  function go(){
    enqueue(document.body);
    [1500,4000,9000].forEach(function(ms){ setTimeout(function(){ enqueue(document.body); },ms); });
    new MutationObserver(function(ms){
      ms.forEach(function(m){
        if(m.type==='childList') m.addedNodes.forEach(function(n){ if(n.nodeType===1) pend.add(n); });
        else if(m.target.nodeType===1){ clear(m.target); pend.add(m.target); }
      });
      if(!tm) tm=setTimeout(flush,150);
    }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
})();

;

/* mobile browsers sometimes drop the synthetic click on a re-rendered card; if a clean tap on a channel row gets no click, fire it */
(function(){
  var SEL='#ev-lt .evc,.epg-row,.channel-card,.ch-card';
  var sx=0,sy=0,tg=null,moved=false;
  document.addEventListener('touchstart',function(e){ var t=e.touches[0]; sx=t.clientX; sy=t.clientY; moved=false; tg=e.target.closest?e.target.closest(SEL):null; },{passive:true,capture:true});
  document.addEventListener('touchmove',function(e){ var t=e.touches[0]; if(Math.abs(t.clientX-sx)>10||Math.abs(t.clientY-sy)>10) moved=true; },{passive:true,capture:true});
  document.addEventListener('touchend',function(e){
    var el=tg; tg=null; if(!el||moved) return;
    if(e.target.closest&&e.target.closest('button,a,.sx-heart-btn,[class*=heart],[class*=fav]')) return;
    var got=false,h=function(){ got=true; };
    el.addEventListener('click',h,{once:true,capture:true});
    setTimeout(function(){
      el.removeEventListener('click',h,true);
      var ov=document.getElementById('stream-player-overlay');
      if(!got&&el.isConnected&&!(ov&&ov.classList.contains('open'))) el.click();
    },450);
  },{passive:true,capture:true});
})();

;

/* dark theme only (light theme + switcher removed) */
(function(){
  var root=document.documentElement;
  root.setAttribute('data-theme','dark'); root.style.colorScheme='dark';
  document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){ m.setAttribute('content','#000000'); });
  [500,2500].forEach(function(ms){ setTimeout(function(){ if(window.__wtSweep3) window.__wtSweep3(); },ms); });
  window.sxSetTheme=function(){};
})();

;

/* ===== SX SOUND ENGINE — hover, movement (scroll/swipe/click) and loading sounds.
   Pure WebAudio (no files). Browsers block audio until the first tap/click/key,
   so the loading sound starts the moment the visitor first interacts. ===== */
(function(){
  var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
  var ctx=null, master=null, enabled=true, vol=.5;
  try{ var sv=parseFloat(localStorage.getItem('sx_vol')); if(!isNaN(sv)) vol=Math.max(0,Math.min(1,sv)); }catch(e){}
  try{ enabled = localStorage.getItem('sx_sound')!=='off'; }catch(e){}
  var btn=document.getElementById('sx-sound-btn');
  function paintBtn(){ if(btn) btn.textContent=enabled?'🔊':'🔇'; }
  paintBtn();

  function ensure(){
    if(!ctx){
      try{ ctx=new AC(); master=ctx.createGain(); master.gain.value=vol; var cmp=ctx.createDynamicsCompressor(); cmp.threshold.value=-14; cmp.knee.value=12; cmp.ratio.value=8; cmp.attack.value=.003; cmp.release.value=.2; master.connect(cmp); cmp.connect(ctx.destination); }catch(e){ return false; }
    }
    if(ctx.state==='suspended') ctx.resume().catch(function(){});
    return true;
  }
  function tone(o){ // freq, to, dur, type, vol, delay
    if(!enabled||!ensure()||ctx.state!=='running') return;
    var t=ctx.currentTime+(o.delay||0), osc=ctx.createOscillator(), g=ctx.createGain();
    osc.type=o.type||'sine';
    osc.frequency.setValueAtTime(o.freq,t);
    if(o.to) osc.frequency.exponentialRampToValueAtTime(o.to,t+o.dur);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(o.vol||0.05,t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+o.dur);
    osc.connect(g); g.connect(master); osc.start(t); osc.stop(t+o.dur+0.03);
  }
  function noise(dur,vol,f0,f1){ // filtered noise swish
    if(!enabled||!ensure()||ctx.state!=='running') return;
    var t=ctx.currentTime, n=Math.floor(ctx.sampleRate*dur), buf=ctx.createBuffer(1,n,ctx.sampleRate), d=buf.getChannelData(0);
    for(var i=0;i<n;i++) d[i]=(Math.random()*2-1)*(1-i/n);
    var src=ctx.createBufferSource(); src.buffer=buf;
    var bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=1.2;
    bp.frequency.setValueAtTime(f0,t); bp.frequency.exponentialRampToValueAtTime(f1,t+dur);
    var g=ctx.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    src.connect(bp); bp.connect(g); g.connect(master); src.start(t);
  }

  var P={};
  P['default']={
    hover:function(){ tone({freq:1250,to:1650,dur:.06,type:'sine',vol:.035}); },
    click:function(){ tone({freq:520,to:300,dur:.09,type:'triangle',vol:.07}); tone({freq:900,dur:.05,type:'sine',vol:.03,delay:.02}); },
    swish:function(){ noise(.16,.05,500,2600); },
    loadTick:function(i){ tone({freq:380+i*55,to:430+i*55,dur:.11,type:'triangle',vol:.05}); },
    ready:function(){ [523,659,784,1047].forEach(function(f,i){ tone({freq:f,dur:.32,type:'sine',vol:.07,delay:i*.09}); }); noise(.35,.05,400,3200); },
    ding:function(){ tone({freq:880,dur:.14,type:'sine',vol:.07}); }
  };
  /* Windows 11 — soft, airy Fluent-style: gentle tick, rising shimmer startup, two-note volume ding */
  P.windows={
    hover:function(){ tone({freq:2200,dur:.025,type:'sine',vol:.01}); },
    click:function(){ tone({freq:700,to:540,dur:.07,type:'sine',vol:.06}); tone({freq:1400,dur:.04,type:'sine',vol:.018,delay:.01}); },
    swish:function(){ noise(.12,.03,900,2400); },
    loadTick:function(i){ tone({freq:440+(i%4)*110,dur:.2,type:'sine',vol:.035}); },
    ready:function(){ [392,523,659,784,1047,1319].forEach(function(f,i){ tone({freq:f,dur:1.3,type:'sine',vol:.045,delay:i*.11}); }); tone({freq:196,dur:1.6,type:'triangle',vol:.04}); noise(.9,.015,1500,6000); },
    ding:function(){ tone({freq:1175,dur:.22,type:'sine',vol:.07}); tone({freq:1760,dur:.32,type:'sine',vol:.06,delay:.1}); }
  };
  /* macOS — rounded "pop" click, silent hover, big warm chord chime on start */
  P.mac={
    hover:function(){},
    click:function(){ tone({freq:900,to:430,dur:.06,type:'sine',vol:.09}); tone({freq:1800,to:900,dur:.03,type:'sine',vol:.02}); },
    swish:function(){ noise(.1,.02,700,1800); },
    loadTick:function(i){ tone({freq:1200+(i%4)*150,dur:.1,type:'triangle',vol:.03}); },
    ready:function(){ [185,277,370,440,554].forEach(function(f){ tone({freq:f,dur:2.4,type:'sine',vol:.05}); tone({freq:f*2,dur:1.6,type:'triangle',vol:.015}); }); },
    ding:function(){ tone({freq:1568,dur:.14,type:'sine',vol:.08}); tone({freq:2093,dur:.1,type:'sine',vol:.03,delay:.02}); }
  };
  /* Android / Chrome OS — crisp tap, bubbly ascending pluck */
  P.android={
    hover:function(){},
    click:function(){ tone({freq:1500,to:1050,dur:.045,type:'sine',vol:.085}); },
    swish:function(){ noise(.08,.015,1200,2600); },
    loadTick:function(i){ tone({freq:900-(i%4)*70,to:700-(i%4)*50,dur:.08,type:'sine',vol:.04}); },
    ready:function(){ [784,988,1319,1568].forEach(function(f,i){ tone({freq:f,to:f*1.02,dur:.28,type:'triangle',vol:.06,delay:i*.1}); tone({freq:f*2,dur:.12,type:'sine',vol:.02,delay:i*.1}); }); },
    ding:function(){ tone({freq:1047,dur:.1,type:'sine',vol:.07}); tone({freq:1568,dur:.16,type:'sine',vol:.07,delay:.07}); }
  };
  var S={profile:'default'};
  S.setProfile=function(n){ var p=P[n]||P['default']; S.profile=P[n]?n:'default'; ['hover','click','swish','loadTick','ready','ding'].forEach(function(k){ S[k]=p[k]; }); };
  S.setProfile('default');
  function fire(){ try{ window.dispatchEvent(new Event('sxsound')); }catch(e){} }
  S.getVolume=function(){ return vol; };
  S.setVolume=function(v){ vol=Math.max(0,Math.min(1,+v||0)); if(master&&ctx) master.gain.setTargetAtTime(vol,ctx.currentTime,.02); try{ localStorage.setItem('sx_vol',String(vol)); }catch(e){} fire(); };
  S.isMuted=function(){ return !enabled; };
  S.setMuted=function(m){ enabled=!m; try{ localStorage.setItem('sx_sound',enabled?'on':'off'); }catch(e){} paintBtn(); fire(); if(enabled){ ensure(); S.ding(); } };
  window.SXSound=S;

  /* ---------- hover (mouse/pen only, throttled, once per element entry) ---------- */
  var HOV='a,button,[role="button"],[onclick],.card,.channel-card,.ch-card,.fx2-card,.fixture-card,.cat-card,.ott-card,.hero-slide-card,.smo-card,.broadcast-card,.chp-card,.tab,.ch-tab,.mtab,summary,label';
  var lastH=0,lastEl=null;
  document.addEventListener('pointerover',function(e){
    if(e.pointerType==='touch') return;
    var el=e.target.closest&&e.target.closest(HOV); if(!el||el===lastEl) return;
    lastEl=el; var n=Date.now(); if(n-lastH<70) return; lastH=n; setTimeout(function(){S.hover();},60);
  },{passive:true});
  document.addEventListener('pointerout',function(e){ if(lastEl&&!lastEl.contains(e.relatedTarget)) lastEl=null; },{passive:true});

  /* ---------- click / tap ---------- */
  document.addEventListener('pointerdown',function(e){
    ensure(); startLoadSound();
    if(e.target.closest&&e.target.closest('#os-vol,#os-set input')) return;
    if(e.target.closest&&e.target.closest(HOV)) S.click();
  },{passive:true,capture:true});
  ['keydown','touchstart'].forEach(function(ev){ document.addEventListener(ev,function(){ ensure(); startLoadSound(); },{passive:true,capture:true}); });

  /* ---------- movement: scroll, swipe, wheel ---------- */
  var lastY=window.scrollY||0,lastS=0,lastW=0,lastT=0;
  function moveSwish(){ var n=Date.now(); if(n-lastS<220) return; lastS=n; S.swish(); }
  window.addEventListener('scroll',function(){ var y=window.scrollY||0; if(Math.abs(y-lastY)>90){ lastY=y; moveSwish(); } },{passive:true});
  document.addEventListener('wheel',function(){ var n=Date.now(); if(n-lastW>350){ lastW=n; moveSwish(); } },{passive:true});
  var ty=0; document.addEventListener('touchstart',function(e){ ty=e.touches[0].clientY; },{passive:true});
  document.addEventListener('touchmove',function(e){ var y=e.touches[0].clientY; if(Math.abs(y-ty)>80){ ty=y; moveSwish(); } },{passive:true});

  /* ---------- loading sound ---------- */
  var loader=document.getElementById('cms-loader'), loadTimer=null, loadStarted=false, loadDone=false, step=0;
  function loaderVisible(){ return loader&&!loader.classList.contains('done')&&loader.style.display!=='none'; }
  function startLoadSound(){
    if(loadStarted||loadDone||!loaderVisible()||!ctx||ctx.state!=='running') return;
    loadStarted=true; step=0;
    loadTimer=setInterval(function(){ if(!loaderVisible()){ finishLoad(); return; } S.loadTick(step++%8); },260);
  }
  function finishLoad(){
    if(loadDone) return; loadDone=true; clearInterval(loadTimer); S.ready();
  }
  if(loader){
    new MutationObserver(function(){ if(!loaderVisible()) finishLoad(); }).observe(loader,{attributes:true,attributeFilter:['class','style']});
    // try immediately (works if the browser already allows audio, e.g. returning visitor)
    try{ ensure(); setTimeout(startLoadSound,50); }catch(e){}
  }

  /* ---------- mute toggle ---------- */
  if(btn) btn.addEventListener('click',function(ev){
    ev.stopPropagation(); enabled=!enabled; paintBtn();
    try{ localStorage.setItem('sx_sound',enabled?'on':'off'); }catch(e){}
    if(enabled){ ensure(); S.click(); }
  });
})();

;

(function(){
  var KEY='ev_ui_mode', MODES=['default','windows','android','mac'];
  var root=document.documentElement;
  var GEAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  function spk(v,m){
    var w='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" stroke-width="1.4"/>';
    if(m||v<=0)return w+'<path d="M16 9l5 6M21 9l-5 6"/></svg>';
    if(v<.34)return w+'<path d="M15.5 10a3 3 0 0 1 0 4"/></svg>';
    if(v<.67)return w+'<path d="M15.5 9a4.5 4.5 0 0 1 0 6"/><path d="M15.5 10a3 3 0 0 1 0 4" stroke="none"/></svg>';
    return w+'<path d="M15.5 9a4.5 4.5 0 0 1 0 6M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>';
  }
  var SND=function(){return window.SXSound;};
  function sVol(){var S=SND();return S?S.getVolume():.5;}
  function sMut(){var S=SND();return S?S.isMuted():false;}
  var WINLOGO='<svg viewBox="0 0 24 24"><defs><linearGradient id="osWg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fd6ff"/><stop offset="1" stop-color="#1b8cff"/></linearGradient></defs><g fill="url(#osWg)"><rect x="2.5" y="2.5" width="9" height="9" rx="1.4"/><rect x="12.5" y="2.5" width="9" height="9" rx="1.4"/><rect x="2.5" y="12.5" width="9" height="9" rx="1.4"/><rect x="12.5" y="12.5" width="9" height="9" rx="1.4"/></g></svg>';
  var WCOL=['#60cdff','#e6e6e6','#6ee7a0','#ffb454','#c4a1ff','#5eead4','#ff8a80','#ffd666','#8c9eff','#4fc3f7','#f48fb1','#b0b8c4'];
  var GRAD=['#ff6b6b,#d6336c','#4dabf7,#1c62d6','#51cf66,#2b8a3e','#ffa94d,#e8590c','#b197fc,#6741d9','#38d9a9,#0b7285','#ff8787,#c92a2a','#74c0fc,#1864ab','#ffd43b,#e67700','#a9e34b,#5c940d','#f783ac,#a61e4d','#66d9e8,#0b7285'];

  function getMode(){return (typeof mode==='string'&&MODES.indexOf(mode)>=0)?mode:'default';}
  var mode=getMode();
  root.setAttribute('data-ui',mode);

  var bar=document.getElementById('os-bar'),mb=document.getElementById('os-menubar'),menu=document.getElementById('os-menu'),set=document.getElementById('os-set');

  /* ---- collect the real sidebar entries (so every mode uses the exact same handlers) ---- */
  function railItems(){
    var rail=document.getElementById('hs-rail');if(!rail)return[];
    var out=[];
    rail.querySelectorAll('.in > a,.in > .sep').forEach(function(n){
      if(n.classList.contains('sep')){out.push('sep');return;}
      if(n.classList.contains('os-gear-rail')||n.classList.contains('os-snd-rail'))return;
      var c=n.cloneNode(true);var sp=c.querySelector('span');if(sp)sp.remove();
      out.push({a:n,label:n.getAttribute('title')||(sp&&sp.textContent)||'',icon:c.innerHTML});
    });
    return out;
  }
  function addRailGear(){
    var rail=document.getElementById('hs-rail');if(!rail)return;
    var inn=rail.querySelector('.in');if(!inn)return;
    var g=inn.querySelector('.os-gear-rail');
    if(!g){
      g=document.createElement('a');g.className='os-gear-rail';g.title='Settings';
      g.innerHTML=GEAR+'<span>Settings</span>';
      g.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openSettings();});
    }
    var sn=inn.querySelector('.os-snd-rail');
    if(!sn){
      sn=document.createElement('a');sn.className='os-snd-rail';sn.title='Sound';
      sn.innerHTML='<span class="spk" data-spk></span><span>Sound</span>';
      sn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleVol();});
    }
    if(inn.lastElementChild!==g||g.previousElementSibling!==sn){inn.appendChild(sn);inn.appendChild(g);}
  }

  var items=[],lastSig='';
  function railSig(){return railItems().map(function(x){return x==='sep'?'|':x.label;}).join(',');}
  function btn(it,i,cls){
    return '<button type="button" class="os-i'+(cls||'')+'" data-i="'+i+'" data-label="'+it.label+'" title="'+it.label+'" aria-label="'+it.label+'"'+(it.mac&&mode==='mac'?' style="background:linear-gradient(160deg,'+it.mac+')"':(mode==='windows'?' style="color:'+WCOL[it.k%WCOL.length]+'"':''))+'>'+it.icon+'</button>';
  }
  function build(){
    if(['github','vscode','hackathon','linux','retro'].indexOf(mode)>=0){var _b=document.getElementById('os-bar');if(_b){_b.innerHTML='';_b.className=''}if(window.evXBuild){window.evXBuild(mode);return;}}
    items=railItems();lastSig=railSig();var k=0;
    items.forEach(function(it){if(it!=='sep'){it.mac=GRAD[k%GRAD.length];it.k=k;k++;}});
    var apps='',all='';
    items.forEach(function(it,i){
      if(it==='sep'){apps+='<div class="os-sep"></div>';return;}
      apps+=btn(it,i);all+='<button type="button" class="os-i" data-i="'+i+'" data-m="1"><span style="display:contents">'+it.icon+'</span><span>'+it.label+'</span></button>';
    });
    var clock='<div class="os-clock" id="os-clock"></div>';
    if(mode==='windows'){
      bar.className='osw';
      var logo=document.querySelector('#hs-rail .rail-logo-img');var lsrc=logo&&logo.src?'<img src="'+logo.src+'" alt="">':'';
      var WIFI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.2" r=".9" fill="currentColor"/></svg>';
      var CHEV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>';
      bar.innerHTML='<div class="os-wid" title="EVORA">'+lsrc+'<div><b>EVORA</b><span>Live streams</span></div></div>'
        +'<div class="os-apps"><button type="button" class="os-i os-start" data-act="menu" title="Start" aria-label="Start">'+WINLOGO+'</button>'+apps+'</div>'
        +'<div class="os-tray"><button type="button" class="os-i os-chev" data-act="settings" title="Settings" aria-label="Settings">'+GEAR+'</button>'
        +'<button type="button" class="os-grp" data-act="vol" title="Sound" aria-label="Sound"><span class="os-wifi">'+WIFI+'</span><span data-spk style="display:contents"></span></button>'+clock+'</div>';
    }else if(mode==='android'){
      bar.className='osa';
      bar.innerHTML='<button type="button" class="os-launch" data-act="menu" title="Launcher" aria-label="Launcher"><i></i></button><div class="os-apps">'+apps+'</div><div class="os-tray"><button type="button" class="os-i" data-act="vol" title="Sound" aria-label="Sound"><span data-spk style="display:contents"></span></button><button type="button" class="os-i" data-act="settings" title="Settings" aria-label="Settings">'+GEAR+'</button>'+clock+'</div>';
    }else if(mode==='mac'){
      bar.className='osm';
      bar.innerHTML='<div class="os-apps">'+apps+'<div class="os-sep"></div><button type="button" class="os-i" data-act="settings" data-label="Settings" title="Settings" aria-label="Settings" style="background:linear-gradient(160deg,#9aa0a6,#5f6368)">'+GEAR+'</button></div>';
      mb.innerHTML='<button type="button" data-act="home" style="display:flex;align-items:center;gap:6px"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.700 2.400 2.900 2.300 1.200 0 1.600-.8 3-.8s1.800.8 3 .7c1.300 0 2.100-1.100 2.800-2.200.9-1.300 1.300-2.500 1.300-2.600 0 0-2.500-1-2.500-3.800zM14.100 5.800c.6-.8 1.100-1.800.9-2.800-.9 0-2 .6-2.600 1.400-.6.700-1.100 1.700-.9 2.700 1 .1 2-.5 2.600-1.300z"/></svg><b>EVORA</b></button>'
        +'<button type="button" data-act="nav" data-n="Home">Home</button><button type="button" data-act="nav" data-n="Matches">Matches</button><button type="button" data-act="nav" data-n="Live TV">Live TV</button><button type="button" data-act="nav" data-n="Movies">Movies</button>'
        +'<div class="os-mb-r"><button type="button" data-act="vol" title="Sound" aria-label="Sound"><span data-spk style="display:contents"></span></button><button type="button" data-act="settings" title="Settings" aria-label="Settings">'+GEAR+'</button><span id="os-clock" style="padding:0 4px"></span></div>';
    }else{bar.className='';bar.innerHTML='';mb.innerHTML='';}
    var rec='';
    if(mode==='windows'){
      ['Live TV','Matches','Movies','TV Shows'].forEach(function(lb){var ix=-1;items.forEach(function(x,i){if(x!=='sep'&&x.label===lb)ix=i;});if(ix<0)return;
        rec+='<button type="button" class="os-rec" data-i="'+ix+'" data-m="1"><span class="ri">'+items[ix].icon+'</span><span class="rt"><b>'+lb+'</b><small>Quick access</small></span></button>';});
    }
    var SRCH='<div class="os-srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3L20 20"/></svg><input class="os-sin" type="text" placeholder="Search for apps, matches and channels" autocomplete="off" spellcheck="false" aria-label="Search for apps, matches and channels"><button type="button" class="os-sclr" data-act="sclear" aria-label="Clear" hidden>&#10005;</button></div>';
    menu.innerHTML=(mode==='windows'?SRCH:'')+'<div class="os-home">'+(mode==='windows'?'<div class="os-sh"><h4>Pinned</h4></div>':'<h4>Apps</h4>')+'<div class="os-grid">'+all+'</div>'+(rec?'<div class="os-sh"><h4>Recommended</h4></div><div class="os-recs">'+rec+'</div>':'')+'</div><div class="os-res" hidden></div><div class="os-foot"><span class="os-user"><i></i>EVORA</span><button type="button" data-act="settings">'+GEAR+'Settings</button></div>';
    if(mode==='windows'&&SQ){var si0=menu.querySelector('.os-sin');if(si0){si0.value=SQ;osSearch(SQ);}}
    sync();tick();paintSpk();
  }
  function sync(){
    var on=function(i){var it=items[i];return it&&it!=='sep'&&it.a.classList.contains('on');};
    document.querySelectorAll('#os-bar .os-i[data-i],#os-menu .os-i[data-i]').forEach(function(b){b.classList.toggle('on',on(+b.dataset.i));});
  }
  function pad(n){return n<10?'0'+n:n;}
  function tick(){
    var el=document.getElementById('os-clock');if(!el)return;var d=new Date();
    if(mode==='mac'){el.textContent=d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})+'  '+d.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});}
    else if(mode==='android'){el.textContent=d.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});}
    else{el.innerHTML=d.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'})+'<br>'+pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear();}
  }
  setInterval(tick,15000);

  function markStart(){var st=document.querySelector('#os-bar .os-start');if(st)st.classList.toggle('open',menu.classList.contains('open'));}
  function closeMenu(){menu.classList.remove('open');markStart();var si=menu.querySelector('.os-sin');if(si&&si.value){si.value='';osSearch('');}}
  function openSettings(){closeMenu();closeVol&&closeVol();renderSettings();set.classList.add('open');paintSpk();}
  function closeSettings(){set.classList.remove('open');}

  /* ---- clicks ---- */
  function handle(e){
    var b=e.target.closest('button');if(!b)return;
    var act=b.dataset.act;
    if(act==='menu'){menu.classList.toggle('open');markStart();if(menu.classList.contains('open'))setTimeout(function(){var i=menu.querySelector('.os-sin');if(i)i.focus();},60);e.stopPropagation();return;}
    if(act==='sfilt'){SF=b.dataset.f;osSearch(SQ);var fi=menu.querySelector('.os-sin');if(fi)fi.focus();return;}
    if(act==='sclear'){var ci=menu.querySelector('.os-sin');if(ci){ci.value='';osSearch('');ci.focus();}return;}
    if(b.classList.contains('os-rr')){var rr=RES[+b.dataset.r];closeMenu();if(rr&&rr.go)rr.go();return;}
    if(act==='vol'){toggleVol();e.stopPropagation();return;}
    if(act==='search'){var q=items.filter(function(x){return x!=='sep'&&x.label==='Search';})[0];closeMenu();if(q)q.a.click();return;}
    if(act==='settings'){openSettings();return;}
    if(act==='home'){var h=items.filter(function(x){return x!=='sep'&&x.label==='Home';})[0];if(h)h.a.click();return;}
    if(act==='nav'){var t=items.filter(function(x){return x!=='sep'&&x.label===b.dataset.n;})[0];if(t)t.a.click();return;}
    if(b.dataset.i!==undefined){
      var it=items[+b.dataset.i];if(!it||it==='sep')return;
      closeMenu();it.a.click();
      if(mode==='mac'&&b.closest('#os-bar')){b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');}
      setTimeout(sync,30);
    }
  }

  /* ---- Start-menu search: results appear INSIDE the menu (no jump to the Search tab) ---- */
  var RES=[],SEL=0,SF='all',SQ='',LOADT=0;
  function oe(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function fireHtml(html){
    if(!html)return;
    var t=document.createElement('div');t.style.cssText='position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden';
    t.innerHTML=html;document.body.appendChild(t);
    var el=t.querySelector('[onclick]');
    try{if(el)el.click();}catch(err){}
    setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},4000);
  }
  var GLY={
    app:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
    match:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',
    ch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    movie:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 10h18M8 5l-2 5M14 5l-2 5M20 5l-2 5"/></svg>',
    tv:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 3l4 4 4-4"/></svg>'
  };
  var CHEVR='<svg class="rt-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  function rowHtml(r,i,best){
    return '<button type="button" class="os-rr'+(best?' best':'')+(i===SEL?' sel':'')+'" data-r="'+i+'"><span class="rt-th">'+GLY[r.k]+(r.img?'<img src="'+oe(r.img)+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">':'')+'</span><span class="rt-tx"><b>'+oe(r.t)+'</b><small>'+oe(r.s)+'</small></span>'+(r.live?'<i class="rt-live">LIVE</i>':'')+CHEVR+'</button>';
  }
  function osSearch(raw){
    SQ=raw||'';
    var res=menu.querySelector('.os-res'),home=menu.querySelector('.os-home'),clr=menu.querySelector('.os-sclr');
    if(!res||!home)return;
    var q=SQ.trim();
    if(clr)clr.hidden=!SQ;
    if(!q){res.hidden=true;home.hidden=false;RES=[];SEL=0;return;}
    if(q.length>=2&&window.hsmLoadAll){clearTimeout(LOADT);LOADT=setTimeout(function(){try{hsmLoadAll('movie');hsmLoadAll('tv');}catch(err){}},500);}
    var ql=q.toLowerCase(),
        tokens=window.sxSearchTokens?sxSearchTokens(ql):ql.split(/\s+/),
        sc=function(f){return window.sxHaystackScore?sxHaystackScore(tokens,f):(f.join(' ').toLowerCase().indexOf(ql)>=0?1:0);},
        LIM=(SF==='all')?4:30,
        G={app:[],match:[],ch:[],movie:[],tv:[]};
    function add(g,s,r){G[g].push({s:s,r:r});}
    /* apps */
    items.forEach(function(it){
      if(it==='sep')return;var l=(it.label||'').toLowerCase(),s=l.indexOf(ql)===0?900:l.indexOf(ql)>=0?500:0;
      if(s)add('app',s,{k:'app',t:it.label,s:'App',go:function(){it.a.click();setTimeout(sync,30);}});
    });
    /* matches from every source */
    (window._matchCardsData||[]).forEach(function(c){
      var s=sc([c.team1_full_name||'',c.team1_code||'',c.team2_full_name||'',c.team2_code||'',c.game||'',c.details||'',c.sport||c.sports||'']);if(!(s>0))return;
      var live=false;try{live=matchStatusText(c).toLowerCase()==='live';}catch(err){}
      var dl='';try{dl=(typeof smoCardDateLabel==='function')?smoCardDateLabel(c):'';}catch(err){}
      add('match',s+(live?60:0),{k:'match',t:(c.team1_full_name||c.team1_code||'')+' vs '+(c.team2_full_name||c.team2_code||''),s:[c.game,dl].filter(Boolean).join(' · ')||'Match',img:c.banner_url||c.banner_image_url||c.team1_icon_url||'',live:live,
        go:function(){try{fireHtml(sxWatchBtnHtml(c,'smo-btn'));}catch(err){}}});
    });
    (window._fcxMatchesCache||[]).forEach(function(m){
      if(sxFcxDup(m))return;
      var s=sc([m.title||'',m.tournament||'',m.category||'']);if(!(s>0))return;var live=m.status==='LIVE';
      add('match',s+(live?60:0),{k:'match',t:m.title||'Match',s:'FanCode · '+(m.tournament||m.category||''),img:m.image||'',live:live,go:function(){try{fireHtml(sxFcxMatchCardHtml(m));}catch(err){}}});
    });
    (window._slxGroups||[]).forEach(function(g){
      if(sxGrpDup(g))return;
      var s=sc([g.title||'',g.category||'',g.tour||'',(g.teams||[]).join(' ')]);if(!(s>0))return;var live=g.status==='LIVE';
      add('match',s+(live?60:0),{k:'match',t:g.title||'Match',s:'SonyLIV · '+(g.category||'Sports'),img:g.poster||'',live:live,go:function(){try{fireHtml(sxSonyCardHtml(g));}catch(err){}}});
    });
    (window._wlxGroups||[]).forEach(function(g){
      if(sxGrpDup(g))return;
      var s=sc([g.title||'',g.tour||'',g.category||'','willow',(g.teams||[]).join(' ')]);if(!(s>0))return;var live=g.status==='LIVE';
      add('match',s+(live?60:0),{k:'match',t:g.title||'Match',s:'Willow · '+(g.tour||'Cricket'),img:g.poster||'',live:live,go:function(){try{fireHtml(sxWlxCardHtml(g));}catch(err){}}});
    });
    /* channels */
    (window._cmsChannels||[]).forEach(function(c){
      var s=sc([c.channel_name||'',c.group||'']);if(!(s>0))return;var live=(c.status_live_off||'').toUpperCase()==='LIVE';
      add('ch',s+(live?30:0),{k:'ch',t:c.channel_name||'Channel',s:'Channel · '+(c.group||'Live TV'),img:c.icon_url||'',live:live,go:function(){try{fireHtml(sxChannelRowOuterHtml(c));}catch(err){}}});
    });
    /* movies + TV */
    [['movie','Movie'],['tv','TV show']].forEach(function(p){
      var out=null;try{out=sxCatalogSearch(p[0],q,SF===p[0]?40:LIM+2);}catch(err){}
      ((out&&out.list)||[]).forEach(function(m,i){
        var g0=m.genre?String(m.genre).split(/[,|]/)[0].trim():'';
        add(p[0],3000-i,{k:p[0],t:m.title||'Untitled',s:[p[1],m.year,g0].filter(Boolean).join(' · '),img:m.poster_url||'',
          go:function(){window._sxSearchStash={movie:[m],tv:[m]};try{sxSearchPlay(p[0],0);}catch(err){}}});
      });
    });
    Object.keys(G).forEach(function(k){G[k].sort(function(a,b){return b.s-a.s;});});
    var order=[['app','Apps'],['match','Matches'],['ch','Channels'],['movie','Movies'],['tv','TV shows']];
    var fmap={all:null,app:'app',match:'match',ch:'ch',movie:'movie',tv:'tv'};
    var secs=[],best=null;
    if(SF==='all'){
      var pick=G.app.length&&G.app[0].s>=900?'app':null;
      if(!pick){['match','ch','movie','tv','app'].some(function(k){if(G[k].length){pick=k;return true;}return false;});}
      if(pick){best=G[pick][0].r;G[pick]=G[pick].slice(1);}
    }
    var flat=[],html='';
    if(best){flat.push(best);html+='<h4>Best match</h4>'+rowHtml(best,0,true);}
    order.forEach(function(o){
      if(fmap[SF]&&fmap[SF]!==o[0])return;
      var arr=G[o[0]].slice(0,LIM).map(function(x){return x.r;});if(!arr.length)return;
      html+='<h4>'+o[1]+'</h4>';
      arr.forEach(function(r){flat.push(r);html+=rowHtml(r,flat.length-1,false);});
    });
    RES=flat;if(SEL>=RES.length)SEL=0;
    var chips='<div class="os-sf">'+[['all','All'],['app','Apps'],['match','Matches'],['ch','Channels'],['movie','Movies'],['tv','TV']].map(function(c){return '<button type="button" data-act="sfilt" data-f="'+c[0]+'"'+(SF===c[0]?' class="on"':'')+'>'+c[1]+'</button>';}).join('')+'</div>';
    if(!flat.length){
      var ld=(window.vaPools&&((vaPools.movie&&!vaPools.movie.all.length)||(vaPools.tv&&!vaPools.tv.all.length)));
      html='<div class="os-none"><b>No results for \u201c'+oe(q)+'\u201d</b><span>Try a team, tournament, channel, movie or show name'+(ld?' \u00b7 movies &amp; TV are still loading':'')+'.</span></div>';
    }
    res.innerHTML=chips+html;home.hidden=true;res.hidden=false;
    /* re-apply selected highlight (first result is selected by default) */
    var sel=res.querySelector('.os-rr.sel');if(!sel){var f0=res.querySelector('.os-rr');if(f0){f0.classList.add('sel');SEL=0;}}
  }
  function moveSel(d){
    var rows=menu.querySelectorAll('.os-res .os-rr');if(!rows.length)return;
    SEL=(SEL+d+rows.length)%rows.length;
    rows.forEach(function(r,i){r.classList.toggle('sel',i===SEL);});
    var el=rows[SEL];if(el&&el.scrollIntoView)el.scrollIntoView({block:'nearest'});
  }
  menu.addEventListener('input',function(e){if(e.target.classList&&e.target.classList.contains('os-sin')){SEL=0;osSearch(e.target.value);}});
  menu.addEventListener('keydown',function(e){
    if(!e.target.classList||!e.target.classList.contains('os-sin'))return;
    if(e.key==='ArrowDown'){e.preventDefault();moveSel(1);}
    else if(e.key==='ArrowUp'){e.preventDefault();moveSel(-1);}
    else if(e.key==='Enter'){var r=RES[SEL];if(r){e.preventDefault();closeMenu();if(r.go)r.go();}}
    else if(e.key==='Escape'&&e.target.value){e.preventDefault();e.stopPropagation();e.target.value='';osSearch('');}
  });
  /* typing anywhere while Start is open goes straight into the search box, like Windows */
  document.addEventListener('keydown',function(e){
    if(!menu.classList.contains('open')||mode!=='windows')return;
    if(e.ctrlKey||e.metaKey||e.altKey||!e.key||e.key.length!==1)return;
    if(/^(INPUT|TEXTAREA|SELECT)$/.test((e.target&&e.target.tagName)||''))return;
    var i=menu.querySelector('.os-sin');if(i)i.focus();
  },true);

  bar.addEventListener('click',handle);mb.addEventListener('click',handle);menu.addEventListener('click',handle);
  document.addEventListener('click',function(e){if(menu.classList.contains('open')&&!e.target.closest('#os-menu,#os-bar'))closeMenu();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeMenu();closeSettings();closeVol();}});

  /* ---- mac magnification ---- */
  var raf=0;
  bar.addEventListener('mousemove',function(e){
    if(mode!=='mac')return;var x=e.clientX;
    cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){
      bar.querySelectorAll('.os-i').forEach(function(b){
        var r=b.getBoundingClientRect(),c=r.left+r.width/2,d=Math.abs(x-c);
        b.style.setProperty('--s',(1+0.62*Math.max(0,1-d/120)).toFixed(3));
      });
    });
  });
  bar.addEventListener('mouseleave',function(){bar.querySelectorAll('.os-i').forEach(function(b){b.style.removeProperty('--s');});});

  /* ---- settings panel ---- */
  var DEFS=[
    ['default','Default','Floating sidebar (hover to expand)','<div class="pv"><i class="blk"></i><i class="blk2"></i><i class="side"><u style="top:6px"></u><u style="top:15px"></u><u style="top:24px"></u><u style="top:33px"></u></i></div>'],
    ['windows','Windows','Taskbar with Start menu & tray','<div class="pv"><i class="blk"></i><i class="blk2"></i><i class="win"><u style="left:44%;background:#4cc2ff"></u><u style="left:50%"></u><u style="left:56%"></u><u style="left:62%"></u></i></div>'],
    ['android','Android','Chrome OS shelf with launcher','<div class="pv"><i class="blk"></i><i class="blk2"></i><i class="and"><u style="left:6px;width:7px;height:7px;top:3px;border-radius:50%;background:#fff"></u><u style="left:20px;border-radius:50%"></u><u style="left:30px;border-radius:50%"></u><u style="left:40px;border-radius:50%"></u><u style="right:6px;width:22px;border-radius:4px"></u></i></div>'],
    ['mac','Mac','Menu bar with magnifying dock','<div class="pv"><i class="mbar"></i><i class="blk" style="top:20px"></i><i class="blk2" style="top:34px"></i><i class="mac"><u style="left:8px"></u><u style="left:21px;background:#ff6b6b"></u><u style="left:34px;background:#51cf66"></u><u style="left:47px;background:#ffa94d"></u><u style="left:60px;background:#b197fc"></u></i></div>'],
  ];
  function renderSettings(){
    mode=getMode();
    set.innerHTML='<div class="os-card"><div class="os-hd"><h3>Interface mode</h3><button class="os-x" type="button" aria-label="Close">×</button></div>'
      +'<p class="os-sub">Choose how navigation looks and feels. Applies for this visit only; it always opens with Default.</p><div class="os-modes">'
      +DEFS.map(function(d){return (d[0]==='github'?'</div><div class="os-grp" style="margin:18px 0 8px;font-weight:700;opacity:.8">Developer &amp; retro interfaces</div><div class="os-modes">':'')+'<button type="button" class="os-mode'+(d[0]===mode?' sel':'')+'" data-m="'+d[0]+'">'+d[3]+'<b>'+d[1]+'</b><small>'+d[2]+'</small></button>';}).join('')
      +'</div><div class="os-snd"><b>Sound <small>— effects &amp; volume, matched to the selected mode</small></b><div class="ov"><button type="button" class="ov-m" data-mute="1"><span data-spk style="display:contents"></span></button><input type="range" min="0" max="100" data-vol="1"><span class="ov-p" data-pct></span></div></div><div class="os-note">Applies on desktop &amp; tablet screens (wider than 900px). Phones keep the mobile bar.</div></div>';
  }
  set.addEventListener('click',function(e){
    if(e.target===set||e.target.closest('.os-x')){closeSettings();return;}
    var m=e.target.closest('.os-mode');if(!m)return;
    setMode(m.dataset.m);renderSettings();
  });
  function setMode(m){
    if(MODES.indexOf(m)<0)m='default';
    mode=m;
    root.setAttribute('data-ui',m);closeMenu();closeVol();if(SND()){SND().setProfile(m);setTimeout(function(){SND().ready();},80);}build();
  }
  window.evSetUiMode=setMode;window.evOpenSettings=openSettings;

  /* ---- sound popover + controls ---- */
  var vol=document.getElementById('os-vol');
  var NAMES={'default':'Default','windows':'Windows 11','android':'Android','mac':'macOS'};
  function paintSpk(){
    var v=sVol(),m=sMut(),ic=spk(v,m),p=Math.round(v*100);
    document.querySelectorAll('[data-spk]').forEach(function(e){e.innerHTML=ic;});
    document.querySelectorAll('input[data-vol]').forEach(function(r){r.value=p;r.style.setProperty('--p',(m?0:p)+'%');});
    document.querySelectorAll('[data-pct]').forEach(function(e){e.textContent=m?'Off':p;});
    var nm=vol.querySelector('[data-pname]');if(nm)nm.textContent=NAMES[mode]||'';
  }
  function buildVol(){
    vol.innerHTML='<div class="ov-t"><span>Sound</span><span data-pname></span></div><div class="ov"><button type="button" class="ov-m" data-mute="1" title="Mute / unmute" aria-label="Mute"><span data-spk style="display:contents"></span></button><input type="range" min="0" max="100" data-vol="1" aria-label="Volume"><span class="ov-p" data-pct></span></div>';
    paintSpk();
  }
  function toggleVol(){closeMenu();if(vol.classList.contains('open')){vol.classList.remove('open');return;}buildVol();vol.classList.add('open');}
  function closeVol(){vol.classList.remove('open');}
  window.addEventListener('sxsound',paintSpk);
  document.addEventListener('input',function(e){
    var r=e.target.closest&&e.target.closest('input[data-vol]');if(!r||!SND())return;
    var v=(+r.value)/100;if(SND().isMuted()&&v>0)SND().setMuted(false);SND().setVolume(v);
  });
  document.addEventListener('change',function(e){var r=e.target.closest&&e.target.closest('input[data-vol]');if(r&&SND())SND().ding();});
  document.addEventListener('click',function(e){
    var m=e.target.closest&&e.target.closest('[data-mute]');if(m&&SND()){SND().setMuted(!SND().isMuted());return;}
    if(vol.classList.contains('open')&&!e.target.closest('#os-vol,[data-act="vol"],.os-snd-rail'))closeVol();
  });
  vol.addEventListener('click',function(e){e.stopPropagation();var m=e.target.closest('[data-mute]');if(m&&SND())SND().setMuted(!SND().isMuted());});

  /* ---- init + keep in sync with the rail (it can gain entries later, e.g. the Download link) ---- */
  if(SND())SND().setProfile(mode);
  addRailGear();build();
  var rail=document.getElementById('hs-rail'),t=0;
  if(rail){
    var inn=rail.querySelector('.in');
    /* only DIRECT children of the rail changing can alter the item list; label/text updates inside links are ignored */
    new MutationObserver(function(ms){
      var direct=ms.some(function(m){return m.type==='childList'&&m.target===inn;});
      var cls=ms.some(function(m){return m.type==='attributes';});
      if(!direct&&!cls)return;
      clearTimeout(t);t=setTimeout(function(){
        if(direct){addRailGear();if(railSig()!==lastSig)build();}
        sync();
      },80);
    }).observe(rail,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  }
})();

;

(function(){
var NEW=['github','vscode','hackathon','linux','retro'],root=document.documentElement;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function links(){return [].slice.call(document.querySelectorAll('#hs-rail a')).map(function(a){var s=a.querySelector('span');return{t:(s?s.textContent:a.textContent).trim(),a:a}}).filter(function(x){return x.t})}
function mk(id){var e=document.getElementById(id);if(!e){e=document.createElement('div');e.id=id;e.setAttribute('data-wtkeep','1');document.body.appendChild(e)}return e}
var L=[],cur='';
function nav(cls){return L.map(function(x,i){return '<button type="button" class="'+cls+'" data-xn="'+i+'">'+esc(x.t)+'</button>'}).join('')}
function clk(){var d=new Date();return d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
window.evXBuild=function(m){
  cur=m;L=links();var top=mk('xm-top'),bot=mk('xm-bot'),h='',b='';
  if(m==='github'){h='<div class="xm-row"><span class="xm-logo"><svg width="26" height="26" viewBox="0 0 16 16" fill="#e6edf3"><path d="M8 0a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.200-.9-1.200-.7-.5.1-.5.1-.5.8.1 1.200.8 1.200.8.7 1.200 1.900.9 2.300.7.1-.5.3-.9.5-1.100-1.800-.2-3.600-.9-3.600-4 0-.9.3-1.600.8-2.100-.1-.2-.4-1 .1-2.100 0 0 .7-.2 2.200.8a7.500 7.500 0 0 1 4 0c1.500-1 2.200-.8 2.200-.8.4 1.100.2 1.900.1 2.100.5.6.8 1.300.8 2.100 0 3.100-1.900 3.800-3.700 4 .3.3.6.8.6 1.500v2.200c0 .2.1.5.6.4A8 8 0 0 0 8 0z"/></svg>ev-sports <span class="xm-tag">Public</span></span>'+nav('xm-nav')+'<span class="xm-sp"></span><button type="button" class="xm-q" data-xa="search">Type / to search</button><button type="button" class="xm-nav" data-xa="settings">⚙</button></div>'}
  else if(m==='vscode'){h='<div class="xm-title"><span class="xm-win"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span><div class="xm-ctr">ev-sports — Visual Studio Code</div><button type="button" data-xa="settings">⚙</button></div><div class="xm-tabs">'+L.map(function(x,i){return '<button type="button" class="xm-tab" data-xn="'+i+'"><b>{}</b>'+esc(x.t.toLowerCase().replace(/\s+/g,'-'))+'.tsx</button>'}).join('')+'</div>';
    b='<button type="button" data-xa="term">⎇ main</button><span>⊗ 0 ⚠ 0</span><span class="xm-sp"></span><span>Ln 1, Col 1</span><span>UTF-8</span><span>TypeScript React</span><button type="button" data-xa="term">⌨ Terminal</button><span data-clk></span>'}
  else if(m==='hackathon'){h='<div class="xm-row"><span class="xm-logo">&lt;HACK/&gt;EV</span>'+nav('xm-nav')+'<span class="xm-sp"></span><span class="xm-tag">⏱ <span data-hk>--:--:--</span></span><button type="button" class="xm-nav" data-xa="term">&gt;_</button><button type="button" class="xm-nav" data-xa="settings">⚙</button></div>';
    b='<span class="m">★ LIVE NOW · SHIP FAST · BREAK THINGS · CODE · COFFEE · REPEAT · PRESS Ctrl+` FOR TERMINAL ★</span>'}
  else if(m==='linux'){h='<div class="xm-row"><button type="button" class="xm-logo" data-xa="term">Activities</button>'+nav('xm-nav')+'<span class="xm-sp"></span><button type="button" class="xm-nav" data-xa="term">Terminal</button><span data-clk style="padding:0 10px"></span><button type="button" class="xm-nav" data-xa="settings">⚙</button></div>'}
  else if(m==='retro'){h='<div class="xm-mq"><span>*** Welcome to EVORA!!! *** Best viewed in Netscape Navigator 4.0 at 800x600 *** Sign my guestbook! ***</span></div><div class="xm-row"><span class="xm-logo">EVORA</span>'+nav('xm-nav')+'<span class="xm-sp"></span><button type="button" class="xm-nav" data-xa="settings">Options</button></div>';
    b='<span>Done</span><span class="xm-sp"></span><span>🚧 Under construction</span><span>You are visitor #'+String(1000+(Date.now()/86400000|0)%9000).padStart(6,'0')+'</span>'}
  top.innerHTML=h;bot.innerHTML=b;mark();
};
function mark(){var a=document.querySelector('#hs-rail a.on');var i=a?L.findIndex(function(x){return x.a===a}):-1;document.querySelectorAll('#xm-top [data-xn]').forEach(function(e){e.classList.toggle('on',+e.dataset.xn===i)})}
function open(i){var x=L[i];if(x&&x.a)x.a.click();setTimeout(mark,50)}
function act(a){if(a==='settings'&&window.evOpenSettings)window.evOpenSettings();else if(a==='term')term(1);else if(a==='search'){open(L.findIndex(function(x){return /search/i.test(x.t)}))}}
document.addEventListener('click',function(e){var n=e.target.closest&&e.target.closest('[data-xn]'),a=e.target.closest&&e.target.closest('[data-xa]');if(n)open(+n.dataset.xn);else if(a)act(a.dataset.xa)});
setInterval(function(){if(NEW.indexOf(cur)<0)return;document.querySelectorAll('[data-clk]').forEach(function(e){e.textContent=clk()});var h=document.querySelector('[data-hk]');if(h){var s=(Date.now()/1000|0)%86400,r=86399-s;h.textContent=[r/3600|0,(r/60|0)%60,r%60].map(function(v){return String(v).padStart(2,'0')}).join(':')}},1000);
/* ---- terminal ---- */
var T=mk('xm-term'),hist=[],hi=0;
T.innerHTML='<div class="th"><span>user@ev-sports: ~</span><button type="button" data-t="x">✕</button></div><div class="to"></div><div class="tl"><span class="p">$</span><input spellcheck="false" autocomplete="off" aria-label="terminal"></div>';
var O=T.querySelector('.to'),I=T.querySelector('input');
function pr(s,c){var d=document.createElement('div');if(c)d.className=c;d.textContent=s;O.appendChild(d);O.scrollTop=O.scrollHeight}
function term(f){var o=f===1?true:!T.classList.contains('open');T.classList.toggle('open',o);if(o){if(!O.children.length)pr("EVORA shell 1.0 — type 'help'.");I.focus()}}
T.addEventListener('click',function(e){if(e.target.closest('[data-t=x]'))term(0)||T.classList.remove('open');else I.focus()});
document.addEventListener('keydown',function(e){if(NEW.indexOf(cur)<0)return;if(e.ctrlKey&&e.key==='`'){e.preventDefault();term()}else if(e.key==='Escape'&&T.classList.contains('open'))T.classList.remove('open')});
var CM={
help:function(){return 'help ls open <name> mode <name|default> modes neofetch theme date whoami clear echo history'},
ls:function(){return L.map(function(x){return x.t.toLowerCase().replace(/\s+/g,'-')}).join('  ')},
open:function(a){var q=a.join(' ').toLowerCase().replace(/-/g,' ');var i=L.findIndex(function(x){return x.t.toLowerCase()===q});if(i<0)return 'open: not found: '+q+" (try 'ls')";open(i);return 'opening '+L[i].t+'…'},
modes:function(){return 'default windows android mac '+NEW.join(' ')},
mode:function(a){var m=a[0];if(!m)return 'usage: mode <name>';if(window.evSetUiMode){window.evSetUiMode(m);return 'switched to '+m}return 'unavailable'},
theme:function(){return 'dark theme only'},
date:function(){return new Date().toString()},whoami:function(){return 'viewer'},
echo:function(a){return a.join(' ')},clear:function(){O.innerHTML='';return null},
history:function(){return hist.map(function(h,i){return (i+1)+'  '+h}).join('\n')},
neofetch:function(){return 'user@ev-sports\n--------------\nOS: EVORA Web '+(cur||'')+'\nShell: evsh\nUI: '+cur+'\nResolution: '+innerWidth+'x'+innerHeight+'\nTheme: '+(root.getAttribute('data-theme')||'light')+'\nLanguage: '+(navigator.language||'en')}};
I.addEventListener('keydown',function(e){
  if(e.key==='ArrowUp'){if(hi>0)I.value=hist[--hi]||'';e.preventDefault();return}
  if(e.key==='ArrowDown'){I.value=hist[++hi]||'';return}
  if(e.key!=='Enter')return;e.stopPropagation();var v=I.value.trim();I.value='';if(!v)return;hist.push(v);hi=hist.length;
  var p=document.createElement('div');p.innerHTML='<span class="p">user@ev</span>:<span class="pb">~</span>$ ';p.appendChild(document.createTextNode(v));O.appendChild(p);
  var w=v.split(/\s+/),c=CM[w[0]];if(!c)pr(w[0]+': command not found','er');else{var r=c(w.slice(1));if(r!=null)pr(r)}O.scrollTop=O.scrollHeight});
window.evTerm=term;
function init(){var m=root.getAttribute('data-ui');if(NEW.indexOf(m)>=0)window.evXBuild(m)}
init();setTimeout(init,600);setTimeout(init,2000);window.addEventListener('load',function(){init();setTimeout(init,800)});
})();


;
/* ===== GOLD membership: replaces the old VIP Player. Membership is currently unavailable. ===== */
(function(){
  var MSG='Membership is currently unavailable due to some unknown reasons.';
  function build(){
    if(document.getElementById('gold-modal')) return;
    var st=document.createElement('style');
    st.textContent='#gold-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.72);backdrop-filter:blur(6px)}'+
    '#gold-modal.open{display:flex}#gold-modal .gm{width:min(420px,100%);background:#0c0c10;border:1px solid rgba(255,196,60,.35);border-radius:22px;padding:30px 26px 24px;text-align:center;color:#f2f4f8;font:500 14px system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 30px 80px -20px rgba(0,0,0,.8),0 0 60px -20px rgba(255,190,50,.35)}'+
    '#gold-modal .gi{width:56px;height:56px;margin:0 auto 14px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#ffd76a,#d9962b);color:#2a1a00}'+
    '#gold-modal .gi svg{width:28px;height:28px}#gold-modal h2{font-size:22px;font-weight:800;letter-spacing:.14em;background:linear-gradient(90deg,#ffe08a,#e0a030);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:10px}'+
    '#gold-modal p{color:#b4b9c5;line-height:1.55;margin-bottom:20px}#gold-modal button{border:0;border-radius:999px;padding:11px 28px;font:700 14px inherit;font-family:inherit;color:#2a1a00;background:linear-gradient(135deg,#ffd76a,#e0a030);cursor:pointer}';
    document.head.appendChild(st);
    var m=document.createElement('div');m.id='gold-modal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','GOLD');
    m.innerHTML='<div class="gm"><div class="gi"><svg viewBox="0 0 24 20" fill="currentColor"><path d="M2 6.5a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zm20 0a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zm-10-2a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zM2 7.8l4.6 3.4L12 5l5.4 6.2L22 7.8 20 17H4L2 7.8z"/></svg></div><h2>GOLD</h2><p>'+MSG+'</p><button type="button">OK</button></div>';
    m.addEventListener('click',function(e){ if(e.target===m||e.target.tagName==='BUTTON') closeGold(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeGold(); });
    document.body.appendChild(m);
  }
  function openGold(e){ if(e&&e.preventDefault) e.preventDefault(); build(); document.getElementById('gold-modal').classList.add('open'); return false; }
  function closeGold(){ var m=document.getElementById('gold-modal'); if(m) m.classList.remove('open'); }
  window.openGold=openGold; window.closeGold=closeGold;
  window.openVip=openGold;   /* every old VIP Player button now opens GOLD */
  window.closeVip=closeGold;
})();

/* ── Visitor counter (footer) ── */
(function(){
  var C = window.EV_CONFIG || {};
  if (!C.COUNTER_URL) return;
  function run(){
    var box = document.getElementById('ev-counter'), n = document.getElementById('ev-counter-n');
    if (!box || !n) return;
    var key = encodeURIComponent(C.COUNTER_KEY || 'evora'), base = C.COUNTER_URL.replace(/\/$/, '');
    var flag = 'ev_counted_' + key, counted = false;
    try { counted = !!sessionStorage.getItem(flag); } catch(e){}
    /* first page of a session -> /hit (adds 1); later pages -> /get (just reads) */
    fetch(base + (counted ? '/get' : '/hit') + '?key=' + key, { cache: 'no-store' })
      .then(function(r){ return r.json(); })
      .then(function(d){
        var v = d && d.total;
        if (typeof v !== 'number') return;
        n.textContent = v.toLocaleString(); box.hidden = false;
        try { sessionStorage.setItem(flag, '1'); } catch(e){}
      })
      .catch(function(){ /* non-essential; stay hidden */ });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
