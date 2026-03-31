"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { PORTFOLIO_CATEGORIES, PortfolioItem } from "@/types/portfolio";
import { WordPressContent } from "@/components/WordPressContent";
import PortfolioVideo from "@/components/PortfolioVideo";
import {
  PortfolioACFDisplay,
  PortfolioGallery,
} from "@/components/portfolio/PortfolioDetails";
import { WordPressAPI } from "@/lib/wordpress";
import { usePortfolioBySlug } from "@/hooks/useWordPress";

interface PortfolioDetailClientProps {
  slug: string;
  initialData?: PortfolioItem;
}

export default function PortfolioDetailClient({
  slug,
  initialData,
}: PortfolioDetailClientProps) {
  const { portfolio, loading, error } = usePortfolioBySlug(slug, initialData);

  if (loading) {
    return (
      <Layout>
        <Box py={{ base: 20, md: 28 }} display="flex" justifyContent="center" w="100%">
          <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
            <VStack gap={6} align="start">
              <Skeleton height="40px" width="60%" />
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
        <Box py={{ base: 20, md: 28 }} display="flex" justifyContent="center" w="100%">
          <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
            <VStack gap={4} textAlign="center">
              <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }}>
                ไม่พบผลงาน
              </Text>
              <Link href="/portfolio">
                <Text fontSize="sm" color={{ base: "gray.400", _dark: "gray.500" }} _hover={{ color: { base: "gray.900", _dark: "white" } }}>
                  ← กลับไปผลงาน
                </Text>
              </Link>
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  const videos = WordPressAPI.extractVideoEmbeds(portfolio.content.rendered);

  return (
    <Layout>
      {/* Hero */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 20, md: 28 }}
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={6} align="start">
            {/* Breadcrumb */}
            <HStack
              gap={2}
              fontSize="xs"
              color={{ base: "gray.400", _dark: "gray.500" }}
            >
              <Link href="/portfolio">
                <Text _hover={{ color: { base: "gray.900", _dark: "white" } }} transition="color 0.15s">
                  ผลงาน
                </Text>
              </Link>
              <Text>/</Text>
              <Text>{PORTFOLIO_CATEGORIES[portfolio.category]}</Text>
            </HStack>

            {/* Title & Meta */}
            <VStack gap={3} align="start" w="full">
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color={{ base: "gray.900", _dark: "white" }}
                lineHeight="1.3"
                letterSpacing="-0.025em"
              >
                {portfolio.title.rendered}
              </Heading>

              <HStack gap={3} fontSize="xs" color={{ base: "gray.400", _dark: "gray.500" }}>
                <Text textTransform="uppercase" letterSpacing="0.05em">
                  {PORTFOLIO_CATEGORIES[portfolio.category]}
                </Text>
                <Text>·</Text>
                <Text>
                  {new Date(portfolio.date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </HStack>
            </VStack>

            {/* Featured Image */}
            {portfolio.featured_image && portfolio.category !== "photography" && (
              <Box w="full" overflow="hidden" borderRadius="md">
                <Image
                  src={portfolio.featured_image.url}
                  alt={portfolio.title.rendered}
                  w="full"
                  objectFit="cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.svg";
                  }}
                />
              </Box>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Divider */}
      <Box w="100%" display="flex" justifyContent="center" bg={{ base: "white", _dark: "gray.900" }}>
        <Box w="60px" h="1px" bg={{ base: "gray.200", _dark: "gray.700" }} />
      </Box>

      {/* Content */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={12} align="start" css={{
            "& .wordpress-content": {
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "flex-start",
            },
            "& .wordpress-content > p:empty": {
              display: "none",
            },
            "& iframe": {
              maxWidth: "100%",
              borderRadius: "0.5rem",
            },
            "& .blog-content": {
              width: "100%",
            },
          }}>
            {/* ACF Project Details */}
            <PortfolioACFDisplay portfolio={portfolio} />

            {/* Content by Category */}
            {portfolio.category === "photography" ? (
              <>
                <PortfolioGallery portfolio={portfolio} />
                {portfolio.excerpt && (
                  <Box>
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color={{ base: "gray.400", _dark: "gray.500" }}
                      mb={4}
                    >
                      รายละเอียด
                    </Text>
                    <Text fontSize="md" color={{ base: "gray.600", _dark: "gray.300" }} lineHeight="1.8">
                      <WordPressContent content={portfolio.excerpt.rendered} />
                    </Text>
                  </Box>
                )}
              </>
            ) : portfolio.category === "videography" || portfolio.category === "video-editing" ? (
              <>
                {videos.length > 0 && (
                  <Box w="full">
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color={{ base: "gray.400", _dark: "gray.500" }}
                      mb={6}
                    >
                      วีดีโอ ({videos.length})
                    </Text>
                    <VStack gap={8} w="full">
                      {videos.map((video, index) => (
                        <PortfolioVideo key={index} video={video} />
                      ))}
                    </VStack>
                  </Box>
                )}
                <PortfolioGallery portfolio={portfolio} />
                {portfolio.content && (
                  <Box>
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color={{ base: "gray.400", _dark: "gray.500" }}
                      mb={4}
                    >
                      รายละเอียด
                    </Text>
                    <Box className="blog-content">
                      <WordPressContent content={portfolio.content.rendered} />
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <>
                {portfolio.content && (
                  <Box>
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color={{ base: "gray.400", _dark: "gray.500" }}
                      mb={4}
                    >
                      รายละเอียด
                    </Text>
                    <Box className="blog-content">
                      <WordPressContent content={portfolio.content.rendered} />
                    </Box>
                  </Box>
                )}
                {videos.length > 0 && (
                  <Box w="full">
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color={{ base: "gray.400", _dark: "gray.500" }}
                      mb={6}
                    >
                      วีดีโอ
                    </Text>
                    <VStack gap={6} w="full">
                      {videos.map((video, index) => (
                        <PortfolioVideo key={index} video={video} />
                      ))}
                    </VStack>
                  </Box>
                )}
                {portfolio.category !== "producer" && (
                  <PortfolioGallery portfolio={portfolio} />
                )}
              </>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Bottom Nav */}
      <Box w="100%" display="flex" justifyContent="center" bg={{ base: "white", _dark: "gray.900" }}>
        <Box w="60px" h="1px" bg={{ base: "gray.200", _dark: "gray.700" }} />
      </Box>

      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 12, md: 16 }}
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <HStack gap={6} justify="center">
            <Link href="/portfolio">
              <Text
                fontSize="sm"
                color={{ base: "gray.400", _dark: "gray.500" }}
                _hover={{ color: { base: "gray.900", _dark: "white" } }}
                transition="color 0.15s"
              >
                ← ผลงานทั้งหมด
              </Text>
            </Link>
            <Link href={`/portfolio/category/${portfolio.category}`}>
              <Text
                fontSize="sm"
                color={{ base: "gray.400", _dark: "gray.500" }}
                _hover={{ color: { base: "gray.900", _dark: "white" } }}
                transition="color 0.15s"
              >
                {PORTFOLIO_CATEGORIES[portfolio.category]} →
              </Text>
            </Link>
          </HStack>
        </Container>
      </Box>
    </Layout>
  );
}
