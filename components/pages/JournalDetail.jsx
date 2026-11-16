'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Reveal } from '@/components/motion';
import { JOURNAL, photo } from '@/lib/data';
import { useScrollProgress, useVh, useWidth } from '@/lib/hooks';
import { PAL, SANS, SERIF } from '@/lib/theme';

export default function JournalDetail({ slug }) {
  const i = Math.max(
    0,
    JOURNAL.findIndex((j) => j.s === slug),
  );
  const story = JOURNAL[i];
  const next = JOURNAL[(i + 1) % JOURNAL.length];
  const ref = useRef(null);
  const w = useWidth(ref);
  const vh = useVh();
  const mob = w < 760;
  const bodyRef = useRef(null);
  const p = useScrollProgress(bodyRef, 'sticky');
  const css = `.dc::first-letter{float:left;font-family:${SERIF};font-size:${mob ? 76 : 104}px;line-height:.8;padding:8px 12px 0 0;color:${PAL.jun}}`;

  return (
    <article ref={ref} className="au" style={{ width: '100%', background: PAL.mist, fontFamily: SANS, color: PAL.ink }}>
      <style>{css}</style>
      <div
        aria-hidden="true"
        style={{ position: 'fixed', left: 0, right: 0, top: 0, height: 3, zIndex: 60, pointerEvents: 'none' }}
      >
        <div style={{ height: '100%', background: PAL.jun, transformOrigin: '0 50%', transform: `scaleX(${p})` }} />
      </div>
      <header style={{ maxWidth: 900, margin: '0 auto', padding: mob ? '110px 20px 0' : '170px 40px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: PAL.mute }}>
          <Link className="au-link" href="/journal" style={{ color: PAL.jun, fontWeight: 600 }}>
            {story.c}
          </Link>{' '}
          · {story.d} · 4 min read
        </div>
        <Reveal>
          <h1
            style={{
              margin: '18px 0 0',
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: mob ? 44 : 84,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {story.t}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            style={{
              margin: '20px auto 0',
              maxWidth: 620,
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: mob ? 20 : 24,
              lineHeight: 1.4,
              color: PAL.mute,
            }}
          >
            {story.ex}
          </p>
        </Reveal>
      </header>
      <Reveal
        delay={0.15}
        y={40}
        style={{ maxWidth: 1200, margin: mob ? '36px auto 0' : '64px auto 0', padding: mob ? '0 20px' : '0 40px' }}
      >
        <img
          src={photo(story.img)}
          alt={story.alt}
          loading="eager"
          style={{ width: '100%', height: mob ? vh * 0.45 : vh * 0.7, objectFit: 'cover', borderRadius: 28, display: 'block' }}
        />
      </Reveal>
      <div ref={bodyRef} style={{ maxWidth: 680, margin: '0 auto', padding: mob ? '48px 20px 40px' : '90px 40px 60px' }}>
        {story.body.map(([h, text], n) => (
          <section key={h} style={{ marginTop: n ? 48 : 0 }}>
            <h2 style={{ margin: '0 0 14px', fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 28 : 36 }}>{h}</h2>
            <p className={n === 0 ? 'dc' : ''} style={{ margin: 0, font: `400 ${mob ? 17 : 19}px/1.75 ${SANS}` }}>
              {text}
            </p>
            {n === 0 && (
              <blockquote
                style={{
                  margin: '44px 0 0',
                  padding: '0 0 0 24px',
                  borderLeft: `3px solid ${PAL.jun}`,
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: mob ? 24 : 30,
                  lineHeight: 1.3,
                }}
              >
                “Scent is the only sense that goes straight to memory.”
              </blockquote>
            )}
          </section>
        ))}
      </div>
      <Link
        href={'/journal/' + next.s}
        style={{
          display: 'block',
          maxWidth: 1200,
          margin: '0 auto',
          padding: mob ? '0 20px 110px' : '40px 40px 140px',
          color: PAL.ink,
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            borderTop: `1px solid ${PAL.ink}`,
            paddingTop: 24,
            display: 'grid',
            gridTemplateColumns: mob ? '1fr' : '1fr 280px',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>
              Next story
            </div>
            <div style={{ fontFamily: SERIF, fontSize: mob ? 32 : 56, lineHeight: 1.05, marginTop: 10 }}>{next.t} →</div>
          </div>
          <img
            src={photo(next.img)}
            alt={next.alt}
            loading="lazy"
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 18 }}
          />
        </div>
      </Link>
    </article>
  );
}
