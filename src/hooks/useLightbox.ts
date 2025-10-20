import { useState, useCallback, useEffect } from "react";

interface UseLightboxReturn {
  lightboxOpen: boolean;
  currentImageIndex: number;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  prevImage: () => void;
}

/**
 * Custom hook for managing lightbox state and keyboard navigation
 * @param imagesLength - Total number of images in the gallery
 */
export function useLightbox(imagesLength: number): UseLightboxReturn {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesLength);
  }, [imagesLength]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
  }, [imagesLength]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
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

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  return {
    lightboxOpen,
    currentImageIndex,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
  };
}
