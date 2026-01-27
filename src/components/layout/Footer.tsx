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
  return (
    <Box
      bg={{ base: "gray.50", _dark: "gray.900" }}
      color={{ base: "gray.700", _dark: "gray.200" }}
      mt="auto"

      display="flex"
      justifyContent="center"
      w="100%"
    >
      <Container
        maxW="5xl"
        py={{ base: 6, md: 12 }}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        <VStack gap={{ base: 4, md: 8 }}>
          {/* Main Footer Content */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "center", md: "start" }}
            w="full"
            gap={{ base: 4, md: 8 }}
          >
            {/* Brand & Description - Hidden on mobile */}
            <VStack
              align={{ base: "center", md: "start" }}
              gap={4}
              flex={1}
              display={{ base: "none", md: "flex" }}
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={{ base: "gray.800", _dark: "white" }}

              >
                {siteConfig.authorTh}
              </Text>
              <Text
                fontSize="md"
                textAlign={{ base: "center", md: "left" }}
                maxW="300px"

              >
                {siteConfig.descriptionTh}
              </Text>
            </VStack>

            {/* Navigation Links - Compact on mobile */}
            <VStack
              align={{ base: "center", md: "start" }}
              gap={{ base: 2, md: 4 }}
              display={{ base: "none", md: "flex" }}
            >
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color={{ base: "gray.800", _dark: "white" }}

              >
                เมนู
              </Text>
              <VStack gap={1} align="start">
                {navigation.map((item) => (
                  <VStack key={item.href} gap={0.5} align="start" w="full">
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        color={{ base: "gray.600", _dark: "gray.300" }}
                        _hover={{
                          color: { base: "accent.500", _dark: "accent.300" },
                        }}

                        justifyContent="flex-start"
                        width="full"
                      >
                        {item.labelTh || item.label}
                      </Button>
                    </Link>
                    {/* Sub-items */}
                    {item.subItems && item.subItems.length > 0 && (
                      <VStack gap={0.5} align="start" pl={4} w="full">
                        {item.subItems.map((subItem) => (
                          <Link key={subItem.href} href={subItem.href}>
                            <Button
                              variant="ghost"
                              size="sm"
                              color={{ base: "gray.500", _dark: "gray.400" }}
                              _hover={{
                                color: {
                                  base: "accent.500",
                                  _dark: "accent.300",
                                },
                              }}

                              justifyContent="flex-start"
                              width="full"
                              fontSize="xs"
                            >
                              {subItem.labelTh || subItem.label}
                            </Button>
                          </Link>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                ))}
              </VStack>
            </VStack>

            {/* Contact & Social */}
            <VStack
              align={{ base: "center", md: "start" }}
              gap={{ base: 3, md: 4 }}
              w={{ base: "full", md: "auto" }}
            >
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="semibold"
                color={{ base: "gray.800", _dark: "white" }}

                display={{ base: "none", md: "block" }}
              >
                ติดต่อ
              </Text>

              {/* Contact Info - Compact on mobile */}
              <VStack
                gap={{ base: 1, md: 2 }}
                align={{ base: "center", md: "start" }}
              >
                <HStack gap={2}>
                  <Mail size={16} />
                  <Link href={`mailto:${siteConfig.social.email}`}>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
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
                        fontSize={{ base: "xs", md: "sm" }}
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
              <HStack gap={{ base: 2, md: 3 }} mt={{ base: 1, md: 2 }}>
                {siteConfig.social.facebook && (
                  <Link href={siteConfig.social.facebook} target="_blank">
                    <Button
                      variant="ghost"
                      size={{ base: "xs", md: "sm" }}
                      p={{ base: 1, md: 2 }}
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
                      size={{ base: "xs", md: "sm" }}
                      p={{ base: 1, md: 2 }}
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
                      size={{ base: "xs", md: "sm" }}
                      p={{ base: 1, md: 2 }}
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
                      size={{ base: "xs", md: "sm" }}
                      p={{ base: 1, md: 2 }}
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
        </VStack>
      </Container>
    </Box>
  );
}
