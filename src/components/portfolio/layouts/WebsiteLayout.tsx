import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Heading,
  HStack,
  Badge,
  Skeleton,
  Button,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import { Calendar, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

interface WebsiteLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function WebsiteLayout({ portfolios, loading }: WebsiteLayoutProps) {
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
        {Array.from({ length: 6 }).map((_, index) => (
          <Box key={index}>
            <Skeleton height="200px" borderRadius="lg" />
            <VStack gap={2} align="start" mt={4}>
              <Skeleton height="20px" width="80%" />
              <Skeleton height="16px" width="60%" />
              <Skeleton height="32px" width="120px" />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Box>
      {/* Website Grid - Card Layout */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
        {portfolios.map((portfolio) => (
          <Box
            key={portfolio.id}
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "xl",
              borderColor: "accent.300",
            }}
            transition="all 0.3s ease"
          >
            <Box position="relative">
              <AspectRatio ratio={16 / 10}>
                <Image
                  src={
                    portfolio.featured_image?.url || "/placeholder-website.jpg"
                  }
                  alt={portfolio.title.rendered}
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </AspectRatio>

              {/* Website Badge */}
              <Badge
                position="absolute"
                top={3}
                right={3}
                bg="green.500"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                WEBSITE
              </Badge>
            </Box>

            <VStack gap={4} p={5} align="start">
              <VStack gap={2} align="start" w="full">
                <Text
                  fontSize="lg"
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
                    <Globe size={14} />
                    <Text>เว็บไซต์</Text>
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

                  lineHeight="1.5"
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

              <HStack gap={2} w="full">
                <Link href={`/portfolio/${portfolio.slug}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="green"
                    flex={1}

                    px={4}
                    py={2}
                  >
                    ดูรายละเอียด
                  </Button>
                </Link>

                {/* Add website URL if available in ACF */}
                {portfolio.acf &&
                  typeof portfolio.acf === "object" &&
                  "website_url" in portfolio.acf && (
                    <Link
                      href={portfolio.acf.website_url as string}
                      target="_blank"
                    >
                      <Button
                        size="sm"
                        bg="green.500"
                        color="white"
                        _hover={{ bg: "green.600" }}
                        px={4}
                        py={2}
                      >
                        <HStack gap={1}>
                          <ExternalLink size={14} />
                          <Text>ดูเว็บไซต์</Text>
                        </HStack>
                      </Button>
                    </Link>
                  )}
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {portfolios.length === 0 && (
        <VStack gap={4} py={12} textAlign="center">
          <Globe size={48} color="#CBD5E0" />
          <VStack gap={2}>
            <Heading fontSize="xl" color="gray.600" className="thai-text">
              ยังไม่มีผลงานเว็บไซต์
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
