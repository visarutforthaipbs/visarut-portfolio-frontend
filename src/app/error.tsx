"use client";

import { Box, Container, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { reportError } from "@/lib/errorReporting";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { context: "global-error-boundary", metadata: { digest: error.digest } });
  }, [error]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={{ base: "gray.50", _dark: "gray.900" }}
    >
      <Container maxW="md" py={16}>
        <VStack gap={6} textAlign="center">
          <Box color="red.500">
            <AlertTriangle size={64} />
          </Box>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            color={{ base: "gray.800", _dark: "white" }}
          >
            เกิดข้อผิดพลาด
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
          >
            ขออภัย เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง
          </Text>
          <Text
            fontSize="sm"
            color={{ base: "gray.400", _dark: "gray.500" }}
          >
            Something went wrong. Please try again.
          </Text>
          <VStack gap={3} w="full" maxW="xs">
            <Button
              onClick={reset}
              bg="accent.500"
              color="white"
              _hover={{ bg: "accent.600" }}
              size="lg"
              w="full"
            >
              <RefreshCw size={18} />
              ลองใหม่อีกครั้ง
            </Button>
            <Link href="/" style={{ width: "100%" }}>
              <Button
                variant="outline"
                borderColor="accent.500"
                color="accent.500"
                _hover={{ bg: "accent.50" }}
                size="lg"
                w="full"
              >
                <Home size={18} />
                กลับหน้าแรก
              </Button>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
