'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Reveal, SplitText } from '@/components/motion';
import { IMG, JOURNAL, photo } from '@/lib/data';
import { useInView, useReducedMotion, useScrollProgress, useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF, titleStyle } from '@/lib/theme';

const STATS = [
  [18, 'months', 'to finish one formula'],
  [96, '%', 'ingredients of natural origin'],
  [400, 'bottles', 'per batch, numbered by hand'],
  [30, '% less', 'when you refill a bottle'],
];

const PRESS = [
  ['Revue Olfactive', '“The fig scent other houses will spend years chasing.”'],
  ['The Morning Paper', '“Quiet, green and impossibly fresh.”'],
  ['Nez Libre', '“A Didone label and a dawn in a bottle.”'],
  ['Atelier Weekly', '“Proof that small batches still matter.”'],
];

function CountUp({ to, on, reduced }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (reduced) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 1600);
      setV(Math.round(to * (1 - (1 - t) ** 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to, reduced]);
  return <>{v}</>;
}

/** Atelier story with counters, the press marquee and the latest journal stories. */
export default function Atelier() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const mob = w < 760;
  const reduced = useReducedMotion();
  const imgRef = useRef(null);
  const view = useScrollProgress(imgRef, 'view');
  const [statsRef, statsOn] = useInView(0.3);

  const css = `@keyframes auMq{from{transform:translateX(0)}to{transform:translateX(-50%)}}.au-mq{display:flex;width:max-content;animation:auMq 38s linear infinite}.au-mqw:hover .au-mq{animation-play-state:paused}@media (prefers-reduced-motion:reduce){.au-mq{animation:none}}
.au-jc{display:block;color:${PAL.ink};text-decoration:none}.au-jc .im{overflow:hidden;border-radius:20px;aspect-ratio:4/5}.au-jc img{transition:transform 1s ${EASE}}.au-jc:hover img{transform:scale(1.04)}.au-jc h3{transition:color .2s}.au-jc:hover h3{color:${PAL.jun}}`;

  return (
    <div ref={ref} className="au" style={{ width: '100%', background: PAL.mist, fontFamily: SANS, color: PAL.ink }}>
      <style>{css}</style>
      <section
        aria-labelledby="at-h"
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: mob ? '96px 20px 72px' : '150px 40px 110px',
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
          gap: mob ? 40 : 80,
          alignItems: 'center',
        }}
      >
        <div ref={imgRef} style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', aspectRatio: '4/5' }}>
          <img
            src={photo(IMG.fields)}
            alt="Rows of flowers at the partner farm above Grasse"
            loading="lazy"
            style={{
              position: 'absolute',
              left: 0,
              top: '-10%',
              width: '100%',
              height: '120%',
              objectFit: 'cover',
              transform: `translate3d(0,${(view - 0.5) * -12}%,0)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 16,
              padding: '8px 14px',
              borderRadius: 999,
              background: 'color-mix(in srgb, var(--mist) 90%, transparent)',
              font: `500 13px ${SANS}`,
            }}
          >
            Grasse, 05:40
          </div>
        </div>
        <div>
          <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>
            The atelier
          </div>
          <SplitText
            id="at-h"
            text="Made slowly, in a room above a Paris courtyard."
            style={{ ...titleStyle(w), marginTop: 14, fontSize: mob ? 36 : w < 1100 ? 46 : 58 }}
            italic={[6, 7, 8]}
          />
          <Reveal delay={0.1}>
            <p style={{ margin: '22px 0 0', font: `400 17px/1.6 ${SANS}`, maxWidth: 480, color: PAL.mute }}>
              Two perfumers, one assistant and a lot of glass. Every VAYNE scent is blended, macerated for three weeks and
              filled by hand in the Marais.
            </p>
          </Reveal>
          <div
            ref={statsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: mob ? '24px 16px' : '36px 32px',
              marginTop: mob ? 32 : 48,
            }}
          >
            {STATS.map(([n, unit, label], i) => (
              <Reveal key={label} delay={i * 0.08} style={{ borderTop: `1px solid ${PAL.line}`, paddingTop: 16 }}>
                <div style={{ fontFamily: SERIF, fontSize: mob ? 44 : 64, lineHeight: 1, color: PAL.ink }}>
                  <CountUp to={n} on={statsOn} reduced={reduced} />
                  <span style={{ font: `500 ${mob ? 15 : 18}px ${SANS}`, marginLeft: 6, color: PAL.jun }}>{unit}</span>
                </div>
                <div style={{ fontSize: 14, color: PAL.mute, marginTop: 8 }}>{label}</div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} style={{ marginTop: 36 }}>
            <Link className="au-btn ghost" href="/story">
              Read our story <i>→</i>
            </Link>
          </Reveal>
        </div>
      </section>

      <section
        aria-label="Press"
        className="au-mqw"
        style={{
          borderTop: `1px solid ${PAL.line}`,
          borderBottom: `1px solid ${PAL.line}`,
          padding: mob ? '26px 0' : '34px 0',
          overflow: 'hidden',
        }}
      >
        <div className="au-mq">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} style={{ display: 'flex' }}>
              {PRESS.map(([source, quote]) => (
                <div
                  key={source}
                  style={{ display: 'flex', alignItems: 'baseline', gap: 18, padding: '0 44px', whiteSpace: 'nowrap' }}
                >
                  <span
                    style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}
                  >
                    {source}
                  </span>
                  <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: mob ? 22 : 30 }}>{quote}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="jn-h"
        style={{ maxWidth: 1320, margin: '0 auto', padding: mob ? '80px 20px 96px' : '130px 40px 140px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 20,
            flexWrap: 'wrap',
            marginBottom: mob ? 28 : 48,
          }}
        >
          <SplitText id="jn-h" text="From the journal" style={titleStyle(w)} italic={[2]} />
          <Link className="au-link" href="/journal" style={{ font: `500 15px ${SANS}` }}>
            All stories
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: mob ? 36 : 32 }}>
          {JOURNAL.slice(0, 3).map((j, i) => (
            <Reveal key={j.s} delay={i * 0.1}>
              <Link className="au-jc" href={'/journal/' + j.s}>
                <div className="im">
                  <img
                    src={photo(j.img)}
                    alt={j.alt}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: 13, color: PAL.mute, marginTop: 16 }}>
                  {j.c} · {j.d}
                </div>
                <h3 style={{ margin: '6px 0 0', fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 26 : 30, lineHeight: 1.12 }}>
                  {j.t}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
