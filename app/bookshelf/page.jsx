import Bookshelf from '@/components/bookshelf/Bookshelf';

export const metadata = {
  title: { absolute: 'My library — Bookshelf' },
  description: 'Bookshelf section with an animated open-book preview.',
  robots: { index: false },
};

export default function BookshelfPage() {
  return <Bookshelf brand="Folio" user="Stephan" />;
}
