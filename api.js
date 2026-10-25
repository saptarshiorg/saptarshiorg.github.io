/* EVORA - data layer (Google Sheets CMS loader). Needs config.js loaded first. */
// ── CSV helper ──────────────────────────────────────────────
function parseCSV(text) {
  const rows = [];
  let cur = '', inQ = false, row = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], nx = text[i+1];
    if (inQ) {
      if (ch === '"' && nx === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ',') { row.push(cur.trim()); cur = ''; }
      else if (ch === '\r' && nx === '\n') { row.push(cur.trim()); rows.push(row); row = []; cur = ''; i++; }
      else if (ch === '\n' || ch === '\r') { row.push(cur.trim()); rows.push(row); row = []; cur = ''; }
      else cur += ch;
    }
  }
  if (cur || row.length) { row.push(cur.trim()); rows.push(row); }
  return rows.filter(r => r.some(c => c));
}

function toObj(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.toLowerCase().replace(/[^a-z0-9_]/g,'_').replace(/__+/g,'_').replace(/^_|_$/g,''));
  return rows.slice(1).map(r => {
    const o = {};
    headers.forEach((h, i) => o[h] = (r[i] || '').trim());
    return o;
  });
}

const CMS_CACHE_TTL_MS = 60000; // reuse a sheet's data for 60s within the same tab session

async function fetchSheet(name) {
  if (!SHEET_ID || SHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    console.warn('⚠️  SHEET_ID not set — using placeholder data');
    return null;
  }

  const cacheKey = `cms_cache_${SHEET_ID}_${name}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { t, data } = JSON.parse(cached);
      if (Date.now() - t < CMS_CACHE_TTL_MS) return data;
    }
  } catch (e) { /* ignore cache read errors, fall through to fetch */ }

  const url = `${EV_CONFIG.SHEET_URL(SHEET_ID,name)}`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    const text = await r.text();
    const rows = parseCSV(text);
    const data = toObj(rows);
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), data }));
    } catch (e) { /* storage full/unavailable — non-fatal, skip caching */ }
    return data;
  } catch(e) {
    console.warn(`Sheet "${name}" failed:`, e);
    return null;
  }
}

