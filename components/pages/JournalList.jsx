'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Reveal, SplitText } from '@/components/motion';
import { JOURNAL, photo } from '@/lib/data';
import { useReducedMotion, useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF } from '@/lib/theme';

export default function JournalList() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const mob = w < 900;
  const reduced = useReducedMotion();
  const [active, setActive] = useState(-1);
  const [pos, setPos] = useState([0, 0]);
  const css = `.jr{display:grid;grid-template-columns:120px 1fr 160px 40px;gap:24px;align-items:center;padding:28px 0;border-top:1px solid ${PAL.line};color:${PAL.ink};text-decoration:none;position:relative;z-index:2}.jr h2{transition:transform .6s ${EASE}}.jr:hover h2,.jr:focus-visible h2{transform:translateX(16px)}.jr .ar{transition:transform .4s ${EASE}}.jr:hover .ar{transform:translateX(6px)}`;

  return (
    <section
      ref={ref}
      className="au"
      onMouseMove={
        mob
          ? undefined
          : (e) => {
              const r = ref.current.getBoundingClientRect();
              setPos([e.clientX - r.left, e.clientY - r.top]);
            }
      }
      style={{
        position: 'relative',
        width: '100%',
        background: PAL.mist,
        fontFamily: SANS,
        color: PAL.ink,
        padding: mob ? '110px 20px 110px' : '170px 40px 150px',
        overflow: 'hidden',
      }}
    >
      <style>{css}</style>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>Journal</div>
        <SplitText
          as="h1"
          text="Notes from the atelier"
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: mob ? 50 : 110,
            lineHeight: 0.96,
            letterSpacing: '-0.02em',
            marginTop: 12,
          }}
          italic={[2, 3]}
        />
        <Reveal delay={0.2}>
          <p style={{ margin: '20px 0 0', font: `400 17px/1.6 ${SANS}`, color: PAL.mute, maxWidth: 480 }}>
            On ingredients, the people who grow them, and how to get the most out of a bottle.
          </p>
        </Reveal>
        <div style={{ marginTop: mob ? 40 : 80, borderBottom: `1px solid ${PAL.line}` }}>
          {JOURNAL.map((j, i) =>
            mob ? (
              <Reveal key={j.s} delay={i * 0.06}>
                <Link
                  href={'/journal/' + j.s}
                  style={{
                    display: 'block',
                    padding: '24px 0',
                    borderTop: `1px solid ${PAL.line}`,
                    color: PAL.ink,
                    textDecoration: 'none',
                  }}
                >
                  <img
                    src={photo(j.img)}
                    alt={j.alt}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 18 }}
                  />
                  <div style={{ fontSize: 13, color: PAL.mute, marginTop: 14 }}>
                    {j.c} · {j.d}
                  </div>
                  <h2 style={{ margin: '6px 0 6px', fontFamily: SERIF, fontWeight: 400, fontSize: 30, lineHeight: 1.1 }}>{j.t}</h2>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: PAL.mute }}>{j.ex}</p>
                </Link>
              </Reveal>
            ) : (
              <Reveal key={j.s} delay={i * 0.06}>
                <Link
                  className="jr"
                  href={'/journal/' + j.s}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(-1)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(-1)}
                >
                  <span style={{ fontSize: 14, color: PAL.mute }}>{j.d}</span>
                  <div>
                    <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: w < 1100 ? 40 : 56, lineHeight: 1.05 }}>
                      {j.t}
                    </h2>
                    <p style={{ margin: '8px 0 0', fontSize: 15, color: PAL.mute, maxWidth: 560 }}>{j.ex}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: PAL.jun }}>{j.c}</span>
                  <span className="ar" aria-hidden="true" style={{ fontSize: 22 }}>
                    →
                  </span>
                </Link>
              </Reveal>
            ),
          )}
        </div>
      </div>
      {!mob &&
        JOURNAL.map((j, i) => (
          <img
            key={j.s}
            src={photo(j.img)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 300,
              height: 380,
              objectFit: 'cover',
              borderRadius: 20,
              pointerEvents: 'none',
              zIndex: 1,
              transform: `translate3d(${pos[0] - 150}px,${pos[1] - 190}px,0)`,
              opacity: active === i ? 1 : 0,
              transition: reduced ? 'none' : `opacity .35s linear, transform .5s ${EASE}`,
            }}
          />
        ))}
    </section>
  );
}
