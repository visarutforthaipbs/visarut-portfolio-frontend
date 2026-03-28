import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import { siteConfig, wpApiUrl } from "@/lib/config";
import { generateSEO } from "@/lib/seo";
import type { BlogPost, BlogCategory } from "@/types/wordpress";

export const metadata: Metadata = generateSEO({
  title: "บล็อก",
  description: "บทความ ความคิดเห็น และประสบการณ์จากการทำงานด้านสื่อ โดย วิศรุต แสนคำ",
  url: "/blog",
});

async function getBlogData() {
  try {
    // Fetch posts with embedded media
    const postsResponse = await fetch(
      wpApiUrl(siteConfig.api.wordpress.blogPostsEndpoint, '_embed=true'),
      { next: { revalidate: 3600 } }
    );
    const posts: BlogPost[] = await postsResponse.json();

    // Fetch categories
    const categoriesResponse = await fetch(
      wpApiUrl(siteConfig.api.wordpress.blogCategoriesEndpoint),
      { next: { revalidate: 3600 } }
    );
    const categories: BlogCategory[] = await categoriesResponse.json();

    return { posts, categories };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return { posts: [], categories: [] };
  }
}

export default async function BlogPage() {
  const { posts, categories } = await getBlogData();

  return <BlogClient initialPosts={posts} initialCategories={categories} />;
}
