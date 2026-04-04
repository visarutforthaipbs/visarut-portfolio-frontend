"use client";

import { Box, Badge, Text, VStack, HStack } from "@chakra-ui/react";
import { T } from "@/lib/tokens";

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
            bg={T.surface}
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor={T.border}
        >
            <VStack align="stretch" gap={4}>
                <HStack justify="space-between" wrap="wrap" gap={2}>
                    <VStack align="start" gap={1} flex={1}>
                        <HStack gap={2}>
                            <Text
                                fontSize="lg"
                                fontWeight="600"
                                color={T.text}
                            >
                                {company}
                            </Text>
                            {current && (
                                <Badge bg={T.accentDim} color={T.accent}>
                                    ปัจจุบัน
                                </Badge>
                            )}
                        </HStack>
                        <Text
                            fontSize="md"
                            color={T.textMuted}
                        >
                            {position}
                        </Text>
                    </VStack>
                    <Text
                        fontSize="sm"
                        color={T.textDim}
                        fontWeight="500"
                    >
                        {year}
                    </Text>
                </HStack>

                {/* Job Description */}
                <Text
                    fontSize="md"
                    color={T.textMuted}
                    lineHeight="1.6"
                >
                    {description}
                </Text>

                {/* Responsibilities */}
                <Box>
                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        color={T.text}
                        mb={2}
                    >
                        หน้าที่ความรับผิดชอบ:
                    </Text>
                    <VStack align="stretch" gap={1}>
                        {responsibilities.map((responsibility, idx) => (
                            <Text
                                key={idx}
                                fontSize="sm"
                                color={T.textMuted}
                                pl={4}
                                position="relative"
                                _before={{
                                    content: '"•"',
                                    position: "absolute",
                                    left: 0,
                                    color: T.accent,
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
