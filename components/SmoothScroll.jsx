'use client';

import { useEffect } from 'react';

/** Lenis smooth wheel scrolling on desktop (skipped for touch and reduced motion). */
export default function SmoothScroll() {
  useEffect(() => {
    const mq = (q) => window.matchMedia && window.matchMedia(q).matches;
    if (mq('(prefers-reduced-motion: reduce)') || mq('(pointer: coarse)')) return;
    let lenis;
    let raf = 0;
    let cancelled = false;
    import('lenis')
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - (1 - t) ** 4, smoothWheel: true });
        const loop = (time) => {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
  return null;
}
