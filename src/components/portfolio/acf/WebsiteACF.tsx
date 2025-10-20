import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Link,
  Card,
} from "@chakra-ui/react";
import { Code, Globe } from "lucide-react";
import { WebsiteACF } from "@/types/acf";

interface WebsiteACFDisplayProps {
  acf: WebsiteACF;
}

/**
 * ACF display component for Website portfolio items
 */
export function WebsiteACFDisplay({ acf }: WebsiteACFDisplayProps) {
  return (
    <Stack gap={6}>
      {acf.project_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายโปรเจค
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.project_description}
          </Text>
        </Box>
      )}

      {acf.tech_stack && (
        <Box>
          <Heading size="md" mb={3}>
            เทคโนโลยีที่ใช้
          </Heading>
          <HStack gap={3}>
            <Code size={20} />
            <Text color="gray.600" _dark={{ color: "gray.300" }}>
              {acf.tech_stack}
            </Text>
          </HStack>
        </Box>
      )}

      {acf.features && (
        <Box>
          <Heading size="md" mb={3}>
            ฟีเจอร์หลัก
          </Heading>
          <Text
            color="gray.600"
            _dark={{ color: "gray.300" }}
            whiteSpace="pre-line"
          >
            {acf.features}
          </Text>
        </Box>
      )}

      {acf.website_url && (
        <Card.Root>
          <Card.Body>
            <HStack gap={3}>
              <Globe size={24} />
              <Box flex={1}>
                <Text fontWeight="bold" mb={1}>
                  เว็บไซต์
                </Text>
                <Link
                  href={acf.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  {acf.website_url}
                </Link>
              </Box>
            </HStack>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
}
