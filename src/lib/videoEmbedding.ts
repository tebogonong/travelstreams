export interface EmbeddedVideo {
  id: string
  title: string
  creator: string
  platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'vimeo' | 'twitch' | 'facebook'
  originalUrl: string
  embedUrl: string
  thumbnail: string
  duration?: string
  tags: string[]
  category: string
  embedder: string // Base Account address
  createdAt: Date
  price: number
  viewers: number
  likes: number
  isLive: boolean
}

export interface VideoUrlInfo {
  platform: string
  videoId: string
  isValid: boolean
  embedUrl?: string
  thumbnail?: string
}

// YouTube URL patterns
const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
]

// TikTok URL patterns
const TIKTOK_PATTERNS = [
  /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
  /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
  /tiktok\.com\/t\/([a-zA-Z0-9]+)/
]

// Instagram URL patterns
const INSTAGRAM_PATTERNS = [
  /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
  /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
  /instagram\.com\/tv\/([a-zA-Z0-9_-]+)/
]

// Twitter URL patterns
const TWITTER_PATTERNS = [
  /twitter\.com\/\w+\/status\/(\d+)/,
  /x\.com\/\w+\/status\/(\d+)/
]

// Vimeo URL patterns
const VIMEO_PATTERNS = [
  /vimeo\.com\/(\d+)/,
  /player\.vimeo\.com\/video\/(\d+)/
]

// Twitch URL patterns
const TWITCH_PATTERNS = [
  /twitch\.tv\/videos\/(\d+)/,
  /twitch\.tv\/(\w+)$/,
  /clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/
]

// Facebook URL patterns
const FACEBOOK_PATTERNS = [
  /facebook\.com\/watch\/\?v=(\d+)/,
  /fb\.watch\/([a-zA-Z0-9_-]+)/
]

export function parseVideoUrl(url: string): VideoUrlInfo {
  const cleanUrl = url.trim()

  // YouTube
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = cleanUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      return {
        platform: 'youtube',
        videoId,
        isValid: true,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }
  }

  // TikTok
  for (const pattern of TIKTOK_PATTERNS) {
    const match = cleanUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      return {
        platform: 'tiktok',
        videoId,
        isValid: true,
        embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
        thumbnail: '/api/placeholder/400/225' // TikTok doesn't provide direct thumbnail URLs
      }
    }
  }

  // Instagram
  for (const pattern of INSTAGRAM_PATTERNS) {
    const match = cleanUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      return {
        platform: 'instagram',
        videoId,
        isValid: true,
        embedUrl: `https://www.instagram.com/p/${videoId}/embed/`,
        thumbnail: '/api/placeholder/400/225' // Instagram requires API for thumbnails
      }
    }
  }

  // Twitter/X
  for (const pattern of TWITTER_PATTERNS) {
    const match = cleanUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      return {
        platform: 'twitter',
        videoId,
        isValid: true,
        embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${videoId}`,
        thumbnail: '/api/placeholder/400/225'
      }
    }
  }

  // Vimeo
  for (const pattern of VIMEO_PATTERNS) {
    const match = cleanUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      return {
        platform: 'vimeo',
        videoId,
        isValid: true,
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
        thumbnail: '/api/placeholder/400/225' // Vimeo requires API for thumbnails
      }
    }
  }

  // Twitch
  for (const pattern of TWITCH_PATTERNS) {
    const match = cleanUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      const isClip = cleanUrl.includes('clips.twitch.tv')
      const isVideo = cleanUrl.includes('/videos/')
      
      let embedUrl = ''
      if (isClip) {
        embedUrl = `https://clips.twitch.tv/embed?clip=${videoId}&parent=localhost`
      } else if (isVideo) {
        embedUrl = `https://player.twitch.tv/?video=${videoId}&parent=localhost`
      } else {
        embedUrl = `https://player.twitch.tv/?channel=${videoId}&parent=localhost`
      }

      return {
        platform: 'twitch',
        videoId,
        isValid: true,
        embedUrl,
        thumbnail: '/api/placeholder/400/225'
      }
    }
  }

  // Facebook
  for (const pattern of FACEBOOK_PATTERNS) {
    const match = cleanUrl.match(pattern)
    if (match) {
      const videoId = match[1]
      return {
        platform: 'facebook',
        videoId,
        isValid: true,
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanUrl)}`,
        thumbnail: '/api/placeholder/400/225'
      }
    }
  }

  return {
    platform: 'unknown',
    videoId: '',
    isValid: false
  }
}

export function generateVideoId(): string {
  return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function validateVideoUrl(url: string): boolean {
  const info = parseVideoUrl(url)
  return info.isValid
}

export function getSupportedPlatforms(): string[] {
  return ['youtube', 'tiktok', 'instagram', 'twitter', 'vimeo', 'twitch', 'facebook']
}

export function getPlatformDisplayName(platform: string): string {
  const names: Record<string, string> = {
    youtube: 'YouTube',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    twitter: 'Twitter/X',
    vimeo: 'Vimeo',
    twitch: 'Twitch',
    facebook: 'Facebook'
  }
  return names[platform] || platform
}

// Predefined categories that match existing stream categories
export const VIDEO_CATEGORIES = [
  { id: 'beach', name: 'Beach', icon: 'Play' },
  { id: 'city', name: 'City', icon: 'Camera' },
  { id: 'nature', name: 'Nature', icon: 'TrendingUp' },
  { id: 'wildlife', name: 'Wildlife', icon: 'Users' },
  { id: 'adventure', name: 'Adventure', icon: 'Shield' },
  { id: 'food', name: 'Food', icon: 'Utensils' },
  { id: 'culture', name: 'Culture', icon: 'Globe' },
  { id: 'sports', name: 'Sports', icon: 'Trophy' },
  { id: 'music', name: 'Music', icon: 'Music' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Star' }
]

export function getRandomPrice(): number {
  // Generate random price between 1.00 and 2.00 USDC
  return Math.round((Math.random() + 1) * 100) / 100
}