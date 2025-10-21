import { useState, useEffect, useMemo } from "react";
import { VideoCard } from "./VideoCard";
import { ActionBar } from "./ActionBar";
import { StreamFilters } from "./StreamFilters";
import { ContentSubmissionModal } from "./ContentSubmissionModal";
import { mockVideos } from "@/data/mockVideos";
import { VideoCategory } from "@/types/video";
import { ChevronUp, ChevronDown } from "lucide-react";

export const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>([]);
  const [locationSearch, setLocationSearch] = useState("");

  // Filter videos based on selected categories and location
  const filteredVideos = useMemo(() => {
    let videos = mockVideos;

    if (selectedCategories.length > 0) {
      videos = videos.filter(video =>
        video.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    if (locationSearch.trim()) {
      videos = videos.filter(video =>
        video.location.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
        video.location.country.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    return videos;
  }, [selectedCategories, locationSearch]);

  const currentVideo = filteredVideos[currentIndex];

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

    if (isSwipeUp && currentIndex < filteredVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    if (isSwipeDown && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && currentIndex < filteredVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (e.key === "ArrowUp" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCategoryToggle = (category: VideoCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentIndex(0); // Reset to first video when filter changes
  };

  const handleLocationSearch = (location: string) => {
    setLocationSearch(location);
    setCurrentIndex(0); // Reset to first video when search changes
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setLocationSearch("");
    setCurrentIndex(0);
  };

  // Reset index if it's out of bounds after filtering
  useEffect(() => {
    if (currentIndex >= filteredVideos.length && filteredVideos.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredVideos.length, currentIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  if (!currentVideo) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">No videos match your filters</p>
          <button
            onClick={handleClearFilters}
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
        <StreamFilters
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          locationSearch={locationSearch}
          onLocationSearch={handleLocationSearch}
          onClearFilters={handleClearFilters}
        />
        <ContentSubmissionModal />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-background"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stream Filters */}
      <StreamFilters
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        locationSearch={locationSearch}
        onLocationSearch={handleLocationSearch}
        onClearFilters={handleClearFilters}
      />

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
          onClick={() => currentIndex < filteredVideos.length - 1 && setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === filteredVideos.length - 1}
          className={`w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-opacity ${
            currentIndex === filteredVideos.length - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:bg-card"
          }`}
        >
          <ChevronDown className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {filteredVideos.map((_, index) => (
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

      {/* Content Submission Button */}
      <ContentSubmissionModal />
    </div>
  );
};
