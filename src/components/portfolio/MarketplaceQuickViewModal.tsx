"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  ExternalLink,
  Calendar,
  Building2,
  MapPin,
  Camera,
  Code,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
  Palette,
  Printer,
  Share2,
  Check,
} from "lucide-react";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem, ImageMedia } from "@/types/portfolio";
import { WordPressAPI } from "@/lib/wordpress";
import { sanitizeHtml } from "@/lib/sanitize";

interface MarketplaceQuickViewModalProps {
  portfolio: PortfolioItem | null;
  onClose: () => void;
}

const SPEC_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Client: Building2,
  Date: Calendar,
  Location: MapPin,
  "Camera / Equipment": Camera,
  Style: Palette,
  Technologies: Code,
  "Print Specs": Printer,
  Role: User,
};

const SPEC_LABELS_TH: Record<string, string> = {
  Client: "องค์กร / ลูกค้า",
  Date: "วันที่ดำเนินโครงการ",
  Location: "สถานที่",
  "Camera / Equipment": "อุปกรณ์ / กล้อง",
  Style: "สไตล์ / โทนงาน",
  Technologies: "เทคโนโลยี / ซอฟต์แวร์",
  "Print Specs": "ขนาดสิ่งพิมพ์ / วัสดุ",
  Role: "บทบาทหน้าที่",
};

/** Helper to extract image URLs from HTML */
function extractImageUrlsFromHtml(html: string): string[] {
  if (!html) return [];
  const urls: string[] = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1]) urls.push(match[1]);
  }
  return urls;
}

/** Helper to clean right-side text HTML (stripping images, repeated titles, and legacy text dumps) */
function cleanRightPanelContent(html: string, title: string): string {
  if (!html) return "";

  let cleaned = html
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "")
    .replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, "")
    .replace(/<img[^>]*\/?>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<video[^>]*>[\s\S]*?<\/video>/gi, "");

  // Strip legacy plain-text label blocks like "ลูกค้า\nกรีนพีซ...", "งานที่ทำ\nภาพถ่าย"
  cleaned = cleaned
    .replace(/<p[^>]*>\s*(?:ลูกค้า|งานที่ทำ|หมวดหมู่|ประเภทงาน)\s*<\/p>\s*<p[^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/(?:ลูกค้า|งานที่ทำ|หมวดหมู่|ประเภทงาน)\s*<br\s*\/?>\s*[^<]*/gi, "");

  // Remove paragraph if text equals title
  const cleanTitleStr = title.trim().toLowerCase();
  cleaned = cleaned.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, pText) => {
    const textOnly = pText.replace(/<[^>]*>/g, "").trim().toLowerCase();
    if (textOnly === cleanTitleStr || textOnly === "") {
      return "";
    }
    return match;
  });

  return cleaned.trim();
}

export function MarketplaceQuickViewModal({
  portfolio,
  onClose,
}: MarketplaceQuickViewModalProps) {
  // 1. All hooks MUST be defined at the top unconditionally (React Rules of Hooks)
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = Boolean(portfolio);

  // Prepare data safely for hooks without early returns
  const normalized = portfolio ? WordPressAPI.normalizePortfolio(portfolio) : null;
  const embeddedImages = portfolio ? extractImageUrlsFromHtml(portfolio.content?.rendered || "") : [];

  const getFeaturedImageUrl = (
    image: string | ImageMedia | undefined
  ): string => {
    if (!image) return "/placeholder-image.svg";
    if (typeof image === "string") return image;
    return image.url || "/placeholder-image.svg";
  };

  const galleryImages: string[] = normalized
    ? [
        getFeaturedImageUrl(normalized.featuredImage),
        ...(normalized.galleryImages?.map((m) => m.url) || []),
        ...embeddedImages,
      ].filter((url, index, self) => self.indexOf(url) === index && url && url !== "/placeholder-image.svg")
    : [];

  if (galleryImages.length === 0) {
    galleryImages.push("/placeholder-image.svg");
  }

  // Hook 3: Keyboard navigation & Shortcuts
  useEffect(() => {
    if (!portfolio) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && galleryImages.length > 1) {
        setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight" && galleryImages.length > 1) {
        setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [portfolio, onClose, galleryImages.length]);

  // Hook 4: Reset image index on portfolio change
  useEffect(() => {
    setActiveImageIndex(0);
  }, [portfolio]);

  // Keep keyboard focus inside the modal flow and prevent background scrolling.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  // 2. Conditional early return AFTER all Hooks are defined
  if (!portfolio || !normalized) return null;

  const categoryLabel =
    PORTFOLIO_CATEGORIES[normalized.category] || normalized.category;

  const cleanTitle = normalized.title.replace(/<[^>]*>/g, "");
  
  // 1. Clean content body text (with images/figures stripped)
  const cleanedContentText = cleanRightPanelContent(portfolio.content?.rendered || "", cleanTitle);

  // 2. Clean ACF project description
  const cleanedAcfText = cleanRightPanelContent(normalized.meta.description || "", cleanTitle);

  // 3. Clean excerpt text
  const cleanedExcerptText = cleanRightPanelContent(portfolio.excerpt?.rendered || "", cleanTitle);

  // Helper to check if an HTML string has actual text content
  const hasVisibleText = (html: string): boolean => {
    if (!html) return false;
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, "").trim().length > 0;
  };

  // Fallback chain: Pick the best available text with visible characters
  let rawText = "";
  if (hasVisibleText(cleanedContentText)) {
    rawText = cleanedContentText;
  } else if (hasVisibleText(cleanedAcfText)) {
    rawText = cleanedAcfText;
  } else if (hasVisibleText(cleanedExcerptText)) {
    rawText = cleanedExcerptText;
  }

  // If both ACF description and body content exist and are distinct, include ACF summary first!
  if (hasVisibleText(cleanedAcfText) && hasVisibleText(cleanedContentText) && !cleanedContentText.includes(cleanedAcfText.trim())) {
    rawText = `<p className="font-medium text-content/90">${cleanedAcfText}</p>${cleanedContentText}`;
  }

  const textContentHtml = sanitizeHtml(rawText);

  const externalLink = normalized.meta.externalUrl;
  const clientName = normalized.meta.clientName;

  // Handle Share / Copy Link
  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanTitle,
          text: `ผลงาน: ${cleanTitle} โดย วิศรุต แสนคำ`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if share dialog is dismissed
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-base border border-edge rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-0 sm:my-auto flex flex-col max-h-[94vh] sm:max-h-[92vh] transition-all">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-full flex justify-center py-2 bg-surface/90 border-b border-edge/30 cursor-grab">
          <div className="w-12 h-1 bg-edge rounded-full" />
        </div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-edge/60 bg-surface/95 sticky top-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0 pr-2">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-accent/15 text-accent font-semibold rounded-full text-[11px] sm:text-xs uppercase tracking-wider">
              {categoryLabel}
            </span>
            {normalized.date && (
              <span className="flex items-center gap-1 text-[11px] sm:text-xs text-dim">
                <Calendar size={13} />
                {normalized.date}
              </span>
            )}
            {clientName && (
              <span className="flex items-center gap-1 text-[11px] sm:text-xs text-accent font-medium bg-surface px-2 py-0.5 rounded-full border border-edge truncate max-w-[140px] sm:max-w-[200px]">
                <Building2 size={12} />
                <span className="truncate">{clientName}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Share / Copy Link Button */}
            <button
              ref={closeButtonRef}
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-hover border border-edge rounded-xl text-xs font-semibold text-content transition-colors cursor-pointer min-h-[38px]"
              title="แชร์ หรือ คัดลอกลิงก์ผลงานนี้"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-accent" />
                  <span className="text-accent text-[11px]">คัดลอกลิงก์แล้ว!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="text-accent" />
                  <span className="hidden sm:inline text-[11px]">แชร์ลิงก์</span>
                </>
              )}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-dim hover:text-content hover:bg-surface rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="ปิดหน้าต่าง"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view */}
        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-edge/60">
          {/* Left Media Section */}
          <div className="md:col-span-7 p-3 sm:p-5 bg-black/40 flex flex-col gap-3 sm:gap-4 justify-between">
            {/* Slide Container */}
            <div className="relative min-h-[240px] sm:min-h-[340px] md:min-h-[400px] max-h-[45vh] sm:max-h-[55vh] w-full rounded-2xl overflow-hidden bg-black/90 group flex items-center justify-center border border-edge/40">
              <img
                src={galleryImages[activeImageIndex] || "/placeholder-image.svg"}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 pointer-events-none scale-110"
              />

              <img
                src={galleryImages[activeImageIndex] || "/placeholder-image.svg"}
                alt={cleanTitle}
                className="relative z-10 max-w-full max-h-[45vh] sm:max-h-[55vh] w-auto h-auto object-contain transition-all duration-300 shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                }}
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? galleryImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute z-20 left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="ภาพก่อนหน้า"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === galleryImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute z-20 right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="ภาพถัดไป"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-center min-h-[44px]">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer min-w-[56px] min-h-[44px] ${
                      activeImageIndex === idx
                        ? "border-accent scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`ภาพที่ ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action buttons bar */}
            <div className="flex items-center gap-2.5 w-full">
              {externalLink && (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-content text-base font-semibold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm cursor-pointer min-h-[44px]"
                >
                  <span>เปิดดูสื่อจริง / เว็บไซต์ (Live Project)</span>
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Right Details Panel */}
          <div className="md:col-span-5 p-4 sm:p-6 flex flex-col gap-5 sm:gap-6 overflow-y-auto max-h-[45vh] md:max-h-[75vh]">
            <div className="flex flex-col gap-2.5">
              <h2 id="quick-view-title" className="text-lg sm:text-xl md:text-2xl font-bold text-content leading-snug">
                {cleanTitle}
              </h2>

              {textContentHtml && (
                <div
                  className="text-xs sm:text-sm text-muted leading-relaxed space-y-2 prose prose-invert max-w-none border-b border-edge/60 pb-4"
                  dangerouslySetInnerHTML={{ __html: textContentHtml }}
                />
              )}
            </div>

            {normalized.specs.length > 0 && (
              <div className="flex flex-col gap-2.5 text-xs">
                <span className="font-bold text-content flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-accent">
                  <Sparkles size={14} />
                  <span>ข้อมูลและรายละเอียดเชิงลึก</span>
                </span>

                <div className="grid grid-cols-1 gap-2 bg-surface/50 p-3.5 sm:p-4 rounded-2xl border border-edge/60">
                  {normalized.specs.map((spec, idx) => {
                    const Icon = SPEC_ICONS[spec.label] || Sparkles;
                    const labelTh = SPEC_LABELS_TH[spec.label] || spec.label;

                    return (
                      <div key={idx} className="flex items-start justify-between text-muted gap-2 py-0.5">
                        <span className="flex items-center gap-1.5 text-dim shrink-0 font-medium">
                          <Icon size={14} className="text-accent" />
                          <span>{labelTh}:</span>
                        </span>
                        <span className="font-semibold text-content text-right">{spec.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
