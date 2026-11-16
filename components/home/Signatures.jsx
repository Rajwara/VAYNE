'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { SCENTS, photo } from '@/lib/data';
import { useScrollProgress, useVh, useWidth } from '@/lib/hooks';
import { PAL, SANS, SERIF, easeOut, mixColor, range } from '@/lib/theme';

const SIGS = SCENTS.slice(0, 3);

/** Horizontal, scroll-driven carousel of the three signature scents. */
export default function Signatures() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const vh = useVh();
  const p = useScrollProgress(ref, 'sticky');
  const mob = w < 760;
  const pos = range(p, 0.06, 0.94) * (SIGS.length - 1);
  const idx = Math.min(SIGS.length - 2, Math.floor(pos));
  const bg = mixColor(SIGS[idx].tint, SIGS[idx + 1].tint, pos - idx);

  return (
    <section
      ref={ref}
      className="au"
      aria-label="The signatures"
      style={{ position: 'relative', width: '100%', height: SIGS.length * 100 + 'vh' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: bg }}>
        <div
          style={{
            position: 'absolute',
            left: mob ? 20 : 40,
            top: mob ? 72 : 104,
            right: mob ? 20 : 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            zIndex: 2,
          }}
        >
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 28 : 40, color: PAL.ink }}>
            The signatures
          </h2>
          <div aria-hidden="true" style={{ font: `500 14px ${SANS}`, color: PAL.ink }}>
            0{Math.round(pos) + 1} / 0{SIGS.length}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: SIGS.length * w,
            transform: `translate3d(${-pos * w}px,0,0)`,
            willChange: 'transform',
          }}
        >
          {SIGS.map((s, i) => {
            const d = pos - i;
            const near = 1 - Math.min(1, Math.abs(d));
            return (
              <article
                key={s.k}
                style={{
                  width: w,
                  height: '100%',
                  flexShrink: 0,
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
                  alignItems: 'center',
                  padding: mob ? '130px 20px 110px' : '120px 80px 80px',
                  gap: mob ? 8 : 40,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    textAlign: 'center',
                    transform: `translate3d(${d * w * 0.35}px,-50%,0)`,
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: mob ? '28vw' : '18vw',
                    color: 'rgba(255,255,255,.35)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}
                >
                  {s.n.split(' ')[0]}
                </div>
                <div style={{ position: 'relative', height: mob ? vh * 0.36 : vh * 0.7, transform: `translate3d(${d * -60}px,0,0)` }}>
                  <img
                    src={s.img}
                    alt={`VAYNE ${s.n} bottle`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 30px 40px rgba(27,30,25,.2))',
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'relative',
                    opacity: 0.25 + 0.75 * easeOut(near),
                    transform: `translate3d(${d * 120}px,0,0)`,
                    maxWidth: 480,
                  }}
                >
                  <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: s.deep }}>
                    {s.no} · {s.fam}
                  </div>
                  <h3
                    style={{
                      margin: '10px 0 12px',
                      fontFamily: SERIF,
                      fontWeight: 400,
                      fontSize: mob ? 40 : 72,
                      lineHeight: 1,
                      color: PAL.ink,
                    }}
                  >
                    {s.n}
                  </h3>
                  <p style={{ margin: 0, font: `400 ${mob ? 15 : 17}px/1.55 ${SANS}`, color: PAL.ink, opacity: 0.8 }}>
                    {mob ? s.line : s.desc}
                  </p>
                  {!mob && (
                    <div style={{ display: 'flex', gap: 10, margin: '22px 0 0' }}>
                      {s.notes.map((n) => (
                        <span
                          key={n[1]}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 12px 6px 6px',
                            borderRadius: 999,
                            background: 'rgba(255,255,255,.5)',
                            font: `500 13px ${SANS}`,
                            color: PAL.ink,
                          }}
                        >
                          <img
                            src={photo(n[2])}
                            alt={n[1]}
                            style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          {n[1]}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: mob ? 16 : 28 }}>
                    <Link className="au-btn" href={'/collection/' + s.k} tabIndex={Math.abs(d) < 0.5 ? 0 : -1}>
                      Discover <i>→</i>
                    </Link>
                    <span style={{ font: `500 20px ${SANS}`, color: PAL.ink }}>€{s.price}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
