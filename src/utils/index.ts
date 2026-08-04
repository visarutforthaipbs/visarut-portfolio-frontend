import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to combine class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Decode HTML entities in a string (e.g. &#8220; → ", &amp; → &).
 * Safe to use on both server and client.
 */
export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

/**
 * Format date for display in Thai format (e.g. "20250101" or "2025-01-01" -> "1 มกราคม 2568")
 */
export function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "";

  if (dateStr instanceof Date) {
    const day = dateStr.getDate();
    const month = dateStr.getMonth();
    const thaiYear = dateStr.getFullYear() + 543;
    return `${day} ${THAI_MONTHS[month]} ${thaiYear}`;
  }

  const clean = String(dateStr).trim();

  // Pattern 1: YYYYMMDD (e.g. 20250101 -> 1 มกราคม 2568)
  if (/^\d{8}$/.test(clean)) {
    const year = parseInt(clean.substring(0, 4), 10);
    const month = parseInt(clean.substring(4, 6), 10);
    const day = parseInt(clean.substring(6, 8), 10);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const thaiYear = year + 543;
      const monthName = THAI_MONTHS[month - 1];
      return `${day} ${monthName} ${thaiYear}`;
    }
  }

  // Pattern 2: YYYY-MM-DD or ISO string
  const parsedDate = new Date(clean);
  if (!isNaN(parsedDate.getTime())) {
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth();
    const thaiYear = parsedDate.getFullYear() + 543;
    return `${day} ${THAI_MONTHS[month]} ${thaiYear}`;
  }

  return clean;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * Get WordPress media URL for featured media API
 */
export function getWordPressMediaUrl(baseUrl: string, mediaId: number): string {
  return `${baseUrl}/?rest_route=/wp/v2/media/${mediaId}`;
}

/**
 * Check if a URL is external
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Get optimized image URL from WordPress
 */
export function getOptimizedImageUrl(
  url: string,
  size: "thumbnail" | "medium" | "large" | "full" = "medium"
): string {
  if (!url) return "";

  // If it's a WordPress media URL, try to get the specified size
  if (url.includes("wp-content/uploads/")) {
    const baseUrl = url.replace(/\.[^/.]+$/, "");
    const extension = url.split(".").pop();

    if (size !== "full") {
      return `${baseUrl}-${size}.${extension}`;
    }
  }

  return url;
}

/**
 * Extract video ID from YouTube URL
 */
export function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extract video ID from Vimeo URL
 */
export function getVimeoVideoId(url: string): string | null {
  const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Extract the first image URL from HTML content
 */
export function extractFirstImage(htmlContent: string): string | null {
  if (!htmlContent) return null;

  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : null;
}

/**
 * Get featured image URL with fallback to first content image
 */
export function getBlogPostImage(
  featuredMediaUrl: string | null,
  postContent: string
): string | null {
  // If we have a featured media URL, use it
  if (featuredMediaUrl) {
    return featuredMediaUrl;
  }

  // Otherwise, try to extract first image from content
  return extractFirstImage(postContent);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
