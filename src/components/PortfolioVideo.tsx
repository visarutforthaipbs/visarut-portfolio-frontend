"use client";

import { Box, AspectRatio, Image } from "@chakra-ui/react";
import { useState } from "react";
import { Play } from "lucide-react";
import type { VideoMedia } from "@/types/portfolio";

interface PortfolioVideoProps {
  video: VideoMedia;
  autoplay?: boolean;
  controls?: boolean;
}

export function PortfolioVideo({
  video,
  autoplay = false,
  controls = true,
}: PortfolioVideoProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const renderVideoEmbed = () => {
    switch (video.provider) {
      case "youtube":
        return (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.videoId}${
              autoplay ? "?autoplay=1" : ""
            }`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "8px" }}
          />
        );
      case "vimeo":
        return (
          <iframe
            width="100%"
            height="100%"
            src={`https://player.vimeo.com/video/${video.videoId}${
              autoplay ? "?autoplay=1" : ""
            }`}
            title="Vimeo video player"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "8px" }}
          />
        );
      case "direct":
        return (
          <video
            width="100%"
            height="100%"
            controls={controls}
            autoPlay={autoplay}
            style={{ borderRadius: "8px" }}
          >
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return null;
    }
  };

  if (!isPlaying && video.thumbnail) {
    return (
      <AspectRatio ratio={16 / 9}>
        <Box
          position="relative"
          cursor="pointer"
          onClick={handlePlay}
          _hover={{ transform: "scale(1.02)" }}
          transition="transform 0.2s ease"
        >
          <Image
            src={video.thumbnail}
            alt={video.alt || "Video thumbnail"}
            objectFit="cover"
            width="100%"
            height="100%"
            borderRadius="md"
          />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="rgba(0, 0, 0, 0.7)"
            color="white"
            p={4}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(0, 0, 0, 0.8)" }}
            transition="background-color 0.2s ease"
          >
            <Play size={24} fill="currentColor" />
          </Box>
        </Box>
      </AspectRatio>
    );
  }

  return (
    <AspectRatio ratio={16 / 9}>
      <Box>{renderVideoEmbed()}</Box>
    </AspectRatio>
  );
}

export default PortfolioVideo;
