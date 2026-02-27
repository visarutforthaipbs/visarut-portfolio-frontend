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
import { siteConfig } from "@/lib/config";
import { getBlogPostImage } from "@/utils";
import { getWordPressMediaUrl } from "@/utils";
import { useEffect } from "react";
import type {
  BlogPost,
  BlogCategory,
  WordPressFeaturedMedia,
} from "@/types/wordpress";

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialCategories: BlogCategory[];
}

export default function BlogClient({ initialPosts, initialCategories }: BlogClientProps) {
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [categories] = useState<BlogCategory[]>(initialCategories);
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
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 20, md: 28 }}
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={5} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={{ base: "gray.900", _dark: "white" }}
              letterSpacing="-0.025em"
            >
              บล็อก
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={{ base: "gray.500", _dark: "gray.400" }}
              lineHeight="1.8"
            >
              บทความ ความคิดเห็น และประสบการณ์จากการทำงานด้านสื่อ
            </Text>
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
        <Container maxW="5xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8} align="stretch" w="full">
            {/* Category Filter */}
            {categories.length > 0 && (
              <HStack gap={3} justify="center" flexWrap="wrap">
                {filterOptions.map((option) => (
                  <Text
                    key={option.value}
                    onClick={() => setSelectedCategory(option.value)}
                    cursor="pointer"
                    fontSize="sm"
                    color={
                      selectedCategory === option.value
                        ? { base: "gray.900", _dark: "white" }
                        : { base: "gray.400", _dark: "gray.500" }
                    }
                    _hover={{ color: { base: "gray.900", _dark: "white" } }}
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
                  color={{ base: "gray.400", _dark: "gray.500" }}
                  cursor="pointer"
                  onClick={() => setSelectedCategory("all")}
                  _hover={{ color: { base: "gray.900", _dark: "white" } }}
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
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedImage = async () => {
      setImageLoading(true);

      if (post.featured_media && post.featured_media > 0) {
        try {
          const mediaResponse = await fetch(
            getWordPressMediaUrl(
              siteConfig.api.wordpress.baseUrl,
              post.featured_media
            )
          );

          if (mediaResponse.ok) {
            const mediaData: WordPressFeaturedMedia =
              await mediaResponse.json();
            setFeaturedImage(mediaData.source_url);
            setImageLoading(false);
            return;
          }
        } catch (error) {
          console.error("BlogPage: Failed to fetch featured media:", error);
        }
      }

      const contentImage = getBlogPostImage(null, post.content.rendered);
      setFeaturedImage(contentImage);
      setImageLoading(false);
    };

    fetchFeaturedImage();
  }, [post.featured_media, post.content.rendered, post.id]);

  return (
    <Link href={`/blog/${post.slug}`}>
      <Box cursor="pointer" role="group">
        {/* Image */}
        <Box
          h="200px"
          bg={{ base: "gray.100", _dark: "gray.800" }}
          overflow="hidden"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {featuredImage && !imageLoading ? (
            <Image
              src={featuredImage}
              alt={post.title.rendered}
              w="full"
              h="full"
              objectFit="cover"
              loading="lazy"
              transition="opacity 0.2s"
              _groupHover={{ opacity: 0.85 }}
              onError={() => setFeaturedImage(null)}
            />
          ) : (
            <Text color={{ base: "gray.400", _dark: "gray.500" }} fontSize="xs">
              {imageLoading ? "..." : ""}
            </Text>
          )}
        </Box>

        <VStack align="start" gap={1.5} mt={3}>
          <HStack gap={2} fontSize="xs" color={{ base: "gray.400", _dark: "gray.500" }}>
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
            color={{ base: "gray.800", _dark: "white" }}
            lineHeight="1.4"
            lineClamp={2}
          >
            {post.title.rendered}
          </Text>

          {post.excerpt.rendered && (
            <Text
              fontSize="xs"
              color={{ base: "gray.500", _dark: "gray.400" }}
              lineHeight="1.6"
              css={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              dangerouslySetInnerHTML={{
                __html: post.excerpt.rendered.replace(/<[^>]*>/g, ""),
              }}
            />
          )}
        </VStack>
      </Box>
    </Link>
  );
}
