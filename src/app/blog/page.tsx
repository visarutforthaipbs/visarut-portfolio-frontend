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
  Flex,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { siteConfig } from "@/lib/config";
import type { BlogPost, BlogCategory } from "@/types/wordpress";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);

        // Fetch posts
        const postsResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogPostsEndpoint}`
        );
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogCategoriesEndpoint}`
        );
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();

        setPosts(postsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

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

  if (loading) {
    return (
      <Layout>
        <Box
          py={{ base: 16, md: 24 }}
          className="full-width"
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="5xl" px={{ base: 6, md: 8 }}>
            <VStack gap={8}>
              <Spinner size="xl" color="accent.500" />
              <Text>กำลังโหลดบทความ...</Text>
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
          py={{ base: 16, md: 24 }}
          className="full-width"
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="5xl" px={{ base: 6, md: 8 }}>
            <VStack gap={4}>
              <Text fontSize="lg" color="red.500">
                เกิดข้อผิดพลาด: {error}
              </Text>
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8} textAlign="center">
            <VStack gap={4}>
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="bold"
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
              >
                บล็อก
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={{ base: "gray.600", _dark: "gray.300" }}
                maxW="600px"
                className="thai-text"
                lineHeight="1.8"
              >
                บทความ ความคิดเห็น และประสบการณ์จากการทำงานด้านสื่อ
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Blog Content */}
      <Box
        bg={{ base: "gray.50", _dark: "gray.800" }}
        py={{ base: 16, md: 20 }}
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8} align="stretch" w="full">
            {/* Category Filter */}
            {categories.length > 0 && (
              <VStack align="start" gap={4}>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color={{ base: "gray.800", _dark: "white" }}
                  className="thai-text"
                >
                  หมวดหมู่
                </Text>
                <Flex
                  gap={4}
                  wrap="wrap"
                  justify={{ base: "center", md: "start" }}
                >
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => setSelectedCategory(option.value)}
                      variant={
                        selectedCategory === option.value ? "solid" : "outline"
                      }
                      bg={
                        selectedCategory === option.value
                          ? "accent.500"
                          : "transparent"
                      }
                      color={
                        selectedCategory === option.value
                          ? "white"
                          : { base: "gray.700", _dark: "gray.200" }
                      }
                      borderColor={
                        selectedCategory === option.value
                          ? "accent.500"
                          : { base: "gray.300", _dark: "gray.600" }
                      }
                      _hover={{
                        bg:
                          selectedCategory === option.value
                            ? "accent.600"
                            : "accent.50",
                        borderColor: "accent.500",
                      }}
                      size="sm"
                      px={6}
                      py={2}
                      className="thai-text"
                    >
                      {option.label}
                    </Button>
                  ))}
                </Flex>
              </VStack>
            )}

            {/* Blog Posts Grid */}
            {filteredPosts.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {filteredPosts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    categories={categories}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <VStack gap={4} py={12} textAlign="center">
                <Text fontSize="lg" color="gray.500" className="thai-text">
                  ไม่พบบทความในหมวดหมู่นี้
                </Text>
                <Button
                  onClick={() => setSelectedCategory("all")}
                  variant="outline"
                  colorScheme="gray"
                  className="thai-text"
                >
                  ดูบทความทั้งหมด
                </Button>
              </VStack>
            )}
          </VStack>
        </Container>
      </Box>
    </Layout>
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
        {/* Featured Image */}
        {post.featured_media && (
          <Box h="200px" bg="gray.100" position="relative" overflow="hidden">
            {/* This would need featured media fetch - simplified for now */}
            <Box
              w="full"
              h="full"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.500" fontSize="sm">
                Featured Image
              </Text>
            </Box>
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
                WebkitLineClamp: 3,
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
