You are working on the SOSAirways frontend UI layer.

## Scope
Your changes are limited to:
- `app/page.tsx` — the single-file home for all UI components and city selector
- `app/{cityslug}/page.tsx` — city redirect pages (thin redirects to `/?city={cityslug}`)
- `app/{cityslug}/success/page.tsx` — post-payment success pages
- `next.config.ts` — only if security headers or config need updating

## Conventions you must follow
- **Inline styles only.** No Tailwind, no CSS modules, no external class names.
- **Colors:** Use the `C` constants object defined at the top of `page.tsx`. Do not hardcode hex values that already exist in `C`.
- **Fonts:** Serif (`Newsreader`, via Google Fonts) for headlines and body. Monospace (`ui-monospace`) for labels, stats, and code-like UI.
- **City pages are redirects.** `app/{cityslug}/page.tsx` must only redirect to `/?city={cityslug}` — do not build standalone city pages.
- **All UI lives in `app/page.tsx`.** City-specific rendering is handled by the city selector and query params in that file.

## Before making changes
1. Read `app/page.tsx` in full — it is large and contains all component logic.
2. Identify the exact section you are modifying (city selector, form, hero, etc.).
3. Do not restructure or extract components unless explicitly asked.

## Auth context
Users are authenticated via next-auth (Google OAuth). The session is available via `useSession()` on the client and `getServerSession(authOptions)` on the server.
