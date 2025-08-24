"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { siteConfig } from "@/lib/config";
import type { BlogPost, BlogCategory } from "@/types/wordpress";

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);

        const postResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogPostsEndpoint}?slug=${slug}`
        );
        if (!postResponse.ok) throw new Error("Failed to fetch post");
        const postData = await postResponse.json();

        if (postData.length === 0) {
          setError("Post not found");
          return;
        }

        const currentPost: BlogPost = postData[0];
        setPost(currentPost);

        // Fetch categories
        const categoriesResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogCategoriesEndpoint}`
        );
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <Container maxW="3xl" py={20}>
          <VStack gap={4}>
            <Spinner size="xl" color="accent.500" />
            <Text>Loading blog post...</Text>
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <Container maxW="3xl" py={20}>
          <VStack gap={4}>
            <Text fontSize="xl" color="red.500">
              {error || "Post not found"}
            </Text>
            <Link href="/blog">
              <Text color="accent.500">← Back to Blog</Text>
            </Link>
          </VStack>
        </Container>
      </Layout>
    );
  }

  const postCategories = post.categories
    ?.map((catId) => categories.find((cat) => cat.id === catId))
    .filter(Boolean) as BlogCategory[];

  return (
    <Layout>
      <Box
        py={{ base: 16, md: 24 }}
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8}>
            {/* Back Link */}
            <Box w="full">
              <Link href="/blog">
                <HStack
                  gap={2}
                  color="accent.500"
                  _hover={{ color: "accent.600" }}
                  cursor="pointer"
                  fontSize="sm"
                >
                  <ArrowLeft size={16} />
                  <Text>Back to Blog</Text>
                </HStack>
              </Link>
            </Box>

            {/* Post Content */}
            <VStack gap={6} w="full">
              {/* Title */}
              <Heading
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                textAlign="center"
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
                lineHeight="1.2"
              >
                {post.title.rendered}
              </Heading>

              {/* Meta Info */}
              <HStack
                gap={4}
                justify="center"
                flexWrap="wrap"
                fontSize="sm"
                color={{ base: "gray.600", _dark: "gray.400" }}
              >
                <HStack gap={1}>
                  <Calendar size={16} />
                  <Text>
                    {new Date(post.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </HStack>
                <HStack gap={1}>
                  <User size={16} />
                  <Text>{siteConfig.authorTh}</Text>
                </HStack>
              </HStack>

              {/* Categories */}
              {postCategories && postCategories.length > 0 && (
                <HStack gap={2} justify="center" flexWrap="wrap">
                  {postCategories.map((category) => (
                    <Badge
                      key={category.id}
                      colorScheme="accent"
                      variant="subtle"
                      fontSize="xs"
                      className="thai-text"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </HStack>
              )}

              {/* Post Content */}
              <Box
                w="full"
                className="wordpress-content"
                css={{
                  "& p": {
                    marginBottom: "1.5rem",
                    lineHeight: "1.8",
                    fontSize: "1.125rem",
                    textAlign: "justify",
                  },
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    marginTop: "2.5rem",
                    marginBottom: "1.5rem",
                    fontWeight: "bold",
                    textAlign: "left",
                  },
                  "& h1": { fontSize: "2rem" },
                  "& h2": { fontSize: "1.75rem" },
                  "& h3": { fontSize: "1.5rem" },
                  "& h4": { fontSize: "1.25rem" },
                  "& ul, & ol": {
                    paddingLeft: "2rem",
                    marginBottom: "1.5rem",
                  },
                  "& li": {
                    marginBottom: "0.75rem",
                    lineHeight: "1.7",
                  },
                  "& blockquote": {
                    borderLeft: "4px solid #3182ce",
                    paddingLeft: "1.5rem",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    margin: "2rem 0",
                    fontStyle: "italic",
                    backgroundColor: "#f7fafc",
                    borderRadius: "0.5rem",
                  },
                  // Center all images and media
                  "& img": {
                    display: "block",
                    margin: "2rem auto",
                    borderRadius: "0.75rem",
                    maxWidth: "100%",
                    height: "auto",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  },
                  // Style for WordPress image captions
                  "& .wp-caption, & figcaption, & .wp-caption-text": {
                    textAlign: "center",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    fontStyle: "italic",
                    marginTop: "0.5rem",
                    marginBottom: "2rem",
                    lineHeight: "1.5",
                  },
                  "& .wp-caption": {
                    margin: "2rem auto",
                    display: "block",
                    textAlign: "center",
                  },
                  "& .wp-caption img": {
                    margin: "0 auto 0.5rem auto",
                  },
                  // Center embedded content (videos, iframes)
                  "& iframe, & video, & embed, & object": {
                    display: "block",
                    margin: "2rem auto",
                    maxWidth: "100%",
                    borderRadius: "0.75rem",
                  },
                  // Style for WordPress galleries
                  "& .wp-block-gallery, & .gallery": {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    justifyContent: "center",
                    margin: "2rem 0",
                  },
                  "& .wp-block-gallery figure, & .gallery-item": {
                    margin: "0",
                    textAlign: "center",
                  },
                  // Links styling
                  "& a": {
                    color: "#3182ce",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#2c5aa0",
                      textDecoration: "none",
                    },
                  },
                  // Table styling
                  "& table": {
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "2rem 0",
                    fontSize: "1rem",
                  },
                  "& th, & td": {
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                  },
                  "& th": {
                    fontWeight: "bold",
                    backgroundColor: "#f9fafb",
                  },
                  // Code blocks
                  "& pre": {
                    backgroundColor: "#1f2937",
                    color: "#f9fafb",
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    overflow: "auto",
                    margin: "2rem 0",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  },
                  "& code": {
                    backgroundColor: "#f3f4f6",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                  },
                  "& pre code": {
                    backgroundColor: "transparent",
                    padding: "0",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
