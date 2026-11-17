import './globals.css';
import { showSwitcher } from '@/components/SiteChrome';
import { FONTS, PALETTES, THEME_KEY } from '@/lib/themes';

// Applies a saved theme before first paint so there is no colour flash on reload.
const restoreTheme = `try{var t=JSON.parse(localStorage.getItem(${JSON.stringify(THEME_KEY)})||'null');if(t){var P=${JSON.stringify(
  PALETTES.map((p) => [p.id, p.vars]),
)},F=${JSON.stringify(FONTS.map((f) => [f.id, f.serif, f.sans, f.google, f.display || [f.serif, '400', '0.02em']]))},s=document.documentElement.style;P.forEach(function(p){if(p[0]===t.pal)for(var k in p[1])s.setProperty('--'+k,p[1][k])});F.forEach(function(f){if(f[0]===t.font){s.setProperty('--serif',f[1]);s.setProperty('--sans',f[2]);s.setProperty('--display',f[4][0]);s.setProperty('--display-weight',f[4][1]);s.setProperty('--display-spacing',f[4][2]);if(f[3]){var l=document.createElement('link');l.id='font-'+f[0];l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?'+f[3]+'&display=swap';document.head.appendChild(l)}}})}}catch(e){}`;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VAYNE — Eau de Parfum',
    template: '%s — VAYNE',
  },
  description: 'Small-batch perfume from Paris. Green fig at first light.',
  openGraph: {
    type: 'website',
    siteName: 'VAYNE',
    title: 'VAYNE — Eau de Parfum',
    description: 'Small-batch perfume from Paris. Green fig at first light.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'VAYNE Figuier Vert eau de parfum' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VAYNE — Eau de Parfum',
    description: 'Small-batch perfume from Paris. Green fig at first light.',
    images: ['/og.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E4E4E1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2" as="font" type="font/woff2" crossOrigin="" />
        {showSwitcher && <script dangerouslySetInnerHTML={{ __html: restoreTheme }} />}
      </head>
      <body>{children}</body>
    </html>
  );
}
