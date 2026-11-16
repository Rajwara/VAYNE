'use client';

import { useEffect, useState } from 'react';
import { FONTS, PALETTES, THEME_KEY, applyTheme } from '@/lib/themes';

const css = `
.ts-fab{position:fixed;left:20px;bottom:20px;z-index:70;display:flex;align-items:center;gap:8px;height:48px;padding:0 18px 0 8px;border-radius:999px;border:0;cursor:pointer;background:var(--ink);color:var(--mist);font:600 14px var(--sans);box-shadow:0 10px 30px rgba(0,0,0,.18);transition:transform .4s var(--ease)}
.ts-fab:hover{transform:translateY(-2px)}
.ts-dots{display:grid;grid-template-columns:1fr 1fr;width:32px;height:32px;border-radius:50%;overflow:hidden;border:2px solid var(--mist)}
.ts-panel{position:fixed;left:20px;bottom:80px;z-index:70;width:min(360px,calc(100vw - 40px));max-height:min(640px,calc(100vh - 110px));overflow:auto;background:var(--mist);color:var(--ink);border-radius:22px;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,.22),0 0 0 1px var(--line);font-family:var(--sans);transform-origin:0 100%;transition:opacity .25s linear,transform .45s var(--ease)}
.ts-panel[data-open="false"]{opacity:0;transform:translateY(12px) scale(.97);pointer-events:none}
.ts-h{font:600 11px var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--jun);margin:0 0 10px}
.ts-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
.ts-sw{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;cursor:pointer;padding:0;color:var(--ink);font:500 11px var(--sans)}
.ts-chip{width:52px;height:52px;border-radius:50%;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;box-shadow:0 0 0 1px rgba(0,0,0,.12);transition:transform .3s var(--ease),box-shadow .2s}
.ts-sw:hover .ts-chip{transform:scale(1.06)}
.ts-sw[aria-pressed="true"] .ts-chip{box-shadow:0 0 0 2px var(--mist),0 0 0 4px var(--ink)}
.ts-font{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;background:none;border:0;border-top:1px solid var(--line);padding:12px 4px;cursor:pointer;color:var(--ink);text-align:left}
.ts-font[aria-pressed="true"]{background:color-mix(in srgb,var(--jun) 10%,transparent);border-radius:12px}
.ts-row{display:flex;gap:8px;margin-top:16px}
.ts-btn{flex:1;min-height:40px;border-radius:999px;border:1.5px solid var(--ink);background:none;color:var(--ink);font:600 13px var(--sans);cursor:pointer}
.ts-btn.solid{background:var(--ink);color:var(--mist)}
.ts-code{margin-top:12px;font:12px/1.5 ui-monospace,Menlo,monospace;color:var(--mute);word-break:break-all}
@media (max-width:760px){.ts-fab{left:12px;bottom:12px;height:44px}.ts-panel{left:12px;bottom:66px}}
`;

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [pal, setPal] = useState(PALETTES[0].id);
  const [font, setFont] = useState(FONTS[0].id);
  const [copied, setCopied] = useState(false);

  // Restore saved choice.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(THEME_KEY) || 'null');
      if (saved) {
        setPal(saved.pal || PALETTES[0].id);
        setFont(saved.font || FONTS[0].id);
      }
    } catch {}
  }, []);

  useEffect(() => {
    applyTheme(pal, font);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify({ pal, font }));
    } catch {}
  }, [pal, font]);

  // Load every font family once the panel opens so the previews render in their own type.
  useEffect(() => {
    if (!open) return;
    FONTS.forEach((f) => {
      if (!f.google || document.getElementById('font-' + f.id)) return;
      const link = document.createElement('link');
      link.id = 'font-' + f.id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?${f.google}&display=swap`;
      document.head.appendChild(link);
    });
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const current = PALETTES.find((p) => p.id === pal) || PALETTES[0];
  const currentFont = FONTS.find((f) => f.id === font) || FONTS[0];

  const shuffle = () => {
    const others = (list, id) => list.filter((x) => x.id !== id);
    const p = others(PALETTES, pal);
    const f = others(FONTS, font);
    setPal(p[Math.floor(Math.random() * p.length)].id);
    setFont(f[Math.floor(Math.random() * f.length)].id);
  };

  const summary = `Palette: ${current.name} (${Object.entries(current.vars)
    .map(([k, v]) => `${k} ${v}`)
    .join(', ')}) · Fonts: ${currentFont.name}`;

  return (
    <>
      <style>{css}</style>
      <button
        className="ts-fab"
        aria-expanded={open}
        aria-controls="ts-panel"
        onClick={() => setOpen(!open)}
        title="Try colours and fonts"
      >
        <span className="ts-dots" aria-hidden="true">
          <span style={{ background: 'var(--jun)' }} />
          <span style={{ background: 'var(--cream)' }} />
          <span style={{ background: 'var(--ghost)' }} />
          <span style={{ background: 'var(--mist)' }} />
        </span>
        {open ? 'Close' : 'Theme'}
      </button>

      <div id="ts-panel" className="ts-panel" data-open={open} aria-hidden={!open} data-lenis-prevent="" role="dialog" aria-label="Theme">
        <p className="ts-h">Colours</p>
        <div className="ts-grid">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              className="ts-sw"
              aria-pressed={pal === p.id}
              onClick={() => setPal(p.id)}
              tabIndex={open ? 0 : -1}
            >
              <span className="ts-chip" aria-hidden="true">
                <span style={{ background: p.vars.jun }} />
                <span style={{ background: p.vars.cream }} />
                <span style={{ background: p.vars.mist }} />
                <span style={{ background: p.vars.ink }} />
              </span>
              {p.name}
            </button>
          ))}
        </div>

        <p className="ts-h">Fonts</p>
        {FONTS.map((f) => (
          <button
            key={f.id}
            className="ts-font"
            aria-pressed={font === f.id}
            onClick={() => setFont(f.id)}
            tabIndex={open ? 0 : -1}
          >
            <span style={{ fontFamily: f.serif, fontSize: 26, lineHeight: 1.1 }}>
              Vayne <em>first light</em>
            </span>
            <span style={{ fontFamily: f.sans, fontSize: 12, opacity: 0.7, textAlign: 'right' }}>{f.name}</span>
          </button>
        ))}

        <div className="ts-row">
          <button className="ts-btn" onClick={shuffle} tabIndex={open ? 0 : -1}>
            Shuffle
          </button>
          <button
            className="ts-btn"
            onClick={() => {
              setPal(PALETTES[0].id);
              setFont(FONTS[0].id);
            }}
            tabIndex={open ? 0 : -1}
          >
            Reset
          </button>
          <button
            className="ts-btn solid"
            onClick={() => {
              navigator.clipboard?.writeText(summary).then(
                () => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                },
                () => {},
              );
            }}
            tabIndex={open ? 0 : -1}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <p className="ts-code">{summary}</p>
      </div>
    </>
  );
}
