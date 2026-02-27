import { Box, Container, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={{ base: "white", _dark: "gray.900" }}
    >
      <Container maxW="md" py={16}>
        <VStack gap={6} textAlign="center">
          <Box color={{ base: "gray.400", _dark: "gray.500" }}>
            <FileQuestion size={80} />
          </Box>
          <Heading
            fontSize={{ base: "6xl", md: "8xl" }}
            fontWeight="bold"
            color={{ base: "gray.200", _dark: "gray.700" }}
            lineHeight="1"
          >
            404
          </Heading>
          <Heading
            fontSize={{ base: "xl", md: "2xl" }}
            color={{ base: "gray.800", _dark: "white" }}
          >
            ไม่พบหน้าที่ต้องการ
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
            maxW="sm"
          >
            หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่มีอยู่
          </Text>
          <Text
            fontSize="sm"
            color={{ base: "gray.400", _dark: "gray.500" }}
          >
            The page you&apos;re looking for doesn&apos;t exist.
          </Text>
          <VStack gap={3} w="full" maxW="xs" pt={4}>
            <Link href="/" style={{ width: "100%" }}>
              <Button
                bg="accent.500"
                color="white"
                _hover={{ bg: "accent.600" }}
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
                borderColor="accent.500"
                color="accent.500"
                _hover={{ bg: "accent.50" }}
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
