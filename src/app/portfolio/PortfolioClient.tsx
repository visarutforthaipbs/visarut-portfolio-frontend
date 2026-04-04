"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { Layout } from "@/components/layout";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem } from "@/types/portfolio";
import { T } from "@/lib/tokens";

interface PortfolioClientProps {
  initialPortfolios: PortfolioItem[];
  initialTotal: number;
  initialTotalPages: number;
}

export default function PortfolioClient({
  initialPortfolios,
  initialTotal,
  initialTotalPages,
}: PortfolioClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { portfolios, loading, total, totalPages } = usePortfolios({
    per_page: itemsPerPage,
    page: currentPage,
    categories: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const displayPortfolios =
    currentPage === 1 && selectedCategory === "all" && loading
      ? initialPortfolios
      : portfolios;

  const displayTotal =
    currentPage === 1 && selectedCategory === "all" && loading
      ? initialTotal
      : total;

  const displayTotalPages =
    currentPage === 1 && selectedCategory === "all" && loading
      ? initialTotalPages
      : totalPages;

  const filterOptions = [
    { value: "all", label: "ทั้งหมด" },
    ...Object.entries(PORTFOLIO_CATEGORIES).map(([key, label]) => ({
      value: key,
      label,
    })),
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <Layout>
      {/* Hero */}
      <Box
        as="section"
        bg={T.bg}
        py={{ base: 20, md: 28 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="ผลงาน"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={5} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={T.text}
              letterSpacing="-0.025em"
            >
              ผลงาน
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={T.textMuted}
              lineHeight="1.8"
            >
              รวมผลงานถ่ายภาพ วิดีโอ เว็บไซต์ และการออกแบบ
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Divider */}
      <Box w="100%" display="flex" justifyContent="center" bg={T.bg} aria-hidden="true">
        <Box w="60px" h="1px" bg={T.border} />
      </Box>

      {/* Content */}
      <Box
        as="section"
        bg={T.bg}
        py={{ base: 16, md: 24 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="รายการผลงาน"
      >
        <Container maxW="5xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8} w="full">
            {/* Category Filter */}
            <HStack gap={3} justify="center" flexWrap="wrap" role="tablist" aria-label="ตัวกรองหมวดหมู่">
              {filterOptions.map((option) => (
                <Text
                  key={option.value}
                  onClick={() => handleCategoryChange(option.value)}
                  cursor="pointer"
                  fontSize="sm"
                  role="tab"
                  aria-selected={selectedCategory === option.value}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCategoryChange(option.value); } }}
                  color={
                    selectedCategory === option.value
                      ? T.text
                      : T.textDim
                  }
                  _hover={{ color: T.text }}
                  transition="color 0.15s"
                >
                  {option.label}
                </Text>
              ))}
            </HStack>

            {/* Portfolio Grid */}
            {displayPortfolios.length > 0 ? (
              <>
                <Box
                  css={{
                    columnCount: 1,
                    columnGap: "1.5rem",
                    "@media (min-width: 48em)": { columnCount: 2 },
                    "@media (min-width: 62em)": { columnCount: 3 },
                  }}
                  w="full"
                >
                  {displayPortfolios.map((portfolio) => (
                    <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                  ))}
                </Box>

                {/* Pagination */}
                {displayTotalPages > 1 && (
                  <HStack as="nav" aria-label="การแบ่งหน้า" gap={6} justify="center" mt={4}>
                    <Text
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      cursor={currentPage === 1 ? "default" : "pointer"}
                      fontSize="sm"
                      color={
                        currentPage === 1
                          ? T.border
                          : T.textMuted
                      }
                      _hover={
                        currentPage === 1
                          ? {}
                          : { color: T.text }
                      }
                      transition="color 0.15s"
                    >
                      ← ก่อนหน้า
                    </Text>

                    <HStack gap={2}>
                      {Array.from({ length: Math.min(5, displayTotalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Text
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            cursor="pointer"
                            fontSize="sm"
                            fontWeight={currentPage === page ? "medium" : "normal"}
                            color={
                              currentPage === page
                                ? T.text
                                : T.textDim
                            }
                            _hover={{ color: T.text }}
                            transition="color 0.15s"
                          >
                            {page}
                          </Text>
                        );
                      })}
                    </HStack>

                    <Text
                      onClick={() => setCurrentPage(Math.min(displayTotalPages, currentPage + 1))}
                      cursor={currentPage === displayTotalPages ? "default" : "pointer"}
                      fontSize="sm"
                      color={
                        currentPage === displayTotalPages
                          ? T.border
                          : T.textMuted
                      }
                      _hover={
                        currentPage === displayTotalPages
                          ? {}
                          : { color: T.text }
                      }
                      transition="color 0.15s"
                    >
                      ถัดไป →
                    </Text>
                  </HStack>
                )}

                {/* Results Info */}
                <Text
                  fontSize="xs"
                  color={T.textDim}
                  textAlign="center"
                >
                  {displayPortfolios.length} / {displayTotal}
                </Text>
              </>
            ) : (
              <Box textAlign="center" py={12}>
                <Text
                  fontSize="sm"
                  color={T.textDim}
                  cursor="pointer"
                  onClick={() => handleCategoryChange("all")}
                  _hover={{ color: T.text }}
                >
                  ไม่พบผลงาน — ดูทั้งหมด
                </Text>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}

function PortfolioCard({ portfolio }: { portfolio: PortfolioItem }) {
  return (
    <Link href={`/portfolio/${portfolio.slug}`} aria-label={portfolio.title.rendered.replace(/<[^>]*>/g, '')}>
      <Box cursor="pointer" role="group" as="article" css={{ breakInside: "avoid" }} mb={6}>
        <Box
          overflow="hidden"
          borderRadius="md"
          bg={T.surface}
        >
          <Image
            src={portfolio.featured_image?.url || "/placeholder-image.svg"}
            alt={portfolio.title.rendered}
            w="full"
            h="auto"
            display="block"
            objectFit="cover"
            loading="lazy"
            transition="opacity 0.2s"
            _groupHover={{ opacity: 0.85 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.svg";
            }}
          />
        </Box>

        <VStack align="start" gap={1} mt={3}>
          <Text
            fontSize="xs"
            color={T.textDim}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            {PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category}
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="medium"
            color={T.text}
            lineHeight="1.4"
            lineClamp={2}
          >
            {portfolio.title.rendered}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
}
