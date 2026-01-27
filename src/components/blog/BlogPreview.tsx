"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Badge,
  Image,
} from "@chakra-ui/react";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getBlogPostImage } from "@/utils";
import { getWordPressMediaUrl } from "@/utils";
import type {
  BlogPost,
  BlogCategory,
  WordPressFeaturedMedia,
} from "@/types/wordpress";

interface BlogPreviewProps {
  maxPosts?: number;
}

export function BlogPreview({ maxPosts = 3 }: BlogPreviewProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // Fetch recent posts
        const postsResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogPostsEndpoint}?per_page=${maxPosts}&orderby=date&order=desc`
        );
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        // Fetch categories if we have posts
        if (postsData.length > 0) {
          const categoriesResponse = await fetch(
            `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogCategoriesEndpoint}`
          );
          if (!categoriesResponse.ok)
            throw new Error("Failed to fetch categories");
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        setPosts(postsData);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [maxPosts]);

  if (loading) {
    return (
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 20 }}

        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8}>
            <Text>กำลังโหลดบทความ...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show anything if no posts
  }

  return (
    <Box
      bg={{ base: "white", _dark: "gray.900" }}
      py={{ base: 16, md: 20 }}

      display="flex"
      justifyContent="center"
      w="100%"
    >
      <Container maxW="5xl" px={{ base: 6, md: 8 }}>
        <VStack gap={12}>
          {/* Section Header */}
          <VStack gap={4} textAlign="center">
            <Heading
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              color={{ base: "gray.800", _dark: "white" }}

            >
              บทความล่าสุด
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={{ base: "gray.600", _dark: "gray.300" }}
              maxW="600px"

            >
              ความคิดเห็น ประสบการณ์ และเทคนิคการทำงานจากมุมมองของนักสื่อ
            </Text>
          </VStack>

          {/* Blog Posts Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} categories={categories} />
            ))}
          </SimpleGrid>

          {/* View All Button */}
          <HStack gap={4} mt={8}>
            <Link href="/blog">
              <Button
                size="lg"
                bg="accent.500"
                color="white"
                _hover={{ bg: "accent.600" }}

                px={6}
                py={3}
              >
                <HStack gap={2}>
                  <Text>ดูบทความทั้งหมด</Text>
                  <ArrowRight size={20} />
                </HStack>
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

// Blog Post Card Component
function BlogPostCard({
  post,
  categories,
}: {
  post: BlogPost;
  categories: BlogCategory[];
}) {
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedImage = async () => {
      console.log(
        "BlogPreview: Fetching featured image for post:",
        post.id,
        post.title.rendered
      );
      setImageLoading(true);

      if (post.featured_media && post.featured_media > 0) {
        console.log(
          "BlogPreview: Post has featured_media ID:",
          post.featured_media
        );
        try {
          // Fetch featured media details
          const mediaResponse = await fetch(
            getWordPressMediaUrl(
              siteConfig.api.wordpress.baseUrl,
              post.featured_media
            )
          );

          if (mediaResponse.ok) {
            const mediaData: WordPressFeaturedMedia =
              await mediaResponse.json();
            console.log(
              "BlogPreview: Featured media data:",
              mediaData.source_url
            );
            setFeaturedImage(mediaData.source_url);
            setImageLoading(false);
            return;
          } else {
            console.log(
              "BlogPreview: Failed to fetch featured media:",
              mediaResponse.status
            );
          }
        } catch (error) {
          console.error("BlogPreview: Failed to fetch featured media:", error);
        }
      } else {
        console.log("BlogPreview: No featured_media for post:", post.id);
      }

      // Fallback to first image in content
      console.log("BlogPreview: Trying to extract image from content...");
      const contentImage = getBlogPostImage(null, post.content.rendered);
      console.log("BlogPreview: Extracted content image:", contentImage);
      setFeaturedImage(contentImage);
      setImageLoading(false);
    };

    fetchFeaturedImage();
  }, [
    post.featured_media,
    post.content.rendered,
    post.id,
    post.title.rendered,
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPostCategories = () => {
    return post.categories
      .map((catId) => categories.find((cat) => cat.id === catId))
      .filter(Boolean) as BlogCategory[];
  };

  return (
    <Box
      bg={{ base: "white", _dark: "gray.700" }}
      borderRadius="lg"
      shadow="sm"
      border="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.600" }}
      overflow="hidden"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
      }}
      transition="all 0.3s ease"
    >
      <VStack align="stretch" gap={0}>
        {/* Featured Image */}
        <Box
          h="180px"
          bg="gray.100"
          position="relative"
          overflow="hidden"
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
              onError={() => setFeaturedImage(null)}
            />
          ) : (
            <Text color="gray.500" fontSize="sm">
              {imageLoading ? "กำลังโหลด..." : "รูปภาพประกอบ"}
            </Text>
          )}
        </Box>

        <VStack align="stretch" gap={4} p={6}>
          {/* Categories */}
          {getPostCategories().length > 0 && (
            <HStack gap={2} wrap="wrap">
              {getPostCategories()
                .slice(0, 2)
                .map((category) => (
                  <Badge
                    key={category.id}
                    bg="accent.100"
                    color="accent.700"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"

                  >
                    {category.name}
                  </Badge>
                ))}
            </HStack>
          )}

          {/* Title */}
          <Heading
            fontSize="lg"
            fontWeight="600"
            color={{ base: "gray.800", _dark: "white" }}
            lineHeight="1.4"
            truncate
          >
            {post.title.rendered}
          </Heading>

          {/* Excerpt */}
          {post.excerpt.rendered && (
            <Text
              fontSize="sm"
              color={{ base: "gray.600", _dark: "gray.300" }}

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

          {/* Meta - One Line Layout */}
          <VStack align="stretch" gap={2}>
            <HStack gap={4} fontSize="xs" color="gray.500" justify="center">
              <HStack gap={1}>
                <Calendar size={12} />
                <Text>{formatDate(post.date)}</Text>
              </HStack>
              <HStack gap={1}>
                <User size={12} />
                <Text>{siteConfig.authorTh}</Text>
              </HStack>
            </HStack>

            <Link href={`/blog/${post.slug}`}>
              <Button
                size="sm"
                variant="ghost"
                color="accent.500"
                _hover={{ bg: "accent.50" }}

                px={4}
                py={2}
                w="full"
              >
                อ่านเพิ่มเติม
              </Button>
            </Link>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}
