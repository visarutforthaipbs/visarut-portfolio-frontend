import { WordPressPost, WordPressCategory } from "./wordpress";
import type {
  PhotographyACF,
  VideographyACF,
  WebsiteACF,
  GraphicDesignACF,
} from "./acf";

// Re-export ACF types for convenience
export type { PhotographyACF, VideographyACF, WebsiteACF, GraphicDesignACF };

// Portfolio Categories
export type PortfolioCategory =
  | "photography"
  | "videography"
  | "video-editing"
  | "website"
  | "graphic-design"
  | "print"
  | "exhibition"
  | "campaign"
  | "producer";

// Portfolio Category Labels (Thai)
export const PORTFOLIO_CATEGORIES: Record<PortfolioCategory, string> = {
  photography: "ภาพถ่าย",
  videography: "ถ่ายวีดีโอ",
  "video-editing": "ตัดต่อวีดีโอ",
  website: "เว็บไซต์",
  "graphic-design": "ออกแบบกราฟิก",
  print: "สิ่งพิมพ์",
  exhibition: "นิทรรศการ",
  campaign: "แคมเปญ",
  producer: "โปรดิวเซอร์",
};

// Media Types
export interface MediaItem {
  id: string;
  type: "image" | "video" | "gallery";
  url: string;
  thumbnail?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface VideoMedia extends MediaItem {
  type: "video";
  provider?: "youtube" | "vimeo" | "direct";
  videoId?: string;
  duration?: number;
}

export interface ImageMedia extends MediaItem {
  type: "image";
  sizes?: {
    thumbnail: string;
    medium: string;
    large: string;
    full: string;
  };
}

export interface GalleryMedia extends MediaItem {
  type: "gallery";
  images: ImageMedia[];
}

// Main Portfolio Item Interface
export interface PortfolioItem extends Omit<WordPressPost, "acf"> {
  category: PortfolioCategory;
  featured_image?: ImageMedia;
  media?: MediaItem[];
  acf:
    | PhotographyACF
    | VideographyACF
    | WebsiteACF
    | GraphicDesignACF
    | Record<string, unknown>;
}

// Portfolio Filter State
export interface PortfolioFilters {
  category?: PortfolioCategory;
  search?: string;
  sortBy?: "date" | "title" | "category";
  sortOrder?: "asc" | "desc";
}

// API Response Types
export interface PortfolioResponse {
  items: PortfolioItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface CategoriesResponse {
  categories: WordPressCategory[];
}

// UI Component Props
export interface PortfolioGridProps {
  items: PortfolioItem[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface PortfolioCardProps {
  item: PortfolioItem;
  showCategory?: boolean;
  aspectRatio?: number;
}

export interface PortfolioFilterProps {
  filters: PortfolioFilters;
  onFiltersChange: (filters: PortfolioFilters) => void;
  categories: WordPressCategory[];
}
