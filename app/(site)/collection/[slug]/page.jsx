import { notFound } from 'next/navigation';
import ScentDetail from '@/components/pages/ScentDetail';
import { SCENTS } from '@/lib/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return SCENTS.map((s) => ({ slug: s.k }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = SCENTS.find((x) => x.k === slug);
  if (!s) return {};
  return {
    title: { absolute: `${s.n} · VAYNE` },
    description: s.line,
  };
}

export default async function ScentPage({ params }) {
  const { slug } = await params;
  if (!SCENTS.some((s) => s.k === slug)) notFound();
  return <ScentDetail slug={slug} />;
}
