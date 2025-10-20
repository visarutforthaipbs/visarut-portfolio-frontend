import { Box } from "@chakra-ui/react";
import { GalleryImage } from "@/types/acf";
import { useLightbox } from "@/hooks/useLightbox";
import { Lightbox } from "./Lightbox";
import { GalleryGrid } from "./GalleryGrid";

interface BaseGalleryProps {
  images: GalleryImage[];
  columns?: { base: number; md: number; lg: number };
  showCaptions?: boolean;
}

/**
 * Base gallery component with lightbox functionality
 * Can be extended for category-specific layouts
 */
export function BaseGallery({
  images,
  columns,
  showCaptions = true,
}: BaseGalleryProps) {
  const {
    lightboxOpen,
    currentImageIndex,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
  } = useLightbox(images.length);

  if (images.length === 0) return null;

  return (
    <Box>
      <GalleryGrid
        images={images}
        columns={columns}
        onImageClick={openLightbox}
        showCaptions={showCaptions}
      />

      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </Box>
  );
}
