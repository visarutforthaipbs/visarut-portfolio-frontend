import { Box, Heading, Text, Stack, HStack } from "@chakra-ui/react";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { ExhibitionACF } from "@/types/acf";

interface ExhibitionACFDisplayProps {
  acf: ExhibitionACF;
}

/**
 * ACF display component for Exhibition portfolio items
 */
export function ExhibitionACFDisplay({ acf }: ExhibitionACFDisplayProps) {
  const items = [
    { icon: MapPin, label: "สถานที่", value: acf.location },
    { icon: Calendar, label: "วันที่", value: acf.date },
    { icon: Briefcase, label: "บทบาท", value: acf.role },
  ];

  return (
    <Stack gap={6}>
      {acf.exhibition_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายนิทรรศการ
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.exhibition_description}
          </Text>
        </Box>
      )}

      <Box>
        <Heading size="md" mb={4}>
          ข้อมูลนิทรรศการ
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
