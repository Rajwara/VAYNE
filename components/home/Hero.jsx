'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/motion';
import { IMG, SCENTS } from '@/lib/data';
import { useReducedMotion, useVh, useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF } from '@/lib/theme';

const LEAF =
  'M0 -60 C18 -52 22 -30 12 -18 C34 -30 56 -20 58 0 C40 -2 30 8 26 18 C44 24 46 46 32 58 C18 46 10 34 4 30 C4 46 2 62 0 80 C-2 62 -4 46 -4 30 C-10 34 -18 46 -32 58 C-46 46 -44 24 -26 18 C-30 8 -40 -2 -58 0 C-56 -20 -34 -30 -12 -18 C-22 -30 -18 -52 0 -60Z';
const LEAVES = [
  [120, 110, -20, 1.5],
  [300, 70, 35, 1.1],
  [430, 200, 10, 1.7],
  [210, 300, -50, 1.3],
  [380, 420, 70, 1.2],
  [90, 460, 25, 1.6],
  [480, 520, -30, 1.0],
  [250, 560, 15, 1.4],
];

function LeafShadows() {
  return (
    <svg viewBox="0 0 560 640" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" fill="var(--ink)" stroke="var(--ink)">
      <path d="M-20 40 C150 160 300 260 560 340" strokeWidth="7" fill="none" />
      <path d="M20 620 C160 480 300 420 600 300" strokeWidth="6" fill="none" />
      {LEAVES.map(([x, y, r, s]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d={LEAF} />
        </g>
      ))}
    </svg>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const vh = useVh();
  const reduced = useReducedMotion();
  const mob = w < 760;
  const tab = w < 1100;
  const scent = SCENTS[0];
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const on = ready || reduced;
  const [top, setTop] = useState(73);
  useEffect(() => {
    const el = ref.current;
    if (el) setTop(Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY)));
  }, [w]);
  const H = Math.max(vh - top, 560);
  const bottleH = mob ? Math.min(vh * 0.42, 360) : tab ? Math.min(H * 0.56, 560) : Math.min(H * 0.68, 620);
  const bottleW = (483 / 900) * bottleH;

  return (
    <section
      ref={ref}
      className="au"
      aria-label="VAYNE Figuier Vert"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: mob ? undefined : H,
        background: PAL.mist,
        overflow: 'hidden',
        fontFamily: SANS,
        color: PAL.ink,
      }}
    >
      <style>{`html[data-au-travel="1"] [data-au-hero-bottle]{visibility:hidden}@keyframes auLeaf{0%{transform:translate3d(-2%,-1%,0) rotate(-2deg) scale(1.06)}50%{transform:translate3d(2%,1.5%,0) rotate(1.5deg) scale(1.1)}100%{transform:translate3d(-2%,-1%,0) rotate(-2deg) scale(1.06)}}`}</style>
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : tab ? '1fr 1.05fr' : '0.95fr 1.15fr',
          alignItems: 'center',
          gap: mob ? 4 : 24,
          maxWidth: 1320,
          margin: '0 auto',
          padding: mob ? '32px 20px 48px' : `${Math.round(H * 0.04)}px ${tab ? 40 : 48}px ${Math.round(vh * 0.1)}px`,
          minHeight: mob ? undefined : H,
        }}
      >
        <div style={{ order: 1, maxWidth: 480 }}>
          <Reveal y={28}>
            <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>
              Figuier Vert
            </div>
          </Reveal>
          <Reveal delay={0.08} y={32}>
            <h1
              style={{
                margin: '14px 0 0',
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: mob ? 42 : tab ? 56 : 72,
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
              }}
            >
              Green fig at <em>first light.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.16} y={24}>
            <p style={{ margin: '18px 0 0', font: `400 ${mob ? 15 : 17}px/1.6 ${SANS}`, color: PAL.mute, maxWidth: 380 }}>
              Crushed fig leaf, cold milky fruit and pale cedar. An eau de parfum for the hour before the day begins.
            </p>
          </Reveal>
          <Reveal delay={0.24} y={20}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginTop: 28 }}>
              <Link className="au-btn" href={'/collection/' + scent.k}>
                Discover the scent <i>→</i>
              </Link>
              <div>
                <div style={{ font: `500 ${mob ? 22 : 28}px ${SANS}`, letterSpacing: '-0.02em' }}>€{scent.price}</div>
                <div style={{ font: `400 13px ${SANS}`, color: PAL.mute }}>50 ml · Eau de Parfum</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.32} y={16}>
            <div
              style={{
                marginTop: mob ? 26 : 34,
                paddingTop: 16,
                borderTop: '1px solid rgba(27,30,25,.12)',
                maxWidth: 380,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, auto)',
                justifyContent: 'start',
                columnGap: mob ? 22 : 32,
                rowGap: 4,
              }}
            >
              {[
                ['Top', 'Fig leaf'],
                ['Heart', 'Milky fig'],
                ['Base', 'Cedar'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ font: `600 10px ${SANS}`, letterSpacing: '.16em', textTransform: 'uppercase', color: PAL.mute }}>
                    {k}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      font: `500 13px ${SANS}`,
                      fontVariant: 'small-caps',
                      letterSpacing: '.06em',
                      color: PAL.ink,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div
          style={{
            order: 2,
            marginTop: mob ? 28 : 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: bottleH * 1.08,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: mob ? '4% -8% 0' : '-12% -18% -8% 0',
              background:
                'radial-gradient(ellipse 60% 55% at 55% 50%, rgba(232,214,178,.45) 0%, rgba(232,214,178,0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: mob ? '4% -6% 0' : '-10% -16% -6% 0',
              overflow: 'hidden',
              pointerEvents: 'none',
              opacity: on ? (mob ? 0.1 : 0.13) : 0,
              transition: `opacity 1.6s ${EASE}`,
              WebkitMaskImage: 'radial-gradient(closest-side at 55% 50%, #000 35%, transparent 100%)',
              maskImage: 'radial-gradient(closest-side at 55% 50%, #000 35%, transparent 100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-6%',
                filter: 'blur(14px)',
                animation: reduced ? 'none' : 'auLeaf 26s ease-in-out infinite',
              }}
            >
              <LeafShadows />
            </div>
          </div>
          <div
            data-au-hero-bottle=""
            style={{
              position: 'relative',
              width: bottleW,
              height: bottleH,
              zIndex: 1,
              opacity: on ? 1 : 0,
              transform: on ? 'scale(1)' : 'scale(0.96)',
              transition: reduced ? 'none' : `opacity 1.1s ${EASE}, transform 1.2s ${EASE}`,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-3%',
                width: '150%',
                height: 1,
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, transparent, rgba(27,30,25,.2), transparent)',
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-5%',
                width: '90%',
                height: 24,
                transform: 'translateX(-50%)',
                background: 'radial-gradient(ellipse at center, rgba(27,30,25,.24) 0%, transparent 70%)',
                filter: 'blur(3px)',
                pointerEvents: 'none',
              }}
            />
            <img
              src={IMG.bottle}
              alt="VAYNE Figuier Vert eau de parfum, 50 ml bottle"
              loading="eager"
              fetchPriority="high"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 30px 40px rgba(27,30,25,.16)) drop-shadow(0 6px 10px rgba(27,30,25,.12))',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
