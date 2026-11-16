'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Reveal } from '@/components/motion';
import { CONTACT } from '@/lib/data';
import { useWidth } from '@/lib/hooks';
import { PAL, SANS, SERIF } from '@/lib/theme';

const DOCS = {
  privacy: [
    'Privacy policy',
    [
      [
        'What we collect',
        'Your name, email, delivery address and order history when you buy from us, and anonymous analytics about how the site is used.',
      ],
      ['Why', 'To deliver orders, answer messages and, if you ask us to, send the newsletter. We never sell your data.'],
      [
        'Cookies',
        'We use only essential cookies and privacy-friendly analytics. Your bag is kept in session storage on your device.',
      ],
      [
        'Your rights',
        `You can ask to see, correct or delete your data at any time by writing to ${CONTACT.privacyEmail}.`,
      ],
    ],
  ],
  terms: [
    'Terms of sale',
    [
      ['Prices', 'Prices are in euros and include VAT for EU deliveries. Duties outside the EU are shown at checkout.'],
      ['Delivery', 'We ship Tuesday to Saturday. Delivery estimates are given in good faith but are not guaranteed.'],
      [
        'Returns',
        'Unopened products can be returned within 30 days for a full refund. Opened products are handled case by case.',
      ],
      [
        'Liability',
        'Perform a patch test if you have sensitive skin. Stop use if irritation occurs.',
      ],
    ],
  ],
};

/** Turns e-mail addresses inside a sentence into mailto links. */
const linkify = (text) =>
  text.split(/([\w.+-]+@[\w-]+\.[a-z]{2,}(?:\.[a-z]{2,})?)/i).map((part, i) =>
    i % 2 ? (
      <a key={i} className="au-link" href={'mailto:' + part.replace(/\.$/, '')}>
        {part}
      </a>
    ) : (
      part
    ),
  );

export default function Legal({ kind = 'privacy' }) {
  const [title, items] = DOCS[kind] || DOCS.privacy;
  const ref = useRef(null);
  const w = useWidth(ref);
  const mob = w < 760;
  return (
    <section
      ref={ref}
      className="au"
      style={{
        width: '100%',
        background: PAL.mist,
        fontFamily: SANS,
        color: PAL.ink,
        padding: mob ? '110px 20px 110px' : '170px 40px 140px',
      }}
    >
      <div style={{ maxWidth: w >= 900 && w < 1200 ? 600 : 760, margin: '0 auto' }}>
        <div style={{ fontSize: 14, color: PAL.mute }}>Last updated 1 October 2026</div>
        <Reveal>
          <h1 style={{ margin: '12px 0 40px', fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 46 : 76, lineHeight: 1 }}>
            {title}
          </h1>
        </Reveal>
        {items.map(([h, body], i) => (
          <Reveal
            key={h}
            style={{
              display: 'grid',
              gridTemplateColumns: '56px 1fr',
              gap: 12,
              borderTop: `1px solid ${PAL.line}`,
              padding: '28px 0',
            }}
          >
            <span style={{ fontFamily: SERIF, fontSize: 22, color: PAL.jun }}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 28 }}>{h}</h2>
              <p style={{ margin: '10px 0 0', fontSize: 16, lineHeight: 1.7, color: PAL.mute }}>{linkify(body)}</p>
            </div>
          </Reveal>
        ))}
        <p style={{ marginTop: 24, fontSize: 15, color: PAL.mute }}>
          Questions?{' '}
          <Link className="au-link" href="/contact">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}
