"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Image,
  AspectRatio,
  Skeleton,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { Calendar, Eye, AlertCircle, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Layout } from "@/components/layout";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem } from "@/types/portfolio";

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { portfolios, loading, error, total, totalPages } = usePortfolios({
    per_page: itemsPerPage,
    page: currentPage,
    categories: selectedCategory === "all" ? undefined : selectedCategory,
  });

  // Create filter options
  const filterOptions = [
    { value: "all", label: "ทั้งหมด" },
    ...Object.entries(PORTFOLIO_CATEGORIES).map(([key, label]) => ({
      value: key,
      label,
    })),
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8} textAlign="center">
            <VStack gap={4}>
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="bold"
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
              >
                ผลงานของเรา
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={{ base: "gray.600", _dark: "gray.300" }}
                maxW="800px"
                className="thai-text"
                lineHeight="1.8"
              >
                รวมผลงานที่ผ่านมา แสดงความเชี่ยวชาญในการถ่ายภาพ วิดีโอ
                การพัฒนาเว็บไซต์ และการออกแบบ
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Portfolio Content */}
      <Box
        bg={{ base: "gray.50", _dark: "gray.800" }}
        py={{ base: 16, md: 20 }}
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8} w="full">
            {/* Category Filter */}
            <Box w="full">
              <HStack gap={3} mb={4} align="center">
                <Filter size={20} />
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color={{ base: "gray.800", _dark: "white" }}
                  className="thai-text"
                >
                  หมวดหมู่
                </Text>
              </HStack>
              <VStack gap={4} align="stretch">
                <Flex
                  gap={4}
                  wrap="wrap"
                  justify={{ base: "center", md: "start" }}
                >
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => handleCategoryChange(option.value)}
                      variant={
                        selectedCategory === option.value ? "solid" : "outline"
                      }
                      bg={
                        selectedCategory === option.value
                          ? "accent.500"
                          : "transparent"
                      }
                      color={
                        selectedCategory === option.value
                          ? "white"
                          : { base: "gray.700", _dark: "gray.200" }
                      }
                      borderColor={
                        selectedCategory === option.value
                          ? "accent.500"
                          : { base: "gray.300", _dark: "gray.600" }
                      }
                      _hover={{
                        bg:
                          selectedCategory === option.value
                            ? "accent.600"
                            : "accent.50",
                        borderColor: "accent.500",
                      }}
                      size="sm"
                      px={6}
                      py={2}
                      className="thai-text"
                    >
                      {option.label}
                    </Button>
                  ))}
                </Flex>

                {/* Category-specific view all button */}
                {selectedCategory !== "all" && (
                  <Flex justify="center">
                    <Link href={`/portfolio/category/${selectedCategory}`}>
                      <Button
                        variant="outline"
                        colorScheme="blue"
                        size="sm"
                        className="thai-text"
                      >
                        ดู
                        {
                          PORTFOLIO_CATEGORIES[
                            selectedCategory as keyof typeof PORTFOLIO_CATEGORIES
                          ]
                        }
                        ทั้งหมด
                      </Button>
                    </Link>
                  </Flex>
                )}
              </VStack>
            </Box>

            {/* Portfolio Grid */}
            {error ? (
              <Box
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="md"
                p={6}
                w="full"
              >
                <HStack gap={3} color="red.600" justify="center">
                  <AlertCircle size={24} />
                  <VStack align="center" gap={2}>
                    <Text fontWeight="medium" className="thai-text">
                      เกิดข้อผิดพลาดในการโหลดผลงาน
                    </Text>
                    <Text fontSize="sm" color="red.500">
                      {error}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ) : loading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <Box key={index}>
                    <Skeleton height="300px" borderRadius="lg" />
                    <VStack gap={2} align="start" mt={4}>
                      <Skeleton height="24px" width="80%" />
                      <Skeleton height="16px" width="60%" />
                      <Skeleton height="14px" width="40%" />
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            ) : portfolios.length > 0 ? (
              <>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  gap={6}
                  w="full"
                >
                  {portfolios.map((portfolio) => (
                    <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                  ))}
                </SimpleGrid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <HStack gap={4} justify="center" mt={8}>
                    <Button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      variant="outline"
                      size="md"
                      className="thai-text"
                    >
                      ก่อนหน้า
                    </Button>

                    <HStack gap={2}>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              variant={
                                currentPage === page ? "solid" : "outline"
                              }
                              bg={
                                currentPage === page
                                  ? "accent.500"
                                  : "transparent"
                              }
                              color={
                                currentPage === page ? "white" : "gray.700"
                              }
                              size="sm"
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </HStack>

                    <Button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="md"
                      className="thai-text"
                    >
                      ถัดไป
                    </Button>
                  </HStack>
                )}

                {/* Results Info */}
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  textAlign="center"
                  className="thai-text"
                >
                  แสดง {portfolios.length} จาก {total} ผลงาน
                </Text>
              </>
            ) : (
              <VStack gap={4} py={12}>
                <Text
                  fontSize="lg"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  textAlign="center"
                  className="thai-text"
                >
                  ไม่พบผลงานในหมวดหมู่นี้
                </Text>
                <Button
                  onClick={() => handleCategoryChange("all")}
                  bg="accent.500"
                  color="white"
                  _hover={{ bg: "accent.600" }}
                  size="md"
                  className="thai-text"
                >
                  ดูผลงานทั้งหมด
                </Button>
              </VStack>
            )}
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}

// Portfolio Card Component
function PortfolioCard({ portfolio }: { portfolio: PortfolioItem }) {
  return (
    <Box
      bg={{ base: "white", _dark: "gray.700" }}
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "lg",
      }}
      transition="all 0.3s ease"
    >
      {/* Portfolio Image */}
      <AspectRatio ratio={16 / 10}>
        <Image
          src={portfolio.featured_image?.url || "/placeholder-image.svg"}
          alt={portfolio.title.rendered}
          objectFit="cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-image.svg";
          }}
        />
      </AspectRatio>

      {/* Portfolio Content */}
      <Box p={6}>
        <VStack gap={3} align="start">
          {/* Category Badge */}
          <Badge
            bg="accent.100"
            color="accent.700"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            className="thai-text"
          >
            {PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category}
          </Badge>

          {/* Title */}
          <Heading
            fontSize="xl"
            color={{ base: "gray.800", _dark: "white" }}
            className="thai-text"
            lineHeight="1.4"
            css={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {portfolio.title.rendered}
          </Heading>

          {/* Description */}
          {portfolio.excerpt && (
            <Text
              fontSize="sm"
              color={{ base: "gray.600", _dark: "gray.300" }}
              className="thai-text"
              css={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {portfolio.excerpt.rendered}
            </Text>
          )}

          {/* Date and View Button */}
          <HStack justify="space-between" w="full" pt={2}>
            <HStack
              gap={2}
              fontSize="xs"
              color={{ base: "gray.500", _dark: "gray.400" }}
            >
              <Calendar size={14} />
              <Text>
                {new Date(portfolio.date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </HStack>

            <Link href={`/portfolio/${portfolio.slug}`}>
              <Button
                size="sm"
                variant="ghost"
                color="accent.500"
                _hover={{ color: "accent.600", bg: "accent.50" }}
                className="thai-text"
              >
                <HStack gap={1}>
                  <Text>ดูเพิ่มเติม</Text>
                  <Eye size={14} />
                </HStack>
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
