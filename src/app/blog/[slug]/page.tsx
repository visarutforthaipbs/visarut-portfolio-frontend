import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import type { BlogPost, WordPressFeaturedMedia } from "@/types/wordpress";
import { getBlogPostImage } from "@/utils";
import BlogPostClient from "./BlogPostClient";

// Server-side metadata generation for SEO and social sharing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    // Fetch post data
    const postResponse = await fetch(
      `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogPostsEndpoint}?slug=${resolvedParams.slug}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!postResponse.ok) {
      console.error(
        `Failed to fetch post: ${postResponse.status} ${postResponse.statusText}`
      );
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const postData = await postResponse.json();
    if (postData.length === 0) {
      console.error(`No post found for slug: ${resolvedParams.slug}`);
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const post: BlogPost = postData[0];
    console.log(
      `Generating metadata for post: ${post.title.rendered}, Featured media ID: ${post.featured_media}`
    );

    // Get featured image
    let featuredImageUrl = null;
    if (post.featured_media) {
      try {
        const mediaResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}/media/${post.featured_media}`,
          { next: { revalidate: 3600 } }
        );
        if (mediaResponse.ok) {
          const media: WordPressFeaturedMedia = await mediaResponse.json();
          // Use large size for better social sharing, fallback to source_url
          featuredImageUrl =
            media.media_details?.sizes?.large?.source_url || media.source_url;
          console.log(`Featured image URL: ${featuredImageUrl}`);
        } else {
          console.error(
            `Failed to fetch media: ${mediaResponse.status} ${mediaResponse.statusText}`
          );
        }
      } catch (error) {
        console.warn("Failed to fetch featured media:", error);
      }
    } else {
      console.log("No featured media ID found for post");
    }

    // Fallback to first image in content if no featured image
    if (!featuredImageUrl) {
      featuredImageUrl = getBlogPostImage(null, post.content.rendered);
    }

    // Clean excerpt for description
    const description =
      post.excerpt.rendered
        .replace(/<[^>]*>/g, "") // Strip HTML
        .trim()
        .slice(0, 160) || // Limit to 160 chars for meta description
      post.title.rendered;

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
                url: `${siteConfig.url}/blog/${post.slug}/opengraph-image`, // Blog-specific OG image
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
  } catch (error) {
    console.error("Error generating blog post metadata:", error);
    return {
      title: "Blog Post",
      description: "Blog content from Visarut Sankham",
    };
  }
}

// Server component that renders the client component
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  // We can optionally pre-fetch data here for better performance
  // For now, we'll let the client component handle the data fetching
  return <BlogPostClient slug={resolvedParams.slug} />;
}
