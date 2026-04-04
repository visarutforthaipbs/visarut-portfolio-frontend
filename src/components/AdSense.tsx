"use client";

import { useEffect, useRef, useState } from "react";

interface AdSenseProps {
  /** Ad slot ID from your AdSense dashboard */
  slot: string;
  /** Ad format — default "auto" */
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  /** Responsive layout — default true */
  responsive?: boolean;
  /** Optional style overrides */
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  style,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (pushed.current) return;
    const el = adRef.current;
    if (!el) return;

    // Wait until the container has a non-zero width before pushing
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && el.offsetWidth > 0) {
          observer.disconnect();
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
          } catch {
            // AdSense not loaded (e.g. ad blocker)
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    // Check if the ad actually rendered content
    const timer = setTimeout(() => {
      if (el.offsetHeight > 0) {
        setFilled(true);
      }
    }, 3000);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`w-full text-center overflow-hidden ${filled ? 'my-6' : 'my-0'}`}
      style={{ minHeight: 0 }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-8948939937417308"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        ref={adRef}
      />
    </div>
  );
}
