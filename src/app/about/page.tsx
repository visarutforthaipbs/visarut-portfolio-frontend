"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Separator,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import { Award, Calendar, User } from "lucide-react";
import { Layout } from "@/components/layout";
import { workExperience, awards } from "@/constants/data";
import { ExperienceItem } from "@/components/ui/ExperienceItem";

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}

        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8} textAlign="center">
            {/* Profile Picture */}
            <Box>
              <AspectRatio
                ratio={1}
                w={{ base: "200px", md: "250px" }}
                mx="auto"
              >
                <Image
                  src="/image/profile.png"
                  alt="วิศรุต แสนคำ - นักสื่อสารและช่างภาพสารคดี"
                  objectFit="cover"
                  borderRadius="full"
                  border="4px solid"
                  borderColor="accent.500"
                  shadow="lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.jpg";
                  }}
                />
              </AspectRatio>
            </Box>

            <VStack gap={4}>
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="bold"
                color={{ base: "gray.800", _dark: "white" }}

              >
                เกี่ยวกับ วิศรุต แสนคำ
              </Heading>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* About Content */}
      <Box
        bg={{ base: "gray.50", _dark: "gray.800" }}
        py={{ base: 16, md: 20 }}

        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" px={{ base: 6, md: 8 }}>
          <VStack gap={12} align="stretch" w="full">
            {/* Bio Section */}
            <Box>
              <HStack gap={3} mb={6}>
                <User size={24} />
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  color={{ base: "gray.800", _dark: "white" }}

                >
                  ประวัติส่วนตัว
                </Heading>
              </HStack>
              <Text
                fontSize="lg"
                lineHeight="1.8"
                color={{ base: "gray.700", _dark: "gray.300" }}

              >
                วิศรุต แสนคำ ผู้ผลิตสื่อหลายรูปแบบ
                โดยมีความเชี่ยวชาญเป็นพิเศษกับภาคประชาสังคม องค์กรพัฒนาเอกชน
                และสถาบันการศึกษามากกว่า ซึ่งเขาได้ร่วมทำงานมายาวนานกว่า 10 ปี
                (ตั้งแต่ปี พ.ศ. 2560)
                โดยการทำงานของวิศรุตมุ่งมั่นในการเล่าเรื่องประเด็นทางสังคมผ่านงานสื่อที่เหมาะสมกับเนื้อหา
                เพื่อส่งเสริมการรับรู้และขับเคลื่อนการเปลี่ยนแปลงเชิงสังคม
              </Text>
            </Box>

            <Separator />

            {/* Work Experience Section */}
            <Box>
              <HStack gap={3} mb={6}>
                <Calendar size={24} />
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  color={{ base: "gray.800", _dark: "white" }}

                >
                  ประสบการณ์การทำงาน
                </Heading>
              </HStack>
              <VStack gap={4} align="stretch">
                {workExperience.map((job, index) => (
                  <ExperienceItem key={index} {...job} />
                ))}
              </VStack>
            </Box>

            <Separator />

            {/* Awards Section */}
            <Box>
              <HStack gap={3} mb={6}>
                <Award size={24} />
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  color={{ base: "gray.800", _dark: "white" }}

                >
                  รางวัลที่เคยได้รับ
                </Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {awards.map((award, index) => (
                  <Box
                    key={index}
                    bg={{ base: "white", _dark: "gray.700" }}
                    p={6}
                    borderRadius="lg"
                    shadow="sm"
                    border="1px solid"
                    borderColor={{ base: "gray.200", _dark: "gray.600" }}
                    position="relative"
                    _hover={{
                      transform: "translateY(-2px)",
                      shadow: "md",
                    }}
                    transition="all 0.3s ease"
                  >
                    <VStack align="start" gap={3}>
                      <HStack gap={2}>
                        <Badge
                          bg="accent.500"
                          color="white"
                          px={3}
                          py={1}
                          borderRadius="full"

                        >
                          {award.year}
                        </Badge>
                      </HStack>
                      <VStack align="start" gap={1}>
                        <Text
                          fontSize="lg"
                          fontWeight="600"
                          color={{ base: "gray.800", _dark: "white" }}

                        >
                          {award.title}
                        </Text>
                        {award.category && (
                          <Text
                            fontSize="sm"
                            color={{ base: "gray.600", _dark: "gray.300" }}

                          >
                            {award.category}
                          </Text>
                        )}
                        <Text
                          fontSize="md"
                          color={{ base: "gray.700", _dark: "gray.200" }}

                          fontWeight="500"
                        >
                          {award.organization}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
