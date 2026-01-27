"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { PortfolioPreview } from "@/components/portfolio";
import { BlogPreview } from "@/components/blog/BlogPreview";
import { JsonLd } from "@/components/JsonLd";
import {
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";
import { services } from "@/constants/data";
import { ServiceCard } from "@/components/ui/ServiceCard";

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <JsonLd data={generatePersonSchema()} />
      <JsonLd data={generateOrganizationSchema()} />
      <JsonLd data={generateWebsiteSchema()} />

      <Layout>
        {/* Hero Section - Full Width */}
        <Box
          bg={{ base: "white", _dark: "gray.900" }}
          py={{ base: 12, md: 20, lg: 24 }}
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="5xl" px={{ base: 4, md: 6, lg: 8 }}>
            <VStack gap={{ base: 6, md: 8 }} textAlign="center">
              <VStack gap={{ base: 3, md: 4 }}>
                <Heading
                  fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                  fontWeight="bold"
                  color={{ base: "gray.800", _dark: "white" }}
                  lineHeight={{ base: "1.2", md: "1.1" }}
                >
                  วิศรุต แสนคำ
                </Heading>
                <Text
                  fontSize={{ base: "md", sm: "lg", md: "xl" }}
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  maxW={{ base: "90%", md: "600px" }}
                  lineHeight={{ base: "1.6", md: "1.7" }}
                  px={{ base: 2, md: 0 }}
                >
                  ผู้ผลิตสื่อหลากหลายประเภท
                  ที่หวังว่าจะช่วยทำให้สังคมดีขึ้นได้่ผ่านการสื่อสาร
                </Text>
              </VStack>

              <HStack gap={{ base: 3, md: 4 }} flexWrap="wrap" justify="center">
                <Link href="/portfolio">
                  <Button
                    size={{ base: "md", md: "lg" }}
                    bg="accent.500"
                    color="white"
                    _hover={{ bg: "accent.600" }}
                    px={{ base: 4, md: 6 }}
                    py={{ base: 2, md: 3 }}
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    <HStack gap={2}>
                      <Text>ดูผลงาน</Text>
                      <ArrowRight size={20} />
                    </HStack>
                  </Button>
                </Link>
              </HStack>
            </VStack>
          </Container>
        </Box>

        {/* Portfolio Preview Section - Full Width with WordPress Data */}
        <Box
          bg={{ base: "gray.50", _dark: "gray.800" }}
          py={{ base: 12, md: 16, lg: 20 }}
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="5xl" px={{ base: 4, md: 6, lg: 8 }}>
            <PortfolioPreview maxItems={6} />
          </Container>
        </Box>

        {/* Blog Preview Section - Full Width */}
        <BlogPreview maxPosts={3} />

        {/* Services Section - Full Width */}
        <Box
          bg={{ base: "white", _dark: "gray.900" }}
          py={{ base: 12, md: 16, lg: 20 }}
          display="flex"
          justifyContent="center"
          w="100%"
        >
          <Container maxW="5xl" px={{ base: 4, md: 6, lg: 8 }}>
            <VStack gap={{ base: 8, md: 12 }}>
              <VStack gap={{ base: 3, md: 4 }} textAlign="center">
                <Heading
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                  color={{ base: "gray.800", _dark: "white" }}
                >
                  บริการของเรา
                </Heading>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  maxW={{ base: "90%", md: "500px" }}
                  px={{ base: 2, md: 0 }}
                >
                  เราให้บริการครบวงจรด้านสื่อและการสื่อสาร
                </Text>
              </VStack>

              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 4 }}
                gap={{ base: 4, md: 6, lg: 8 }}
                w="full"
              >
                {services.map((service, index) => (
                  <ServiceCard key={index} {...service} />
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </Layout>
    </>
  );
}
