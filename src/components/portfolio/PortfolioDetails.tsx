import {
  Camera,
  MapPin,
  User,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Clock,
  Video,
  Film,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  PortfolioItem,
  PhotographyACF,
  VideographyACF,
  WebsiteACF,
} from "@/types/portfolio";
import { sanitizeHtml } from "@/lib/sanitize";

interface PortfolioACFDisplayProps {
  portfolio: PortfolioItem;
}

export function PortfolioACFDisplay({ portfolio }: PortfolioACFDisplayProps) {
  const acf = portfolio.acf;

  // Type-safe ACF field access based on category
  const getACFData = () => {
    switch (portfolio.category) {
      case "photography":
        return acf as PhotographyACF;
      case "videography":
      case "video-editing":
        return acf as VideographyACF;
      case "website":
        return acf as WebsiteACF;
      case "graphic-design":
      case "print":
      case "exhibition":
      case "campaign":
      case "producer":
        return acf as Record<string, unknown>;
      default:
        return acf;
    }
  };

  const acfData = getACFData();

  // Render ACF fields based on category
  const renderACFFields = () => {
    if (portfolio.category === "photography") {
      const photoACF = acfData as PhotographyACF;
      return (
        <div className="flex flex-col gap-6 items-start w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            {photoACF.camera_equipment && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <Camera size={18} />
                  <span className="text-sm font-semibold">อุปกรณ์ถ่ายภาพ</span>
                </div>
                <p className="text-base text-muted">{photoACF.camera_equipment}</p>
              </div>
            )}
            {photoACF.photo_location && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <MapPin size={18} />
                  <span className="text-sm font-semibold">สถานที่ถ่ายภาพ</span>
                </div>
                <p className="text-base text-muted">{photoACF.photo_location}</p>
              </div>
            )}
            {photoACF.client_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ลูกค้า</span>
                </div>
                <p className="text-base text-muted">{photoACF.client_name}</p>
              </div>
            )}
            {photoACF.project_date && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <CalendarIcon size={18} />
                  <span className="text-sm font-semibold">วันที่ถ่ายภาพ</span>
                </div>
                <p className="text-base text-muted">{photoACF.project_date}</p>
              </div>
            )}
          </div>

          {photoACF.photography_style && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">รูปแบบการถ่ายภาพ</span>
              <span className="bg-accent-dim text-accent px-3 py-1 rounded-full">{photoACF.photography_style}</span>
            </div>
          )}

          {photoACF.project_description && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">รายละเอียดโปรเจค</span>
              <p className="text-base text-muted leading-[1.8]">{photoACF.project_description}</p>
            </div>
          )}
        </div>
      );
    }

    // Video ACF Display
    if (
      portfolio.category === "videography" ||
      portfolio.category === "video-editing"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoACF = acfData as any;
      return (
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {videoACF.video_type && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <Film size={18} />
                  <span className="text-sm font-semibold">ประเภทวีดีโอ</span>
                </div>
                <span className="bg-accent-dim text-accent px-3 py-1 rounded-full">
                  {videoACF.video_type === "documentary" ? "สารคดี"
                    : videoACF.video_type === "commercial" ? "โฆษณา"
                    : videoACF.video_type === "music-video" ? "มิวสิควิดีโอ"
                    : videoACF.video_type}
                </span>
              </div>
            )}
            {videoACF.video_duration && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <Clock size={18} />
                  <span className="text-sm font-semibold">ระยะเวลา</span>
                </div>
                <p className="text-base text-muted">{videoACF.video_duration}</p>
              </div>
            )}
            {videoACF.client_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ลูกค้า</span>
                </div>
                <p className="text-base text-muted">{videoACF.client_name}</p>
              </div>
            )}
            {videoACF.project_date && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <CalendarIcon size={18} />
                  <span className="text-sm font-semibold">วันที่ผลิต</span>
                </div>
                <p className="text-base text-muted">{videoACF.project_date}</p>
              </div>
            )}
            {videoACF.video_equipment && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <Video size={18} />
                  <span className="text-sm font-semibold">อุปกรณ์ถ่ายทำ</span>
                </div>
                <p className="text-base text-muted">{videoACF.video_equipment}</p>
              </div>
            )}
          </div>

          {videoACF.video_url && (
            <div className="flex flex-col items-start gap-3 w-full">
              <div className="flex items-center gap-2 text-accent">
                <Play size={18} />
                <span className="text-sm font-semibold">ดูวีดีโอ</span>
              </div>
              <div
                className="bg-surface border-2 border-edge rounded-lg p-4 w-full cursor-pointer hover:border-accent hover:bg-surface-hover hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(videoACF.video_url, "_blank");
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-accent rounded-full p-2 text-base">
                    <Play size={16} fill="white" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-base font-semibold">เปิดดูวีดีโอ</span>
                    <span className="text-sm text-dim">คลิกเพื่อดูใน YouTube</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {videoACF.project_description && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">รายละเอียดโปรเจค</span>
              <p className="text-base text-muted leading-[1.8]">{videoACF.project_description}</p>
            </div>
          )}
        </div>
      );
    }

    // Add other category-specific renders here
    if (portfolio.category === "website") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const webACF = acfData as any;
      return (
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {webACF.client_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ลูกค้า</span>
                </div>
                <p className="text-base text-muted">{webACF.client_name}</p>
              </div>
            )}
            {webACF.project_date && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <CalendarIcon size={18} />
                  <span className="text-sm font-semibold">วันที่เสร็จสิ้น</span>
                </div>
                <p className="text-base text-muted">{webACF.project_date}</p>
              </div>
            )}
            {webACF.website_type && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ประเภทเว็บไซต์</span>
                </div>
                <span className="bg-accent-dim text-accent px-3 py-1 rounded-full">
                  {webACF.website_type === "web_app" ? "Web Application"
                    : webACF.website_type === "website" ? "Website"
                    : webACF.website_type === "ecommerce" ? "E-commerce"
                    : webACF.website_type === "cms" ? "CMS"
                    : webACF.website_type}
                </span>
              </div>
            )}
            {webACF.project_role && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">บทบาทในโปรเจค</span>
                </div>
                <p className="text-base text-muted">
                  {webACF.project_role === "full_development" ? "Full Development"
                    : webACF.project_role === "frontend" ? "Frontend Development"
                    : webACF.project_role === "backend" ? "Backend Development"
                    : webACF.project_role}
                </p>
              </div>
            )}
          </div>

          {webACF.website_url && (
            <div className="flex flex-col items-start gap-3 w-full">
              <span className="text-sm font-semibold text-accent">เว็บไซต์</span>
              <a
                href={webACF.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface border-2 border-edge rounded-lg p-4 w-full cursor-pointer hover:border-accent hover:bg-surface-hover hover:-translate-y-0.5 transition-all duration-200 block"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-accent rounded-full p-2 text-base">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-base font-semibold text-content">เยี่ยมชมเว็บไซต์</span>
                    <span className="text-sm text-muted overflow-hidden text-ellipsis whitespace-nowrap max-w-full">{webACF.website_url}</span>
                  </div>
                </div>
              </a>
            </div>
          )}

          {webACF.technologies_used && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">เทคโนโลยีที่ใช้</span>
              <div className="flex items-center gap-2 flex-wrap">
                {webACF.technologies_used.split(",").map((tech: string, index: number) => (
                  <span key={index} className="bg-accent-dim text-accent px-3 py-1 rounded-full">{tech.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {webACF.project_description && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">รายละเอียดโปรเจค</span>
              <p className="text-base text-muted leading-[1.8] whitespace-pre-wrap">{webACF.project_description}</p>
            </div>
          )}

          {webACF.development_notes && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">ฟีเจอร์เด่น</span>
              <p className="text-base text-muted leading-[1.8] whitespace-pre-wrap">{webACF.development_notes}</p>
            </div>
          )}
        </div>
      );
    }

    // Additional category support for future expansion
    if (portfolio.category === "graphic-design") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const designACF = acfData as any;
      return (
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {designACF.client_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ลูกค้า</span>
                </div>
                <p className="text-base text-muted">{designACF.client_name}</p>
              </div>
            )}
            {designACF.project_date && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <CalendarIcon size={18} />
                  <span className="text-sm font-semibold">วันที่โครงการ</span>
                </div>
                <p className="text-base text-muted">{designACF.project_date}</p>
              </div>
            )}
            {designACF.design_type && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ประเภทงานออกแบบ</span>
                </div>
                <span className="bg-accent-dim text-accent px-3 py-1 rounded-full">
                  {designACF.design_type === "social_media" ? "Social Media"
                    : designACF.design_type === "logo" ? "Logo"
                    : designACF.design_type === "branding" ? "Branding"
                    : designACF.design_type === "poster" ? "Poster"
                    : designACF.design_type === "brochure" ? "Brochure"
                    : designACF.design_type}
                </span>
              </div>
            )}
            {designACF.software_used && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ซอฟต์แวร์ที่ใช้</span>
                </div>
                <p className="text-base text-muted">{designACF.software_used}</p>
              </div>
            )}
            {designACF.print_specifications && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ขนาดงานพิมพ์</span>
                </div>
                <p className="text-base text-muted">{designACF.print_specifications}</p>
              </div>
            )}
            {designACF.color_palette && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">Color Palette</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {designACF.color_palette.split(",").map((color: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md border border-edge" style={{ backgroundColor: color.trim() }} />
                      <span className="text-sm font-mono text-dim">{color.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(designACF.design_concept || designACF.project_description) && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">รายละเอียดโปรเจค</span>
              <p className="text-base text-muted leading-[1.8] whitespace-pre-wrap">
                {designACF.project_description || designACF.design_concept}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (portfolio.category === "print") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const printACF = acfData as any;
      return (
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {printACF.client_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ลูกค้า</span>
                </div>
                <p className="text-base text-muted">{printACF.client_name}</p>
              </div>
            )}
            {printACF.project_date && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <CalendarIcon size={18} />
                  <span className="text-sm font-semibold">วันที่โครงการ</span>
                </div>
                <p className="text-base text-muted">{printACF.project_date}</p>
              </div>
            )}
            {printACF.print_type && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ประเภทงานพิมพ์</span>
                </div>
                <p className="text-base text-muted">{printACF.print_type}</p>
              </div>
            )}
            {printACF.print_specifications && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <User size={18} />
                  <span className="text-sm font-semibold">ข้อมูลจำเพาะ</span>
                </div>
                <p className="text-base text-muted">{printACF.print_specifications}</p>
              </div>
            )}
          </div>
          {(printACF.printing_process || printACF.project_description) && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">
                {printACF.printing_process ? "กระบวนการพิมพ์" : "รายละเอียดโปรเจค"}
              </span>
              <p className="text-base text-muted leading-[1.8] whitespace-pre-wrap">
                {printACF.printing_process || printACF.project_description}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (portfolio.category === "exhibition") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exhibitionACF = acfData as any;
      return (
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {exhibitionACF.client_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">ลูกค้า</span></div>
                <p className="text-base text-muted">{exhibitionACF.client_name}</p>
              </div>
            )}
            {exhibitionACF.venue_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><MapPin size={18} /><span className="text-sm font-semibold">สถานที่</span></div>
                <p className="text-base text-muted">{exhibitionACF.venue_name}</p>
              </div>
            )}
            {exhibitionACF.exhibition_dates && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><CalendarIcon size={18} /><span className="text-sm font-semibold">วันที่จัดแสดง</span></div>
                <p className="text-base text-muted">{exhibitionACF.exhibition_dates}</p>
              </div>
            )}
            {exhibitionACF.project_date && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><CalendarIcon size={18} /><span className="text-sm font-semibold">วันที่โครงการ</span></div>
                <p className="text-base text-muted">{exhibitionACF.project_date}</p>
              </div>
            )}
            {exhibitionACF.exhibition_type && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">ประเภทนิทรรศการ</span></div>
                <p className="text-base text-muted">{exhibitionACF.exhibition_type}</p>
              </div>
            )}
            {exhibitionACF.number_of_artworks && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">จำนวนชิ้นงาน</span></div>
                <p className="text-base text-muted">{exhibitionACF.number_of_artworks}</p>
              </div>
            )}
            {exhibitionACF.exhibition_medium && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">สื่อที่ใช้</span></div>
                <p className="text-base text-muted">{exhibitionACF.exhibition_medium}</p>
              </div>
            )}
          </div>
          {exhibitionACF.project_description && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">รายละเอียดโปรเจค</span>
              <p className="text-base text-muted leading-[1.8] whitespace-pre-wrap">{exhibitionACF.project_description}</p>
            </div>
          )}
        </div>
      );
    }

    if (portfolio.category === "campaign") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const campaignACF = acfData as any;
      return (
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {campaignACF.campaign_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">ชื่อแคมเปญ</span></div>
                <p className="text-base text-muted">{campaignACF.campaign_name}</p>
              </div>
            )}
            {campaignACF.client_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">ลูกค้า</span></div>
                <p className="text-base text-muted">{campaignACF.client_name}</p>
              </div>
            )}
            {campaignACF.campaign_duration && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><Clock size={18} /><span className="text-sm font-semibold">ระยะเวลาแคมเปญ</span></div>
                <p className="text-base text-muted">{campaignACF.campaign_duration}</p>
              </div>
            )}
            {campaignACF.target_audience && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">กลุ่มเป้าหมาย</span></div>
                <p className="text-base text-muted">{campaignACF.target_audience}</p>
              </div>
            )}
          </div>
          {(campaignACF.campaign_objectives || campaignACF.project_description) && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">
                {campaignACF.campaign_objectives ? "วัตถุประสงค์แคมเปญ" : "รายละเอียดโปรเจค"}
              </span>
              <p className="text-base text-muted leading-[1.8] whitespace-pre-wrap">
                {campaignACF.campaign_objectives || campaignACF.project_description}
              </p>
            </div>
          )}
          {campaignACF.campaign_results && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">ผลลัพธ์แคมเปญ</span>
              <p className="text-base text-muted leading-[1.8] whitespace-pre-wrap">{campaignACF.campaign_results}</p>
            </div>
          )}
        </div>
      );
    }

    if (portfolio.category === "producer") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const producerACF = acfData as any;
      return (
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {producerACF.client_name && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">ลูกค้า</span></div>
                <p className="text-base text-muted">{producerACF.client_name}</p>
              </div>
            )}
            {producerACF.production_type && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><Film size={18} /><span className="text-sm font-semibold">ประเภทผลงาน</span></div>
                <p className="text-base text-muted">{producerACF.production_type}</p>
              </div>
            )}
            {producerACF.project_date && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><CalendarIcon size={18} /><span className="text-sm font-semibold">วันที่ผลิต</span></div>
                <p className="text-base text-muted">{producerACF.project_date}</p>
              </div>
            )}
            {producerACF.production_role && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">บทบาท</span></div>
                <p className="text-base text-muted">{producerACF.production_role}</p>
              </div>
            )}
            {producerACF.production_budget && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">งบประมาณ</span></div>
                <p className="text-base text-muted">{producerACF.production_budget}</p>
              </div>
            )}
            {producerACF.production_timeline && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><Clock size={18} /><span className="text-sm font-semibold">ระยะเวลา</span></div>
                <p className="text-base text-muted">{producerACF.production_timeline}</p>
              </div>
            )}
            {producerACF.team_size && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><User size={18} /><span className="text-sm font-semibold">ขนาดทีม</span></div>
                <p className="text-base text-muted">{producerACF.team_size} คน</p>
              </div>
            )}
            {producerACF.distribution_platforms && (
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-accent"><Play size={18} /><span className="text-sm font-semibold">ช่องทางเผยแพร่</span></div>
                <p className="text-base text-muted">{producerACF.distribution_platforms}</p>
              </div>
            )}
          </div>
          {producerACF.project_description && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-sm font-semibold text-accent">รายละเอียดโปรเจค</span>
              <p className="text-base text-muted leading-[1.8] whitespace-pre-wrap">{producerACF.project_description}</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  if (!acf || Object.keys(acf).length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-content mb-6">ข้อมูลโปรเจค</h2>
      {renderACFFields()}
    </div>
  );
}

interface PortfolioGalleryProps {
  portfolio: PortfolioItem;
  loading?: boolean;
}

export function PortfolioGallery({
  portfolio,
  loading,
}: PortfolioGalleryProps) {
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get media items (featured image + images from content + ACF gallery)
  const mediaImages =
    portfolio.media?.filter((item) => item.type === "image") || [];

  // Combine featured image (if exists) with media images
  const images = [
    ...(portfolio.featured_image ? [portfolio.featured_image] : []),
    ...mediaImages,
  ];

  // Lightbox helper functions
  const openLightbox = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
      }
    };

    if (lightboxOpen) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [lightboxOpen, images.length, nextImage, prevImage]);

  if (loading) {
    return (
      <div>
        <div className="animate-pulse bg-surface rounded h-6 w-[200px] mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-surface rounded-lg h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  // Special layouts for different categories
  const isPhotography = portfolio.category === "photography";
  const isVideography = portfolio.category === "videography";
  const isVideoEditing = portfolio.category === "video-editing";
  const isWebsite = portfolio.category === "website";
  const isGraphicDesign = portfolio.category === "graphic-design";
  const isPrint = portfolio.category === "print";
  const isExhibition = portfolio.category === "exhibition";
  const isCampaign = portfolio.category === "campaign";
  const isProducer = portfolio.category === "producer";

  return (
    <div>
      <h2 className="text-xl font-semibold text-content mb-6">
        {isPhotography
          ? `ภาพถ่าย (${images.length} ภาพ)`
          : isVideography
            ? `ภาพจากวีดีโอ (${images.length} ภาพ)`
            : isVideoEditing
              ? `ภาพจากการตัดต่อ (${images.length} ภาพ)`
              : isWebsite
                ? `ภาพหน้าจอเว็บไซต์ (${images.length} ภาพ)`
                : isGraphicDesign
                  ? `ผลงานออกแบบ (${images.length} ภาพ)`
                  : isPrint
                    ? `ผลงานพิมพ์ (${images.length} ภาพ)`
                    : isExhibition
                      ? `ภาพจากนิทรรศการ (${images.length} ภาพ)`
                      : isCampaign
                        ? `ภาพจากแคมเปญ (${images.length} ภาพ)`
                        : isProducer
                          ? `ภาพจากการผลิต (${images.length} ภาพ)`
                          : `แกลเลอรี่ (${images.length} ภาพ)`}
      </h2>

      {isPhotography ? (
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col w-full gap-3">
            <div className="w-full relative overflow-hidden rounded-xl">
              <img
                src={images[0].url}
                alt={images[0].alt || "Featured Photography"}
                className="object-contain w-full max-h-[600px] cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                onClick={() => openLightbox(0)}
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
              />
            </div>
            {images[0].caption && (
              <p
                className="text-sm text-dim italic text-center px-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(images[0].caption) }}
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
              {images.slice(1).map((image, index) => (
                <div key={image.id || index + 1} className="flex flex-col gap-3 w-full">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={image.url}
                      alt={image.alt || `Photography ${index + 2}`}
                      className="object-contain w-full max-h-[400px] cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={() => openLightbox(index + 1)}
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
                    />
                  </div>
                  {image.caption && (
                    <p
                      className="text-sm text-dim italic text-center"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(image.caption) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : isVideography ? (
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {images.map((image, index) => (
              <div key={image.id || index} className="aspect-video">
                <img
                  src={image.url}
                  alt={image.alt || `Video still ${index + 1}`}
                  className="object-cover rounded-lg cursor-pointer w-full h-full hover:scale-[1.02] hover:brightness-110 transition-all duration-300"
                  onClick={() => openLightbox(index)}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : isWebsite ? (
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {images.map((image, index) => (
              <div key={image.id || index} className="aspect-[16/10]">
                <img
                  src={image.url}
                  alt={image.alt || `Website screenshot ${index + 1}`}
                  className="object-cover rounded-md border border-edge cursor-pointer w-full h-full hover:scale-[1.02] hover:border-accent transition-all duration-300"
                  onClick={() => openLightbox(index)}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : isVideoEditing ? (
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {images.map((image, index) => (
              <div key={image.id || index} className="aspect-video">
                <img
                  src={image.url}
                  alt={image.alt || `Video editing still ${index + 1}`}
                  className="object-cover rounded-lg cursor-pointer w-full h-full hover:scale-[1.02] hover:brightness-110 transition-all duration-300"
                  onClick={() => openLightbox(index)}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : isGraphicDesign || isPrint ? (
        <div className="flex flex-col gap-6 w-full">
          {images.length > 0 && (
            <div className="w-full max-w-[600px] mx-auto">
              <img
                src={images[0].url}
                alt={images[0].alt || "Featured Design"}
                className="object-contain rounded-lg cursor-pointer max-h-[500px]"
                onClick={() => openLightbox(0)}
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
              />
            </div>
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {images.slice(1).map((image, index) => (
                <div key={image.id || index} className="aspect-square">
                  <img
                    src={image.url}
                    alt={image.alt || `Design ${index + 2}`}
                    className="object-cover rounded-md cursor-pointer w-full h-full hover:scale-105 transition-transform duration-200"
                    onClick={() => openLightbox(index + 1)}
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {images.map((image, index) => (
              <div key={image.id || index} className="flex flex-col gap-3 w-full">
                <div className="relative overflow-hidden rounded-lg bg-surface">
                  <img
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    className="object-contain w-full max-h-[500px] cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
                    onClick={() => openLightbox(index)}
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
                  />
                </div>
                {image.caption && (
                  <div className="bg-surface p-4 rounded-md">
                    <p
                      className="text-sm text-muted leading-[1.6]"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(image.caption) }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black/90 z-[9999] flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-5 right-5 bg-white/20 text-white hover:bg-white/30 p-2 rounded-full"
            aria-label="Close lightbox"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <button
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 text-white hover:bg-white/30 p-2 rounded-full"
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {images.length > 1 && (
            <button
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 text-white hover:bg-white/30 p-2 rounded-full"
              aria-label="Next image"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentImageIndex]?.url}
              alt={images[currentImageIndex]?.alt || "Lightbox image"}
              className="object-contain max-w-[90vw] max-h-[90vh] rounded-lg"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/20 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
