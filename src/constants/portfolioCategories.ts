/**
 * Portfolio category constants
 * Use these instead of magic strings throughout the application
 */
export const PORTFOLIO_CATEGORIES = {
  PHOTOGRAPHY: "photography",
  VIDEOGRAPHY: "videography",
  VIDEO_EDITING: "video-editing",
  WEBSITE: "website",
  GRAPHIC_DESIGN: "graphic-design",
  PRINT: "print",
  EXHIBITION: "exhibition",
  CAMPAIGN: "campaign",
  PRODUCER: "producer",
} as const;

export type PortfolioCategoryKey = keyof typeof PORTFOLIO_CATEGORIES;
export type PortfolioCategoryValue =
  (typeof PORTFOLIO_CATEGORIES)[PortfolioCategoryKey];

// Alias for easier import
export type CategoryKey = PortfolioCategoryValue;

/**
 * Gallery layout types for different categories
 */
export type GalleryLayoutType =
  | "hero-masonry"
  | "grid-2col"
  | "grid-3col"
  | "cinematic";

/**
 * Gallery layout mapping
 */
export const GALLERY_LAYOUT_MAP: Record<string, GalleryLayoutType> = {
  [PORTFOLIO_CATEGORIES.PHOTOGRAPHY]: "hero-masonry",
  [PORTFOLIO_CATEGORIES.VIDEOGRAPHY]: "cinematic",
  [PORTFOLIO_CATEGORIES.VIDEO_EDITING]: "cinematic",
  [PORTFOLIO_CATEGORIES.WEBSITE]: "grid-2col",
  [PORTFOLIO_CATEGORIES.GRAPHIC_DESIGN]: "grid-3col",
  [PORTFOLIO_CATEGORIES.PRINT]: "grid-3col",
  [PORTFOLIO_CATEGORIES.EXHIBITION]: "grid-2col",
  [PORTFOLIO_CATEGORIES.CAMPAIGN]: "grid-2col",
  [PORTFOLIO_CATEGORIES.PRODUCER]: "grid-2col",
};

/**
 * Gallery titles in Thai
 */
export const GALLERY_TITLES: Record<string, (count: number) => string> = {
  [PORTFOLIO_CATEGORIES.PHOTOGRAPHY]: (count) => `ภาพถ่าย (${count} ภาพ)`,
  [PORTFOLIO_CATEGORIES.VIDEOGRAPHY]: (count) => `ภาพจากวีดีโอ (${count} ภาพ)`,
  [PORTFOLIO_CATEGORIES.VIDEO_EDITING]: (count) =>
    `ภาพจากการตัดต่อ (${count} ภาพ)`,
  [PORTFOLIO_CATEGORIES.WEBSITE]: (count) => `ภาพหน้าจอเว็บไซต์ (${count} ภาพ)`,
  [PORTFOLIO_CATEGORIES.GRAPHIC_DESIGN]: (count) =>
    `ผลงานออกแบบ (${count} ภาพ)`,
  [PORTFOLIO_CATEGORIES.PRINT]: (count) => `ผลงานพิมพ์ (${count} ภาพ)`,
  [PORTFOLIO_CATEGORIES.EXHIBITION]: (count) =>
    `ภาพจากนิทรรศการ (${count} ภาพ)`,
  [PORTFOLIO_CATEGORIES.CAMPAIGN]: (count) => `ภาพจากแคมเปญ (${count} ภาพ)`,
  [PORTFOLIO_CATEGORIES.PRODUCER]: (count) => `ภาพจากการผลิต (${count} ภาพ)`,
};
