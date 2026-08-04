# Visarut Portfolio Design System & Coding Standards

This document serves as the definitive reference manual for agents and developers maintaining and extending the **Visarut Sankham Portfolio Website**. All future modifications MUST adhere to these architectural rules and design system guidelines.

---

## 🎨 1. Design Philosophy & Aesthetic Guidelines

1. **Marketplace-First Single-Page Application (SPA)**:
   - The homepage centerpiece is an interactive **Creative Works Marketplace Catalog** (inspired by Facebook Marketplace UX).
   - Clean, headerless layout (`hideHeader={true}`) — zero unnecessary navigation fluff, high density, and instant modal preview drawers.

2. **Mobile-First UX Architecture**:
   - All components are styled **Mobile-First** (`w-full flex-col` base styles, with `sm:`, `md:`, `lg:`, `xl:` responsive modifiers).
   - On small screens (`< 640px`), modal popups transform into native **bottom-sheet drawers** (`rounded-t-3xl` with top drag handle indicator).
   - **44px Minimum Touch Targets**: All interactive elements (buttons, filter pills, close targets, arrows) enforce a minimum `min-h-[44px]` touch area.
   - **16px Input Font Size**: Search inputs use `text-base sm:text-sm` to prevent iOS Safari auto-zooming.
   - **No Scrollbar Tracks**: Horizontal category pills and thumbnail strips use `.no-scrollbar` with `shrink-0` buttons to prevent label squishing or scrollbar clutter.

---

## 🟢 2. Color Tokens & Brand System

All colors are centralized in [`src/app/globals.css`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/app/globals.css) and [`src/lib/tokens.ts`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/lib/tokens.ts):

| Token Name | CSS Variable | Hex / Value | Usage Description |
| :--- | :--- | :--- | :--- |
| **Accent Primary** | `--color-accent` | `#22c55e` | Brand Green for active states, badges, icons, highlights |
| **Accent Dim** | `--color-accent-dim` | `rgba(34, 197, 94, 0.10)` | Subtle green background fill for tags and icon boxes |
| **Signal Green** | `--color-signal` | `#16A34A` | Secondary green for success toasts and links |
| **Base Background** | `--color-base` | `#FFFFFF` | Primary page background |
| **Surface** | `--color-surface` | `#F7F7F9` | Card and modal container background |
| **Surface Hover** | `--color-surface-hover` | `#EEEFF2` | Card and button hover state |
| **Edge Border** | `--color-edge` | `#D8D9E0` | Dividers, card borders, modal boundaries |
| **Text Content** | `--color-content` | `#1A1B2E` | Primary headings, titles, active text |
| **Text Muted** | `--color-muted` | `#5C5F72` | Body copy, descriptions, secondary copy |
| **Text Dim** | `--color-dim` | `#8E91A3` | Placeholder text, dates, sub-captions |

---

## 🔤 3. Typography & Fonts

- **Font Family**: `DB Helvethaica` (`var(--font-db-helvethaica)`, `var(--font-thai)`).
- **Weights**:
  - `400`: Body text, long-form descriptions (`dbhelvethaicax-webfont.woff2`).
  - `500`: Subheadings, meta badges, search input (`dbhelvethaicaxmed-webfont.woff2`).
  - `700`: Main titles, producer name, category headers (`dbhelvethaicaxbd-webfont.woff2`).

---

## 🧩 4. Key Component Architecture

| Component File | Role & Responsibilities |
| :--- | :--- |
| **[`MarketplaceSearchBar.tsx`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/components/portfolio/MarketplaceSearchBar.tsx)** | Top search bar, category pills (`shrink-0`), sort dropdown, view mode toggle (Grid/List). |
| **[`MarketplaceSidebar.tsx`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/components/portfolio/MarketplaceSidebar.tsx)** | Producer profile badge (`visarut-profile.jpg`, headline *"ผู้ผลิตสื่ออิสระ"*), quick contact, category counters, organization filters (*Thai PBS, Greenpeace, Realframe, Lanna Project*), collapsible Experience & Awards. |
| **[`MarketplaceGrid.tsx`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/components/portfolio/MarketplaceGrid.tsx)** | Grid & List views with category overlays, green client badges, and high-fidelity skeleton shimmer loaders. |
| **[`MarketplaceQuickViewModal.tsx`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/components/portfolio/MarketplaceQuickViewModal.tsx)** | 12-col split view drawer (`7:5`), ambient blur background image slider (all aspect ratios), sanitized text, standardized ACF specs card, and Share button (`?item=slug`). |
| **[`ContactModal.tsx`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/components/portfolio/ContactModal.tsx)** | Direct contact form modal dialog. |
| **[`JsonLd.tsx`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/components/JsonLd.tsx)** | JSON-LD Structured Data Schema (`Person`, `WebSite`, `ItemList`) for AI Search Engines (ChatGPT, Perplexity, Gemini, SearchGPT). |

---

## 📊 5. Data Normalization & Universal ACF Schema

All raw WordPress API posts MUST be passed through **`WordPressAPI.normalizePortfolio(item)`** in [`src/lib/wordpress.ts`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/lib/wordpress.ts):

### Primary Universal ACF Fields:
1. **`external_url`**: Live project URL / website / video link (falls back to legacy `website_url`, `video_link`).
2. **`client_name`**: Organization / Client name (falls back to legacy `client`, `client_ngo`).
3. **`project_date`**: Project date (automatically formatted via `formatDate()` into Thai format *e.g., `1 มกราคม 2568`*).
4. **`project_description`**: Long-form description.

### Thai Date Parsing Rule:
- Raw `YYYYMMDD` strings (e.g. `20250101`, `20240917`) or ISO strings MUST be formatted using `formatDate()` from [`src/utils/index.ts`](file:///Users/lighthouse-control/Documents/visarut-portfolio-frontend/src/utils/index.ts) into full Thai date format with Buddhist Era years (*e.g. `1 มกราคม 2568`*).

---

## ⚡ 6. React Rules & Quality Guidelines

1. **React Rules of Hooks**:
   - ALL `useState()` and `useEffect()` hooks MUST be defined unconditionally at the very top of component functions BEFORE any conditional returns (`if (!portfolio) return null;`).
2. **Type Safety Verification**:
   - Always verify TypeScript compilation with `npx tsc --noEmit` before concluding work. Zero errors allowed.
3. **Image Placeholders**:
   - Never use raw text placeholders. Use `public/placeholder-image.svg` (sleek dark gradient vector frame).
