import { useEffect, useRef } from 'react';
import { VideoContent } from '@/types/video';

/**
 * Hook to preload videos for faster playback
 * Preloads the next 2-3 videos in the feed
 */
export const useVideoPreloader = (
  videos: VideoContent[],
  currentIndex: number,
  preloadCount: number = 2
) => {
  const preloadedVideos = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!videos.length) return;

    // Preload current and next videos
    const videosToPreload: VideoContent[] = [];
    
    for (let i = 0; i <= preloadCount; i++) {
      const index = (currentIndex + i) % videos.length;
      const video = videos[index];
      
      if (video && !preloadedVideos.current.has(video.videoUrl)) {
        videosToPreload.push(video);
      }
    }

    // Create hidden video elements to preload
    videosToPreload.forEach(video => {
      const videoElement = document.createElement('video');
      videoElement.src = video.videoUrl;
      videoElement.preload = 'auto';
      videoElement.muted = true;
      videoElement.style.display = 'none';
      
      videoElement.addEventListener('loadeddata', () => {
        preloadedVideos.current.add(video.videoUrl);
        console.log(`✅ Preloaded: ${video.location.name}`);
      });
      
      videoElement.addEventListener('error', () => {
        console.log(`❌ Failed to preload: ${video.location.name}`);
      });

      document.body.appendChild(videoElement);
      
      // Load the video
      videoElement.load();

      // Cleanup after 30 seconds
      setTimeout(() => {
        if (videoElement.parentNode) {
          videoElement.parentNode.removeChild(videoElement);
        }
      }, 30000);
    });

    // Cleanup old preloaded entries (keep only last 10)
    if (preloadedVideos.current.size > 10) {
      const entries = Array.from(preloadedVideos.current);
      entries.slice(0, entries.length - 10).forEach(url => {
        preloadedVideos.current.delete(url);
      });
    }

  }, [currentIndex, videos, preloadCount]);

  return {
    isPreloaded: (videoUrl: string) => preloadedVideos.current.has(videoUrl),
    preloadedCount: preloadedVideos.current.size
  };
};
