"use client";

import {
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { Phone, Mail, X } from "lucide-react";
import { useEffect } from "react";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={1000}
        onClick={onClose}
      />

      {/* Modal Content */}
      <Box
        position="fixed"
        top={{ base: "10%", md: "50%" }}
        left="50%"
        transform={{ base: "translate(-50%, 0)", md: "translate(-50%, -50%)" }}
        bg={{ base: "white", _dark: "gray.800" }}
        borderRadius="lg"
        shadow="xl"
        p={{ base: 4, md: 6 }}
        maxW={{ base: "90vw", md: "400px" }}
        w="full"
        maxH={{ base: "80vh", md: "auto" }}
        overflowY="auto"
        zIndex={1001}
        onClick={(e) => e.stopPropagation()}
      >
        <VStack gap={{ base: 4, md: 6 }} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              color={{ base: "gray.800", _dark: "white" }}
              className="thai-text"
            >
              ติดต่อ
            </Heading>
            <IconButton
              variant="ghost"
              aria-label="Close contact popup"
              onClick={onClose}
              size={{ base: "sm", md: "md" }}
            >
              <X size={20} />
            </IconButton>
          </HStack>

          {/* Contact Information */}
          <VStack gap={{ base: 3, md: 4 }} align="stretch">
            {/* Email Section */}
            <Box>
              <HStack gap={3} mb={2}>
                <Mail size={20} color="#6b7280" />
                <Text
                  fontSize="md"
                  fontWeight="600"
                  color={{ base: "gray.700", _dark: "gray.300" }}
                  className="thai-text"
                >
                  ส่งรายละเอียดโครงการ
                </Text>
              </HStack>
              <Text
                fontSize="lg"
                color={{ base: "gray.800", _dark: "white" }}
                fontWeight="500"
                pl={8}
              >
                visarut298@gmail.com
              </Text>
            </Box>

            {/* Phone Section */}
            <Box>
              <HStack gap={3} mb={2}>
                <Phone size={20} color="#6b7280" />
                <Text
                  fontSize="md"
                  fontWeight="600"
                  color={{ base: "gray.700", _dark: "gray.300" }}
                  className="thai-text"
                >
                  โทรติดต่อ
                </Text>
              </HStack>
              <Text
                fontSize="lg"
                color={{ base: "gray.800", _dark: "white" }}
                fontWeight="500"
                pl={8}
              >
                062-7283058
              </Text>
            </Box>
          </VStack>

          {/* Action Buttons */}
          <VStack gap={{ base: 2, md: 3 }} pt={2}>
            <Button
              onClick={() =>
                window.open("mailto:visarut298@gmail.com", "_blank")
              }
              bg="accent.500"
              color="white"
              _hover={{ bg: "accent.600" }}
              size={{ base: "md", md: "lg" }}
              w="full"
              className="thai-text"
              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 2, md: 3 }}
            >
              <HStack gap={2}>
                <Mail size={16} />
                <Text>ส่งอีเมล</Text>
              </HStack>
            </Button>

            <Button
              onClick={() => window.open("tel:0627283058", "_self")}
              variant="outline"
              borderColor={{ base: "accent.500", _dark: "accent.300" }}
              color={{ base: "accent.500", _dark: "accent.300" }}
              _hover={{
                bg: { base: "accent.50", _dark: "accent.900" },
              }}
              size={{ base: "md", md: "lg" }}
              w="full"
              className="thai-text"
              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 2, md: 3 }}
            >
              <HStack gap={2}>
                <Phone size={16} />
                <Text>โทรเลย</Text>
              </HStack>
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Portal>
  );
}
