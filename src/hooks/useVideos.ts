import { useState, useEffect } from 'react';
import { VideoContent } from '@/types/video';

const API_BASE_URL = 'http://localhost:3001/api';

export const useVideos = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/videos`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos from API');
        }
        
        const data = await response.json();
        setVideos(data);
        setError(null);
        console.log(`✅ Loaded ${data.length} videos from MongoDB`);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Load fallback placeholder videos (no external dependencies)
        const { fallbackVideos } = await import('@/data/mockVideos');
        setVideos(fallbackVideos);
        console.log('⚠️ API unavailable - Using local placeholder videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};

export const useVideosByLocation = (locationId: string) => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/videos/location/${locationId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch videos for location ${locationId}`);
        }
        
        const data = await response.json();
        setVideos(data);
        setError(null);
        console.log(`✅ Loaded ${data.length} videos for ${locationId}`);
      } catch (err) {
        console.error('Error fetching videos by location:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Load fallback placeholder videos and filter by location
        const { fallbackVideos } = await import('@/data/mockVideos');
        const filtered = fallbackVideos.filter(v => v.location.id === locationId);
        setVideos(filtered);
        console.log('⚠️ API unavailable - Using local placeholder videos for location');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [locationId]);

  return { videos, loading, error };
};

export const videoApi = {
  getAllVideos: async (): Promise<VideoContent[]> => {
    const response = await fetch(`${API_BASE_URL}/videos`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return response.json();
  },

  getVideosByLocation: async (locationId: string): Promise<VideoContent[]> => {
    const response = await fetch(`${API_BASE_URL}/videos/location/${locationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos by location');
    }
    return response.json();
  },

  getVideoStreamUrl: (fileId: string): string => {
    return `${API_BASE_URL}/videos/stream/${fileId}`;
  }
};
