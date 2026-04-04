"use client";

import { useState, useEffect } from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig, wpApiUrl } from "@/lib/config";
import { sanitizeHtml } from "@/lib/sanitize";
import { getBlogPostImage, decodeHtmlEntities } from "@/utils";
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
    const controller = new AbortController();
    const fetchBlogPosts = async () => {
      try {
        const postsResponse = await fetch(
          wpApiUrl(siteConfig.api.wordpress.blogPostsEndpoint, `per_page=${maxPosts}&orderby=date&order=desc&_embed=true`),
          { signal: controller.signal }
        );
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        if (postsData.length > 0) {
          const categoriesResponse = await fetch(
            wpApiUrl(siteConfig.api.wordpress.blogCategoriesEndpoint),
            { signal: controller.signal }
          );
          if (!categoriesResponse.ok)
            throw new Error("Failed to fetch categories");
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        setPosts(postsData);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Failed to fetch blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
    return () => controller.abort();
  }, [maxPosts]);

  if (loading) {
    return (
      <section className="bg-base py-16 md:py-20 flex justify-center w-full">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <div className="flex flex-col items-center gap-8">
            <p className="text-content">กำลังโหลดบทความ...</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-base py-16 md:py-20 flex justify-center w-full">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <div className="flex flex-col items-center gap-12">
          {/* Section Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-content">
              บทความล่าสุด
            </h2>
            <p className="text-base md:text-lg text-muted max-w-[600px]">
              ความคิดเห็น ประสบการณ์ และเทคนิคการทำงานจากมุมมองของนักสื่อ
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} categories={categories} />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex items-center gap-4 mt-8">
            <Link href="/blog">
              <button className="text-lg bg-accent text-base hover:bg-[#d97706] px-6 py-3 rounded flex items-center gap-2 transition-colors">
                <span>ดูบทความทั้งหมด</span>
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    const embedded = (post as BlogPost & { _embedded?: { "wp:featuredmedia"?: WordPressFeaturedMedia[] } })._embedded;
    if (embedded?.["wp:featuredmedia"]?.[0]) {
      setFeaturedImage(embedded["wp:featuredmedia"][0].source_url);
      setImageLoading(false);
      return;
    }

    const contentImage = getBlogPostImage(null, post.content.rendered);
    setFeaturedImage(contentImage);
    setImageLoading(false);
  }, [post]);

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
    <article className="bg-surface rounded-lg border border-edge overflow-hidden hover:-translate-y-0.5 hover:bg-surface-hover transition-all">
      <div className="flex flex-col">
        {/* Featured Image */}
        <div className="h-[180px] bg-surface relative overflow-hidden flex items-center justify-center">
          {featuredImage && !imageLoading ? (
            <img
              src={featuredImage}
              alt={decodeHtmlEntities(post.title.rendered)}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setFeaturedImage(null)}
            />
          ) : (
            <span className="text-dim text-sm">
              {imageLoading ? "กำลังโหลด..." : "รูปภาพประกอบ"}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-6">
          {/* Categories */}
          {getPostCategories().length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {getPostCategories()
                .slice(0, 2)
                .map((category) => (
                  <span
                    key={category.id}
                    className="bg-accent-dim text-accent px-2 py-1 rounded-md text-xs"
                  >
                    {category.name}
                  </span>
                ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-content leading-[1.4] truncate">
            {decodeHtmlEntities(post.title.rendered)}
          </h3>

          {/* Excerpt */}
          {post.excerpt.rendered && (
            <p
              className="text-sm text-muted leading-[1.6] line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(post.excerpt.rendered.replace(/<[^>]*>/g, "")),
              }}
            />
          )}

          {/* Meta */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-4 text-xs text-dim">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatDate(post.date)}</span>
              </span>
              <span className="flex items-center gap-1">
                <User size={12} />
                <span>{siteConfig.authorTh}</span>
              </span>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <button className="text-sm text-accent hover:bg-accent-dim px-4 py-2 w-full rounded transition-colors">
                อ่านเพิ่มเติม
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
