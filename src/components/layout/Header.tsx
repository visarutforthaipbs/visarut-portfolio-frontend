"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Container,
  Image,
} from "@chakra-ui/react";
import { Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/lib/config";
import { ContactPopup } from "@/components/ui/ContactPopup";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const pathname = usePathname();

  return (
    <Box
      bg={{ base: "white", _dark: "gray.800" }}
      color={{ base: "gray.600", _dark: "white" }}
      borderBottomWidth="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      position="sticky"
      top={0}
      zIndex={999}
      backdropFilter="blur(10px)"
      className="full-width"
      display="flex"
      justifyContent="center"
      w="100%"
    >
      <Container maxW="5xl" px={{ base: 4, md: 6, lg: 8 }}>
        <Flex
          minH={{ base: "56px", md: "60px" }}
          py={2}
          px={{ base: 2, md: 4 }}
          align="center"
        >
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", md: "none" }}
          >
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              aria-label="Toggle Navigation"
              size="sm"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </Flex>

          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <Link href="/">
              <Image
                src="/logo/black-favicon.svg"
                alt="วิศรุต แสนคำ"
                height="32px"
                width="auto"
                objectFit="contain"
              />
            </Link>

            <HStack
              display={{ base: "none", md: "flex" }}
              ml={10}
              gap={{ base: 2, md: 4 }}
            >
              <DesktopNav pathname={pathname} />
            </HStack>
          </Flex>

          <HStack
            flex={{ base: 1, md: 0 }}
            justify="flex-end"
            gap={{ base: 2, md: 3 }}
          >
            {/* Contact Button */}
            <Button
              onClick={() => setShowContactPopup(true)}
              bg="accent.500"
              color="white"
              _hover={{ bg: "accent.600" }}
              size={{ base: "xs", md: "sm" }}
              className="thai-text"
              display={{ base: "none", md: "flex" }}
              px={{ base: 3, md: 4 }}
              py={2}
            >
              <HStack gap={2}>
                <MessageCircle size={16} />
                <Text fontSize={{ base: "xs", md: "sm" }}>ติดต่อ</Text>
              </HStack>
            </Button>
          </HStack>
        </Flex>

        {isOpen && (
          <Box display={{ md: "none" }}>
            <MobileNav
              pathname={pathname}
              onContactClick={() => setShowContactPopup(true)}
            />
          </Box>
        )}
      </Container>

      {/* Contact Popup */}
      <ContactPopup
        isOpen={showContactPopup}
        onClose={() => setShowContactPopup(false)}
      />
    </Box>
  );
}

const DesktopNav = ({ pathname }: { pathname: string }) => {
  return (
    <>
      {navigation.map((navItem) => (
        <Link key={navItem.label} href={navItem.href}>
          <Button
            variant="ghost"
            fontSize="sm"
            fontWeight={pathname === navItem.href ? 600 : 400}
            color={
              pathname === navItem.href
                ? { base: "accent.500", _dark: "accent.300" }
                : { base: "gray.600", _dark: "gray.200" }
            }
            _hover={{
              color: { base: "gray.800", _dark: "white" },
            }}
            className={navItem.labelTh ? "thai-text" : ""}
          >
            {navItem.labelTh || navItem.label}
          </Button>
        </Link>
      ))}
    </>
  );
};

const MobileNav = ({
  pathname,
  onContactClick,
}: {
  pathname: string;
  onContactClick: () => void;
}) => {
  return (
    <VStack
      bg={{ base: "white", _dark: "gray.800" }}
      p={4}
      align="stretch"
      gap={2}
    >
      {navigation.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          {...navItem}
          isActive={pathname === navItem.href}
        />
      ))}

      {/* Contact Button for Mobile */}
      <Button
        onClick={onContactClick}
        bg="accent.500"
        color="white"
        _hover={{ bg: "accent.600" }}
        size="md"
        className="thai-text"
        mt={2}
        px={4}
        py={2}
      >
        <HStack gap={2}>
          <MessageCircle size={16} />
          <Text>ติดต่อ</Text>
        </HStack>
      </Button>
    </VStack>
  );
};

const MobileNavItem = ({
  label,
  labelTh,
  href,
  isActive,
}: {
  label: string;
  labelTh: string;
  href: string;
  isActive: boolean;
}) => {
  return (
    <Link href={href}>
      <Flex py={2} justify="space-between" align="center">
        <Text
          fontWeight={isActive ? 600 : 400}
          color={
            isActive
              ? { base: "accent.500", _dark: "accent.300" }
              : { base: "gray.600", _dark: "gray.200" }
          }
          className={labelTh ? "thai-text" : ""}
        >
          {labelTh || label}
        </Text>
      </Flex>
    </Link>
  );
};
