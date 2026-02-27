"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight Web Vitals reporter.
 * Reports Core Web Vitals (LCP, FID, CLS, INP, FCP, TTFB) to console
 * and to Google Analytics (if available).
 */
export function WebVitals() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically import web-vitals to avoid blocking initial load
    import("web-vitals").then(({ onCLS, onLCP, onFCP, onTTFB, onINP }) => {
      const reportMetric = (metric: { name: string; value: number; id: string; delta: number }) => {
        // Log to console in development
        if (process.env.NODE_ENV === "development") {
          console.log(`[Web Vital] ${metric.name}:`, Math.round(metric.value * 100) / 100);
        }

        // Send to Google Analytics if available
        if (typeof window.gtag === "function") {
          window.gtag("event", metric.name, {
            value: Math.round(metric.name === "CLS" ? metric.delta * 1000 : metric.delta),
            event_label: metric.id,
            non_interaction: true,
          });
        }
      };

      onCLS(reportMetric);
      onLCP(reportMetric);
      onFCP(reportMetric);
      onTTFB(reportMetric);
      onINP(reportMetric);
    }).catch(() => {
      // web-vitals not available, silently ignore
    });
  }, [pathname]);

  return null;
}
