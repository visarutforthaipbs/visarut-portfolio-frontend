"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Flex direction="column" minH="100vh">
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#161922",
          color: "#E8E8ED",
          padding: "8px 16px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 500,
          zIndex: 1000,
          transition: "top 0.2s",
          textDecoration: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.top = "12px"; }}
        onBlur={(e) => { e.currentTarget.style.top = "-100px"; }}
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <Header />
      <Box flex="1" as="main" id="main-content">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
}
