import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { ActionBar } from "./ActionBar";
import { mockVideos } from "@/data/mockVideos";
import { ChevronUp, ChevronDown } from "lucide-react";

export const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const currentVideo = mockVideos[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50;
    const isSwipeDown = distance < -50;

    if (isSwipeUp && currentIndex < mockVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    if (isSwipeDown && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && currentIndex < mockVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (e.key === "ArrowUp" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-background"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Card */}
      <div className="w-full h-full transition-transform duration-300 ease-out">
        <VideoCard video={currentVideo} />
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-opacity ${
            currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:bg-card"
          }`}
        >
          <ChevronUp className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={() => currentIndex < mockVideos.length - 1 && setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === mockVideos.length - 1}
          className={`w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-opacity ${
            currentIndex === mockVideos.length - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:bg-card"
          }`}
        >
          <ChevronDown className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {mockVideos.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-1 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Action Bar */}
      <ActionBar
        tokenSymbol={currentVideo.token.symbol}
        tokenPrice={currentVideo.token.price}
      />
    </div>
  );
};
