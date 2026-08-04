"use client";

import { Search, LayoutGrid, List, X, Filter } from "lucide-react";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";

interface MarketplaceSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onToggleMobileSidebar?: () => void;
  totalCount: number;
}

export function MarketplaceSearchBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onToggleMobileSidebar,
  totalCount,
}: MarketplaceSearchBarProps) {
  const categoryPills = [
    { value: "all", label: "ทั้งหมด" },
    ...Object.entries(PORTFOLIO_CATEGORIES).map(([key, label]) => ({
      value: key,
      label,
    })),
  ];

  return (
    <div className="w-full flex flex-col gap-3.5 sm:gap-4 bg-surface/60 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-edge/60 shadow-sm transition-all">
      {/* Top row: Search input + Controls (Mobile-First stack) */}
      <div className="flex flex-col md:flex-row items-center gap-3 w-full">
        {/* Search input (16px text on mobile prevents iOS auto-zoom) */}
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาผลงาน หัวข้อ ชื่องาน หรือองค์กร..."
            className="w-full pl-10 pr-9 py-2.5 sm:py-2.5 bg-base border border-edge/80 rounded-xl text-base sm:text-sm text-content placeholder:text-dim focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-content transition-colors p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="ล้างคำค้นหา"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right side controls (Full touch targets on mobile) */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Drawer Button */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden flex items-center justify-center gap-2 px-3.5 py-2.5 bg-base border border-edge rounded-xl text-xs font-semibold text-content hover:bg-surface transition-colors min-h-[44px] cursor-pointer"
            >
              <Filter size={15} className="text-accent" />
              <span>ตัวกรอง</span>
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-dim hidden sm:inline-block">เรียงตาม:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-base border border-edge/80 rounded-xl px-3 py-2.5 sm:py-2 text-xs font-medium text-content focus:outline-none focus:border-accent cursor-pointer transition-colors min-h-[44px]"
            >
              <option value="latest">ล่าสุด</option>
              <option value="oldest">เก่าสุด</option>
              <option value="title">ตามชื่อ A-Z</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-base p-1 rounded-xl border border-edge/80 min-h-[44px]">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer ${
                viewMode === "grid"
                  ? "bg-surface text-content shadow-sm"
                  : "text-dim hover:text-content"
              }`}
              title="มุมมองการ์ด (Grid)"
              aria-label="มุมมองการ์ด"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer ${
                viewMode === "list"
                  ? "bg-surface text-content shadow-sm"
                  : "text-dim hover:text-content"
              }`}
              title="มุมมองรายการ (List)"
              aria-label="มุมมองรายการ"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills (Touch-optimized horizontal scrolling) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-edge/40 min-h-[44px]">
        {categoryPills.map((pill) => {
          const isActive = selectedCategory === pill.value;
          return (
            <button
              key={pill.value}
              onClick={() => onCategorySelect(pill.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[38px] flex items-center shrink-0 ${
                isActive
                  ? "bg-content text-base shadow-sm font-semibold scale-[1.02]"
                  : "bg-base hover:bg-surface border border-edge/60 text-muted hover:text-content"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Active filters status bar */}
      {(searchQuery || selectedCategory !== "all") && (
        <div className="flex items-center justify-between pt-1 text-xs text-dim">
          <span>
            พบผลงาน <strong className="text-content">{totalCount}</strong> รายการ
          </span>
          <button
            onClick={() => {
              onSearchChange("");
              onCategorySelect("all");
            }}
            className="text-accent hover:underline text-xs font-medium cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}
    </div>
  );
}
