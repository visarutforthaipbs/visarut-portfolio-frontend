"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  AspectRatio,
  Image,
  Flex,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import {
  Camera,
  Video,
  Code,
  Palette,
  ArrowRight,
  MapPin,
  Award,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { FeaturedSlider } from "@/components/portfolio/FeaturedSlider";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem, ImageMedia } from "@/types/portfolio";
import { getBlogPostImage, decodeHtmlEntities } from "@/utils";
import type { BlogPost, WordPressFeaturedMedia } from "@/types/wordpress";
import { T } from "@/lib/tokens";

const SERVICES = [
  { icon: Camera, title: "Photography", titleTh: "ภาพถ่าย", category: "photography" },
  { icon: Video, title: "Videography", titleTh: "วิดีโอ", category: "videography" },
  { icon: Code, title: "Web Development", titleTh: "เว็บไซต์", category: "website" },
  { icon: Palette, title: "Graphic Design", titleTh: "กราฟิกดีไซน์", category: "graphic-design" },
];

interface HomeClientProps {
  initialBlogPosts: BlogPost[];
  featuredPortfolios: PortfolioItem[];
}

export default function HomeClient({ initialBlogPosts, featuredPortfolios }: HomeClientProps) {
  return (
    <Layout>
      {/* ── LAYER 1: SUBCONSCIOUS HOOK ── */}
      <Box
        as="section"
        role="region"
        aria-label="แนะนำตัว"
        position="relative"
        overflow="hidden"
        bg={T.bg}
        py={{ base: 20, md: 32 }}
      >
        {/* Subtle dot-grid texture */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.04}
          backgroundImage="radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)"
          backgroundSize="32px 32px"
          aria-hidden="true"
        />

        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }} position="relative">
          <VStack gap={6} align="start">
            <Text
              fontSize="sm"
              fontWeight="500"
              color={T.accent}
              textTransform="uppercase"
              letterSpacing="0.12em"
            >
              Visarut Sankham
            </Text>

            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontWeight="700"
              lineHeight="1.08"
              letterSpacing="-0.03em"
              color={T.text}
              maxW="680px"
            >
              Visual Storyteller
              <br />
              <Text as="span" color={T.textMuted}>
                &amp; Media Producer
              </Text>
            </Heading>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={T.textMuted}
              lineHeight="1.7"
              maxW="520px"
            >
              เล่าเรื่องผ่านภาพถ่าย วิดีโอ และสื่อดิจิทัล
              เพื่อสังคม สิ่งแวดล้อม และสิทธิมนุษยชน
            </Text>

            {/* Authority markers */}
            <HStack gap={4} mt={2} flexWrap="wrap">
              {[
                { icon: Briefcase, label: "Thai PBS" },
                { icon: MapPin, label: "Thailand" },
                { icon: Award, label: "Award-winning" },
              ].map((badge) => (
                <HStack key={badge.label} gap={1.5}>
                  <Icon as={badge.icon} boxSize={3.5} color={T.textDim} />
                  <Text fontSize="xs" color={T.textDim} fontWeight="500">
                    {badge.label}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* ── Featured Slider ── */}
      {featuredPortfolios.length > 0 && (
        <FeaturedSlider items={featuredPortfolios} />
      )}

      {/* ── LAYER 2: SPECIALIZATIONS ── */}
      <Box
        as="section"
        role="region"
        aria-label="บริการ"
        bg={T.bg}
        py={{ base: 12, md: 20 }}
      >
        <Container maxW="4xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={{ base: 8, md: 12 }} align="stretch">
            <Text
              fontSize="xs"
              fontWeight="500"
              color={T.textDim}
              textTransform="uppercase"
              letterSpacing="0.1em"
            >
              Specializations
            </Text>

            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              {SERVICES.map((service) => (
                <Link key={service.title} href={`/portfolio?category=${service.category}`}>
                  <Box
                    bg={T.surface}
                    border="1px solid"
                    borderColor={T.border}
                    borderRadius="12px"
                    p={{ base: 5, md: 6 }}
                    transition="border-color 0.25s, background 0.25s"
                    _hover={{ borderColor: T.accent, bg: T.surfaceHover }}
                    cursor="pointer"
                    h="full"
                  >
                    <VStack gap={3} align="start">
                      <Flex
                        w="36px"
                        h="36px"
                        align="center"
                        justify="center"
                        borderRadius="8px"
                        bg={T.accentDim}
                      >
                        <Icon as={service.icon} boxSize={4} color={T.accent} />
                      </Flex>
                      <Text fontSize="sm" fontWeight="600" color={T.text}>
                        {service.titleTh}
                      </Text>
                      <Text fontSize="xs" color={T.textDim}>
                        {service.title}
                      </Text>
                    </VStack>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* ── Minimal divider ── */}
      <Box display="flex" justifyContent="center" bg={T.bg} aria-hidden="true">
        <Box w="40px" h="1px" bg={T.border} />
      </Box>

      {/* ── LAYER 3: PORTFOLIO ── */}
      <Box
        as="section"
        w="100%"
        display="flex"
        justifyContent="center"
        bg={T.bg}
        py={{ base: 12, md: 20 }}
      >
        <Container maxW="5xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
          <DarkPortfolioGrid maxItems={6} />
        </Container>
      </Box>

      {/* ── Minimal divider ── */}
      <Box display="flex" justifyContent="center" bg={T.bg} aria-hidden="true">
        <Box w="40px" h="1px" bg={T.border} />
      </Box>

      {/* ── BLOG ── */}
      <Box
        as="section"
        w="100%"
        display="flex"
        justifyContent="center"
        bg={T.bg}
        py={{ base: 12, md: 20 }}
        role="region"
        aria-label="บทความล่าสุด"
      >
        <Container maxW="5xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
          <VStack gap={{ base: 8, md: 12 }} w="full">
            <Text
              fontSize="xs"
              fontWeight="500"
              color={T.textDim}
              textTransform="uppercase"
              letterSpacing="0.1em"
              alignSelf="start"
            >
              Latest Writing
            </Text>

            {initialBlogPosts.length > 0 ? (
              <>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 6 }} w="full">
                  {initialBlogPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </SimpleGrid>

                <Link href="/blog" aria-label="ดูบทความทั้งหมด">
                  <HStack
                    gap={2}
                    color={T.textMuted}
                    fontWeight="medium"
                    fontSize="sm"
                    _hover={{ gap: 3, color: T.text }}
                    transition="all 0.2s"
                    cursor="pointer"
                  >
                    <Text>ดูบทความทั้งหมด</Text>
                    <ArrowRight size={16} aria-hidden="true" />
                  </HStack>
                </Link>
              </>
            ) : null}
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}

/* ─────────────────────────────────────────────
   DARK PORTFOLIO GRID
   ───────────────────────────────────────────── */

function DarkPortfolioGrid({ maxItems = 6 }: { maxItems?: number }) {
  const { portfolios, loading, error } = usePortfolios({ per_page: maxItems });

  if (error) {
    return (
      <Box py={8} textAlign="center" role="alert">
        <HStack gap={2} justify="center" color={T.textDim}>
          <AlertCircle size={16} aria-hidden="true" />
          <Text fontSize="sm">เกิดข้อผิดพลาดในการโหลดผลงาน</Text>
        </HStack>
      </Box>
    );
  }

  return (
    <VStack gap={{ base: 8, md: 10 }} w="full" aria-label="ผลงานล่าสุด" role="region">
      <Text
        fontSize="xs"
        fontWeight="500"
        color={T.textDim}
        textTransform="uppercase"
        letterSpacing="0.1em"
        alignSelf="start"
      >
        Recent Work
      </Text>

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
              <Skeleton height={{ base: "200px", md: "220px" }} borderRadius="12px" />
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
              <DarkPortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </Box>

          <Link href="/portfolio" aria-label="ดูผลงานทั้งหมด">
            <HStack
              gap={2}
              color={T.textMuted}
              fontWeight="medium"
              fontSize="sm"
              _hover={{ gap: 3, color: T.text }}
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
          <Text fontSize="sm" color={T.textDim}>
            ยังไม่มีผลงานที่จะแสดง
          </Text>
        </Box>
      )}
    </VStack>
  );
}

function DarkPortfolioCard({ portfolio }: { portfolio: PortfolioItem }) {
  const categoryLabel = PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category;

  const getFeaturedImageUrl = (image: string | ImageMedia | undefined): string => {
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
        <Box overflow="hidden" borderRadius="12px" bg={T.surface}>
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
            color={T.textDim}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {categoryLabel}
          </Text>
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="medium"
            color={T.text}
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

/* ─────────────────────────────────────────────
   BLOG CARD (Dark variant)
   ───────────────────────────────────────────── */

function BlogCard({ post }: { post: BlogPost }) {
  const embeddedMedia = (post as BlogPost & { _embedded?: { "wp:featuredmedia"?: WordPressFeaturedMedia[] } })._embedded?.["wp:featuredmedia"]?.[0];
  const thumbnail = embeddedMedia
    ? (embeddedMedia.media_details?.sizes?.medium?.source_url || embeddedMedia.source_url)
    : getBlogPostImage(null, post.content.rendered);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const titleText = decodeHtmlEntities(post.title.rendered.replace(/<[^>]*>/g, ""));
  const excerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .slice(0, 100)
    .trim();

  return (
    <Link href={`/blog/${post.slug}`} aria-label={titleText}>
      <Box
        as="article"
        cursor="pointer"
        role="group"
        bg={T.surface}
        border="1px solid"
        borderColor={T.border}
        borderRadius="12px"
        overflow="hidden"
        transition="border-color 0.25s, background 0.25s"
        _hover={{ borderColor: T.accent, bg: T.surfaceHover }}
      >
        <AspectRatio ratio={16 / 9} w="full">
          <Box bg={T.surface}>
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={titleText}
                w="full"
                h="full"
                objectFit="cover"
                loading="lazy"
              />
            ) : (
              <Box w="full" h="full" />
            )}
          </Box>
        </AspectRatio>
        <VStack align="start" gap={2} p={{ base: 4, md: 5 }}>
          <Text fontSize="xs" color={T.textDim} letterSpacing="wide">
            {formatDate(post.date)}
          </Text>
          <Heading
            as="h3"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="600"
            color={T.text}
            lineHeight="1.3"
            lineClamp={2}
          >
            {titleText}
          </Heading>
          {excerpt && (
            <Text
              fontSize="sm"
              color={T.textMuted}
              lineHeight="1.6"
              lineClamp={2}
            >
              {excerpt}...
            </Text>
          )}
        </VStack>
      </Box>
    </Link>
  );
}
