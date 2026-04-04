"use client";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { Layout } from "@/components/layout";
import { T } from "@/lib/tokens";

export default function FontTestPage() {
  return (
    <Layout>
      <Box py={16} bg={T.bg}>
        <Container maxW="4xl">
          <VStack gap={8} align="start">
            <Heading fontSize="3xl" mb={4} color={T.text}>
              DB Helvethaica Font Test
            </Heading>

            <VStack gap={6} align="start" w="full">
              <Box>
                <Text fontSize="sm" color={T.textDim} mb={2}>
                  Font Weight: 400 (Regular)
                </Text>
                <Text fontSize="xl" fontWeight="400" color={T.text}>
                  วิศรุต แสนคำ - ผู้เชี่ยวชาญด้านสื่อ
                </Text>
                <Text fontSize="xl" fontWeight="400" color={T.text}>
                  Visarut Sankham - Media Professional
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color={T.textDim} mb={2}>
                  Font Weight: 500 (Medium)
                </Text>
                <Text fontSize="xl" fontWeight="500" color={T.text}>
                  วิศรุต แสนคำ - ผู้เชี่ยวชาญด้านสื่อ
                </Text>
                <Text fontSize="xl" fontWeight="500" color={T.text}>
                  Visarut Sankham - Creative Professional
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color={T.textDim} mb={2}>
                  Font Weight: 700 (Bold)
                </Text>
                <Text fontSize="xl" fontWeight="700" color={T.text}>
                  วิศรุต แสนคำ - ผู้เชี่ยวชาญด้านสื่อ
                </Text>
                <Text fontSize="xl" fontWeight="700" color={T.text}>
                  Visarut Sankham - Creative Professional
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color={T.textDim} mb={2}>
                  Sample Paragraph
                </Text>
                <Text fontSize="lg" lineHeight="1.6" color={T.textMuted}>
                  เราให้บริการครบวงจรด้านสื่อและการสื่อสาร
                  ไม่ว่าจะเป็นการถ่ายภาพ การถ่ายวิดีโอ การพัฒนาเว็บไซต์
                  หรือการออกแบบกราฟิก
                  ด้วยประสบการณ์และความเชี่ยวชาญที่สั่งสมมาอย่างยาวนาน
                </Text>
                <Text fontSize="lg" lineHeight="1.6" mt={4} color={T.textMuted}>
                  We provide comprehensive media and communication services,
                  including photography, videography, web development, and
                  graphic design. With years of accumulated experience and
                  expertise in the creative industry.
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color={T.textDim} mb={2}>
                  Different Font Sizes
                </Text>
                <VStack gap={2} align="start">
                  <Text fontSize="sm" color={T.textMuted}>Small text - ข้อความขนาดเล็ก</Text>
                  <Text fontSize="md" color={T.textMuted}>Medium text - ข้อความขนาดกลาง</Text>
                  <Text fontSize="lg" color={T.textMuted}>Large text - ข้อความขนาดใหญ่</Text>
                  <Text fontSize="xl" color={T.text}>
                    Extra Large text - ข้อความขนาดใหญ่พิเศษ
                  </Text>
                  <Text fontSize="2xl" color={T.text}>2XL text - ข้อความขนาด 2XL</Text>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
