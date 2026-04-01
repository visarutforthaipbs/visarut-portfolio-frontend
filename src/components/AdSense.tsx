"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

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
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded (e.g. ad blocker)
    }

    // Check if the ad actually rendered content
    const timer = setTimeout(() => {
      const el = adRef.current;
      if (el && el.offsetHeight > 0) {
        setFilled(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      w="full"
      textAlign="center"
      my={filled ? 6 : 0}
      overflow="hidden"
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
    </Box>
  );
}
