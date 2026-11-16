'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Reveal, SplitText } from '@/components/motion';
import { useWidth } from '@/lib/hooks';
import { EASE, PAL, SANS, SERIF } from '@/lib/theme';

const SECTIONS = [
  [
    'Orders',
    [
      ['When will my order ship?', 'Orders placed before 14:00 CET leave the atelier the same day, Tuesday to Saturday.'],
      [
        'Do you ship outside the EU?',
        'Yes, to the UK, Switzerland, Norway, the US, Canada and Japan. Duties are shown at checkout.',
      ],
      ['Can I change my order?', 'Write to us within two hours and we will do our best before it is packed.'],
    ],
  ],
  [
    'Scents',
    [
      [
        'How long does a scent last?',
        'Between five and eleven hours on skin, depending on the scent. Each product page lists it.',
      ],
      ['Can I try before I buy?', 'The discovery set has six 2 ml vials for €28, credited against a full bottle.'],
      [
        'Are your perfumes natural?',
        '96 percent of our materials are of natural origin. We use a few safe synthetics, like musks, where nature has no ethical option.',
      ],
    ],
  ],
  [
    'Refills & returns',
    [
      [
        'How do refills work?',
        'Bring an empty VAYNE bottle to any stockist or post it to us. A refill costs 30 percent less.',
      ],
      [
        'Can I return a perfume?',
        'Unopened bottles can be returned within 30 days. If you have opened it and dislike it, write to us anyway.',
      ],
    ],
  ],
];

export default function Faq() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const mob = w < 900;
  const [open, setOpen] = useState('0-0');
  const css = `.fq{width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;min-height:64px;background:none;border:0;border-top:1px solid ${PAL.line};padding:14px 0;font:400 ${mob ? 22 : 26}px/1.2 ${SERIF};color:${PAL.ink};cursor:pointer;text-align:left}.fq:hover{color:${PAL.jun}}.fq i{font-style:normal;font:400 22px ${SANS};transition:transform .5s ${EASE}}.fq[aria-expanded="true"] i{transform:rotate(45deg)}.fa{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s ${EASE}}.fa.on{grid-template-rows:1fr}.fa>div{overflow:hidden}`;

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
      <style>{css}</style>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : '1fr 1.6fr',
          gap: mob ? 32 : 80,
        }}
      >
        <div>
          <div style={{ position: mob ? 'relative' : 'sticky', top: 120 }}>
            <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>Help</div>
            <SplitText
              as="h1"
              text="Questions, answered"
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 46 : 72, lineHeight: 1, marginTop: 12 }}
              italic={[1]}
            />
            {!mob && (
              <nav aria-label="FAQ sections" style={{ display: 'grid', gap: 10, marginTop: 36 }}>
                {SECTIONS.map(([title], i) => (
                  <a key={title} className="au-link" href={'#fq' + i} style={{ justifySelf: 'start' }}>
                    {title}
                  </a>
                ))}
              </nav>
            )}
            <p style={{ margin: '32px 0 0', fontSize: 15, color: PAL.mute }}>
              Still stuck?{' '}
              <Link className="au-link" href="/contact">
                Write to us
              </Link>
            </p>
          </div>
        </div>
        <div>
          {SECTIONS.map(([title, items], si) => (
            <Reveal key={title} style={{ marginBottom: 48 }}>
              <h2
                id={'fq' + si}
                style={{
                  margin: '0 0 12px',
                  font: `600 12px ${SANS}`,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: PAL.jun,
                  scrollMarginTop: 120,
                }}
              >
                {title}
              </h2>
              <div style={{ borderBottom: `1px solid ${PAL.line}` }}>
                {items.map(([q, a], qi) => {
                  const id = si + '-' + qi;
                  const on = open === id;
                  return (
                    <div key={q}>
                      <button className="fq" aria-expanded={on} aria-controls={'a' + id} onClick={() => setOpen(on ? '' : id)}>
                        {q}
                        <i aria-hidden="true">+</i>
                      </button>
                      <div id={'a' + id} className={'fa' + (on ? ' on' : '')}>
                        <div>
                          <p style={{ margin: 0, padding: '0 0 22px', fontSize: 16, lineHeight: 1.65, color: PAL.mute, maxWidth: 600 }}>
                            {a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
