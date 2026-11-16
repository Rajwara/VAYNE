'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BAG_EVENT, getBag, setBag } from '@/lib/bag';
import { SCENTS } from '@/lib/data';
import { BRAND, PAL, SANS, SERIF } from '@/lib/theme';

const LINKS = [
  ['Collection', '/collection'],
  ['Story', '/story'],
  ['Journal', '/journal'],
  ['Stockists', '/stockists'],
];

export default function Nav() {
  const path = usePathname() || '/';
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bag, setItems] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pop, setPop] = useState(0);

  useEffect(() => {
    setItems(getBag());
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 30);
      const dy = y - last;
      if (dy > 2) {
        setHidden(y > 60);
        last = y;
      } else if (dy < -16 || y < 60) {
        setHidden(false);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onBag = (e) => {
      setItems(e.detail.b);
      if (e.detail.open) {
        setPop((n) => n + 1);
        setBagOpen(true);
      }
    };
    window.addEventListener(BAG_EVENT, onBag);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenu(false);
        setBagOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(BAG_EVENT, onBag);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Close overlays when the route changes.
  useEffect(() => {
    setMenu(false);
    setBagOpen(false);
    setSearchOpen(false);
  }, [path]);

  useEffect(() => {
    document.documentElement.style.overflow = menu || bagOpen || searchOpen ? 'hidden' : '';
  }, [menu, bagOpen, searchOpen]);

  const current = (href) => (path === href || path.startsWith(href + '/') ? 'page' : undefined);
  const count = bag.reduce((s, i) => s + i.q, 0);
  const subtotal = bag.reduce((s, i) => s + i.q * i.price, 0);
  const results = SCENTS.filter((s) =>
    (s.n + ' ' + s.fam + ' ' + s.notes.map((n) => n[1]).join(' ')).toLowerCase().includes(query.toLowerCase()),
  );
  const change = (idx, d) => {
    const next = bag.map((i) => ({ ...i }));
    next[idx].q += d;
    setBag(next.filter((i) => i.q > 0));
  };

  return (
    <div className="au">
      <nav
        className={`an${solid || menu ? ' solid' : ''}${menu ? ' open' : ''}${hidden && !menu ? ' hid' : ''}`}
        aria-label="Main"
      >
        <div className="an-bar">
          <div className="an-l">
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href} aria-current={current(href)}>
                {label}
              </Link>
            ))}
          </div>
          <button className="menu" aria-expanded={menu} aria-controls="an-sheet" onClick={() => setMenu(!menu)}>
            {menu ? 'Close' : 'Menu'}
          </button>
          <Link className="logo" href="/" aria-label={`${BRAND} home`}>
            {BRAND}
          </Link>
          <div className="an-r">
            <button className="srch" onClick={() => setSearchOpen(true)} aria-haspopup="dialog">
              Search
            </button>
            <button
              className="bag"
              onClick={() => setBagOpen(true)}
              aria-haspopup="dialog"
              aria-label={`Bag, ${count} items`}
            >
              Bag (
              <b key={pop} className={pop ? 'pop' : ''}>
                {count}
              </b>
              )
            </button>
          </div>
        </div>
        <div className="an-sheet" id="an-sheet" aria-hidden={!menu}>
          {[...LINKS, ['Contact', '/contact'], ['FAQ', '/faq']].map(([label, href]) => (
            <Link key={href} href={href} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div
        className={`an-ov${bagOpen || searchOpen ? ' on' : ''}`}
        onClick={() => {
          setBagOpen(false);
          setSearchOpen(false);
        }}
        aria-hidden="true"
      />

      <div
        className={`an-search${searchOpen ? ' on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search scents"
        aria-hidden={!searchOpen}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label
            htmlFor="an-q"
            style={{ font: `600 12px ${SANS}`, letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.jun }}
          >
            Search the collection
          </label>
          <button className="an-x" onClick={() => setSearchOpen(false)} tabIndex={searchOpen ? 0 : -1}>
            Close
          </button>
        </div>
        <input
          id="an-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Fig, neroli, cedar…"
          tabIndex={searchOpen ? 0 : -1}
          autoComplete="off"
        />
        <div className="an-res" style={{ marginTop: 16, maxWidth: 900 }}>
          {results.map((s) => (
            <Link key={s.k} href={'/collection/' + s.k} tabIndex={searchOpen ? 0 : -1}>
              <span>
                {s.n}{' '}
                <span style={{ font: `400 14px ${SANS}`, color: PAL.mute }}>
                  {s.fam} · {s.notes.map((n) => n[1]).join(', ')}
                </span>
              </span>
              <span style={{ font: `500 15px ${SANS}` }}>€{s.price}</span>
            </Link>
          ))}
          {!results.length && (
            <p style={{ font: `16px ${SANS}`, color: PAL.mute }}>
              Nothing matches “{query}”. Try a note like fig or vetiver.
            </p>
          )}
        </div>
      </div>

      <aside
        className={`an-drawer${bagOpen ? ' on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        aria-hidden={!bagOpen}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: `1px solid ${PAL.line}`,
          }}
        >
          <h2 style={{ margin: 0, font: `400 30px ${SERIF}` }}>Your bag</h2>
          <button className="an-x" onClick={() => setBagOpen(false)} tabIndex={bagOpen ? 0 : -1}>
            Close
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }} data-lenis-prevent="">
          {!bag.length && (
            <div style={{ padding: '40px 0' }}>
              <p style={{ font: `400 22px ${SERIF}`, margin: '0 0 18px' }}>Your bag is empty.</p>
              <Link className="au-btn" href="/collection" tabIndex={bagOpen ? 0 : -1}>
                Browse the collection <i>→</i>
              </Link>
            </div>
          )}
          {bag.map((item, idx) => (
            <div
              key={item.k + item.size}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                gap: 16,
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: `1px solid ${PAL.line}`,
              }}
            >
              <div style={{ width: 72, height: 90, borderRadius: 12, background: item.tint }}>
                <img
                  src={item.img}
                  alt={item.n + ' bottle'}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ font: `400 20px ${SERIF}` }}>{item.n}</div>
                <div style={{ fontSize: 14, color: PAL.mute }}>{item.size} · Eau de Parfum</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
                  <button className="qb" aria-label="Remove one" onClick={() => change(idx, -1)} tabIndex={bagOpen ? 0 : -1}>
                    −
                  </button>
                  <span>{item.q}</span>
                  <button className="qb" aria-label="Add one" onClick={() => change(idx, 1)} tabIndex={bagOpen ? 0 : -1}>
                    +
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 600 }}>€{item.q * item.price}</div>
            </div>
          ))}
        </div>
        {!!bag.length && (
          <div style={{ padding: '20px 24px 32px', borderTop: `1px solid ${PAL.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: 6 }}>
              <span>Subtotal</span>
              <span>€{subtotal}</span>
            </div>
            <p style={{ fontSize: 13, color: PAL.mute, margin: '0 0 16px' }}>
              Complimentary samples and shipping over €100. Checkout opens Contact for now.
            </p>
            <Link className="au-btn" href="/contact" style={{ width: '100%' }} tabIndex={bagOpen ? 0 : -1}>
              Checkout <i>→</i>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
