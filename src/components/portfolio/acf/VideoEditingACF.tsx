import { Box, Heading, Text, Stack, HStack, Link } from "@chakra-ui/react";
import { Film, Video } from "lucide-react";
import { VideoEditingACF } from "@/types/acf";

interface VideoEditingACFDisplayProps {
  acf: VideoEditingACF;
}

/**
 * ACF display component for Video Editing portfolio items
 */
export function VideoEditingACFDisplay({ acf }: VideoEditingACFDisplayProps) {
  return (
    <Stack gap={6}>
      {acf.editing_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายการตัดต่อ
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.editing_description}
          </Text>
        </Box>
      )}

      {acf.software && (
        <Box>
          <Heading size="md" mb={3}>
            ซอฟต์แวร์ที่ใช้
          </Heading>
          <HStack gap={3}>
            <Film size={20} />
            <Text color="gray.600" _dark={{ color: "gray.300" }}>
              {acf.software}
            </Text>
          </HStack>
        </Box>
      )}

      {acf.video_link && (
        <Box>
          <Heading size="md" mb={3}>
            วิดีโอ
          </Heading>
          <HStack gap={3}>
            <Video size={20} />
            <Link
              href={acf.video_link}
              target="_blank"
              rel="noopener noreferrer"
              color="blue.500"
              _hover={{ textDecoration: "underline" }}
            >
              ดูวิดีโอเต็ม
            </Link>
          </HStack>
        </Box>
      )}
    </Stack>
  );
}
