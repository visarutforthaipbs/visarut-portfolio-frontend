import { GalleryImage } from "@/types/acf";
import { sanitizeHtml } from "@/lib/sanitize";

interface GalleryGridProps {
  images: GalleryImage[];
  columns?: { base: number; md: number; lg: number };
  onImageClick: (index: number) => void;
  showCaptions?: boolean;
}

const BASE_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};
const MD_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function GalleryGrid({
  images,
  columns = { base: 1, md: 2, lg: 3 },
  onImageClick,
  showCaptions = true,
}: GalleryGridProps) {
  const baseCol = BASE_COLS[columns.base] || "grid-cols-1";
  const mdCol = MD_COLS[columns.md] || "md:grid-cols-2";
  const lgCol = LG_COLS[columns.lg] || "lg:grid-cols-3";
  const colClasses = `grid ${baseCol} ${mdCol} ${lgCol} gap-6`;

  return (
    <div className={colClasses}>
      {images.map((image, index) => (
        <div key={index} className="relative">
          <div
            role="button"
            tabIndex={0}
            aria-label={image.alt || `รูปภาพที่ ${index + 1}`}
            className="rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => onImageClick(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onImageClick(index);
              }
            }}
          >
            <img
              src={image.url || "/placeholder-image.svg"}
              alt={image.alt || ""}
              className="w-full h-auto object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.svg";
              }}
            />
          </div>

          {showCaptions && image.caption && (
            <div className="mt-3 p-4 bg-surface rounded-md">
              <p
                className="text-sm text-muted"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(image.caption) }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
