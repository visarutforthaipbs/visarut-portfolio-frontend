"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem, ImageMedia } from "@/types/portfolio";

interface FeaturedSliderProps {
  items: PortfolioItem[];
}

function getFeaturedImageUrl(image: string | ImageMedia | undefined): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.sizes?.large || image.sizes?.full || image.url || "";
}

function getTextContent(content: { rendered: string } | string): string {
  if (typeof content === "string") return content;
  return content.rendered?.replace(/<[^>]*>/g, "") || "";
}

export function FeaturedSlider({ items }: FeaturedSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  if (items.length === 0) return null;

  return (
    <Box
      as="section"
      role="region"
      aria-label="ผลงานแนะนำ"
      aria-roledescription="carousel"
      w="100%"
      bg={{ base: "gray.900", _dark: "gray.950" }}
      position="relative"
      overflow="hidden"
    >
      {/* Embla viewport */}
      <Box ref={emblaRef} overflow="hidden">
        <Box display="flex">
          {items.map((item, index) => {
            const imageUrl = getFeaturedImageUrl(item.featured_image);
            const title = getTextContent(item.title);
            const category =
              PORTFOLIO_CATEGORIES[item.category] || item.category;

            return (
              <Box
                key={item.id}
                flex="0 0 100%"
                minW="0"
                position="relative"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} จาก ${items.length}: ${title}`}
              >
                <Link href={`/portfolio/${item.slug}`} aria-label={title}>
                  <Box
                    position="relative"
                    h={{ base: "50vh", md: "65vh" }}
                    w="100%"
                    cursor="pointer"
                  >
                    {/* Background image */}
                    {imageUrl && (
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        backgroundImage={`url(${imageUrl})`}
                        backgroundSize="cover"
                        backgroundPosition="center"
                        backgroundRepeat="no-repeat"
                        transition="transform 6s ease-out"
                        _groupHover={{ transform: "scale(1.03)" }}
                      />
                    )}

                    {/* Gradient overlay */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bgGradient="to-t"
                      gradientFrom="blackAlpha.700"
                      gradientVia="blackAlpha.300"
                      gradientTo="transparent"
                    />

                    {/* Content overlay */}
                    <VStack
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      p={{ base: 6, md: 12 }}
                      align="start"
                      gap={2}
                    >
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        color="whiteAlpha.700"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        fontWeight="medium"
                      >
                        {category}
                      </Text>
                      <Heading
                        as="h2"
                        fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                        fontWeight="bold"
                        color="white"
                        lineHeight="1.1"
                        maxW="700px"
                      >
                        {title}
                      </Heading>
                    </VStack>
                  </Box>
                </Link>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Dots */}
      {items.length > 1 && (
        <HStack
          position="absolute"
          bottom={{ base: 3, md: 5 }}
          right={{ base: 4, md: 12 }}
          gap={2}
          aria-label="เลือกสไลด์"
          role="tablist"
        >
          {items.map((_, index) => (
            <Box
              key={index}
              as="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`สไลด์ ${index + 1}`}
              w={index === selectedIndex ? "24px" : "8px"}
              h="8px"
              borderRadius="full"
              bg={index === selectedIndex ? "white" : "whiteAlpha.500"}
              transition="all 0.3s"
              cursor="pointer"
              onClick={() => scrollTo(index)}
              _hover={{ bg: "white" }}
            />
          ))}
        </HStack>
      )}
    </Box>
  );
}
