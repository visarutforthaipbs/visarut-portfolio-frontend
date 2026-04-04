/**
 * Signal 39 Design Tokens
 *
 * Single source of truth for the dark design philosophy.
 * All pages and components import from here for visual consistency.
 *
 * Palette rules:
 * - bg: page background
 * - surface: card/elevated background
 * - surfaceHover: card hover state
 * - border: borders, dividers
 * - text: primary text (headings, titles)
 * - textMuted: secondary text (body, descriptions)
 * - textDim: tertiary text (labels, meta, placeholders)
 * - accent: brand accent (orange) for interactive, active states
 * - accentDim: subtle accent background (icon containers, badges)
 */
export const T = {
  bg: "#0F1117",
  surface: "#161922",
  surfaceHover: "#1C1F2B",
  border: "#23273A",
  text: "#E8E8ED",
  textMuted: "#8B8FA3",
  textDim: "#565B73",
  accent: "#ED8936",
  accentDim: "rgba(237,137,54,0.12)",
} as const;
