"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  AspectRatio,
} from "@chakra-ui/react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { siteConfig } from "@/lib/config";
import type { BlogPost, BlogCategory } from "@/types/wordpress";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);

        // Fetch post by slug
        const postResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogPostsEndpoint}?slug=${slug}`
        );
        if (!postResponse.ok) throw new Error("Failed to fetch post");
        const postData = await postResponse.json();

        if (postData.length === 0) {
          throw new Error("Post not found");
        }

        // Fetch categories
        const categoriesResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogCategoriesEndpoint}`
        );
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();

        setPost(postData[0]);
        setCategories(categoriesData);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPostCategories = () => {
    if (!post) return [];
    return post.categories
      .map((catId) => categories.find((cat) => cat.id === catId))
      .filter(Boolean) as BlogCategory[];
  };

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
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <VStack gap={8}>
              <Spinner size="xl" color="accent.500" />
              <Text>กำลังโหลดบทความ...</Text>
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  if (error || !post) {
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
            <VStack gap={4}>
              <Text fontSize="lg" color="red.500">
                {error || "ไม่พบบทความ"}
              </Text>
              <Link href="/blog">
                <HStack gap={2} color="accent.500">
                  <ArrowLeft size={16} />
                  <Text>กลับไปยังบล็อก</Text>
                </HStack>
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
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" px={{ base: 6, md: 8 }}>
          <VStack gap={12} align="stretch">
            {/* Back Button */}
            <Link href="/blog">
              <HStack
                gap={2}
                color="accent.500"
                _hover={{ color: "accent.600" }}
                w="fit-content"
              >
                <ArrowLeft size={16} />
                <Text className="thai-text">กลับไปยังบล็อก</Text>
              </HStack>
            </Link>

            {/* Article Header */}
            <VStack gap={8} align="stretch" textAlign="center">
              {/* Categories */}
              {getPostCategories().length > 0 && (
                <HStack gap={2} wrap="wrap" justify="center">
                  {getPostCategories().map((category) => (
                    <Badge
                      key={category.id}
                      bg="accent.100"
                      color="accent.700"
                      px={4}
                      py={2}
                      borderRadius="full"
                      fontSize="sm"
                      className="thai-text"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </HStack>
              )}

              {/* Title */}
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="bold"
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
                lineHeight="1.1"
                maxW="4xl"
                mx="auto"
              >
                {post.title.rendered}
              </Heading>

              {/* Meta */}
              <HStack
                gap={8}
                fontSize="md"
                color="gray.500"
                wrap="wrap"
                justify="center"
              >
                <HStack gap={2}>
                  <Calendar size={18} />
                  <Text className="thai-text">{formatDate(post.date)}</Text>
                </HStack>
                <HStack gap={2}>
                  <User size={18} />
                  <Text className="thai-text">{siteConfig.authorTh}</Text>
                </HStack>
                {post.modified !== post.date && (
                  <Text className="thai-text">
                    อัปเดต: {formatDate(post.modified)}
                  </Text>
                )}
              </HStack>
            </VStack>

            {/* Featured Image */}
            {post.featured_media && (
              <Box w="full" maxW="5xl" mx="auto">
                <AspectRatio ratio={16 / 9} w="full">
                  <Box
                    bg="gray.100"
                    borderRadius="xl"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    shadow="lg"
                  >
                    <Text color="gray.500" className="thai-text" fontSize="lg">
                      รูปภาพประกอบ
                    </Text>
                  </Box>
                </AspectRatio>
              </Box>
            )}

            {/* Article Content */}
            <Box className="blog-content" maxW="4xl" mx="auto">
              <style jsx>{`
                .blog-content :global(p) {
                  margin-bottom: 2rem;
                  line-height: 1.8;
                  font-size: 1.25rem;
                  color: #374151;
                  text-align: justify;
                }
                .blog-content :global(h1),
                .blog-content :global(h2),
                .blog-content :global(h3),
                .blog-content :global(h4),
                .blog-content :global(h5),
                .blog-content :global(h6) {
                  margin-top: 3rem;
                  margin-bottom: 1.5rem;
                  font-weight: 700;
                  color: #1f2937;
                  line-height: 1.3;
                }
                .blog-content :global(h1) {
                  font-size: 2.5rem;
                  border-bottom: 3px solid #6b7280;
                  padding-bottom: 0.5rem;
                }
                .blog-content :global(h2) {
                  font-size: 2rem;
                  border-bottom: 2px solid #9ca3af;
                  padding-bottom: 0.5rem;
                }
                .blog-content :global(h3) {
                  font-size: 1.5rem;
                  color: #4b5563;
                }
                .blog-content :global(h4) {
                  font-size: 1.25rem;
                  color: #6b7280;
                }
                .blog-content :global(ul),
                .blog-content :global(ol) {
                  padding-left: 2.5rem;
                  margin-bottom: 2rem;
                  line-height: 1.8;
                }
                .blog-content :global(li) {
                  margin-bottom: 0.75rem;
                  line-height: 1.8;
                  font-size: 1.125rem;
                  color: #374151;
                }
                .blog-content :global(blockquote) {
                  border-left: 4px solid #6b7280;
                  background: #f9fafb;
                  padding: 1.5rem 2rem;
                  margin: 2.5rem 0;
                  font-style: italic;
                  color: #4b5563;
                  border-radius: 0.5rem;
                  font-size: 1.125rem;
                  line-height: 1.7;
                }
                .blog-content :global(img) {
                  border-radius: 1rem;
                  margin: 3rem auto;
                  max-width: 100%;
                  height: auto;
                  display: block;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                .blog-content :global(a) {
                  color: #6b7280;
                  text-decoration: underline;
                  font-weight: 500;
                  transition: color 0.2s;
                }
                .blog-content :global(a:hover) {
                  color: #4b5563;
                }
                .blog-content :global(figure) {
                  margin: 3rem 0;
                  text-align: center;
                }
                .blog-content :global(figcaption) {
                  margin-top: 1rem;
                  font-size: 0.875rem;
                  color: #6b7280;
                  font-style: italic;
                  text-align: center;
                }
                .blog-content :global(.wp-block-gallery) {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                  gap: 1.5rem;
                  margin: 3rem 0;
                }
                .blog-content :global(.wp-block-image) {
                  margin: 2rem 0;
                }
                .blog-content :global(.wp-block-image img) {
                  margin: 0 auto;
                }
                .blog-content :global(strong) {
                  font-weight: 600;
                  color: #1f2937;
                }
                .blog-content :global(em) {
                  font-style: italic;
                  color: #4b5563;
                }
                .blog-content :global(code) {
                  background: #f3f4f6;
                  padding: 0.25rem 0.5rem;
                  border-radius: 0.25rem;
                  font-family: "SF Mono", "Monaco", "Cascadia Code", monospace;
                  font-size: 0.875rem;
                  color: #1f2937;
                }
                .blog-content :global(pre) {
                  background: #1f2937;
                  color: #f9fafb;
                  padding: 1.5rem;
                  border-radius: 0.75rem;
                  overflow-x: auto;
                  margin: 2rem 0;
                  font-family: "SF Mono", "Monaco", "Cascadia Code", monospace;
                }
                .blog-content :global(pre code) {
                  background: transparent;
                  padding: 0;
                  color: inherit;
                }
                .blog-content :global(table) {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 2rem 0;
                  border-radius: 0.5rem;
                  overflow: hidden;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .blog-content :global(th),
                .blog-content :global(td) {
                  padding: 1rem;
                  text-align: left;
                  border-bottom: 1px solid #e5e7eb;
                }
                .blog-content :global(th) {
                  background: #f9fafb;
                  font-weight: 600;
                  color: #1f2937;
                }
                .blog-content :global(hr) {
                  border: none;
                  height: 1px;
                  background: linear-gradient(
                    to right,
                    transparent,
                    #e5e7eb,
                    transparent
                  );
                  margin: 3rem 0;
                }
                @media (max-width: 768px) {
                  .blog-content :global(p) {
                    font-size: 1.125rem;
                    margin-bottom: 1.5rem;
                  }
                  .blog-content :global(h1) {
                    font-size: 2rem;
                  }
                  .blog-content :global(h2) {
                    font-size: 1.75rem;
                  }
                  .blog-content :global(h3) {
                    font-size: 1.375rem;
                  }
                  .blog-content :global(ul),
                  .blog-content :global(ol) {
                    padding-left: 1.5rem;
                  }
                  .blog-content :global(blockquote) {
                    margin: 2rem 0;
                    padding: 1rem 1.5rem;
                  }
                  .blog-content :global(img) {
                    margin: 2rem auto;
                  }
                }
              `}</style>
              <div
                className="thai-text"
                dangerouslySetInnerHTML={{
                  __html: post.content.rendered,
                }}
              />
            </Box>

            {/* Article Footer */}
            <VStack
              gap={6}
              pt={12}
              mt={8}
              borderTop="2px solid"
              borderColor="gray.100"
              textAlign="center"
            >
              <VStack gap={4}>
                <Text
                  fontSize="lg"
                  color="gray.600"
                  className="thai-text"
                  maxW="2xl"
                  lineHeight="1.7"
                >
                  หากคุณพบว่าบทความนี้มีประโยชน์ อย่าลืมแชร์ให้เพื่อนๆ
                  ได้อ่านกันนะครับ
                </Text>

                <Box
                  bg="accent.50"
                  px={8}
                  py={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="accent.200"
                >
                  <Text
                    fontSize="md"
                    color="accent.700"
                    className="thai-text"
                    fontWeight="500"
                  >
                    💡 ติดตามบทความใหม่ๆ ได้ที่หน้าบล็อกของเรา
                  </Text>
                </Box>
              </VStack>

              <Link href="/blog">
                <HStack
                  gap={2}
                  color="accent.500"
                  fontSize="lg"
                  fontWeight="500"
                  px={6}
                  py={3}
                  borderRadius="lg"
                  bg="accent.50"
                  _hover={{
                    color: "accent.600",
                    bg: "accent.100",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s"
                >
                  <ArrowLeft size={20} />
                  <Text className="thai-text">อ่านบทความอื่นๆ</Text>
                </HStack>
              </Link>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
