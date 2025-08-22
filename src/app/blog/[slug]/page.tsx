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
  Image,
} from "@chakra-ui/react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { siteConfig } from "@/lib/config";
import { getBlogPostImage, getWordPressMediaUrl } from "@/utils";
import type {
  BlogPost,
  BlogCategory,
  WordPressFeaturedMedia,
} from "@/types/wordpress";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
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
          throw new Error("Post not found");
        }

        const categoriesResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogCategoriesEndpoint}`
        );
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();

        setPost(postData[0]);
        setCategories(categoriesData);

        const currentPost = postData[0];
        setImageLoading(true);

        if (currentPost.featured_media && currentPost.featured_media > 0) {
          try {
            const mediaResponse = await fetch(
              getWordPressMediaUrl(siteConfig.api.wordpress.baseUrl, currentPost.featured_media)
            );

            if (mediaResponse.ok) {
              const mediaData: WordPressFeaturedMedia = await mediaResponse.json();
              setFeaturedImage(mediaData.source_url);
              setImageLoading(false);
              return;
            }
          } catch (error) {
            console.error("Failed to fetch featured media:", error);
          }
        }

        const contentImage = getBlogPostImage(null, currentPost.content.rendered);
        setFeaturedImage(contentImage);
        setImageLoading(false);
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
        <Box py={{ base: 16, md: 24 }} className="full-width" display="flex" justifyContent="center" w="100%">
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
        <Box py={{ base: 16, md: 24 }} className="full-width" display="flex" justifyContent="center" w="100%">
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
      <Box bg={{ base: "white", _dark: "gray.900" }} py={{ base: 16, md: 24 }} className="full-width" display="flex" justifyContent="center" w="100%">
        <Container maxW="4xl" px={{ base: 6, md: 8 }}>
          <VStack gap={16} align="stretch">
            <Link href="/blog">
              <HStack gap={2} color="accent.500" _hover={{ color: "accent.600" }} w="fit-content">
                <ArrowLeft size={16} />
                <Text className="thai-text">กลับไปยังบล็อก</Text>
              </HStack>
            </Link>

            <VStack gap={8} align="stretch" textAlign="center">
              {getPostCategories().length > 0 && (
                <HStack gap={2} wrap="wrap" justify="center">
                  {getPostCategories().map((category) => (
                    <Badge key={category.id} bg="accent.100" color="accent.700" px={4} py={2} borderRadius="full" fontSize="sm" className="thai-text">
                      {category.name}
                    </Badge>
                  ))}
                </HStack>
              )}

              <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold" color={{ base: "gray.800", _dark: "white" }} className="thai-text" lineHeight="1.1" maxW="4xl" mx="auto">
                {post.title.rendered}
              </Heading>

              <HStack gap={8} fontSize="md" color="gray.500" wrap="wrap" justify="center">
                <HStack gap={2}>
                  <Calendar size={18} />
                  <Text className="thai-text">{formatDate(post.date)}</Text>
                </HStack>
                <HStack gap={2}>
                  <User size={18} />
                  <Text className="thai-text">{siteConfig.authorTh}</Text>
                </HStack>
                {post.modified !== post.date && (
                  <Text className="thai-text">อัปเดต: {formatDate(post.modified)}</Text>
                )}
              </HStack>
            </VStack>

            {featuredImage && !imageLoading && (
              <Box w="full" maxW="4xl" mx="auto" mb={8}>
                <AspectRatio ratio={16 / 9} w="full">
                  <Image src={featuredImage} alt={post.title.rendered} w="full" h="full" objectFit="cover" borderRadius="2xl" shadow="2xl" onError={() => setFeaturedImage(null)} />
                </AspectRatio>
              </Box>
            )}

            <Box className="blog-content thai-text" maxW="4xl" mx="auto" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

            <VStack gap={6} pt={12} mt={8} borderTop="2px solid" borderColor="gray.100" textAlign="center">
              <VStack gap={4}>
                <Text fontSize="lg" color="gray.600" className="thai-text" maxW="2xl" lineHeight="1.7">
                  หากคุณพบว่าบทความนี้มีประโยชน์ อย่าลืมแชร์ให้เพื่อนๆ ได้อ่านกันนะครับ
                </Text>
                <Box bg="accent.50" px={8} py={4} borderRadius="xl" border="1px solid" borderColor="accent.200">
                  <Text fontSize="md" color="accent.700" className="thai-text" fontWeight="500">
                    💡 ติดตามบทความใหม่ๆ ได้ที่หน้าบล็อกของเรา
                  </Text>
                </Box>
              </VStack>
              <Link href="/blog">
                <HStack gap={2} color="accent.500" fontSize="lg" fontWeight="500" px={6} py={3} borderRadius="lg" bg="accent.50" _hover={{ color: "accent.600", bg: "accent.100", transform: "translateY(-1px)" }} transition="all 0.2s">
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
