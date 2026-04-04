"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem, ImageMedia } from "@/types/portfolio";

interface FeaturedSliderProps {
  items: PortfolioItem[];
}

function getFeaturedImageUrl(image: string | ImageMedia | undefined): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.sizes?.large || image.sizes?.full || image.url || "";
}

function getTextContent(content: { rendered: string } | string): string {
  if (typeof content === "string") return content;
  return content.rendered?.replace(/<[^>]*>/g, "") || "";
}

export function FeaturedSlider({ items }: FeaturedSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  if (items.length === 0) return null;

  return (
    <section
      role="region"
      aria-label="ผลงานแนะนำ"
      aria-roledescription="carousel"
      className="w-full bg-base relative overflow-hidden"
    >
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {items.map((item, index) => {
            const imageUrl = getFeaturedImageUrl(item.featured_image);
            const title = getTextContent(item.title);
            const category =
              PORTFOLIO_CATEGORIES[item.category] || item.category;

            return (
              <div
                key={item.id}
                className="flex-[0_0_100%] min-w-0 relative group"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} จาก ${items.length}: ${title}`}
              >
                <Link href={`/portfolio/${item.slug}`} aria-label={title}>
                  <div className="relative h-[40vh] md:h-[65vh] w-full cursor-pointer">
                    {/* Background image */}
                    {imageUrl && (
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[6s] ease-out group-hover:scale-[1.03]"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col items-start gap-2">
                      <span className="text-xs md:text-sm text-white/70 uppercase tracking-wider font-medium">
                        {category}
                      </span>
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] max-w-[700px]">
                        {title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div
          className="absolute bottom-3 md:bottom-5 right-4 md:right-12 flex items-center gap-2"
          aria-label="เลือกสไลด์"
          role="tablist"
        >
          {items.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`สไลด์ ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white ${
                index === selectedIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50"
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
