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
import { useEffect, useRef, useCallback } from "react";
import { T } from "@/lib/tokens";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap: cycle focus within modal
  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        handleTabKey(e);
      }
    };

    if (isOpen) {
      // Save current focus to restore later
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      // Focus the dialog on open
      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";

      // Restore focus to triggering element
      if (previousFocusRef.current && !isOpen) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, handleTabKey]);

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
        aria-hidden="true"
      />

      {/* Modal Content */}
      <Box
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="ช่องทางติดต่อ"
        tabIndex={-1}
        position="fixed"
        top={{ base: "10%", md: "50%" }}
        left="50%"
        transform={{ base: "translate(-50%, 0)", md: "translate(-50%, -50%)" }}
        bg={T.surface}
        borderRadius="lg"
        border="1px solid"
        borderColor={T.border}
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
              color={T.text}

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
                <Mail size={20} color={T.textDim} />
                <Text
                  fontSize="md"
                  fontWeight="600"
                  color={T.textMuted}

                >
                  ส่งรายละเอียดโครงการ
                </Text>
              </HStack>
              <Text
                fontSize="lg"
                color={T.text}
                fontWeight="500"
                pl={8}
              >
                visarut298@gmail.com
              </Text>
            </Box>

            {/* Phone Section */}
            <Box>
              <HStack gap={3} mb={2}>
                <Phone size={20} color={T.textDim} />
                <Text
                  fontSize="md"
                  fontWeight="600"
                  color={T.textMuted}

                >
                  โทรติดต่อ
                </Text>
              </HStack>
              <Text
                fontSize="lg"
                color={T.text}
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
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open("mailto:visarut298@gmail.com", "_blank");
                }
              }}
              bg={T.accent}
              color={T.bg}
              _hover={{ bg: "#d97706" }}
              size={{ base: "md", md: "lg" }}
              w="full"

              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 2, md: 3 }}
            >
              <HStack gap={2}>
                <Mail size={16} />
                <Text>ส่งอีเมล</Text>
              </HStack>
            </Button>

            <Button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open("tel:0627283058", "_self");
                }
              }}
              variant="outline"
              borderColor={T.border}
              color={T.textMuted}
              _hover={{
                bg: T.surfaceHover,
              }}
              size={{ base: "md", md: "lg" }}
              w="full"

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
