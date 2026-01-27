import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Image,
  AspectRatio,
  Badge,
  Skeleton,
  IconButton,
} from "@chakra-ui/react";
import {
  Camera,
  MapPin,
  User,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Clock,
  Video,
  Film,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  PortfolioItem,
  PhotographyACF,
  VideographyACF,
  WebsiteACF,
} from "@/types/portfolio";

interface PortfolioACFDisplayProps {
  portfolio: PortfolioItem;
}

export function PortfolioACFDisplay({ portfolio }: PortfolioACFDisplayProps) {
  const acf = portfolio.acf;

  // Type-safe ACF field access based on category
  const getACFData = () => {
    switch (portfolio.category) {
      case "photography":
        return acf as PhotographyACF;
      case "videography":
      case "video-editing":
        return acf as VideographyACF;
      case "website":
        return acf as WebsiteACF;
      case "graphic-design":
      case "print":
      case "exhibition":
      case "campaign":
      case "producer":
        return acf as Record<string, unknown>;
      default:
        return acf;
    }
  };

  const acfData = getACFData();

  // Render ACF fields based on category
  const renderACFFields = () => {
    if (portfolio.category === "photography") {
      const photoACF = acfData as PhotographyACF;
      return (
        <VStack gap={6} align="start" w="full">
          {/* Photography Details */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {photoACF.camera_equipment && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <Camera size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    อุปกรณ์ถ่ายภาพ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {photoACF.camera_equipment}
                </Text>
              </VStack>
            )}

            {photoACF.photo_location && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <MapPin size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    สถานที่ถ่ายภาพ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {photoACF.photo_location}
                </Text>
              </VStack>
            )}

            {photoACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {photoACF.client_name}
                </Text>
              </VStack>
            )}

            {photoACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    วันที่ถ่ายภาพ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {photoACF.project_date}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {photoACF.photography_style && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                รูปแบบการถ่ายภาพ
              </Text>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                {photoACF.photography_style}
              </Badge>
            </VStack>
          )}

          {photoACF.project_description && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                รายละเอียดโปรเจค
              </Text>
              <Text
                fontSize="md"
                color="gray.700"

                lineHeight="1.8"
              >
                {photoACF.project_description}
              </Text>
            </VStack>
          )}
        </VStack>
      );
    }

    // Video ACF Display
    if (
      portfolio.category === "videography" ||
      portfolio.category === "video-editing"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoACF = acfData as any; // Use any since API fields don't match type exactly
      return (
        <VStack gap={6} align="start" w="full">
          {/* Video Details Grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {videoACF.video_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <Film size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ประเภทวีดีโอ
                  </Text>
                </HStack>
                <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                  {videoACF.video_type === "documentary"
                    ? "สารคดี"
                    : videoACF.video_type === "commercial"
                      ? "โฆษณา"
                      : videoACF.video_type === "music-video"
                        ? "มิวสิควิดีโอ"
                        : videoACF.video_type}
                </Badge>
              </VStack>
            )}

            {videoACF.video_duration && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <Clock size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ระยะเวลา
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {videoACF.video_duration}
                </Text>
              </VStack>
            )}

            {videoACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {videoACF.client_name}
                </Text>
              </VStack>
            )}

            {videoACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    วันที่ผลิต
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {videoACF.project_date}
                </Text>
              </VStack>
            )}

            {videoACF.video_equipment && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <Video size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    อุปกรณ์ถ่ายทำ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {videoACF.video_equipment}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {/* Video URL */}
          {videoACF.video_url && (
            <VStack align="start" gap={3} w="full">
              <HStack gap={2} color="accent.500">
                <Play size={18} />
                <Text fontSize="sm" fontWeight="600">
                  ดูวีดีโอ
                </Text>
              </HStack>
              <Box
                bg="accent.50"
                border="2px solid"
                borderColor="accent.200"
                borderRadius="lg"
                p={4}
                w="full"
                _hover={{
                  borderColor: "accent.400",
                  bg: "accent.100",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease",
                }}
                cursor="pointer"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(videoACF.video_url, "_blank");
                  }
                }}
              >
                <HStack gap={3}>
                  <Box bg="accent.500" borderRadius="full" p={2} color="white">
                    <Play size={16} fill="white" />
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontSize="md" fontWeight="600">
                      เปิดดูวีดีโอ
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      คลิกเพื่อดูใน YouTube
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          )}

          {/* Project Description */}
          {videoACF.project_description && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                รายละเอียดโปรเจค
              </Text>
              <Text
                fontSize="md"
                color="gray.700"

                lineHeight="1.8"
              >
                {videoACF.project_description}
              </Text>
            </VStack>
          )}
        </VStack>
      );
    }

    // Add other category-specific renders here
    if (portfolio.category === "website") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const webACF = acfData as any;
      return (
        <VStack gap={6} align="start" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {webACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {webACF.client_name}
                </Text>
              </VStack>
            )}

            {webACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    วันที่เสร็จสิ้น
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {webACF.project_date}
                </Text>
              </VStack>
            )}

            {webACF.website_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ประเภทเว็บไซต์
                  </Text>
                </HStack>
                <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
                  {webACF.website_type === "web_app"
                    ? "Web Application"
                    : webACF.website_type === "website"
                      ? "Website"
                      : webACF.website_type === "ecommerce"
                        ? "E-commerce"
                        : webACF.website_type === "cms"
                          ? "CMS"
                          : webACF.website_type}
                </Badge>
              </VStack>
            )}

            {webACF.project_role && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    บทบาทในโปรเจค
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {webACF.project_role === "full_development"
                    ? "Full Development"
                    : webACF.project_role === "frontend"
                      ? "Frontend Development"
                      : webACF.project_role === "backend"
                        ? "Backend Development"
                        : webACF.project_role}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {/* Website URL */}
          {webACF.website_url && (
            <VStack align="start" gap={3} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                เว็บไซต์
              </Text>
              <Box
                as="a"
                // @ts-expect-error - Chakra v3 polymorphic typing
                href={webACF.website_url}
                target="_blank"
                rel="noopener noreferrer"
                bg="blue.50"
                border="2px solid"
                borderColor="blue.200"
                borderRadius="lg"
                p={4}
                w="full"
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{
                  borderColor: "blue.400",
                  bg: "blue.100",
                  transform: "translateY(-2px)",
                }}
              >
                <HStack gap={3}>
                  <Box bg="blue.500" borderRadius="full" p={2} color="white">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontSize="md" fontWeight="600" color="blue.700">
                      เยี่ยมชมเว็บไซต์
                    </Text>
                    <Text
                      fontSize="sm"
                      color="blue.600"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      maxW="full"
                    >
                      {webACF.website_url}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          )}

          {/* Technologies */}
          {webACF.technologies_used && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                เทคโนโลยีที่ใช้
              </Text>
              <HStack gap={2} flexWrap="wrap">
                {webACF.technologies_used
                  .split(",")
                  .map((tech: string, index: number) => (
                    <Badge
                      key={index}
                      colorScheme="green"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {tech.trim()}
                    </Badge>
                  ))}
              </HStack>
            </VStack>
          )}

          {/* Project Description */}
          {webACF.project_description && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                รายละเอียดโปรเจค
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                _dark={{ color: "gray.300" }}

                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {webACF.project_description}
              </Text>
            </VStack>
          )}

          {/* Development Notes / Features */}
          {webACF.development_notes && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                ฟีเจอร์เด่น
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                _dark={{ color: "gray.300" }}

                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {webACF.development_notes}
              </Text>
            </VStack>
          )}
        </VStack>
      );
    }

    // Additional category support for future expansion
    if (portfolio.category === "graphic-design") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const designACF = acfData as any;
      return (
        <VStack gap={6} align="start" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {designACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {designACF.client_name}
                </Text>
              </VStack>
            )}

            {designACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    วันที่โครงการ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {designACF.project_date}
                </Text>
              </VStack>
            )}

            {designACF.design_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ประเภทงานออกแบบ
                  </Text>
                </HStack>
                <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                  {designACF.design_type === "social_media"
                    ? "Social Media"
                    : designACF.design_type === "logo"
                      ? "Logo"
                      : designACF.design_type === "branding"
                        ? "Branding"
                        : designACF.design_type === "poster"
                          ? "Poster"
                          : designACF.design_type === "brochure"
                            ? "Brochure"
                            : designACF.design_type}
                </Badge>
              </VStack>
            )}

            {designACF.software_used && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ซอฟต์แวร์ที่ใช้
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {designACF.software_used}
                </Text>
              </VStack>
            )}

            {designACF.print_specifications && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ขนาดงานพิมพ์
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {designACF.print_specifications}
                </Text>
              </VStack>
            )}

            {designACF.color_palette && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    Color Palette
                  </Text>
                </HStack>
                <HStack gap={2} flexWrap="wrap">
                  {designACF.color_palette
                    .split(",")
                    .map((color: string, index: number) => (
                      <HStack key={index} gap={2}>
                        <Box
                          w="24px"
                          h="24px"
                          bg={color.trim()}
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.300"
                        />
                        <Text fontSize="sm" fontFamily="mono" color="gray.600">
                          {color.trim()}
                        </Text>
                      </HStack>
                    ))}
                </HStack>
              </VStack>
            )}
          </SimpleGrid>

          {(designACF.design_concept || designACF.project_description) && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                รายละเอียดโปรเจค
              </Text>
              <Text
                fontSize="md"
                color="gray.700"

                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {designACF.project_description || designACF.design_concept}
              </Text>
            </VStack>
          )}
        </VStack>
      );
    }

    if (portfolio.category === "print") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const printACF = acfData as any;
      return (
        <VStack gap={6} align="start" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {printACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {printACF.client_name}
                </Text>
              </VStack>
            )}

            {printACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    วันที่โครงการ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {printACF.project_date}
                </Text>
              </VStack>
            )}

            {printACF.print_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ประเภทงานพิมพ์
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {printACF.print_type}
                </Text>
              </VStack>
            )}

            {printACF.print_specifications && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ข้อมูลจำเพาะ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {printACF.print_specifications}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {(printACF.printing_process || printACF.project_description) && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                {printACF.printing_process
                  ? "กระบวนการพิมพ์"
                  : "รายละเอียดโปรเจค"}
              </Text>
              <Text
                fontSize="md"
                color="gray.700"

                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {printACF.printing_process || printACF.project_description}
              </Text>
            </VStack>
          )}
        </VStack>
      );
    }

    if (portfolio.category === "exhibition") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exhibitionACF = acfData as any;
      return (
        <VStack gap={6} align="start" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {exhibitionACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {exhibitionACF.client_name}
                </Text>
              </VStack>
            )}

            {exhibitionACF.venue_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <MapPin size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    สถานที่
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {exhibitionACF.venue_name}
                </Text>
              </VStack>
            )}

            {exhibitionACF.exhibition_dates && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    วันที่จัดแสดง
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {exhibitionACF.exhibition_dates}
                </Text>
              </VStack>
            )}

            {exhibitionACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    วันที่โครงการ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {exhibitionACF.project_date}
                </Text>
              </VStack>
            )}

            {exhibitionACF.exhibition_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ประเภทนิทรรศการ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {exhibitionACF.exhibition_type}
                </Text>
              </VStack>
            )}

            {exhibitionACF.number_of_artworks && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    จำนวนชิ้นงาน
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {exhibitionACF.number_of_artworks}
                </Text>
              </VStack>
            )}

            {exhibitionACF.exhibition_medium && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    สื่อที่ใช้
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {exhibitionACF.exhibition_medium}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {exhibitionACF.project_description && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                รายละเอียดโปรเจค
              </Text>
              <Text
                fontSize="md"
                color="gray.700"

                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {exhibitionACF.project_description}
              </Text>
            </VStack>
          )}
        </VStack>
      );
    }

    if (portfolio.category === "campaign") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const campaignACF = acfData as any;
      return (
        <VStack gap={6} align="start" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {campaignACF.campaign_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ชื่อแคมเปญ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {campaignACF.campaign_name}
                </Text>
              </VStack>
            )}

            {campaignACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {campaignACF.client_name}
                </Text>
              </VStack>
            )}

            {campaignACF.campaign_duration && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <Clock size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ระยะเวลาแคมเปญ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {campaignACF.campaign_duration}
                </Text>
              </VStack>
            )}

            {campaignACF.target_audience && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    กลุ่มเป้าหมาย
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {campaignACF.target_audience}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {(campaignACF.campaign_objectives ||
            campaignACF.project_description) && (
              <VStack align="start" gap={2} w="full">
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="accent.500"

                >
                  {campaignACF.campaign_objectives
                    ? "วัตถุประสงค์แคมเปญ"
                    : "รายละเอียดโปรเจค"}
                </Text>
                <Text
                  fontSize="md"
                  color="gray.700"

                  lineHeight="1.8"
                  whiteSpace="pre-wrap"
                >
                  {campaignACF.campaign_objectives ||
                    campaignACF.project_description}
                </Text>
              </VStack>
            )}

          {campaignACF.campaign_results && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"

              >
                ผลลัพธ์แคมเปญ
              </Text>
              <Text
                fontSize="md"
                color="gray.700"

                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {campaignACF.campaign_results}
              </Text>
            </VStack>
          )}
        </VStack>
      );
    }

    if (portfolio.category === "producer") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const producerACF = acfData as any;
      return (
        <VStack gap={6} align="start" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {producerACF.production_title && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ชื่อผลงาน
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {producerACF.production_title}
                </Text>
              </VStack>
            )}

            {producerACF.production_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ประเภทผลงาน
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {producerACF.production_type}
                </Text>
              </VStack>
            )}

            {producerACF.production_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    วันที่ผลิต
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {producerACF.production_date}
                </Text>
              </VStack>
            )}

            {producerACF.budget_range && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ช่วงงบประมาณ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {producerACF.budget_range}
                </Text>
              </VStack>
            )}

            {producerACF.team_size && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600">
                    ขนาดทีม
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700">
                  {producerACF.team_size}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {(producerACF.producer_responsibilities ||
            producerACF.project_description) && (
              <VStack align="start" gap={2} w="full">
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="accent.500"

                >
                  {producerACF.producer_responsibilities
                    ? "หน้าที่ความรับผิดชอบ"
                    : "รายละเอียดโปรเจค"}
                </Text>
                <Text
                  fontSize="md"
                  color="gray.700"

                  lineHeight="1.8"
                  whiteSpace="pre-wrap"
                >
                  {producerACF.producer_responsibilities ||
                    producerACF.project_description}
                </Text>
              </VStack>
            )}
        </VStack>
      );
    }

    return null;
  };

  // Don't render if no ACF data
  if (!acf || Object.keys(acf).length === 0) {
    return null;
  }

  return (
    <Box>
      <Heading
        fontSize="xl"
        fontWeight="600"
        color="gray.800"

        mb={6}
      >
        ข้อมูลโปรเจค
      </Heading>
      {renderACFFields()}
    </Box>
  );
}

interface PortfolioGalleryProps {
  portfolio: PortfolioItem;
  loading?: boolean;
}

export function PortfolioGallery({
  portfolio,
  loading,
}: PortfolioGalleryProps) {
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get media items (featured image + images from content + ACF gallery)
  const mediaImages =
    portfolio.media?.filter((item) => item.type === "image") || [];

  // Combine featured image (if exists) with media images
  const images = [
    ...(portfolio.featured_image ? [portfolio.featured_image] : []),
    ...mediaImages,
  ];

  // Lightbox helper functions
  const openLightbox = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
      }
    };

    if (lightboxOpen) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [lightboxOpen, images.length, nextImage, prevImage]);

  if (loading) {
    return (
      <Box>
        <Skeleton height="24px" width="200px" mb={6} />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height="200px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (images.length === 0) {
    return null;
  }

  // Special layouts for different categories
  const isPhotography = portfolio.category === "photography";
  const isVideography = portfolio.category === "videography";
  const isVideoEditing = portfolio.category === "video-editing";
  const isWebsite = portfolio.category === "website";
  const isGraphicDesign = portfolio.category === "graphic-design";
  const isPrint = portfolio.category === "print";
  const isExhibition = portfolio.category === "exhibition";
  const isCampaign = portfolio.category === "campaign";
  const isProducer = portfolio.category === "producer";

  return (
    <Box>
      <Heading
        fontSize="xl"
        fontWeight="600"
        color="gray.800"

        mb={6}
      >
        {isPhotography
          ? `ภาพถ่าย (${images.length} ภาพ)`
          : isVideography
            ? `ภาพจากวีดีโอ (${images.length} ภาพ)`
            : isVideoEditing
              ? `ภาพจากการตัดต่อ (${images.length} ภาพ)`
              : isWebsite
                ? `ภาพหน้าจอเว็บไซต์ (${images.length} ภาพ)`
                : isGraphicDesign
                  ? `ผลงานออกแบบ (${images.length} ภาพ)`
                  : isPrint
                    ? `ผลงานพิมพ์ (${images.length} ภาพ)`
                    : isExhibition
                      ? `ภาพจากนิทรรศการ (${images.length} ภาพ)`
                      : isCampaign
                        ? `ภาพจากแคมเปญ (${images.length} ภาพ)`
                        : isProducer
                          ? `ภาพจากการผลิต (${images.length} ภาพ)`
                          : `แกลเลอรี่ (${images.length} ภาพ)`}
      </Heading>

      {isPhotography ? (
        /* Photography-optimized layout with natural proportions */
        <VStack gap={8} w="full">
          {/* Hero Image - First image larger */}
          <VStack w="full" gap={3}>
            <Box
              w="full"
              position="relative"
              overflow="hidden"
              borderRadius="xl"
              boxShadow="lg"
            >
              <Image
                src={images[0].url}
                alt={images[0].alt || "Featured Photography"}
                objectFit="contain"
                w="full"
                maxH="600px"
                cursor="pointer"
                transition="transform 0.3s ease"
                _hover={{
                  transform: "scale(1.02)",
                }}
                onClick={() => openLightbox(0)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.svg";
                }}
              />
            </Box>
            {images[0].caption && (
              <Text
                fontSize="sm"
                color="gray.600"

                fontStyle="italic"
                textAlign="center"
                px={4}
                dangerouslySetInnerHTML={{ __html: images[0].caption }}
              />
            )}
          </VStack>

          {/* Remaining images in responsive masonry */}
          {images.length > 1 && (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              gap={6}
              w="full"
              alignItems="start"
            >
              {images.slice(1).map((image, index) => (
                <VStack
                  key={image.id || index + 1}
                  gap={3}
                  align="stretch"
                  w="full"
                >
                  <Box
                    position="relative"
                    overflow="hidden"
                    borderRadius="lg"
                    boxShadow="md"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Photography ${index + 2}`}
                      objectFit="contain"
                      w="full"
                      maxH="400px"
                      cursor="pointer"
                      transition="transform 0.2s ease"
                      _hover={{
                        transform: "scale(1.05)",
                      }}
                      onClick={() => openLightbox(index + 1)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.svg";
                      }}
                    />
                  </Box>
                  {image.caption && (
                    <Text
                      fontSize="sm"
                      color="gray.600"

                      fontStyle="italic"
                      textAlign="center"
                      dangerouslySetInnerHTML={{ __html: image.caption }}
                    />
                  )}
                </VStack>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      ) : isVideography ? (
        /* Video-optimized layout */
        <VStack gap={6} w="full">
          {/* Video stills in cinematic layout */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {images.map((image, index) => (
              <AspectRatio key={image.id || index} ratio={16 / 9}>
                <Image
                  src={image.url}
                  alt={image.alt || `Video still ${index + 1}`}
                  objectFit="cover"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{
                    transform: "scale(1.02)",
                    transition: "transform 0.3s ease",
                    filter: "brightness(1.1)",
                  }}
                  onClick={() => openLightbox(index)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.svg";
                  }}
                />
              </AspectRatio>
            ))}
          </SimpleGrid>
        </VStack>
      ) : isWebsite ? (
        /* Website-optimized layout - screenshot style */
        <VStack gap={6} w="full">
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} w="full">
            {images.map((image, index) => (
              <AspectRatio key={image.id || index} ratio={16 / 10}>
                <Image
                  src={image.url}
                  alt={image.alt || `Website screenshot ${index + 1}`}
                  objectFit="cover"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  cursor="pointer"
                  _hover={{
                    transform: "scale(1.02)",
                    transition: "transform 0.3s ease",
                    borderColor: "brand.300",
                  }}
                  onClick={() => openLightbox(index)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.svg";
                  }}
                />
              </AspectRatio>
            ))}
          </SimpleGrid>
        </VStack>
      ) : isVideoEditing ? (
        /* Video editing layout - cinematic stills */
        <VStack gap={6} w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {images.map((image, index) => (
              <AspectRatio key={image.id || index} ratio={16 / 9}>
                <Image
                  src={image.url}
                  alt={image.alt || `Video editing still ${index + 1}`}
                  objectFit="cover"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{
                    transform: "scale(1.02)",
                    transition: "transform 0.3s ease",
                    filter: "brightness(1.1)",
                  }}
                  onClick={() => openLightbox(index)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.svg";
                  }}
                />
              </AspectRatio>
            ))}
          </SimpleGrid>
        </VStack>
      ) : isGraphicDesign || isPrint ? (
        /* Design/Print-optimized layout - focused on visual work */
        <VStack gap={6} w="full">
          {/* Featured design - first image larger */}
          {images.length > 0 && (
            <Box w="full" maxW="600px" mx="auto">
              <Image
                src={images[0].url}
                alt={images[0].alt || "Featured Design"}
                objectFit="contain"
                borderRadius="lg"
                cursor="pointer"
                maxH="500px"
                onClick={() => openLightbox(0)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.svg";
                }}
              />
            </Box>
          )}

          {/* Additional designs */}
          {images.length > 1 && (
            <SimpleGrid columns={{ base: 2, md: 3 }} gap={4} w="full">
              {images.slice(1).map((image, index) => (
                <AspectRatio key={image.id || index} ratio={1}>
                  <Image
                    src={image.url}
                    alt={image.alt || `Design ${index + 2}`}
                    objectFit="cover"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{
                      transform: "scale(1.05)",
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => openLightbox(index + 1)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.svg";
                    }}
                  />
                </AspectRatio>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      ) : (
        /* Standard grid layout for other categories (including exhibition) */
        <VStack gap={6} w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} w="full">
            {images.map((image, index) => (
              <VStack key={image.id || index} gap={3} align="stretch" w="full">
                <Box
                  position="relative"
                  overflow="hidden"
                  borderRadius="lg"
                  boxShadow="lg"
                  bg="white"
                  _dark={{ bg: "gray.800" }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    objectFit="contain"
                    w="full"
                    maxH="500px"
                    cursor="pointer"
                    transition="transform 0.3s ease"
                    _hover={{
                      transform: "scale(1.03)",
                    }}
                    onClick={() => openLightbox(index)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.svg";
                    }}
                  />
                </Box>
                {image.caption && (
                  <Box
                    bg="gray.50"
                    _dark={{ bg: "gray.700" }}
                    p={4}
                    borderRadius="md"
                  >
                    <Text
                      fontSize="sm"
                      color="gray.700"
                      _dark={{ color: "gray.200" }}

                      lineHeight="1.6"
                      dangerouslySetInnerHTML={{ __html: image.caption }}
                    />
                  </Box>
                )}
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.9)"
          zIndex="9999"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <IconButton
            position="absolute"
            top="20px"
            right="20px"
            aria-label="Close lightbox"
            bg="whiteAlpha.200"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            onClick={closeLightbox}
            size="lg"
            borderRadius="full"
          >
            <X size={24} />
          </IconButton>

          {/* Previous Button */}
          {images.length > 1 && (
            <IconButton
              position="absolute"
              left="20px"
              top="50%"
              transform="translateY(-50%)"
              aria-label="Previous image"
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              size="lg"
              borderRadius="full"
            >
              <ChevronLeft size={24} />
            </IconButton>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <IconButton
              position="absolute"
              right="20px"
              top="50%"
              transform="translateY(-50%)"
              aria-label="Next image"
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              size="lg"
              borderRadius="full"
            >
              <ChevronRight size={24} />
            </IconButton>
          )}

          {/* Main Image */}
          <Box maxW="90vw" maxH="90vh" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentImageIndex]?.url}
              alt={images[currentImageIndex]?.alt || "Lightbox image"}
              objectFit="contain"
              maxW="90vw"
              maxH="90vh"
              borderRadius="lg"
            />
          </Box>

          {/* Image Counter */}
          {images.length > 1 && (
            <Box
              position="absolute"
              bottom="20px"
              left="50%"
              transform="translateX(-50%)"
              bg="whiteAlpha.200"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
            >
              {currentImageIndex + 1} / {images.length}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
