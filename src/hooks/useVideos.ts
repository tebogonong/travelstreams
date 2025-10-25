import { useState, useEffect } from 'react';
import { VideoContent } from '@/types/video';

const API_BASE_URL = 'http://localhost:3001/api';

export const useVideos = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchVideos = async () => {
      try {
        console.log('🔄 Fetching videos from API...');
        console.log('📍 API URL:', `${API_BASE_URL}/videos`);
        
        setLoading(true);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(`${API_BASE_URL}/videos`, {
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        console.log('📡 Response status:', response.status, response.statusText);
        console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API error response:', errorText);
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('✅ Successfully fetched data');
        console.log('📊 Video count:', data.length);
        console.log('📦 Sample video:', data[0] ? {
          id: data[0].id,
          location: data[0].location?.name,
          duration: data[0].duration
        } : 'No videos');
        
        if (isMounted) {
          setVideos(data);
          setError(null);
          console.log(`✅ Loaded ${data.length} videos from MongoDB`);
        }
      } catch (err) {
        console.error('❌ Error fetching videos:');
        console.error('Error type:', err instanceof Error ? err.constructor.name : typeof err);
        console.error('Error message:', err instanceof Error ? err.message : String(err));
        
        if (err.name === 'AbortError') {
          console.error('⏱️ Request timed out after 10 seconds');
          console.error('💡 Possible causes:');
          console.error('  1. API server is not running (run: npm run api)');
          console.error('  2. MongoDB connection is slow');
          console.error('  3. Network issues');
        } else if (err.message?.includes('Failed to fetch')) {
          console.error('🔌 Connection failed');
          console.error('💡 Possible causes:');
          console.error('  1. API server not running on port 3001');
          console.error('  2. CORS issues');
          console.error('  3. Firewall blocking connection');
          console.error('  4. Check if API server is running: npm run api');
        }
        
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          
          // Load fallback placeholder videos (no external dependencies)
          const { fallbackVideos } = await import('@/data/mockVideos');
          setVideos(fallbackVideos);
          console.log('⚠️ Using local placeholder videos:', fallbackVideos.length);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVideos();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only fetch once on mount

  return { videos, loading, error };
};

export const useVideosByLocation = (locationId: string) => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/videos/location/${locationId}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch videos for location ${locationId}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          setVideos(data);
          setError(null);
          console.log(`✅ Loaded ${data.length} videos for ${locationId}`);
        }
      } catch (err) {
        console.error('Error fetching videos by location:', err);
        
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          
          // Load fallback placeholder videos and filter by location
          const { fallbackVideos } = await import('@/data/mockVideos');
          const filtered = fallbackVideos.filter(v => v.location.id === locationId);
          setVideos(filtered);
          console.log('⚠️ API unavailable - Using local placeholder videos for location');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVideos();
    
    return () => {
      isMounted = false;
    };
  }, [locationId]); // Only refetch when locationId changes

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
