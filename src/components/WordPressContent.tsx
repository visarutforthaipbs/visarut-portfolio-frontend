"use client";

import { Box, BoxProps } from "@chakra-ui/react";
import { memo } from "react";

interface WordPressContentProps extends BoxProps {
  content: string;
  className?: string;
}

export const WordPressContent = memo(function WordPressContent({
  content,
  className = "",
  ...boxProps
}: WordPressContentProps) {
  return (
    <Box
      className={`wordpress-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      {...boxProps}
    />
  );
});

export default WordPressContent;
