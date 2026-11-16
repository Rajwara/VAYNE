'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { CONTACT } from '@/lib/data';
import { useInView, useReducedMotion, useWidth } from '@/lib/hooks';
import { BRAND, EASE, PAL, SANS, SERIF } from '@/lib/theme';

const COLUMNS = [
  [
    'Shop',
    [
      ['The collection', '/collection'],
      ['Figuier Vert', '/collection/figuier-vert'],
      ['Stockists', '/stockists'],
    ],
  ],
  [
    'House',
    [
      ['Our story', '/story'],
      ['Journal', '/journal'],
      ['FAQ', '/faq'],
    ],
  ],
  [
    'Contact',
    [
      [CONTACT.email, `mailto:${CONTACT.email}`],
      [CONTACT.phone, `tel:${CONTACT.tel}`],
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
    ],
  ],
];

export default function Footer() {
  const ref = useRef(null);
  const mob = useWidth(ref) < 760;
  const reduced = useReducedMotion();
  const [markRef, seen] = useInView(0.25);
  const [done, setDone] = useState(false);

  return (
    <footer
      ref={ref}
      className="au"
      style={{
        width: '100%',
        background: PAL.jun,
        color: PAL.cream,
        fontFamily: SANS,
        padding: mob ? '72px 20px 104px' : '110px 40px 96px',
        overflow: 'hidden',
      }}
    >
      <div className="af" style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1.4fr 1fr 1fr 1fr', gap: mob ? 40 : 48 }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 34 : 44, lineHeight: 1.05 }}>
              Letters at <em>first light.</em>
            </h2>
            <p style={{ margin: '14px 0 22px', fontSize: 15, opacity: 0.75, lineHeight: 1.55, maxWidth: 380 }}>
              New scents, refill days and the occasional note from the atelier. Four emails a year.
            </p>
            {done ? (
              <p role="status" style={{ margin: 0, fontWeight: 600 }}>
                Merci. You&apos;re on the list.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
                style={{ display: 'flex', gap: 8, maxWidth: 440 }}
              >
                <label htmlFor="af-email" className="sr-only">
                  Email address
                </label>
                <input id="af-email" type="email" required placeholder="you@email.com" autoComplete="email" />
                <button className="au-btn light" type="submit">
                  Subscribe
                </button>
              </form>
            )}
          </div>
          {COLUMNS.map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                  marginBottom: 10,
                }}
              >
                {title}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('/') ? <Link href={href}>{label}</Link> : <a href={href}>{label}</a>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          ref={markRef}
          aria-hidden="true"
          style={{
            marginTop: mob ? 56 : 90,
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: mob ? '24vw' : 'min(22vw, 330px)',
            lineHeight: 0.85,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textAlign: 'center',
            paddingTop: '0.06em',
            color: PAL.cream,
          }}
        >
          {BRAND.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: seen || reduced ? 'none' : 'translateY(105%)',
                transition: reduced ? 'none' : `transform 1.2s ${EASE} ${i * 0.06}s`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 28,
            fontSize: 13,
            opacity: 0.65,
          }}
        >
          <span>
            © 2026 {BRAND} Parfums. Made in small batches in Paris. ·{' '}
            <a
              href="https://x.com/kiln_studi0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ minHeight: 0, display: 'inline' }}
            >
              Design by Kiln Studio
            </a>
          </span>
          <span>
            {CONTACT.address[0]}, {CONTACT.address[1]}
          </span>
        </div>
      </div>
    </footer>
  );
}
