// Design tokens and small math helpers shared by every section.

export const BRAND = 'VAYNE';

// Colours and fonts resolve to CSS variables so the theme switcher can restyle the
// whole site instantly. Default values live in app/globals.css and lib/themes.js.
export const PAL = {
  mist: 'var(--mist)',
  ink: 'var(--ink)',
  jun: 'var(--jun)',
  leaf: '#6E8F4E',
  ghost: 'var(--ghost)',
  cream: 'var(--cream)',
  amber: '#B5874E',
  mute: 'var(--mute)',
  line: 'var(--line)',
};

export const SERIF = 'var(--serif)';
export const SANS = 'var(--sans)';
export const EASE = 'cubic-bezier(.22,1,.36,1)';

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
/** Progress of `v` between `a` and `b`, clamped to 0..1. */
export const range = (v, a, b) => clamp((v - a) / (b - a));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOut = (t) => 1 - (1 - t) ** 3;
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Mix two #RRGGBB colours. */
export const mixColor = (a, b, t) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return 'rgb(' + pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(',') + ')';
};

export const SIZES = [
  ['30 ml', 0.68],
  ['50 ml', 1],
  ['100 ml', 1.45],
];
export const sizePrice = (price, i) => Math.round((price * SIZES[i][1]) / 2) * 2;

export const titleStyle = (w) => ({
  fontFamily: SERIF,
  fontWeight: 400,
  fontSize: w < 700 ? 40 : w < 1000 ? 56 : 76,
  lineHeight: 1.02,
  letterSpacing: '-0.02em',
  color: PAL.ink,
});

export const eyebrow = (color = PAL.jun) => ({
  font: `600 12px ${SANS}`,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color,
});
