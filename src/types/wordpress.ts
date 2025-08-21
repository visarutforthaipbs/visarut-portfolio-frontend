// Base WordPress Types
export interface WordPressLink {
  href: string;
  embeddable?: boolean;
  taxonomy?: string;
}

export interface WordPressLinks {
  self: WordPressLink[];
  collection: WordPressLink[];
  about?: WordPressLink[];
  author?: WordPressLink[];
  replies?: WordPressLink[];
  "version-history"?: WordPressLink[];
  "predecessor-version"?: WordPressLink[];
  "wp:featuredmedia"?: WordPressLink[];
  "wp:attachment"?: WordPressLink[];
  "wp:term"?: WordPressLink[];
  curies?: WordPressLink[];
}

export interface WordPressMeta {
  [key: string]: string | number | boolean | null;
}

export interface WordPressACF {
  [key: string]: string | number | boolean | null | object | unknown[];
}

// WordPress API Types
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: WordPressMeta;
  categories: number[];
  tags: number[];
  portfolio_category?: number[]; // Custom field for portfolio categories
  acf: WordPressACF;
  _links: WordPressLinks;
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: WordPressMeta;
  acf: WordPressACF;
  _links: WordPressLinks;
}

export interface WordPressFeaturedMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: WordPressMeta;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    filesize?: number;
    sizes: Record<
      string,
      {
        file: string;
        width: number;
        height: number;
        filesize?: number;
        mime_type: string;
        source_url: string;
      }
    >;
    image_meta: WordPressMeta;
  };
  source_url: string;
  _links: WordPressLinks;
}

// Blog-specific types (reusing WordPressPost but with blog context)
export type BlogPost = WordPressPost;
export type BlogCategory = WordPressCategory;

// Blog-specific interfaces for better type safety
export interface BlogPostCardProps {
  post: BlogPost;
}

export interface BlogLayoutProps {
  posts: BlogPost[];
  categories?: BlogCategory[];
  currentCategory?: string;
}
