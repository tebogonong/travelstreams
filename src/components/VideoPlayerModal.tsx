'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Heart, 
  Share2, 
  Eye, 
  MapPin, 
  CheckCircle,
  ExternalLink,
  Coins,
  TrendingUp
} from "lucide-react"

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
  isEmbedded?: boolean
  platform?: string
  embedUrl?: string
  originalUrl?: string
  tags?: string[]
  embedder?: string
  createdAt?: Date
}

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  video: Stream | null
  onLike?: (videoId: string) => void
  onShare?: (videoId: string) => void
}

export default function VideoPlayerModal({ 
  isOpen, 
  onClose, 
  video, 
  onLike, 
  onShare 
}: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsPlaying(true)
    } else {
      document.body.style.overflow = 'unset'
      setIsPlaying(false)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isPlaying, showControls])

  if (!video) return null

  const handleMouseMove = () => {
    setShowControls(true)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleOpenOriginal = () => {
    if (video.originalUrl) {
      window.open(video.originalUrl, '_blank')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onMouseMove={handleMouseMove}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showControls ? 1 : 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-60 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </motion.button>

          {/* Video Container */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
            {/* Video Player */}
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
              {video.isEmbedded && video.embedUrl ? (
                <iframe
                  src={`${video.embedUrl}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <Play className="h-24 w-24 text-white opacity-50" />
                </div>
              )}

              {/* Video Controls Overlay */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 pointer-events-none"
              >
                {/* Top Info Bar */}
                <div className="absolute top-0 left-0 right-0 p-6 pointer-events-auto">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
                      <div className="flex items-center space-x-4 text-white/80">
                        <span className="font-medium">{video.creator}</span>
                        {video.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-400" />
                        )}
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{video.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {video.isLive && (
                        <Badge className="bg-red-600 text-white">
                          ● LIVE
                        </Badge>
                      )}
                      {video.isEmbedded && (
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {video.platform}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                  <Button
                    onClick={handlePlayPause}
                    className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full p-4"
                    size="lg"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-white">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(video.viewers)} viewers</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span>{video.price} USDC</span>
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        video.change24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <TrendingUp className="h-3 w-3" />
                        <span>{video.change24h > 0 ? '+' : ''}{video.change24h}%</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLike?.(video.id)}
                        className="text-white hover:bg-white/20"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {formatNumber(video.likes)}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShare?.(video.id)}
                        className="text-white hover:bg-white/20"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      {video.originalUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleOpenOriginal}
                          className="text-white hover:bg-white/20"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}