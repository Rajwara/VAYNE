'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Reveal } from '@/components/motion';
import { addToBag } from '@/lib/bag';
import { SCENTS, photo } from '@/lib/data';
import { useScrollProgress, useVh, useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF, SIZES, easeOut, range, sizePrice } from '@/lib/theme';

export default function ScentDetail({ slug }) {
  const s = SCENTS.find((x) => x.k === slug) || SCENTS[0];
  const ref = useRef(null);
  const w = useWidth(ref);
  const vh = useVh();
  const mob = w < 900;
  const pyrRef = useRef(null);
  const pv = useScrollProgress(pyrRef, 'view');
  const [size, setSize] = useState(1);
  const [open, setOpen] = useState(0);
  const [added, setAdded] = useState(false);
  const fill = easeOut(range(pv, 0.18, 0.7));
  const price = sizePrice(s.price, size);
  const related = SCENTS.filter((x) => x.k !== s.k).slice(0, 3);

  const add = () => {
    addToBag({ k: s.k, n: s.n, size: SIZES[size][0], price, img: s.img, tint: s.tint });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const accordion = [
    [
      'Ingredients',
      'Alcohol denat., parfum (fragrance), aqua (water). Vegan and cruelty-free. Full allergen list on the box and on request.',
    ],
    ['How to wear', `Two sprays on pulse points or clothes. ${s.wear}. Lasts ${s.hours} on skin, longer on wool.`],
    [
      'Shipping & refills',
      'Free shipping in the EU over €100, with two samples of your choice. Bring the bottle to any stockist to refill for 30 percent less.',
    ],
  ];

  const css = `.sz{min-height:52px;flex:1;border-radius:14px;border:1.5px solid ${PAL.ghost};background:transparent;color:${PAL.ink};font:500 15px ${SANS};cursor:pointer;transition:border-color .2s,background .2s,color .2s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:8px}.sz:hover{border-color:${PAL.ink}}.sz[aria-checked="true"]{background:${PAL.ink};border-color:${PAL.ink};color:${PAL.cream}}
.acc{width:100%;display:flex;justify-content:space-between;align-items:center;min-height:56px;background:none;border:0;border-top:1px solid ${PAL.line};font:400 22px ${SERIF};color:${PAL.ink};cursor:pointer;padding:0;text-align:left}.acc span{font:400 20px ${SANS};transition:transform .4s ${EASE}}.acc[aria-expanded="true"] span{transform:rotate(45deg)}
.rel{display:block;text-decoration:none;color:${PAL.ink}}.rel .b{border-radius:20px;aspect-ratio:1;overflow:hidden;position:relative}.rel img{transition:transform .8s ${EASE}}.rel:hover img{transform:translateY(-8px)}`;

  return (
    <div ref={ref} className="au" style={{ width: '100%', background: PAL.mist, fontFamily: SANS, color: PAL.ink }}>
      <style>{css}</style>
      <section style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 0 }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: mob ? 'relative' : 'sticky',
              top: 0,
              height: mob ? Math.min(vh * 0.62, 560) : '100vh',
              background: s.tint,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: mob ? '34vw' : '17vw',
                color: 'rgba(255,255,255,.4)',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {s.n.split(' ')[0]}
            </div>
            <Reveal y={40} style={{ position: 'relative', height: mob ? '78%' : '72%', aspectRatio: '3/4', marginTop: mob ? 40 : 0 }}>
              <img
                src={s.img}
                alt={`VAYNE ${s.n} eau de parfum bottle`}
                loading="eager"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 30px 40px rgba(27,30,25,.22))',
                }}
              />
            </Reveal>
            <div
              style={{
                position: 'absolute',
                left: 20,
                bottom: 18,
                font: `600 12px ${SANS}`,
                letterSpacing: '.14em',
                color: s.deep,
              }}
            >
              {s.no} · {s.fam.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ padding: mob ? '36px 20px 40px' : '150px 64px 100px', maxWidth: 680 }}>
          <div>
            <nav aria-label="Breadcrumb" style={{ fontSize: 14, color: PAL.mute }}>
              <Link className="au-link" href="/collection" style={{ color: PAL.mute }}>
                Collection
              </Link>{' '}
              / {s.n}
            </nav>
            <h1
              style={{
                margin: '18px 0 8px',
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: mob ? 50 : 84,
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
              }}
            >
              {s.n}
            </h1>
            <p style={{ margin: 0, fontFamily: SERIF, fontStyle: 'italic', fontSize: mob ? 22 : 28, color: s.deep }}>{s.line}</p>
          </div>
          <p style={{ margin: '22px 0 0', font: `400 17px/1.65 ${SANS}`, color: PAL.mute }}>{s.desc}</p>

          <div role="radiogroup" aria-label="Size" style={{ display: 'flex', gap: 8, marginTop: 32 }}>
            {SIZES.map(([label], i) => (
              <button key={label} className="sz" role="radio" aria-checked={size === i} onClick={() => setSize(i)}>
                <span>{label}</span>
                <span style={{ fontSize: 13, opacity: 0.7 }}>€{sizePrice(s.price, i)}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 14 }}>
            <button className="au-btn" onClick={add} style={{ flex: 1 }} aria-live="polite">
              {added ? (
                'Added to bag ✓'
              ) : (
                <>
                  Add to bag · €{price} <i>→</i>
                </>
              )}
            </button>
          </div>
          <p style={{ fontSize: 13, color: PAL.mute, margin: '12px 0 0' }}>
            Free EU shipping over €100 · Two samples with every order
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 36 }}>
            {[
              ['Lasts', s.hours],
              ['Sillage', s.sillage],
              ['Wear', s.wear],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '14px 0', borderTop: `1px solid ${PAL.line}` }}>
                <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun, fontWeight: 600 }}>
                  {k}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 18, marginTop: 6, lineHeight: 1.2 }}>{v}</div>
              </div>
            ))}
          </div>

          <div ref={pyrRef} style={{ marginTop: mob ? 56 : 90 }}>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 34 : 44 }}>
              The <em>pyramid</em>
            </h2>
            <div
              style={{ display: 'grid', gridTemplateColumns: (mob ? 56 : 72) + 'px 1fr', gap: mob ? 18 : 32, marginTop: 28 }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'relative',
                  borderRadius: 999,
                  border: `1.5px solid ${PAL.ink}`,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,.4)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '100%',
                    background: `linear-gradient(180deg, ${s.tint}, ${s.deep})`,
                    transform: `translateY(${(1 - fill) * 100}%)`,
                    willChange: 'transform',
                  }}
                />
              </div>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {[...s.notes].reverse().map((n, i) => {
                  const lit = fill > 0.08 + i * 0.3;
                  return (
                    <li
                      key={n[0]}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: (mob ? 64 : 88) + 'px 1fr',
                        gap: 16,
                        alignItems: 'center',
                        padding: '16px 0',
                        borderTop: i ? `1px solid ${PAL.line}` : 'none',
                        opacity: lit ? 1 : 0.3,
                        transform: lit ? 'none' : 'translateX(10px)',
                        transition: `opacity .5s linear, transform .8s ${EASE}`,
                      }}
                    >
                      <img
                        src={photo(n[2])}
                        alt={n[1]}
                        loading="lazy"
                        style={{ width: mob ? 64 : 88, height: mob ? 64 : 88, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div
                          style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun, fontWeight: 600 }}
                        >
                          {n[0]} note
                        </div>
                        <div style={{ fontFamily: SERIF, fontSize: mob ? 24 : 30, lineHeight: 1.1, marginTop: 4 }}>{n[1]}</div>
                        <div style={{ fontSize: 14, color: PAL.mute, marginTop: 4 }}>{n[3]}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div style={{ marginTop: mob ? 48 : 72, borderBottom: `1px solid ${PAL.line}` }}>
            {accordion.map(([title, body], i) => (
              <div key={title}>
                <button
                  className="acc"
                  aria-expanded={open === i}
                  aria-controls={'acc' + i}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  {title}
                  <span aria-hidden="true">+</span>
                </button>
                <div id={'acc' + i} hidden={open !== i} style={{ padding: '0 0 20px', font: `400 16px/1.6 ${SANS}`, color: PAL.mute }}>
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="rel-h"
        style={{ maxWidth: 1320, margin: '0 auto', padding: mob ? '72px 20px 110px' : '120px 40px 140px' }}
      >
        <h2 id="rel-h" style={{ margin: '0 0 32px', fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 34 : 48 }}>
          You may <em>also like</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(3,1fr)', gap: mob ? 16 : 32 }}>
          {related.slice(0, mob ? 2 : 3).map((r, i) => (
            <Reveal key={r.k} delay={i * 0.08}>
              <Link className="rel" href={'/collection/' + r.k}>
                <div className="b" style={{ background: r.tint }}>
                  <img
                    src={r.img}
                    alt={`VAYNE ${r.n} bottle`}
                    loading="lazy"
                    style={{ position: 'absolute', inset: '8%', width: '84%', height: '84%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: SERIF, fontSize: mob ? 20 : 26 }}>{r.n}</span>
                  <span style={{ fontWeight: 500 }}>€{r.price}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
