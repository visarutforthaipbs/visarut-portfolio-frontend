"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { siteConfig, wpApiUrl } from "@/lib/config";
import { sanitizeHtml } from "@/lib/sanitize";
import { decodeHtmlEntities } from "@/utils";
import AdSense from "@/components/AdSense";
import type { BlogPost } from "@/types/wordpress";
import { calculateCognitiveCost, countWords } from "@/utils/cognitiveCost";
import {
  CognitivePriceTag,
  AttentionProgressBar,
} from "@/components/signal39";

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

  const cognitiveCost = useMemo(() => {
    if (!post) return null;
    const words = countWords(post.content.rendered);
    return calculateCognitiveCost(words);
  }, [post]);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 md:py-28 flex justify-center w-full">
          <div className="max-w-3xl mx-auto px-5 md:px-6">
            <div className="flex flex-col gap-6 items-start">
              <div className="h-8 w-3/5 animate-pulse bg-surface rounded" />
              <div className="h-4 w-[30%] animate-pulse bg-surface rounded" />
              <div className="h-[300px] w-full animate-pulse bg-surface rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="py-20 md:py-28 flex justify-center w-full">
          <div className="max-w-3xl mx-auto px-5 md:px-6">
            <div className="flex flex-col gap-4 text-center">
              <span className="text-sm text-muted">
                {error || "ไม่พบบทความ"}
              </span>
              <Link href="/blog">
                <span className="text-sm text-dim hover:text-content transition-colors">
                  ← กลับไปบล็อก
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {cognitiveCost && <AttentionProgressBar cost={cognitiveCost} />}
      <article className="bg-base py-12 md:py-28 flex justify-center w-full">
        <div className="max-w-3xl mx-auto px-4 md:px-6 w-full overflow-hidden">
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Back */}
            <div className="w-full">
              <Link href="/blog">
                <span className="text-sm text-dim hover:text-content transition-colors duration-150">
                  ← บล็อก
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-4 w-full text-center">
              <h1 className="text-xl md:text-3xl font-bold text-content leading-[1.4] md:leading-[1.3] tracking-tight break-words">
                {decodeHtmlEntities(post.title.rendered)}
              </h1>

              <span className="text-xs text-dim">
                {new Date(post.date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>

              {cognitiveCost && (
                <div className="flex justify-center">
                  <CognitivePriceTag cost={cognitiveCost} />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-[60px] h-px bg-edge mx-auto" />

            {/* Ad — below title */}
            <AdSense slot="6029713036" format="auto" />

            {/* Content */}
            <div
              className="w-full wordpress-content overflow-hidden"
              style={{
                // Using inline styles for wordpress content since these are
                // deeply nested selectors that work better with CSS-in-JS
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content.rendered) }}
            />

            {/* Ad — after article */}
            <AdSense slot="6029713036" format="auto" />


          </div>
        </div>
      </article>
    </Layout>
  );
}
