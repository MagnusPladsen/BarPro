# BarPro Website Redesign — Design Spec

## Context

BarPro's current design (dark #0A0A0A + gold #C9A84C) accidentally overlaps with a competitor. This redesign differentiates with a new palette and typography while keeping the dark premium squared-edge aesthetic. Scope: public landing page, admin panel, employee portal, blog system, and SEO.

## Design Decisions

- **Palette:** Deep Espresso + Rose Gold (option D from brainstorm)
- **Typography:** Contrast Typography — Cormorant italic serif headings + Space Grotesk geometric sans body (option C)
- **Components:** Border Accent — left rose gold accent bar on cards, bottom accent on outline buttons (option C)
- **Admin/Portal:** Shared palette, all sans-serif for readability (option 2)

---

## 1. Design System

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#0D0A08` | Page background |
| `--color-background-card` | `#1A1410` | Card/elevated surfaces |
| `--color-background-elevated` | `#2A211A` | Hover states, active elements |
| `--color-accent` | `#C4907A` | Rose gold primary accent |
| `--color-accent-hover` | `#D4A08A` | Accent hover state |
| `--color-accent-dim` | `#9A6F5C` | Muted accent for watermarks |
| `--color-text-primary` | `#E8DDD4` | Headings, primary text |
| `--color-text-muted` | `#6B5D52` | Secondary text, labels |
| `--color-border` | `rgba(196,144,122,0.08)` | Subtle card/section borders |
| `--color-border-accent` | `#C4907A` | Active borders, left accent bar |

### Typography

| Role | Font | Weight | Style |
|------|------|--------|-------|
| Display headings | Cormorant | 400-500 | Italic |
| Logo "BarPro" | Cormorant | 400 | Italic |
| Sub-headings (mixed) | Space Grotesk | 200 | Normal, uppercase, tracked |
| Body text | Space Grotesk | 300-400 | Normal |
| Labels/caps | Space Grotesk | 400-500 | Uppercase, letter-spacing 0.15-0.25em |
| Buttons | Space Grotesk | 500 | Uppercase, letter-spacing 0.15em |
| Admin UI (all) | Space Grotesk | 300-600 | Normal |

### Signature Elements

- **Left accent border:** 2px solid `#C4907A` on card left edge
- **Bottom accent border:** 2px solid `#C4907A` on outline button bottom
- **Heritage badge:** "EST. 2026 — LILLEHAMMER" in tracked uppercase labels
- **Contrast headlines:** Italic serif line + uppercase sans line
- **Grain overlay:** Subtle noise texture on hero (opacity ~0.03)
- **Squared edges:** `border-radius: 0` globally (kept from current design)
- **Shimmer sweep:** Gold-to-rose-gold shimmer on primary button hover

### Spacing Scale

Kept from current: `py-40` section padding, `max-w-7xl` containers, `gap-8` card grids. No changes to spatial rhythm.

---

## 2. Landing Page

### globals.css Changes

Replace all color tokens with new palette. Replace font imports: Cormorant Garamond → Cormorant, DM Sans → Space Grotesk. Keep all existing keyframes and utility classes, update color values.

### Hero Section

```
[Label] EST. 2026 — LILLEHAMMER (rose gold, tracked)
[Heading line 1] Din anledning. (Cormorant italic, large)
[Heading line 2] VÅR KVALITET. (Space Grotesk, light weight, uppercase, tracked)
[Subtitle] body text (Space Grotesk, muted)
[Buttons] "SEND FORESPØRSEL →" (outline with bottom accent) + "SE PRISER" (text link)
[Contact link] Kontakt oss → (subtle text link below)
```

Corner decorative brackets: updated to rose gold.

### Announcement Bar

Background: `#C4907A`. Text: `#0D0A08`. Same structure, new colors.

### Booking Callout

Border-left accent bar instead of full border. Rose gold glow tint. Same layout.

### Service Cards

- Left accent border (2px rose gold)
- Subtle background tint `rgba(26,20,16,0.5)`
- Title: Cormorant italic
- Number watermark: top-right, rose gold dim
- Description: Space Grotesk, text-muted
- Accent line grows on hover (kept)

### Pricing Cards

- Same structure, new palette
- Popular card: left accent border + top gradient line in rose gold
- Other cards: subtle border, hover adds left accent

### Occasion Cards

- Gradient overlay: espresso tones (`from-[#0D0A08]`) instead of pure black
- Gold accent line → rose gold accent line on hover
- Same image hover scale effect

### Process Section

- Numbers: Cormorant italic, rose gold dim
- Connecting line + diamond dots: rose gold
- Titles: Cormorant italic
- Underline accent below numbers

### FAQ

- Plus icon: rose gold
- Question text hover: rose gold
- Same accordion behavior

### CTA Banner

- Corner accents: rose gold
- Accent line: rose gold
- Side glows: rose gold tint

### Footer

- 4-column layout (kept)
- Gold accent top line → rose gold
- Small rose gold marker on bottom divider
- Company info column (Barpro DA, org.nr, Lillehammer)

---

## 3. Admin Panel

### Palette Application

Replace all hardcoded hex colors across admin pages:

| Current | New | Usage |
|---------|-----|-------|
| `#0A0A0A` | `#0D0A08` | Body background |
| `#111` | `#120E0B` | Sidebar background |
| `#141414` | `#1A1410` | Card background |
| `#1A1A1A` | `#2A211A` | Hover background |
| `#1E1E1E` | `rgba(196,144,122,0.08)` | Borders |
| `#C9A84C` | `#C4907A` | Accent (gold → rose gold) |
| `#D4AF57` | `#D4A08A` | Accent hover |
| `#6B6B6B` | `#6B5D52` | Muted text |
| `#F5F0E8` | `#E8DDD4` | Primary text |

### Typography

All admin text: Space Grotesk. No italic serif in admin — functional readability.

### Component Updates

- **Active nav items:** Left accent border (2px rose gold) instead of background tint
- **Cards:** Left accent border on hover
- **Buttons:** Same rose gold primary + bottom-accent outline style
- **Badges:** Rose gold background with espresso text
- **Toast notifications:** Same colors, new accent

### Files to Update

All files in `src/app/admin/` — replace hex colors with new values. Create shared admin CSS variables or Tailwind tokens.

---

## 4. Employee Portal

Same approach as admin: shared palette, all sans-serif, functional. Update `src/app/portal/` and `src/app/portal/PortalLayoutClient.tsx`.

---

## 5. Login Page

Update `src/app/login/page.tsx` — same palette swap. Logo in Cormorant italic (only decorative element on login).

---

## 6. Offer Page

Update `src/app/offer/[id]/page.tsx` — same palette. Logo and price display use Cormorant italic.

---

## 7. Blog System

### Database

New table `blog_posts`:

```sql
create table blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references employees(id),
  published_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
```

RLS: public read for published posts, authenticated write.

### Admin Blog Page (`/admin/blogg`)

- List view: all posts with title, status badge (draft/published), date
- Edit view: title input, slug (auto-generated from title), content textarea, excerpt, publish/draft toggle
- Preview button
- Delete with confirmation

### Public Blog Page

Replace hardcoded translation-based posts with DB-driven posts. Keep same visual structure (cards with date, title, content). Add pagination.

### Blog Post Page (`/blogg/[slug]`)

New dynamic route reading from `blog_posts` table by slug.

---

## 8. SEO

### Meta Tags (layout.tsx)

Update all `<meta>` tags with accurate descriptions. Add:
- `og:image` — generate or set a default OG image
- `og:type`, `og:url`, `og:locale`
- `twitter:card`, `twitter:title`, `twitter:description`

### Per-Page Titles

Each page exports metadata with unique title and description. Format: `"Page Name | BarPro"`.

### sitemap.xml

Create `src/app/sitemap.ts` generating sitemap for all public routes including blog posts.

### robots.txt

Create `src/app/robots.ts` allowing all crawlers, pointing to sitemap. Block `/admin`, `/portal`, `/login`, `/offer`.

### Structured Data

Add JSON-LD to the root layout:
- `LocalBusiness` schema with name, address (Lillehammer), phone, email
- `Organization` schema with logo, social links

### Image Alt Text

Audit all `<Image>` components — ensure descriptive alt text on every image.

---

## 9. Implementation Order

1. **Design system** — Update globals.css tokens, font imports
2. **Landing page** — Update all section components
3. **Admin panel** — Palette swap across all admin files
4. **Employee portal** — Palette swap
5. **Login + Offer pages** — Palette swap
6. **Blog system** — DB table, admin editor, public pages
7. **SEO** — Meta tags, sitemap, robots, structured data, alt text

Each step is independently deployable and testable.

---

## Files Changed

### New Files
- `supabase/012-blog-posts.sql`
- `src/app/admin/blogg/page.tsx`
- `src/app/[locale]/blogg/[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

### Modified Files (palette + typography)
- `src/app/globals.css`
- `src/app/[locale]/layout.tsx`
- All files in `src/components/sections/`
- All files in `src/components/ui/`
- All files in `src/components/layout/`
- All files in `src/app/admin/`
- All files in `src/app/portal/`
- `src/app/login/page.tsx`
- `src/app/offer/[id]/page.tsx`
- `src/app/[locale]/blogg/page.tsx`
- `messages/no.json`, `messages/en.json`
