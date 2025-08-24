import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";
import type { BlogPost, WordPressFeaturedMedia } from "@/types/wordpress";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  try {
    // Fetch post data
    const postResponse = await fetch(
      `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.blogPostsEndpoint}?slug=${resolvedParams.slug}`,
      { next: { revalidate: 3600 } }
    );

    let post: BlogPost | null = null;
    let featuredImageUrl: string | null = null;

    if (postResponse.ok) {
      const postData = await postResponse.json();
      if (postData.length > 0) {
        post = postData[0];

        // Try to get featured image
        if (post && post.featured_media) {
          try {
            const mediaResponse = await fetch(
              `${siteConfig.api.wordpress.baseUrl}/media/${post.featured_media}`,
              { next: { revalidate: 3600 } }
            );
            if (mediaResponse.ok) {
              const media: WordPressFeaturedMedia = await mediaResponse.json();
              featuredImageUrl =
                media.media_details?.sizes?.medium?.source_url ||
                media.media_details?.sizes?.large?.source_url ||
                media.source_url;
            }
          } catch (error) {
            console.warn("Failed to fetch featured media:", error);
          }
        }
      }
    }

    const title = post?.title.rendered || "Blog Post";
    const excerpt = post?.excerpt.rendered
      ? post.excerpt.rendered
          .replace(/<[^>]*>/g, "")
          .trim()
          .slice(0, 120)
      : "อ่านบทความจาก วิศรุต แสนคำ";

    return new ImageResponse(
      (
        <div
          style={{
            background: featuredImageUrl
              ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${featuredImageUrl})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            fontFamily: "system-ui, sans-serif",
            color: "white",
            padding: "60px",
            position: "relative",
          }}
        >
          {/* Gradient overlay for better text readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "800px",
              zIndex: 1,
            }}
          >
            {/* Author badge */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                padding: "8px 20px",
                borderRadius: "25px",
                fontSize: "18px",
                marginBottom: "20px",
                backdropFilter: "blur(10px)",
                alignSelf: "flex-start",
              }}
            >
              {siteConfig.authorTh}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "16px",
                lineHeight: "1.2",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </h1>

            {/* Excerpt */}
            <p
              style={{
                fontSize: "24px",
                marginBottom: "30px",
                opacity: 0.9,
                lineHeight: "1.4",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {excerpt}
            </p>

            {/* Website URL */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
                opacity: 0.8,
              }}
            >
              🌐 {siteConfig.url.replace("https://", "")}
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error("Error generating blog post OG image:", error);

    // Fallback image if there's an error
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {siteConfig.authorTh}
          </h1>
          <p style={{ fontSize: "24px", opacity: 0.9 }}>Blog Post</p>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
