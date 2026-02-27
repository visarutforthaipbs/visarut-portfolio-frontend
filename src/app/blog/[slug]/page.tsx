import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import type { BlogPost, WordPressFeaturedMedia, BlogCategory } from "@/types/wordpress";
import { getBlogPostImage } from "@/utils";
import BlogPostClient from "./BlogPostClient";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const postResponse = await fetch(
      `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogPostsEndpoint}?slug=${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!postResponse.ok) return null;
    const postData = await postResponse.json();
    if (postData.length === 0) return null;
    return postData[0];
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getCategories(): Promise<BlogCategory[]> {
  try {
    const response = await fetch(
      `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogCategoriesEndpoint}`,
      { next: { revalidate: 3600 } }
    );
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
  return [];
}

async function getFeaturedImage(mediaId: number): Promise<string | null> {
  if (!mediaId) return null;
  try {
    const mediaResponse = await fetch(
      `${siteConfig.api.wordpress.baseUrl}/media/${mediaId}`,
      { next: { revalidate: 3600 } }
    );
    if (mediaResponse.ok) {
      const media: WordPressFeaturedMedia = await mediaResponse.json();
      return media.media_details?.sizes?.large?.source_url || media.source_url;
    }
  } catch (error) {
    console.warn("Failed to fetch featured media:", error);
  }
  return null;
}

// Server-side metadata generation for SEO and social sharing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  let featuredImageUrl = await getFeaturedImage(post.featured_media);

  if (!featuredImageUrl) {
    featuredImageUrl = getBlogPostImage(null, post.content.rendered);
  }

  const description =
    post.excerpt.rendered
      .replace(/<[^>]*>/g, "")
      .trim()
      .slice(0, 160) || post.title.rendered;

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.title.rendered,
    description,
    openGraph: {
      title: post.title.rendered,
      url: postUrl,
      siteName: siteConfig.titleTh,
      images: featuredImageUrl
        ? [
            {
              url: featuredImageUrl,
              width: 1200,
              height: 630,
              alt: post.title.rendered,
            },
          ]
        : [
            {
              url: `${siteConfig.url}/blog/${post.slug}/opengraph-image`,
              width: 1200,
              height: 630,
              alt: post.title.rendered,
            },
          ],
      locale: "th_TH",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [siteConfig.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      images: featuredImageUrl
        ? [featuredImageUrl]
        : [`${siteConfig.url}/blog/${post.slug}/opengraph-image`],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

// Server component
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const categories = await getCategories();
  const featuredImageUrl = await getFeaturedImage(post.featured_media);
  
  const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title.rendered,
    description: description,
    image: featuredImageUrl || `${siteConfig.url}/placeholder-image.jpg`,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      "@type": "Person",
      name: siteConfig.authorTh,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.authorTh,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogPostClient 
        slug={slug} 
        initialPost={post} 
        initialCategories={categories} 
      />
    </>
  );
}
