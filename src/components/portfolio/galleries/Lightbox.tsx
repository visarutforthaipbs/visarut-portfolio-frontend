import { Box, Image } from "@chakra-ui/react";
import { GalleryImage } from "@/types/acf";

interface LightboxProps {
  isOpen: boolean;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

/**
 * Lightbox component for viewing images in fullscreen
 */
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
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="rgba(0, 0, 0, 0.95)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClose}
    >
      <Box
        position="absolute"
        top={4}
        right={4}
        fontSize="2xl"
        color="white"
        cursor="pointer"
        _hover={{ color: "gray.400" }}
        onClick={onClose}
        zIndex={10000}
      >
        ✕
      </Box>

      {images.length > 1 && (
        <>
          <Box
            position="absolute"
            left={4}
            fontSize="3xl"
            color="white"
            cursor="pointer"
            _hover={{ color: "gray.400" }}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            zIndex={10000}
          >
            ‹
          </Box>

          <Box
            position="absolute"
            right={4}
            fontSize="3xl"
            color="white"
            cursor="pointer"
            _hover={{ color: "gray.400" }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            zIndex={10000}
          >
            ›
          </Box>
        </>
      )}

      <Box
        maxW="90vw"
        maxH="90vh"
        position="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          maxW="100%"
          maxH="90vh"
          objectFit="contain"
        />

        {currentImage.caption && (
          <Box
            mt={4}
            p={4}
            bg="rgba(0, 0, 0, 0.8)"
            color="white"
            borderRadius="md"
            textAlign="center"
          >
            {currentImage.caption}
          </Box>
        )}
      </Box>
    </Box>
  );
}
