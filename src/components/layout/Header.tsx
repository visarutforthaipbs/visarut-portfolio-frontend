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
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      {navigation.map((navItem) => {
        const hasSubItems = navItem.subItems && navItem.subItems.length > 0;
        const isActive =
          pathname === navItem.href ||
          navItem.subItems?.some((sub) => pathname === sub.href);

        if (hasSubItems) {
          return (
            <Box
              key={navItem.label}
              position="relative"
              onMouseEnter={() => setOpenDropdown(navItem.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link href={navItem.href}>
                <Button
                  variant="ghost"
                  fontSize="sm"
                  fontWeight={isActive ? 600 : 400}
                  color={
                    isActive
                      ? { base: "accent.500", _dark: "accent.300" }
                      : { base: "gray.600", _dark: "gray.200" }
                  }
                  _hover={{
                    color: { base: "gray.800", _dark: "white" },
                  }}

                >
                  <HStack gap={1}>
                    <Text>{navItem.labelTh || navItem.label}</Text>
                    <ChevronDown size={16} />
                  </HStack>
                </Button>
              </Link>

              {/* Dropdown Menu */}
              {openDropdown === navItem.label && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  mt={2}
                  bg={{ base: "white", _dark: "gray.800" }}
                  borderWidth="1px"
                  borderColor={{ base: "gray.200", _dark: "gray.700" }}
                  borderRadius="md"
                  boxShadow="lg"
                  minW="200px"
                  py={2}
                  zIndex={1000}
                >
                  {navItem.subItems?.map((subItem) => (
                    <Link key={subItem.label} href={subItem.href}>
                      <Button
                        variant="ghost"
                        w="full"
                        justifyContent="flex-start"
                        fontSize="sm"
                        fontWeight={pathname === subItem.href ? 600 : 400}
                        color={
                          pathname === subItem.href
                            ? { base: "accent.500", _dark: "accent.300" }
                            : { base: "gray.600", _dark: "gray.200" }
                        }
                        _hover={{
                          bg: { base: "gray.50", _dark: "gray.700" },
                          color: { base: "gray.800", _dark: "white" },
                        }}

                        px={4}
                      >
                        {subItem.labelTh || subItem.label}
                      </Button>
                    </Link>
                  ))}
                </Box>
              )}
            </Box>
          );
        }

        return (
          <Link key={navItem.label} href={navItem.href}>
            <Button
              variant="ghost"
              fontSize="sm"
              fontWeight={isActive ? 600 : 400}
              color={
                isActive
                  ? { base: "accent.500", _dark: "accent.300" }
                  : { base: "gray.600", _dark: "gray.200" }
              }
              _hover={{
                color: { base: "gray.800", _dark: "white" },
              }}

            >
              {navItem.labelTh || navItem.label}
            </Button>
          </Link>
        );
      })}
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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <VStack
      bg={{ base: "white", _dark: "gray.800" }}
      p={4}
      align="stretch"
      gap={2}
    >
      {navigation.map((navItem) => (
        <Box key={navItem.label}>
          <MobileNavItem
            {...navItem}
            isActive={
              pathname === navItem.href ||
              navItem.subItems?.some((sub) => pathname === sub.href) ||
              false
            }
            isExpanded={expandedItem === navItem.label}
            onToggle={() =>
              setExpandedItem(
                expandedItem === navItem.label ? null : navItem.label
              )
            }
          />
          {/* Sub Items */}
          {navItem.subItems &&
            navItem.subItems.length > 0 &&
            expandedItem === navItem.label && (
              <VStack align="stretch" pl={4} mt={2} gap={1}>
                {navItem.subItems.map((subItem) => (
                  <Link key={subItem.label} href={subItem.href}>
                    <Flex py={2} justify="space-between" align="center">
                      <Text
                        fontSize="sm"
                        fontWeight={pathname === subItem.href ? 600 : 400}
                        color={
                          pathname === subItem.href
                            ? { base: "accent.500", _dark: "accent.300" }
                            : { base: "gray.500", _dark: "gray.400" }
                        }

                      >
                        {subItem.labelTh || subItem.label}
                      </Text>
                    </Flex>
                  </Link>
                ))}
              </VStack>
            )}
        </Box>
      ))}

      {/* Contact Button for Mobile */}
      <Button
        onClick={onContactClick}
        bg="accent.500"
        color="white"
        _hover={{ bg: "accent.600" }}
        size="md"

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
  subItems,
  isExpanded,
  onToggle,
}: {
  label: string;
  labelTh: string;
  href: string;
  isActive: boolean;
  subItems?: { label: string; labelTh: string; href: string }[];
  isExpanded?: boolean;
  onToggle?: () => void;
}) => {
  const hasSubItems = subItems && subItems.length > 0;

  return (
    <Box>
      <Flex py={2} justify="space-between" align="center">
        <Link href={href}>
          <Text
            fontWeight={isActive ? 600 : 400}
            color={
              isActive
                ? { base: "accent.500", _dark: "accent.300" }
                : { base: "gray.600", _dark: "gray.200" }
            }

          >
            {labelTh || label}
          </Text>
        </Link>
        {hasSubItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            p={1}
            minW="auto"
          >
            <ChevronDown
              size={16}
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </Button>
        )}
      </Flex>
    </Box>
  );
};
