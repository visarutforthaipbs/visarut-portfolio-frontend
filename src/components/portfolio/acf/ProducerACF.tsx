import { Box, Heading, Text, Stack, HStack } from "@chakra-ui/react";
import { Users, Clock, ListChecks } from "lucide-react";
import { ProducerACF } from "@/types/acf";

interface ProducerACFDisplayProps {
  acf: ProducerACF;
}

/**
 * ACF display component for Producer portfolio items
 */
export function ProducerACFDisplay({ acf }: ProducerACFDisplayProps) {
  const items = [
    { icon: Users, label: "ขนาดทีม", value: acf.team_size },
    { icon: Clock, label: "ระยะเวลา", value: acf.duration },
  ];

  return (
    <Stack gap={6}>
      {acf.producer_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายงานโปรดิวเซอร์
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.producer_description}
          </Text>
        </Box>
      )}

      <Box>
        <Heading size="md" mb={4}>
          ข้อมูลโปรเจค
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

      {acf.responsibilities && (
        <Box>
          <Heading size="md" mb={3}>
            หน้าที่รับผิดชอบ
          </Heading>
          <HStack gap={3} alignItems="flex-start">
            <ListChecks size={20} />
            <Text
              color="gray.600"
              _dark={{ color: "gray.300" }}
              whiteSpace="pre-line"
            >
              {acf.responsibilities}
            </Text>
          </HStack>
        </Box>
      )}
    </Stack>
  );
}
