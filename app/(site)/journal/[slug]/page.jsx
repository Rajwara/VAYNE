import { notFound } from 'next/navigation';
import JournalDetail from '@/components/pages/JournalDetail';
import { JOURNAL } from '@/lib/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return JOURNAL.map((j) => ({ slug: j.s }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const j = JOURNAL.find((x) => x.s === slug);
  if (!j) return {};
  return {
    title: { absolute: `${j.t} · VAYNE Journal` },
    description: j.ex,
  };
}

export default async function JournalStoryPage({ params }) {
  const { slug } = await params;
  if (!JOURNAL.some((j) => j.s === slug)) notFound();
  return <JournalDetail slug={slug} />;
}
