"use client";

import { useState } from "react";
import {
  Camera,
  Video,
  Film,
  Code,
  Palette,
  Briefcase,
  Megaphone,
  Printer,
  Sparkles,
  Building2,
  Tag,
  CheckCircle2,
  X,
  Layers,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Award,
  Send,
  Radio,
  GraduationCap,
  FileSearch,
  PenTool,
} from "lucide-react";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import { workExperience, awards } from "@/constants/data";

interface MarketplaceSidebarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  selectedOrg?: string;
  onOrgSelect: (org: string) => void;
  categoryCounts?: Record<string, number>;
  orgCounts?: Record<string, number>;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenContactModal?: () => void;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  photography: Camera,
  videography: Video,
  "video-editing": Film,
  website: Code,
  "graphic-design": Palette,
  print: Printer,
  exhibition: Building2,
  campaign: Megaphone,
  producer: Layers,
  "live-stream": Radio,
  training: GraduationCap,
  research: FileSearch,
  writing: PenTool,
};

export const ORGANIZATIONS = [
  { id: "all", label: "ทุกองค์กร / โครงการ" },
  { id: "thai-pbs", label: "ไทยพีบีเอส (Thai PBS)" },
  { id: "greenpeace", label: "กรีนพีซ (Greenpeace)" },
  { id: "realframe", label: "Realframe" },
  { id: "lanna", label: "โครงการล้านนา (Lanna Project)" },
  { id: "nation", label: "หนังสือพิมพ์เดอะเนชั่น (The Nation)" },
  { id: "ngo", label: "ภาคประชาสังคม / มูลนิธิ (NGOs)" },
];

export function MarketplaceSidebar({
  selectedCategory,
  onCategorySelect,
  selectedOrg = "all",
  onOrgSelect,
  categoryCounts = {},
  orgCounts = {},
  isOpenMobile = false,
  onCloseMobile,
  onOpenContactModal,
}: MarketplaceSidebarProps) {
  const [showExperience, setShowExperience] = useState(false);
  const [showAwards, setShowAwards] = useState(false);

  const categoriesList = [
    { key: "all", label: "ผลงานทั้งหมด", icon: Sparkles },
    ...Object.entries(PORTFOLIO_CATEGORIES).map(([key, label]) => ({
      key,
      label,
      icon: CATEGORY_ICONS[key] || Tag,
    })),
  ];

  const sidebarContent = (
    <div className="flex flex-col gap-5 w-full">
      {/* ── 1. PRODUCER CARD ── */}
      <div className="p-4 bg-surface/80 rounded-2xl border border-edge/80 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-accent/40 bg-surface shrink-0">
            <img
              src="https://api.sankham.cv/wp-content/uploads/2025/08/visarut-profile.jpg"
              alt="วิศรุต แสนคำ"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.svg";
              }}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content leading-tight">วิศรุต แสนคำ</h3>
            <span className="text-[11px] text-accent font-semibold">ผู้ผลิตสื่ออิสระ</span>
          </div>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          ช่างภาพสารคดี ผู้กำกับภาพวิดีโอ และนักพัฒนาเว็บสื่อสังคม — รังสรรค์งานภาพถ่ายสารคดี วิดีโอเชิงประเด็น เว็บไซต์อินเทอร์แอคทีฟ และสื่อแคมเปญขับเคลื่อนสังคม
        </p>

        {/* Contact buttons */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href="mailto:visarut298@gmail.com"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-base hover:bg-surface border border-edge rounded-xl text-[11px] font-semibold text-content transition-colors"
          >
            <Mail size={13} className="text-accent" />
            <span>อีเมล</span>
          </a>
          <a
            href="tel:+66627283058"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-base hover:bg-surface border border-edge rounded-xl text-[11px] font-semibold text-content transition-colors"
          >
            <Phone size={13} className="text-accent" />
            <span>โทรศัพท์</span>
          </a>
        </div>

        {/* Trigger Contact Modal */}
        {onOpenContactModal && (
          <button
            onClick={onOpenContactModal}
            className="w-full mt-1 flex items-center justify-center gap-2 py-2 px-3 bg-content text-base font-semibold rounded-xl text-xs hover:opacity-90 transition-all shadow-xs cursor-pointer"
          >
            <Send size={13} className="text-accent" />
            <span>ส่งข้อความติดต่องาน</span>
          </button>
        )}
      </div>

      {/* ── 2. CATEGORY NAVIGATION ── */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-dim uppercase tracking-wider px-2">
          หมวดหมู่สื่อ &amp; ผลงาน
        </span>

        {categoriesList.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.key;
          const count = categoryCounts[cat.key];

          return (
            <button
              key={cat.key}
              onClick={() => {
                onCategorySelect(cat.key);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-accent/15 text-accent font-semibold border border-accent/30 shadow-2xs"
                  : "text-muted hover:text-content hover:bg-surface"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} className={isSelected ? "text-accent" : "text-dim"} />
                <span>{cat.label}</span>
              </span>
              {count !== undefined && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-accent text-white font-bold" : "bg-surface text-dim font-medium"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 3. ORGANIZATION FILTER (FUZZY MATCHED) ── */}
      <div className="flex flex-col gap-2 pt-3 border-t border-edge/60">
        <span className="text-[11px] font-bold text-dim uppercase tracking-wider px-2 flex items-center gap-1.5">
          <Building2 size={13} />
          <span>กรองตามองค์กร / โครงการ</span>
        </span>
        <div className="flex flex-col gap-1">
          {ORGANIZATIONS.map((org) => {
            const isSelected = selectedOrg === org.id;
            const count = orgCounts[org.id];

            return (
              <button
                key={org.id}
                onClick={() => {
                  onOrgSelect(org.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-surface text-content font-semibold border border-edge/80 shadow-2xs"
                    : "text-muted hover:text-content hover:bg-surface/50"
                }`}
              >
                <span>{org.label}</span>
                <div className="flex items-center gap-1.5">
                  {count !== undefined && count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface text-dim">
                      {count}
                    </span>
                  )}
                  {isSelected && <CheckCircle2 size={14} className="text-accent shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. WORK EXPERIENCE COLLAPSIBLE ── */}
      <div className="flex flex-col gap-2 pt-3 border-t border-edge/60">
        <button
          onClick={() => setShowExperience(!showExperience)}
          className="w-full flex items-center justify-between px-2 text-[11px] font-bold text-dim uppercase tracking-wider cursor-pointer hover:text-content"
        >
          <span className="flex items-center gap-1.5">
            <Briefcase size={13} />
            <span>ประวัติการทำงาน (Experience)</span>
          </span>
          {showExperience ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showExperience && (
          <div className="flex flex-col gap-2 pt-1 pl-1">
            {workExperience.map((job, idx) => (
              <div key={idx} className="p-2.5 bg-surface/40 rounded-xl border border-edge/40 text-xs">
                <div className="flex items-center justify-between font-semibold text-content">
                  <span>{job.company}</span>
                  <span className="text-[10px] text-accent">{job.year}</span>
                </div>
                <div className="text-[11px] text-dim">{job.position}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. AWARDS COLLAPSIBLE ── */}
      <div className="flex flex-col gap-2 pt-3 border-t border-edge/60">
        <button
          onClick={() => setShowAwards(!showAwards)}
          className="w-full flex items-center justify-between px-2 text-[11px] font-bold text-dim uppercase tracking-wider cursor-pointer hover:text-content"
        >
          <span className="flex items-center gap-1.5">
            <Award size={13} />
            <span>รางวัล (Awards)</span>
          </span>
          {showAwards ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAwards && (
          <div className="flex flex-col gap-2 pt-1 pl-1">
            {awards.map((award, idx) => (
              <div key={idx} className="p-2.5 bg-surface/40 rounded-xl border border-edge/40 text-xs">
                <div className="font-semibold text-content">{award.title}</div>
                <div className="text-[11px] text-dim">{award.organization} ({award.year})</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-surface/40 p-4 rounded-2xl border border-edge/60 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative ml-auto w-4/5 max-w-xs bg-base border-l border-edge p-5 h-full overflow-y-auto shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 border-b border-edge/60 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-content">ตัวกรอง &amp; ข้อมูล</span>
              <button onClick={onCloseMobile} className="p-1 text-dim hover:text-content">
                <X size={18} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
