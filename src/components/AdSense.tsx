"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded (e.g. ad blocker)
    }
  }, []);

  return (
    <Box
      w="full"
      textAlign="center"
      my={6}
      overflow="hidden"
      minH="90px"
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
