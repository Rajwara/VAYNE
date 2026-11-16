'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IMG, SCENTS, photo } from '@/lib/data';
import { useReducedMotion, useScrollProgress, useVh, useWidth } from '@/lib/hooks';
import { PAL, SANS, SERIF, clamp, easeInOut, easeOut, lerp, range } from '@/lib/theme';

const SCENT = SCENTS[0];
const RITUAL = [
  ['Spray twice on pulse points', 'Wrists, the base of the throat, behind the knees.'],
  ["Let it dry, don't rub", 'Rubbing bruises the top notes. Give it thirty seconds.'],
  ['Wear it on damp skin', 'Right after a shower it holds for hours longer.'],
  ['Refresh at noon', 'One spray on clothes keeps the fig going till evening.'],
];

const maskStyle = (a, b) => ({
  WebkitMaskImage: `${a}, ${b}`,
  maskImage: `${a}, ${b}`,
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
});

/**
 * Sticky scroll sequence: the hero bottle travels into this section, leaves part,
 * the three notes appear, then the bottle settles onto a plinth for "the ritual".
 */
export default function FigScroll() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const vh = useVh();
  const reduced = useReducedMotion();
  const p = useScrollProgress(ref, 'sticky');

  // Intro timeline (0 → 1 over 1.9s after mount).
  const [intro, setIntro] = useState(0);
  useEffect(() => {
    if (reduced) {
      setIntro(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const v = clamp((now - t0) / 1900);
      setIntro(v);
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // "Settle onto plinth" animation, triggered once progress passes 0.66.
  const [settle, setSettle] = useState(0);
  const settled = useRef(false);
  const settleRaf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(settleRaf.current), []);
  useEffect(() => {
    if (reduced) {
      setSettle(1);
      settled.current = true;
      return;
    }
    if (p < 0.6) {
      if (settled.current && p < 0.52) {
        settled.current = false;
        setSettle(0);
        cancelAnimationFrame(settleRaf.current);
      }
      return;
    }
    if (p < 0.66 || settled.current) return;
    settled.current = true;
    const t0 = performance.now();
    const tick = (now) => {
      const v = clamp((now - t0) / 900);
      setSettle(easeOut(v));
      if (v < 1) settleRaf.current = requestAnimationFrame(tick);
      else setSettle(1);
    };
    settleRaf.current = requestAnimationFrame(tick);
  }, [p, reduced]);

  // Track how far we are between the hero and this section, for the travelling bottle.
  const [travel, setTravel] = useState({ h: 1, r: 0, hr: null });
  useEffect(() => {
    const root = document.documentElement;
    if (reduced) {
      root.dataset.auTravel = '0';
      return;
    }
    let raf = 0;
    let lastKey = '';
    const loop = () => {
      const el = ref.current;
      if (el) {
        const top = el.getBoundingClientRect().top;
        const docTop = top + window.scrollY;
        const h = docTop > 0 ? clamp(window.scrollY / docTop) : 1;
        const hero = document.querySelector('[data-au-hero-bottle]');
        const hb = hero ? hero.getBoundingClientRect() : null;
        const hr = hb ? { x: hb.left, y: hb.top, w: hb.width, h: hb.height } : null;
        const key = h.toFixed(4) + '|' + Math.round(top) + '|' + (hr ? [hr.x, hr.y, hr.w].map(Math.round).join(',') : '');
        if (key !== lastKey) {
          lastKey = key;
          setTravel({ h, r: top, hr });
        }
        root.dataset.auTravel = h > 5e-4 && h < 1 && hr ? '1' : '0';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      root.dataset.auTravel = '0';
    };
  }, [reduced]);

  const travelling = !reduced && travel.h > 5e-4 && travel.h < 1 && !!travel.hr;
  const showBottle = reduced || travel.h >= 1 || !travel.hr;
  const mob = w < 760;
  const tab = w < 1100;

  const bottleH = mob ? Math.min(vh * 0.44, 380) : vh * 0.66;
  const bottleW = (483 / 900) * bottleH;
  const cx = w / 2;
  const cy = mob ? vh * 0.53 : vh * 0.55;

  const spread = 0.3 * easeOut(range(intro, 0, 0.9)) + 0.7 * range(p, 0, 0.2);
  const leavesOpacity = 1 - range(p, 0.16, 0.28);

  const plinth = mob ? Math.min(w * 0.78, vh * 0.4) : Math.min(vh * 0.72, w * 0.42);
  const plinthX = mob ? w / 2 : w * (tab ? 0.68 : 0.66);
  const plinthY = mob ? vh - 88 - plinth / 2 : vh * 0.58;
  const plinthIn = easeOut(range(p, 0.56, 0.7));
  const plinthOpacity = range(p, 0.56, 0.66);
  const offX = (1 - plinthIn) * w * 0.22;
  const offY = (1 - plinthIn) * 40;
  const smallW = plinth * 0.27;
  const smallH = (900 / 483) * smallW;
  const targetX = plinthX + offX;
  const targetY = plinthY - plinth * 0.5 + plinth * 0.68 + offY - smallH * 0.5;

  const bw = lerp(bottleW, smallW, settle);
  const bh = lerp(bottleH, smallH, settle);
  const bx = lerp(cx, targetX, settle);
  const by = lerp(cy, targetY, settle);
  const shiftX = (1 - settle) * (mob ? 0 : easeOut(range(p, 0.22, 0.35)) * w * 0.1);

  const ghostY = -p * vh * 0.5;
  const ghostOpacity = (1 - range(p, 0.22, 0.34)) * range(intro, 0, 0.5);
  const notesOpacity = range(p, 0.22, 0.3) * (1 - range(p, 0.55, 0.62));
  const ritualOpacity = range(p, 0.66, 0.74);
  const noteSize = mob ? 64 : tab ? 88 : 104;
  const plinthShadow = plinthOpacity * clamp((settle - 0.55) / 0.45);
  const filter =
    settle > 0.01
      ? `brightness(${lerp(1, 0.97, settle)}) contrast(${lerp(1, 0.98, settle)}) saturate(${lerp(1, 0.94, settle)}) drop-shadow(0 ${lerp(28, 4, settle)}px ${lerp(36, 10, settle)}px rgba(27,30,25,${lerp(0.18, 0.06, settle)}))`
      : 'drop-shadow(0 28px 36px rgba(27,30,25,.18))';

  let flyer = null;
  if (travelling && typeof document !== 'undefined') {
    const e = easeInOut(travel.h);
    const hr = travel.hr;
    const top = Math.max(travel.r, 0);
    const toX = cx - bottleW / 2;
    const toY = top + cy - bottleH / 2;
    flyer = createPortal(
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: lerp(hr.w, bottleW, e),
          height: lerp(hr.h, bottleH, e),
          transform: `translate3d(${lerp(hr.x, toX, e)}px, ${lerp(hr.y, toY, e)}px, 0)`,
          zIndex: 40,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <img
          src={IMG.bottle}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 28px 36px rgba(27,30,25,.18))',
          }}
        />
      </div>,
      document.body,
    );
  }

  return (
    <section
      ref={ref}
      className="au"
      aria-label="Figuier Vert"
      style={{ position: 'relative', width: '100%', height: mob ? '440vh' : '480vh', background: PAL.mist }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: mob ? '34%' : '30%',
            textAlign: 'center',
            fontFamily: 'var(--display)',
            fontWeight: 'var(--display-weight)',
            fontSize: mob ? '30vw' : '25vw',
            lineHeight: 1,
            letterSpacing: 'var(--display-spacing)',
            color: PAL.ghost,
            whiteSpace: 'nowrap',
            transform: `translateY(${ghostY}px)`,
            willChange: 'transform',
            opacity: ghostOpacity,
          }}
        >
          Figuier
        </div>

        {[-1, 1].map((side) => (
          <div
            key={'b' + side}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '8%',
              bottom: '8%',
              width: mob ? '38%' : '28%',
              left: side < 0 ? '-4%' : 'auto',
              right: side > 0 ? '-4%' : 'auto',
              opacity: leavesOpacity * 0.72,
              display: leavesOpacity <= 0.001 ? 'none' : undefined,
              transform: `translate3d(${side * (spread * w * 0.1 + 4)}px, ${-spread * 14}px, 0)`,
              filter: 'blur(1.2px)',
              willChange: 'transform',
              pointerEvents: 'none',
              zIndex: 1,
              ...maskStyle(
                side < 0
                  ? 'linear-gradient(90deg, #000 0%, #000 50%, transparent 100%)'
                  : 'linear-gradient(270deg, #000 0%, #000 50%, transparent 100%)',
                'linear-gradient(180deg, transparent 0%, #000 18%, #000 78%, transparent 100%)',
              ),
            }}
          >
            <img
              src={IMG.leaves}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: side < 0 ? 'left center' : 'right center',
                transform: 'scaleY(-1)',
                opacity: 0.9,
              }}
            />
          </div>
        ))}

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: plinthX - plinth / 2,
            top: plinthY - plinth / 2,
            width: plinth,
            height: plinth,
            opacity: plinthOpacity,
            transform: `translate3d(${offX}px, ${offY}px, 0)`,
            willChange: 'transform',
            zIndex: 2,
          }}
        >
          <img
            src={IMG.plinth}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 18px 40px rgba(27,30,25,.18))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '68%',
              width: '36%',
              height: '6%',
              transform: 'translate(-50%, 0)',
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at center, rgba(27,30,25,.28) 0%, rgba(27,30,25,.10) 45%, transparent 72%)',
              opacity: plinthShadow,
              filter: 'blur(3px)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        </div>

        <div
          id="notes"
          style={{
            position: 'absolute',
            left: mob ? 20 : 40,
            top: mob ? 72 : 100,
            width: mob ? w - 40 : tab ? Math.min(340, w * 0.38) : Math.min(400, w * 0.34),
            opacity: notesOpacity,
            transform: `translateY(${(1 - range(p, 0.22, 0.3)) * 20}px)`,
            pointerEvents: notesOpacity > 0.05 ? 'auto' : 'none',
            zIndex: 4,
          }}
        >
          <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>
            The notes
          </div>
          <h2
            style={{
              margin: `10px 0 ${mob ? 16 : 28}px`,
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: mob ? 30 : tab ? 40 : 52,
              lineHeight: 1.04,
              color: PAL.ink,
            }}
          >
            Three notes, <em>one morning.</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: mob ? 14 : 18 }}>
            {SCENT.notes.map((note, i) => {
              const t = easeOut(range(p, 0.26 + i * 0.06, 0.36 + i * 0.06));
              return (
                <div
                  key={note[0]}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: noteSize + 'px 1fr',
                    gap: mob ? 12 : 16,
                    alignItems: 'center',
                    opacity: t,
                    transform: `translateY(${(1 - t) * 16}px)`,
                    willChange: 'transform, opacity',
                  }}
                >
                  <div
                    style={{
                      width: noteSize,
                      height: noteSize,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      boxShadow: '0 10px 28px rgba(27,30,25,.12)',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={photo(note[2])}
                      alt={note[1]}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div
                      style={{ font: `600 11px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}
                    >
                      {note[0]}
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: mob ? 20 : 26, lineHeight: 1.1, color: PAL.ink, marginTop: 3 }}>
                      {note[1]}
                    </div>
                    {!mob && (
                      <div style={{ font: `400 14px/1.45 ${SANS}`, color: PAL.mute, marginTop: 4 }}>{note[3]}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: bw,
            height: bh,
            transform: `translate3d(${bx - bw / 2 + shiftX}px, ${by - bh / 2}px, 0)`,
            opacity: showBottle ? 1 : 0,
            willChange: 'transform',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <img
            src={IMG.bottle}
            alt="VAYNE Figuier Vert eau de parfum, 50 ml bottle"
            loading="eager"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter }}
          />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: bx + shiftX - bw * 0.42,
            top: by + bh / 2 - bh * 0.025,
            width: bw * 0.84,
            height: bh * 0.05,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(27,30,25,.26) 0%, rgba(27,30,25,.08) 50%, transparent 72%)',
            filter: 'blur(3px)',
            opacity: (reduced ? 1 : range(travel.h, 0.82, 1)) * (1 - settle),
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {flyer}

        {[-1, 1].map((side) => (
          <div
            key={'f' + side}
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: mob ? '-2%' : '-4%',
              width: mob ? '46%' : '32%',
              height: mob ? '38%' : '48%',
              left: side < 0 ? '-6%' : 'auto',
              right: side > 0 ? '-6%' : 'auto',
              opacity: leavesOpacity * 0.82,
              display: leavesOpacity <= 0.001 ? 'none' : undefined,
              transform: `translate3d(${side * (spread * w * 0.14 + 6)}px, ${spread * 18}px, 0)`,
              filter: 'blur(0.4px)',
              willChange: 'transform',
              pointerEvents: 'none',
              zIndex: 2,
              ...maskStyle(
                side < 0
                  ? 'linear-gradient(90deg, #000 0%, #000 58%, transparent 100%)'
                  : 'linear-gradient(270deg, #000 0%, #000 58%, transparent 100%)',
                'linear-gradient(0deg, #000 0%, #000 55%, transparent 100%)',
              ),
            }}
          >
            <img
              src={IMG.leaves}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: side < 0 ? 'left bottom' : 'right bottom',
              }}
            />
          </div>
        ))}

        <div
          style={{
            position: 'absolute',
            left: mob ? 20 : 40,
            top: mob ? 72 : '50%',
            transform: mob ? 'none' : 'translateY(-50%)',
            width: mob ? w - 40 : tab ? w * 0.36 : Math.min(460, w * 0.38),
            opacity: ritualOpacity,
            pointerEvents: ritualOpacity > 0.05 ? 'auto' : 'none',
            zIndex: 4,
          }}
        >
          <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>
            The ritual
          </div>
          <h2
            style={{
              margin: `8px 0 ${mob ? 10 : 22}px`,
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: mob ? 30 : 52,
              lineHeight: 1.02,
              color: PAL.ink,
            }}
          >
            On <em>skin.</em>
          </h2>
          {RITUAL.map(([title, body], i) => {
            const t = range(p, 0.7 + i * 0.045, 0.78 + i * 0.045);
            return (
              <div
                key={title}
                style={{
                  padding: mob ? '8px 0' : '14px 0',
                  borderTop: `1px solid ${PAL.line}`,
                  opacity: t,
                  transform: `translateY(${(1 - easeOut(t)) * 18}px)`,
                }}
              >
                <div style={{ fontFamily: SERIF, fontSize: mob ? 17 : 22, lineHeight: 1.2, color: PAL.ink }}>{title}</div>
                {!mob && <div style={{ font: `400 14px/1.5 ${SANS}`, color: PAL.mute, marginTop: 2 }}>{body}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
