import { Box, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { GalleryImage } from "@/types/acf";
import { sanitizeHtml } from "@/lib/sanitize";
import { T } from "@/lib/tokens";

interface GalleryGridProps {
  images: GalleryImage[];
  columns?: { base: number; md: number; lg: number };
  onImageClick: (index: number) => void;
  showCaptions?: boolean;
}

/**
 * Reusable gallery grid component with responsive columns
 */
export function GalleryGrid({
  images,
  columns = { base: 1, md: 2, lg: 3 },
  onImageClick,
  showCaptions = true,
}: GalleryGridProps) {
  return (
    <SimpleGrid columns={columns} gap={6}>
      {images.map((image, index) => (
        <Box key={index} position="relative">
          <Box
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.02)" }}
            onClick={() => onImageClick(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              w="100%"
              h="auto"
              objectFit="cover"
            />
          </Box>

          {showCaptions && image.caption && (
            <Box
              mt={3}
              p={4}
              bg={T.surface}
              borderRadius="md"
            >
              <Text
                fontSize="sm"
                color={T.textMuted}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(image.caption) }}
              />
            </Box>
          )}
        </Box>
      ))}
    </SimpleGrid>
  );
}
