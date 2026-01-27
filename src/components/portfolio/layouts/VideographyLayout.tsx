import {
  Box,
  SimpleGrid,
  AspectRatio,
  Image,
  VStack,
  Text,
  Heading,
  HStack,
  Badge,
  Skeleton,
  Button,
} from "@chakra-ui/react";
import { Calendar, Video, Play } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

interface VideographyLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function VideographyLayout({
  portfolios,
  loading,
}: VideographyLayoutProps) {
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} w="full">
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index}>
            <Skeleton height="250px" borderRadius="lg" />
            <VStack gap={2} align="start" mt={4}>
              <Skeleton height="24px" width="80%" />
              <Skeleton height="16px" width="60%" />
              <Skeleton height="40px" width="120px" />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Box>
      {/* Video Grid - Larger Cards */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} w="full">
        {portfolios.map((portfolio) => (
          <Box
            key={portfolio.id}
            bg="white"
            borderRadius="xl"
            overflow="hidden"
            shadow="lg"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "2xl",
            }}
            transition="all 0.3s ease"
          >
            <Box position="relative">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={
                    portfolio.featured_image?.url || "/placeholder-video.jpg"
                  }
                  alt={portfolio.title.rendered}
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </AspectRatio>

              {/* Play Button Overlay */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="blackAlpha.700"
                borderRadius="full"
                p={4}
                _hover={{ bg: "blackAlpha.800" }}
                transition="all 0.2s ease"
              >
                <Play size={24} color="white" fill="white" />
              </Box>

              {/* Video Badge */}
              <Badge
                position="absolute"
                top={3}
                right={3}
                bg="red.500"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                VIDEO
              </Badge>
            </Box>

            <VStack gap={4} p={6} align="start">
              <VStack gap={2} align="start" w="full">
                <Text
                  fontSize="xl"
                  fontWeight="600"
                  color="gray.800"

                  lineHeight="1.4"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  display="-webkit-box"
                  css={{
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {portfolio.title.rendered}
                </Text>

                <HStack gap={4} fontSize="sm" color="gray.500">
                  <HStack gap={1}>
                    <Video size={14} />
                    <Text>วีดีโอกราฟี</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Calendar size={14} />
                    <Text>{new Date(portfolio.date).getFullYear()}</Text>
                  </HStack>
                </HStack>
              </VStack>

              {portfolio.excerpt && (
                <Text
                  fontSize="sm"
                  color="gray.600"

                  lineHeight="1.6"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  display="-webkit-box"
                  css={{
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {portfolio.excerpt.rendered}
                </Text>
              )}

              <Link href={`/portfolio/${portfolio.slug}`}>
                <Button
                  size="sm"
                  bg="accent.500"
                  color="white"
                  _hover={{ bg: "accent.600" }}

                  px={4}
                  py={2}
                >
                  ดูผลงาน
                </Button>
              </Link>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {portfolios.length === 0 && (
        <VStack gap={4} py={12} textAlign="center">
          <Video size={48} color="#CBD5E0" />
          <VStack gap={2}>
            <Heading fontSize="xl" color="gray.600" className="thai-text">
              ยังไม่มีผลงานวีดีโอกราฟี
            </Heading>
            <Text color="gray.500" className="thai-text">
              ผลงานใหม่จะปรากฏที่นี่เร็วๆ นี้
            </Text>
          </VStack>
        </VStack>
      )}
    </Box>
  );
}
