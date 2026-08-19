/**
 * Agent Mobile Data Research — local API backend.
 *
 * Runs real GraphQL / web requests against Facebook, Instagram and Google
 * for a given phone number, exactly like the captured browser requests.
 *
 * CRITICAL:
 *  - Session cookies are provided BY THE USER per request (from the browser
 *    settings panel). They are NEVER stored on this server and never logged.
 *  - Tokens (lsd, csrftoken, __dyn, __csr ...) rotate constantly; if a query
 *    fails, re-copy fresh cookies from the browser and retry.
 *  - Use only for your own / authorized research.
 *
 * Run:  node server/research.mjs   (default port 8787)
 */

import http from 'node:http';

const PORT = process.env.PORT || 8787;

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';

const uuid = () => crypto.randomUUID();

function stripPrefix(raw) {
  let s = raw.trim();
  const m = s.match(/^for\s*\(;;\)\s*;/);
  if (m) s = s.slice(m[0].length).trim();
  if (s.startsWith('{') || s.startsWith('[')) return JSON.parse(s);
  // "JSON.parse" style: some endpoints return <body> HTML or empty
  try { return JSON.parse(s); } catch { return { raw: s }; }
}

/* --------------------------- Facebook GraphQL --------------------------- */

const FB_URL = 'https://www.facebook.com/api/graphql/';
const FB_DOC_ID = '28496659306608697'; // CAAFBAccountSearchViewQuery (logged-out account recovery search)

/*
 * Meta validates a lot of opaque session state (__dyn, __csr, __rev, __hsi,
 * cipher_text, lsd ...). The most reliable input is the FULL "data-raw" body
 * captured from your own browser (DevTools → Network → copy as cURL), with
 * only the search_query swapped. We accept that, and fall back to a minimal
 * generated body when it's not provided.
 */
function buildBody(number, rawBody, lsd) {
  if (rawBody) {
    const p = new URLSearchParams(rawBody);
    const varsRaw = p.get('variables');
    if (varsRaw) {
      try {
        const v = JSON.parse(varsRaw);
        v.params = v.params || {};
        v.params.search_query = number;
        p.set('variables', JSON.stringify(v));
      } catch { /* keep variables untouched */ }
    }
    return p;
  }
  const params = {
    cipher_text: '',
    context: 'recover',
    event_request_id: uuid(),
    friend_name: '',
    search_query: number,
    waterfall_id: uuid()
  };
  const body = new URLSearchParams({
    av: '0',
    __aaid: '0',
    __user: '0',
    __a: '1',
    dpr: '1',
    __ccg: 'GOOD',
    __comet_req: '15',
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'CAAFBAccountSearchViewQuery',
    server_timestamps: 'true',
    variables: JSON.stringify({ params }),
    doc_id: FB_DOC_ID,
    fb_api_analytics_tags: JSON.stringify(['qpl_active_flow_ids=516759801'])
  });
  if (lsd) {
    body.set('lsd', lsd);
    body.set('jazoest', '22305');
  }
  return body;
}

function fbHeaders(cookies, lsd) {
  const h = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': UA,
    'x-asbd-id': '359341',
    'x-fb-friendly-name': 'CAAFBAccountSearchViewQuery',
    'x-fb-lsd': lsd || '',
    origin: 'https://www.facebook.com',
    referer: 'https://www.facebook.com/login/identify/?ctx=recover',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin'
  };
  if (cookies) h.cookie = cookies;
  if (!h['x-fb-lsd']) delete h['x-fb-lsd'];
  return h;
}

async function researchFacebook(number, cfg) {
  const cookies = cfg?.cookies || '';
  const lsd = cfg?.lsd || '';
  const debug = !!cfg?.debug;
  const res = await fetch(FB_URL, {
    method: 'POST',
    headers: fbHeaders(cookies, lsd),
    body: buildBody(number, cfg?.dataRaw, lsd),
    redirect: 'follow',
    signal: AbortSignal.timeout(25000)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Facebook responded HTTP ${res.status}`);
  let json;
  try { json = stripPrefix(text); } catch { throw new Error('Facebook returned an unparseable response (tokens expired?). Try fresh cookies.'); }

  if (json.error) {
    throw new Error(`Facebook refused the request: ${json.errorSummary || json.error} (${json.errorDescription || ''}). The session state (lsd/__dyn/__csr) is stale — re-copy fresh cookies + request body from your browser.`);
  }
  if (typeof json === 'object' && json !== null && typeof json.raw === 'string' && json.raw.trim().startsWith('<')) {
    throw new Error('Facebook returned its HTML page instead of results — session/IP mismatch. Re-copy fresh cookies from the same browser/network you will run this from.');
  }

  const found = [];
  const seen = new Set();

  function extractFbPic(obj) {
    if (!obj || typeof obj !== 'object') return '';
    if (obj.profile_picture?.uri) return obj.profile_picture.uri;
    if (obj.profile_pic_url) return obj.profile_pic_url;
    if (obj.profile_picture_url) return obj.profile_picture_url;
    if (obj.profile_photo_url) return obj.profile_photo_url;
    if (obj.photo_url) return obj.photo_url;
    if (obj.avatar_url) return obj.avatar_url;
    if (obj.image_uri) return obj.image_uri;
    if (obj.profiles?.[0]?.photo_url) return obj.profiles[0].photo_url;
    if (obj.profiles?.[0]?.profile_pic_url) return obj.profiles[0].profile_pic_url;
    if (obj.profiles?.[0]?.profile_picture?.uri) return obj.profiles[0].profile_picture.uri;
    if (obj.cuid && /^\d+$/.test(obj.cuid)) return `https://graph.facebook.com/${obj.cuid}/picture?type=normal`;
    if (obj.id && /^\d+$/.test(obj.id)) return `https://graph.facebook.com/${obj.id}/picture?type=normal`;
    return '';
  }

  const search = json?.data?.caa_ar_fb_account_search;
  if (search) {
    const numShown = search.num_results_shown || 0;
    for (const a of search.accounts || []) {
      const name = a.name;
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const pic = extractFbPic(a);
      const subProfiles = (a.profiles || []).map((sub) => ({
        id: sub.cuid || sub.id || '',
        name: sub.name || '',
        picture: extractFbPic(sub),
        type: sub.type || '',
        url: sub.cuid && /^\d+$/.test(sub.cuid) ? `https://www.facebook.com/${sub.cuid}` : ''
      }));

      found.push({
        id: a.cuid || a.id || '',
        name,
        picture: pic,
        displayable: a.allow_display !== false,
        type: a.type || 'Standard Account',
        linkedProfiles: a.linked_profiles_count || subProfiles.length || 0,
        subProfiles,
        emailHint: a.obfuscated_email || a.email_hint || a.email || '',
        phoneHint: a.obfuscated_phone || a.phone_hint || a.phone || '',
        recoveryMethods: a.auth_factors || a.recovery_methods || [],
        url:
          a.cuid && /^\d+$/.test(a.cuid)
            ? `https://www.facebook.com/${a.cuid}`
            : `https://www.facebook.com/search/people/?q=${encodeURIComponent(name)}`
      });
    }
  }
  (function walk(v) {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (typeof v.user_id !== 'undefined' && typeof v.name === 'string') {
      const id = String(v.user_id || v.id || '');
      if (id && !seen.has(id)) {
        seen.add(id);
        const pic = extractFbPic(v);
        found.push({
          id,
          name: v.name,
          username: v.username || v.alternate_name || '',
          picture: pic,
          displayable: v.is_locked !== true,
          url: `https://www.facebook.com/${id}`,
          locked: !!v.is_locked
        });
      }
    }
    for (const k of Object.keys(v)) walk(v[k]);
  })(json);

  const out = { platform: 'facebook', query: number, matches: found, rawKeys: Object.keys(json).slice(0, 20) };
  if (debug) out.debug = json;
  return out;
}

/* -------------------------- Instagram GraphQL --------------------------- */

const IG_URL = 'https://www.instagram.com/api/graphql';
const IG_DOC_ID = '36716895674620546'; // CAAIGAccountSearchViewQuery (logged-out account recovery search)

function buildIgBody(number, rawBody) {
  if (rawBody) {
    const p = new URLSearchParams(rawBody);
    const varsRaw = p.get('variables');
    if (varsRaw) {
      try {
        const v = JSON.parse(varsRaw);
        v.params = v.params || {};
        v.params.search_query = number;
        p.set('variables', JSON.stringify(v));
      } catch { /* keep variables untouched */ }
    }
    return p;
  }
  const params = {
    account_recovery_entry_point: null,
    event_request_id: uuid(),
    is_threads: false,
    next_uri: '',
    search_query: number,
    waterfall_id: uuid()
  };
  return new URLSearchParams({
    av: '0',
    hl: 'en',
    __d: 'www',
    __user: '0',
    __a: '1',
    dpr: '1',
    __ccg: 'MODERATE',
    __comet_req: '7',
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'CAAIGAccountSearchViewQuery',
    server_timestamps: 'true',
    variables: JSON.stringify({ params }),
    doc_id: IG_DOC_ID,
    fb_api_analytics_tags: JSON.stringify(['qpl_active_flow_ids=516759801'])
  });
}

function igHeaders(cookies, lsd) {
  const csrf = (cookies || '').match(/csrftoken=([^;]+)/)?.[1] || '';
  const h = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': UA,
    'x-asbd-id': '359341',
    'x-csrftoken': csrf,
    'x-ig-app-id': '936619743392459',
    'x-ig-max-touch-points': '0',
    'x-fb-friendly-name': 'CAAIGAccountSearchViewQuery',
    'x-fb-lsd': lsd || '',
    origin: 'https://www.instagram.com',
    referer: 'https://www.instagram.com/accounts/password/reset/?hl=en',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin'
  };
  if (cookies) h.cookie = cookies;
  if (!h['x-fb-lsd']) delete h['x-fb-lsd'];
  return h;
}

async function researchInstagram(number, cfg) {
  const cookies = cfg?.cookies || '';
  const lsd = cfg?.lsd || '';
  const debug = !!cfg?.debug;
  const res = await fetch(IG_URL, {
    method: 'POST',
    headers: igHeaders(cookies, lsd),
    body: buildIgBody(number, cfg?.dataRaw),
    redirect: 'follow',
    signal: AbortSignal.timeout(25000)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Instagram responded HTTP ${res.status}`);
  let json;
  try { json = stripPrefix(text); } catch { throw new Error('Instagram returned an unparseable response (tokens expired?). Try fresh cookies.'); }

  if (json.error) {
    throw new Error(`Instagram refused the request: ${json.errorSummary || json.error} (${json.errorDescription || ''}). The session state is stale — re-copy fresh cookies + request body from your browser.`);
  }
  if (typeof json === 'object' && json !== null && typeof json.raw === 'string' && json.raw.trim().startsWith('<')) {
    throw new Error('Instagram returned its HTML page instead of results — session/IP mismatch (checkpoint). Re-copy fresh cookies from the same browser/network you will run this from.');
  }

  const found = [];
  const seen = new Set();
  const search = json?.data?.caa_ar_ig_account_search;
  if (search) {
    for (const a of search.accounts || []) {
      for (const p of a.profiles || [a]) {
        if (!p.username || seen.has(p.username)) continue;
        seen.add(p.username);
        found.push({
          id: p.pk !== undefined ? String(p.pk) : p.username,
          name: p.full_name || p.name || p.username,
          username: p.username,
          picture: p.profile_pic_url || p.profile_pic_url_hd || p.photo_url || '',
          verified: !!p.is_verified,
          displayable: p.allow_display !== false,
          url: `https://www.instagram.com/${p.username}`
        });
      }
    }
  }
  (function walk(v) {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (typeof v.pk !== 'undefined' && typeof v.username === 'string') {
      const id = String(v.pk);
      if (id && !seen.has(id)) {
        seen.add(id);
        found.push({
          id,
          name: v.full_name || v.name || '',
          username: v.username,
          picture: v.profile_pic_url || v.profile_pic_url_hd || '',
          url: `https://www.instagram.com/${v.username}`,
          verified: !!v.is_verified,
          locked: !!v.is_locked
        });
      }
    }
    for (const k of Object.keys(v)) walk(v[k]);
  })(json);

  const out = { platform: 'instagram', query: number, matches: found, rawKeys: Object.keys(json).slice(0, 20) };
  if (debug) out.debug = json;
  return out;
}

/* ------------------------------- Google -------------------------------- */

function stripTags(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&plus;/g, '+')
    .replace(/\s+/g, ' ')
    .trim();
}

async function googleSearch(number, cookies) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(number)}&oq=${encodeURIComponent(number)}&num=15&ie=UTF-8`;
  const headers = {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.9',
    'user-agent': UA,
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'upgrade-insecure-requests': '1'
  };
  if (cookies) headers.cookie = cookies;
  const res = await fetch(url, { headers, redirect: 'follow', signal: AbortSignal.timeout(20000) });
  const html = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const results = [];
  const seen = new Set();
  const blocks = html.split('<div class="MjjYud">').slice(1);
  for (const b of blocks) {
    let u = '';
    const am = b.match(/<a href="(\/url\?q=[^"&]+|[a-z]+:\/\/[^"]+)"[^>]*>/);
    if (am) {
      u = am[1];
      if (u.startsWith('/url?q=')) {
        try { u = decodeURIComponent(u.slice(7)); } catch { /* keep */ }
      }
    }
    const tm = b.match(/<h3[^>]*>(.*?)<\/h3>/s);
    const sm =
      b.match(/<div class="VwiC3b[^"]*"[^>]*>(.*?)<\/div>/s) ||
      b.match(/<span class="VwiC3b[^"]*"[^>]*>(.*?)<\/span>/s);
    const title = stripTags(tm?.[1] || '');
    const snippet = stripTags(sm?.[1] || '');
    if (u && (title || snippet)) {
      const key = u + title;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ title, url: u, snippet });
      }
    }
  }
  return results;
}

/* --------------------------- DuckDuckGo Lite --------------------------- */
/* Server-rendered fallback engine — works without any session cookies.    */

async function duckDuckGoSearch(number) {
  const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(number)}`;
  const res = await fetch(url, {
    headers: { accept: 'text/html', 'accept-language': 'en-US,en;q=0.9', 'user-agent': UA },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000)
  });
  const html = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const results = [];
  const seen = new Set();
  const linkRe = /<a[^>]*class=['"]result-link['"][^>]*href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/g;
  let m;
  while ((m = linkRe.exec(html))) {
    let u = m[1];
    if (u.startsWith('//')) u = 'https:' + u;
    if (u.includes('/l/?uddg=')) {
      try { u = decodeURIComponent(u.split('uddg=')[1].split('&')[0]); } catch { /* keep */ }
    }
    const title = stripTags(m[2]);
    if (u && title && !seen.has(u)) {
      seen.add(u);
      results.push({ title, url: u, snippet: '' });
    }
  }
  const snipRe = /<td class=['"]result-snippet['"][^>]*>(.*?)<\/td>/gs;
  let si = 0;
  while ((m = snipRe.exec(html)) && si < results.length) {
    results[si++].snippet = stripTags(m[1]);
  }
  return results.slice(0, 15);
}

async function researchWeb(number, cookies) {
  let engine = 'google';
  let results = [];
  try {
    results = await googleSearch(number, cookies);
  } catch { engine = 'google-error'; }
  if (results.length === 0) {
    try {
      results = await duckDuckGoSearch(number);
      engine = 'duckduckgo-lite';
    } catch (e) {
      if (engine === 'google-error') throw e;
      engine = 'duckduckgo-error';
    }
  }
  return { platform: 'web', engine, query: number, results };
}

/* ------------------------------- HTTP API ------------------------------- */

function send(res, code, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'cache-control': 'no-store'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { reject(new Error('Invalid JSON body')); } });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type'
    });
    return res.end();
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    return send(res, 200, { ok: true, service: 'agent-mobile-data-research', time: new Date().toISOString() });
  }

  if (req.method === 'POST' && req.url === '/api/research') {
    try {
      const body = await readBody(req);
      const number = String(body.number || '').trim();
      const platforms = Array.isArray(body.platforms) ? body.platforms : ['fb', 'ig', 'google'];
      if (!number) return send(res, 400, { error: 'Missing number' });

      const out = { number, checkedAt: new Date().toISOString(), platforms: {} };
      const errors = [];
      const tasks = [];
      const dbg = { ...(body.fb || {}), debug: !!body.debug };
      const dbgIg = { ...(body.ig || {}), debug: !!body.debug };
      if (platforms.includes('fb'))
        tasks.push(researchFacebook(number, dbg).then((r) => { out.platforms.fb = r; }).catch((e) => errors.push({ platform: 'fb', error: e.message })));
      if (platforms.includes('ig'))
        tasks.push(researchInstagram(number, dbgIg).then((r) => { out.platforms.ig = r; }).catch((e) => errors.push({ platform: 'ig', error: e.message })));
      if (platforms.includes('google'))
        tasks.push(researchWeb(number, body.google?.cookies || '').then((r) => { out.platforms.google = r; }).catch((e) => errors.push({ platform: 'google', error: e.message })));

      await Promise.allSettled(tasks);
      if (errors.length) out.errors = errors;
      return send(res, 200, out);
    } catch (e) {
      return send(res, 500, { error: e.message });
    }
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    try {
      const body = await readBody(req);
      const messages = body.messages || [];
      const apiKey = body.apiKey || process.env.OPENAI_API_KEY;
      const model = body.model || 'gpt-4o-mini';
      const systemPrompt = body.systemPrompt || 'You are the official Europass Customer Support AI Assistant. You help users create ATS-compliant European CVs, write Cover Letters, explain CEFR language levels (A1-C2), EQF qualifications, extract company details on Google Maps, and conduct mobile data research.';

      if (!apiKey) {
        return send(res, 400, { error: 'Missing OpenAI API Key. Please provide an apiKey in the request or set OPENAI_API_KEY environment variable.' });
      }

      const openaiPayload = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        stream: !!body.stream
      };

      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(openaiPayload)
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        return send(res, aiRes.status, { error: `OpenAI API error: ${errText}` });
      }

      if (body.stream) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        });

        const reader = aiRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        return res.end();
      } else {
        const json = await aiRes.json();
        return send(res, 200, json);
      }
    } catch (e) {
      return send(res, 500, { error: e.message });
    }
  }

  return send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`[agent-mobile-data-research] API listening on http://localhost:${PORT}`);
  console.log(`  POST /api/research   { number, platforms:["fb","ig","google"], fb:{cookies,lsd,dataRaw?}, ig:{cookies,lsd,dataRaw?}, google:{cookies?}, debug? }`);
  console.log(`  GET  /api/health`);
  console.log(`  Web engine falls back to DuckDuckGo Lite when Google needs JS.`);
  console.log(`  dataRaw = the full "data-raw" body captured in your browser (Network tab → copy as cURL).`);
});
