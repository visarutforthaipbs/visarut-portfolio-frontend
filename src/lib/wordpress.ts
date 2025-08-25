import axios from "axios";
import { apiCache } from "./cache";
import type {
  WordPressPost,
  WordPressFeaturedMedia,
  PortfolioItem,
  PortfolioResponse,
  CategoriesResponse,
  PortfolioCategory,
  MediaItem,
  ImageMedia,
  VideoMedia,
} from "@/types";

// WordPress API Configuration
const WP_API_BASE = "https://backend.visarutsankham.com/wp-json/wp/v2";

// Create axios instance with default config
const wpApi = axios.create({
  baseURL: WP_API_BASE,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  // Enable credentials for CORS
  withCredentials: false,
});

// Add request interceptor for debugging
wpApi.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.url, config.params);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
wpApi.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.message, error.response?.status);
    return Promise.reject(error);
  }
);

// WordPress API Client Class
export class WordPressAPI {
  /**
   * Fetch portfolio items from WordPress
   */
  static async getPortfolios(params?: {
    page?: number;
    per_page?: number;
    categories?: string;
    search?: string;
    orderby?: string;
    order?: "asc" | "desc";
  }): Promise<PortfolioResponse> {
    // Create cache key
    const cacheKey = `portfolios_${JSON.stringify(params || {})}`;

    // Try to get from cache first
    const cached = apiCache.get<PortfolioResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Map category names to IDs for the API
      let categoryId: number | undefined;
      if (params?.categories && params.categories !== "all") {
        switch (params.categories) {
          case "video-editing":
            categoryId = 23;
            break;
          case "videography":
            categoryId = 24;
            break;
          case "exhibition":
            categoryId = 25;
            break;
          case "photography":
            categoryId = 26;
            break;
          case "print":
            categoryId = 27;
            break;
          case "graphic-design":
            categoryId = 28;
            break;
          case "website":
            categoryId = 29;
            break;
          case "campaign":
            categoryId = 30;
            break;
          case "producer":
            categoryId = 31;
            break;
        }
      }

      const response = await wpApi.get("/portfolios", {
        params: {
          per_page: 12,
          orderby: "date",
          order: "desc",
          _embed: true, // Include featured media and other embedded data
          portfolio_category: categoryId, // Use category ID for filtering
          page: params?.page,
          search: params?.search,
          ...params,
        },
      });

      const items: PortfolioItem[] = response.data.map((post: WordPressPost) =>
        this.transformPortfolioPost(post)
      );

      // Get pagination info from headers
      const total = parseInt(response.headers["x-wp-total"] || "0");
      const totalPages = parseInt(response.headers["x-wp-totalpages"] || "1");
      const currentPage = params?.page || 1;

      const result: PortfolioResponse = {
        items,
        total,
        totalPages,
        currentPage,
      };

      // Cache the result for 5 minutes
      apiCache.set(cacheKey, result, 5);

      return result;
    } catch (error) {
      console.error("Error fetching portfolios:", error);

      // Log more detailed error information
      if (axios.isAxiosError(error)) {
        console.error("API Error Details:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
        });

        // If it's a network error, try to provide helpful debugging info
        if (error.code === "ERR_NETWORK") {
          console.error(
            "Network Error - Check if WordPress API is accessible at:",
            WP_API_BASE
          );
          console.error("Possible causes:");
          console.error("1. WordPress server is down");
          console.error("2. CORS policy blocking the request");
          console.error("3. Network connectivity issues");
          console.error(
            "4. SSL certificate issues (check browser console for SSL errors)"
          );
          console.error("5. Incorrect API URL");
        }

        // Handle SSL/TLS certificate errors
        if (
          error.message.includes("ERR_CERT") ||
          error.message.includes("SSL") ||
          error.message.includes("certificate")
        ) {
          console.error(
            "SSL Certificate Error - The admin subdomain may not have a valid SSL certificate"
          );
          console.error(
            "Consider setting up a proper SSL certificate for admin.visarutsankham.com"
          );
        }
      }

      // For development, return mock data to prevent app crashes
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock portfolio data due to API error");
        return {
          items: [
            {
              id: 1,
              date: new Date().toISOString(),
              date_gmt: new Date().toISOString(),
              guid: { rendered: "sample-guid" },
              modified: new Date().toISOString(),
              modified_gmt: new Date().toISOString(),
              slug: "sample-portfolio",
              status: "publish",
              type: "portfolio",
              link: "sample-link",
              title: { rendered: "Sample Portfolio Item" },
              content: {
                rendered: "Sample content",
                protected: false,
              },
              excerpt: {
                rendered:
                  "This is a sample portfolio item while the API is unavailable.",
                protected: false,
              },
              author: 1,
              featured_media: 0,
              comment_status: "closed",
              ping_status: "closed",
              sticky: false,
              template: "",
              format: "standard",
              meta: {},
              categories: [],
              tags: [],
              portfolio_category: [],
              category: "website" as const,
              acf: {
                gallery: [],
                video_url: "",
                client: "Sample Client",
                year: new Date().getFullYear().toString(),
                role: "Sample Role",
                description: "Sample description",
                skills: ["Sample Skill"],
                project_type: "Sample Type",
                duration: "1 month",
                team_size: "1 person",
                tools_used: ["Sample Tool"],
                challenges: "Sample challenge",
                results: "Sample result",
                testimonial: {
                  quote: "",
                  author: "",
                  position: "",
                },
              },
              _links: {
                self: [{ href: "sample-link" }],
                collection: [{ href: "sample-collection" }],
              },
            },
          ],
          total: 1,
          totalPages: 1,
          currentPage: 1,
        };
      }

      // Return empty result for production
      return {
        items: [],
        total: 0,
        totalPages: 1,
        currentPage: 1,
      };
    }
  }

  /**
   * Fetch a single portfolio item by slug
   */
  static async getPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
    const cacheKey = `portfolio_${slug}`;

    // Try to get from cache first
    const cached = apiCache.get<PortfolioItem>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await wpApi.get("/portfolios", {
        params: {
          slug,
          _embed: true,
        },
      });

      if (response.data.length === 0) {
        return null;
      }

      const result = this.transformPortfolioPost(response.data[0]);

      // Cache the result for 10 minutes
      apiCache.set(cacheKey, result, 10);

      return result;
    } catch (error) {
      console.error("Error fetching portfolio by slug:", error);
      return null;
    }
  }

  /**
   * Fetch portfolio categories
   */
  static async getPortfolioCategories(): Promise<CategoriesResponse> {
    const cacheKey = "portfolio_categories";

    // Try to get from cache first
    const cached = apiCache.get<CategoriesResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await wpApi.get("/portfolio_category", {
        params: {
          per_page: 100,
          orderby: "name",
          order: "asc",
        },
      });

      const result: CategoriesResponse = {
        categories: response.data,
      };

      // Cache categories for 30 minutes (they don't change often)
      apiCache.set(cacheKey, result, 30);

      return result;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        categories: [],
      };
    }
  }

  /**
   * Fetch featured media by ID
   */
  static async getFeaturedMedia(
    mediaId: number
  ): Promise<WordPressFeaturedMedia | null> {
    try {
      const response = await wpApi.get(`/media/${mediaId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured media:", error);
      return null;
    }
  }

  /**
   * Transform WordPress post to PortfolioItem
   */
  private static transformPortfolioPost(post: WordPressPost): PortfolioItem {
    // Extract category from post categories
    // This is a simplified approach - you might need to map category IDs to slugs
    const category = this.extractPortfolioCategory(post);

    // Extract featured image from embedded data
    const featuredImage = this.extractFeaturedImage(post);

    // Extract media items from ACF fields and content
    const media = this.extractMediaItems(post);

    return {
      ...post,
      category,
      featured_image: featuredImage,
      media,
    } as PortfolioItem;
  }

  /**
   * Extract portfolio category from post
   */
  private static extractPortfolioCategory(
    post: WordPressPost
  ): PortfolioCategory {
    // Extract category from portfolio_category field
    if (post.portfolio_category && post.portfolio_category.length > 0) {
      // Map WordPress category IDs to our category types based on your API
      const categoryId = post.portfolio_category[0];
      switch (categoryId) {
        case 23: // Video Editing (ตัดต่อวีดีโอ)
          return "video-editing";
        case 24: // Videography (ถ่ายวีดีโอ)
          return "videography";
        case 25: // Exhibition (นิทรรศการ)
          return "exhibition";
        case 26: // Photography (ภาพถ่าย)
          return "photography";
        case 27: // Print (สิ่งพิมพ์)
          return "print";
        case 28: // Graphic Design (ออกแบบกราฟิก)
          return "graphic-design";
        case 29: // Website (เว็บไซต์)
          return "website";
        case 30: // Campaign (แคมเปญ)
          return "campaign";
        case 31: // Producer (โปรดิวเซอร์)
          return "producer";
        default:
          return "photography";
      }
    }
    return "photography"; // Default category
  }

  /**
   * Extract featured image from embedded data
   */
  private static extractFeaturedImage(
    post: WordPressPost
  ): ImageMedia | undefined {
    // Check if featured media is embedded
    const embedded = (
      post as WordPressPost & {
        _embedded?: { "wp:featuredmedia"?: WordPressFeaturedMedia[] };
      }
    )._embedded;
    if (
      embedded &&
      embedded["wp:featuredmedia"] &&
      embedded["wp:featuredmedia"][0]
    ) {
      const media = embedded["wp:featuredmedia"][0];
      return {
        id: media.id.toString(),
        type: "image",
        url: media.source_url,
        alt: media.alt_text || "",
        caption: media.caption?.rendered || "",
        width: media.media_details?.width,
        height: media.media_details?.height,
        sizes: media.media_details?.sizes
          ? {
              thumbnail:
                media.media_details.sizes.thumbnail?.source_url ||
                media.source_url,
              medium:
                media.media_details.sizes.medium?.source_url ||
                media.source_url,
              large:
                media.media_details.sizes.large?.source_url || media.source_url,
              full: media.source_url,
            }
          : undefined,
      };
    }
    return undefined;
  }

  /**
   * Extract media items from ACF fields and content
   */
  private static extractMediaItems(post: WordPressPost): MediaItem[] {
    const media: MediaItem[] = [];

    // Extract images from content HTML (WordPress gallery blocks)
    const contentImages = this.extractImagesFromContent(post.content.rendered);
    media.push(...contentImages);

    // Extract from ACF fields if available
    if (post.acf.gallery && Array.isArray(post.acf.gallery)) {
      post.acf.gallery.forEach((item: unknown) => {
        const galleryItem = item as {
          id?: number;
          url?: string;
          source_url?: string;
          alt?: string;
          caption?: string;
          width?: number;
          height?: number;
        };

        media.push({
          id: galleryItem.id?.toString() || Math.random().toString(),
          type: "image",
          url: galleryItem.url || galleryItem.source_url || "",
          alt: galleryItem.alt || "",
          caption: galleryItem.caption || "",
          width: galleryItem.width,
          height: galleryItem.height,
        });
      });
    }

    return media;
  }

  /**
   * Extract images from WordPress content HTML
   */
  private static extractImagesFromContent(content: string): ImageMedia[] {
    const images: ImageMedia[] = [];

    // Pattern to match WordPress gallery images
    const imgRegex =
      /<img[^>]*src="([^"]*)"[^>]*(?:data-id="([^"]*)")?[^>]*(?:alt="([^"]*)")?[^>]*>/gi;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      const [, src, dataId, alt] = match;

      // Skip if already processed (avoid duplicates)
      if (images.some((img) => img.url === src)) continue;

      // Replace old domain with current backend domain
      const correctedUrl = src.replace(
        "https://visarutsankham.com/",
        "https://backend.visarutsankham.com/"
      );

      images.push({
        id: dataId || Math.random().toString(),
        type: "image",
        url: correctedUrl,
        alt: alt || "",
        caption: "",
        // Extract dimensions from srcset if available
        ...this.extractImageDimensions(match[0]),
      });
    }

    return images;
  }

  /**
   * Extract image dimensions from img tag
   */
  private static extractImageDimensions(imgTag: string): {
    width?: number;
    height?: number;
  } {
    const widthMatch = imgTag.match(/width="(\d+)"/);
    const heightMatch = imgTag.match(/height="(\d+)"/);

    return {
      width: widthMatch ? parseInt(widthMatch[1]) : undefined,
      height: heightMatch ? parseInt(heightMatch[1]) : undefined,
    };
  }

  /**
   * Safely render WordPress HTML content
   * This handles Elementor and other WordPress content
   */
  static renderContent(htmlContent: string): string {
    // Basic sanitization - you might want to use a library like DOMPurify for production
    // For now, we'll return the content as-is since it's from a trusted source
    return htmlContent;
  }

  /**
   * Extract video embeds from WordPress content
   */
  static extractVideoEmbeds(content: string): VideoMedia[] {
    const videos: VideoMedia[] = [];

    // YouTube embed pattern
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
    let match;

    while ((match = youtubeRegex.exec(content)) !== null) {
      videos.push({
        id: match[1],
        type: "video",
        provider: "youtube",
        videoId: match[1],
        url: `https://www.youtube.com/watch?v=${match[1]}`,
        thumbnail: `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`,
      });
    }

    // Vimeo embed pattern
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/gi;
    while ((match = vimeoRegex.exec(content)) !== null) {
      videos.push({
        id: match[1],
        type: "video",
        provider: "vimeo",
        videoId: match[1],
        url: `https://vimeo.com/${match[1]}`,
      });
    }

    return videos;
  }
}

/**
 * View tracking utilities
 */
export class ViewTracker {
  /**
   * Track a view for a blog post using WP-PostViews
   */
  static async trackPostView(postId: number): Promise<boolean> {
    try {
      // WP-PostViews typically provides an AJAX endpoint for tracking views
      // The standard endpoint is usually wp-admin/admin-ajax.php with action=postviews
      const response = await fetch(
        `${WP_API_BASE.replace("/wp-json/wp/v2", "")}/wp-admin/admin-ajax.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "postviews",
            postviews_id: postId.toString(),
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Error tracking post view:", error);
      return false;
    }
  }

  /**
   * Get view count for a post (works with WP-PostViews)
   */
  static getPostViews(post: WordPressPost): number {
    // Try different possible fields where WP-PostViews might store the count
    if (post.views) return post.views;
    if (post.post_views) return parseInt(post.post_views) || 0;

    // Check in meta field (WP-PostViews usually stores in 'views' meta)
    if (post.meta && typeof post.meta === "object") {
      const meta = post.meta as Record<string, unknown>;
      if (meta.views && typeof meta.views === "string")
        return parseInt(meta.views) || 0;
      if (meta.post_views && typeof meta.post_views === "string")
        return parseInt(meta.post_views) || 0;
    }

    return 0;
  }
  /**
   * Track view client-side with debouncing to prevent spam
   */
  static trackViewWithDebounce(postId: number, delay: number = 3000): void {
    // Store in sessionStorage to prevent multiple views in same session
    const viewKey = `post_view_${postId}`;
    const hasViewed = sessionStorage.getItem(viewKey);

    if (!hasViewed) {
      setTimeout(() => {
        this.trackPostView(postId);
        sessionStorage.setItem(viewKey, "true");
      }, delay);
    }
  }
}

// Export default instance
export default WordPressAPI;
