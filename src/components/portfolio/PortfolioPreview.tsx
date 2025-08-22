"use client";

import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  AspectRatio,
  Skeleton,
} from "@chakra-ui/react";
import { ArrowRight, Calendar, Eye, AlertCircle } from "lucide-react";
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
      <Box
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        borderRadius="md"
        p={4}
      >
        <HStack gap={2} color="red.600">
          <AlertCircle size={20} />
          <VStack align="start" gap={1}>
            <Text fontWeight="medium">เกิดข้อผิดพลาดในการโหลดผลงาน</Text>
            <Text fontSize="sm" color="red.500">
              {error}
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  }

  return (
    <VStack gap={{ base: 6, md: 8 }} w="full">
      <VStack gap={{ base: 3, md: 4 }} textAlign="center">
        <Heading
          fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
          color={{ base: "gray.800", _dark: "white" }}
          className="thai-text"
        >
          ผลงานล่าสุด
        </Heading>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color={{ base: "gray.600", _dark: "gray.300" }}
          maxW={{ base: "90%", md: "500px" }}
          className="thai-text"
          px={{ base: 2, md: 0 }}
        >
          รวมผลงานที่ผ่านมาจากหลากหลายหมวดหมู่
        </Text>
      </VStack>

      {loading ? (
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3 }}
          gap={{ base: 4, md: 6 }}
          w="full"
        >
          {Array.from({ length: maxItems }).map((_, index) => (
            <Box key={index}>
              <Skeleton
                height={{ base: "200px", md: "250px" }}
                borderRadius="lg"
              />
              <VStack gap={2} align="start" mt={4}>
                <Skeleton height="20px" width="60%" />
                <Skeleton height="16px" width="40%" />
                <Skeleton height="14px" width="80%" />
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      ) : portfolios.length > 0 ? (
        <>
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            gap={{ base: 4, md: 6 }}
            w="full"
          >
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </SimpleGrid>

          <HStack
            gap={{ base: 3, md: 4 }}
            mt={{ base: 6, md: 8 }}
            justify="center"
            flexWrap="wrap"
          >
            <Link href="/portfolio">
              <Button
                size={{ base: "md", md: "lg" }}
                bg="accent.500"
                color="white"
                _hover={{ bg: "accent.600" }}
                className="thai-text"
                px={{ base: 4, md: 6 }}
                py={{ base: 2, md: 3 }}
              >
                <HStack gap={2}>
                  <Text>ดูผลงานทั้งหมด</Text>
                  <ArrowRight size={20} />
                </HStack>
              </Button>
            </Link>
          </HStack>
        </>
      ) : (
        <Box
          textAlign="center"
          py={12}
          bg={{ base: "gray.50", _dark: "gray.700" }}
          borderRadius="lg"
        >
          <VStack gap={3}>
            <Eye size={48} color="#9CA3AF" />
            <Text
              fontSize="lg"
              color={{ base: "gray.600", _dark: "gray.300" }}
              className="thai-text"
            >
              ยังไม่มีผลงานที่จะแสดง
            </Text>
            <Text
              fontSize="sm"
              color={{ base: "gray.500", _dark: "gray.400" }}
              className="thai-text"
            >
              กลับมาตรวจสอบใหม่ในภายหลัง
            </Text>
          </VStack>
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

  // Handle featured image
  const getFeaturedImageUrl = (
    image: string | ImageMedia | undefined
  ): string => {
    if (!image) return "/placeholder-image.svg";
    if (typeof image === "string") return image;
    return image.url || "/placeholder-image.svg";
  };

  // Handle text content
  const getTextContent = (content: { rendered: string } | string): string => {
    if (typeof content === "string") return content;
    return content.rendered || "";
  };

  return (
    <Link href={`/portfolio/${portfolio.slug}`}>
      <Box
        bg={{ base: "white", _dark: "gray.700" }}
        borderRadius="lg"
        overflow="hidden"
        shadow="md"
        _hover={{
          transform: "translateY(-4px)",
          shadow: "lg",
        }}
        transition="all 0.3s ease"
        cursor="pointer"
        border="1px solid"
        borderColor={{ base: "gray.200", _dark: "gray.600" }}
      >
        <AspectRatio ratio={16 / 9}>
          <Image
            src={getFeaturedImageUrl(portfolio.featured_image)}
            alt={getTextContent(portfolio.title)}
            objectFit="cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.svg";
            }}
          />
        </AspectRatio>

        <Box p={{ base: 4, md: 6 }}>
          <VStack align="start" gap={{ base: 2, md: 3 }}>
            <HStack justify="space-between" w="full">
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="accent.500"
                fontWeight="medium"
                className="thai-text"
                textTransform="uppercase"
              >
                {categoryLabel}
              </Text>
              <HStack gap={1} color={{ base: "gray.500", _dark: "gray.400" }}>
                <Calendar size={14} />
                <Text fontSize="xs">
                  {new Date(portfolio.date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </HStack>
            </HStack>

            <Heading
              fontSize={{ base: "md", md: "lg" }}
              color={{ base: "gray.800", _dark: "white" }}
              className="thai-text"
              lineHeight="1.4"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
            >
              {getTextContent(portfolio.title)}
            </Heading>

            {portfolio.excerpt && (
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={{ base: "gray.600", _dark: "gray.300" }}
                className="thai-text"
                lineHeight="1.5"
                display="-webkit-box"
                css={{
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {getTextContent(portfolio.excerpt)}
              </Text>
            )}
          </VStack>
        </Box>
      </Box>
    </Link>
  );
}
