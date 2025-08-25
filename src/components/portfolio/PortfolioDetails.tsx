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
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    อุปกรณ์ถ่ายภาพ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {photoACF.camera_equipment}
                </Text>
              </VStack>
            )}

            {photoACF.photo_location && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <MapPin size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    สถานที่ถ่ายภาพ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {photoACF.photo_location}
                </Text>
              </VStack>
            )}

            {photoACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {photoACF.client_name}
                </Text>
              </VStack>
            )}

            {photoACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    วันที่ถ่ายภาพ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
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
                className="thai-text"
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
                className="thai-text"
              >
                รายละเอียดโปรเจค
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
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
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
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
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ระยะเวลา
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {videoACF.video_duration}
                </Text>
              </VStack>
            )}

            {videoACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {videoACF.client_name}
                </Text>
              </VStack>
            )}

            {videoACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    วันที่ผลิต
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {videoACF.project_date}
                </Text>
              </VStack>
            )}

            {videoACF.video_equipment && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <Video size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    อุปกรณ์ถ่ายทำ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
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
                <Text fontSize="sm" fontWeight="600" className="thai-text">
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
                    <Text fontSize="md" fontWeight="600" className="thai-text">
                      เปิดดูวีดีโอ
                    </Text>
                    <Text fontSize="sm" color="gray.600" className="thai-text">
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
                className="thai-text"
              >
                รายละเอียดโปรเจค
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
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
      const webACF = acfData as WebsiteACF;
      return (
        <VStack gap={6} align="start" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {webACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {webACF.client_name}
                </Text>
              </VStack>
            )}

            {webACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    วันที่เสร็จสิ้น
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {webACF.project_date}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {webACF.technologies && webACF.technologies.length > 0 && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"
                className="thai-text"
              >
                เทคโนโลยี
              </Text>
              <HStack gap={2} flexWrap="wrap">
                {webACF.technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    colorScheme="green"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {tech}
                  </Badge>
                ))}
              </HStack>
            </VStack>
          )}

          {webACF.project_description && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"
                className="thai-text"
              >
                รายละเอียดโปรเจค
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
                lineHeight="1.8"
              >
                {webACF.project_description}
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
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {designACF.client_name}
                </Text>
              </VStack>
            )}

            {designACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    วันที่โครงการ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {designACF.project_date}
                </Text>
              </VStack>
            )}

            {designACF.design_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ประเภทงานออกแบบ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {designACF.design_type}
                </Text>
              </VStack>
            )}

            {designACF.software_used && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ซอฟต์แวร์ที่ใช้
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {designACF.software_used}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {designACF.design_concept && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"
                className="thai-text"
              >
                แนวคิดการออกแบบ
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {designACF.design_concept}
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
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {printACF.client_name}
                </Text>
              </VStack>
            )}

            {printACF.project_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    วันที่โครงการ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {printACF.project_date}
                </Text>
              </VStack>
            )}

            {printACF.print_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ประเภทงานพิมพ์
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {printACF.print_type}
                </Text>
              </VStack>
            )}

            {printACF.print_specifications && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ข้อมูลจำเพาะ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {printACF.print_specifications}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {printACF.printing_process && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"
                className="thai-text"
              >
                กระบวนการพิมพ์
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
                lineHeight="1.8"
              >
                {printACF.printing_process}
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
            {exhibitionACF.exhibition_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ชื่อนิทรรศการ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {exhibitionACF.exhibition_name}
                </Text>
              </VStack>
            )}

            {exhibitionACF.venue && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <MapPin size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    สถานที่
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {exhibitionACF.venue}
                </Text>
              </VStack>
            )}

            {exhibitionACF.exhibition_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    วันที่จัดแสดง
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {exhibitionACF.exhibition_date}
                </Text>
              </VStack>
            )}

            {exhibitionACF.role_in_exhibition && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    บทบาทในนิทรรศการ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {exhibitionACF.role_in_exhibition}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {exhibitionACF.exhibition_description && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"
                className="thai-text"
              >
                รายละเอียดนิทรรศการ
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {exhibitionACF.exhibition_description}
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
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ชื่อแคมเปญ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {campaignACF.campaign_name}
                </Text>
              </VStack>
            )}

            {campaignACF.client_name && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ลูกค้า
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {campaignACF.client_name}
                </Text>
              </VStack>
            )}

            {campaignACF.campaign_duration && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <Clock size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ระยะเวลาแคมเปญ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {campaignACF.campaign_duration}
                </Text>
              </VStack>
            )}

            {campaignACF.target_audience && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    กลุ่มเป้าหมาย
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {campaignACF.target_audience}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {campaignACF.campaign_objectives && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"
                className="thai-text"
              >
                วัตถุประสงค์แคมเปญ
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {campaignACF.campaign_objectives}
              </Text>
            </VStack>
          )}

          {campaignACF.campaign_results && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"
                className="thai-text"
              >
                ผลลัพธ์แคมเปญ
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
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
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ชื่อผลงาน
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {producerACF.production_title}
                </Text>
              </VStack>
            )}

            {producerACF.production_type && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ประเภทผลงาน
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {producerACF.production_type}
                </Text>
              </VStack>
            )}

            {producerACF.production_date && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <CalendarIcon size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    วันที่ผลิต
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {producerACF.production_date}
                </Text>
              </VStack>
            )}

            {producerACF.budget_range && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ช่วงงบประมาณ
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {producerACF.budget_range}
                </Text>
              </VStack>
            )}

            {producerACF.team_size && (
              <VStack align="start" gap={2}>
                <HStack gap={2} color="accent.500">
                  <User size={18} />
                  <Text fontSize="sm" fontWeight="600" className="thai-text">
                    ขนาดทีม
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.700" className="thai-text">
                  {producerACF.team_size}
                </Text>
              </VStack>
            )}
          </SimpleGrid>

          {producerACF.producer_responsibilities && (
            <VStack align="start" gap={2} w="full">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="accent.500"
                className="thai-text"
              >
                หน้าที่ความรับผิดชอบ
              </Text>
              <Text
                fontSize="md"
                color="gray.700"
                className="thai-text"
                lineHeight="1.8"
                whiteSpace="pre-wrap"
              >
                {producerACF.producer_responsibilities}
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
        className="thai-text"
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
        className="thai-text"
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
          <Box w="full">
            <Image
              src={images[0].url}
              alt={images[0].alt || "Featured Photography"}
              objectFit="contain"
              w="full"
              maxH="600px"
              borderRadius="xl"
              cursor="pointer"
              _hover={{
                transform: "scale(1.01)",
                transition: "transform 0.3s ease",
              }}
              onClick={() => openLightbox(0)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.svg";
              }}
            />
          </Box>

          {/* Remaining images in responsive masonry */}
          {images.length > 1 && (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              gap={6}
              w="full"
              alignItems="start"
            >
              {images.slice(1).map((image, index) => (
                <Box key={image.id || index + 1}>
                  <Image
                    src={image.url}
                    alt={image.alt || `Photography ${index + 2}`}
                    objectFit="contain"
                    w="full"
                    maxH="400px"
                    borderRadius="lg"
                    cursor="pointer"
                    _hover={{
                      transform: "scale(1.02)",
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => openLightbox(index + 1)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.svg";
                    }}
                  />
                </Box>
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
        /* Standard grid layout for other categories */
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {images.map((image, index) => (
            <AspectRatio key={image.id || index} ratio={4 / 3}>
              <Image
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                objectFit="cover"
                borderRadius="lg"
                cursor="pointer"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "transform 0.2s ease",
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
