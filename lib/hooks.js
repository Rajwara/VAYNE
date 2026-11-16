'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp } from './theme';

/** Width of the referenced element (defaults to 1200 before mount). */
export function useWidth(ref) {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.offsetWidth || 1200);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setW(el.offsetWidth || 1200));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

/** Viewport height. */
export function useVh() {
  const [h, setH] = useState(800);
  useEffect(() => {
    const update = () => {
      const ih = window.innerHeight || 800;
      const ch = document.documentElement?.clientHeight || ih;
      setH(Math.min(ih, ch) || 800);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return h;
}

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return r;
}

/**
 * Smoothed scroll progress (0..1) of an element.
 * mode "sticky": progress through a tall section whose child is sticky.
 * mode "view":   progress from entering to leaving the viewport.
 */
export function useScrollProgress(ref, mode = 'sticky') {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let cur = -1;
    let target = 0;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let v = 0;
      if (mode === 'sticky') {
        const span = r.height - vh;
        v = span > 0 ? -r.top / span : 0;
      } else v = (vh - r.top) / (vh + r.height);
      target = clamp(v);
    };
    const tick = () => {
      raf = 0;
      measure();
      if (cur < 0 || reduced) cur = target;
      else cur += (target - cur) * 0.16;
      if (Math.abs(target - cur) < 4e-4) cur = target;
      setP(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      cancelAnimationFrame(raf);
    };
  }, [ref, mode]);
  return p;
}

/** [ref, inView] — flips to true once the element crosses `threshold`. */
export function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}
