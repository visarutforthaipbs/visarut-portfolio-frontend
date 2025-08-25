"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "อีเมล",
      value: "visarut298@gmail.com",
      link: "mailto:visarut298@gmail.com",
    },
    {
      icon: <Phone size={24} />,
      title: "โทรศัพท์",
      value: "+66-627-283-058",
      link: "tel:+66627283058",
    },
    {
      icon: <MapPin size={24} />,
      title: "ที่อยู่",
      value: "กรุงเทพมหานคร ประเทศไทย",
      link: null,
    },
    {
      icon: <Clock size={24} />,
      title: "เวลาทำการ",
      value: "จันทร์ - ศุกร์: 9:00 - 18:00",
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook size={20} />,
      name: "Facebook",
      url: "https://www.facebook.com/visarut.sankham/",
      color: "#1877F2",
    },
    {
      icon: <Instagram size={20} />,
      name: "Instagram",
      url: "https://www.instagram.com/visarut_sankham/",
      color: "#E4405F",
    },
    {
      icon: <Linkedin size={20} />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/visarut-sankham-99b008b9/",
      color: "#0A66C2",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        py={{ base: 16, md: 20 }}
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="5xl" px={{ base: 6, md: 8 }}>
          <VStack gap={8} textAlign="center">
            <VStack gap={4}>
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="bold"
                color={{ base: "gray.800", _dark: "white" }}
                className="thai-text"
              >
                ติดต่อเรา
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={{ base: "gray.600", _dark: "gray.300" }}
                maxW="600px"
                className="thai-text"
                lineHeight="1.7"
              >
                พร้อมให้คำปรึกษาและรับฟังความต้องการของคุณ
                เพื่อสร้างสรรค์ผลงานที่โดดเด่นและตรงใจ
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box
        bg={{ base: "gray.50", _dark: "gray.800" }}
        py={{ base: 16, md: 20 }}
        className="full-width"
        display="flex"
        justifyContent="center"
        w="100%"
      >
        <Container maxW="6xl" px={{ base: 6, md: 8 }}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={16}>
            {/* Contact Information */}
            <VStack gap={8} align="stretch">
              <VStack gap={4} align="start">
                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color={{ base: "gray.800", _dark: "white" }}
                  className="thai-text"
                >
                  ข้อมูลการติดต่อ
                </Heading>
                <Text
                  fontSize="lg"
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  className="thai-text"
                  lineHeight="1.7"
                >
                  ติดต่อเราผ่านช่องทางต่างๆ ด้านล่าง หรือส่งข้อความมาทางแบบฟอร์ม
                  เราจะตอบกลับโดยเร็วที่สุด
                </Text>
              </VStack>

              <VStack gap={6} align="stretch">
                {contactInfo.map((info, index) => (
                  <Box
                    key={index}
                    bg={{ base: "white", _dark: "gray.700" }}
                    p={6}
                    borderRadius="xl"
                    shadow="sm"
                    border="1px solid"
                    borderColor={{ base: "gray.200", _dark: "gray.600" }}
                    _hover={
                      info.link
                        ? {
                            transform: "translateY(-2px)",
                            shadow: "md",
                          }
                        : {}
                    }
                    transition="all 0.2s"
                    cursor={info.link ? "pointer" : "default"}
                    onClick={
                      info.link
                        ? () => {
                            if (typeof window !== "undefined") {
                              window.open(info.link, "_self");
                            }
                          }
                        : undefined
                    }
                  >
                    <HStack gap={4}>
                      <Box
                        color={{ base: "accent.500", _dark: "accent.300" }}
                        flexShrink={0}
                      >
                        {info.icon}
                      </Box>
                      <VStack gap={1} align="start">
                        <Text
                          fontSize="sm"
                          color={{ base: "gray.500", _dark: "gray.400" }}
                          className="thai-text"
                          fontWeight="500"
                        >
                          {info.title}
                        </Text>
                        <Text
                          fontSize="md"
                          color={{ base: "gray.800", _dark: "white" }}
                          className="thai-text"
                          fontWeight="500"
                        >
                          {info.value}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>

              {/* Social Links */}
              <VStack gap={4} align="start">
                <Text
                  fontSize="lg"
                  color={{ base: "gray.800", _dark: "white" }}
                  className="thai-text"
                  fontWeight="600"
                >
                  ติดตามเราได้ที่
                </Text>
                <HStack gap={4}>
                  {socialLinks.map((social, index) => (
                    <Box
                      key={index}
                      p={3}
                      borderRadius="lg"
                      bg={{ base: "white", _dark: "gray.700" }}
                      color={social.color}
                      border="1px solid"
                      borderColor={{ base: "gray.200", _dark: "gray.600" }}
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "md",
                        bg: social.color,
                        color: "white",
                      }}
                      transition="all 0.2s"
                      cursor="pointer"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.open(social.url, "_blank");
                        }
                      }}
                    >
                      {social.icon}
                    </Box>
                  ))}
                </HStack>
              </VStack>
            </VStack>

            {/* Contact Form */}
            <Box
              bg={{ base: "white", _dark: "gray.700" }}
              p={8}
              borderRadius="xl"
              shadow="lg"
              border="1px solid"
              borderColor={{ base: "gray.200", _dark: "gray.600" }}
            >
              <VStack gap={6} align="stretch">
                <VStack gap={2} align="start">
                  <Heading
                    fontSize={{ base: "xl", md: "2xl" }}
                    color={{ base: "gray.800", _dark: "white" }}
                    className="thai-text"
                  >
                    ส่งข้อความหาเรา
                  </Heading>
                  <Text
                    fontSize="md"
                    color={{ base: "gray.600", _dark: "gray.300" }}
                    className="thai-text"
                  >
                    กรอกข้อมูลด้านล่าง เราจะติดต่อกลับภายใน 24 ชั่วโมง
                  </Text>
                </VStack>

                {submitStatus === "success" && (
                  <Box
                    bg="green.50"
                    border="1px solid"
                    borderColor="green.200"
                    borderRadius="lg"
                    p={4}
                  >
                    <Text
                      color="green.700"
                      className="thai-text"
                      fontWeight="500"
                    >
                      ✅ ส่งข้อความสำเร็จ! เราจะติดต่อกลับภายใน 24 ชั่วโมง
                    </Text>
                  </Box>
                )}

                <form onSubmit={handleSubmit}>
                  <VStack gap={4}>
                    {/* Name Field */}
                    <VStack gap={2} align="start" w="full">
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={{ base: "gray.700", _dark: "gray.200" }}
                        className="thai-text"
                      >
                        ชื่อ-นามสกุล *
                      </Text>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="กรอกชื่อ-นามสกุลของคุณ"
                        className="thai-text"
                        size="lg"
                        bg={{ base: "gray.50", _dark: "gray.600" }}
                        border="1px solid"
                        borderColor={{ base: "gray.300", _dark: "gray.500" }}
                        required
                      />
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} w="full">
                      {/* Email Field */}
                      <VStack gap={2} align="start" w="full">
                        <Text
                          fontSize="sm"
                          fontWeight="500"
                          color={{ base: "gray.700", _dark: "gray.200" }}
                          className="thai-text"
                        >
                          อีเมล *
                        </Text>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          size="lg"
                          bg={{ base: "gray.50", _dark: "gray.600" }}
                          border="1px solid"
                          borderColor={{ base: "gray.300", _dark: "gray.500" }}
                          required
                        />
                      </VStack>

                      {/* Phone Field */}
                      <VStack gap={2} align="start" w="full">
                        <Text
                          fontSize="sm"
                          fontWeight="500"
                          color={{ base: "gray.700", _dark: "gray.200" }}
                          className="thai-text"
                        >
                          โทรศัพท์
                        </Text>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0X-XXX-XXXX"
                          className="thai-text"
                          size="lg"
                          bg={{ base: "gray.50", _dark: "gray.600" }}
                          border="1px solid"
                          borderColor={{ base: "gray.300", _dark: "gray.500" }}
                        />
                      </VStack>
                    </SimpleGrid>

                    {/* Subject Field */}
                    <VStack gap={2} align="start" w="full">
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={{ base: "gray.700", _dark: "gray.200" }}
                        className="thai-text"
                      >
                        หัวข้อ *
                      </Text>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="หัวข้อที่ต้องการสอบถาม"
                        className="thai-text"
                        size="lg"
                        bg={{ base: "gray.50", _dark: "gray.600" }}
                        border="1px solid"
                        borderColor={{ base: "gray.300", _dark: "gray.500" }}
                        required
                      />
                    </VStack>

                    {/* Message Field */}
                    <VStack gap={2} align="start" w="full">
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={{ base: "gray.700", _dark: "gray.200" }}
                        className="thai-text"
                      >
                        ข้อความ *
                      </Text>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="รายละเอียดที่ต้องการสอบถาม..."
                        className="thai-text"
                        rows={5}
                        resize="vertical"
                        bg={{ base: "gray.50", _dark: "gray.600" }}
                        border="1px solid"
                        borderColor={{ base: "gray.300", _dark: "gray.500" }}
                        required
                      />
                    </VStack>

                    <Button
                      type="submit"
                      size="lg"
                      bg="accent.500"
                      color="white"
                      _hover={{ bg: "accent.600" }}
                      loading={isSubmitting}
                      loadingText="กำลังส่ง..."
                      className="thai-text"
                      w="full"
                      px={8}
                      py={6}
                    >
                      <HStack gap={2}>
                        <Send size={20} />
                        <Text>ส่งข้อความ</Text>
                      </HStack>
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Layout>
  );
}
