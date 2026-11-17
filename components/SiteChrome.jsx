import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import ThemeSwitcher from '@/components/ThemeSwitcher';

// Set NEXT_PUBLIC_THEME_SWITCHER=off on Vercel to hide the floating theme button.
export const showSwitcher = process.env.NEXT_PUBLIC_THEME_SWITCHER !== 'off';

/** VAYNE navigation, footer, smooth scroll and theme switcher around a page. */
export default function SiteChrome({ children }) {
  return (
    <>
      <SmoothScroll />
      <div className="site">
        <Nav />
        <div className="nav-spacer" aria-hidden="true" />
        <main>{children}</main>
        <Footer />
      </div>
      {showSwitcher && <ThemeSwitcher />}
    </>
  );
}
