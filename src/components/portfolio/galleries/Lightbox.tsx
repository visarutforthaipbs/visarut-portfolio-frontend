import { GalleryImage } from "@/types/acf";

interface LightboxProps {
  isOpen: boolean;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/95 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="absolute top-4 right-4 text-2xl text-white cursor-pointer hover:text-gray-400 z-[10000]"
        onClick={onClose}
      >
        ✕
      </div>

      {images.length > 1 && (
        <>
          <div
            className="absolute left-4 text-3xl text-white cursor-pointer hover:text-gray-400 z-[10000]"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            ‹
          </div>

          <div
            className="absolute right-4 text-3xl text-white cursor-pointer hover:text-gray-400 z-[10000]"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            ›
          </div>
        </>
      )}

      <div
        className="max-w-[90vw] max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className="max-w-full max-h-[90vh] object-contain"
        />

        {currentImage.caption && (
          <div className="mt-4 p-4 bg-black/80 text-white rounded-md text-center">
            {currentImage.caption}
          </div>
        )}
      </div>
    </div>
  );
}
