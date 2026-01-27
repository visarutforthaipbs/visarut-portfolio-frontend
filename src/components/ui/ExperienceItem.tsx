"use client";

import { Box, Badge, Text, VStack, HStack } from "@chakra-ui/react";

interface ExperienceItemProps {
    year: string;
    company: string;
    position: string;
    description: string;
    responsibilities: string[];
    current: boolean;
}

export function ExperienceItem({
    year,
    company,
    position,
    description,
    responsibilities,
    current,
}: ExperienceItemProps) {
    return (
        <Box
            bg={{ base: "white", _dark: "gray.700" }}
            p={6}
            borderRadius="lg"
            shadow="sm"
            border="1px solid"
            borderColor={{ base: "gray.200", _dark: "gray.600" }}
        >
            <VStack align="stretch" gap={4}>
                <HStack justify="space-between" wrap="wrap" gap={2}>
                    <VStack align="start" gap={1} flex={1}>
                        <HStack gap={2}>
                            <Text
                                fontSize="lg"
                                fontWeight="600"
                                color={{ base: "gray.800", _dark: "white" }}
                            >
                                {company}
                            </Text>
                            {current && (
                                <Badge colorScheme="green">
                                    ปัจจุบัน
                                </Badge>
                            )}
                        </HStack>
                        <Text
                            fontSize="md"
                            color={{ base: "gray.600", _dark: "gray.300" }}
                        >
                            {position}
                        </Text>
                    </VStack>
                    <Text
                        fontSize="sm"
                        color={{ base: "gray.500", _dark: "gray.400" }}
                        fontWeight="500"
                    >
                        {year}
                    </Text>
                </HStack>

                {/* Job Description */}
                <Text
                    fontSize="md"
                    color={{ base: "gray.700", _dark: "gray.300" }}
                    lineHeight="1.6"
                >
                    {description}
                </Text>

                {/* Responsibilities */}
                <Box>
                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        color={{ base: "gray.800", _dark: "white" }}
                        mb={2}
                    >
                        หน้าที่ความรับผิดชอบ:
                    </Text>
                    <VStack align="stretch" gap={1}>
                        {responsibilities.map((responsibility, idx) => (
                            <Text
                                key={idx}
                                fontSize="sm"
                                color={{ base: "gray.600", _dark: "gray.300" }}
                                pl={4}
                                position="relative"
                                _before={{
                                    content: '"•"',
                                    position: "absolute",
                                    left: 0,
                                    color: "accent.500",
                                    fontWeight: "bold",
                                }}
                            >
                                {responsibility}
                            </Text>
                        ))}
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}
