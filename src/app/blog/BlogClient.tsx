"use client";

import { useState } from "react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { sanitizeHtml } from "@/lib/sanitize";
import { getBlogPostImage, decodeHtmlEntities } from "@/utils";
import type {
  BlogPost,
  BlogCategory,
  WordPressFeaturedMedia,
} from "@/types/wordpress";

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialCategories: BlogCategory[];
}

export default function BlogClient({ initialPosts, initialCategories }: BlogClientProps) {
  const posts = initialPosts;
  const categories = initialCategories;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  return (
    <Layout>
      {/* Hero */}
      <section
        className="bg-base py-20 md:py-28 flex justify-center w-full"
        role="region"
        aria-label="บล็อก"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-5 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-content tracking-tight">
              บล็อก
            </h1>
            <p className="text-base md:text-lg text-muted leading-[1.8]">
              บทความ ความคิดเห็น และประสบการณ์จากการทำงานด้านสื่อ
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-base" aria-hidden="true">
        <div className="w-[60px] h-px bg-edge" />
      </div>

      {/* Content */}
      <section
        className="bg-base py-16 md:py-24 flex justify-center w-full"
        role="region"
        aria-label="รายการบทความ"
      >
        <div className="max-w-5xl mx-auto px-5 md:px-6 w-full">
          <div className="flex flex-col gap-8 w-full">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex items-center gap-3 justify-center flex-wrap" role="tablist" aria-label="ตัวกรองหมวดหมู่">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedCategory(option.value)}
                    className={`text-sm transition-colors duration-150 bg-transparent border-none cursor-pointer ${
                      selectedCategory === option.value
                        ? "text-content"
                        : "text-dim hover:text-content"
                    }`}
                    role="tab"
                    aria-selected={selectedCategory === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {/* Blog Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <button
                  className="text-sm text-dim hover:text-content cursor-pointer bg-transparent border-none transition-colors"
                  onClick={() => setSelectedCategory("all")}
                >
                  ไม่พบบทความ — ดูทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const embedded = (post as BlogPost & { _embedded?: { "wp:featuredmedia"?: WordPressFeaturedMedia[] } })._embedded;
  const embeddedImage = embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const featuredImage = embeddedImage || getBlogPostImage(null, post.content.rendered);

  return (
    <Link href={`/blog/${post.slug}`} aria-label={post.title.rendered.replace(/<[^>]*>/g, '')}>
      <article className="cursor-pointer group">
        {/* Image */}
        <div className="h-[200px] bg-surface overflow-hidden rounded-md flex items-center justify-center">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={decodeHtmlEntities(post.title.rendered)}
              className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-85"
              loading="lazy"
            />
          ) : (
            <span className="text-dim text-xs" />
          )}
        </div>

        <div className="flex flex-col items-start gap-1.5 mt-3">
          <h2 className="text-base md:text-lg font-semibold text-content leading-[1.4] line-clamp-2">
            {decodeHtmlEntities(post.title.rendered)}
          </h2>

          <div className="flex items-center gap-2 text-xs text-dim">
            <span>
              {new Date(post.date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {post.excerpt.rendered && (
            <span
              className="text-xs text-muted leading-[1.6] line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(post.excerpt.rendered.replace(/<[^>]*>/g, "")),
              }}
            />
          )}
        </div>
      </article>
    </Link>
  );
}
