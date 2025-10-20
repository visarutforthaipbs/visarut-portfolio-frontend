import { Box, Heading, Text, Stack, HStack, Flex } from "@chakra-ui/react";
import { Palette, Type, Layers } from "lucide-react";
import { GraphicDesignACF } from "@/types/acf";

interface GraphicDesignACFDisplayProps {
  acf: GraphicDesignACF;
}

/**
 * ACF display component for Graphic Design portfolio items
 */
export function GraphicDesignACFDisplay({ acf }: GraphicDesignACFDisplayProps) {
  const colors = acf.color_palette
    ?.split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <Stack gap={6}>
      {acf.design_description && (
        <Box>
          <Heading size="md" mb={3}>
            คำอธิบายงานออกแบบ
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }}>
            {acf.design_description}
          </Text>
        </Box>
      )}

      {acf.design_software && (
        <Box>
          <Heading size="md" mb={3}>
            โปรแกรมที่ใช้
          </Heading>
          <HStack gap={3}>
            <Palette size={20} />
            <Text color="gray.600" _dark={{ color: "gray.300" }}>
              {acf.design_software}
            </Text>
          </HStack>
        </Box>
      )}

      {colors && colors.length > 0 && (
        <Box>
          <Heading size="md" mb={3}>
            สีหลักที่ใช้
          </Heading>
          <Flex gap={2} flexWrap="wrap">
            {colors.map((color) => (
              <Box
                key={color}
                w="60px"
                h="60px"
                bg={color}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                _dark={{ borderColor: "gray.700" }}
                title={color}
              />
            ))}
          </Flex>
        </Box>
      )}

      {acf.typography && (
        <Box>
          <Heading size="md" mb={3}>
            ฟอนต์ที่ใช้
          </Heading>
          <HStack gap={3}>
            <Type size={20} />
            <Text color="gray.600" _dark={{ color: "gray.300" }}>
              {acf.typography}
            </Text>
          </HStack>
        </Box>
      )}

      {acf.design_elements && (
        <Box>
          <Heading size="md" mb={3}>
            องค์ประกอบการออกแบบ
          </Heading>
          <HStack gap={3}>
            <Layers size={20} />
            <Text color="gray.600" _dark={{ color: "gray.300" }}>
              {acf.design_elements}
            </Text>
          </HStack>
        </Box>
      )}
    </Stack>
  );
}
