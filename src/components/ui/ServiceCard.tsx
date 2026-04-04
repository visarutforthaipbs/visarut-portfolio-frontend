"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { T } from "@/lib/tokens";

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    category: string;
}

export function ServiceCard({
    icon: Icon,
    title,
    description,
    category,
}: ServiceCardProps) {
    return (
        <Link href={`/portfolio/category/${category}`} aria-label={`${title} - ${description}`}>
            <Box
                bg={T.surface}
                p={{ base: 4, md: 6 }}
                borderRadius="lg"
                textAlign="center"
                _hover={{
                    transform: "translateY(-4px)",
                    bg: T.surfaceHover,
                }}
                transition="all 0.3s ease"
                cursor="pointer"
                border="1px solid"
                borderColor={T.border}
            >
                <VStack gap={{ base: 3, md: 4 }}>
                    <Box
                        color={T.accent}
                        fontSize={{ base: "xl", md: "2xl" }}
                        aria-hidden="true"
                    >
                        <Icon size={32} />
                    </Box>
                    <VStack gap={2}>
                        <Heading
                            fontSize={{ base: "lg", md: "xl" }}
                            color={T.text}
                        >
                            {title}
                        </Heading>
                        <Text
                            fontSize={{ base: "xs", md: "sm" }}
                            color={T.textMuted}
                            lineHeight="1.5"
                        >
                            {description}
                        </Text>
                    </VStack>
                </VStack>
            </Box>
        </Link>
    );
}
