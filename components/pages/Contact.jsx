'use client';

import { useRef, useState } from 'react';
import { Reveal, SplitText } from '@/components/motion';
import { CONTACT, IMG, photo } from '@/lib/data';
import { useWidth } from '@/lib/hooks';
import { PAL, SANS, SERIF } from '@/lib/theme';

const TOPICS = ['An order', 'Finding a scent', 'Refills', 'Press', 'Something else'];

export default function Contact() {
  const ref = useRef(null);
  const w = useWidth(ref);
  const mob = w < 900;
  const [topic, setTopic] = useState(1);
  const [sent, setSent] = useState(false);
  const css = `.tp{min-height:44px;padding:0 18px;border-radius:999px;border:1.5px solid ${PAL.ghost};background:transparent;font:500 14px ${SANS};color:${PAL.ink};cursor:pointer;transition:background .2s,border-color .2s,color .2s}.tp:hover{border-color:${PAL.ink}}.tp[aria-checked="true"]{background:${PAL.jun};border-color:${PAL.jun};color:${PAL.cream}}`;

  return (
    <section ref={ref} className="au" style={{ width: '100%', background: PAL.mist, fontFamily: SANS, color: PAL.ink }}>
      <style>{css}</style>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', minHeight: '100vh' }}>
        <Reveal y={0} style={{ position: 'relative', minHeight: mob ? 320 : '100%' }}>
          <img
            src={photo(IMG.linen)}
            alt="Morning light falling on linen"
            loading="eager"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Reveal>
        <div style={{ padding: mob ? '48px 20px 110px' : '160px 72px 100px', maxWidth: 640 }}>
          <div style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}>Contact</div>
          <SplitText
            as="h1"
            text="Write to the atelier"
            style={{ fontFamily: SERIF, fontWeight: 400, fontSize: mob ? 46 : 80, lineHeight: 0.98, marginTop: 12 }}
            italic={[3]}
          />
          <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.6, color: PAL.mute }}>
            Claire or Léon will reply, usually within a day. Or write to{' '}
            <a className="au-link" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>{' '}
            and call{' '}
            <a className="au-link" href={`tel:${CONTACT.tel}`}>
              {CONTACT.phone}
            </a>
            .
          </p>
          {sent ? (
            <p role="status" style={{ marginTop: 40, fontFamily: SERIF, fontSize: 30 }}>
              Merci. Your note is on its way.
            </p>
          ) : (
            <form
              className="au-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              style={{ display: 'grid', gap: 14, marginTop: 36 }}
            >
              <div role="radiogroup" aria-label="Topic" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TOPICS.map((t, i) => (
                  <button key={t} type="button" className="tp" role="radio" aria-checked={topic === i} onClick={() => setTopic(i)}>
                    {t}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 14 }}>
                <label>
                  Name
                  <input required name="name" autoComplete="name" />
                </label>
                <label>
                  Email
                  <input required type="email" name="email" autoComplete="email" />
                </label>
              </div>
              <label>
                Message
                <textarea required name="msg" rows={5} style={{ resize: 'vertical', paddingTop: 12 }} />
              </label>
              <button className="au-btn" type="submit" style={{ justifySelf: 'start' }}>
                Send message <i>→</i>
              </button>
            </form>
          )}
          <div
            style={{
              marginTop: 48,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
              fontSize: 15,
              lineHeight: 1.6,
              color: PAL.mute,
            }}
          >
            <div>
              <strong style={{ color: PAL.ink }}>Atelier</strong>
              <br />
              {CONTACT.address[0]}
              <br />
              {CONTACT.address[1]}
            </div>
            <div>
              <strong style={{ color: PAL.ink }}>Hours</strong>
              <br />
              Tue–Sat
              <br />
              11:00–19:00
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
