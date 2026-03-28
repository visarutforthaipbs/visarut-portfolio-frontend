"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem, ImageMedia } from "@/types/portfolio";

interface PortfolioPreviewProps {
  maxItems?: number;
}

export function PortfolioPreview({ maxItems = 6 }: PortfolioPreviewProps) {
  const { portfolios, loading, error } = usePortfolios({
    per_page: maxItems,
  });

  if (error) {
    return (
      <Box py={8} textAlign="center" role="alert">
        <HStack gap={2} justify="center" color={{ base: "gray.400", _dark: "gray.500" }}>
          <AlertCircle size={16} aria-hidden="true" />
          <Text fontSize="sm">เกิดข้อผิดพลาดในการโหลดผลงาน</Text>
        </HStack>
      </Box>
    );
  }

  return (
    <VStack gap={{ base: 8, md: 10 }} w="full" aria-label="ผลงานล่าสุด" role="region">
      <Heading
        as="h2"
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        fontWeight="medium"
        color={{ base: "gray.400", _dark: "gray.500" }}
        textTransform="uppercase"
        letterSpacing="wider"
        textAlign="center"
      >
        ผลงานล่าสุด
      </Heading>

      {loading ? (
        <Box
          css={{
            columnCount: 1,
            columnGap: "1rem",
            "@media (min-width: 30em)": { columnCount: 2 },
            "@media (min-width: 62em)": { columnCount: 3 },
          }}
          w="full"
        >
          {Array.from({ length: maxItems }).map((_, index) => (
            <Box key={index} css={{ breakInside: "avoid" }} mb={4}>
              <Skeleton height={{ base: "200px", md: "220px" }} borderRadius="md" />
              <VStack gap={2} align="start" mt={3}>
                <Skeleton height="14px" width="40%" />
                <Skeleton height="16px" width="70%" />
              </VStack>
            </Box>
          ))}
        </Box>
      ) : portfolios.length > 0 ? (
        <>
          <Box
            css={{
              columnCount: 1,
              columnGap: "1rem",
              "@media (min-width: 30em)": { columnCount: 2 },
              "@media (min-width: 62em)": { columnCount: 3 },
            }}
            w="full"
          >
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </Box>

          <Link href="/portfolio" aria-label="ดูผลงานทั้งหมด">
            <HStack
              gap={2}
              color={{ base: "gray.900", _dark: "white" }}
              fontWeight="medium"
              fontSize="sm"
              _hover={{ gap: 3 }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Text>ดูผลงานทั้งหมด</Text>
              <ArrowRight size={16} aria-hidden="true" />
            </HStack>
          </Link>
        </>
      ) : (
        <Box textAlign="center" py={12}>
          <Text fontSize="sm" color={{ base: "gray.400", _dark: "gray.500" }}>
            ยังไม่มีผลงานที่จะแสดง
          </Text>
        </Box>
      )}
    </VStack>
  );
}

interface PortfolioCardProps {
  portfolio: PortfolioItem;
}

function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const categoryLabel =
    PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category;

  const getFeaturedImageUrl = (
    image: string | ImageMedia | undefined
  ): string => {
    if (!image) return "/placeholder-image.svg";
    if (typeof image === "string") return image;
    return image.url || "/placeholder-image.svg";
  };

  const getTextContent = (content: { rendered: string } | string): string => {
    if (typeof content === "string") return content;
    return content.rendered || "";
  };

  return (
    <Link href={`/portfolio/${portfolio.slug}`} aria-label={getTextContent(portfolio.title)}>
      <Box
        as="article"
        cursor="pointer"
        role="group"
        css={{ breakInside: "avoid" }}
        mb={4}
      >
        <Box overflow="hidden" borderRadius="md" bg={{ base: "gray.100", _dark: "gray.800" }}>
          <Image
            src={getFeaturedImageUrl(portfolio.featured_image)}
            alt={getTextContent(portfolio.title)}
            w="full"
            h="auto"
            display="block"
            objectFit="cover"
            transition="opacity 0.2s"
            _groupHover={{ opacity: 0.85 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.svg";
            }}
          />
        </Box>

        <VStack align="start" gap={1} mt={3}>
          <Text
            fontSize="xs"
            color={{ base: "gray.400", _dark: "gray.500" }}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {categoryLabel}
          </Text>
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="medium"
            color={{ base: "gray.800", _dark: "white" }}
            lineHeight="1.2"
            lineClamp={2}
          >
            {getTextContent(portfolio.title)}
          </Heading>
        </VStack>
      </Box>
    </Link>
  );
}
