"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout";
import Link from "next/link";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero */}
      <Box
        as="section"
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 20, md: 28 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="ติดต่อ"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={5} textAlign="center">
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={{ base: "gray.900", _dark: "white" }}
              letterSpacing="-0.025em"
            >
              ติดต่อ
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={{ base: "gray.500", _dark: "gray.400" }}
              lineHeight="1.8"
              maxW="560px"
            >
              พร้อมให้คำปรึกษาและรับฟังความต้องการของคุณ
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Divider */}
      <Box
        w="100%"
        display="flex"
        justifyContent="center"
        bg={{ base: "white", _dark: "gray.900" }}
        aria-hidden="true"
      >
        <Box w="60px" h="1px" bg={{ base: "gray.200", _dark: "gray.700" }} />
      </Box>

      {/* Form Section */}
      <Box
        as="section"
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="ส่งข้อความ"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8} align="stretch">
            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="medium"
              color={{ base: "gray.400", _dark: "gray.500" }}
              textTransform="uppercase"
              letterSpacing="wider"
              textAlign="center"
            >
              ส่งข้อความ
            </Heading>

            {submitStatus === "success" && (
              <Box textAlign="center" role="alert" aria-live="polite">
                <Text fontSize="sm" color="green.500">
                  ส่งข้อความสำเร็จ — เราจะติดต่อกลับโดยเร็ว
                </Text>
              </Box>
            )}

            {submitStatus === "error" && (
              <Box textAlign="center" role="alert" aria-live="polite">
                <Text fontSize="sm" color="red.500">
                  เกิดข้อผิดพลาด — กรุณาลองใหม่อีกครั้ง
                </Text>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <VStack gap={5}>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ชื่อ"
                  aria-label="ชื่อ"
                  size="lg"
                  variant="flushed"
                  borderColor={{ base: "gray.200", _dark: "gray.700" }}
                  _focus={{ borderColor: { base: "gray.900", _dark: "white" } }}
                  fontSize="sm"
                  required
                />

                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="อีเมล"
                  aria-label="อีเมล"
                  size="lg"
                  variant="flushed"
                  borderColor={{ base: "gray.200", _dark: "gray.700" }}
                  _focus={{ borderColor: { base: "gray.900", _dark: "white" } }}
                  fontSize="sm"
                  required
                />

                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="หัวข้อ"
                  aria-label="หัวข้อ"
                  size="lg"
                  variant="flushed"
                  borderColor={{ base: "gray.200", _dark: "gray.700" }}
                  _focus={{ borderColor: { base: "gray.900", _dark: "white" } }}
                  fontSize="sm"
                  required
                />

                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="ข้อความ"
                  aria-label="ข้อความ"
                  rows={5}
                  resize="vertical"
                  variant="flushed"
                  borderColor={{ base: "gray.200", _dark: "gray.700" }}
                  _focus={{ borderColor: { base: "gray.900", _dark: "white" } }}
                  fontSize="sm"
                  required
                />

                <Box pt={4} w="full" textAlign="center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                  >
                    <HStack
                      gap={2}
                      justify="center"
                      color={{ base: "gray.900", _dark: "white" }}
                      fontWeight="medium"
                      fontSize="sm"
                      transition="gap 0.2s"
                      opacity={isSubmitting ? 0.5 : 1}
                    >
                      <Text>{isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}</Text>
                      <ArrowRight size={16} aria-hidden="true" />
                    </HStack>
                  </button>
                </Box>
              </VStack>
            </form>
          </VStack>
        </Container>
      </Box>

      {/* Divider */}
      <Box
        w="100%"
        display="flex"
        justifyContent="center"
        bg={{ base: "white", _dark: "gray.900" }}
        aria-hidden="true"
      >
        <Box w="60px" h="1px" bg={{ base: "gray.200", _dark: "gray.700" }} />
      </Box>

      {/* Contact Info Section */}
      <Box
        as="section"
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 24 }}
        display="flex"
        justifyContent="center"
        w="100%"
        role="region"
        aria-label="ช่องทางติดต่อ"
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={8} align="stretch">
            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="medium"
              color={{ base: "gray.400", _dark: "gray.500" }}
              textTransform="uppercase"
              letterSpacing="wider"
              textAlign="center"
            >
              ช่องทางติดต่อ
            </Heading>

            <VStack gap={4} align="stretch">
              <HStack
                justify="space-between"
                align="center"
                py={2}
                borderBottom="1px solid"
                borderColor={{ base: "gray.100", _dark: "gray.800" }}
              >
                <Text
                  fontSize="sm"
                  color={{ base: "gray.500", _dark: "gray.400" }}
                >
                  อีเมล
                </Text>
                <Link href="mailto:visarut298@gmail.com">
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="medium"
                    color={{ base: "gray.800", _dark: "white" }}
                    _hover={{ color: { base: "gray.500", _dark: "gray.400" } }}
                    transition="color 0.2s"
                  >
                    visarut298@gmail.com
                  </Text>
                </Link>
              </HStack>

              <HStack
                justify="space-between"
                align="center"
                py={2}
                borderBottom="1px solid"
                borderColor={{ base: "gray.100", _dark: "gray.800" }}
              >
                <Text
                  fontSize="sm"
                  color={{ base: "gray.500", _dark: "gray.400" }}
                >
                  โทรศัพท์
                </Text>
                <Link href="tel:+66627283058">
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="medium"
                    color={{ base: "gray.800", _dark: "white" }}
                    _hover={{ color: { base: "gray.500", _dark: "gray.400" } }}
                    transition="color 0.2s"
                  >
                    062-728-3058
                  </Text>
                </Link>
              </HStack>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}

