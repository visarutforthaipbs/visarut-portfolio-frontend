"use client";

import { useParams, notFound } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Skeleton,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES, PortfolioCategory } from "@/types/portfolio";
import { PhotographyLayout } from "@/components/portfolio/layouts/PhotographyLayout";
import { VideographyLayout } from "@/components/portfolio/layouts/VideographyLayout";
import { VideoEditingLayout } from "@/components/portfolio/layouts/VideoEditingLayout";
import { WebsiteLayout } from "@/components/portfolio/layouts/WebsiteLayout";
import { GraphicDesignLayout } from "@/components/portfolio/layouts/GraphicDesignLayout";
import { DefaultLayout } from "@/components/portfolio/layouts/DefaultLayout";

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;

  // Validate category
  if (!category || !(category in PORTFOLIO_CATEGORIES)) {
    notFound();
  }

  const typedCategory = category as PortfolioCategory;
  const { portfolios, loading, error } = usePortfolios({
    categories: typedCategory,
    per_page: 20,
  });

  const categoryName = PORTFOLIO_CATEGORIES[typedCategory];

  // Render category-specific layout
  const renderCategoryLayout = () => {
    const props = { portfolios, loading };

    switch (typedCategory) {
      case "photography":
        return <PhotographyLayout {...props} />;
      case "videography":
        return <VideographyLayout {...props} />;
      case "video-editing":
        return <VideoEditingLayout {...props} />;
      case "website":
        return <WebsiteLayout {...props} />;
      case "graphic-design":
        return <GraphicDesignLayout {...props} />;
      case "print":
      case "exhibition":
      case "campaign":
      case "producer":
      default:
        return <DefaultLayout {...props} category={typedCategory} />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box

          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container
            maxW="5xl"
            py={{ base: 16, md: 20 }}
            px={{ base: 6, md: 8 }}
          >
            <VStack gap={8} align="start">
              <Skeleton height="20px" width="300px" />
              <Skeleton height="60px" width="80%" />
              <Skeleton height="400px" width="100%" />
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box

          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container
            maxW="5xl"
            py={{ base: 16, md: 20 }}
            px={{ base: 6, md: 8 }}
          >
            <VStack gap={8} textAlign="center">
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}

              >
                เกิดข้อผิดพลาด
              </Heading>
              <Text color="gray.600" className="thai-text">
                {error}
              </Text>
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" py={{ base: 16, md: 20 }} px={{ base: 6, md: 8 }}>
          <VStack gap={8} align="start" w="full">
            {/* Navigation */}
            <HStack gap={2} fontSize="sm" color="gray.600">
              <Link href="/" className="thai-text hover:text-accent-500">
                หน้าหลัก
              </Link>
              <Text>/</Text>
              <Link
                href="/portfolio"

              >
                ผลงาน
              </Link>
              <Text>/</Text>
              <Text className="thai-text">{categoryName}</Text>
            </HStack>

            {/* Header */}
            <VStack gap={4} align="start" w="full">
              <HStack gap={4}>
                <Link href="/portfolio">
                  <HStack
                    gap={2}
                    color="gray.600"
                    _hover={{ color: "accent.500" }}
                  >
                    <ArrowLeft size={20} />
                    <Text className="thai-text">กลับไปดูผลงานทั้งหมด</Text>
                  </HStack>
                </Link>
              </HStack>

              <VStack gap={2} align="start">
                <Heading
                  fontSize={{ base: "2xl", md: "4xl" }}
                  color="gray.800"

                >
                  {categoryName}
                </Heading>
                <HStack gap={4}>
                  <Badge
                    bg="accent.500"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"

                  >
                    {portfolios.length} ผลงาน
                  </Badge>
                </HStack>
              </VStack>
            </VStack>

            {/* Category-specific layout */}
            {renderCategoryLayout()}
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
