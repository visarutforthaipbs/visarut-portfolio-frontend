"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Separator,
  SimpleGrid,
  Button,
  Link,
} from "@chakra-ui/react";
import { Layout } from "@/components/layout";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { JsonLd } from "@/components/JsonLd";

// Dynamically import ReactCompareImage to avoid SSR issues
const ReactCompareImage = dynamic(() => import("react-compare-image"), {
  ssr: false,
});

// CTA Button Component
const CTAButton = ({
  size = "lg",
}: {
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}) => (
  <Link
    href="https://docs.google.com/forms/d/e/1FAIpQLSdxdTy2w99szZgmk6yvfiVkE4PZSv6N7-ofgFX8n3AZ3C5VlA/viewform"
    target="_blank"
    rel="noopener noreferrer"
    textDecoration="none"
  >
    <Button
      size={size}
      bg="gray.800"
      color="white"
      _hover={{
        bg: "gray.700",
        transform: "translateY(-2px)",
        boxShadow: "lg",
      }}
      _active={{
        bg: "gray.900",
        transform: "translateY(0)",
      }}
      transition="all 0.2s"
      px={8}
      py={6}
      fontSize={{ base: "md", md: "lg" }}
      fontWeight="600"
      borderRadius="full"

      _focus={{ boxShadow: "outline" }}
    >
      โหลด Preset ได้ที่นี่
    </Button>
  </Link>
);

export default function PersonalProjectsPage() {
  // Load EmbedSocial iframe bridge script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mirrorapp/iframe-bridge@latest/dist/index.umd.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "#PHOTOFORAIR - เปลี่ยนภาพเพื่ออากาศที่เท่ากัน",
    description:
      "แคมเปญสังคมที่ใช้ Photography Preset เพื่อระดมทุนซื้อหน้ากาก N95 แจกจ่ายให้แรงงานข้ามชาติในเชียงใหม่ ช่วยลดความเหลื่อมล้ำในการเข้าถึงอากาศบริสุทธิ์",
    creator: {
      "@type": "Person",
      name: "Visarut Sankham",
      url: "https://visarut.com",
    },
    datePublished: "2021-02-01",
    inLanguage: "th-TH",
    about: {
      "@type": "Thing",
      name: "วิกฤตฝุ่นควัน PM2.5 ในเชียงใหม่",
    },
    keywords:
      "PHOTOFORAIR, CNXPM2.5, ฝุ่นควัน, PM2.5, เชียงใหม่, แคมเปญสังคม, แรงงานข้ามชาติ, หน้ากาก N95",
    image: {
      "@type": "ImageObject",
      url: "https://visarut.com/image/pfa/x2-1-2.jpg",
      width: 1200,
      height: 630,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "13016",
      ratingCount: "1",
      bestRating: "100000",
      worstRating: "0",
      description: "จำนวนเงินที่ได้จากการขาย Preset (บาท)",
    },
  };

  return (
    <Layout>
      <JsonLd data={structuredData} />

      {/* Hero Section with Background Image */}
      <Box
        as="section"
        role="region"
        aria-label="#PHOTOFORAIR"
        position="relative"
        w="100vw"
        h={{ base: "60vh", md: "70vh" }}
        overflow="hidden"
        left="50%"
        right="50%"
        ml="-50vw"
        mr="-50vw"
      >
        {/* Background Image */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundImage="url('/image/pfa/x2-1-2.jpg')"
          backgroundSize="cover"
          backgroundPosition="bottom"
          backgroundRepeat="no-repeat"
          _after={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "blackAlpha.500",
          }}
        />

        {/* Hero Content */}
        <Box
          h="full"
          position="relative"
          zIndex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={{ base: 6, md: 8 }}
        >
          <VStack gap={4} align="center" w="full" maxW="1200px">
            <HStack gap={3} justify="center">
              <Badge
                bg="gray.600"
                color="white"
                px={4}
                py={2}
                borderRadius="full"

                fontSize="md"
              >
                Social Campaign
              </Badge>
              <Badge
                bg="gray.500"
                color="white"
                px={4}
                py={2}
                borderRadius="full"

                fontSize="md"
              >
                Photography
              </Badge>
            </HStack>
            <Heading
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="bold"
              color="white"

              textShadow="0 2px 10px rgba(0,0,0,0.3)"
              textAlign="center"
            >
              #PHOTOFORAIR
            </Heading>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              color="white"

              textShadow="0 2px 8px rgba(0,0,0,0.3)"
              textAlign="center"
            >
              เปลี่ยนภาพถ่ายเพื่ออากาศที่เท่ากัน
            </Text>
            {/* Campaign Stats */}
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={6}
              w="full"
              maxW="2xl"
            >
              <Box
                bg={{ base: "white", _dark: "gray.800" }}
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={{ base: "gray.200", _dark: "gray.700" }}
                boxShadow="sm"
              >
                <VStack gap={2} align="center">
                  <Text fontSize="sm" color="gray.600" className="thai-text">
                    จำนวนเงินที่ได้แล้ว
                  </Text>
                  <Heading
                    fontSize="3xl"
                    color="gray.800"

                  >
                    13,016 บาท
                  </Heading>
                </VStack>
              </Box>
              <Box
                bg={{ base: "white", _dark: "gray.800" }}
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={{ base: "gray.200", _dark: "gray.700" }}
                boxShadow="sm"
              >
                <VStack gap={2} align="center">
                  <Text fontSize="sm" color="gray.600" className="thai-text">
                    จำนวนหน้ากาก N95
                  </Text>
                  <Heading
                    fontSize="3xl"
                    color="gray.800"

                  >
                    591 ชิ้น
                  </Heading>
                </VStack>
              </Box>
            </SimpleGrid>

            {/* CTA Button in Hero */}
            <CTAButton />
          </VStack>
        </Box>
      </Box>

      <Separator />

      {/* Why We Do This - Rationale */}
      <VStack
        as="section"
        role="region"
        aria-label="ที่มาของแคมเปญ"
        gap={6}
        align="start"
        w="full"
        maxW="3xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
      >
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color={{ base: "gray.800", _dark: "white" }}

          textAlign="center"
          w="full"
          paddingTop={{ base: 12, md: 20 }}
        >
          แม้แต่อากาศหายใจของเรายังไม่เท่ากัน
        </Heading>

        <Text
          fontSize={{ base: "sm", md: "lg" }}
          color={{ base: "gray.700", _dark: "gray.300" }}

          lineHeight="1.8"
          textAlign="left"
        >
          ปัญหาฝุ่นควัน PM2.5
          ในเชียงใหม่วิกฤตจนทำให้มีผู้เสียชีวิตจากการดับไฟป่า 5 คนในปีที่แล้ว
          และส่งผลกระทบโดยตรงต่อสุขภาพส่วนตัวของผู้เขียนจนเลือดกำเดาไหลขณะหาข้อมูลเรื่องนี้
          การอยู่ในเชียงใหม่ 1 เดือน ในช่วงวิกฤตฝุ่นควัน
          เปรียบได้กับการสูบบุหรี่ 120 มวน หรือทำให้ชีวิตสั้นลงประมาณ 1
          วันต่อเดือน
        </Text>

        <Text
          fontSize={{ base: "sm", md: "lg" }}
          color={{ base: "gray.700", _dark: "gray.300" }}

          lineHeight="1.8"
          textAlign="left"
        >
          หลายคนต้องใช้ชีวิตกว่า 3 เดือนภายใต้หมอกควันพิษตลอด 24 ชั่วโมง
          การป้องกันตัวด้วยเครื่องฟอกอากาศ (ราคาเริ่มต้นกว่า 3,000 บาท)
          และหน้ากาก N95 ได้กลายเป็น &ldquo;ของหรูหรา&rdquo; สำหรับคนจำนวนมาก
          โดยเฉพาะกลุ่มคนจนและแรงงานข้ามชาติที่มีรายได้จำกัดและไม่สามารถเข้าถึงอุปกรณ์เหล่านี้ได้
          ทั้งที่ตามสถิติมีคนอย่างน้อยกว่า 100,000
          คนในเชียงใหม่ที่ต้องการอากาศบริสุทธิ์
        </Text>

        <Text
          fontSize={{ base: "sm", md: "lg" }}
          color={{ base: "gray.700", _dark: "gray.300" }}

          lineHeight="1.8"
          textAlign="left"
        >
          กลุ่มแรงงานข้ามชาติที่ทำงานเสี่ยงอยู่แล้ว มองว่าฝุ่นควัน PM2.5
          เป็นเพียงปัญหาเล็กน้อยเมื่อเทียบกับปัญหาหลักด้านรายได้และความมั่นคง
          แต่ทำได้เพียงใช้หน้ากากอนามัยราคาถูก เพราะหน้ากาก N95
          ราคาสูงเกินกำลังซื้อ ส่งผลให้แม้จะเผชิญวิกฤตเดียวกัน
          แต่ได้รับผลกระทบไม่เท่ากัน
        </Text>

        <Box
          bg={{ base: "gray.100", _dark: "gray.800" }}
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          borderLeft="6px"
          borderColor="gray.600"
          w="full"
        >
          <Text
            fontSize={{ base: "md", md: "xl" }}
            color={{ base: "gray.800", _dark: "white" }}

            lineHeight="1.8"
            fontWeight="600"
            textAlign="left"
          >
            ผมเชื่อว่า &ldquo;เราไม่ควรที่จะต้องจ่ายเพื่อหายใจ&rdquo;
            อากาศบริสุทธิ์ควรเป็นสิทธิ์ที่ทุกคนเข้าถึงได้เท่าเทียมกัน
            ในระหว่างที่รอการแก้ไขปัญหาฝุ่นควันอย่างยั่งยืน
            จึงต้องการลดความเหลื่อมล้ำนี้ผ่านแคมเปญระดมทุนจากการขาย Preset
            รูปถ่าย &ldquo;CNXPM2.5&rdquo; เพื่อนำเงินไปซื้อหน้ากาก N95
            แจกจ่ายให้แรงงานข้ามชาติในเชียงใหม่
            เพื่อให้ทุกคนได้หายใจในอากาศบริสุทธิ์ที่เท่าเทียมกันมากขึ้น
          </Text>
        </Box>

        {/* CTA Button after Rationale */}
        <Box display="flex" justifyContent="center" w="full" mt={8}>
          <CTAButton />
        </Box>
      </VStack>

      <Box
        display="flex"
        justifyContent="center"
        w="full"
        pt={{ base: 12, md: 16 }}
      >
        <Separator w="60%" maxW="600px" />
      </Box>

      {/* Collaboration Section */}
      <VStack
        as="section"
        role="region"
        aria-label="ความร่วมมือ"
        gap={6}
        align="start"
        w="full"
        maxW="3xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 12, md: 16 }}
      >
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color={{ base: "gray.800", _dark: "white" }}

          textAlign="center"
          w="full"
        >
          ความร่วมมือ
        </Heading>

        <Box
          bg={{ base: "gray.50", _dark: "gray.800" }}
          p={{ base: 4, sm: 6, md: 8 }}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={{ base: "gray.200", _dark: "gray.700" }}
          w="full"
        >
          <VStack gap={4} align="start">
            <Box w="full">
              <Heading
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="600"
                color={{ base: "gray.800", _dark: "white" }}

                mb={2}
              >
                ร่วมมือกับ ตี่ต่าง
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "lg" }}
                color={{ base: "gray.700", _dark: "gray.300" }}

                lineHeight="1.8"
                mb={4}
              >
                แคมเปญนี้ดำเนินการร่วมกับ <strong>ตี่ต่าง</strong>
                ผู้ที่ทำงานใกล้ชิดกับชุมชนแรงงานข้ามชาติในเชียงใหม่
                โดยตี่ต่างเป็นผู้ช่วยจัดเก็บเงินที่ได้จากการขาย preset
                และดำเนินการแจกจ่ายหน้ากาก N95 ให้กับแรงงานข้ามชาติโดยตรง
                เพื่อให้มั่นใจว่าความช่วยเหลือไปถึงผู้ที่ต้องการอย่างแท้จริง
              </Text>
              <Link
                href="https://www.facebook.com/profile.php?id=100068235085612"
                target="_blank"
                rel="noopener noreferrer"
                textDecoration="none"
              >
                <Button
                  size={{ base: "sm", md: "md" }}
                  bg="gray.700"
                  color="white"
                  _hover={{
                    bg: "gray.600",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s"

                  w={{ base: "full", sm: "auto" }}
                >
                  <HStack gap={2}>
                    <Text fontSize={{ base: "md", md: "lg" }}></Text>
                    <Text>ดูโปรไฟล์ Facebook ของตี่ต่าง </Text>
                  </HStack>
                </Button>
              </Link>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              p={4}
              borderRadius="md"
              borderLeft="4px"
              borderColor="gray.500"
              w="full"
            >
              <Text
                fontSize="sm"
                color={{ base: "gray.600", _dark: "gray.400" }}

                lineHeight="1.7"
                fontStyle="italic"
              >
                การทำงานร่วมกับคนในพื้นที่ช่วยให้เราเข้าถึงและเข้าใจความต้องการของชุมชนได้อย่างแท้จริง
                และทำให้มั่นใจได้ว่าความช่วยเหลือไปถึงมือของผู้ที่ต้องการจริง ๆ
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>

      <Box
        display="flex"
        justifyContent="center"
        w="full"
        pb={{ base: 8, md: 12 }}
      >
        <Separator w="60%" maxW="600px" />
      </Box>

      {/* Media Coverage Section */}
      <VStack
        as="section"
        role="region"
        aria-label="ข่าวและการรายงาน"
        gap={6}
        align="start"
        w="full"
        maxW="4xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 12, md: 16 }}
      >
        <VStack gap={3} w="full" textAlign="center" px={{ base: 2, md: 0 }}>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color={{ base: "gray.800", _dark: "white" }}

          >
            ข่าวและการรายงาน
          </Heading>
          <Text
            fontSize={{ base: "sm", md: "lg" }}
            color={{ base: "gray.600", _dark: "gray.400" }}

          >
            แคมเปญนี้ได้เริ่มต้นตั้งแต่ปี 2564 และได้รับความสนใจจากสื่อหลายแห่ง
          </Text>
        </VStack>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={{ base: 4, md: 6 }}
          w="full"
          mt={6}
        >
          {/* Prachatai */}
          <Link
            href="https://prachatai.com/journal/2021/02/91510"
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ textDecoration: "none" }}
          >
            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              p={{ base: 5, md: 6 }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              h="full"
              transition="all 0.2s"
              _hover={{
                transform: { base: "none", md: "translateY(-4px)" },
                boxShadow: "lg",
                borderColor: "gray.400",
              }}
            >
              <VStack gap={3} align="start">
                <Badge
                  bg="gray.700"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  ข่าว
                </Badge>
                <Heading
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="600"
                  color={{ base: "gray.800", _dark: "white" }}

                  lineHeight="1.4"
                >
                  Prachatai
                </Heading>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}

                  lineHeight="1.6"
                >
                  รายงานข่าวเกี่ยวกับแคมเปญ #PHOTOFORAIR
                  และการช่วยเหลือแรงงานข้ามชาติ
                </Text>
                <Text fontSize="xs" color="gray.500" className="thai-text">
                  กุมภาพันธ์ 2564
                </Text>
              </VStack>
            </Box>
          </Link>

          {/* Urban Creature */}
          <Link
            href="https://urbancreature.co/whatsup-cnxpm25/"
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ textDecoration: "none" }}
          >
            <Box
              bg={{ base: "white", _dark: "gray.800" }}
              p={{ base: 5, md: 6 }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              h="full"
              transition="all 0.2s"
              _hover={{
                transform: { base: "none", md: "translateY(-4px)" },
                boxShadow: "lg",
                borderColor: "gray.400",
              }}
            >
              <VStack gap={3} align="start">
                <Badge
                  bg="gray.700"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  บทความ
                </Badge>
                <Heading
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="600"
                  color={{ base: "gray.800", _dark: "white" }}

                  lineHeight="1.4"
                >
                  Urban Creature
                </Heading>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}

                  lineHeight="1.6"
                >
                  What&apos;s Up #CNXPM2.5 -
                  บทความเจาะลึกเกี่ยวกับแคมเปญและปัญหาฝุ่นควันในเชียงใหม่
                </Text>
              </VStack>
            </Box>
          </Link>
        </SimpleGrid>

        <Box
          bg={{ base: "gray.50", _dark: "gray.800" }}
          p={6}
          borderRadius="lg"
          w="full"
          mt={6}
        >
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={{ base: "gray.700", _dark: "gray.300" }}

            lineHeight="1.8"
            textAlign="center"
          >
            แคมเปญ #PHOTOFORAIR ดำเนินการมาตั้งแต่ปี 2564 จนถึงปัจจุบัน
            และได้รับการตอบรับที่ดีจากสังคม ช่วยให้เราสามารถแจกจ่ายหน้ากาก N95
            ให้กับแรงงานข้ามชาติในเชียงใหม่ได้อย่างต่อเนื่อง
          </Text>
        </Box>
      </VStack>

      <Box
        display="flex"
        justifyContent="center"
        w="full"
        pb={{ base: 12, md: 16 }}
      >
        <Separator w="60%" maxW="600px" />
      </Box>

      {/* Main Content */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 20 }}
        w="full"
        display="flex"
        justifyContent="center"
      >
        <Box maxW="1200px" px={{ base: 4, md: 8 }} w="full">
          <VStack gap={12} align="center" w="full">
            {/* #PHOTOFORAIR Project */}
            <VStack gap={8} align="center" w="full">
              {/* Preset Sections */}
              <VStack gap={8} align="center" w="full">
                <Box w="full" maxW="3xl" px={{ base: 2, md: 0 }}>
                  <Heading
                    fontSize={{ base: "lg", md: "2xl" }}
                    fontWeight="600"
                    color={{ base: "gray.800", _dark: "white" }}

                    mb={3}
                    textAlign="left"
                  >
                    3 ลักษณะเด่นของ &ldquo;ฤดูฝุ่นควัน&rdquo; ในเชียงใหม่
                  </Heading>

                  <Text
                    fontSize={{ base: "sm", md: "lg" }}
                    color={{ base: "gray.700", _dark: "gray.300" }}

                    lineHeight="1.8"
                    mb={4}
                    textAlign="left"
                  >
                    ความสามารถพิเศษของคนที่อาศัยอยู่ในเชียงใหม่แบบผม
                    คือสามารถที่จะบอกได้ว่าฝุ่นควันที่เห็นอยู่ตรงหน้านี้น่าจะมีค่า
                    AQI เท่าไหร่ โดยสังเกตจากลักษณะของแสง สี
                    และคอนทราสต์ที่มองเห็น และผมได้นำลักษณะเด่นเหล่านี้มาออกแบบ
                    เป็น preset ชุด &ldquo;CNXPM2.5&rdquo;
                    เพื่อให้ทุกคนได้สัมผัสกับ &ldquo;ฤดูฝุ่นควัน&rdquo;
                    ในเชียงใหม่ผ่านภาพถ่ายของตัวเอง โดยมี 3
                    ลักษณะเด่นที่สำคัญดังนี้
                  </Text>
                </Box>
                {/* Soft-Box from Haze */}
                <Box w="full" maxW="3xl" px={{ base: 2, md: 0 }}>
                  <Heading
                    fontSize={{ base: "lg", md: "2xl" }}
                    fontWeight="600"
                    color={{ base: "gray.800", _dark: "white" }}

                    mb={3}
                    textAlign="left"
                  >
                    1.แสงนุ่ม ๆ จากฝุ่นควันที่ปกคลุม (Soft-Box from Haze)
                  </Heading>

                  <Text
                    fontSize={{ base: "sm", md: "lg" }}
                    color={{ base: "gray.700", _dark: "gray.300" }}

                    lineHeight="1.8"
                    mb={4}
                    textAlign="left"
                  >
                    ทุกวันนี้ ชีวิตชาวเชียงใหม่ในช่วงเดือนมีนาคม-พฤษภาคม
                    รู้จักมักคุ้นกับสภาพอากาศระดับ 150 – 500 AQI เป็นอย่างดี
                    เพราะบรรยากาศเช่นนี้ ปกคลุมเมืองเชียงใหม่ตั้งแต่เช้ายันเช้า
                    กินข้าว ปวดขี้ ก็ต้องพบเจอกับฝุ่นนี้อย่างหลีกหนีไม่ได้
                    ด้วยสภาพการณ์อย่างนี้เอง มันจึงเปรียบเสมือนการใช้ Softbox
                    ครอบคลุมดวงอาทิตย์อันร้อนแรงในหน้าแล้งเอาไว้
                    ทำให้ภาพที่คนเชียงใหม่เห็นค่อนข้างนุ่มนวล Low-contrast
                    จนแทบขาดอากาศหายใจ
                  </Text>

                  {/* Before/After Image Comparison */}
                  <Box mb={4} borderRadius="lg" overflow="hidden">
                    <ReactCompareImage
                      leftImage="/image/pfa/DSC00094-scaled.jpg"
                      rightImage="/image/pfa/DSC00094-1-scaled.jpg"
                      sliderLineWidth={3}
                      sliderLineColor="white"
                      handleSize={50}
                      hover={true}
                    />
                  </Box>

                  <Box
                    bg={{ base: "gray.100", _dark: "gray.800" }}
                    p={4}
                    borderRadius="md"
                    borderLeft="4px"
                    borderColor="gray.400"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color={{ base: "gray.700", _dark: "gray.300" }}
                      mb={2}

                    >
                      Creative tip
                    </Text>
                    <Text
                      fontSize="sm"
                      color={{ base: "gray.700", _dark: "gray.300" }}

                      lineHeight="1.7"
                    >
                      ลองปรับภาพถ่ายของคุณที่สดใสด้วยการลด saturation และ
                      exposure หลังจากใช้ CNXPM2.5
                      จะทำให้คุณได้ภาพถ่ายที่หม่นหมองเหมือนอยู่ในเชียงใหม่ในทุก
                      ๆ วัน
                    </Text>
                  </Box>
                </Box>

                {/* Warm Tone by Wildfire */}
                <Box w="full" maxW="3xl" px={{ base: 2, md: 0 }}>
                  <Heading
                    fontSize={{ base: "lg", md: "2xl" }}
                    fontWeight="600"
                    color={{ base: "gray.800", _dark: "white" }}

                    mb={3}
                    textAlign="left"
                  >
                    2.โทนอุ่น ๆ จากไฟป่ายามพระอาทิตย์ตก (Warm Tone by Wildfire)
                  </Heading>

                  <Text
                    fontSize={{ base: "sm", md: "lg" }}
                    color={{ base: "gray.700", _dark: "gray.300" }}

                    lineHeight="1.8"
                    mb={4}
                    textAlign="left"
                  >
                    อีกจุดเด่นสำคัญของ CNXPM2.5
                    คือสีเหลืองอบอวนอยู่ในจังหวัดเชียงใหม่
                    โดยได้รับแรงบัลดาลใจมากจากสีของท้องฟ้ายามเย็นและไฟป่าที่ไหม้อยู่บนดอยสุเทพ
                    ทำให้ท้องฟ้าเชียงใหม่ปกคลุมไปด้วยสีเหลืองที่ดูเหมือตอนจบของหนังรักโรแมนติก
                    แต่พระเอกต้องใส่หน้ากากอนามัยระหว่างจูบนางเอก
                  </Text>
                  {/* Before/After Image Comparison */}
                  <Box mb={4} borderRadius="lg" overflow="hidden">
                    <ReactCompareImage
                      leftImage="/image/pfa/DSC00084-scaled.jpg"
                      rightImage="/image/pfa/DSC00084-1-scaled.jpg"
                      sliderLineWidth={3}
                      sliderLineColor="white"
                      handleSize={50}
                      hover={true}
                    />
                  </Box>
                  <Box
                    bg={{ base: "gray.100", _dark: "gray.800" }}
                    p={4}
                    borderRadius="md"
                    borderLeft="4px"
                    borderColor="gray.400"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color={{ base: "gray.700", _dark: "gray.300" }}
                      mb={2}

                    >
                      Creative tip
                    </Text>
                    <Text
                      fontSize="sm"
                      color={{ base: "gray.700", _dark: "gray.300" }}

                      lineHeight="1.7"
                    >
                      เพื่อที่จะทำให้ได้โทนสีเหลืองปนส้มคล้ายกับท้องฟ้ายามเย็นช่วงไฟป่าดอยสุเทพ
                      แนะนำให้ปรับ Temp ไปที่ช่วง 5500 และ Tint
                      ไปที่ช่วงสีเขียวเพิ่ม
                    </Text>
                  </Box>
                </Box>

                {/* Faded Look by Air pollution */}
                <Box w="full" maxW="3xl" px={{ base: 2, md: 0 }}>
                  <Heading
                    fontSize={{ base: "lg", md: "2xl" }}
                    fontWeight="600"
                    color={{ base: "gray.800", _dark: "white" }}

                    mb={3}
                    textAlign="left"
                  >
                    3.โทนหม่น ๆ จากฝุ่นควัน 500 AQI (Faded Look by Air
                    pollution)
                  </Heading>

                  <Text
                    fontSize={{ base: "sm", md: "lg" }}
                    color={{ base: "gray.700", _dark: "gray.300" }}

                    lineHeight="1.8"
                    mb={4}
                    textAlign="left"
                  >
                    faded look
                    นี้จะเห็นได้เฉพาะช่วงที่ฝุ่นควันมีความหนาแน่นสูงหรือตั้งแต่
                    500 AQI ขึ้นไป ลักษณะสำคัญคือ Faded look
                    ที่ลอกแบบมาจนแทบจะถูกฟ้องลิขสิทธิ์จากฝุ่นควันอันลอยล่องไม่พร่องจากท้องฟ้าเชียงใหม่
                    ควันที่พร้อมร่วมทุกกิจกรรมที่คุณได้ทำ
                    ไม่ว่าจะเดินซื้อเห็ดโคนในตลาดหรือใส่บาตรยามเช้า
                    หรือกินข้าวตอนกลางวันหรือนอนฝันที่โรงเรียน
                    หรือเวียนเทียนวันพระใหญ่ แน่นอนว่ามันจะทำให้ทุกภาพของคนดูเบา
                    เหมือนทาทับด้วยสีเทาบาง ๆ ไว้ จนใครเห็นภาพจำต้องไอ
                    เพราะมันไปสะกิดต่อมอะไรในลำคอ และโพรงจมูก
                  </Text>
                  {/* Before/After Image Comparison */}
                  <Box mb={4} borderRadius="lg" overflow="hidden">
                    <ReactCompareImage
                      leftImage="/image/pfa/DSC00527-2-scaled.jpg"
                      rightImage="/image/pfa/DSC00527-1-scaled.jpg"
                      sliderLineWidth={3}
                      sliderLineColor="white"
                      handleSize={50}
                      hover={true}
                    />
                  </Box>
                  <Box
                    bg={{ base: "gray.100", _dark: "gray.800" }}
                    p={4}
                    borderRadius="md"
                    borderLeft="4px"
                    borderColor="gray.500"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                      mb={2}

                    >
                      Creative tip
                    </Text>
                    <Text
                      fontSize="sm"
                      color={{ base: "gray.700", _dark: "gray.300" }}

                      lineHeight="1.7"
                    >
                      preset นี้จะเหมาะเจาะอย่างยิ่งกับภาพ Landscape
                      ที่ไม่ได้มีผู้คนเป็นจุดสนใจ เพราะด้านบนของภาพมีการเพิ่ม
                      dehaze
                    </Text>
                  </Box>
                </Box>
              </VStack>

              {/* CTA Button after Presets */}
              <Box display="flex" justifyContent="center" w="full" my={8}>
                <CTAButton />
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                w="full"
                pt={{ base: 12, md: 16 }}
              >
                <Separator w="60%" maxW="600px" />
              </Box>

              {/* Campaign Call to Action */}
              <VStack
                gap={6}
                align="start"
                w="full"
                maxW="3xl"
                mx="auto"
                px={{ base: 4, md: 0 }}
              >
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="600"
                  color={{ base: "gray.800", _dark: "white" }}

                  textAlign="center"
                  w="full"
                >
                  ตัวอย่างภาพที่ใช้ CNXPM2.5
                </Heading>
                <Text
                  fontSize={{ base: "sm", md: "lg" }}
                  color={{ base: "gray.700", _dark: "gray.300" }}

                  lineHeight="1.8"
                  textAlign="left"
                >
                  สามารถใช้ preset ตัวนี้แล้ว tag #cnxpm25 และ #photoforair ใน
                  instagram ได้เลย แล้วภาพจะถูกนำมา repost ในนี้
                </Text>
                {/* Instagram Feed from EmbedSocial */}
                <Box w="full" mt={12}>
                  <iframe
                    src="https://app.mirror-app.com/feed-instagram/351ad4cb-df04-4add-b467-fbe826b8bf03/preview"
                    title="Instagram feed #PHOTOFORAIR"
                    style={{
                      width: "100%",
                      border: "none",
                      overflow: "hidden",
                    }}
                    scrolling="no"
                    onLoad={(e: React.SyntheticEvent<HTMLIFrameElement>) => {
                      if (typeof window !== "undefined") {
                        const win = window as typeof window & {
                          iFrameSetup?: (el: HTMLIFrameElement) => void;
                        };
                        if (typeof win.iFrameSetup === "function") {
                          win.iFrameSetup(e.currentTarget);
                        }
                      }
                    }}
                  />
                </Box>

                {/* Final CTA Button */}
                <Box display="flex" justifyContent="center" w="full" mt={8}>
                  <CTAButton />
                </Box>
              </VStack>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Layout>
  );
}
