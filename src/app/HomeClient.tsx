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
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { PortfolioPreview } from "@/components/portfolio";
import { FeaturedSlider } from "@/components/portfolio/FeaturedSlider";
import { getBlogPostImage } from "@/utils";
import type { BlogPost, WordPressFeaturedMedia } from "@/types/wordpress";
import type { PortfolioItem } from "@/types/portfolio";

interface HomeClientProps {
  initialBlogPosts: BlogPost[];
  featuredPortfolios: PortfolioItem[];
}

export default function HomeClient({ initialBlogPosts, featuredPortfolios }: HomeClientProps) {
  const posts = initialBlogPosts;

  return (
    <Layout>
      {/* ── Featured Slider ── */}
      {featuredPortfolios.length > 0 && (
        <FeaturedSlider items={featuredPortfolios} />
      )}

      {/* ── Portfolio ── */}
      <Box
        as="section"
        w="100%"
        display="flex"
        justifyContent="center"
        bg={{ base: "white", _dark: "gray.900" }}
        pt={{ base: 12, md: 16 }}
        pb={{ base: 12, md: 20 }}
      >
        <Container maxW="5xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
          <PortfolioPreview maxItems={6} />
        </Container>
      </Box>

      {/* ── Divider ── */}
      <Box
        w="100%"
        display="flex"
        justifyContent="center"
        bg={{ base: "white", _dark: "gray.900" }}
        aria-hidden="true"
      >
        <Box
          w="60px"
          h="1px"
          bg={{ base: "gray.200", _dark: "gray.700" }}
        />
      </Box>

      {/* ── Blog ── */}
      <Box
        as="section"
        w="100%"
        display="flex"
        justifyContent="center"
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 12, md: 20 }}
        role="region"
        aria-label="บทความล่าสุด"
      >
        <Container maxW="5xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
          <VStack gap={{ base: 8, md: 12 }} w="full">
            <Heading
              as="h2"
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="medium"
              color={{ base: "gray.400", _dark: "gray.500" }}
              textTransform="uppercase"
              letterSpacing="wider"
              textAlign="center"
            >
              บทความล่าสุด
            </Heading>

            {posts.length > 0 ? (
              <>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 6 }} w="full">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </SimpleGrid>

                <Link href="/blog" aria-label="ดูบทความทั้งหมด">
                  <HStack
                    gap={2}
                    color={{ base: "gray.900", _dark: "white" }}
                    fontWeight="medium"
                    fontSize="sm"
                    _hover={{ gap: 3 }}
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

  const titleText = post.title.rendered.replace(/<[^>]*>/g, "");

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
        _hover={{ opacity: 0.7 }}
        transition="opacity 0.2s"
      >
        <VStack align="start" gap={2}>
          <AspectRatio ratio={16 / 9} w="full">
            <Box
              borderRadius="md"
              overflow="hidden"
              bg={{ base: "gray.100", _dark: "gray.800" }}
            >
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
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color={{ base: "gray.400", _dark: "gray.500" }}
            letterSpacing="wide"
          >
            {formatDate(post.date)}
          </Text>
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="medium"
            color={{ base: "gray.800", _dark: "white" }}
            lineHeight="1.2"
            lineClamp={2}
          >
            {titleText}
          </Heading>
          {excerpt && (
            <Text
              fontSize={{ base: "md", md: "md" }}
              color={{ base: "gray.600", _dark: "gray.300" }}
              lineHeight="1.7"
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
