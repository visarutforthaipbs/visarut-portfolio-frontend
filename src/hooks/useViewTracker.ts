"use client";

import { useEffect } from "react";
import { ViewTracker } from "@/lib/wordpress";

/**
 * Hook to track page views for blog posts
 * Automatically tracks view after a delay to ensure user actually reads the content
 */
export function useViewTracker(postId: number, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || !postId) return;

    // Track view with a 3-second delay to ensure user is actually reading
    ViewTracker.trackViewWithDebounce(postId, 3000);
  }, [postId, enabled]);
}

export default useViewTracker;
