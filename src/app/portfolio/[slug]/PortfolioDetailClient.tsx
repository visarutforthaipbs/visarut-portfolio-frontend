"use client";

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
  Button,
  Skeleton,
} from "@chakra-ui/react";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import { WordPressContent } from "@/components/WordPressContent";
import PortfolioVideo from "@/components/PortfolioVideo";
import PortfolioSEO from "@/components/PortfolioSEO";
import {
  PortfolioACFDisplay,
  PortfolioGallery,
} from "@/components/portfolio/PortfolioDetails";
import { WordPressAPI } from "@/lib/wordpress";
import { usePortfolioBySlug } from "@/hooks/useWordPress";

interface PortfolioDetailClientProps {
  slug: string;
}

export default function PortfolioDetailClient({
  slug,
}: PortfolioDetailClientProps) {
  const { portfolio, loading, error } = usePortfolioBySlug(slug);

  if (loading) {
    return (
      <Layout>
        <Box
          py={{ base: 16, md: 20 }}
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <VStack gap={8} align="start">
              <Skeleton height="60px" width="80%" />
              <Skeleton height={{ base: "200px", md: "400px" }} w="full" />
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
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <Text>Portfolio not found</Text>
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

      {/* Hero Section */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 20 }}
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
              <Link href="/" className="hover:text-accent-500">
                หน้าหลัก
              </Link>
              <Text>/</Text>
              <Link href="/portfolio">ผลงาน</Link>
              <Text>/</Text>

              <Text>{PORTFOLIO_CATEGORIES[portfolio.category]}</Text>
            </HStack>

            <VStack gap={6} align="start" w="full">
              <VStack gap={4} align="start">
                <HStack gap={3} wrap="wrap">
                  <Badge
                    bg="accent.500"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {PORTFOLIO_CATEGORIES[portfolio.category]}
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

                <Heading
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="bold"
                  color={{ base: "gray.900", _dark: "white" }}
                  lineHeight="1.2"
                >
                  {portfolio.title.rendered}
                </Heading>
              </VStack>

              {/* Featured Image - Hide for photography category as it's shown in gallery */}
              {portfolio.featured_image &&
                portfolio.category !== "photography" && (
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
                      color="gray.800"
                      mb={4}
                    >
                      รายละเอียดโปรเจค
                    </Heading>
                    <Text fontSize="md" color="gray.700" lineHeight="1.8">
                      <WordPressContent content={portfolio.excerpt.rendered} />
                    </Text>
                  </Box>
                )}
              </>
            ) : portfolio.category === "videography" ||
              portfolio.category === "video-editing" ? (
              /* Video-focused display */
              <>
                {/* Videos - Primary focus for video work */}
                {videos.length > 0 && (
                  <Box w="full">
                    <Heading
                      fontSize="xl"
                      fontWeight="600"
                      color="gray.800"
                      mb={6}
                    >
                      วีดีโอ ({videos.length} วีดีโอ)
                    </Heading>
                    <VStack gap={8} w="full">
                      {videos.map((video, index) => (
                        <PortfolioVideo key={index} video={video} />
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Supporting Images */}
                <PortfolioGallery portfolio={portfolio} />

                {/* Description */}
                {portfolio.content && (
                  <Box>
                    <Heading
                      fontSize="xl"
                      fontWeight="600"
                      color="gray.800"
                      mb={4}
                    >
                      รายละเอียดโปรเจค
                    </Heading>
                    <Box className="blog-content">
                      <WordPressContent content={portfolio.content.rendered} />
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              /* Default display for other categories */
              <>
                {/* Content and Gallery */}
                {portfolio.content && (
                  <Box>
                    <Heading
                      fontSize="xl"
                      fontWeight="600"
                      color="gray.800"
                      mb={4}
                    >
                      รายละเอียดโปรเจค
                    </Heading>
                    <Box className="blog-content">
                      <WordPressContent content={portfolio.content.rendered} />
                    </Box>
                  </Box>
                )}

                {/* Videos if any */}
                {videos.length > 0 && (
                  <Box w="full">
                    <Heading
                      fontSize="xl"
                      fontWeight="600"
                      color="gray.800"
                      mb={6}
                    >
                      วีดีโอที่เกี่ยวข้อง
                    </Heading>
                    <VStack gap={6} w="full">
                      {videos.map((video, index) => (
                        <PortfolioVideo key={index} video={video} />
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Gallery */}
                <PortfolioGallery portfolio={portfolio} />
              </>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Bottom Navigation */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 12, md: 16 }}
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8}>
            <HStack gap={{ base: 3, md: 4 }} justify="center" flexWrap="wrap">
              <Link href="/portfolio">
                <Button
                  bg="accent.500"
                  color="white"
                  _hover={{ bg: "accent.600" }}
                  size="lg"
                >
                  <HStack gap={2}>
                    <ArrowLeft size={20} />
                    <Text>ดูผลงานทั้งหมด</Text>
                  </HStack>
                </Button>
              </Link>

              <Link href={`/portfolio/category/${portfolio.category}`}>
                <Button
                  variant="outline"
                  borderColor="accent.500"
                  color="accent.500"
                  _hover={{
                    bg: "accent.50",
                    borderColor: "accent.600",
                    color: "accent.600",
                  }}
                  size="lg"
                >
                  ดูผลงาน{PORTFOLIO_CATEGORIES[portfolio.category]}อื่น ๆ
                </Button>
              </Link>
            </HStack>

            {/* Related or Next/Previous Portfolio Items could go here */}
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
