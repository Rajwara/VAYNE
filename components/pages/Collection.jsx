'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Reveal, SplitText } from '@/components/motion';
import { SCENTS } from '@/lib/data';
import { useReducedMotion, useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF } from '@/lib/theme';

const FAMILIES = ['All', 'Green', 'Floral', 'Woody'];

/** Name that types itself out while its card is hovered. */
function TypeName({ text, on, reduced }) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (reduced || !on) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [on, text, reduced]);
  return (
    <span aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      <span aria-hidden="true" style={{ opacity: 0 }}>
        {text.slice(n)}
      </span>
    </span>
  );
}

function Card({ s, i, mob, reduced, tall }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState([0, 0]);
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={(i % 3) * 0.08}>
      <Link
        ref={ref}
        href={'/collection/' + s.k}
        className="cc"
        onMouseMove={(e) => {
          if (reduced || mob) return;
          const r = ref.current.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          setTilt([-y * 12, x * 12]);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setTilt([0, 0]);
          setHover(false);
        }}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={{ display: 'block', textDecoration: 'none', color: PAL.ink, perspective: 900 }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: tall ? '3/5' : '4/5',
            borderRadius: 24,
            background: s.tint,
            transform: `rotateX(${tilt[0]}deg) rotateY(${tilt[1]}deg)`,
            transition: hover ? 'transform .15s linear' : `transform .8s ${EASE}`,
            transformStyle: 'preserve-3d',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', left: 20, top: 18, font: `600 12px ${SANS}`, letterSpacing: '.14em', color: s.deep }}>
            {s.no}
          </div>
          <div style={{ position: 'absolute', right: 20, top: 18, font: `500 13px ${SANS}`, color: PAL.ink, opacity: 0.7 }}>
            {s.fam}
          </div>
          <img
            src={s.img}
            alt={`VAYNE ${s.n} bottle`}
            loading="lazy"
            style={{
              position: 'absolute',
              left: '12%',
              right: '12%',
              top: '10%',
              width: '76%',
              height: '80%',
              objectFit: 'contain',
              transform: `translate3d(${tilt[1] * 1.2}px, ${-tilt[0] * 1.2}px, 40px)`,
              transition: hover ? 'transform .15s linear' : `transform .8s ${EASE}`,
              filter: 'drop-shadow(0 24px 30px rgba(27,30,25,.18))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              bottom: 16,
              font: `400 14px ${SANS}`,
              color: PAL.ink,
              opacity: hover ? 1 : 0,
              transform: hover ? 'none' : 'translateY(8px)',
              transition: `opacity .3s linear, transform .5s ${EASE}`,
            }}
          >
            {s.notes.map((n) => n[1]).join(' · ')}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16, gap: 12 }}>
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 26 : 30, lineHeight: 1.1 }}>
            <TypeName text={s.n} on={hover} reduced={reduced} />
          </h2>
          <span style={{ font: `500 16px ${SANS}` }}>€{s.price}</span>
        </div>
        <p style={{ margin: '4px 0 0', font: `400 15px ${SANS}`, color: PAL.mute }}>{s.line}</p>
      </Link>
    </Reveal>
  );
}

export default function Collection() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const mob = w < 760;
  const reduced = useReducedMotion();
  const [fam, setFam] = useState('All');
  const [gen, setGen] = useState(0);
  const list = SCENTS.filter((s) => fam === 'All' || s.fam === fam);
  const css = `.ct{min-height:44px;padding:0 20px;border-radius:999px;border:1.5px solid ${PAL.ghost};background:transparent;color:${PAL.ink};font:500 15px ${SANS};cursor:pointer;transition:background .25s,border-color .25s,color .25s}.ct:hover{border-color:${PAL.ink}}.ct[aria-selected="true"]{background:${PAL.ink};border-color:${PAL.ink};color:${PAL.cream}}@keyframes ccIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}.cg>*{animation:ccIn .7s ${EASE} both}@media (prefers-reduced-motion:reduce){.cg>*{animation:none}}`;

  return (
    <section
      ref={ref}
      className="au"
      style={{
        width: '100%',
        background: PAL.mist,
        fontFamily: SANS,
        color: PAL.ink,
        padding: mob ? '112px 20px 110px' : '170px 40px 140px',
      }}
    >
      <style>{css}</style>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1.3fr 1fr', gap: 24, alignItems: 'end' }}>
          <div>
            <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>
              Six eaux de parfum
            </div>
            <SplitText
              as="h1"
              text="The collection"
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: mob ? 54 : w < 1100 ? 84 : 120,
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                marginTop: 12,
              }}
              italic={[1]}
            />
          </div>
          <Reveal delay={0.2}>
            <p style={{ margin: 0, font: `400 17px/1.6 ${SANS}`, color: PAL.mute, maxWidth: 420 }}>
              Each scent is built around one moment between night and morning. Every bottle is 50 ml, refillable and
              numbered by hand.
            </p>
          </Reveal>
        </div>

        <div
          role="tablist"
          aria-label="Scent family"
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: mob ? '32px 0 28px' : '56px 0 40px' }}
        >
          {FAMILIES.map((f) => (
            <button
              key={f}
              role="tab"
              className="ct"
              aria-selected={fam === f}
              onClick={() => {
                setFam(f);
                setGen(gen + 1);
              }}
            >
              {f}{' '}
              <span style={{ opacity: 0.55, marginLeft: 4 }}>
                {f === 'All' ? SCENTS.length : SCENTS.filter((s) => s.fam === f).length}
              </span>
            </button>
          ))}
        </div>

        <div
          key={gen}
          className="cg"
          role="tabpanel"
          style={{
            display: 'grid',
            gridTemplateColumns: mob ? '1fr' : w < 1100 ? '1fr 1fr' : 'repeat(3,1fr)',
            gap: mob ? '40px' : '56px 32px',
          }}
        >
          {list.map((s, i) => (
            <div key={s.k} style={{ animationDelay: i * 0.07 + 's' }}>
              <Card s={s} i={i} mob={mob} reduced={reduced} tall={!mob && w < 1100} />
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: mob ? 64 : 110,
            display: 'grid',
            gridTemplateColumns: mob ? '1fr' : '1fr auto',
            gap: 24,
            alignItems: 'center',
            padding: mob ? 28 : 48,
            borderRadius: 28,
            background: PAL.cream,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 30 : 42, lineHeight: 1.05 }}>
              Not sure yet? <em>Try all six.</em>
            </h2>
            <p style={{ margin: '10px 0 0', font: `400 16px/1.55 ${SANS}`, color: PAL.mute }}>
              The discovery set has six 2 ml vials for €28, credited against your first full bottle.
            </p>
          </div>
          <Link className="au-btn" href="/contact">
            Ask about the set <i>→</i>
          </Link>
        </div>
      </div>
    </section>
  );
}
