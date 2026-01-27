"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

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
        <Link href={`/portfolio/category/${category}`}>
            <Box
                bg={{ base: "white", _dark: "gray.700" }}
                p={{ base: 4, md: 6 }}
                borderRadius="lg"
                shadow="md"
                textAlign="center"
                _hover={{
                    transform: "translateY(-4px)",
                    shadow: "lg",
                }}
                transition="all 0.3s ease"
                cursor="pointer"
                border="1px solid"
                borderColor={{ base: "gray.200", _dark: "gray.600" }}
            >
                <VStack gap={{ base: 3, md: 4 }}>
                    <Box
                        color={{ base: "accent.500", _dark: "accent.300" }}
                        fontSize={{ base: "xl", md: "2xl" }}
                    >
                        <Icon size={32} />
                    </Box>
                    <VStack gap={2}>
                        <Heading
                            fontSize={{ base: "lg", md: "xl" }}
                            color={{ base: "gray.800", _dark: "white" }}
                        >
                            {title}
                        </Heading>
                        <Text
                            fontSize={{ base: "xs", md: "sm" }}
                            color={{ base: "gray.600", _dark: "gray.300" }}
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
