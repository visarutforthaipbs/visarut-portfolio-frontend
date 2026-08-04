/**
 * Simplified Universal ACF Schema across all portfolio items
 */
export interface UniversalPortfolioACF {
  client_name?: string;
  project_date?: string;
  project_description?: string;
  external_url?: string;
  website_url?: string;
  video_url?: string;
  video_link?: string;
  location?: string;
  photo_location?: string;
  camera_equipment?: string;
  photography_style?: string;
  technical_details?: string;
  design_type?: string;
  software_used?: string;
  color_palette?: string;
  typography?: string;
  design_elements?: string;
  design_brief?: string;
  print_specifications?: string;
  print_type?: string;
  print_dimensions?: string;
  paper_type?: string;
  print_quantity?: string;
  printing_method?: string;
  finishing_options?: string;
  color_profile?: string;
  exhibition_type?: string;
  venue_name?: string;
  exhibition_dates?: string;
  number_of_artworks?: string;
  exhibition_theme?: string;
  exhibition_medium?: string;
  curator_info?: string;
  opening_reception?: string;
  exhibition_catalog?: string;
  press_coverage?: string;
  campaign_description?: string;
  client?: string;
  campaign_duration?: string;
  platform?: string;
  results?: string;
  producer_description?: string;
  team_size?: string;
  duration?: string;
  responsibilities?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

// Backward compatibility aliases
export type BaseACFData = UniversalPortfolioACF;
export type PhotographyACF = UniversalPortfolioACF;
export type VideographyACF = UniversalPortfolioACF;
export type VideoEditingACF = UniversalPortfolioACF;
export type WebsiteACF = UniversalPortfolioACF;
export type GraphicDesignACF = UniversalPortfolioACF;
export type PrintACF = UniversalPortfolioACF;
export type ExhibitionACF = UniversalPortfolioACF;
export type CampaignACF = UniversalPortfolioACF;
export type ProducerACF = UniversalPortfolioACF;
export type PortfolioACF = UniversalPortfolioACF;
