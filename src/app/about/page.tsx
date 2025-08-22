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

export default function AboutPage() {
  const workExperience = [
    {
      year: "2566 - ปัจจุบัน",
      company: "ไทยพีบีเอส",
      position: "นักวิเคราะห์ข้อมูลและสื่อสารข้อมูลด้วยภาพ",
      description:
        "พัฒนาเนื้อหาสื่อดิจิทัลและการสื่อสารข้อมูลด้วยภาพรวมถึงการวิเคราะห์และแปลงข้อมูลซับซ้อนให้เป็นข้อมูลที่เข้าใจง่าย",
      responsibilities: [
        "วิเคราะห์ข้อมูลและสร้างการแสดงผลข้อมูลแบบ Interactive",
        "พัฒนาเว็บแอปพลิเคชันสำหรับการนำเสนอข้อมูลข่าว",
        "ร่วมงานกับทีมข่าวในการสร้างเนื้อหาสื่อดิจิทัล",
      ],
      current: true,
    },
    {
      year: "2562 - 2566",
      company: "มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน",
      position: "ผู้ดูแลเว็บไซต์",
      description:
        "รับผิดชอบการพัฒนาและดูแลเว็บไซต์องค์กร การจัดการเนื้อหาดิจิทัล และการสื่อสารออนไลน์เพื่อสนับสนุนการทำงานด้านสิทธิแรงงาน",
      responsibilities: [
        "พัฒนาและดูแลรักษาเว็บไซต์องค์กรและระบบจัดการเนื้อหา",
        "สร้างเนื้อหาสื่อดิจิทัลเพื่อรณรงค์สิทธิแรงงาน",
        "จัดการเว็บไซต์และช่องทางการสื่อสารออนไลน์",
        "ถ่ายภาพและวิดีโอเพื่อการประชาสัมพันธ์และเอกสารการทำงาน",
      ],
      current: false,
    },
    {
      year: "2564 - 2565",
      company: "Lanna Project",
      position: "ผู้ก่อตั้ง",
      description:
        "ก่อตั้งและบริหารองค์กรรับผลิตสื่อมุ่งเน้นการเล่าเรื่องปัญหาสังคมและสิ่งแวดล้อมในภาคเหนือผ่านการถ่ายภาพสารคดี วิดีโอ และสื่อดิจิทัล",
      responsibilities: [
        "วางแผนและดำเนินโครงการสื่อสารสังคมด้านสิ่งแวดล้อม",
        "ถ่ายภาพและวิดีโอสารคดีเพื่อการรณรงค์สังคม",
        "ประสานงานกับเครือข่ายองค์กรพัฒนาเอกชนและชุมชน",
        "พัฒนาเว็บไซต์และแพลตฟอร์มดิจิทัลสำหรับการเผยแพร่เนื้อหา",
      ],
      current: false,
    },
    {
      year: "2566",
      company: "พรรคก้าวไกล สาขาเชียงใหม่",
      position: "Social Media Manager",
      description:
        "จัดการกลยุทธ์สื่อสังคมออนไลน์สำหรับการสื่อสารการเมืองและการสร้างการมีส่วนร่วมของประชาชนในกระบวนการประชาธิปไตยในช่วงการเลือกตั้ง",
      responsibilities: [
        "วางแผนและดำเนินกลยุทธ์การสื่อสารผ่านโซเชียลมีเดีย",
        "สร้างเนื้อหาภาพและวิดีโอสำหรับการประชาสัมพันธ์นโยบาย",
        "จัดการชุมชนออนไลน์และตอบสนองต่อประชาชน",
        "วิเคราะห์ผลการเข้าถึงและประสิทธิภาพของเนื้อหา",
      ],
      current: false,
    },
    {
      year: "2561 - 2564",
      company: "Realframe",
      position: "ผู้ดูแลเว็บไซต์",
      description:
        "ดูแลเว็บไซต์ของ Realframe ซึ่งเป็นองค์กรภาพถ่ายเพื่อสิทธิมนุษยชน",
      responsibilities: [
        "ออกแบบ UI/UX สำหรับการเล่าเรื่องผ่านภาพที่เหมาะสม",
        "บำรุงรักษาและอัปเดตระบบเว็บไซต์",
      ],
      current: false,
    },
    {
      year: "2558",
      company: "หนังสือพิมพ์เดอะเนชั่น",
      position: "นักข่าวหนังสือพิมพ์",
      description:
        "รายงานข่าวด้านสังคม การเมือง และประเด็นสิ่งแวดล้อม พร้อมทั้งถ่ายภาพประกอบข่าวและสร้างเนื้อหาสำหรับแพลตฟอร์มดิจิทัล",
      responsibilities: [
        "เก็บข้อมูลและเขียนข่าวด้านสังคม",
        "ถ่ายภาพประกอบข่าวและภาพสารคดี",
        "สัมภาษณ์บุคคลสำคัญและผู้เกี่ยวข้องในประเด็นข่าว",
      ],
      current: false,
    },
  ];

  const awards = [
    {
      year: "2561",
      title: "รางวัลภาพถ่ายอันดับ 1",
      category: "หมวด Getting Outside",
      organization: "Olympus Global Open Photo Contest",
    },
    {
      year: "2560",
      title: "รางวัลภาพถ่ายอันดับ 3",
      category: "",
      organization: "Aurora Humanitarian Initiative",
    },
  ];

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
            {/* Profile Picture */}
            <Box>
              <AspectRatio
                ratio={1}
                w={{ base: "200px", md: "250px" }}
                mx="auto"
              >
                <Image
                  src="/image/profile-1.jpg"
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
                className="thai-text"
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
        className="full-width"
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
                  className="thai-text"
                >
                  ประวัติส่วนตัว
                </Heading>
              </HStack>
              <Text
                fontSize="lg"
                lineHeight="1.8"
                color={{ base: "gray.700", _dark: "gray.300" }}
                className="thai-text"
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
                  className="thai-text"
                >
                  ประสบการณ์การทำงาน
                </Heading>
              </HStack>
              <VStack gap={4} align="stretch">
                {workExperience.map((job, index) => (
                  <Box
                    key={index}
                    bg={{ base: "white", _dark: "gray.700" }}
                    p={6}
                    borderRadius="lg"
                    shadow="sm"
                    border="1px solid"
                    borderColor={{ base: "gray.200", _dark: "gray.600" }}
                  >
                    <VStack align="stretch" gap={4}>
                      <HStack justify="space-between" wrap="wrap" gap={2}>
                        <VStack align="start" gap={1} flex={1}>
                          <HStack gap={2}>
                            <Text
                              fontSize="lg"
                              fontWeight="600"
                              color={{ base: "gray.800", _dark: "white" }}
                              className="thai-text"
                            >
                              {job.company}
                            </Text>
                            {job.current && (
                              <Badge colorScheme="green" className="thai-text">
                                ปัจจุบัน
                              </Badge>
                            )}
                          </HStack>
                          <Text
                            fontSize="md"
                            color={{ base: "gray.600", _dark: "gray.300" }}
                            className="thai-text"
                          >
                            {job.position}
                          </Text>
                        </VStack>
                        <Text
                          fontSize="sm"
                          color={{ base: "gray.500", _dark: "gray.400" }}
                          className="thai-text"
                          fontWeight="500"
                        >
                          {job.year}
                        </Text>
                      </HStack>

                      {/* Job Description */}
                      <Text
                        fontSize="md"
                        color={{ base: "gray.700", _dark: "gray.300" }}
                        className="thai-text"
                        lineHeight="1.6"
                      >
                        {job.description}
                      </Text>

                      {/* Responsibilities */}
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color={{ base: "gray.800", _dark: "white" }}
                          className="thai-text"
                          mb={2}
                        >
                          หน้าที่ความรับผิดชอบ:
                        </Text>
                        <VStack align="stretch" gap={1}>
                          {job.responsibilities.map((responsibility, idx) => (
                            <Text
                              key={idx}
                              fontSize="sm"
                              color={{ base: "gray.600", _dark: "gray.300" }}
                              className="thai-text"
                              pl={4}
                              position="relative"
                              _before={{
                                content: '"•"',
                                position: "absolute",
                                left: 0,
                                color: "accent.500",
                                fontWeight: "bold",
                              }}
                            >
                              {responsibility}
                            </Text>
                          ))}
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
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
                  className="thai-text"
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
                          className="thai-text"
                        >
                          {award.year}
                        </Badge>
                      </HStack>
                      <VStack align="start" gap={1}>
                        <Text
                          fontSize="lg"
                          fontWeight="600"
                          color={{ base: "gray.800", _dark: "white" }}
                          className="thai-text"
                        >
                          {award.title}
                        </Text>
                        {award.category && (
                          <Text
                            fontSize="sm"
                            color={{ base: "gray.600", _dark: "gray.300" }}
                            className="thai-text"
                          >
                            {award.category}
                          </Text>
                        )}
                        <Text
                          fontSize="md"
                          color={{ base: "gray.700", _dark: "gray.200" }}
                          className="thai-text"
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
