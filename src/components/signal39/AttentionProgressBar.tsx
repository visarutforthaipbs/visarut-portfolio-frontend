"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Zap } from "lucide-react";
import type { CognitiveCostResult } from "@/utils/cognitiveCost";
import { T } from "@/lib/tokens";

interface AttentionProgressBarProps {
  cost: CognitiveCostResult;
}

const TRACK_TOP = 70; // px below header
const TRACK_BOTTOM = 20; // px from bottom

export default function AttentionProgressBar({ cost }: AttentionProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [labelY, setLabelY] = useState(TRACK_TOP);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.min(scrollTop / docHeight, 1);
      setProgress(pct);

      const trackHeight = window.innerHeight - TRACK_TOP - TRACK_BOTTOM;
      setLabelY(TRACK_TOP + pct * trackHeight);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const spentKB = Math.round(progress * cost.kbCost * 10) / 10;

  // Green (#22C55E) → Orange (#EA8A38) interpolation
  const r = Math.round(34 + progress * (234 - 34));
  const g = Math.round(197 + progress * (138 - 197));
  const b = Math.round(94 + progress * (56 - 94));
  const barColor = `rgb(${r},${g},${b})`;

  return (
    <>
      {/* Right-side vertical track */}
      <div
        className="fixed select-none pointer-events-none hidden md:block"
        style={{
          top: TRACK_TOP,
          right: 6,
          bottom: TRACK_BOTTOM,
          width: 4,
          zIndex: 1000,
          borderRadius: 2,
          backgroundColor: T.border,
        }}
      >
        {/* Fill — grows from top */}
        <div
          style={{
            width: "100%",
            height: `${progress * 100}%`,
            backgroundColor: barColor,
            borderRadius: 2,
            transition: "height 80ms linear",
          }}
        />
      </div>

      {/* KB label — follows the fill edge */}
      <div
        className="fixed select-none pointer-events-none hidden md:block"
        style={{
          top: labelY,
          right: 16,
          zIndex: 1000,
          transform: "translateY(-50%)",
          transition: "top 80ms linear",
        }}
      >
        <div
          className="flex items-center gap-1.5 rounded-md px-2 py-1"
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            border: `1px solid ${T.border}`,
            backdropFilter: "blur(8px)",
            whiteSpace: "nowrap",
          }}
        >
          <Zap size={10} style={{ color: barColor }} strokeWidth={2} fill={barColor} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: barColor, fontWeight: 600 }}>
            {spentKB}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: T.textDim }}>
            / {cost.kbCost} KB
          </span>
        </div>
      </div>
    </>
  );
}
