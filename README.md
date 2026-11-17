# VAYNE — Eau de Parfum

Next.js (App Router) website for VAYNE, a small-batch perfume house. Converted from the original Framer export, with the scroll animations, bag drawer, search, filters and forms ported to React components.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo. The Next.js preset is detected automatically; no settings need changing.
3. Optional environment variables:
   - `NEXT_PUBLIC_SITE_URL` – your final domain (e.g. `https://vayne.com`), used for canonical/OG URLs and the sitemap. Defaults to the Vercel production URL.
   - `NEXT_PUBLIC_THEME_SWITCHER=off` – hides the floating **Theme** button once you have picked a look.

## Theme switcher

The floating **Theme** button (bottom-left) lets you try 9 colour palettes and 7 font pairings with one click. The choice is saved in your browser only. **Copy** puts the current palette's hex values and font names on the clipboard.

To make a choice permanent, change the defaults in `app/globals.css` (`:root` variables, `--serif`, `--sans`) and the first entries in `lib/themes.js`.

## Structure

- `app/` – routes, metadata, sitemap, robots, icons
- `components/` – nav, footer, shared motion helpers, home sections, page components
- `lib/data.js` – scents, journal stories, stockists, contact details
- `lib/theme.js` – design tokens (CSS variables) and math helpers
- `lib/themes.js` – palettes and font pairings for the switcher
- `public/` – self-hosted fonts, bottle and photo images, OG image

Forms (newsletter, contact, stockist enquiry) and checkout are front-end only; connect them to a service of your choice.

## Troubleshooting Vercel

If the deployed site shows `404 NOT_FOUND`, open the project in Vercel → **Settings → Build and Deployment** and make sure **Framework Preset** is **Next.js**, **Root Directory** is empty, and **Output Directory** is not overridden. Then redeploy. `vercel.json` already pins the framework to Next.js.

## Bookshelf section (`/bookshelf`)

A self-contained "My library" section for a book store, previewed at `/bookshelf` (not linked from the VAYNE site, and hidden from search engines). Click any book: it lifts off the shelf, flies to the centre and the cover swings open in 3D to show the details. Esc, the backdrop or "Back to shelf" closes it and it flies back. On phones it opens as a single page.

Everything lives in `components/bookshelf/` and does not depend on the rest of this project:

- `Bookshelf.jsx` – the section and the open-book animation
- `Bookshelf.module.css` – styles (colours are CSS variables at the top of `.root`)
- `Cover.jsx` – code-drawn placeholder covers
- `books.js` – demo books and shelves; add `cover: '/covers/your-book.jpg'` to use real cover art
- `fonts.css` + `public/fonts/bookshelf/` – Outfit and Fraunces

To reuse it in another Next.js app, copy that folder and the fonts, then render:

```jsx
import Bookshelf from './components/bookshelf/Bookshelf';

<Bookshelf books={myBooks} shelves={myShelves} brand="Your Store" user="Stephan" ctaLabel="Buy" />
```
