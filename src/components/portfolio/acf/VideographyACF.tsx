import { Box, Heading, Text, Stack, HStack, Link } from "@chakra-ui/react";
import { Camera, Aperture, Lightbulb, MapPin, Video } from "lucide-react";
import { VideographyACF } from "@/types/acf";

interface VideographyACFDisplayProps {
  acf: VideographyACF;
}

/**
 * ACF display component for Videography portfolio items
 */
export function VideographyACFDisplay({ acf }: VideographyACFDisplayProps) {
  const items = [
    { icon: Camera, label: "กล้อง", value: acf.camera },
    { icon: Aperture, label: "เลนส์", value: acf.lens },
    { icon: Lightbulb, label: "แสง", value: acf.lighting },
    { icon: MapPin, label: "สถานที่", value: acf.location },
  ];

  return (
    <Stack gap={6}>
      {acf.video_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายวิดีโอ
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.video_description}
          </Text>
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

      <Box>
        <Heading size="md" mb={4}>
          ข้อมูลการถ่ายทำ
        </Heading>
        <Stack gap={3}>
          {items.map(({ icon: Icon, label, value }) =>
            value ? (
              <HStack key={label} gap={3}>
                <Icon size={20} />
                <Text fontWeight="medium">{label}:</Text>
                <Text color="gray.600" _dark={{ color: "gray.300" }}>
                  {value}
                </Text>
              </HStack>
            ) : null
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
