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
import { T } from "@/lib/tokens";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Box
      as="header"
      role="banner"
      bg={T.bg}
      position="sticky"
      top={0}
      zIndex={999}
      borderBottom="1px solid"
      borderColor={T.border}
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
              src="/logo/white-favicon.svg"
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
                        ? T.text
                        : T.textDim
                    }
                    _hover={{ color: T.text }}
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
            color={T.textMuted}
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
                        ? T.text
                        : T.textDim
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
