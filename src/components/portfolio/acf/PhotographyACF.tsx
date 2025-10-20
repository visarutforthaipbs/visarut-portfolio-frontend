import { Box, Heading, Text, Stack, HStack } from "@chakra-ui/react";
import { Camera, Aperture, Lightbulb, MapPin } from "lucide-react";
import { PhotographyACF } from "@/types/acf";

interface PhotographyACFDisplayProps {
  acf: PhotographyACF;
}

/**
 * ACF display component for Photography portfolio items
 */
export function PhotographyACFDisplay({ acf }: PhotographyACFDisplayProps) {
  const items = [
    { icon: Camera, label: "กล้อง", value: acf.camera },
    { icon: Aperture, label: "เลนส์", value: acf.lens },
    { icon: Lightbulb, label: "แสง", value: acf.lighting },
    { icon: MapPin, label: "สถานที่", value: acf.location },
  ];

  return (
    <Stack gap={6}>
      {acf.photo_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายภาพถ่าย
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.photo_description}
          </Text>
        </Box>
      )}

      <Box>
        <Heading size="md" mb={4}>
          ข้อมูลการถ่ายภาพ
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
