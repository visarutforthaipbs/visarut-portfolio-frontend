export * from "./wordpress";
export * from "./portfolio";

// Common UI Types
export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title: string;
    description: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    image?: string;
  };
}

export interface NavigationItem {
  label: string;
  labelTh: string;
  href: string;
  isExternal?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SiteConfig {
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  author: string;
  authorTh: string;
  url: string;
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    email: string;
    phone?: string;
  };
  api: {
    wordpress: {
      baseUrl: string;
      postsEndpoint: string;
      categoriesEndpoint: string;
      blogPostsEndpoint: string;
      blogCategoriesEndpoint: string;
    };
  };
}
