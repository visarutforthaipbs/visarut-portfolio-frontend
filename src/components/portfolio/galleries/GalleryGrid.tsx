import { Box, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { GalleryImage } from "@/types/acf";

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
              bg="gray.50"
              _dark={{ bg: "gray.800" }}
              borderRadius="md"
            >
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.300" }}
                dangerouslySetInnerHTML={{ __html: image.caption }}
              />
            </Box>
          )}
        </Box>
      ))}
    </SimpleGrid>
  );
}
