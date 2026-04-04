"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { sanitizeHtml } from "@/lib/sanitize";
import { getBlogPostImage, decodeHtmlEntities } from "@/utils";
import type {
  BlogPost,
  BlogCategory,
  WordPressFeaturedMedia,
} from "@/types/wordpress";
import { T } from "@/lib/tokens";

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialCategories: BlogCategory[];
}

export default function BlogClient({ initialPosts, initialCategories }: BlogClientProps) {
  const posts = initialPosts;
  const categories = initialCategories;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) =>
        post.categories.some(
          (catId) =>
            categories.find((cat) => cat.id === catId)?.slug ===
            selectedCategory
        )
      );

  const filterOptions = [
    { value: "all", label: "ทั้งหมด" },
    ...categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    })),
  ];

  return (
    <Layout>
      {/* Hero */}
      <Box
        as="section"
        bg={T.bg}
        py={{ base: 20, md: 28 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="บล็อก"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={5} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={T.text}
              letterSpacing="-0.025em"
            >
              บล็อก
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={T.textMuted}
              lineHeight="1.8"
            >
              บทความ ความคิดเห็น และประสบการณ์จากการทำงานด้านสื่อ
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Divider */}
      <Box w="100%" display="flex" justifyContent="center" bg={T.bg} aria-hidden="true">
        <Box w="60px" h="1px" bg={T.border} />
      </Box>

      {/* Content */}
      <Box
        as="section"
        bg={T.bg}
        py={{ base: 16, md: 24 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="รายการบทความ"
      >
        <Container maxW="5xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8} align="stretch" w="full">
            {/* Category Filter */}
            {categories.length > 0 && (
              <HStack gap={3} justify="center" flexWrap="wrap" role="tablist" aria-label="ตัวกรองหมวดหมู่">
                {filterOptions.map((option) => (
                  <Text
                    key={option.value}
                    onClick={() => setSelectedCategory(option.value)}
                    cursor="pointer"
                    fontSize="sm"
                    role="tab"
                    aria-selected={selectedCategory === option.value}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCategory(option.value); } }}
                    color={
                      selectedCategory === option.value
                        ? T.text
                        : T.textDim
                    }
                    _hover={{ color: T.text }}
                    transition="color 0.15s"
                  >
                    {option.label}
                  </Text>
                ))}
              </HStack>
            )}

            {/* Blog Grid */}
            {filteredPosts.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 6, md: 8 }}>
                {filteredPosts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={12}>
                <Text
                  fontSize="sm"
                  color={T.textDim}
                  cursor="pointer"
                  onClick={() => setSelectedCategory("all")}
                  _hover={{ color: T.text }}
                >
                  ไม่พบบทความ — ดูทั้งหมด
                </Text>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}

function BlogPostCard({
  post,
}: {
  post: BlogPost;
}) {
  // Extract image from embedded data (no extra API call needed)
  const embedded = (post as BlogPost & { _embedded?: { "wp:featuredmedia"?: WordPressFeaturedMedia[] } })._embedded;
  const embeddedImage = embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const featuredImage = embeddedImage || getBlogPostImage(null, post.content.rendered);

  return (
    <Link href={`/blog/${post.slug}`} aria-label={post.title.rendered.replace(/<[^>]*>/g, '')}>
      <Box cursor="pointer" role="group" as="article">
        {/* Image */}
        <Box
          h="200px"
          bg={T.surface}
          overflow="hidden"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={post.title.rendered}
              w="full"
              h="full"
              objectFit="cover"
              loading="lazy"
              transition="opacity 0.2s"
              _groupHover={{ opacity: 0.85 }}
            />
          ) : (
            <Text color={T.textDim} fontSize="xs">
            </Text>
          )}
        </Box>

        <VStack align="start" gap={1.5} mt={3}>
          <HStack gap={2} fontSize="xs" color={T.textDim}>
            <Text>
              {new Date(post.date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </HStack>

          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="medium"
            color={T.text}
            lineHeight="1.4"
            lineClamp={2}
          >
            {decodeHtmlEntities(post.title.rendered)}
          </Text>

          {post.excerpt.rendered && (
            <Text
              fontSize="xs"
              color={T.textMuted}
              lineHeight="1.6"
              css={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(post.excerpt.rendered.replace(/<[^>]*>/g, "")),
              }}
            />
          )}
        </VStack>
      </Box>
    </Link>
  );
}
