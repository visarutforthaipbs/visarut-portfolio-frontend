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
import { Calendar, FileText } from "lucide-react";
import Link from "next/link";
import {
  PortfolioItem,
  PortfolioCategory,
  PORTFOLIO_CATEGORIES,
} from "@/types/portfolio";

interface DefaultLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
  category: PortfolioCategory;
}

export function DefaultLayout({
  portfolios,
  loading,
  category,
}: DefaultLayoutProps) {
  const categoryName = PORTFOLIO_CATEGORIES[category];

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
        {Array.from({ length: 6 }).map((_, index) => (
          <Box key={index}>
            <Skeleton height="200px" borderRadius="lg" />
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
      {/* Default Grid Layout */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
        {portfolios.map((portfolio) => (
          <Link key={portfolio.id} href={`/portfolio/${portfolio.slug}`}>
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              shadow="md"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "lg",
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
                      <FileText size={14} />
                      <Text>{categoryName}</Text>
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

                <Badge
                  bg="gray.100"
                  color="gray.600"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                  className="thai-text"
                >
                  {categoryName}
                </Badge>
              </VStack>
            </Box>
          </Link>
        ))}
      </SimpleGrid>

      {portfolios.length === 0 && (
        <VStack gap={4} py={12} textAlign="center">
          <FileText size={48} color="#CBD5E0" />
          <VStack gap={2}>
            <Heading fontSize="xl" color="gray.600" className="thai-text">
              ยังไม่มีผลงาน{categoryName}
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
