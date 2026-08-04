"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout";
import { MarketplaceSearchBar } from "@/components/portfolio/MarketplaceSearchBar";
import { MarketplaceSidebar } from "@/components/portfolio/MarketplaceSidebar";
import { MarketplaceGrid } from "@/components/portfolio/MarketplaceGrid";
import { MarketplaceQuickViewModal } from "@/components/portfolio/MarketplaceQuickViewModal";
import { ContactModal } from "@/components/portfolio/ContactModal";
import { JsonLd } from "@/components/JsonLd";
import { usePortfolios } from "@/hooks/useWordPress";
import type { PortfolioItem } from "@/types/portfolio";
import { WordPressAPI } from "@/lib/wordpress";
import { AlertCircle, MessageSquare } from "lucide-react";

interface HomeClientProps {
  initialBlogPosts?: unknown[];
  featuredPortfolios: PortfolioItem[];
}

// Fuzzy organization matcher dictionary
const ORGANIZATIONS_FUZZY: Record<string, string[]> = {
  "thai-pbs": ["thai pbs", "thaipbs", "ไทยพีบีเอส", "สื่อสาธารณะ", "สำนักเครือข่ายสื่อสาธารณะ", "ศูนย์สื่อชุมชน"],
  greenpeace: ["greenpeace", "กรีนพีซ"],
  realframe: ["realframe", "เรียลเฟรม"],
  lanna: ["lanna", "ล้านนา"],
  nation: ["nation", "เนชั่น"],
  ngo: ["มูลนิธิ", "foundation", "ngo", "สมาคม", "เครือข่าย", "องค์กร", "แรงงาน"],
};

function matchOrganization(item: PortfolioItem, orgId: string): boolean {
  if (!orgId || orgId === "all") return true;

  const normalized = WordPressAPI.normalizePortfolio(item);
  const clientName = (normalized.meta.clientName || "").toLowerCase();

  const rawTitle = typeof item.title === "string" ? item.title : item.title?.rendered || "";
  const titleStr = rawTitle.toLowerCase();

  const rawExcerpt = item.excerpt ? (typeof item.excerpt === "string" ? item.excerpt : item.excerpt.rendered || "") : "";
  const excerptStr = rawExcerpt.toLowerCase();

  const acfStr = JSON.stringify(item.acf || {}).toLowerCase();
  const fullText = `${titleStr} ${excerptStr} ${clientName} ${acfStr}`;

  const aliases = ORGANIZATIONS_FUZZY[orgId.toLowerCase()] || [orgId.toLowerCase()];
  return aliases.some((alias) => fullText.includes(alias));
}

export default function HomeClient({ featuredPortfolios }: HomeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [activeQuickView, setActiveQuickView] = useState<PortfolioItem | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { portfolios, loading, error } = usePortfolios({ per_page: 50 });

  const sourcePortfolios =
    portfolios.length > 0 ? portfolios : featuredPortfolios;

  const syncQuickViewFromUrl = useCallback(() => {
    if (typeof window === "undefined" || sourcePortfolios.length === 0) return;

    const itemSlug = new URL(window.location.href).searchParams.get("item");
    setActiveQuickView(
      itemSlug
        ? sourcePortfolios.find((portfolio) => portfolio.slug === itemSlug) || null
        : null
    );
  }, [sourcePortfolios]);

  // Open shared project links and keep Back/Forward navigation in sync.
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

  // 3. Power-User Keyboard Shortcuts (Cmd+K / Ctrl+K / '/' to focus search)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        activeElement?.getAttribute("contenteditable") === "true";

      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") ||
        (e.key === "/" && !isTyping)
      ) {
        e.preventDefault();
        const inputEl = document.getElementById("portfolio-search") as HTMLInputElement | null;
        if (inputEl) inputEl.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Filter items by search query, category, fuzzy organization, and sort
  const filteredPortfolios = useMemo(() => {
    return sourcePortfolios
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "all" && item.category !== selectedCategory) {
          return false;
        }

        // Fuzzy Organization filter
        if (selectedOrg !== "all" && !matchOrganization(item, selectedOrg)) {
          return false;
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleStr = typeof item.title === "string" ? item.title : item.title.rendered;
          const excerptStr = item.excerpt
            ? typeof item.excerpt === "string"
              ? item.excerpt
              : item.excerpt.rendered
            : "";
          const acfStr = JSON.stringify(item.acf || {});

          const combined = (titleStr + " " + excerptStr + " " + acfStr).toLowerCase();
          return combined.includes(q);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        }
        if (sortBy === "title") {
          const titleA = typeof a.title === "string" ? a.title : a.title.rendered;
          const titleB = typeof b.title === "string" ? b.title : b.title.rendered;
          return titleA.localeCompare(titleB, "th");
        }
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });
  }, [sourcePortfolios, selectedCategory, selectedOrg, searchQuery, sortBy]);

  // Calculate category counts for sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: sourcePortfolios.length };
    sourcePortfolios.forEach((item) => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [sourcePortfolios]);

  // Calculate organization counts for sidebar
  const orgCounts = useMemo(() => {
    const counts: Record<string, number> = { all: sourcePortfolios.length };
    const orgKeys = ["thai-pbs", "greenpeace", "realframe", "lanna", "nation", "ngo"];
    orgKeys.forEach((key) => {
      counts[key] = sourcePortfolios.filter((item) => matchOrganization(item, key)).length;
    });
    return counts;
  }, [sourcePortfolios]);

  return (
    <Layout hideHeader={true}>
      {/* AI-SEO Structured Data Schema */}
      <JsonLd items={sourcePortfolios} />

      {/* Semantic H1 for Search Engine & AI Crawler indexing */}
      <h1 className="sr-only">
        วิศรุต แสนคำ | ผู้ผลิตสื่ออิสระ คลังผลงานมัลติมีเดีย ภาพถ่ายสารคดี วิดีโอ และเว็บแอปพลิเคชัน
      </h1>

      {/* ── PURE MARKETPLACE CATALOG CONTAINER ── */}
      <section className="w-full bg-base py-4 sm:py-6 md:py-8 min-h-[calc(100vh-4rem)] relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">
            {/* Sidebar with Profile, Experience, Categories & Contact */}
            <MarketplaceSidebar
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              selectedOrg={selectedOrg}
              onOrgSelect={setSelectedOrg}
              categoryCounts={categoryCounts}
              orgCounts={orgCounts}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onOpenContactModal={() => setIsContactModalOpen(true)}
            />

            {/* Main Stream (Search bar & Grid view) */}
            <main className="flex-1 flex flex-col gap-4 sm:gap-5 w-full min-w-0" id="main-content">
              {/* Search Toolbar */}
              <MarketplaceSearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
                totalCount={filteredPortfolios.length}
              />

              {/* Grid / List Results */}
              {error ? (
                <div className="py-12 text-center" role="alert">
                  <div className="flex items-center gap-2 justify-center text-dim">
                    <AlertCircle size={16} aria-hidden="true" />
                    <span className="text-sm">เกิดข้อผิดพลาดในการโหลดผลงาน</span>
                  </div>
                </div>
              ) : (
                <MarketplaceGrid
                  items={filteredPortfolios}
                  viewMode={viewMode}
                  onQuickView={openQuickView}
                  isLoading={loading && sourcePortfolios.length === 0}
                />
              )}
            </main>
          </div>
        </div>

        {/* ── MOBILE FLOATING ACTION BUTTON (FAB) FOR CONTACT ── */}
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-content text-base border border-edge rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="ติดต่องาน"
        >
          <MessageSquare size={18} className="text-accent" />
          <span className="text-xs font-bold">ติดต่องาน</span>
        </button>
      </section>

      {/* Quick View Drawer Modal */}
      <MarketplaceQuickViewModal
        portfolio={activeQuickView}
        onClose={closeQuickView}
      />

      {/* Contact Form Popup Dialog */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </Layout>
  );
}
