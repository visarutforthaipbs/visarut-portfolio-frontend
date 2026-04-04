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
} from "@chakra-ui/react";
import { Calendar, Camera } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";
import { T } from "@/lib/tokens";

interface PhotographyLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function PhotographyLayout({
  portfolios,
  loading,
}: PhotographyLayoutProps) {
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
        {Array.from({ length: 6 }).map((_, index) => (
          <Box key={index}>
            <Skeleton height="300px" borderRadius="lg" />
            <VStack gap={2} align="start" mt={4}>
              <Skeleton height="20px" width="80%" />
              <Skeleton height="16px" width="60%" />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Box>
      {/* Photography Grid - Masonry Style */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
        {portfolios.map((portfolio) => (
          <Link key={portfolio.id} href={`/portfolio/${portfolio.slug}`}>
            <Box
              bg={T.surface}
              borderRadius="lg"
              overflow="hidden"
              border="1px solid"
              borderColor={T.border}
              _hover={{
                transform: "translateY(-4px)",
              }}
              transition="all 0.3s ease"
              cursor="pointer"
            >
              <AspectRatio ratio={4 / 3}>
                <Image
                  src={
                    portfolio.featured_image?.url || "/placeholder-image.jpg"
                  }
                  alt={portfolio.title.rendered}
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </AspectRatio>

              <VStack gap={3} p={4} align="start">
                <VStack gap={2} align="start" w="full">
                  <Text
                    fontSize="lg"
                    fontWeight="600"
                    color={T.text}

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

                  <HStack gap={4} fontSize="sm" color={T.textDim}>
                    <HStack gap={1}>
                      <Camera size={14} />
                      <Text>ภาพถ่าย</Text>
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
                    color={T.textMuted}

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

                <HStack gap={2} flexWrap="wrap">
                  <Badge
                    bg="blue.50"
                    color="blue.600"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                  >
                    Photography
                  </Badge>
                </HStack>
              </VStack>
            </Box>
          </Link>
        ))}
      </SimpleGrid>

      {portfolios.length === 0 && (
        <VStack gap={4} py={12} textAlign="center">
          <Camera size={48} color="#CBD5E0" />
          <VStack gap={2}>
            <Heading fontSize="xl" color={T.textMuted} className="thai-text">
              ยังไม่มีผลงานภาพถ่าย
            </Heading>
            <Text color={T.textDim} className="thai-text">
              ผลงานใหม่จะปรากฏที่นี่เร็วๆ นี้
            </Text>
          </VStack>
        </VStack>
      )}
    </Box>
  );
}
