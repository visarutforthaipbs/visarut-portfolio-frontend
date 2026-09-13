"use client";

import { useEffect } from "react";

/**
 * Lightweight Web Vitals reporter.
 * Reports document-level metrics to Google Analytics, with opt-in debug logs.
 */
export function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let active = true;

    // Dynamically import web-vitals to avoid blocking initial load
    import("web-vitals").then(({ onCLS, onLCP, onFCP, onTTFB, onINP }) => {
      if (!active) return;
      const reportMetric = (metric: { name: string; value: number; id: string; delta: number }) => {
        if (!active) return;
        if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEBUG_WEB_VITALS === "true") {
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
    return () => { active = false; };
  }, []);

  return null;
}
