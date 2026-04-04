"use client";

import { Box, Container, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { reportError } from "@/lib/errorReporting";
import { T } from "@/lib/tokens";

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
      bg={T.bg}
    >
      <Container maxW="md" py={16}>
        <VStack gap={6} textAlign="center">
          <Box color={T.accent}>
            <AlertTriangle size={64} />
          </Box>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            color={T.text}
          >
            เกิดข้อผิดพลาด
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={T.textMuted}
          >
            ขออภัย เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง
          </Text>
          <Text
            fontSize="sm"
            color={T.textDim}
          >
            Something went wrong. Please try again.
          </Text>
          <VStack gap={3} w="full" maxW="xs">
            <Button
              onClick={reset}
              bg={T.accent}
              color={T.bg}
              _hover={{ bg: "#d97706" }}
              size="lg"
              w="full"
            >
              <RefreshCw size={18} />
              ลองใหม่อีกครั้ง
            </Button>
            <Link href="/" style={{ width: "100%" }}>
              <Button
                variant="outline"
                borderColor={T.border}
                color={T.textMuted}
                _hover={{ bg: T.surface }}
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
