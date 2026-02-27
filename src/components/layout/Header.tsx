"use client";

import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Container,
  Image,
} from "@chakra-ui/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/lib/config";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Box
      as="header"
      role="banner"
      bg={{ base: "white", _dark: "gray.900" }}
      position="sticky"
      top={0}
      zIndex={999}
      backdropFilter="blur(12px)"
      display="flex"
      justifyContent="center"
      w="100%"
    >
      <Container maxW="5xl" px={{ base: 5, md: 6 }}>
        <Flex
          h={{ base: "52px", md: "56px" }}
          align="center"
          justify="space-between"
        >
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo/black-favicon.svg"
              alt="วิศรุต แสนคำ"
              height="24px"
              width="auto"
              objectFit="contain"
            />
          </Link>

          {/* Desktop Nav */}
          <HStack
            as="nav"
            aria-label="เมนูหลัก"
            gap={1}
            display={{ base: "none", md: "flex" }}
          >
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                item.subItems?.some((sub) => pathname === sub.href);
              return (
                <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>
                  <Text
                    fontSize="sm"
                    px={3}
                    py={1}
                    color={
                      isActive
                        ? { base: "gray.900", _dark: "white" }
                        : { base: "gray.400", _dark: "gray.500" }
                    }
                    _hover={{ color: { base: "gray.900", _dark: "white" } }}
                    transition="color 0.15s"
                  >
                    {item.labelTh || item.label}
                  </Text>
                </Link>
              );
            })}
          </HStack>

          {/* Mobile toggle */}
          <Box
            display={{ base: "block", md: "none" }}
            cursor="pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={isOpen}
            color={{ base: "gray.600", _dark: "gray.400" }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Box>
        </Flex>

        {/* Mobile Nav */}
        {isOpen && (
          <VStack
            as="nav"
            aria-label="เมนูมือถือ"
            id="mobile-nav"
            align="start"
            gap={0}
            pb={4}
            display={{ md: "none" }}
          >
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                item.subItems?.some((sub) => pathname === sub.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  <Text
                    fontSize="sm"
                    py={2}
                    color={
                      isActive
                        ? { base: "gray.900", _dark: "white" }
                        : { base: "gray.400", _dark: "gray.500" }
                    }
                  >
                    {item.labelTh || item.label}
                  </Text>
                </Link>
              );
            })}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
