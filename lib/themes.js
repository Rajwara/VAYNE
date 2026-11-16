// Colour palettes and font pairings offered by the floating theme switcher.
// Each palette sets the same six CSS variables used across the site:
//   mist  page background      ink   main text
//   jun   brand accent (buttons, footer, labels)
//   ghost soft outlines / ghost words      cream light surface + text on accent
//   mute  secondary text

export const PALETTES = [
  {
    id: 'fig',
    name: 'Fig leaf',
    vars: { mist: '#E9EAE5', ink: '#1B1E19', jun: '#3C4A33', ghost: '#D3D7CE', cream: '#F3EEDF', mute: '#5C6158' },
  },
  {
    id: 'noir',
    name: 'Noir',
    vars: { mist: '#EFEDE8', ink: '#121212', jun: '#1E1E1E', ghost: '#DAD7D0', cream: '#F6F2EA', mute: '#5E5B55' },
  },
  {
    id: 'rose',
    name: 'Rose clay',
    vars: { mist: '#F3E9E5', ink: '#2A1D1B', jun: '#7A3F3A', ghost: '#E6D2CC', cream: '#FBF3EE', mute: '#6E5B57' },
  },
  {
    id: 'ocean',
    name: 'Deep sea',
    vars: { mist: '#E5EBED', ink: '#13202A', jun: '#1F4558', ghost: '#CAD7DC', cream: '#F2EFE7', mute: '#55656D' },
  },
  {
    id: 'amber',
    name: 'Amber',
    vars: { mist: '#F1EBDF', ink: '#241C12', jun: '#8A5A22', ghost: '#E2D5BD', cream: '#FBF4E4', mute: '#6B604F' },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    vars: { mist: '#ECEAF2', ink: '#1D1A29', jun: '#4B3F72', ghost: '#D8D2E6', cream: '#F6F2EA', mute: '#615C70' },
  },
  {
    id: 'oxblood',
    name: 'Oxblood',
    vars: { mist: '#EEE8E3', ink: '#1F1416', jun: '#5B1A24', ghost: '#DFD3CF', cream: '#F7EFE6', mute: '#675A5A' },
  },
  {
    id: 'sage',
    name: 'Sage & gold',
    vars: { mist: '#E8EBE3', ink: '#1E211B', jun: '#6B5B2E', ghost: '#D3D9CB', cream: '#F7F1DF', mute: '#5D6257' },
  },
];

// `google` is the Google Fonts css2 family query; null means the font is self-hosted.
export const FONTS = [
  {
    id: 'bodoni',
    name: 'Bodoni & Manrope',
    serif: "'Bodoni Moda', 'Didot', Georgia, serif",
    sans: "'Manrope', system-ui, sans-serif",
    google: null,
  },
  {
    id: 'playfair',
    name: 'Playfair & Inter',
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Inter', system-ui, sans-serif",
    google: 'family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600',
  },
  {
    id: 'cormorant',
    name: 'Cormorant & Jost',
    serif: "'Cormorant Garamond', Georgia, serif",
    sans: "'Jost', system-ui, sans-serif",
    google: 'family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500;600',
  },
  {
    id: 'dmserif',
    name: 'DM Serif & DM Sans',
    serif: "'DM Serif Display', Georgia, serif",
    sans: "'DM Sans', system-ui, sans-serif",
    google: 'family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600',
  },
  {
    id: 'fraunces',
    name: 'Fraunces & Work Sans',
    serif: "'Fraunces', Georgia, serif",
    sans: "'Work Sans', system-ui, sans-serif",
    google: 'family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Work+Sans:wght@400;500;600',
  },
  {
    id: 'gilda',
    name: 'Gilda & Outfit',
    serif: "'Gilda Display', Georgia, serif",
    sans: "'Outfit', system-ui, sans-serif",
    google: 'family=Gilda+Display&family=Outfit:wght@400;500;600',
  },
];

export const THEME_KEY = 'vayne-theme';

/** Apply a palette + font pairing to <html>. Safe to call repeatedly. */
export function applyTheme(paletteId, fontId) {
  const pal = PALETTES.find((p) => p.id === paletteId) || PALETTES[0];
  const font = FONTS.find((f) => f.id === fontId) || FONTS[0];
  const root = document.documentElement.style;
  for (const [k, v] of Object.entries(pal.vars)) root.setProperty('--' + k, v);
  root.setProperty('--serif', font.serif);
  root.setProperty('--sans', font.sans);
  if (font.google && !document.getElementById('font-' + font.id)) {
    const link = document.createElement('link');
    link.id = 'font-' + font.id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${font.google}&display=swap`;
    document.head.appendChild(link);
  }
  return { pal, font };
}
