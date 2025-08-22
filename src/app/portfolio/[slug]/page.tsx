"use client";

import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Image,
  AspectRatio,
  Skeleton,
  Button,
} from "@chakra-ui/react";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { usePortfolioBySlug } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import { WordPressContent } from "@/components/WordPressContent";
import PortfolioVideo from "@/components/PortfolioVideo";
import PortfolioSEO from "@/components/PortfolioSEO";
import {
  PortfolioACFDisplay,
  PortfolioGallery,
} from "@/components/portfolio/PortfolioDetails";
import { WordPressAPI } from "@/lib/wordpress";

export default function PortfolioDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { portfolio, loading, error } = usePortfolioBySlug(slug);

  if (loading) {
    return (
      <Layout>
        <Box
          py={{ base: 16, md: 20 }}
          className="full-width"
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <VStack gap={8} align="start">
              {/* Breadcrumb Skeleton */}
              <Skeleton height="20px" width="300px" />

              {/* Header Skeleton */}
              <VStack gap={4} align="start" w="full">
                <Skeleton height="60px" width="80%" />
                <HStack gap={4}>
                  <Skeleton height="30px" width="100px" />
                  <Skeleton height="20px" width="150px" />
                </HStack>
              </VStack>

              {/* Image Skeleton */}
              <Skeleton height="400px" width="100%" borderRadius="lg" />

              {/* Content Skeleton */}
              <VStack gap={4} align="start" w="full">
                <Skeleton height="20px" width="100%" />
                <Skeleton height="20px" width="90%" />
                <Skeleton height="20px" width="85%" />
              </VStack>
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  if (error || !portfolio) {
    return (
      <Layout>
        <Box
          py={{ base: 16, md: 20 }}
          className="full-width"
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <VStack gap={8} textAlign="center">
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
              >
                ไม่พบผลงานที่ต้องการ
              </Heading>
              <Text
                fontSize="lg"
                color={{ base: "gray.600", _dark: "gray.400" }}
                className="thai-text"
              >
                {error || "ผลงานที่คุณกำลังมองหาอาจถูกลบหรือย้ายที่แล้ว"}
              </Text>
              <Link href="/portfolio">
                <Button
                  bg="accent.500"
                  color="white"
                  _hover={{ bg: "accent.600" }}
                  size="lg"
                  className="thai-text"
                >
                  <HStack gap={2}>
                    <ArrowLeft size={20} />
                    <Text>กลับไปดูผลงานทั้งหมด</Text>
                  </HStack>
                </Button>
              </Link>
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  // Extract videos from content
  const videos = WordPressAPI.extractVideoEmbeds(portfolio.content.rendered);

  return (
    <Layout>
      <PortfolioSEO portfolio={portfolio} />
      <Box className="full-width">
        {/* Hero Section */}
        <Box
          bg={{ base: "white", _dark: "gray.900" }}
          py={{ base: 16, md: 20 }}
          className="full-width"
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <VStack gap={8} align="start">
              {/* Navigation */}
              <HStack
                gap={2}
                fontSize="sm"
                color={{ base: "gray.600", _dark: "gray.400" }}
              >
                <Link href="/" className="thai-text hover:text-accent-500">
                  หน้าหลัก
                </Link>
                <Text>/</Text>
                <Link
                  href="/portfolio"
                  className="thai-text hover:text-accent-500"
                >
                  ผลงาน
                </Link>
                <Text>/</Text>
                <Text className="thai-text">{portfolio.title.rendered}</Text>
              </HStack>

              {/* Header */}
              <VStack gap={6} align="start" w="full">
                <VStack gap={4} align="start">
                  <Heading
                    fontSize={{ base: "2xl", md: "4xl" }}
                    fontWeight="bold"
                    color={{ base: "gray.800", _dark: "white" }}
                    className="thai-text"
                    lineHeight="1.3"
                  >
                    {portfolio.title.rendered}
                  </Heading>

                  <HStack gap={4} wrap="wrap">
                    <Badge
                      bg="accent.100"
                      color="accent.700"
                      px={4}
                      py={2}
                      borderRadius="full"
                      fontSize="sm"
                      className="thai-text"
                    >
                      {PORTFOLIO_CATEGORIES[portfolio.category] ||
                        portfolio.category}
                    </Badge>

                    <HStack
                      gap={2}
                      fontSize="sm"
                      color={{ base: "gray.600", _dark: "gray.400" }}
                    >
                      <Calendar size={16} />
                      <Text>
                        {new Date(portfolio.date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>

                {/* Featured Image - Hide for photography category as it's shown in gallery */}
                {portfolio.featured_image && portfolio.category !== "photography" && (
                  <AspectRatio ratio={16 / 9} w="full">
                    <Image
                      src={portfolio.featured_image.url}
                      alt={portfolio.title.rendered}
                      objectFit="cover"
                      borderRadius="lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.svg";
                      }}
                    />
                  </AspectRatio>
                )}
              </VStack>
            </VStack>
          </Container>
        </Box>

        {/* Content Section */}
        <Box
          bg={{ base: "gray.50", _dark: "gray.800" }}
          py={{ base: 16, md: 20 }}
          className="full-width"
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <VStack gap={12} align="start">
              {/* ACF Project Details */}
              <PortfolioACFDisplay portfolio={portfolio} />

              {/* Conditional Content Display based on Category */}
              {portfolio.category === "photography" ? (
                /* Photography-focused display */
                <>
                  {/* Gallery Images - Primary focus for photography */}
                  <PortfolioGallery portfolio={portfolio} />

                  {/* Description */}
                  {portfolio.excerpt && (
                    <Box>
                      <Heading
                        fontSize="xl"
                        fontWeight="600"
                        color={{ base: "gray.800", _dark: "white" }}
                        className="thai-text"
                        mb={4}
                      >
                        เกี่ยวกับการถ่ายภาพ
                      </Heading>
                      <Text
                        fontSize="lg"
                        color={{ base: "gray.700", _dark: "gray.300" }}
                        className="thai-text"
                        lineHeight="1.8"
                      >
                        {portfolio.excerpt.rendered}
                      </Text>
                    </Box>
                  )}
                </>
              ) : (
                /* Standard display for other categories */
                <>
                  {/* Description */}
                  {portfolio.excerpt && (
                    <Box>
                      <Heading
                        fontSize="xl"
                        fontWeight="600"
                        color={{ base: "gray.800", _dark: "white" }}
                        className="thai-text"
                        mb={4}
                      >
                        รายละเอียด
                      </Heading>
                      <Text
                        fontSize="lg"
                        color={{ base: "gray.700", _dark: "gray.300" }}
                        className="thai-text"
                        lineHeight="1.8"
                      >
                        {portfolio.excerpt.rendered}
                      </Text>
                    </Box>
                  )}

                  {/* Gallery Images - Secondary for non-photography */}
                  <PortfolioGallery portfolio={portfolio} />

                  {/* Videos */}
                  {videos.length > 0 && (
                    <Box w="full">
                      <Heading
                        fontSize="xl"
                        fontWeight="600"
                        color={{ base: "gray.800", _dark: "white" }}
                        className="thai-text"
                        mb={6}
                      >
                        วีดีโอ
                      </Heading>
                      <VStack gap={6}>
                        {videos.map((video, index) => (
                          <PortfolioVideo key={index} video={video} />
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {/* WordPress Content - Only for non-photography if it contains non-image content */}
                  {portfolio.content.rendered &&
                    !portfolio.content.rendered.includes("wp-block-gallery") &&
                    portfolio.content.rendered.replace(/<img[^>]*>/g, "").trim()
                      .length > 50 && (
                      <Box w="full">
                        <Heading
                          fontSize="xl"
                          fontWeight="600"
                          color={{ base: "gray.800", _dark: "white" }}
                          className="thai-text"
                          mb={6}
                        >
                          เนื้อหาเพิ่มเติม
                        </Heading>
                        <WordPressContent
                          content={portfolio.content.rendered}
                          color={{ base: "gray.700", _dark: "gray.300" }}
                          className="thai-text"
                        />
                      </Box>
                    )}
                </>
              )}

              {/* Back Button */}
              <Link href="/portfolio">
                <Button
                  variant="outline"
                  size="lg"
                  borderColor="accent.500"
                  color="accent.500"
                  _hover={{ bg: "accent.50" }}
                  className="thai-text"
                >
                  <HStack gap={2}>
                    <ArrowLeft size={20} />
                    <Text>กลับไปดูผลงานทั้งหมด</Text>
                  </HStack>
                </Button>
              </Link>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}
