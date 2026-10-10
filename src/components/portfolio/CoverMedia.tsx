"use client";

import { useState } from "react";

interface CoverMediaProps {
  src: string;
  alt: string;
  className?: string;
  /** First visible card(s): load eagerly with high fetch priority (LCP). */
  priority?: boolean;
}

const GIF_RE = /\.gif(\?.*)?$/i;

/**
 * Portfolio cover image.
 *
 * Animated GIF covers are heavy (the Yangnar cover was 1.9 MB and made mobile
 * LCP ~17 s). Convention: next to `X.gif` in the WordPress uploads folder,
 * upload `X.mp4` (H.264, muted) and `X-poster.webp` (first frame). The cover
 * then plays the MP4 — same animation, ~5x smaller — and falls back to the
 * original GIF if the MP4 is missing.
 */
export function CoverMedia({ src, alt, className = "", priority = false }: CoverMediaProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  if (GIF_RE.test(src) && !videoFailed) {
    const base = src.replace(GIF_RE, "");
    return (
      <video
        className={className}
        src={`${base}.mp4`}
        poster={`${base}-poster.webp`}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={alt}
        onError={() => setVideoFailed(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setImgSrc("/placeholder-image.svg")}
    />
  );
}

export default CoverMedia;
