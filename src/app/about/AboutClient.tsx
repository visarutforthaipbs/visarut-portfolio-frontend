"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Layout } from "@/components/layout";
import { workExperience, awards } from "@/constants/data";
import { ExperienceItem } from "@/components/ui/ExperienceItem";

export default function AboutClient() {
  return (
    <Layout>
      {/* Hero */}
      <Box
        as="section"
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 20, md: 28 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="เกี่ยวกับ"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={5} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={{ base: "gray.900", _dark: "white" }}
              letterSpacing="-0.025em"
            >
              เกี่ยวกับ
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={{ base: "gray.500", _dark: "gray.400" }}
              lineHeight="1.8"
              maxW="560px"
            >
              วิศรุต แสนคำ ผู้ผลิตสื่อหลายรูปแบบ
              โดยมีความเชี่ยวชาญเป็นพิเศษกับภาคประชาสังคม องค์กรพัฒนาเอกชน
              และสถาบันการศึกษามากกว่า ซึ่งเขาได้ร่วมทำงานมายาวนานกว่า 10 ปี
              (ตั้งแต่ปี พ.ศ. 2560)
              โดยการทำงานของวิศรุตมุ่งมั่นในการเล่าเรื่องประเด็นทางสังคมผ่านงานสื่อที่เหมาะสมกับเนื้อหา
              เพื่อส่งเสริมการรับรู้และขับเคลื่อนการเปลี่ยนแปลงเชิงสังคม
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Divider */}
      <Box w="100%" display="flex" justifyContent="center" bg={{ base: "white", _dark: "gray.900" }} aria-hidden="true">
        <Box w="60px" h="1px" bg={{ base: "gray.200", _dark: "gray.700" }} />
      </Box>

      {/* Experience */}
      <Box
        as="section"
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="ประสบการณ์"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8} align="stretch">
            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="medium"
              color={{ base: "gray.400", _dark: "gray.500" }}
              textTransform="uppercase"
              letterSpacing="wider"
              textAlign="center"
            >
              ประสบการณ์
            </Heading>
            <VStack gap={4} align="stretch">
              {workExperience.map((job, index) => (
                <ExperienceItem key={index} {...job} />
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Divider */}
      <Box w="100%" display="flex" justifyContent="center" bg={{ base: "white", _dark: "gray.900" }} aria-hidden="true">
        <Box w="60px" h="1px" bg={{ base: "gray.200", _dark: "gray.700" }} />
      </Box>

      {/* Awards */}
      <Box
        as="section"
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="รางวัล"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8} align="stretch">
            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="medium"
              color={{ base: "gray.400", _dark: "gray.500" }}
              textTransform="uppercase"
              letterSpacing="wider"
              textAlign="center"
            >
              รางวัล
            </Heading>
            <VStack gap={6} align="stretch">
              {awards.map((award, index) => (
                <HStack
                  key={index}
                  justify="space-between"
                  align="start"
                  py={2}
                  flexWrap="wrap"
                  gap={2}
                >
                  <VStack align="start" gap={0.5}>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="medium"
                      color={{ base: "gray.800", _dark: "white" }}
                    >
                      {award.title}
                    </Text>
                    <Text
                      fontSize="sm"
                      color={{ base: "gray.500", _dark: "gray.400" }}
                    >
                      {award.organization}
                      {award.category && ` — ${award.category}`}
                    </Text>
                  </VStack>
                  <Text
                    fontSize="sm"
                    color={{ base: "gray.400", _dark: "gray.500" }}
                    flexShrink={0}
                  >
                    {award.year}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
