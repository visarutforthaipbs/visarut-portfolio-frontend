"use client";

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
      <div className="aspect-video relative">
        <div
          className="relative cursor-pointer hover:scale-[1.02] transition-transform duration-200 w-full h-full"
          onClick={handlePlay}
        >
          <img
            src={video.thumbnail}
            alt={video.alt || "Video thumbnail"}
            className="object-cover w-full h-full rounded-md"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-4 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors duration-200">
            <Play size={24} fill="currentColor" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video">
      <div className="w-full h-full">{renderVideoEmbed()}</div>
    </div>
  );
}

export default PortfolioVideo;
