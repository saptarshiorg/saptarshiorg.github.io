/* EVORA - endpoints & settings. Edit URLs here. Loaded first (head). */
window.EV_CONFIG = {
  /* Google Sheets CMS */
  SHEET_ID: '1UcPVLGxSTJmAdtfPHsA_f5VCtbABwVdwef-va512HQU',
  SHEET_URL: function(id, name){ return 'https://docs.google.com/spreadsheets/d/' + id + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(name); },

  /* Live match feeds */
  FANCODE_CNPTV: 'https://raw.githubusercontent.com/kajju027/Fancode-Events-Json/main/fan.json',
  FANCODE_WORLD: 'https://raw.githubusercontent.com/kajju027/Fancode-Events-Json/main/fancode.json',
  FANCODE_JSON:  'https://raw.githubusercontent.com/kajju027/Fancode-Events-Json/refs/heads/main/fancode.json',
  SONYLIV_API:   'https://raw.githubusercontent.com/kajju027/SonyLiv-Events-Json/refs/heads/main/sonyliv.json',
  WILLOW_APIS:   ['https://sonujson-v5.pages.dev/Data/willow.json'],   /* add backup feed URLs here */
  WILLOW_PROXIES:['', 'https://api.allorigins.win/raw?url=', 'https://corsproxy.io/?'],

  /* Movies / TV */
  VIDAPI_LIST:  'https://vidapi.ru',
  VIDAPI_EMBED: 'https://vaplayer.ru',
  CORS_PROXY:   'https://api.allorigins.win/raw?url=',

  /* Live TV playlist */
  IPTV_PLAYLIST: 'https://iptv-org.github.io/iptv/index.country.m3u',

  /* Visitor counter (Hit-Get-Counter on Vercel). /hit once per browser session, /get afterwards; shows total visits. */
  COUNTER_URL: 'https://sayancounter-two.vercel.app/api',   /* base; script uses /hit (adds 1) and /get (read only) */
  COUNTER_KEY: 'evora',          /* change to use a different counter */

  /* Geo check */
  IP_API: 'https://ipwho.is/'
};
const SHEET_ID = EV_CONFIG.SHEET_ID;   /* global used by api.js / script.js */
