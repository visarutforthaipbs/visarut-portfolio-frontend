"use client";

import {
  Camera,
  Video,
  Code,
  Palette,
  ArrowRight,
  MapPin,
  Award,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { FeaturedSlider } from "@/components/portfolio/FeaturedSlider";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem, ImageMedia } from "@/types/portfolio";
import { getBlogPostImage, decodeHtmlEntities } from "@/utils";
import type { BlogPost, WordPressFeaturedMedia } from "@/types/wordpress";

const SERVICES = [
  { icon: Camera, title: "Photography", titleTh: "ภาพถ่าย", category: "photography" },
  { icon: Video, title: "Videography", titleTh: "วิดีโอ", category: "videography" },
  { icon: Code, title: "Web Development", titleTh: "เว็บไซต์", category: "website" },
  { icon: Palette, title: "Graphic Design", titleTh: "กราฟิกดีไซน์", category: "graphic-design" },
];

interface HomeClientProps {
  initialBlogPosts: BlogPost[];
  featuredPortfolios: PortfolioItem[];
}

export default function HomeClient({ initialBlogPosts, featuredPortfolios }: HomeClientProps) {
  return (
    <Layout>
      {/* ── LAYER 1: SUBCONSCIOUS HOOK ── */}
      <section
        role="region"
        aria-label="แนะนำตัว"
        className="relative overflow-hidden bg-base py-20 md:py-32"
      >
        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto px-5 md:px-6 relative">
          <div className="flex flex-col gap-6 items-start">
            <span className="text-sm font-medium text-accent uppercase tracking-[0.12em]">
              Visarut Sankham
            </span>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-content max-w-[680px]">
              Visual Storyteller
              <br />
              <span className="text-muted">&amp; Media Producer</span>
            </h1>

            <p className="text-base md:text-lg text-muted leading-[1.7] max-w-[520px]">
              เล่าเรื่องผ่านภาพถ่าย วิดีโอ และสื่อดิจิทัล
              เพื่อสังคม สิ่งแวดล้อม และสิทธิมนุษยชน
            </p>

            {/* Authority markers */}
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {[
                { icon: Briefcase, label: "Thai PBS" },
                { icon: MapPin, label: "Thailand" },
                { icon: Award, label: "Award-winning" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-1.5">
                  <badge.icon size={14} className="text-dim" />
                  <span className="text-xs text-dim font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Slider ── */}
      {featuredPortfolios.length > 0 && (
        <FeaturedSlider items={featuredPortfolios} />
      )}

      {/* ── LAYER 2: SPECIALIZATIONS ── */}
      <section
        role="region"
        aria-label="บริการ"
        className="bg-base py-12 md:py-20"
      >
        <div className="max-w-4xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-8 md:gap-12">
            <span className="text-xs font-medium text-dim uppercase tracking-[0.1em]">
              Specializations
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SERVICES.map((service) => (
                <Link key={service.title} href={`/portfolio?category=${service.category}`}>
                  <div className="bg-surface border border-edge rounded-xl p-5 md:p-6 transition-all duration-250 hover:border-accent hover:bg-surface-hover cursor-pointer h-full">
                    <div className="flex flex-col gap-3 items-start">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-dim">
                        <service.icon size={16} className="text-accent" />
                      </div>
                      <span className="text-sm font-semibold text-content">{service.titleTh}</span>
                      <span className="text-xs text-dim">{service.title}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Minimal divider ── */}
      <div className="flex justify-center bg-base" aria-hidden="true">
        <div className="w-10 h-px bg-edge" />
      </div>

      {/* ── LAYER 3: PORTFOLIO ── */}
      <section className="w-full flex justify-center bg-base py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-6 w-full">
          <DarkPortfolioGrid maxItems={6} />
        </div>
      </section>

      {/* ── Minimal divider ── */}
      <div className="flex justify-center bg-base" aria-hidden="true">
        <div className="w-10 h-px bg-edge" />
      </div>

      {/* ── BLOG ── */}
      <section
        className="w-full flex justify-center bg-base py-12 md:py-20"
        role="region"
        aria-label="บทความล่าสุด"
      >
        <div className="max-w-5xl mx-auto px-5 md:px-6 w-full">
          <div className="flex flex-col gap-8 md:gap-12 w-full">
            <span className="text-xs font-medium text-dim uppercase tracking-[0.1em] self-start">
              Latest Writing
            </span>

            {initialBlogPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
                  {initialBlogPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                <Link href="/blog" aria-label="ดูบทความทั้งหมด">
                  <div className="flex items-center gap-2 text-muted font-medium text-sm hover:gap-3 hover:text-content transition-all duration-200 cursor-pointer">
                    <span>ดูบทความทั้งหมด</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </div>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* ─────────────────────────────────────────────
   DARK PORTFOLIO GRID
   ───────────────────────────────────────────── */

function DarkPortfolioGrid({ maxItems = 6 }: { maxItems?: number }) {
  const { portfolios, loading, error } = usePortfolios({ per_page: maxItems });

  if (error) {
    return (
      <div className="py-8 text-center" role="alert">
        <div className="flex items-center gap-2 justify-center text-dim">
          <AlertCircle size={16} aria-hidden="true" />
          <span className="text-sm">เกิดข้อผิดพลาดในการโหลดผลงาน</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10 w-full" aria-label="ผลงานล่าสุด" role="region">
      <span className="text-xs font-medium text-dim uppercase tracking-[0.1em] self-start">
        Recent Work
      </span>

      {loading ? (
        <div
          className="w-full"
          style={{
            columnCount: 1,
            columnGap: "1rem",
          }}
        >
          <style>{`@media(min-width:30em){.masonry-skeleton{column-count:2!important}}@media(min-width:62em){.masonry-skeleton{column-count:3!important}}`}</style>
          <div className="masonry-skeleton" style={{ columnCount: 1, columnGap: "1rem" }}>
            {Array.from({ length: maxItems }).map((_, index) => (
              <div key={index} style={{ breakInside: "avoid" }} className="mb-4">
                <div className="h-[200px] md:h-[220px] rounded-xl animate-pulse bg-surface" />
              </div>
            ))}
          </div>
        </div>
      ) : portfolios.length > 0 ? (
        <>
          <div
            className="w-full columns-1 sm:columns-2 lg:columns-3 gap-4"
          >
            {portfolios.map((portfolio) => (
              <DarkPortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>

          <Link href="/portfolio" aria-label="ดูผลงานทั้งหมด">
            <div className="flex items-center gap-2 text-muted font-medium text-sm hover:gap-3 hover:text-content transition-all duration-200 cursor-pointer">
              <span>ดูผลงานทั้งหมด</span>
              <ArrowRight size={16} aria-hidden="true" />
            </div>
          </Link>
        </>
      ) : (
        <div className="text-center py-12">
          <span className="text-sm text-dim">ยังไม่มีผลงานที่จะแสดง</span>
        </div>
      )}
    </div>
  );
}

function DarkPortfolioCard({ portfolio }: { portfolio: PortfolioItem }) {
  const categoryLabel = PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category;

  const getFeaturedImageUrl = (image: string | ImageMedia | undefined): string => {
    if (!image) return "/placeholder-image.svg";
    if (typeof image === "string") return image;
    return image.url || "/placeholder-image.svg";
  };

  const getTextContent = (content: { rendered: string } | string): string => {
    if (typeof content === "string") return content;
    return content.rendered || "";
  };

  return (
    <Link href={`/portfolio/${portfolio.slug}`} aria-label={getTextContent(portfolio.title)}>
      <article className="cursor-pointer group" style={{ breakInside: "avoid" }}>
        <div className="mb-4">
          <div className="overflow-hidden rounded-xl bg-surface">
            <img
              src={getFeaturedImageUrl(portfolio.featured_image)}
              alt={getTextContent(portfolio.title)}
              className="w-full h-auto block object-cover transition-opacity duration-200 group-hover:opacity-85"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.svg";
              }}
            />
          </div>

          <div className="flex flex-col items-start gap-1 mt-3">
            <span className="text-xs text-dim uppercase tracking-wider">
              {categoryLabel}
            </span>
            <h3 className="text-lg md:text-xl font-medium text-content leading-[1.2] line-clamp-2">
              {getTextContent(portfolio.title)}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   BLOG CARD (Dark variant)
   ───────────────────────────────────────────── */

function BlogCard({ post }: { post: BlogPost }) {
  const embeddedMedia = (post as BlogPost & { _embedded?: { "wp:featuredmedia"?: WordPressFeaturedMedia[] } })._embedded?.["wp:featuredmedia"]?.[0];
  const thumbnail = embeddedMedia
    ? (embeddedMedia.media_details?.sizes?.medium?.source_url || embeddedMedia.source_url)
    : getBlogPostImage(null, post.content.rendered);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const titleText = decodeHtmlEntities(post.title.rendered.replace(/<[^>]*>/g, ""));
  const excerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .slice(0, 100)
    .trim();

  return (
    <Link href={`/blog/${post.slug}`} aria-label={titleText}>
      <article className="cursor-pointer group bg-surface border border-edge rounded-xl overflow-hidden transition-all duration-250 hover:border-accent hover:bg-surface-hover">
        <div className="aspect-video w-full bg-surface">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={titleText}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
        <div className="flex flex-col items-start gap-2 p-4 md:p-5">
          <span className="text-xs text-dim tracking-wide">
            {formatDate(post.date)}
          </span>
          <h3 className="text-base md:text-lg font-semibold text-content leading-[1.3] line-clamp-2">
            {titleText}
          </h3>
          {excerpt && (
            <p className="text-sm text-muted leading-[1.6] line-clamp-2">
              {excerpt}...
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
