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
} from "@chakra-ui/react";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import type { BlogPost, BlogCategory } from "@/types/wordpress";

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
        className="full-width"
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
      className="full-width"
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
              className="thai-text"
            >
              บทความล่าสุด
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={{ base: "gray.600", _dark: "gray.300" }}
              maxW="600px"
              className="thai-text"
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
                className="thai-text"
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
        {/* Featured Image Placeholder */}
        {post.featured_media && (
          <Box
            h="180px"
            bg="gray.100"
            position="relative"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.500" fontSize="sm" className="thai-text">
              รูปภาพประกอบ
            </Text>
          </Box>
        )}

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
                    className="thai-text"
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
            className="thai-text"
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
              className="thai-text"
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

          {/* Meta */}
          <VStack align="stretch" gap={2}>
            <HStack gap={4} fontSize="xs" color="gray.500">
              <HStack gap={1}>
                <Calendar size={12} />
                <Text className="thai-text">{formatDate(post.date)}</Text>
              </HStack>
              <HStack gap={1}>
                <User size={12} />
                <Text className="thai-text">{siteConfig.authorTh}</Text>
              </HStack>
            </HStack>

            <Link href={`/blog/${post.slug}`}>
              <Button
                size="sm"
                variant="ghost"
                color="accent.500"
                _hover={{ bg: "accent.50" }}
                className="thai-text"
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
