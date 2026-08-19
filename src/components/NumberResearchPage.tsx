import React, { useRef, useState, useEffect } from 'react';
import {
  Search,
  Phone,
  Globe,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Landmark,
  FileSearch,
  Link2,
  User,
  Settings,
  Server,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield,
  Layers,
  X
} from 'lucide-react';
import { detectCountry, normalizePhoneDigits, type CountryInfo } from '../data/countryCodes';

interface LinkItem {
  label: string;
  url: string;
  hint?: string;
}

interface LinkGroup {
  category: string;
  icon: string;
  items: LinkItem[];
}

interface ResearchResult {
  raw: string;
  e164: string;
  national: string;
  formatted: string;
  country?: CountryInfo;
  numberType: string;
  carrierHint: string;
  valid: boolean;
  validMsg: string;
  groups: LinkGroup[];
}

interface LiveMatch {
  id?: string;
  name: string;
  username?: string;
  picture?: string;
  url: string;
  displayable?: boolean;
  type?: string;
  verified?: boolean;
  locked?: boolean;
  linkedProfiles?: number;
  subProfiles?: { id: string; name: string; picture?: string; type?: string; url?: string }[];
  emailHint?: string;
  phoneHint?: string;
  recoveryMethods?: string[];
}

interface WebResult {
  title: string;
  url: string;
  snippet: string;
}

interface LivePlatform {
  platform: string;
  engine?: string;
  query?: string;
  matches?: LiveMatch[];
  results?: WebResult[];
  error?: string;
}

interface LivePayload {
  checkedAt?: string;
  platforms: Record<string, LivePlatform>;
  errors: { platform: string; error: string }[];
}

interface ApiSettings {
  url: string;
  fbCookies: string;
  fbLsd: string;
  fbDataRaw: string;
  igCookies: string;
  igLsd: string;
  igDataRaw: string;
  googleCookies: string;
}

export interface NumberResearchPageProps {
  initialNumber?: string;
  autoRun?: boolean;
}

const LS_KEY = 'agent-mobile-research-settings';

function loadSettings(): ApiSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...defaultSettings(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings();
}

function defaultSettings(): ApiSettings {
  return {
    url: 'http://localhost:8787',
    fbCookies: '',
    fbLsd: '',
    fbDataRaw: '',
    igCookies: '',
    igLsd: '',
    igDataRaw: '',
    googleCookies: ''
  };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function groupDigits(national: string): string {
  if (national.length === 10) return `${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
  if (national.length === 9) return `${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
  return national.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

function detectNumberType(country: CountryInfo | undefined, national: string): { type: string; carrier: string } {
  if (country && country.mob) {
    for (const p of country.mob) {
      if (national.startsWith(p)) {
        const carrier = country.carrier?.[p.slice(0, 2)] || country.carrier?.[p.slice(0, 1)] || '';
        return { type: '📱 Mobile', carrier: carrier ? `Likely carrier: ${carrier}` : 'Mobile network number' };
      }
    }
    return { type: '🏢 Landline / Fixed-line', carrier: '' };
  }
  return { type: '📱 Mobile (likely)', carrier: '' };
}

function buildLinks(raw: string, e164: string, national: string, country?: CountryInfo): LinkGroup[] {
  const q = encodeURIComponent(`"${raw}"`);
  const qd = encodeURIComponent(`"${e164}"`);
  const quoted = `"${raw}"`;
  const tcCountry = country?.alpha2 || 'in';

  return [
    {
      category: '🔍 Search Engines & Google Public Index',
      icon: '🌐',
      items: [
        { label: 'Google Search (exact number)', url: `https://www.google.com/search?q=${qd}`, hint: 'Search for any public web pages, profiles or records mentioning this number' },
        { label: 'Google (with + prefix)', url: `https://www.google.com/search?q=${q}`, hint: 'Search the number in international format' },
        { label: 'Google Maps', url: `https://www.google.com/maps/search/${encodeURIComponent(raw)}`, hint: 'Businesses / locations listing this phone number' },
        { label: 'DuckDuckGo', url: `https://duckduckgo.com/?q=${qd}`, hint: 'Privacy-first engine, good for finding forum posts' },
        { label: 'Bing', url: `https://www.bing.com/search?q=${qd}`, hint: 'Microsoft index' },
        { label: 'Yandex', url: `https://yandex.com/search/?text=${qd}`, hint: 'Strong index for Asia / Russia region' },
        { label: 'Brave Search', url: `https://search.brave.com/search?q=${qd}`, hint: 'Independent index' },
        { label: 'Internet Archive', url: `https://archive.org/search?query=${encodeURIComponent(e164)}`, hint: 'Archived public web pages mentioning the number' }
      ]
    },
    {
      category: '📘 Social Media Profiles & Posts',
      icon: '👥',
      items: [
        { label: 'Facebook', url: `https://www.facebook.com/search/top?q=${encodeURIComponent(e164)}`, hint: 'Public profiles & posts' },
        { label: 'Instagram', url: `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(e164)}`, hint: 'Public accounts & tags' },
        { label: 'X / Twitter', url: `https://twitter.com/search?q=${qd}&f=live`, hint: 'Public tweets mentioning the number' },
        { label: 'LinkedIn', url: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(e164)}`, hint: 'Public professional profiles' },
        { label: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(e164)}`, hint: 'Videos & channel contact pages' },
        { label: 'TikTok', url: `https://www.tiktok.com/search?q=${encodeURIComponent(e164)}`, hint: 'Public profiles & content' },
        { label: 'Reddit', url: `https://www.reddit.com/search/?q=${qd}`, hint: 'Forum discussions' },
        { label: 'Pinterest', url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(e164)}`, hint: 'Public pins & business cards' },
        { label: 'GitHub', url: `https://github.com/search?q=${encodeURIComponent(e164)}&type=code`, hint: 'Public code repositories & data leaks' }
      ]
    },
    {
      category: '💬 Messaging & Contact Platforms',
      icon: '✉️',
      items: [
        { label: 'WhatsApp Chat (open direct)', url: `https://wa.me/${e164}`, hint: 'Opens a chat with this number if it has WhatsApp' },
        { label: 'Viber', url: `viber://chat?number=${e164}`, hint: 'Desktop app only (viber:// link)' },
        { label: 'Telegram Search', url: `https://www.google.com/search?q=${encodeURIComponent(quoted + ' telegram')}`, hint: 'Find public Telegram accounts tied to the number' },
        { label: 'Signal Lookup', url: `https://www.google.com/search?q=${encodeURIComponent(quoted + ' signal')}`, hint: 'Find public Signal mentions' }
      ]
    },
    {
      category: '🏛️ Public Directories & Reverse Phone Lookup',
      icon: '📖',
      items: [
        { label: 'Truecaller', url: `https://www.truecaller.com/search/${tcCountry}/${national}`, hint: 'Largest caller-ID community database' },
        { label: 'SpyDialer', url: `https://www.spydialer.com/default.aspx?phonenum=${e164}`, hint: 'Reverse lookup + voicemail search' },
        { label: 'Numlookup', url: `https://www.numlookup.com/${e164}`, hint: 'Free US reverse lookup' },
        { label: 'Whitepages', url: `https://www.whitepages.com/phone/${e164}`, hint: 'Phone directory (US-focused)' },
        { label: '411.com', url: `https://www.411.com/phone-search/${e164}`, hint: 'Directory assistance records' },
        { label: 'ZabaSearch', url: `https://www.zabasearch.com/people/phone/${e164}`, hint: 'People search directory' },
        { label: 'AnyWho', url: `https://www.anywho.com/phone/${e164}`, hint: 'Free directory lookup' },
        { label: 'Reverse Phone Check', url: `https://www.reverse-phone-check.com/search/${e164}`, hint: 'Spam & robocall records' },
        { label: 'BeenVerified', url: `https://www.beenverified.com/phone/${e164}`, hint: 'Background report preview (paid full report)' },
        { label: 'WhoCallsMe', url: `https://www.google.com/search?q=${encodeURIComponent(quoted + ' who-calls-me')}`, hint: 'Community-reported call records' }
      ]
    }
  ];
}

function SettingsSection({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '0.6rem', background: '#f8fafc' }}>
      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#334155', padding: '0.5rem 0.7rem', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', borderRadius: '8px 8px 0 0' }}>
        {title}
      </div>
      <div style={{ padding: '0.6rem 0.7rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {children}
        <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.45 }}>{hint}</div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.45rem 0.6rem',
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  border: '1px solid #cbd5e1',
  borderRadius: '5px',
  background: '#ffffff',
  boxSizing: 'border-box'
};

export const NumberResearchPage: React.FC<NumberResearchPageProps> = ({ initialNumber, autoRun }) => {
  const [phoneInput, setPhoneInput] = useState<string>(initialNumber || '+9779800000000');
  const [stage, setStage] = useState<'idle' | 'researching' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const logBoxRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<ApiSettings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [apiChecked, setApiChecked] = useState(false);
  const [live, setLive] = useState<LivePayload | null>(null);
  const [inspectProfile, setInspectProfile] = useState<{ match: LiveMatch; platform: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveSettings = (patch: Partial<ApiSettings>) => {
    setSettings((s) => {
      const next = { ...s, ...patch };
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const checkApi = async () => {
    setApiChecked(true);
    setApiOnline(null);
    try {
      const res = await fetch(`${settings.url.replace(/\/$/, '')}/api/health`, { signal: AbortSignal.timeout(6000) });
      setApiOnline(res.ok);
    } catch {
      setApiOnline(false);
    }
  };

  const runResearch = async (input: string) => {
    setStage('researching');
    setLog([]);
    setResult(null);
    setLive(null);
    setErrorMsg('');

    const push = async (msg: string) => {
      setLog((l) => [...l, msg]);
      if (logBoxRef.current) {
        requestAnimationFrame(() => {
          if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
        });
      }
      await delay(250 + Math.random() * 300);
    };

    const normalizedInput = normalizePhoneDigits(input.trim());
    const raw = normalizedInput.replace(/[^+\d]/g, '');
    if (!raw || raw === '+') {
      setErrorMsg('Please enter a valid phone number, e.g. +9779800000000');
      setStage('error');
      return;
    }

    await push(`📞 Received search request for number: ${input.trim()}`);
    await push(`⚙️ Normalizing number to E.164 standard & validating country prefix...`);
    const parsed = detectCountry(normalizedInput);
    if (!parsed?.country) {
      await push(`⚠️ Country calling code could not be matched against the public registry`);
      setErrorMsg(`Could not identify a valid country code in "${input.trim()}". Example format: +9779800000000`);
      setStage('error');
      return;
    }

    const { country, national } = parsed;
    const e164 = `+${country.cc}${national}`;
    await push(`✅ E.164 format: ${e164}`);
    await push(`🌍 Country identified: ${country.flag} ${country.name} (calling code +${country.cc})`);

    const { type, carrier } = detectNumberType(country, national);
    await push(`${type} — national number length ${national.length} digits${country.len ? ` (standard for ${country.name}: ~${country.len})` : ''}`);
    if (carrier) await push(`🏭 ${carrier}`);

    const valid = country.len ? Math.abs(national.length - country.len) <= 2 : national.length >= 4;
    await push(valid
      ? `✅ Structure validated against ${country.name} national numbering plan`
      : `⚠️ Length differs from typical ${country.name} plan (${country.len} digits) — verify manually`);

    const groups = buildLinks(raw, e164, national, country);
    const totalLinks = groups.reduce((n, g) => n + g.items.length, 0);

    // ---- Live API phase ----
    const apiBase = settings.url.replace(/\/$/, '');
    let liveOk = false;
    let apiErr = '';
    try {
      const health = await fetch(`${apiBase}/api/health`, { signal: AbortSignal.timeout(6000) });
      liveOk = health.ok;
    } catch { liveOk = false; }
    if (!liveOk) {
      await push(`⚠️ Local research API (${apiBase}) not reachable — live queries skipped`);
      await push(`💡 Run the backend first: npm run server  (or check the API URL in ⚙️ Settings)`);
      setApiOnline(false);
    } else {
      setApiOnline(true);
      await push(`🟢 Local research API online (${apiBase})`);
      const hasFb = !!settings.fbCookies || !!settings.fbDataRaw;
      const hasIg = !!settings.igCookies || !!settings.igDataRaw;
      if (!hasFb && !hasIg) await push(`ℹ️ No Facebook/Instagram session configured — use the ⚙️ Settings panel to paste cookies for real profile lookups`);
      const platforms = ['fb', 'ig', 'google'];
      await push(`🔎 Querying Facebook account-search API...`);
      await push(`📸 Querying Instagram account-search API...`);
      await push(`🌐 Querying web search (Google with session → DuckDuckGo Lite fallback)...`);
      try {
        const body = {
          number: e164,
          platforms,
          fb: { cookies: settings.fbCookies, lsd: settings.fbLsd, dataRaw: settings.fbDataRaw || undefined },
          ig: { cookies: settings.igCookies, lsd: settings.igLsd, dataRaw: settings.igDataRaw || undefined },
          google: { cookies: settings.googleCookies || undefined }
        };
        const res = await fetch(`${apiBase}/api/research`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(75000)
        });
        if (!res.ok) throw new Error(`API responded HTTP ${res.status}`);
        const payload = (await res.json()) as LivePayload;
        setLive(payload);
        const platNames: Record<string, string> = { fb: 'Facebook', ig: 'Instagram', google: 'Web' };
        for (const [k, p] of Object.entries(payload.platforms)) {
          if (p.error) {
            await push(`❌ ${platNames[k]}: ${p.error.slice(0, 160)}`);
          } else if (p.matches) {
            const shown = p.matches.filter((m) => m.displayable !== false).length;
            await push(`✅ ${platNames[k]}: ${p.matches.length} account match(es)${p.matches.length > shown ? ` (${p.matches.length - shown} privacy-hidden)` : ''}`);
          } else if (p.results) {
            await push(`✅ ${platNames[k]} (${p.engine || 'engine'}): ${p.results.length} public record(s)${p.results.length === 0 ? ' — number not publicly indexed' : ''}`);
          }
        }
        for (const e of payload.errors || []) await push(`❌ ${platNames[e.platform] || e.platform}: ${e.error.slice(0, 160)}`);
      } catch (e) {
        apiErr = e instanceof Error ? e.message : String(e);
        await push(`❌ Live API request failed: ${apiErr.slice(0, 160)}`);
      }
    }

    await push(`✅ Background research complete — ${totalLinks} public record sources compiled for ${raw}`);
    if (apiErr) setErrorMsg(`Live API request failed: ${apiErr}`);

    setResult({
      raw,
      e164,
      national,
      formatted: `+${country.cc} ${groupDigits(national)}`,
      country,
      numberType: type,
      carrierHint: carrier,
      valid,
      validMsg: valid
        ? `Number structure matches ${country.name} national numbering plan`
        : `Warning: unusual length for ${country.name} — could be an old, premium or fake number`,
      groups
    });
    setStage('done');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runResearch(phoneInput);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const c = result.country;
    const lines = [
      'PHONE NUMBER BACKGROUND RESEARCH REPORT',
      '========================================',
      `Searched number : ${result.raw}`,
      `E.164 format    : ${result.e164}`,
      `National format : ${result.national}`,
      `Display format  : ${result.formatted}`,
      `Country         : ${c ? `${c.flag} ${c.name} (+${c.cc})` : 'Unknown'}`,
      `Number type     : ${result.numberType}`,
      result.carrierHint ? `Carrier hint    : ${result.carrierHint}` : '',
      `Validity        : ${result.valid ? 'Valid structure' : 'Suspicious / unusual length'}`,
      '',
      'LIVE API RESULTS',
      '===============',
      ...(live ? Object.entries(live.platforms).flatMap(([k, p]) => {
        if (p.error) return [`${k.toUpperCase()}: ERROR — ${p.error}`];
        if (p.matches?.length) {
          return [
            `${k.toUpperCase()} (account search): ${p.matches.length} match(es)`,
            ...p.matches.map((m) => `  - ${m.name}${m.username ? ` (@${m.username})` : ''}${m.displayable === false ? ' [privacy-hidden]' : ''}: ${m.url}`)
          ];
        }
        if (p.results) {
          return [
            `${k.toUpperCase()} (${p.engine}): ${p.results.length} record(s)`,
            ...p.results.map((r) => `  - ${r.title}: ${r.url}`)
          ];
        }
        return [`${k.toUpperCase()}: no data`];
      }) : ['(live API not queried)']),
      '',
      'PUBLIC RECORD SOURCES',
      '=====================',
      ...result.groups.flatMap((g) => [
        '',
        g.category,
        ...g.items.map((i) => `  - ${i.label}: ${i.url}`)
      ]),
      '',
      'Generated by Europass Agent Mobile Data Research Tool',
      `Date: ${new Date().toLocaleString()}`
    ].filter((l) => l !== '');
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Phone_Research_${result.e164.replace(/\D/g, '')}.txt`;
  };

  useEffect(() => {
    checkApi();
  }, [settings.url]);

  useEffect(() => {
    if (initialNumber && initialNumber.trim()) {
      setPhoneInput(initialNumber.trim());
      if (autoRun) {
        runResearch(initialNumber.trim());
      }
    }
  }, [initialNumber, autoRun]);

  const cellStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  };

  const renderLiveMatches = (p: LivePlatform) => {
    const matches = p.matches || [];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {matches.map((m, i) => {
          const dossierText = `=== TARGET PROFILE FORENSIC REPORT ===
Platform: ${p.platform.toUpperCase()}
Profile Name: ${m.name}
Meta UID / CUID: ${m.id || 'N/A'}
Classification: ${m.type || 'Standard Account'}
Privacy Setting: ${m.displayable === false ? 'Privacy-Protected' : 'Public Profile'}
Linked Search Number: ${phoneInput}
Linked Profiles Count: ${m.linkedProfiles || (m.subProfiles ? m.subProfiles.length : 0)}
Sub-Profiles: ${m.subProfiles?.map((s) => `${s.name} (${s.id})`).join('; ') || 'None'}
Report Timestamp: ${new Date().toISOString()}`;

          return (
            <div
              key={i}
              style={{
                border: '1.5px solid #bfdbfe',
                borderRadius: '10px',
                padding: '0.85rem',
                background: m.displayable === false ? '#fffdf7' : '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {/* Profile Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                {m.picture ? (
                  <img
                    src={m.picture}
                    alt={m.name || 'Profile'}
                    width={46}
                    height={46}
                    style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : null}

                <div
                  className="avatar-fallback"
                  style={{
                    display: m.picture ? 'none' : 'flex',
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: p.platform === 'facebook' ? 'linear-gradient(135deg, #1877f2, #0d5cb6)' : 'linear-gradient(135deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    color: '#ffffff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  {(m.name || '?').replace(/[^a-zA-Z0-9]/g, '').slice(0, 1).toUpperCase() || '👤'}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <span>{m.name}</span>
                    {m.verified && <span title="Verified Account" style={{ color: '#2563eb', fontWeight: 900 }}>✓</span>}
                    {m.displayable === false ? (
                      <span style={{ fontSize: '0.625rem', fontWeight: 800, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.1rem 0.45rem', borderRadius: '999px' }}>
                        PRIVACY-PROTECTED
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.625rem', fontWeight: 800, background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '0.1rem 0.45rem', borderRadius: '999px' }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.15rem' }}>
                    {p.platform === 'facebook' ? '📘 Facebook Profile' : '📸 Instagram Profile'} {m.username ? `· @${m.username}` : ''}
                  </div>
                </div>
              </div>

              {/* In-App Dossier Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.45rem', background: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '7px', border: '1px solid #e2e8f0', marginBottom: '0.65rem', fontSize: '0.78rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Account UID / ID</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{m.id || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Classification</span>
                  <span style={{ fontWeight: 700, color: '#0369a1' }}>{m.type || 'Standard Account'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Bound Target Number</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#15803d' }}>{phoneInput}</span>
                </div>
                {m.linkedProfiles !== undefined && m.linkedProfiles > 0 && (
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Linked Sub-Profiles</span>
                    <span style={{ fontWeight: 700, color: '#6366f1' }}>{m.linkedProfiles} Connected</span>
                  </div>
                )}
              </div>

              {/* Linked Sub-Profiles In-App Display */}
              {m.subProfiles && m.subProfiles.length > 0 && (
                <div style={{ marginBottom: '0.65rem', padding: '0.5rem 0.65rem', background: '#eef2ff', borderRadius: '6px', border: '1px solid #c7d2fe' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4338ca', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Layers size={13} /> Connected Sub-Profiles ({m.subProfiles.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {m.subProfiles.map((sub, sIdx) => (
                      <div key={sIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ffffff', border: '1px solid #c7d2fe', padding: '0.25rem 0.5rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {sub.picture ? <img src={sub.picture} alt="" width={18} height={18} style={{ borderRadius: '50%' }} /> : <span>👤</span>}
                        <span>{sub.name}</span>
                        {sub.id && <span style={{ color: '#64748b', fontSize: '0.65rem', fontFamily: 'monospace' }}>({sub.id.slice(0, 8)}…)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct In-App Actions */}
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => copyText(dossierText, `profile-${i}`)}
                  style={{
                    background: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {copiedId === `profile-${i}` ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  {copiedId === `profile-${i}` ? 'Copied Dossier' : 'Copy Full Profile Data'}
                </button>

                <button
                  type="button"
                  onClick={() => setInspectProfile({ match: m, platform: p.platform })}
                  style={{
                    background: 'linear-gradient(90deg, #1e40af, #0e47a1)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Shield size={13} /> Full Profile Dossier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWebResults = (p: LivePlatform) => {
    const results = p.results || [];
    if (results.length === 0) {
      return (
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', padding: '0.25rem 0.1rem' }}>
          No public web records found for this number — it is not publicly indexed.
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {results.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '0.5rem 0.7rem', background: '#ffffff' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0e47a1' }}>{r.title}</div>
            <div style={{ fontSize: '0.68rem', color: '#16a34a', fontFamily: 'monospace', margin: '0.15rem 0' }}>{r.url}</div>
            {r.snippet && <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>{r.snippet}</div>}
          </a>
        ))}
      </div>
    );
  };

  const livePlatformCards = (): React.ReactNode => {
    if (!live) return null;
    const entries = Object.entries(live.platforms);
    if (entries.length === 0) return null;
    const icon: Record<string, string> = { fb: '📘', ig: '📸', google: '🌐' };
    return (
      <>
        <div style={{ fontWeight: 800, color: '#0e47a1', fontSize: '0.9rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Server size={15} /> Live API Results
          <span style={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748b' }}>
            {live.checkedAt ? `· ${new Date(live.checkedAt).toLocaleTimeString()}` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.25rem' }}>
          {entries.map(([k, p]) => {
            const body = p.error ? (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '6px', padding: '0.5rem 0.7rem', fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.45 }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} /> {p.error}
              </div>
            ) : p.matches && p.matches.length > 0 ? (
              renderLiveMatches(p)
            ) : p.matches && p.matches.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>No accounts linked to this number on this platform.</div>
            ) : p.results ? (
              renderWebResults(p)
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>No data returned.</div>
            );
            return (
              <div key={k} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#f1f5f9', padding: '0.45rem 0.8rem', fontSize: '0.82rem', fontWeight: 800, color: '#334155', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {icon[k] || '🔍'} {k.toUpperCase()}
                  {p.engine && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', background: '#e2e8f0', borderRadius: '999px', padding: '0.1rem 0.45rem' }}>{p.engine}</span>}
                  {p.matches && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', background: '#6366f1', borderRadius: '999px', padding: '0.1rem 0.45rem' }}>{p.matches.length} match{p.matches.length === 1 ? '' : 'es'}</span>}
                  {p.results && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', background: '#0e47a1', borderRadius: '999px', padding: '0.1rem 0.45rem' }}>{p.results.length} record{p.results.length === 1 ? '' : 's'}</span>}
                </div>
                <div style={{ padding: '0.6rem' }}>{body}</div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0e47a1 0%, #1e293b 100%)', color: '#ffffff', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(14, 71, 161, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <FileSearch size={28} color="#60a5fa" />
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Agent Mobile Data Research — Phone Number Background Search</h1>
        </div>
        <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9, maxWidth: '850px', lineHeight: 1.5 }}>
          Enter any mobile number (e.g. +9779800000000). The research engine analyzes the number structure, identifies the country & carrier, runs real account-search queries against Facebook & Instagram (via the local research API), scans the web for public records, and compiles direct links and details.
        </p>
      </div>

      <div className="company-map-grid">
        {/* LEFT: Search Form + Analysis */}
        <div style={cellStyle}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0e47a1', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> Phone Number Search Portal
          </h2>

          <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Enter Mobile / Agent Phone Number *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.95rem', fontWeight: 600, border: '2px solid #93c5fd', borderRadius: '6px', fontFamily: 'monospace' }}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. +9779800000000"
              />
              <button type="submit" className="btn-primary" disabled={stage === 'researching'} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: stage === 'researching' ? 0.7 : 1 }}>
                <Search size={16} /> {stage === 'researching' ? 'Researching...' : 'Start Research'}
              </button>
            </div>
          </form>

          {/* API status strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.78rem', background: '#f8fafc', padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: apiChecked ? (apiOnline ? '#166534' : '#991b1b') : '#64748b' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: apiChecked ? (apiOnline ? '#16a34a' : '#dc2626') : '#94a3b8' }} />
              {apiChecked ? (apiOnline ? `Research Backend API Online (${settings.url})` : `Research API Offline (${settings.url}) — Run: npm run server`) : 'Research API: Checking status...'}
            </span>
            <button type="button" onClick={checkApi} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 700, color: '#0e47a1', padding: '0.25rem 0.55rem', cursor: 'pointer' }}>
              <RefreshCw size={12} /> Check Status
            </button>
          </div>

          {/* Live API Settings accordion */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '7px', padding: '0.55rem 0.8rem', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', color: '#0e47a1' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Settings size={15} /> Live API Settings (Facebook / Instagram / Web)
              </span>
              {settingsOpen ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>

            {settingsOpen && (
              <div style={{ marginTop: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.7rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                  Runs <strong>real</strong> account-search queries against Facebook & Instagram (the same GraphQL calls the password-recovery page makes) plus web search. Paste your <strong>own browser session data</strong> below — it never leaves your machine (stored in localStorage, sent only to your local server on 8787). Captured at: <code>DevTools → Network → the <em>api/graphql</em> request → Copy → Copy as cURL</code>, then paste the <code>data-raw</code> body + Cookie header here.
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.7rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', flexShrink: 0 }}>API URL</label>
                  <input style={{ ...inputStyle, flex: 1 }} value={settings.url} onChange={(e) => saveSettings({ url: e.target.value })} placeholder="http://localhost:8787" />
                </div>

                <SettingsSection
                  title="📘 Facebook"
                  hint="Cookie header from the facebook.com/api/graphql/ request; lsd = the x-fb-lsd header value; data-raw = the full request body. All three optional — but without them Facebook returns its HTML login page."
                >
                  <textarea style={{ ...inputStyle, minHeight: '52px' }} placeholder="Cookie header (datr=...; sb=...; fr=...)" value={settings.fbCookies} onChange={(e) => saveSettings({ fbCookies: e.target.value })} />
                  <input style={inputStyle} placeholder="x-fb-lsd (e.g. AdQw833uUv7UwWbqbPV8bQH5Hnc)" value={settings.fbLsd} onChange={(e) => saveSettings({ fbLsd: e.target.value })} />
                  <textarea style={{ ...inputStyle, minHeight: '70px' }} placeholder={'data-raw body (av=0&__aaid=0&__req=7&__dyn=...&variables=...&doc_id=28496659306608697)'} value={settings.fbDataRaw} onChange={(e) => saveSettings({ fbDataRaw: e.target.value })} />
                </SettingsSection>

                <SettingsSection
                  title="📸 Instagram"
                  hint="Cookie header from the instagram.com/api/graphql request (needs csrftoken=...; ig_did=...; mid=...); lsd optional; data-raw = the request body. Instagram is stricter — the session must be fresh and from the same network you run the research on."
                >
                  <textarea style={{ ...inputStyle, minHeight: '52px' }} placeholder="Cookie header (csrftoken=...; ig_did=...; mid=...)" value={settings.igCookies} onChange={(e) => saveSettings({ igCookies: e.target.value })} />
                  <input style={inputStyle} placeholder="x-fb-lsd (optional)" value={settings.igLsd} onChange={(e) => saveSettings({ igLsd: e.target.value })} />
                  <textarea style={{ ...inputStyle, minHeight: '70px' }} placeholder={'data-raw body (variables=...&doc_id=36716895674620546)'} value={settings.igDataRaw} onChange={(e) => saveSettings({ igDataRaw: e.target.value })} />
                </SettingsSection>

                <SettingsSection
                  title="🌐 Web search"
                  hint="Optional Google cookie header (SID/HSID/APISID…). If empty or Google needs JS, the engine automatically falls back to DuckDuckGo Lite — no cookies needed."
                >
                  <textarea style={{ ...inputStyle, minHeight: '52px' }} placeholder="Google Cookie header (optional)" value={settings.googleCookies} onChange={(e) => saveSettings({ googleCookies: e.target.value })} />
                </SettingsSection>

                <div style={{ fontSize: '0.72rem', color: '#b45309', lineHeight: 1.5, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '0.5rem 0.6rem' }}>
                  ⚠️ These are <strong>live session tokens</strong>. Never share them with anyone and rotate them regularly (log out / clear cookies). If a session was ever shared, log out of that platform immediately.
                </div>
              </div>
            )}
          </div>

          {/* Live Research Console */}
          {(stage === 'researching' || stage === 'done' || stage === 'error') && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: stage === 'researching' ? '#f59e0b' : stage === 'done' ? '#16a34a' : '#dc2626', animation: stage === 'researching' ? 'pulse 1s infinite' : 'none' }} />
                {stage === 'researching' ? 'Background Research In Progress...' : stage === 'done' ? 'Research Complete' : 'Research Error'}
              </div>
              <div
                ref={logBoxRef}
                style={{
                  background: '#0f172a',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  lineHeight: 1.7
                }}
              >
                {log.map((line, i) => (
                  <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>
                ))}
                {stage === 'researching' && <div style={{ color: '#94a3b8' }}>▍</div>}
              </div>
            </div>
          )}

          {stage === 'error' && errorMsg && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#fee2e2', color: '#991b1b', padding: '0.7rem 0.9rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid #fecaca' }}>
              <AlertTriangle size={16} /> {errorMsg}
            </div>
          )}

          {/* Analysis Details */}
          {result && result.country && (
            <>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={16} color="#0e47a1" /> Number Analysis Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} /> {result.formatted}
                </div>
                {result.valid && (
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={15} /> {result.validMsg}
                  </div>
                )}
                {!result.valid && (
                  <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={15} /> {result.validMsg}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.55rem 0.7rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Country</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{result.country.flag} {result.country.name}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.55rem 0.7rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Calling Code</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>+{result.country.cc}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.55rem 0.7rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Number Type</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{result.numberType}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.55rem 0.7rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>National Format</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', fontSize: '0.8rem' }}>{result.national}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '0.55rem 0.7rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>E.164 International Format</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', fontSize: '0.8rem' }}>{result.e164}</div>
                  </div>
                  {result.carrierHint && (
                    <div style={{ gridColumn: '1 / -1', background: '#eef4ff', padding: '0.55rem 0.7rem', borderRadius: '6px', border: '1px solid #c7d7f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Smartphone size={15} color="#0e47a1" />
                      <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>{result.carrierHint}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleDownloadReport}
                style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <Download size={15} /> Download Full Research Report (.txt)
              </button>
            </>
          )}
        </div>

        {/* RIGHT: Live Results + Public Records & Social Media Links */}
        <div style={cellStyle}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0e47a1', marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} /> Public Records, Social Media & Google Sources
          </h2>

          {!result && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', color: '#64748b', textAlign: 'center' }}>
              <Landmark size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#334155' }}>No research performed yet</div>
              <div style={{ fontSize: '0.85rem', maxWidth: '380px', marginTop: '0.35rem' }}>
                Enter a phone number on the left (e.g. +9779800000000) and click <strong>Start Research</strong>. The engine runs real Facebook & Instagram account-search queries and scans Google and all social platforms & public directories for any public record linked to the number.
              </div>
            </div>
          )}

          {result && (
            <>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 800, color: '#0e47a1', fontSize: '0.9rem', marginBottom: '0.3rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem' }}>
                  🔎 Research Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', color: '#334155' }}>
                  <div>📞 <strong>Searched:</strong> {result.raw}</div>
                  <div>🌍 <strong>Country:</strong> {result.country?.flag} {result.country?.name}</div>
                  <div>📱 <strong>Type:</strong> {result.numberType}</div>
                  <div>🔗 <strong>Sources compiled:</strong> {result.groups.reduce((n, g) => n + g.items.length, 0)} links</div>
                </div>
              </div>

              {livePlatformCards()}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '620px', overflowY: 'auto', paddingRight: '4px' }}>
                {result.groups.map((group, gi) => (
                  <div key={gi} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ background: '#f1f5f9', padding: '0.5rem 0.9rem', fontSize: '0.85rem', fontWeight: 800, color: '#0e47a1', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Link2 size={14} /> {group.category}
                    </div>
                    <div style={{ padding: '0.6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                      {group.items.map((item, ii) => (
                        <a
                          key={ii}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.hint}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.45rem 0.6rem',
                            borderRadius: '6px',
                            border: '1.5px solid #bfdbfe',
                            background: '#eef4ff',
                            color: '#0e47a1',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#0e47a1'; e.currentTarget.style.color = '#ffffff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#eef4ff'; e.currentTarget.style.color = '#0e47a1'; }}
                        >
                          <ExternalLink size={13} style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', borderRadius: '6px', padding: '0.55rem 0.8rem', fontSize: '0.75rem', lineHeight: 1.5 }}>
                ⚠️ <strong>Note:</strong> Forensic data is retrieved live from the local research API and public indices. All profile attributes and sub-profile linkages are rendered directly without navigating externally.
              </div>
            </>
          )}
        </div>
      </div>

      {/* In-App Full Profile Dossier Modal */}
      {inspectProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            border: '2px solid #3b82f6'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              color: '#ffffff',
              padding: '1.2rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={20} color="#60a5fa" />
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Full Profile Forensic Dossier</span>
              </div>
              <button
                type="button"
                onClick={() => setInspectProfile(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', borderRadius: '6px', padding: '0.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                {inspectProfile.match.picture ? (
                  <img
                    src={inspectProfile.match.picture}
                    alt=""
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid #3b82f6', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                ) : (
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: inspectProfile.platform === 'facebook' ? 'linear-gradient(135deg, #1877f2, #0d5cb6)' : 'linear-gradient(135deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.6rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
                  }}>
                    {(inspectProfile.match.name || '?').replace(/[^a-zA-Z0-9]/g, '').slice(0, 1).toUpperCase() || '👤'}
                  </div>
                )}
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {inspectProfile.match.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      {inspectProfile.platform.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, background: inspectProfile.match.displayable === false ? '#fef3c7' : '#dcfce7', color: inspectProfile.match.displayable === false ? '#92400e' : '#166534', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      {inspectProfile.match.displayable === false ? 'PRIVACY-PROTECTED' : 'PUBLIC PROFILE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Field Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Account UID / Identifier</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {inspectProfile.match.id || 'Encrypted / Anonymous UID'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Classification & Architecture</div>
                  <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {inspectProfile.match.type || 'Standard Account'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Bound Target Number</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#16a34a', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {phoneInput}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Linked Sub-Profiles</div>
                  <div style={{ fontWeight: 800, color: '#6366f1', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {inspectProfile.match.linkedProfiles || (inspectProfile.match.subProfiles ? inspectProfile.match.subProfiles.length : 0)} Connected Profile(s)
                  </div>
                </div>
              </div>

              {/* Sub-Profiles Listing */}
              {inspectProfile.match.subProfiles && inspectProfile.match.subProfiles.length > 0 && (
                <div style={{ background: '#eef2ff', padding: '0.85rem', borderRadius: '8px', border: '1.5px solid #c7d2fe', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#3730a3', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Layers size={14} /> Linked Multi-Account Architecture:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {inspectProfile.match.subProfiles.map((sub, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid #c7d2fe' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          {sub.picture ? <img src={sub.picture} alt="" width={22} height={22} style={{ borderRadius: '50%' }} /> : <span>👤</span>}
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}>{sub.name}</span>
                        </div>
                        {sub.id && <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748b' }}>UID: {sub.id}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON Data Toggle for Forensics */}
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    copyText(JSON.stringify(inspectProfile.match, null, 2), 'modal-copy');
                  }}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {copiedId === 'modal-copy' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  {copiedId === 'modal-copy' ? 'Copied Full JSON' : 'Copy Complete JSON Record'}
                </button>
                <button
                  type="button"
                  onClick={() => setInspectProfile(null)}
                  className="btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 700 }}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberResearchPage;
