'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BOOKS, SHELVES } from './books';
import Cover from './Cover';
import styles from './Bookshelf.module.css';
import './fonts.css';

// Animation timings (ms). Kept in one place so CSS transitions and timers agree.
const T = { fly: 650, open: 1100, close: 750, back: 550 };

const Icon = {
  home: (
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  ),
  library: (
    <>
      <path d="M4 4h4v16H4zM10 4h4v16h-4z" />
      <path d="m16 5 3.8-1 3 15.5-3.8 1z" />
    </>
  ),
  shop: (
    <>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  news: (
    <>
      <path d="M4 5h13v14H6a2 2 0 0 1-2-2z" />
      <path d="M17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
};

function Svg({ children, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function Logo({ brand }) {
  return (
    <div className={styles.logo}>
      <svg width="34" height="20" viewBox="0 0 34 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="9" cy="11" r="6.5" />
        <circle cx="25" cy="11" r="6.5" />
        <path d="M15.5 10c.9-1 2.1-1 3 0M2.5 9 1 4M31.5 9 33 4" strokeLinecap="round" />
      </svg>
      <span>{brand}</span>
    </div>
  );
}

const usePrefersReducedMotion = () => {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return r;
};

/** Size and position of the opened book for the current viewport. */
function layoutFor(vw, vh) {
  const single = vw < 720;
  let H, W;
  if (single) {
    W = Math.min(vw - 32, 420);
    H = Math.min(vh - 96, W * 1.5);
  } else {
    H = Math.min(vh * 0.74, 580);
    W = H * 0.68;
    const maxW = (vw - 64) / 2;
    if (W > maxW) {
      W = maxW;
      H = W / 0.68;
    }
  }
  return { single, W, H, left: vw / 2 - W / 2, top: vh / 2 - H / 2 };
}

function Stars({ value }) {
  return (
    <span className={styles.stars} aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className={styles.star} style={{ '--fill': `${fill * 100}%` }} aria-hidden="true">
            ★
          </span>
        );
      })}
    </span>
  );
}

/** The flying, opening book shown above the page. */
function OpenBook({ book, from, onClosed, reduced, getRect, ctaLabel }) {
  const [phase, setPhase] = useState('start'); // start → fly → opening → open → closing → back
  const [geo, setGeo] = useState(() => layoutFor(window.innerWidth, window.innerHeight));
  const [backRect, setBackRect] = useState(null);
  const [added, setAdded] = useState(false);
  const closeRef = useRef(null);
  const timers = useRef([]);
  const t = (k) => (reduced ? 1 : T[k]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    const onResize = () => setGeo(layoutFor(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', onResize);
    // Two frames so the start transform is painted before transitioning away from it.
    let r2;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        setPhase('fly');
        later(() => setPhase('opening'), t('fly'));
        later(() => {
          setPhase('open');
          closeRef.current?.focus({ preventScroll: true });
        }, t('fly') + t('open'));
      });
    });
    const list = timers.current;
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      list.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    if (phase === 'closing' || phase === 'back') return;
    timers.current.forEach(clearTimeout);
    setPhase('closing');
    later(() => {
      setBackRect(getRect());
      setPhase('back');
      later(onClosed, t('back'));
    }, t('close'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, getRect, onClosed]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const { W, H, left, top, single } = geo;
  const toShelf = (r) =>
    r
      ? `translate(${r.left - left}px, ${r.top - top}px) scale(${r.width / W}, ${r.height / H})`
      : `translate(0, 40px) scale(.6)`;

  const atShelf = phase === 'start' || phase === 'back';
  const isOpen = phase === 'opening' || phase === 'open';
  const stageTransform = atShelf ? toShelf(phase === 'back' ? backRect : from) : 'none';
  const stageTransition =
    phase === 'fly'
      ? `transform ${t('fly')}ms cubic-bezier(.2,.8,.2,1)`
      : phase === 'back'
        ? `transform ${t('back')}ms cubic-bezier(.5,0,.3,1), opacity ${t('back')}ms linear`
        : 'none';

  const pct = book.progress ? Math.round(book.progress * 100) : null;

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} by ${book.author}`}
      style={{ '--fly': `${t('fly')}ms`, '--open': `${t('open')}ms`, '--close': `${t('close')}ms` }}
    >
      <button className={styles.backdrop} aria-label="Close book" tabIndex={-1} onClick={close} />
      <div
        className={styles.stage}
        style={{
          left,
          top,
          width: W,
          height: H,
          transform: stageTransform,
          transition: stageTransition,
          opacity: phase === 'back' && !backRect ? 0 : 1,
        }}
      >
        <div
          className={`${styles.book3d} ${single ? styles.single : ''}`}
          data-open={isOpen}
          style={{ transform: isOpen && !single ? `translateX(${W / 2}px)` : 'none' }}
        >
          {/* Right-hand page: everything about the book */}
          <div className={styles.pageRight}>
            <div className={styles.pageInner} data-show={phase === 'open'}>
              <p className={styles.kicker}>
                {book.genre} · {book.year}
              </p>
              <h2 className={styles.bookTitle}>{book.title}</h2>
              <p className={styles.bookAuthor}>by {book.author}</p>
              <div className={styles.metaRow}>
                <Stars value={book.rating} />
                <span>{book.rating.toFixed(1)}</span>
                <span className={styles.dot} />
                <span>{book.pages} pages</span>
              </div>
              <p className={styles.blurb}>{book.blurb}</p>
              {pct !== null && (
                <div className={styles.readProgress}>
                  <div className={styles.readBar}>
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <span>
                    {pct}% · page {Math.round(book.pages * book.progress)} of {book.pages}
                  </span>
                </div>
              )}
              <div className={styles.actions}>
                <button className={styles.primary} type="button">
                  {pct !== null ? 'Continue reading' : book.shelf === 'finished' ? 'Read again' : 'Start reading'}
                </button>
                <button className={styles.secondary} type="button" onClick={() => setAdded(true)} aria-live="polite">
                  {added ? 'Added ✓' : `${ctaLabel} · $${book.price}`}
                </button>
              </div>
              <button ref={closeRef} className={styles.closeLink} type="button" onClick={close}>
                ← Back to shelf
              </button>
            </div>
          </div>

          {/* A few loose leaves that flutter over after the cover */}
          {!single &&
            [0, 1, 2].map((i) => (
              <div key={i} className={styles.leaf} style={{ '--i': i }} aria-hidden="true" />
            ))}

          {/* The cover: front face + inside (left page) */}
          <div className={styles.coverHinge}>
            <div className={styles.face}>
              <Cover book={book} className={styles.bigCover} />
            </div>
            <div className={`${styles.face} ${styles.faceBack}`} style={{ '--ac': book.palette?.[1] || '#8a5a2b' }}>
              <div className={styles.endpaper} aria-hidden="true" />
              <div className={styles.exlibris}>
                <span>Ex libris</span>
                <strong>{book.title}</strong>
                <em>{book.author}</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A book standing on a shelf (or in the grid). */
function ShelfBook({ book, i, showTitle, lifted, onOpen, setRef }) {
  return (
    <div className={styles.bookSlot} style={{ '--i': i }}>
      <button
        ref={setRef}
        type="button"
        className={styles.book}
        data-lifted={lifted}
        onClick={() => onOpen(book)}
        aria-label={`Open ${book.title} by ${book.author}`}
      >
        <Cover book={book} />
      </button>
      {book.progress != null && !showTitle && (
        <span className={styles.progress} aria-label={`${Math.round(book.progress * 100)}% read`}>
          <span style={{ width: `${book.progress * 100}%` }} />
        </span>
      )}
      {showTitle && (
        <span className={styles.gridCaption}>
          <strong>{book.title}</strong>
          <span>{book.author}</span>
        </span>
      )}
    </div>
  );
}

export default function Bookshelf({ books = BOOKS, shelves = SHELVES, brand = 'Folio', user = 'Stephan', ctaLabel = 'Buy' }) {
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = useState('shelves');
  const [query, setQuery] = useState('');
  const [shelfFilter, setShelfFilter] = useState('all');
  const [active, setActive] = useState(null); // { book, from }
  const [nav, setNav] = useState('library');
  const bookRefs = useRef({});

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () => books.filter((b) => !q || `${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(q)),
    [books, q],
  );
  const reading = books.find((b) => b.shelf === 'reading');

  const openBook = (book) => {
    const el = bookRefs.current[book.id];
    const r = el?.getBoundingClientRect();
    setActive({ book, from: r ? { left: r.left, top: r.top, width: r.width, height: r.height } : null });
  };

  const getRect = useCallback(() => {
    if (!active) return null;
    const el = bookRefs.current[active.book.id];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const onScreen = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
    return onScreen ? { left: r.left, top: r.top, width: r.width, height: r.height } : null;
  }, [active]);

  const onClosed = useCallback(() => {
    const id = active?.book.id;
    setActive(null);
    requestAnimationFrame(() => bookRefs.current[id]?.focus({ preventScroll: true }));
  }, [active]);

  // Lock page scroll while a book is open.
  useEffect(() => {
    if (!active) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [active]);

  const shelfBook = (b, i, showTitle) => (
    <ShelfBook
      key={b.id}
      book={b}
      i={i}
      showTitle={showTitle}
      lifted={active?.book.id === b.id}
      onOpen={openBook}
      setRef={(el) => {
        bookRefs.current[b.id] = el;
      }}
    />
  );

  const navItems = [
    ['home', 'Home', Icon.home],
    ['library', 'My library', Icon.library],
    ['shop', 'Shop', Icon.shop],
    ['news', 'News', Icon.news],
  ];

  return (
    <section className={styles.root} aria-label={`${brand} library`}>
      <div className={styles.app}>
        <aside className={styles.sidebar}>
          <Logo brand={brand} />
          <nav className={styles.nav} aria-label="Library">
            {navItems.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                className={styles.navItem}
                aria-current={nav === id ? 'page' : undefined}
                onClick={() => setNav(id)}
              >
                <Svg>{icon}</Svg>
                {label}
              </button>
            ))}
          </nav>
          {reading && (
            <button type="button" className={styles.continue} onClick={() => openBook(reading)}>
              <span className={styles.continueLabel}>Continue reading</span>
              <span className={styles.continueCover}>
                <Cover book={reading} />
              </span>
              <span className={styles.progress} aria-hidden="true">
                <span style={{ width: `${(reading.progress || 0) * 100}%` }} />
              </span>
            </button>
          )}
          <div className={styles.user}>
            <span className={styles.avatar} aria-hidden="true">
              {user.slice(0, 1)}
            </span>
            <span>{user}</span>
            <span className={styles.chev} aria-hidden="true">
              ›
            </span>
          </div>
        </aside>

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <div className={styles.tabs} role="tablist" aria-label="View">
              {[
                ['shelves', 'Shelves'],
                ['all', 'All Books'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={styles.tab}
                  onClick={() => {
                    setTab(id);
                    setShelfFilter('all');
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className={styles.search}>
              <Svg size={16}>{Icon.search}</Svg>
              <span className={styles.srOnly}>Search your library</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search in My library" />
            </label>
          </div>

          {tab === 'shelves' ? (
            <div className={styles.shelves} key={'shelves' + q}>
              {shelves.map((shelf) => {
                const list = matches.filter((b) => b.shelf === shelf.id);
                if (!list.length) return null;
                return (
                  <section key={shelf.id} className={styles.shelf} aria-labelledby={'sh-' + shelf.id}>
                    <header className={styles.shelfHead}>
                      <h3 id={'sh-' + shelf.id}>{shelf.title}</h3>
                      {list.length > 3 && (
                        <button
                          type="button"
                          className={styles.fullShelf}
                          onClick={() => {
                            setTab('all');
                            setShelfFilter(shelf.id);
                          }}
                        >
                          Full shelf <span aria-hidden="true">→</span>
                        </button>
                      )}
                    </header>
                    <div className={styles.row}>
                      {list.map((b, i) => shelfBook(b, i))}
                    </div>
                    <div className={styles.plank} aria-hidden="true" />
                  </section>
                );
              })}
              {!matches.length && <p className={styles.empty}>No books match “{query}”.</p>}
            </div>
          ) : (
            <div className={styles.allBooks} key={'all' + q + shelfFilter}>
              <div className={styles.chips}>
                {[{ id: 'all', title: 'All' }, ...shelves].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={styles.chip}
                    aria-pressed={shelfFilter === s.id}
                    onClick={() => setShelfFilter(s.id)}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
              <div className={styles.grid}>
                {matches
                  .filter((b) => shelfFilter === 'all' || b.shelf === shelfFilter)
                  .map((b, i) => shelfBook(b, i, true))}
              </div>
              {!matches.length && <p className={styles.empty}>No books match “{query}”.</p>}
            </div>
          )}
        </div>
      </div>

      {active && (
        <OpenBook
          key={active.book.id}
          book={active.book}
          from={active.from}
          reduced={reduced}
          getRect={getRect}
          onClosed={onClosed}
          ctaLabel={ctaLabel}
        />
      )}
    </section>
  );
}
