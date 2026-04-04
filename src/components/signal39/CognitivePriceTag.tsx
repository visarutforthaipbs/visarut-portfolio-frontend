"use client";

import { Brain } from "lucide-react";
import type { CognitiveCostResult } from "@/utils/cognitiveCost";

interface CognitivePriceTagProps {
  cost: CognitiveCostResult;
}

export default function CognitivePriceTag({ cost }: CognitivePriceTagProps) {
  const readingMinutes = Math.max(1, Math.round(cost.readingTimeSeconds / 60));

  return (
    <div
      className="inline-flex items-center gap-1.5 md:gap-2 rounded-md px-2.5 py-1.5 md:px-4 md:py-2 bg-surface border border-edge"
      role="status"
      aria-label={`อ่าน ${readingMinutes} นาที ใช้ ${cost.kbCost} KB จากงบความสนใจรายวัน 184 KB`}
    >
      <Brain
        size={14}
        className="text-signal shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="text-[11px] md:text-sm text-muted whitespace-normal">
        เวลาอ่าน {readingMinutes} นาที · คิดเป็น {cost.percentageOfDaily}% ของต้นทุนความสนใจที่มีต่อวัน ({cost.kbCost}/184 KB)
      </span>
    </div>
  );
}
