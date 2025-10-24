import { useState, useEffect, useMemo } from "react";
import { VideoCard } from "./VideoCard";
import { ActionBar } from "./ActionBar";
import { StreamFilters } from "./StreamFilters";
import { ContentSubmissionModal } from "./ContentSubmissionModal";
import { useVideos } from "@/hooks/useVideos";
import { useVideoPreloader } from "@/hooks/useVideoPreloader";
import { VideoCategory } from "@/types/video";
import { ChevronUp, ChevronDown, Play, Pause, Loader2 } from "lucide-react";

export const VideoFeed = () => {
  const { videos: apiVideos, loading, error } = useVideos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  // Filter videos based on selected categories and location
  const filteredVideos = useMemo(() => {
    let videos = apiVideos;

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
  }, [apiVideos, selectedCategories, locationSearch]);

  const currentVideo = filteredVideos[currentIndex];
  
  // Preload next videos for faster loading
  const { isPreloaded, preloadedCount } = useVideoPreloader(filteredVideos, currentIndex, 3);

  // Track video progress
  useEffect(() => {
    if (!isAutoPlaying || !currentVideo) return;

    setVideoProgress(0);
    const duration = (currentVideo.duration || 3) * 1000;
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setVideoProgress(progress);
    }, 50);

    return () => clearInterval(progressInterval);
  }, [currentIndex, isAutoPlaying, currentVideo]);

  // Auto-play: advance to next video based on video duration
  useEffect(() => {
    if (!isAutoPlaying || filteredVideos.length === 0 || !currentVideo) return;

    // Use video duration (in seconds) * 1000 to convert to milliseconds
    const duration = (currentVideo.duration || 3) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex(prev => {
        // Loop back to start when reaching the end
        if (prev >= filteredVideos.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, isAutoPlaying, filteredVideos.length, currentVideo]);

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

    if (isSwipeUp) {
      // Swipe up - go to next video (with loop)
      setCurrentIndex(prev => (prev >= filteredVideos.length - 1) ? 0 : prev + 1);
      // Pause auto-play temporarily when user manually swipes
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
    }

    if (isSwipeDown) {
      // Swipe down - go to previous video (with loop)
      setCurrentIndex(prev => (prev <= 0) ? filteredVideos.length - 1 : prev - 1);
      // Pause auto-play temporarily when user manually swipes
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      // Arrow down - go to next video (with loop)
      setCurrentIndex(prev => (prev >= filteredVideos.length - 1) ? 0 : prev + 1);
      // Pause auto-play temporarily when user manually navigates
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
    }
    if (e.key === "ArrowUp") {
      // Arrow up - go to previous video (with loop)
      setCurrentIndex(prev => (prev <= 0) ? filteredVideos.length - 1 : prev - 1);
      // Pause auto-play temporarily when user manually navigates
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
    }
  };

  const handleWheel = (e: WheelEvent) => {
    // Throttle wheel events to prevent too rapid scrolling
    const now = Date.now();
    if (now - (handleWheel as any).lastScroll < 500) return;
    (handleWheel as any).lastScroll = now;

    if (e.deltaY > 0) {
      // Scroll down - go to next video (with loop)
      setCurrentIndex(prev => (prev >= filteredVideos.length - 1) ? 0 : prev + 1);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    } else if (e.deltaY < 0) {
      // Scroll up - go to previous video (with loop)
      setCurrentIndex(prev => (prev <= 0) ? filteredVideos.length - 1 : prev - 1);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    }
  };
  (handleWheel as any).lastScroll = 0;

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
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex, filteredVideos.length]);

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-xl text-muted-foreground">Loading videos from database...</p>
        </div>
      </div>
    );
  }

  // Show error with fallback info
  if (error) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <p className="text-xl text-yellow-500">⚠️ API Connection Issue</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">Using local placeholder videos ({apiVideos.length} available)</p>
          <p className="text-xs text-muted-foreground">Note: All 46 real videos are in your MongoDB database</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry Connection
          </button>
        </div>
        <StreamFilters
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          locationSearch={locationSearch}
          onLocationSearch={handleLocationSearch}
          onClearFilters={handleClearFilters}
        />
      </div>
    );
  }

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
      <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 sm:gap-4">
        {/* Auto-play toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/80 border border-white/20"
          title={isAutoPlaying ? "Pause auto-play" : "Resume auto-play"}
        >
          {isAutoPlaying ? (
            <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          )}
        </button>
        
        <button
          onClick={() => {
            // Go to previous video (with loop)
            setCurrentIndex(prev => (prev <= 0) ? filteredVideos.length - 1 : prev - 1);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity border border-white/20 opacity-100 hover:bg-black/80"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          onClick={() => {
            // Go to next video (with loop)
            setCurrentIndex(prev => (prev >= filteredVideos.length - 1) ? 0 : prev + 1);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity border border-white/20 opacity-100 hover:bg-black/80"
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="absolute top-16 sm:top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {filteredVideos.map((_, index) => (
          <div
            key={index}
            className="relative h-1 rounded-full bg-muted-foreground/30 overflow-hidden"
            style={{ width: index === currentIndex ? '32px' : '4px' }}
          >
            {index === currentIndex && isAutoPlaying && (
              <div
                className="absolute inset-0 bg-primary transition-all duration-100"
                style={{ width: `${videoProgress}%` }}
              />
            )}
            {index === currentIndex && !isAutoPlaying && (
              <div className="absolute inset-0 bg-primary" />
            )}
          </div>
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
