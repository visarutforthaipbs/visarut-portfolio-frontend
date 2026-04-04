"use client";

import { memo } from "react";
import { sanitizeHtml } from "@/lib/sanitize";

interface WordPressContentProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  className?: string;
}

export const WordPressContent = memo(function WordPressContent({
  content,
  className = "",
  ...props
}: WordPressContentProps) {
  return (
    <div
      className={`wordpress-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      {...props}
    />
  );
});

export default WordPressContent;
