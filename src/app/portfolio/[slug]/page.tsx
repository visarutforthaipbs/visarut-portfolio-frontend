"use client";

import { useParams } from "next/navigation";
import { Layout } from "@/components/layout";
import { usePortfolioBySlug } from "@/hooks/useWordPress";
import PortfolioDetailClient from "./PortfolioDetailClient";
import { Skeleton, Container, VStack, Box } from "@chakra-ui/react";

export default function PortfolioDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { portfolio, loading, error } = usePortfolioBySlug(slug);

  if (loading) {
    return (
      <Layout>
        <Box
          py={{ base: 16, md: 20 }}
          className="full-width"
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <VStack gap={8} align="start">
              <Skeleton height="60px" width="80%" />
              <Skeleton height={{ base: "200px", md: "400px" }} w="full" />
            </VStack>
          </Container>
        </Box>
      </Layout>
    );
  }

  if (error || !portfolio) {
    return (
      <Layout>
        <Box
          py={{ base: 16, md: 20 }}
          className="full-width"
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="3xl" px={{ base: 6, md: 8 }}>
            <p>Portfolio not found</p>
          </Container>
        </Box>
      </Layout>
    );
  }

  return <PortfolioDetailClient portfolio={portfolio} />;
}