"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { Layout } from "@/components/layout";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem } from "@/types/portfolio";

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
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 20, md: 28 }}
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={5} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={{ base: "gray.900", _dark: "white" }}
              letterSpacing="-0.025em"
            >
              ผลงาน
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={{ base: "gray.500", _dark: "gray.400" }}
              lineHeight="1.8"
            >
              รวมผลงานถ่ายภาพ วิดีโอ เว็บไซต์ และการออกแบบ
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Divider */}
      <Box w="100%" display="flex" justifyContent="center" bg={{ base: "white", _dark: "gray.900" }}>
        <Box w="60px" h="1px" bg={{ base: "gray.200", _dark: "gray.700" }} />
      </Box>

      {/* Content */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8} w="full">
            {/* Category Filter */}
            <HStack gap={3} justify="center" flexWrap="wrap">
              {filterOptions.map((option) => (
                <Text
                  key={option.value}
                  onClick={() => handleCategoryChange(option.value)}
                  cursor="pointer"
                  fontSize="sm"
                  color={
                    selectedCategory === option.value
                      ? { base: "gray.900", _dark: "white" }
                      : { base: "gray.400", _dark: "gray.500" }
                  }
                  _hover={{ color: { base: "gray.900", _dark: "white" } }}
                  transition="color 0.15s"
                >
                  {option.label}
                </Text>
              ))}
            </HStack>

            {/* Portfolio Grid */}
            {displayPortfolios.length > 0 ? (
              <>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 6, md: 8 }} w="full">
                  {displayPortfolios.map((portfolio) => (
                    <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                  ))}
                </SimpleGrid>

                {/* Pagination */}
                {displayTotalPages > 1 && (
                  <HStack gap={6} justify="center" mt={4}>
                    <Text
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      cursor={currentPage === 1 ? "default" : "pointer"}
                      fontSize="sm"
                      color={
                        currentPage === 1
                          ? { base: "gray.300", _dark: "gray.600" }
                          : { base: "gray.500", _dark: "gray.400" }
                      }
                      _hover={
                        currentPage === 1
                          ? {}
                          : { color: { base: "gray.900", _dark: "white" } }
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
                                ? { base: "gray.900", _dark: "white" }
                                : { base: "gray.400", _dark: "gray.500" }
                            }
                            _hover={{ color: { base: "gray.900", _dark: "white" } }}
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
                          ? { base: "gray.300", _dark: "gray.600" }
                          : { base: "gray.500", _dark: "gray.400" }
                      }
                      _hover={
                        currentPage === displayTotalPages
                          ? {}
                          : { color: { base: "gray.900", _dark: "white" } }
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
                  color={{ base: "gray.400", _dark: "gray.500" }}
                  textAlign="center"
                >
                  {displayPortfolios.length} / {displayTotal}
                </Text>
              </>
            ) : (
              <Box textAlign="center" py={12}>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.400", _dark: "gray.500" }}
                  cursor="pointer"
                  onClick={() => handleCategoryChange("all")}
                  _hover={{ color: { base: "gray.900", _dark: "white" } }}
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
    <Link href={`/portfolio/${portfolio.slug}`}>
      <Box cursor="pointer" role="group">
        <Box
          overflow="hidden"
          borderRadius="md"
          bg={{ base: "gray.100", _dark: "gray.800" }}
          position="relative"
          paddingTop="62.5%"
        >
          <Image
            src={portfolio.featured_image?.url || "/placeholder-image.svg"}
            alt={portfolio.title.rendered}
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
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
            color={{ base: "gray.400", _dark: "gray.500" }}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            {PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category}
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="medium"
            color={{ base: "gray.800", _dark: "white" }}
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
