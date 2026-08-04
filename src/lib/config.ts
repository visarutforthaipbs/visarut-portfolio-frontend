import type { SiteConfig } from "@/types";
import type { PortfolioCategory } from "@/types/portfolio";

/**
 * WordPress category IDs mapped to portfolio category slugs.
 * Single source of truth — update here when IDs change.
 */
export const CATEGORY_IDS: Record<PortfolioCategory, number> = {
  "video-editing": 23,
  videography: 24,
  exhibition: 25,
  photography: 26,
  print: 27,
  "graphic-design": 28,
  website: 29,
  campaign: 30,
  producer: 31,
  "live-stream": 51,
  training: 52,
  research: 53,
  writing: 54,
} as const;

/** Reverse lookup: WordPress category ID → portfolio category slug */
export function categoryIdToSlug(id: number): PortfolioCategory {
  const entry = (Object.entries(CATEGORY_IDS) as [PortfolioCategory, number][])
    .find(([, v]) => v === id);
  return entry?.[0] ?? "photography";
}

export const siteConfig: SiteConfig = {
  title: "วิศรุต แสนคำ - ผู้ผลิตสื่ออิสระ (Portfolio Catalog)",
  titleTh: "วิศรุต แสนคำ - ผู้ผลิตสื่ออิสระ (Portfolio Catalog)",
  description:
    "วิศรุต แสนคำ ผู้ผลิตสื่ออิสระ ช่างภาพสารคดี ผู้กำกับภาพวิดีโอ และนักพัฒนาเว็บสื่อสังคม",
  descriptionTh:
    "วิศรุต แสนคำ ผู้ผลิตสื่ออิสระ ช่างภาพสารคดี ผู้กำกับภาพวิดีโอ และนักพัฒนาเว็บสื่อสังคม รังสรรค์งานภาพถ่ายสารคดี วิดีโอเชิงประเด็น เว็บไซต์อินเทอร์แอคทีฟ และสื่อแคมเปญขับเคลื่อนสังคม",
  author: "วิศรุต แสนคำ",
  authorTh: "วิศรุต แสนคำ",
  url: "https://www.sankham.cv",
  social: {
    facebook: "https://www.facebook.com/visarut.sankham/",
    instagram: "https://www.instagram.com/visarut_sankham/",
    youtube: "https://www.youtube.com/@thaimigrantwatchs",
    linkedin: "https://www.linkedin.com/in/visarut-sankham-99b008b9/",
    email: "visarut298@gmail.com",
    phone: "+66-627-283-058",
  },
  api: {
    wordpress: {
      baseUrl: "https://api.sankham.cv",
      restBase: "/wp/v2",
      postsEndpoint: "/portfolios",
      categoriesEndpoint: "/portfolio_category",
      blogPostsEndpoint: "/posts",
      blogCategoriesEndpoint: "/categories",
    },
  },
};

/**
 * Build a WordPress REST API URL using ?rest_route= format
 */
export function wpApiUrl(endpoint: string, params?: string): string {
  const { baseUrl, restBase } = siteConfig.api.wordpress;
  const url = `${baseUrl}/?rest_route=${restBase}${endpoint}`;
  return params ? `${url}&${params}` : url;
}

export const navigation = [
  {
    label: "Home",
    labelTh: "หน้าแรก",
    href: "/#top",
  },
  {
    label: "Catalog",
    labelTh: "คลังผลงาน",
    href: "/#catalog",
  },
  {
    label: "About",
    labelTh: "เกี่ยวกับผู้ผลิต",
    href: "/#about",
  },
  {
    label: "Blog",
    labelTh: "บทความ",
    href: "/#blog",
  },
  {
    label: "Contact",
    labelTh: "ติดต่อ",
    href: "/#contact",
  },
];

export const themeConfig = {
  colors: {
    primary: "#1a1a1a",
    secondary: "#ffffff",
    accent: "#6b7280", // Apple-style gray-blue
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
  },
  fonts: {
    heading:
      '"DB Helvethaica", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: '"DB Helvethaica", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    thai: '"DB Helvethaica", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  breakpoints: {
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "62em", // 992px
    xl: "80em", // 1280px
    "2xl": "96em", // 1536px
  },
};
