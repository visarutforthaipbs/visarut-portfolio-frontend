import { Box, Heading, Text, Stack, HStack } from "@chakra-ui/react";
import { FileText, Ruler, Package } from "lucide-react";
import { PrintACF } from "@/types/acf";

interface PrintACFDisplayProps {
  acf: PrintACF;
}

/**
 * ACF display component for Print portfolio items
 */
export function PrintACFDisplay({ acf }: PrintACFDisplayProps) {
  const items = [
    { icon: Ruler, label: "ขนาด", value: acf.print_size },
    { icon: Package, label: "วัสดุ", value: acf.print_material },
    { icon: FileText, label: "โปรแกรมที่ใช้", value: acf.print_software },
  ];

  return (
    <Stack gap={6}>
      {acf.print_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายงานพิมพ์
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.print_description}
          </Text>
        </Box>
      )}

      <Box>
        <Heading size="md" mb={4}>
          ข้อมูลงานพิมพ์
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
