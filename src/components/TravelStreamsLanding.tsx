'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBaseAccount } from './BaseAccountProvider'
import VideoEmbedModal from './VideoEmbedModal'
import VideoPlayerModal from './VideoPlayerModal'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNumber } from "@/lib/utils"
import { type EmbeddedVideo } from "@/lib/videoEmbedding"
import { 
  Globe2, 
  Play, 
  Coins, 
  Shield, 
  TrendingUp, 
  Users,
  Camera,
  BarChart3,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle,
  Heart,
  Share2,
  Eye,
  MessageCircle,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Grid,
  List,
  Bell,
  User,
  Home,
  Plus,
  Settings,
  Video,
  Trash2,
  Utensils,
  Globe
} from "lucide-react"

// Move embeddedVideos outside component to prevent re-creation
const EMBEDDED_VIDEOS: Stream[] = [
  {
    id: 'embed_1',
    title: 'Amazing Bali Beach Sunset',
    creator: 'TravelVlogger',
    location: 'Bali, Indonesia',
    viewers: 1542,
    likes: 3421,
    price: 0.75,
    change24h: 18.2,
    isLive: false,
    thumbnail: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
    category: 'beach',
    duration: '3:45',
    verified: false,
    isEmbedded: true,
    platform: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['beach', 'sunset', 'bali'],
    embedder: 'demo_user',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'embed_2',
    title: 'Street Food Tour in Bangkok',
    creator: 'FoodAdventurer',
    location: 'Bangkok, Thailand',
    viewers: 2341,
    likes: 5678,
    price: 1.25,
    change24h: 12.8,
    isLive: false,
    thumbnail: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    category: 'food',
    duration: '8:22',
    verified: true,
    isEmbedded: true,
    platform: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    originalUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    tags: ['food', 'street food', 'bangkok'],
    embedder: 'demo_user',
    createdAt: new Date('2024-01-14')
  },
  {
    id: 'embed_3',
    title: 'Hiking the Swiss Alps',
    creator: 'MountainExplorer',
    location: 'Swiss Alps, Switzerland',
    viewers: 1876,
    likes: 4321,
    price: 1.85,
    change24h: 25.4,
    isLive: false,
    thumbnail: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    category: 'adventure',
    duration: '12:15',
    verified: true,
    isEmbedded: true,
    platform: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/ZXsQAXx_ao0',
    originalUrl: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
    tags: ['hiking', 'mountains', 'adventure'],
    embedder: 'demo_user',
    createdAt: new Date('2024-01-13')
  },
  {
    id: 'embed_4',
    title: 'Amazon Rainforest Wildlife',
    creator: 'NatureDocumentary',
    location: 'Amazon Rainforest, Brazil',
    viewers: 3421,
    likes: 7890,
    price: 2.15,
    change24h: 31.7,
    isLive: false,
    thumbnail: 'https://media.giphy.com/media/3o7TKqnN349PBUtGFO/giphy.gif',
    category: 'nature',
    duration: '15:30',
    verified: true,
    isEmbedded: true,
    platform: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/hFZFjoX2cGg',
    originalUrl: 'https://www.youtube.com/watch?v=hFZFjoX2cGg',
    tags: ['nature', 'wildlife', 'amazon'],
    embedder: 'demo_user',
    createdAt: new Date('2024-01-12')
  },
  {
    id: 'embed_5',
    title: 'Traditional Japanese Culture',
    creator: 'CultureGuide',
    location: 'Kyoto, Japan',
    viewers: 1234,
    likes: 2876,
    price: 1.45,
    change24h: 8.9,
    isLive: false,
    thumbnail: 'https://media.giphy.com/media/3o7TKqnN349PBUtGFO/giphy.gif',
    category: 'culture',
    duration: '6:45',
    verified: false,
    isEmbedded: true,
    platform: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    originalUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    tags: ['culture', 'japan', 'traditional'],
    embedder: 'demo_user',
    createdAt: new Date('2024-01-11')
  },
  {
    id: 'embed_6',
    title: 'New York City Skyline',
    creator: 'UrbanPhotographer',
    location: 'New York City, USA',
    viewers: 987,
    likes: 1543,
    price: 0.95,
    change24h: -3.2,
    isLive: false,
    thumbnail: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    category: 'city',
    duration: '4:20',
    verified: true,
    isEmbedded: true,
    platform: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/me6aoX0wCV8',
    originalUrl: 'https://www.youtube.com/watch?v=me6aoX0wCV8',
    tags: ['city', 'skyline', 'urban'],
    embedder: 'demo_user',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'embed_7',
    title: 'African Safari Adventure',
    creator: 'SafariGuide',
    location: 'Serengeti, Tanzania',
    viewers: 2765,
    likes: 6543,
    price: 2.35,
    change24h: 22.1,
    isLive: false,
    thumbnail: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    category: 'wildlife',
    duration: '18:45',
    verified: true,
    isEmbedded: true,
    platform: 'YouTube',
    embedUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ',
    originalUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    tags: ['wildlife', 'safari', 'africa'],
    embedder: 'demo_user',
    createdAt: new Date('2024-01-09')
  }
]

interface Stream {
  id: string
  title: string
  creator: string
  location: string
  viewers: number
  likes: number
  price: number
  change24h: number
  isLive: boolean
  thumbnail: string
  category: string
  duration: string
  verified: boolean
  // Video embedding fields
  isEmbedded?: boolean
  platform?: string
  embedUrl?: string
  originalUrl?: string
  tags?: string[]
  embedder?: string
  createdAt?: Date
}

interface User {
  id: string
  name: string
  avatar: string
  followers: number
  streams: number
  verified: boolean
}

export default function TravelStreamsApp() {
  const { isConnected, userAddress, isConnecting, signIn, signOut, payWithBase } = useBaseAccount()
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [userBalance, setUserBalance] = useState(1250.50)
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
  const [isVideoEmbedModalOpen, setIsVideoEmbedModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Stream | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  // Video player functions
  const openVideoModal = (video: Stream) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }

  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
    setSelectedVideo(null)
    setPlayingVideo(null)
  }

  const playVideo = (video: Stream) => {
    setPlayingVideo(video.id)
    openVideoModal(video)
  }

  const streams: Stream[] = [
    {
      id: '1',
      title: 'Sunset at Santorini - Live',
      creator: 'TravelWithSarah',
      location: 'Santorini, Greece',
      viewers: 2341,
      likes: 8921,
      price: 1.85,
      change24h: 12.5,
      isLive: true,
      thumbnail: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
      category: 'beach',
      duration: 'Live',
      verified: true,
      isEmbedded: true,
      platform: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'Tokyo Street Food Adventure',
      creator: 'FoodieExplorer',
      location: 'Tokyo, Japan',
      viewers: 1823,
      likes: 6543,
      price: 1.25,
      change24h: -5.2,
      isLive: true,
      thumbnail: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
      category: 'city',
      duration: 'Live',
      verified: true,
      isEmbedded: true,
      platform: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      originalUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
    },
    {
      id: '3',
      title: 'Northern Lights in Iceland',
      creator: 'ArcticWanderer',
      location: 'Reykjavik, Iceland',
      viewers: 3421,
      likes: 12456,
      price: 1.95,
      change24h: 28.9,
      isLive: true,
      thumbnail: 'https://media.giphy.com/media/3o7TKQ8kAP0f9X5PoY/giphy.gif',
      category: 'nature',
      duration: 'Live',
      verified: true,
      isEmbedded: true,
      platform: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/Uj1ykZWtPYI',
      originalUrl: 'https://www.youtube.com/watch?v=Uj1ykZWtPYI'
    },
    {
      id: '4',
      title: 'Dubai Skyline Tour',
      creator: 'UrbanExplorer',
      location: 'Dubai, UAE',
      viewers: 987,
      likes: 3456,
      price: 1.10,
      change24h: 8.1,
      isLive: false,
      thumbnail: 'https://media.giphy.com/media/3o7TKQ8kAP0f9X5PoY/giphy.gif',
      category: 'city',
      duration: '2:45',
      verified: false,
      isEmbedded: true,
      platform: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
      originalUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0'
    },
    {
      id: '5',
      title: 'Safari in Kenya',
      creator: 'WildlifeTales',
      location: 'Nairobi, Kenya',
      viewers: 2156,
      likes: 9876,
      price: 1.75,
      change24h: 15.3,
      isLive: true,
      thumbnail: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
      category: 'wildlife',
      duration: 'Live',
      verified: true,
      isEmbedded: true,
      platform: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/YQHsXMglC9A',
      originalUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A'
    },
    {
      id: '6',
      title: 'Machu Picchu Sunrise',
      creator: 'AncientPaths',
      location: 'Cusco, Peru',
      viewers: 1876,
      likes: 7654,
      price: 1.45,
      change24h: -2.1,
      isLive: false,
      thumbnail: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
      category: 'adventure',
      duration: '1:23',
      verified: true,
      isEmbedded: true,
      platform: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/hFZFjoX2cGg',
      originalUrl: 'https://www.youtube.com/watch?v=hFZFjoX2cGg'
    }
  ]

  const categories = [
    { id: 'all', name: 'All', icon: Globe2 },
    { id: 'beach', name: 'Beach', icon: Play },
    { id: 'city', name: 'City', icon: Camera },
    { id: 'nature', name: 'Nature', icon: TrendingUp },
    { id: 'wildlife', name: 'Wildlife', icon: Users },
    { id: 'adventure', name: 'Adventure', icon: Shield },
    { id: 'food', name: 'Food', icon: Utensils },
    { id: 'culture', name: 'Culture', icon: Globe }
  ]

  const trendingCreators: User[] = [
    { id: '1', name: 'TravelWithSarah', avatar: '/api/placeholder/40/40', followers: 45231, streams: 127, verified: true },
    { id: '2', name: 'FoodieExplorer', avatar: '/api/placeholder/40/40', followers: 38921, streams: 89, verified: true },
    { id: '3', name: 'ArcticWanderer', avatar: '/api/placeholder/40/40', followers: 29876, streams: 156, verified: false },
    { id: '4', name: 'UrbanExplorer', avatar: '/api/placeholder/40/40', followers: 21453, streams: 67, verified: true }
  ]

  // Combine streams and embedded videos directly without state
  const allStreams = [...streams, ...EMBEDDED_VIDEOS]

  const filteredStreams = allStreams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || stream.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Debug logging
  console.log('All streams:', allStreams.length)
  console.log('Embedded videos:', EMBEDDED_VIDEOS.length)
  console.log('Filtered streams:', filteredStreams.length)
  console.log('Embedded streams in filtered:', filteredStreams.filter(s => s.isEmbedded).length)

  const handleBuyStream = async (stream: Stream) => {
    if (!isConnected) {
      alert('Please sign in with Base Account to purchase streams!')
      return
    }

    try {
      // Price is already in USDC format
      const usdcAmount = stream.price.toFixed(2)
      
      const payment = await payWithBase(
        usdcAmount,
        '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6', // Demo recipient address
        true // testnet
      )
      
      console.log('Payment successful:', payment)
      setUserBalance(prev => prev - stream.price)
      alert(`Successfully purchased ${stream.title} for $${usdcAmount} USDC!`)
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    }
  }

  const handleLikeStream = (streamId: string) => {
    // In a real app, this would update the backend
    console.log('Liked stream:', streamId)
  }

  const handleShareStream = (streamId: string) => {
    // In a real app, this would open share dialog
    console.log('Share stream:', streamId)
  }

  // Note: Video embedding functionality temporarily disabled
  // since we moved to static EMBEDDED_VIDEOS for demo purposes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Base Pay Banner */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">B</span>
            </div>
            <span className="font-medium">Base Pay Enabled</span>
            <span className="text-blue-100">• Instant, low-cost transactions</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>Gas: ~0.0001 ETH</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Secured by Base</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-br from-[#167a5f] to-[#142092] rounded-lg"></div>
                <span className="text-xl font-bold text-[#142092]">Travel Streams</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Button variant="ghost" className="text-gray-700 hover:text-[#142092]">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button variant="ghost" className="text-gray-700 hover:text-[#142092]">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </Button>
                <Button variant="ghost" className="text-gray-700 hover:text-[#142092]">
                  <MapPin className="h-4 w-4 mr-2" />
                  Explore
                </Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <Coins className="h-4 w-4 text-[#167a5f]" />
                <span className="text-sm font-medium">{userBalance.toFixed(2)} ETH</span>
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              
              {/* Base Account Sign In/Out */}
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">B</span>
                    </div>
                    <span className="text-sm font-medium text-blue-700">
                      {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signIn}
                  disabled={isConnecting}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white font-bold text-xs">B</span>
                      </div>
                      Sign in with Base
                    </>
                  )}
                </Button>
              )}
              
              {isConnected && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsVideoEmbedModalOpen(true)}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Embed Video
                </Button>
              )}
              
              <Button className="bg-[#167a5f] text-white hover:bg-[#167a5f]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Stream
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search streams, creators, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home">🔥 Trending</TabsTrigger>
            <TabsTrigger value="live">📡 Live Now</TabsTrigger>
            <TabsTrigger value="portfolio">💼 Portfolio</TabsTrigger>
            <TabsTrigger value="creators">👥 Creators</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStreams.map((stream) => (
                <Card key={stream.id} className={`overflow-hidden transition-all duration-300 cursor-pointer ${
                  stream.isEmbedded 
                    ? 'hover:shadow-xl hover:scale-[1.02] border-2 border-transparent hover:border-blue-200' 
                    : 'hover:shadow-lg'
                }`}>
                  <div className="relative group">
                    {stream.isEmbedded ? (
                      <div 
                        className="aspect-video relative overflow-hidden"
                        onClick={() => playVideo(stream)}
                      >
                        <img 
                          src={stream.thumbnail} 
                          alt={stream.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 text-gray-800 fill-current" />
                          </div>
                        </div>
                        <Badge className="absolute bottom-2 left-2 bg-red-600 text-white text-xs animate-pulse">
                           <Video className="h-3 w-3 mr-1" />
                           {stream.platform}
                         </Badge>
                      </div>
                    ) : (
                      <div className="aspect-video bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white opacity-50" />
                      </div>
                    )}
                    {stream.isLive && (
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                        ● LIVE
                      </Badge>
                    )}
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      {formatNumber(stream.viewers)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {stream.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{stream.creator}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {stream.location}
                          {stream.verified && (
                            <CheckCircle className="h-3 w-3 ml-1 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Coins className="h-4 w-4 text-[#167a5f]" />
                          <span className="font-medium">{stream.price} USDC</span>
                        </div>
                        <div className={`flex items-center space-x-1 text-sm ${
                          stream.change24h > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="h-3 w-3" />
                          <span>{stream.change24h > 0 ? '+' : ''}{stream.change24h}%</span>
                        </div>
                      </div>
                      {stream.isEmbedded && (
                        <div className="flex items-center space-x-1">
                          <Badge variant="secondary" className="text-xs">
                            {stream.platform}
                          </Badge>
                          {/* Remove button temporarily disabled for demo
                          {stream.embedder === userAddress && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveEmbed(stream.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                          */}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-gray-500">
                        <Button variant="ghost" size="sm" onClick={() => handleLikeStream(stream.id)}>
                          <Heart className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">{formatNumber(stream.likes)}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleShareStream(stream.id)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-[8px]">B</span>
                          </div>
                          <span>Base Pay</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-1"
                          onClick={() => handleBuyStream(stream)}
                          disabled={!isConnected}
                        >
                          <DollarSign className="h-3 w-3" />
                          <span>${stream.price} USDC</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStreams.filter(s => s.isLive).map((stream) => (
                <Card key={stream.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-linear-to-br from-red-400 to-orange-600 flex items-center justify-center">
                      <Play className="h-16 w-16 text-white opacity-75" />
                    </div>
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1">
                      ● LIVE NOW
                    </Badge>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/70 text-white p-3 rounded-lg">
                        <h3 className="font-semibold mb-1">{stream.title}</h3>
                        <div className="flex items-center justify-between text-sm">
                          <span>{stream.creator}</span>
                          <span>{formatNumber(stream.viewers)} watching</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Coins className="h-4 w-4 text-[#167a5f]" />
                          <span className="font-medium">{stream.price} ETH</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Started 2h ago</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          <Zap className="h-3 w-3" />
                          <span>Base Pay</span>
                        </div>
                      </div>
                      <Button className="bg-[#167a5f] text-white hover:bg-[#167a5f]/90">
                        Join Stream
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Stream Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Value</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{userBalance.toFixed(2)} ETH</div>
                  <div className="text-sm text-green-600">+12.5% (24h)</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Streams Owned</span>
                    <Camera className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-gray-600">3 live now</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Earned</span>
                    <Coins className="h-4 w-4 text-[#167a5f]" />
                  </div>
                  <div className="text-2xl font-bold">0.89 ETH</div>
                  <div className="text-sm text-gray-600">This month</div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Your Streams</h4>
                {filteredStreams.slice(0, 3).map((stream) => (
                  <div key={stream.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-600 rounded"></div>
                      <div>
                        <h5 className="font-medium">{stream.title}</h5>
                        <p className="text-sm text-gray-600">{stream.creator}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{stream.price} ETH</div>
                      <div className={`text-sm ${stream.change24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stream.change24h > 0 ? '+' : ''}{stream.change24h}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="creators" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingCreators.map((creator) => (
                <Card key={creator.id} className="p-6 text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-purple-600 rounded-full mx-auto mb-4"></div>
                    <div className="flex items-center justify-center mb-2">
                    <h3 className="font-semibold">{creator.name}</h3>
                    {creator.verified && (
                      <CheckCircle className="h-4 w-4 ml-1 text-blue-500" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>{formatNumber(creator.followers)} followers</div>
                    <div>{creator.streams} streams</div>
                  </div>
                  <Button className="w-full bg-[#167a5f] text-white hover:bg-[#167a5f]/90">
                    Follow
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 gap-1">
          <Button variant="ghost" className="flex flex-col items-center py-3">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Trending</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3">
            <Users className="h-5 w-5" />
            <span className="text-xs">Creators</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>

      {/* Video Embed Modal - temporarily disabled for demo
      <VideoEmbedModal
        isOpen={isVideoEmbedModalOpen}
        onClose={() => setIsVideoEmbedModalOpen(false)}
        onSubmit={handleVideoEmbed}
        userAddress={userAddress}
      />
      */}

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        video={selectedVideo}
      />
    </div>
  )
}