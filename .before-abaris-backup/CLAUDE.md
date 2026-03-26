# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server (Next.js + Turbopack)
bun run build    # Production build
bun run lint     # ESLint
bun start        # Serve production build
```

## Architecture

Next.js 16 app with App Router, Tailwind CSS v4, and `next-intl` for i18n. Norwegian event staffing business site (BarPro).

### i18n Setup

- **Locales:** `no` (default), `en` — configured in `src/i18n/routing.ts`
- **Locale prefix:** `as-needed` — Norwegian paths have no prefix, English gets `/en`
- **Localized pathnames:** `/tjenester`↔`/services`, `/om-oss`↔`/about`, `/kontakt`↔`/contact`
- **Translation files:** `messages/no.json`, `messages/en.json` — flat namespace keys (e.g. `hero.tagline`, `contactPage.form.name`)
- **Navigation:** Use `Link`, `useRouter`, `usePathname` from `src/i18n/navigation.ts` (not from `next/link` or `next/navigation`) to get locale-aware routing
- **Middleware** (`src/middleware.ts`) handles locale detection and routing
- **Route structure:** All pages under `src/app/[locale]/`

### Styling & Design System

- **Tailwind v4** with custom theme in `src/app/globals.css` via `@theme` block
- **Dark luxury aesthetic:** near-black backgrounds, gold (#C9A84C) accents, warm off-white text
- **Color tokens:** `background`, `background-card`, `background-elevated`, `gold`, `gold-hover`, `gold-dim`, `gold-glow`, `text-primary`, `text-muted`, `border`, `border-gold`
- **Fonts:** Cormorant Garamond (`font-display`) for headings, DM Sans (`font-body`) for body — loaded via `next/font/google` with CSS variables
- **Sharp edges enforced globally** — `border-radius: 0 !important` on all elements
- **Animations:** Framer Motion throughout — staggered word reveals, parallax scroll, fade-ins

### Key Patterns

- **Components:** `src/components/ui/` (Button, Card, SectionHeading), `src/components/sections/` (homepage sections), `src/components/layout/` (Header, Footer), `src/components/contact/` (ContactForm)
- **Contact form:** React Hook Form + Zod validation + `next-intl` for translated error messages. Submits to `/api/contact` which sends email via Resend SDK
- **Section labels** use tiny uppercase tracking (`text-[11px] tracking-[0.15em] uppercase text-gold`)

### Environment

- `RESEND_API_KEY` — required for contact form email delivery (see `.env.example`)
