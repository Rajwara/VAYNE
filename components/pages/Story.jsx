'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Reveal, SplitText } from '@/components/motion';
import { IMG, photo } from '@/lib/data';
import { useReducedMotion, useScrollProgress, useVh, useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF, range } from '@/lib/theme';

const TIMELINE = [
  [
    '2019',
    'A fig tree in Ménerbes',
    "Claire Vayne, a trained perfumer, spends a summer at her aunt's house and starts keeping a notebook of morning smells.",
    IMG.figs,
  ],
  [
    '2021',
    'The first formula',
    'After 212 trials, Figuier Vert is finished in a borrowed lab in Grasse. Thirty bottles go to friends.',
    IMG.vessels,
  ],
  [
    '2022',
    'Rue de Turenne',
    'A room above a courtyard in the Marais becomes the atelier, the shop and, for a while, the flat.',
    IMG.paris,
  ],
  [
    '2024',
    'Refill, always',
    'Every bottle becomes refillable. Customers bring them back to the counter for 30 percent less.',
    IMG.linen,
  ],
  [
    '2026',
    'Six scents, six cities',
    'VAYNE now has six eaux de parfum and is carried by six independent shops worldwide.',
    IMG.grove,
  ],
];

const PROMISES = [
  ['Small batches', '400 bottles at a time, so nothing sits in a warehouse losing its top notes.'],
  ['Honest labels', 'Every material and its origin is printed on the box. No secret accords.'],
  ['Refill forever', 'One bottle, refilled for life at any stockist, for 30 percent less.'],
];

export default function Story() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const vh = useVh();
  const mob = w < 760;
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(reduced);
  useEffect(() => {
    const id = setTimeout(() => setOpen(true), 150);
    return () => clearTimeout(id);
  }, []);
  const tlRef = useRef(null);
  const p = useScrollProgress(tlRef, 'sticky');
  const card = mob ? w * 0.84 : Math.min(560, w * 0.42);
  const gap = mob ? 20 : 48;
  const track = TIMELINE.length * (card + gap) - gap + (mob ? 40 : 160);
  const travel = Math.max(0, track - w);
  const t = range(p, 0.08, 0.92);

  return (
    <div ref={ref} className="au" style={{ width: '100%', background: PAL.mist, fontFamily: SANS, color: PAL.ink }}>
      <section style={{ padding: mob ? '110px 20px 0' : '160px 40px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>Our story</div>
        <SplitText
          as="h1"
          text="We bottle the hour before morning."
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: mob ? 46 : w < 1100 ? 76 : 108,
            lineHeight: 0.98,
            letterSpacing: '-0.02em',
            marginTop: 14,
            maxWidth: 1100,
          }}
          italic={[4, 5, 6]}
        />
        <div
          style={{
            position: 'relative',
            marginTop: mob ? 32 : 56,
            height: mob ? vh * 0.5 : vh * 0.74,
            borderRadius: 28,
            overflow: 'hidden',
          }}
        >
          <img
            src={photo(IMG.grove1)}
            alt="Fig and olive trees in early morning light"
            loading="eager"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {['top', 'bottom'].map((side) => (
            <div
              key={side}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                [side]: 0,
                height: '50.5%',
                background: PAL.mist,
                transform: open ? `translate3d(0,${side === 'top' ? '-101%' : '101%'},0)` : 'none',
                transition: reduced ? 'none' : `transform 1.6s ${EASE} .2s`,
              }}
            />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="mf"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: mob ? '80px 20px' : '140px 40px',
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : '1fr 1.4fr',
          gap: mob ? 20 : 80,
        }}
      >
        <h2 id="mf" style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 34 : 46, lineHeight: 1.05 }}>
          Why <em>Vayne</em>
        </h2>
        <Reveal>
          <p style={{ margin: 0, fontFamily: SERIF, fontSize: mob ? 22 : 30, lineHeight: 1.35 }}>
            Named for our founder, and for the hour she loves most. We started with one question: what does the world smell
            like before anyone is awake? Cold leaves, wet stone, the first kettle. Every VAYNE scent tries to hold one of
            those minutes.
          </p>
        </Reveal>
      </section>

      <section
        ref={tlRef}
        aria-label="Timeline"
        style={{ position: 'relative', height: mob ? '300vh' : '360vh', background: PAL.jun, color: PAL.cream }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              left: mob ? 20 : 80,
              top: mob ? 80 : 110,
              font: `600 12px ${SANS}`,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            2019 — 2026
          </div>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: mob ? 20 : 80,
              right: mob ? 20 : 80,
              top: mob ? 112 : 146,
              height: 2,
              background: 'color-mix(in srgb, var(--cream) 20%, transparent)',
            }}
          >
            <div style={{ height: '100%', background: PAL.cream, transformOrigin: '0 50%', transform: `scaleX(${t})` }} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: mob ? 150 : 200,
              left: mob ? 20 : 80,
              display: 'flex',
              gap,
              transform: `translate3d(${-t * travel}px,0,0)`,
              willChange: 'transform',
            }}
          >
            {TIMELINE.map(([year, title, body, img]) => (
              <article key={year} style={{ width: card, flexShrink: 0 }}>
                <div style={{ fontFamily: SERIF, fontSize: mob ? 84 : 150, lineHeight: 0.9, letterSpacing: '-0.03em' }}>{year}</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
                    gap: 20,
                    marginTop: mob ? 16 : 28,
                  }}
                >
                  <img
                    src={photo(img)}
                    alt={title}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: mob ? '16/10' : '4/5', objectFit: 'cover', borderRadius: 18 }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 24 : 28, lineHeight: 1.1 }}>
                      {title}
                    </h3>
                    <p style={{ margin: '10px 0 0', font: `400 15px/1.6 ${SANS}`, opacity: 0.8 }}>{body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="pr" style={{ maxWidth: 1320, margin: '0 auto', padding: mob ? '90px 20px 110px' : '140px 40px' }}>
        <h2 id="pr" style={{ margin: '0 0 40px', fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 38 : 60 }}>
          Three <em>promises</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: mob ? 28 : 40 }}>
          {PROMISES.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.1} style={{ borderTop: `1px solid ${PAL.ink}`, paddingTop: 20 }}>
              <h3 style={{ margin: '10px 0 8px', fontFamily: SERIF, fontWeight: 400, fontSize: 30 }}>{title}</h3>
              <p style={{ margin: 0, font: `400 16px/1.6 ${SANS}`, color: PAL.mute }}>{body}</p>
            </Reveal>
          ))}
        </div>
        <div style={{ marginTop: 56, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="au-btn" href="/collection">
            Shop the collection <i>→</i>
          </Link>
          <Link className="au-btn ghost" href="/stockists">
            Visit a stockist
          </Link>
        </div>
      </section>
    </div>
  );
}
