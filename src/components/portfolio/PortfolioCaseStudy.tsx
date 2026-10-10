"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { WordPressContent } from "@/components/WordPressContent";
import type { DetailImage, DetailMedia, PortfolioDetailView } from "@/lib/portfolioDetailContent";

const isPortrait = (m: DetailMedia) => m.kind === "image" && !!m.width && !!m.height && m.height > m.width * 1.05;

/** Pair consecutive portrait photos side by side; everything else full width. */
function groupMedia(media: DetailMedia[]): DetailMedia[][] {
  const rows: DetailMedia[][] = [];
  for (let i = 0; i < media.length; i++) {
    if (isPortrait(media[i]) && i + 1 < media.length && isPortrait(media[i + 1])) {
      rows.push([media[i], media[i + 1]]);
      i++;
    } else rows.push([media[i]]);
  }
  return rows;
}

function VideoFrame({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-surface">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

function Photo({ img, onOpen, eager }: { img: DetailImage; onOpen: () => void; eager?: boolean }) {
  return (
    <figure className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full overflow-hidden rounded-2xl bg-surface cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-label={`ขยายภาพ${img.alt ? `: ${img.alt}` : ""}`}
      >
        <img
          src={img.url}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="block w-full h-auto transition-opacity duration-200 hover:opacity-95"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.svg";
          }}
        />
      </button>
      {img.caption && <figcaption className="text-sm text-dim leading-relaxed">{img.caption}</figcaption>}
    </figure>
  );
}

function Lightbox({ images, index, onClose, onMove }: { images: DetailImage[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onMove]);

  const img = images[index];
  const btn = "absolute flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors";
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10" role="dialog" aria-modal="true" aria-label="ดูภาพขนาดใหญ่" onClick={onClose}>
      <img src={img.url} alt={img.alt} className="max-h-full max-w-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
      <button type="button" className={`${btn} top-4 right-4`} onClick={onClose} aria-label="ปิด" autoFocus>
        <X size={20} />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" className={`${btn} left-3 md:left-6 top-1/2 -translate-y-1/2`} onClick={(e) => { e.stopPropagation(); onMove(-1); }} aria-label="ภาพก่อนหน้า">
            <ChevronLeft size={22} />
          </button>
          <button type="button" className={`${btn} right-3 md:right-6 top-1/2 -translate-y-1/2`} onClick={(e) => { e.stopPropagation(); onMove(1); }} aria-label="ภาพถัดไป">
            <ChevronRight size={22} />
          </button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70 tabular-nums">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}

interface Props {
  title: string;
  categoryLabel: string;
  detail: PortfolioDetailView;
  breadcrumb: React.ReactNode;
}

export function PortfolioCaseStudy({ title, categoryLabel, detail, breadcrumb }: Props) {
  const { lead, textHtml, media, heroEmbed, heroImage, link, client, date } = detail;
  const images = [...(heroImage ? [heroImage] : []), ...media.filter((m): m is DetailImage => m.kind === "image")];
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);
  const openImage = (img: DetailImage) => setOpen(Math.max(0, images.indexOf(img)));

  const hasText = Boolean(textHtml.trim());
  const hasMedia = media.length > 0;
  const textIsShort = textHtml.replace(/<[^>]+>/g, "").length < 900;

  const facts = [
    client && { label: "ลูกค้า / องค์กร", value: client },
    date && { label: "วันที่", value: date },
    { label: "ประเภทงาน", value: categoryLabel },
  ].filter(Boolean) as { label: string; value: string }[];

  const text = hasText && (
    <WordPressContent content={textHtml} className="case-study-text" />
  );

  return (
    <article className="bg-canvas w-full">
      {/* ── Header: what is this? ── */}
      <header className="max-w-6xl mx-auto px-5 md:px-6 pt-10 md:pt-16 pb-8 md:pb-10">
        <div className="max-w-3xl flex flex-col gap-4">
          {breadcrumb}
          <h1 className="text-[1.75rem] md:text-[2.5rem] font-bold text-content leading-[1.2] tracking-tight">{title}</h1>
          {lead && <p className="text-lg md:text-xl text-muted leading-relaxed">{lead}</p>}
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-end gap-5 md:gap-10 border-t border-edge pt-5">
          <dl className="grid grid-cols-2 md:flex md:flex-wrap gap-x-10 gap-y-4 flex-1">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1 min-w-0">
                <dt className="text-sm text-dim">{f.label}</dt>
                <dd className="text-base font-medium text-content break-words">{f.value}</dd>
              </div>
            ))}
          </dl>
          {link && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 rounded-full bg-content text-canvas text-sm font-semibold hover:opacity-85 active:scale-[0.98] transition-[opacity,transform] self-start md:self-auto shrink-0"
            >
              <span>{link.label}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> ({link.host}, เปิดในแท็บใหม่)</span>
            </a>
          )}
        </div>
      </header>

      {/* ── Hero media ── */}
      {(heroEmbed || heroImage) && (
        <div className="max-w-6xl mx-auto px-5 md:px-6 pb-10 md:pb-14">
          {heroEmbed ? <VideoFrame src={heroEmbed} title={title} /> : heroImage && <Photo img={heroImage} onOpen={() => openImage(heroImage)} eager />}
        </div>
      )}

      {/* ── Story + work ── */}
      {(hasText || hasMedia) && (
        <div className="max-w-6xl mx-auto px-5 md:px-6 pb-16 md:pb-24">
          {hasText && hasMedia ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className={`lg:col-span-5 ${textIsShort ? "lg:sticky lg:top-24 lg:self-start" : ""}`}>{text}</div>
              <div className="lg:col-span-7 flex flex-col gap-4 md:gap-5">
                {groupMedia(media).map((row, r) => (
                  <div key={r} className={row.length === 2 ? "grid grid-cols-2 gap-4 md:gap-5" : ""}>
                    {row.map((m, i) => (m.kind === "embed" ? <VideoFrame key={i} src={m.src} title={m.title} /> : <Photo key={i} img={m} onOpen={() => openImage(m)} />))}
                  </div>
                ))}
              </div>
            </div>
          ) : hasText ? (
            <div className="max-w-2xl">{text}</div>
          ) : (
            <div className="columns-1 sm:columns-2 gap-4 md:gap-5 [&>*]:mb-4 md:[&>*]:mb-5 [&>*]:break-inside-avoid">
              {media.map((m, i) => (m.kind === "embed" ? <VideoFrame key={i} src={m.src} title={m.title} /> : <Photo key={i} img={m} onOpen={() => openImage(m)} />))}
            </div>
          )}
        </div>
      )}

      {open !== null && images[open] && <Lightbox images={images} index={open} onClose={close} onMove={move} />}
    </article>
  );
}
