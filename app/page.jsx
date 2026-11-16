import Atelier from '@/components/home/Atelier';
import FigScroll from '@/components/home/FigScroll';
import Hero from '@/components/home/Hero';
import Signatures from '@/components/home/Signatures';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FigScroll />
      <Signatures />
      <Atelier />
    </>
  );
}
