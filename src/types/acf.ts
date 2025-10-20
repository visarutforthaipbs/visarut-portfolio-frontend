/**
 * Base ACF data structure shared across all portfolio types
 */
export interface BaseACFData {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Photography-specific ACF fields
 */
export interface PhotographyACF extends BaseACFData {
  photo_description?: string;
  camera?: string;
  lens?: string;
  lighting?: string;
  location?: string;
}

/**
 * Videography-specific ACF fields
 */
export interface VideographyACF extends BaseACFData {
  video_description?: string;
  camera?: string;
  lens?: string;
  lighting?: string;
  location?: string;
  video_link?: string;
}

/**
 * Video Editing-specific ACF fields
 */
export interface VideoEditingACF extends BaseACFData {
  editing_description?: string;
  software?: string;
  video_link?: string;
}

/**
 * Website-specific ACF fields
 */
export interface WebsiteACF extends BaseACFData {
  project_description?: string;
  tech_stack?: string;
  website_url?: string;
  features?: string;
}

/**
 * Graphic Design-specific ACF fields
 */
export interface GraphicDesignACF extends BaseACFData {
  design_description?: string;
  design_software?: string;
  color_palette?: string;
  typography?: string;
  design_elements?: string;
}

/**
 * Print-specific ACF fields
 */
export interface PrintACF extends BaseACFData {
  print_description?: string;
  print_size?: string;
  print_material?: string;
  print_software?: string;
}

/**
 * Exhibition-specific ACF fields
 */
export interface ExhibitionACF extends BaseACFData {
  exhibition_description?: string;
  location?: string;
  date?: string;
  role?: string;
}

/**
 * Campaign-specific ACF fields
 */
export interface CampaignACF extends BaseACFData {
  campaign_description?: string;
  client?: string;
  campaign_duration?: string;
  platform?: string;
  results?: string;
}

/**
 * Producer-specific ACF fields
 */
export interface ProducerACF extends BaseACFData {
  producer_description?: string;
  team_size?: string;
  duration?: string;
  responsibilities?: string;
}

/**
 * Discriminated union of all ACF types
 */
export type PortfolioACF =
  | { category: "photography"; data: PhotographyACF }
  | { category: "videography"; data: VideographyACF }
  | { category: "video-editing"; data: VideoEditingACF }
  | { category: "website"; data: WebsiteACF }
  | { category: "graphic-design"; data: GraphicDesignACF }
  | { category: "print"; data: PrintACF }
  | { category: "exhibition"; data: ExhibitionACF }
  | { category: "campaign"; data: CampaignACF }
  | { category: "producer"; data: ProducerACF };

/**
 * Gallery image with caption
 */
export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}
