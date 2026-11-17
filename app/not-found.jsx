import NotFound from '@/components/pages/NotFound';
import SiteChrome from '@/components/SiteChrome';

export const metadata = {
  title: 'Not found',
  description: 'Page not found.',
};

export default function NotFoundPage() {
  return (
    <SiteChrome>
      <NotFound />
    </SiteChrome>
  );
}
