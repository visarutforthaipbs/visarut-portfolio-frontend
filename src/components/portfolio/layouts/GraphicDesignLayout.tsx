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
import { Calendar, Palette } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

interface GraphicDesignLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function GraphicDesignLayout({
  portfolios,
  loading,
}: GraphicDesignLayoutProps) {
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={4} w="full">
        {Array.from({ length: 8 }).map((_, index) => (
          <Box key={index}>
            <Skeleton height="250px" borderRadius="lg" />
            <VStack gap={1} align="start" mt={3}>
              <Skeleton height="16px" width="80%" />
              <Skeleton height="14px" width="60%" />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Box>
      {/* Graphic Design Grid - Pinterest Style */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={4} w="full">
        {portfolios.map((portfolio) => (
          <Link key={portfolio.id} href={`/portfolio/${portfolio.slug}`}>
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              shadow="sm"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "md",
              }}
              transition="all 0.3s ease"
              cursor="pointer"
            >
              <AspectRatio ratio={3 / 4}>
                <Image
                  src={
                    portfolio.featured_image?.url || "/placeholder-design.jpg"
                  }
                  alt={portfolio.title.rendered}
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </AspectRatio>

              <VStack gap={2} p={3} align="start">
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.800"
                  className="thai-text"
                  lineHeight="1.3"
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

                <HStack gap={3} fontSize="xs" color="gray.500">
                  <HStack gap={1}>
                    <Palette size={12} />
                    <Text>กราฟิก</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Calendar size={12} />
                    <Text>{new Date(portfolio.date).getFullYear()}</Text>
                  </HStack>
                </HStack>

                <Badge
                  bg="pink.50"
                  color="pink.600"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                >
                  Design
                </Badge>
              </VStack>
            </Box>
          </Link>
        ))}
      </SimpleGrid>

      {portfolios.length === 0 && (
        <VStack gap={4} py={12} textAlign="center">
          <Palette size={48} color="#CBD5E0" />
          <VStack gap={2}>
            <Heading fontSize="xl" color="gray.600" className="thai-text">
              ยังไม่มีผลงานออกแบบกราฟิก
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
