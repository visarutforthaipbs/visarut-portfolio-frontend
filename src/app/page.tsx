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
import { ArrowRight, Camera, Video, Code, Palette } from "lucide-react";
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

export default function HomePage() {
  const services = [
    {
      icon: <Camera size={32} />,
      title: "ภาพถ่าย",
      titleEn: "Photography",
      description: "บริการถ่ายภาพสินค้า บุคคล และกิจกรรม",
      category: "photography",
    },
    {
      icon: <Video size={32} />,
      title: "วิดีโอ",
      titleEn: "Videography",
      description: "ถ่ายทำและตัดต่อวิดีโอคุณภาพสูง",
      category: "videography",
    },
    {
      icon: <Code size={32} />,
      title: "เว็บไซต์",
      titleEn: "Web Development",
      description: "พัฒนาเว็บไซต์และแอปพลิเคชัน",
      category: "website",
    },
    {
      icon: <Palette size={32} />,
      title: "กราฟิกดีไซน์",
      titleEn: "Graphic Design",
      description: "ออกแบบกราฟิกและสื่อสิ่งพิมพ์",
      category: "graphic-design",
    },
  ];

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
          className="full-width"
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
                  className="thai-text"
                  lineHeight={{ base: "1.2", md: "1.1" }}
                >
                  วิศรุต แสนคำ
                </Heading>
                <Text
                  fontSize={{ base: "md", sm: "lg", md: "xl" }}
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  maxW={{ base: "90%", md: "600px" }}
                  className="thai-text"
                  lineHeight={{ base: "1.6", md: "1.7" }}
                  px={{ base: 2, md: 0 }}
                >
                  ผู้เชี่ยวชาญด้านสื่อ เชี่ยวชาญในการถ่ายภาพ การถ่ายวิดีโอ
                  การพัฒนาเว็บไซต์ และการออกแบบกราฟิก
                </Text>
              </VStack>

              <HStack gap={{ base: 3, md: 4 }} flexWrap="wrap" justify="center">
                <Link href="/portfolio">
                  <Button
                    size={{ base: "md", md: "lg" }}
                    bg="accent.500"
                    color="white"
                    _hover={{ bg: "accent.600" }}
                    className="thai-text"
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
          className="full-width"
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
          className="full-width"
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
                  className="thai-text"
                >
                  บริการของเรา
                </Heading>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  maxW={{ base: "90%", md: "500px" }}
                  className="thai-text"
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
                  <Link
                    key={index}
                    href={`/portfolio/category/${service.category}`}
                  >
                    <Box
                      bg={{ base: "white", _dark: "gray.700" }}
                      p={{ base: 4, md: 6 }}
                      borderRadius="lg"
                      shadow="md"
                      textAlign="center"
                      _hover={{
                        transform: "translateY(-4px)",
                        shadow: "lg",
                      }}
                      transition="all 0.3s ease"
                      cursor="pointer"
                      border="1px solid"
                      borderColor={{ base: "gray.200", _dark: "gray.600" }}
                    >
                      <VStack gap={{ base: 3, md: 4 }}>
                        <Box
                          color={{ base: "accent.500", _dark: "accent.300" }}
                          fontSize={{ base: "xl", md: "2xl" }}
                        >
                          {service.icon}
                        </Box>
                        <VStack gap={2}>
                          <Heading
                            fontSize={{ base: "lg", md: "xl" }}
                            color={{ base: "gray.800", _dark: "white" }}
                            className="thai-text"
                          >
                            {service.title}
                          </Heading>
                          <Text
                            fontSize={{ base: "xs", md: "sm" }}
                            color={{ base: "gray.600", _dark: "gray.300" }}
                            className="thai-text"
                            lineHeight="1.5"
                          >
                            {service.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </Box>
                  </Link>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </Layout>
    </>
  );
}
