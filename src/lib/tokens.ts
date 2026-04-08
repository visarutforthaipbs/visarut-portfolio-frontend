/**
 * Signal 39 Design Tokens
 *
 * Single source of truth for the light design philosophy.
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
  bg: "#FFFFFF",
  surface: "#F7F7F9",
  surfaceHover: "#EEEFF2",
  border: "#D8D9E0",
  text: "#1A1B2E",
  textMuted: "#5C5F72",
  textDim: "#8E91A3",
  accent: "#D97706",
  accentDim: "rgba(217,119,6,0.10)",
  signal: "#16A34A",
  signalDim: "rgba(22,163,74,0.10)",
} as const;
