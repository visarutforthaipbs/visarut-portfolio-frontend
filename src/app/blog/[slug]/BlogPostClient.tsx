"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { siteConfig, wpApiUrl } from "@/lib/config";
import { sanitizeHtml } from "@/lib/sanitize";
import { decodeHtmlEntities } from "@/utils";
import AdSense from "@/components/AdSense";
import type { BlogPost } from "@/types/wordpress";
import { T } from "@/lib/tokens";

interface BlogPostClientProps {
  slug: string;
  initialPost?: BlogPost;
}

export default function BlogPostClient({ slug, initialPost }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlogPost = async () => {
      if (!slug || initialPost) return;
      try {
        setLoading(true);
        const postResponse = await fetch(
          wpApiUrl(siteConfig.api.wordpress.blogPostsEndpoint, `slug=${slug}`),
          { signal: controller.signal }
        );
        if (!postResponse.ok) throw new Error("Failed to fetch post");
        const postData = await postResponse.json();

        if (postData.length === 0) {
          setError("Post not found");
          return;
        }

        const currentPost: BlogPost = postData[0];
        setPost(currentPost);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
    return () => controller.abort();
  }, [slug, initialPost]);

  if (loading) {
    return (
      <Layout>
        <Box py={{ base: 20, md: 28 }} display="flex" justifyContent="center" w="100%">
          <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
            <VStack gap={6} align="start">
              <Skeleton height="32px" width="60%" />
              <Skeleton height="16px" width="30%" />
              <Skeleton height="300px" width="100%" />
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <Box py={{ base: 20, md: 28 }} display="flex" justifyContent="center" w="100%">
          <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
            <VStack gap={4} textAlign="center">
              <Text fontSize="sm" color={T.textMuted}>
                {error || "ไม่พบบทความ"}
              </Text>
              <Link href="/blog">
                <Text fontSize="sm" color={T.textDim} _hover={{ color: T.text }}>
                  ← กลับไปบล็อก
                </Text>
              </Link>
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        as="article"
        bg={T.bg}
        py={{ base: 20, md: 28 }}
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8}>
            {/* Back */}
            <Box w="full">
              <Link href="/blog">
                <Text
                  fontSize="sm"
                  color={T.textDim}
                  _hover={{ color: T.text }}
                  transition="color 0.15s"
                >
                  ← บล็อก
                </Text>
              </Link>
            </Box>

            {/* Header */}
            <VStack gap={4} w="full" textAlign="center">
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color={T.text}
                lineHeight="1.3"
                letterSpacing="-0.025em"
              >
                {decodeHtmlEntities(post.title.rendered)}
              </Heading>

              <Text
                fontSize="xs"
                color={T.textDim}
              >
                {new Date(post.date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </VStack>

            {/* Divider */}
            <Box w="60px" h="1px" bg={T.border} />

            {/* Ad — below title */}
            <AdSense slot="REPLACE_WITH_AD_SLOT_1" format="auto" />

            {/* Content */}
            <Box
              w="full"
              className="wordpress-content"
              css={{
                "& p": {
                  marginBottom: "1.5rem",
                  lineHeight: "1.8",
                  fontSize: "1rem",
                },
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  fontWeight: "600",
                },
                "& h1": { fontSize: "1.75rem" },
                "& h2": { fontSize: "1.5rem" },
                "& h3": { fontSize: "1.25rem" },
                "& h4": { fontSize: "1.125rem" },
                "& ul, & ol": {
                  paddingLeft: "1.5rem",
                  marginBottom: "1.5rem",
                  listStylePosition: "outside",
                },
                "& ul": { listStyleType: "disc" },
                "& ol": { listStyleType: "decimal" },
                "& li": {
                  marginBottom: "0.5rem",
                  lineHeight: "1.7",
                },
                "& blockquote": {
                  borderLeft: "2px solid",
                  borderColor: T.border,
                  paddingLeft: "1.25rem",
                  margin: "2rem 0",
                  fontStyle: "italic",
                  color: T.textMuted,
                },
                "& img": {
                  display: "block",
                  margin: "2rem auto",
                  borderRadius: "0.375rem",
                  maxWidth: "100%",
                  height: "auto",
                },
                "& .wp-caption, & figcaption, & .wp-caption-text": {
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: T.textDim,
                  marginTop: "0.5rem",
                  marginBottom: "2rem",
                },
                "& iframe, & video, & embed, & object": {
                  display: "block",
                  margin: "2rem auto",
                  maxWidth: "100%",
                  borderRadius: "0.375rem",
                },
                "& a": {
                  color: T.accent,
                  textDecoration: "underline",
                  "&:hover": {
                    color: T.text,
                  },
                },
                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                  margin: "2rem 0",
                  fontSize: "0.875rem",
                },
                "& th, & td": {
                  padding: "0.5rem",
                  textAlign: "left",
                  borderBottom: `1px solid ${T.border}`,
                },
                "& pre": {
                  backgroundColor: T.surface,
                  padding: "1.25rem",
                  borderRadius: "0.375rem",
                  overflow: "auto",
                  margin: "2rem 0",
                  fontSize: "0.8125rem",
                  lineHeight: "1.5",
                },
                "& code": {
                  backgroundColor: T.surface,
                  padding: "0.125rem 0.375rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.8125rem",
                  fontFamily: "monospace",
                },
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content.rendered) }}
            />

            {/* Ad — after article */}
            <AdSense slot="REPLACE_WITH_AD_SLOT_2" format="auto" />
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
