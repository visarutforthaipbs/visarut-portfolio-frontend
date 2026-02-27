"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { PortfolioPreview } from "@/components/portfolio";
import { useEffect, useState } from "react";

const roles = [
  "ภาพถ่าย",
  "ถ่ายวีดีโอ",
  "ตัดต่อวีดีโอ",
  "เว็บไซต์",
  "ออกแบบกราฟิก",
  "สิ่งพิมพ์",
  "นิทรรศการ",
  "แคมเปญ",
  "โปรดิวเซอร์",
];

function useRotatingText(words: string[], intervalMs = 2200) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 300);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [words.length, intervalMs]);

  return { word: words[index], isAnimating };
}

export default function HomeClient() {
  const { word: currentRole, isAnimating } = useRotatingText(roles);

  return (
    <Layout>
      {/* ── Hero ── */}
      <Box
        as="section"
        w="100%"
        display="flex"
        justifyContent="center"
        bg={{ base: "white", _dark: "gray.900" }}
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack
            gap={5}
            py={{ base: 20, md: 32, lg: 40 }}
            align="center"
            textAlign="center"
          >
            <Heading
              fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "7xl" }}
              fontWeight="bold"
              color={{ base: "gray.900", _dark: "white" }}
              lineHeight="1.05"
              letterSpacing="-0.025em"
            >
              วิศรุต แสนคำ
            </Heading>

            {/* Rotating role */}
            <Box h="40px" overflow="hidden">
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="normal"
                color={{ base: "gray.400", _dark: "gray.500" }}
                transition="all 0.3s ease"
                opacity={isAnimating ? 0 : 1}
                transform={isAnimating ? "translateY(-10px)" : "translateY(0)"}
              >
                {currentRole}
              </Text>
            </Box>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={{ base: "gray.500", _dark: "gray.400" }}
              maxW="480px"
              lineHeight="1.8"
            >
              ผู้ผลิตสื่อที่เชื่อในพลังของการสื่อสาร
              <br />
              เพื่อสร้างสังคมที่ดีขึ้น
            </Text>

            <Link href="/portfolio">
              <HStack
                gap={2}
                pt={4}
                color={{ base: "gray.900", _dark: "white" }}
                fontWeight="medium"
                fontSize="md"
                _hover={{ gap: 3 }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <Text>ดูผลงาน</Text>
                <ArrowRight size={18} />
              </HStack>
            </Link>
          </VStack>
        </Container>
      </Box>

      {/* ── Divider ── */}
      <Box
        w="100%"
        display="flex"
        justifyContent="center"
        bg={{ base: "white", _dark: "gray.900" }}
      >
        <Box
          w="60px"
          h="1px"
          bg={{ base: "gray.200", _dark: "gray.700" }}
        />
      </Box>

      {/* ── Portfolio ── */}
      <Box
        as="section"
        w="100%"
        display="flex"
        justifyContent="center"
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
      >
        <Container maxW="5xl" mx="auto" px={{ base: 5, md: 6 }}>
          <PortfolioPreview maxItems={6} />
        </Container>
      </Box>
    </Layout>
  );
}
