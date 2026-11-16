import { JOURNAL, SCENTS } from '@/lib/data';

const base =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export default function sitemap() {
  const pages = ['', '/collection', '/story', '/journal', '/stockists', '/contact', '/faq', '/privacy', '/terms'];
  return [
    ...pages.map((p) => ({ url: base + p })),
    ...SCENTS.map((s) => ({ url: `${base}/collection/${s.k}` })),
    ...JOURNAL.map((j) => ({ url: `${base}/journal/${j.s}` })),
  ];
}
