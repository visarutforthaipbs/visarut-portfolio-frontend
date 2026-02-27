"use client";

import {
  Box,
  Container,
  Text,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <Box
      as="footer"
      role="contentinfo"
      bg={{ base: "white", _dark: "gray.900" }}
      mt="auto"
      display="flex"
      justifyContent="center"
      w="100%"
    >
      <Container maxW="5xl" px={{ base: 5, md: 6 }}>
        <HStack
          justify="space-between"
          align="center"
          py={6}
          flexWrap="wrap"
          gap={3}
        >
          <Text
            fontSize="xs"
            color={{ base: "gray.400", _dark: "gray.500" }}
          >
            © {new Date().getFullYear()} {siteConfig.authorTh}
          </Text>

          <HStack gap={4}>
            <Link href={`mailto:${siteConfig.social.email}`}>
              <Text
                fontSize="xs"
                color={{ base: "gray.400", _dark: "gray.500" }}
                _hover={{ color: { base: "gray.900", _dark: "white" } }}
                transition="color 0.15s"
              >
                Email
              </Text>
            </Link>
            {siteConfig.social.instagram && (
              <Link href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
                <Text
                  fontSize="xs"
                  color={{ base: "gray.400", _dark: "gray.500" }}
                  _hover={{ color: { base: "gray.900", _dark: "white" } }}
                  transition="color 0.15s"
                >
                  Instagram
                </Text>
              </Link>
            )}
            {siteConfig.social.facebook && (
              <Link href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
                <Text
                  fontSize="xs"
                  color={{ base: "gray.400", _dark: "gray.500" }}
                  _hover={{ color: { base: "gray.900", _dark: "white" } }}
                  transition="color 0.15s"
                >
                  Facebook
                </Text>
              </Link>
            )}
            {siteConfig.social.linkedin && (
              <Link href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
                <Text
                  fontSize="xs"
                  color={{ base: "gray.400", _dark: "gray.500" }}
                  _hover={{ color: { base: "gray.900", _dark: "white" } }}
                  transition="color 0.15s"
                >
                  LinkedIn
                </Text>
              </Link>
            )}
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
