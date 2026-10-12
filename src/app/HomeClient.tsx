"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone, Send } from "lucide-react";
import { Layout } from "@/components/layout";
import { MarketplaceGrid } from "@/components/portfolio/MarketplaceGrid";
import { MarketplaceQuickViewModal } from "@/components/portfolio/MarketplaceQuickViewModal";
import { ContactModal } from "@/components/portfolio/ContactModal";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/config";
import type { PortfolioItem } from "@/types/portfolio";

interface HomeClientProps {
  portfolios: PortfolioItem[];
}

const LATEST_COUNT = 9;

export default function HomeClient({ portfolios }: HomeClientProps) {
  const [activeQuickView, setActiveQuickView] = useState<PortfolioItem | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Shared links (`/?item=slug`) still open the quick view; keep Back/Forward in sync.
  const syncQuickViewFromUrl = useCallback(() => {
    if (typeof window === "undefined" || portfolios.length === 0) return;
    const itemSlug = new URL(window.location.href).searchParams.get("item");
    setActiveQuickView(
      itemSlug ? portfolios.find((portfolio) => portfolio.slug === itemSlug) || null : null
    );
  }, [portfolios]);

  useEffect(() => {
    syncQuickViewFromUrl();
    window.addEventListener("popstate", syncQuickViewFromUrl);
    return () => window.removeEventListener("popstate", syncQuickViewFromUrl);
  }, [syncQuickViewFromUrl]);

  const openQuickView = (portfolio: PortfolioItem) => {
    const url = new URL(window.location.href);
    url.searchParams.set("item", portfolio.slug);
    window.history.pushState({ portfolioQuickView: true }, "", url);
    setActiveQuickView(portfolio);
  };

  const closeQuickView = () => {
    if (window.history.state?.portfolioQuickView) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("item");
    window.history.replaceState(window.history.state, "", url);
    setActiveQuickView(null);
  };

  const latest = useMemo(
    () =>
      [...portfolios]
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        .slice(0, LATEST_COUNT),
    [portfolios]
  );

  const total = portfolios.length;
  const phone = siteConfig.social.phone ?? "";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <Layout>
      <JsonLd items={portfolios} />

      {/* ── Identity: who, what, one action ── */}
      <section
        aria-labelledby="home-title"
        className="w-full bg-canvas border-b border-edge/60"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-16">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start">
            <img
              src="https://api.sankham.cv/wp-content/uploads/2025/08/visarut-profile-300x289.jpg"
              alt="ภาพถ่าย วิศรุต แสนคำ"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-edge bg-surface shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.svg";
              }}
            />
            <div className="flex flex-col gap-4 min-w-0">
              <div className="flex flex-col gap-1.5">
                <h1
                  id="home-title"
                  className="text-3xl md:text-5xl font-bold text-content tracking-tight leading-[1.15]"
                >
                  วิศรุต แสนคำ
                </h1>
                <p className="text-base md:text-lg font-semibold text-accent">
                  ผู้ผลิตสื่ออิสระ · เชียงใหม่
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-full bg-content text-canvas text-sm font-semibold hover:opacity-85 active:scale-[0.98] transition-[opacity,transform] cursor-pointer"
                >
                  <Send size={15} aria-hidden="true" />
                  <span>ส่งข้อความติดต่องาน</span>
                </button>
                <Link
                  href="/portfolio"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 rounded-full bg-canvas border border-edge text-sm font-semibold text-content hover:bg-surface active:scale-[0.98] transition-[background-color,transform]"
                >
                  <span>ดูผลงานทั้งหมด{total > 0 ? ` (${total})` : ""}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-dim">
                <a
                  href={`mailto:${siteConfig.social.email}`}
                  className="inline-flex items-center gap-1.5 min-h-[36px] hover:text-content transition-colors"
                >
                  <Mail size={14} aria-hidden="true" />
                  <span>{siteConfig.social.email}</span>
                </a>
                {phone && (
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-1.5 min-h-[36px] hover:text-content transition-colors"
                  >
                    <Phone size={14} aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full bg-canvas">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-14 flex flex-col gap-12 md:gap-16">
          {/* ── Latest ── */}
          <section aria-labelledby="latest-title" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <h2 id="latest-title" className="text-xl md:text-2xl font-bold text-content tracking-tight">
                ผลงานล่าสุด
              </h2>
              <Link
                href="/portfolio"
                className="hidden sm:inline-flex items-center gap-1 min-h-[36px] px-2 -mr-2 rounded-lg text-sm font-semibold text-accent hover:bg-surface transition-colors"
              >
                <span>ดูทั้งหมด</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {latest.length > 0 ? (
              <MarketplaceGrid items={latest} viewMode="grid" onQuickView={openQuickView} />
            ) : (
              <div className="w-full text-center py-16 bg-surface/30 rounded-2xl border border-edge/60 flex flex-col items-center gap-3">
                <p className="text-sm text-muted">โหลดรายการผลงานไม่สำเร็จในขณะนี้</p>
                <Link href="/portfolio" className="inline-flex items-center min-h-[44px] px-4 rounded-xl border border-edge text-sm font-semibold text-content hover:bg-surface">
                  เปิดคลังผลงาน
                </Link>
              </div>
            )}

            <Link
              href="/portfolio"
              className="sm:hidden inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 rounded-full bg-canvas border border-edge text-sm font-semibold text-content hover:bg-surface transition-colors"
            >
              <span>ดูผลงานทั้งหมด{total > 0 ? ` (${total})` : ""}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>

      <MarketplaceQuickViewModal portfolio={activeQuickView} onClose={closeQuickView} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </Layout>
  );
}
