'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { SplitText } from '@/components/motion';
import { STOCKISTS, photo } from '@/lib/data';
import { useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF } from '@/lib/theme';

export default function Stockists() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const mob = w < 900;
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState(false);
  const shop = STOCKISTS[active];
  const css = `.cy{display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:16px;background:none;border:0;border-top:1px solid ${PAL.line};padding:18px 0;cursor:pointer;color:${PAL.ink};text-align:left}.cy .n{font-family:${SERIF};font-size:${mob ? 40 : 72}px;line-height:1;transition:transform .6s ${EASE},color .3s}.cy[aria-pressed="false"] .n{color:${PAL.ghost}}.cy:hover .n{color:${PAL.ink};transform:translateX(12px)}`;

  return (
    <div ref={ref} className="au" style={{ width: '100%', background: PAL.mist, fontFamily: SANS, color: PAL.ink }}>
      <style>{css}</style>
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: mob ? '110px 20px 60px' : '170px 40px 100px' }}>
        <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>Stockists</div>
        <SplitText
          as="h1"
          text="Smell it in person"
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: mob ? 50 : 110,
            lineHeight: 0.96,
            letterSpacing: '-0.02em',
            marginTop: 12,
          }}
          italic={[3]}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: mob ? '1fr' : '1.1fr 1fr',
            gap: mob ? 28 : 80,
            marginTop: mob ? 36 : 72,
            alignItems: 'start',
          }}
        >
          <div style={{ borderBottom: `1px solid ${PAL.line}` }}>
            {STOCKISTS.map((s, i) => (
              <button
                key={s.c}
                className="cy"
                aria-pressed={active === i}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="n">{s.c}</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: s.k === 'Flagship' ? PAL.jun : PAL.mute,
                  }}
                >
                  {s.k}
                </span>
              </button>
            ))}
          </div>
          <div style={{ position: mob ? 'relative' : 'sticky', top: 110 }}>
            <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 24, overflow: 'hidden', background: PAL.ghost }}>
              {STOCKISTS.map((s, i) => (
                <img
                  key={s.c}
                  src={photo(s.img)}
                  alt={s.alt}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: active === i ? 1 : 0,
                    transform: active === i ? 'none' : 'translateY(14px)',
                    transition: `opacity .5s linear, transform .9s ${EASE}`,
                  }}
                />
              ))}
            </div>
            <div aria-live="polite" style={{ marginTop: 22 }}>
              <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 34 }}>{shop.n}</h2>
              <p style={{ margin: '8px 0 0', fontSize: 16, lineHeight: 1.6, color: PAL.mute }}>
                {shop.a}
                <br />
                {shop.h}
              </p>
              <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
                <a className="au-link" href={'tel:' + shop.t.replace(/\s/g, '')}>
                  {shop.t}
                </a>
                <Link className="au-link" href="/contact">
                  Ask about stock
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="ws" style={{ background: PAL.cream }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: mob ? '72px 20px 110px' : '120px 40px',
            display: 'grid',
            gridTemplateColumns: mob ? '1fr' : '1fr 1.2fr',
            gap: mob ? 28 : 72,
          }}
        >
          <div>
            <h2 id="ws" style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 36 : 52, lineHeight: 1.05 }}>
              Become a <em>stockist</em>
            </h2>
            <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: 1.6, color: PAL.mute }}>
              We work with a few independent shops in each city. Tell us about yours and we will send the wholesale deck.
            </p>
          </div>
          {sent ? (
            <p role="status" style={{ fontFamily: SERIF, fontSize: 28, margin: 0 }}>
              Thank you. We reply within five working days.
            </p>
          ) : (
            <form
              className="au-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              style={{ display: 'grid', gap: 14 }}
            >
              <label>
                Shop name
                <input required name="shop" autoComplete="organization" />
              </label>
              <label>
                City
                <input required name="city" />
              </label>
              <label>
                Email
                <input required type="email" name="email" autoComplete="email" />
              </label>
              <button className="au-btn" type="submit" style={{ justifySelf: 'start' }}>
                Send enquiry <i>→</i>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
