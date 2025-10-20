import { Box, Heading, Text, Stack, HStack } from "@chakra-ui/react";
import { User, Calendar, TrendingUp, Radio } from "lucide-react";
import { CampaignACF } from "@/types/acf";

interface CampaignACFDisplayProps {
  acf: CampaignACF;
}

/**
 * ACF display component for Campaign portfolio items
 */
export function CampaignACFDisplay({ acf }: CampaignACFDisplayProps) {
  const items = [
    { icon: User, label: "ลูกค้า", value: acf.client },
    { icon: Calendar, label: "ระยะเวลา", value: acf.campaign_duration },
    { icon: Radio, label: "แพลตฟอร์ม", value: acf.platform },
  ];

  return (
    <Stack gap={6}>
      {acf.campaign_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายแคมเปญ
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.campaign_description}
          </Text>
        </Box>
      )}

      <Box>
        <Heading size="md" mb={4}>
          ข้อมูลแคมเปญ
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

      {acf.results && (
        <Box>
          <Heading size="md" mb={3}>
            ผลลัพธ์
          </Heading>
          <HStack gap={3} alignItems="flex-start">
            <TrendingUp size={20} />
            <Text
              color="gray.600"
              _dark={{ color: "gray.300" }}
              whiteSpace="pre-line"
            >
              {acf.results}
            </Text>
          </HStack>
        </Box>
      )}
    </Stack>
  );
}
