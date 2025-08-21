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
import { Calendar, Scissors, Play } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

interface VideoEditingLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function VideoEditingLayout({
  portfolios,
  loading,
}: VideoEditingLayoutProps) {
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index}>
            <Skeleton height="200px" borderRadius="lg" />
            <VStack gap={2} align="start" mt={4}>
              <Skeleton height="20px" width="80%" />
              <Skeleton height="16px" width="60%" />
              <Skeleton height="32px" width="100px" />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Box>
      {/* Video Editing Grid - Medium Cards */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
        {portfolios.map((portfolio) => (
          <Box
            key={portfolio.id}
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "lg",
            }}
            transition="all 0.3s ease"
          >
            <Box position="relative">
              <AspectRatio ratio={16 / 10}>
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
                bg="blackAlpha.600"
                borderRadius="full"
                p={3}
                _hover={{ bg: "blackAlpha.800" }}
                transition="all 0.2s ease"
              >
                <Play size={20} color="white" fill="white" />
              </Box>

              {/* Video Editing Badge */}
              <Badge
                position="absolute"
                top={3}
                right={3}
                bg="purple.500"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                EDIT
              </Badge>
            </Box>

            <VStack gap={3} p={4} align="start">
              <VStack gap={2} align="start" w="full">
                <Text
                  fontSize="md"
                  fontWeight="600"
                  color="gray.800"
                  className="thai-text"
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
                    <Scissors size={14} />
                    <Text>ตัดต่อวีดีโอ</Text>
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
                  className="thai-text"
                  lineHeight="1.5"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  display="-webkit-box"
                  css={{
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {portfolio.excerpt.rendered}
                </Text>
              )}

              <Link href={`/portfolio/${portfolio.slug}`}>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="purple"
                  className="thai-text"
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
          <Scissors size={48} color="#CBD5E0" />
          <VStack gap={2}>
            <Heading fontSize="xl" color="gray.600" className="thai-text">
              ยังไม่มีผลงานตัดต่อวีดีโอ
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
