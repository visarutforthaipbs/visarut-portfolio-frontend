import { Box, Container, VStack } from "@chakra-ui/react";
import { T } from "@/lib/tokens";

export default function Loading() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={T.bg}
    >
      <Container maxW="md" py={16}>
        <VStack gap={8}>
          {/* Skeleton pulse animation for content loading */}
          <VStack gap={4} w="full" align="center">
            {/* Logo placeholder */}
            <Box
              w="64px"
              h="64px"
              borderRadius="full"
              bg={T.surface}
              className="animate-pulse"
            />
            {/* Title placeholder */}
            <Box
              w="200px"
              h="24px"
              borderRadius="md"
              bg={T.surface}
              className="animate-pulse"
            />
            {/* Subtitle placeholder */}
            <Box
              w="300px"
              h="16px"
              borderRadius="md"
              bg={T.surfaceHover}
              className="animate-pulse"
            />
          </VStack>

          {/* Content placeholders */}
          <VStack gap={3} w="full">
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                w="full"
                h="120px"
                borderRadius="lg"
                bg={T.surface}
                className="animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
