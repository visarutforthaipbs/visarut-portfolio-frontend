import { WordPressPost, WordPressCategory } from "./wordpress";

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

// ACF Field Types for different portfolio categories
export interface PhotographyACF {
  camera_equipment?: string;
  photo_location?: string;
  photography_style?: string;
  technical_details?: string;
  project_description?: string;
  client_name?: string;
  project_date?: string;
  gallery?: ImageMedia[];
}

export interface VideographyACF {
  video_url?: string;
  video_type?: "youtube" | "vimeo" | "direct";
  duration?: string;
  resolution?: string;
  frame_rate?: string;
  equipment?: {
    camera: string;
    lenses: string[];
    audio: string;
  };
  client_name?: string;
  project_date?: string;
  project_description?: string;
}

export interface WebsiteACF {
  website_url?: string;
  technologies?: string[];
  project_type?: "frontend" | "fullstack" | "cms" | "ecommerce";
  screenshots?: ImageMedia[];
  client_name?: string;
  project_date?: string;
  project_description?: string;
  features?: string[];
}

export interface GraphicDesignACF {
  design_images?: ImageMedia[];
  software_used?: string[];
  project_type?: "logo" | "branding" | "poster" | "brochure" | "packaging";
  client?: string;
  dimensions?: string;
  color_palette?: string[];
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
