# Design System — Visarut Sankham Portfolio

> A living reference for visual design, component patterns, and accessibility standards.
> Last updated: February 2026

---

## Table of Contents

1. [Brand & Identity](#brand--identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Breakpoints](#breakpoints)
6. [Components](#components)
7. [Icons](#icons)
8. [Motion & Animation](#motion--animation)
9. [Accessibility Standards](#accessibility-standards)
10. [SEO & Meta](#seo--meta)
11. [File & Folder Conventions](#file--folder-conventions)

---

## Brand & Identity

| Property | Value |
|---|---|
| Name (EN) | Visarut Sankham |
| Name (TH) | วิศรุต แสนคำ |
| Tagline (TH) | ผู้ผลิตสื่อหลายรูปแบบ |
| Primary Language | Thai (`lang="th"`) |
| Domain | visarutsankham.com |
| Logo | SVG — `/public/logo/black-favicon.svg` (light) / `white-favicon.svg` (dark) |

---

## Color System

### Core Palette

All colors are defined in `src/lib/config.ts` → `themeConfig.colors` and mapped to Chakra UI tokens in `src/lib/theme.ts`.

| Token | Hex | Usage |
|---|---|---|
| `primary.900` | `#1a1a1a` | Primary text, headings |
| `primary.500` | `#8a8a8a` | Secondary text |
| `accent.500` | `#6b7280` | Buttons, links, brand accent |
| `accent.600` | `#4b5563` | Hover states |
| `accent.300` | `#d1d5db` | Dark mode accent |

### Gray Scale (Tailwind-compatible)

| Token | Hex | Usage |
|---|---|---|
| `gray.50` | `#f9fafb` | Page background (alt sections) |
| `gray.100` | `#f3f4f6` | Card backgrounds, subtle fills |
| `gray.200` | `#e5e7eb` | Borders, dividers |
| `gray.300` | `#d1d5db` | Disabled states |
| `gray.400` | `#9ca3af` | Placeholder text |
| `gray.500` | `#6b7280` | Secondary text, icons |
| `gray.600` | `#4b5563` | Body text |
| `gray.700` | `#374151` | Strong body text |
| `gray.800` | `#1f2937` | Headings |
| `gray.900` | `#111827` | Dark mode backgrounds |

### Semantic Usage

```
Background (light):  white / gray.50
Background (dark):   gray.900 / gray.800
Text (light):        gray.800 (heading) / gray.600 (body)
Text (dark):         white (heading) / gray.300 (body)
Interactive:         accent.500 → accent.600 on hover
Focus ring:          #6b7280, 2px solid, 2px offset
Selection:           accent.500 bg, white text
```

### Contrast Requirements

- Body text on white: **gray.600** (`#4b5563`) → 7.1:1 ratio ✅ (WCAG AAA)
- Heading on white: **gray.800** (`#1f2937`) → 14.7:1 ratio ✅ (WCAG AAA)
- Accent on white: **accent.500** (`#6b7280`) → 4.7:1 ratio ✅ (WCAG AA)
- White on accent.500: 4.7:1 ratio ✅ (WCAG AA for large text)

---

## Typography

### Font Family

| Role | Font | Weights | Fallbacks |
|---|---|---|---|
| Heading | DB Helvethaica | 400, 500, 700 | -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial |
| Body | DB Helvethaica | 400, 500, 700 | Same as above |

Font files are self-hosted at `/public/font/` in WOFF2 format with `font-display: swap`.

All three weights are preloaded in `<head>` for zero-FOUT.

### Type Scale (Responsive)

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero heading | 3xl (1.875rem) | 5xl (3rem) | 6xl (3.75rem) |
| Section heading | xl (1.25rem) | 2xl (1.5rem) | 3xl (1.875rem) |
| Card heading | lg (1.125rem) | xl (1.25rem) | xl (1.25rem) |
| Body text | md (1rem) | md (1rem) | lg (1.125rem) |
| Small/caption | xs (0.75rem) | sm (0.875rem) | sm (0.875rem) |

### Line Heights

| Context | Value |
|---|---|
| Headings | 1.1–1.2 |
| Body (Thai text) | 1.6–1.7 |
| Blog content | 1.8 |

---

## Spacing & Layout

### Container

| Property | Value |
|---|---|
| Max width | `5xl` (64rem / 1024px) |
| Padding x (mobile) | 4 (1rem) |
| Padding x (tablet) | 6 (1.5rem) |
| Padding x (desktop) | 8 (2rem) |

### Section Spacing

| Context | Mobile | Desktop |
|---|---|---|
| Section padding y | 12 (3rem) | 20 (5rem) |
| Section gap | 8 (2rem) | 12 (3rem) |
| Card gap | 4 (1rem) | 6 (1.5rem) |
| Stack gap (tight) | 2 (0.5rem) | 4 (1rem) |

### Grid Patterns

| Context | Columns (mobile → desktop) |
|---|---|
| Portfolio grid | 1 → 2 → 3 |
| Services grid | 1 → 2 → 4 |
| Blog grid | 1 → 2 → 3 |

---

## Breakpoints

| Token | Em | Px | Usage |
|---|---|---|---|
| `sm` | 30em | 480px | Large phones |
| `md` | 48em | 768px | Tablets |
| `lg` | 62em | 992px | Small laptops |
| `xl` | 80em | 1280px | Desktops |
| `2xl` | 96em | 1536px | Large screens |

---

## Components

### Header (Sticky)

- **Landmark**: `<header role="banner">`
- **Height**: 56px (mobile), 60px (desktop)
- **Position**: `sticky`, `z-index: 999`, `backdrop-filter: blur(10px)`
- **Navigation**: `<nav aria-label="เมนูหลัก">` with `<ul>` lists
- **Mobile toggle**: `aria-expanded`, `aria-controls="mobile-nav"`
- **Active state**: `aria-current="page"`, `fontWeight: 600`, `color: accent.500`
- **Dropdown**: `role="menu"` / `role="menuitem"`, `aria-haspopup="true"`

### Footer

- **Landmark**: `<footer role="contentinfo">`
- **Navigation**: `<nav aria-label="เมนูท้ายหน้า">`
- **Social links**: `aria-label` describing platform + "เปิดในแท็บใหม่"
- **External links**: Always `rel="noopener noreferrer"` + `target="_blank"`
- **Icons**: `aria-hidden="true"` (decorative, label is on the parent link)

### Contact Popup (Modal)

- **ARIA**: `role="dialog"`, `aria-modal="true"`, `aria-label="ช่องทางติดต่อ"`
- **Focus management**: Focus trap cycles within modal, restores focus on close
- **Keyboard**: `Escape` closes, `Tab` cycles focusable elements
- **Backdrop**: `aria-hidden="true"`, click to dismiss

### Service Card

- **Structure**: Link wrapping a visual card
- **Accessible label**: `aria-label="{title} - {description}"`
- **Icon**: `aria-hidden="true"` (decorative)
- **Hover**: `translateY(-4px)` + shadow elevation

### Portfolio Card

- **Region**: `role="region"` with `aria-label="ผลงานล่าสุด"`
- **Error state**: `role="alert"` for screen reader announcement
- **Image**: Always has descriptive `alt` text
- **Loading**: Skeleton placeholders with `animate-pulse`

### Error Page (`error.tsx`)

- Full-screen centered layout
- Retry button + Home link
- Errors reported via `reportError()` utility

### Loading Page (`loading.tsx`)

- Skeleton pulse UI matching content layout
- CSS `animate-pulse` with staggered delays

### 404 Page (`not-found.tsx`)

- Large 404 indicator
- Bilingual messaging (Thai primary, English secondary)
- CTA: Home + Portfolio links

---

## Icons

- **Library**: [Lucide React](https://lucide.dev/) (`lucide-react`)
- **Sizes**: 16px (inline), 20px (buttons), 32px (feature cards), 64-80px (error pages)
- **Decorative icons**: Always `aria-hidden="true"`
- **Interactive icons**: Parent element must have `aria-label`

---

## Motion & Animation

### Keyframes

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| `fadeIn` | 0.6s | ease-out | Page entrance |
| `slideIn` | 0.6s | ease-out | Section reveals |
| `pulse` | 2s | cubic-bezier(0.4, 0, 0.6, 1) | Loading skeletons |

### Transitions

| Property | Duration | Usage |
|---|---|---|
| Hover transform | 0.3s ease | Card hover lift |
| Color changes | 0.2s | Link/button hover |
| Dropdown | instant | Menu open/close |

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Animation and transition durations forced to `0.01ms`
- `scroll-behavior` reverts to `auto`

---

## Accessibility Standards

### WCAG 2.1 AA Compliance Checklist

#### Perceivable
- [x] All images have descriptive `alt` text
- [x] Color contrast meets AA ratio (4.5:1 for normal text, 3:1 for large)
- [x] Content is readable without CSS
- [x] Font sizes use responsive units, minimum 16px body
- [x] `prefers-reduced-motion` respected
- [x] `prefers-contrast: more` supported with thicker outlines

#### Operable
- [x] All interactive elements are keyboard accessible
- [x] Focus indicators: 2px solid `#6b7280` with 2px offset
- [x] Skip-to-content link (Tab to reveal, jumps to `#main-content`)
- [x] Touch targets minimum 44×44px on mobile
- [x] No keyboard traps (except within modal, which has Escape)
- [x] Focus trap in modals with `Escape` to close

#### Understandable
- [x] `lang="th"` set on `<html>`
- [x] Consistent navigation across pages
- [x] Error messages are clear and bilingual
- [x] Form labels associated with inputs

#### Robust
- [x] Valid semantic HTML landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`
- [x] ARIA roles: `banner`, `contentinfo`, `dialog`, `menu`, `menuitem`, `alert`, `region`
- [x] `aria-expanded`, `aria-controls`, `aria-current`, `aria-label`, `aria-modal`
- [x] Compatible with screen readers (VoiceOver, NVDA)

### Landmark Structure

```
<body>
  <a class="skip-to-content">Skip link</a>
  <header role="banner">
    <nav aria-label="เมนูหลัก">...</nav>
  </header>
  <main id="main-content">
    <!-- Page content -->
  </main>
  <footer role="contentinfo">
    <nav aria-label="เมนูท้ายหน้า">...</nav>
  </footer>
</body>
```

### Focus Management Rules

| Context | Behavior |
|---|---|
| Page load | Focus on `<body>` (default) |
| Modal open | Focus moves to dialog container |
| Modal close | Focus returns to triggering element |
| Skip link | Focus shifts to `#main-content` |
| Dropdown open | First menu item receives focus |
| Error boundary | Retry button is primary action |

---

## SEO & Meta

### Per-Page Meta

- Title format: `{Page Title} | วิศรุต แสนคำ - Media Professional`
- Description: Unique per page, 120-160 chars
- Canonical URL: Set via `metadata.alternates.canonical`
- OpenGraph: Image required (1200×630), locale `th_TH`

### Structured Data (JSON-LD)

- **Homepage**: Person + Organization + Website schemas
- **Portfolio items**: CreativeWork schema
- **Blog posts**: Article schema

### Sitemap & Robots

- Dynamic sitemap at `/sitemap.xml`
- `robots.txt` allows all crawlers, references sitemap

---

## File & Folder Conventions

### App Router Structure

```
src/app/
  layout.tsx        ← Root layout (metadata, providers, analytics)
  page.tsx          ← Homepage
  error.tsx         ← Global error boundary
  loading.tsx       ← Global loading skeleton
  not-found.tsx     ← Custom 404
  globals.css       ← Global styles, animations, content styles
  sitemap.ts        ← Dynamic sitemap generation
  [section]/
    page.tsx        ← Section page
    [slug]/
      page.tsx      ← Dynamic detail page
      opengraph-image.tsx  ← Dynamic OG image
```

### Component Organization

```
src/components/
  layout/           ← Header, Footer, Layout wrapper
  portfolio/        ← Portfolio-specific components
    acf/            ← ACF field renderers by type
    galleries/      ← Image gallery components
    layouts/        ← Portfolio layout variants
  blog/             ← Blog-specific components
  ui/               ← Reusable UI primitives (ServiceCard, ContactPopup, etc.)
  GoogleAnalytics.tsx  ← GA4 integration
  WebVitals.tsx        ← Core Web Vitals reporter
  JsonLd.tsx           ← Structured data renderer
  providers.tsx        ← Chakra UI provider
```

### Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `ServiceCard.tsx` |
| Hooks | camelCase with `use` prefix | `useWordPress.ts` |
| Utilities | camelCase | `errorReporting.ts` |
| Types | PascalCase interfaces | `PortfolioItem` |
| Constants | UPPER_SNAKE_CASE | `PORTFOLIO_CATEGORIES` |
| CSS classes | kebab-case | `.skip-to-content` |

### Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification |
| `NEXT_PUBLIC_ERROR_ENDPOINT` | Optional error reporting webhook URL |

---

## Tech Stack Reference

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.x | Framework (App Router) |
| React | 19.x | UI library |
| Chakra UI | 3.x | Component library |
| Tailwind CSS | 4.x | Utility styles |
| Framer Motion | 12.x | Animations |
| Lucide React | Latest | Icons |
| TypeScript | 5.x | Type safety |
| WordPress REST API | — | Content backend |

---

## Quick Reference: Do's and Don'ts

### Do ✅
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`)
- Add `aria-label` to all icon-only buttons
- Use `aria-hidden="true"` on decorative icons
- Include `rel="noopener noreferrer"` on external links
- Test keyboard navigation for every new interactive element
- Use Chakra responsive syntax: `{{ base: "...", md: "..." }}`
- Keep heading hierarchy sequential (h1 → h2 → h3, never skip)
- Provide Thai primary + English secondary for key messages

### Don't ❌
- Don't use `div` for clickable elements — use `button` or `a`
- Don't rely solely on color to convey information
- Don't auto-play videos or animations without user consent
- Don't remove focus outlines without providing alternatives
- Don't hardcode pixel values for font sizes (use Chakra tokens)
- Don't nest interactive elements (link inside button, etc.)
- Don't use `tabindex > 0`
