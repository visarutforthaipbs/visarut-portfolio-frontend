"use client";

import {
  Box,
  Container,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { siteConfig, navigation } from "@/lib/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      bg={{ base: "gray.50", _dark: "gray.900" }}
      color={{ base: "gray.700", _dark: "gray.200" }}
      mt="auto"
      className="full-width"
      display="flex"
      justifyContent="center"
      w="100%"
    >
      <Container
        maxW="5xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        <VStack gap={{ base: 6, md: 8 }}>
          {/* Main Footer Content */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "center", md: "start" }}
            w="full"
            gap={{ base: 6, md: 8 }}
          >
            {/* Brand & Description */}
            <VStack align={{ base: "center", md: "start" }} gap={4} flex={1}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
              >
                {siteConfig.authorTh}
              </Text>
              <Text
                fontSize="md"
                textAlign={{ base: "center", md: "left" }}
                maxW="300px"
                className="thai-text"
              >
                {siteConfig.descriptionTh}
              </Text>
            </VStack>

            {/* Navigation Links */}
            <VStack align={{ base: "center", md: "start" }} gap={4}>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
              >
                เมนู
              </Text>
              <VStack gap={2}>
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      color={{ base: "gray.600", _dark: "gray.300" }}
                      _hover={{
                        color: { base: "accent.500", _dark: "accent.300" },
                      }}
                      className={item.labelTh ? "thai-text" : ""}
                    >
                      {item.labelTh || item.label}
                    </Button>
                  </Link>
                ))}
              </VStack>
            </VStack>

            {/* Contact & Social */}
            <VStack align={{ base: "center", md: "start" }} gap={4}>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
              >
                ติดต่อ
              </Text>

              {/* Contact Info */}
              <VStack gap={2} align={{ base: "center", md: "start" }}>
                <HStack gap={2}>
                  <Mail size={16} />
                  <Link href={`mailto:${siteConfig.social.email}`}>
                    <Text
                      fontSize="sm"
                      _hover={{
                        color: { base: "accent.500", _dark: "accent.300" },
                      }}
                    >
                      {siteConfig.social.email}
                    </Text>
                  </Link>
                </HStack>

                {siteConfig.social.phone && (
                  <HStack gap={2}>
                    <Phone size={16} />
                    <Link href={`tel:${siteConfig.social.phone}`}>
                      <Text
                        fontSize="sm"
                        _hover={{
                          color: { base: "accent.500", _dark: "accent.300" },
                        }}
                      >
                        {siteConfig.social.phone}
                      </Text>
                    </Link>
                  </HStack>
                )}
              </VStack>

              {/* Social Links */}
              <HStack gap={3} mt={2}>
                {siteConfig.social.facebook && (
                  <Link href={siteConfig.social.facebook} target="_blank">
                    <Button
                      variant="ghost"
                      size="sm"
                      p={2}
                      _hover={{
                        color: { base: "accent.500", _dark: "accent.300" },
                      }}
                    >
                      <Facebook size={20} />
                    </Button>
                  </Link>
                )}

                {siteConfig.social.instagram && (
                  <Link href={siteConfig.social.instagram} target="_blank">
                    <Button
                      variant="ghost"
                      size="sm"
                      p={2}
                      _hover={{
                        color: { base: "accent.500", _dark: "accent.300" },
                      }}
                    >
                      <Instagram size={20} />
                    </Button>
                  </Link>
                )}

                {siteConfig.social.youtube && (
                  <Link href={siteConfig.social.youtube} target="_blank">
                    <Button
                      variant="ghost"
                      size="sm"
                      p={2}
                      _hover={{
                        color: { base: "accent.500", _dark: "accent.300" },
                      }}
                    >
                      <Youtube size={20} />
                    </Button>
                  </Link>
                )}

                {siteConfig.social.linkedin && (
                  <Link href={siteConfig.social.linkedin} target="_blank">
                    <Button
                      variant="ghost"
                      size="sm"
                      p={2}
                      _hover={{
                        color: { base: "accent.500", _dark: "accent.300" },
                      }}
                    >
                      <Linkedin size={20} />
                    </Button>
                  </Link>
                )}
              </HStack>
            </VStack>
          </Flex>

          <Box w="full" h="1px" bg={{ base: "gray.200", _dark: "gray.700" }} />

          {/* Copyright */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            w="full"
            gap={4}
          >
            <Text fontSize="sm" textAlign="center">
              © {currentYear} {siteConfig.author}. สงวนลิขสิทธิ์
            </Text>
            <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }}>
              สร้างด้วย Next.js และ Chakra UI
            </Text>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
