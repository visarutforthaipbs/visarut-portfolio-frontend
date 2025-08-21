"use client";

import { Box, BoxProps } from "@chakra-ui/react";
import { memo } from "react";

interface WordPressContentProps extends BoxProps {
  content: string;
  className?: string;
}

/**
 * Component for safely rendering WordPress HTML content
 * Handles Elementor layouts and other WordPress-generated HTML
 */
export const WordPressContent = memo(function WordPressContent({
  content,
  className = "",
  ...boxProps
}: WordPressContentProps) {
  return (
    <Box
      className={`wordpress-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      css={{
        // WordPress content styles
        "& p": {
          marginBottom: "1rem",
          lineHeight: "1.7",
        },
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          marginTop: "1.5rem",
          marginBottom: "0.5rem",
          fontWeight: "bold",
        },
        "& h1": { fontSize: "2xl" },
        "& h2": { fontSize: "xl" },
        "& h3": { fontSize: "lg" },
        "& img": {
          maxWidth: "100%",
          height: "auto",
          borderRadius: "md",
        },
        "& blockquote": {
          borderLeft: "4px solid",
          borderColor: "accent.500",
          paddingLeft: "1rem",
          margin: "1rem 0",
          fontStyle: "italic",
        },
        "& ul, & ol": {
          marginLeft: "1.5rem",
          marginBottom: "1rem",
        },
        "& li": {
          marginBottom: "0.25rem",
        },
        "& a": {
          color: "accent.500",
          textDecoration: "underline",
          _hover: {
            color: "accent.600",
          },
        },
        // Elementor specific styles
        "& .elementor-element": {
          marginBottom: "1rem",
        },
        "& .elementor-widget-container": {
          width: "100%",
        },
        "& .elementor-image img": {
          width: "100%",
          borderRadius: "md",
        },
        "& .elementor-text-editor": {
          lineHeight: "1.7",
        },
        // Video embeds
        "& iframe": {
          maxWidth: "100%",
          aspectRatio: "16/9",
          borderRadius: "md",
        },
        // Gallery styles
        "& .wp-block-gallery": {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        },
        "& .wp-block-image": {
          marginBottom: "1rem",
        },
      }}
      {...boxProps}
    />
  );
});

export default WordPressContent;
