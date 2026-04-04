import { Box, Container, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { T } from "@/lib/tokens";

export default function NotFound() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={T.bg}
    >
      <Container maxW="md" py={16}>
        <VStack gap={6} textAlign="center">
          <Box color={T.textDim}>
            <FileQuestion size={80} />
          </Box>
          <Heading
            fontSize={{ base: "6xl", md: "8xl" }}
            fontWeight="bold"
            color={T.border}
            lineHeight="1"
          >
            404
          </Heading>
          <Heading
            fontSize={{ base: "xl", md: "2xl" }}
            color={T.text}
          >
            ไม่พบหน้าที่ต้องการ
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={T.textMuted}
            maxW="sm"
          >
            หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่มีอยู่
          </Text>
          <Text
            fontSize="sm"
            color={T.textDim}
          >
            The page you&apos;re looking for doesn&apos;t exist.
          </Text>
          <VStack gap={3} w="full" maxW="xs" pt={4}>
            <Link href="/" style={{ width: "100%" }}>
              <Button
                bg={T.accent}
                color={T.bg}
                _hover={{ bg: "#d97706" }}
                size="lg"
                w="full"
              >
                <Home size={18} />
                กลับหน้าแรก
              </Button>
            </Link>
            <Link href="/portfolio" style={{ width: "100%" }}>
              <Button
                variant="outline"
                borderColor={T.border}
                color={T.textMuted}
                _hover={{ bg: T.surface }}
                size="lg"
                w="full"
              >
                <ArrowLeft size={18} />
                ดูผลงาน
              </Button>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
