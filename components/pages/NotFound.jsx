'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { IMG } from '@/lib/data';
import { useReducedMotion, useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF } from '@/lib/theme';

export default function NotFound() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const mob = w < 760;
  const reduced = useReducedMotion();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 100);
    return () => clearTimeout(id);
  }, []);
  return (
    <section
      ref={ref}
      className="au"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: PAL.mist,
        fontFamily: SANS,
        color: PAL.ink,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: mob ? '110px 20px 120px' : '120px 40px',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <style>{`@keyframes nfF{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}.nf{animation:nfF 5s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.nf{animation:none}}`}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: mob ? 130 : '50%',
          left: 0,
          right: 0,
          transform: mob ? 'none' : 'translateY(-58%)',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: mob ? '52vw' : '34vw',
          lineHeight: 1,
          color: PAL.ghost,
        }}
      >
        404
      </div>
      <div
        style={{
          position: 'relative',
          opacity: on ? 1 : 0,
          transform: on ? 'none' : 'translateY(30px)',
          transition: reduced ? 'none' : `opacity .6s linear, transform 1.2s ${EASE}`,
        }}
      >
        <img
          className="nf"
          src={IMG.bottle}
          alt="A VAYNE bottle floating"
          style={{ height: mob ? 200 : 380, width: 'auto', filter: 'drop-shadow(0 30px 40px rgba(27,30,25,.2))' }}
        />
      </div>
      <h1 style={{ position: 'relative', margin: '20px 0 10px', fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 36 : 54 }}>
        This page has <em>evaporated</em>
      </h1>
      <p style={{ position: 'relative', margin: '0 0 28px', fontSize: 16, color: PAL.mute }}>
        The link may be old, or the scent discontinued.
      </p>
      <div style={{ position: 'relative', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link className="au-btn" href="/">
          Back home <i>→</i>
        </Link>
        <Link className="au-btn ghost" href="/collection">
          See the collection
        </Link>
      </div>
    </section>
  );
}
