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
import { T } from "@/lib/tokens";

export default function AboutClient() {
  return (
    <Layout>
      {/* Hero */}
      <Box
        as="section"
        bg={T.bg}
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
              color={T.text}
              letterSpacing="-0.025em"
            >
              เกี่ยวกับ
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={T.textMuted}
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
      <Box w="100%" display="flex" justifyContent="center" bg={T.bg} aria-hidden="true">
        <Box w="60px" h="1px" bg={T.border} />
      </Box>

      {/* Experience */}
      <Box
        as="section"
        bg={T.bg}
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
              color={T.textDim}
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
      <Box w="100%" display="flex" justifyContent="center" bg={T.bg} aria-hidden="true">
        <Box w="60px" h="1px" bg={T.border} />
      </Box>

      {/* Awards */}
      <Box
        as="section"
        bg={T.bg}
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
              color={T.textDim}
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
                      color={T.text}
                    >
                      {award.title}
                    </Text>
                    <Text
                      fontSize="sm"
                      color={T.textMuted}
                    >
                      {award.organization}
                      {award.category && ` — ${award.category}`}
                    </Text>
                  </VStack>
                  <Text
                    fontSize="sm"
                    color={T.textDim}
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
