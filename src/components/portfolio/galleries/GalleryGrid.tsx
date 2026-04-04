import { GalleryImage } from "@/types/acf";
import { sanitizeHtml } from "@/lib/sanitize";

interface GalleryGridProps {
  images: GalleryImage[];
  columns?: { base: number; md: number; lg: number };
  onImageClick: (index: number) => void;
  showCaptions?: boolean;
}

export function GalleryGrid({
  images,
  columns = { base: 1, md: 2, lg: 3 },
  onImageClick,
  showCaptions = true,
}: GalleryGridProps) {
  const colClasses = `grid grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-6`;

  return (
    <div className={colClasses}>
      {images.map((image, index) => (
        <div key={index} className="relative">
          <div
            className="rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            onClick={() => onImageClick(index)}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-auto object-cover"
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
