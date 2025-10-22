'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  X, 
  Plus, 
  Video, 
  Tag, 
  Globe2, 
  AlertCircle, 
  CheckCircle,
  Youtube,
  Music,
  Camera,
  Zap
} from "lucide-react"
import { 
  parseVideoUrl, 
  validateVideoUrl, 
  getPlatformDisplayName, 
  getSupportedPlatforms,
  VIDEO_CATEGORIES,
  getRandomPrice,
  generateVideoId,
  type EmbeddedVideo 
} from "@/lib/videoEmbedding"

interface VideoEmbedModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (video: EmbeddedVideo) => void
  userAddress: string | null
}

export default function VideoEmbedModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  userAddress 
}: VideoEmbedModalProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)
  const [urlInfo, setUrlInfo] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUrlChange = (value: string) => {
    setUrl(value)
    if (value.trim()) {
      const info = parseVideoUrl(value)
      setIsValidUrl(info.isValid)
      setUrlInfo(info)
      
      if (info.isValid) {
        // Auto-fill some fields based on platform
        if (!creator) {
          setCreator(`${getPlatformDisplayName(info.platform)} Creator`)
        }
      }
    } else {
      setIsValidUrl(null)
      setUrlInfo(null)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!isValidUrl || !urlInfo || !title.trim() || !creator.trim() || !category) {
      return
    }

    setIsSubmitting(true)

    try {
      const embeddedVideo: EmbeddedVideo = {
        id: generateVideoId(),
        title: title.trim(),
        creator: creator.trim(),
        platform: urlInfo.platform as any,
        originalUrl: url,
        embedUrl: urlInfo.embedUrl,
        thumbnail: urlInfo.thumbnail || '/api/placeholder/400/225',
        tags: [...tags],
        category,
        embedder: userAddress || 'anonymous',
        createdAt: new Date(),
        price: getRandomPrice(),
        viewers: Math.floor(Math.random() * 1000) + 50,
        likes: Math.floor(Math.random() * 500) + 10,
        isLive: false,
        duration: '0:00' // Will be updated based on actual video
      }

      onSubmit(embeddedVideo)
      resetForm()
      onClose()
    } catch (error) {
      console.error('Error submitting video:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setUrl('')
    setTitle('')
    setCreator('')
    setCategory('')
    setTags([])
    setNewTag('')
    setIsValidUrl(null)
    setUrlInfo(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="w-4 h-4" />
      case 'tiktok': return <Music className="w-4 h-4" />
      case 'instagram': return <Camera className="w-4 h-4" />
      case 'twitter': return <Zap className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Embed Video
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="video-url">Video URL</Label>
                  <div className="relative">
                    <Input
                      id="video-url"
                      placeholder="Paste video URL from YouTube, TikTok, Instagram, Twitter, etc."
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className={`pr-10 ${
                        isValidUrl === true ? 'border-green-500' : 
                        isValidUrl === false ? 'border-red-500' : ''
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isValidUrl === true && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {isValidUrl === false && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  
                  {urlInfo && isValidUrl && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      {getPlatformIcon(urlInfo.platform)}
                      <span>Valid {getPlatformDisplayName(urlInfo.platform)} URL detected</span>
                    </div>
                  )}
                  
                  {isValidUrl === false && (
                    <p className="text-sm text-red-600">
                      Please enter a valid URL from supported platforms: {getSupportedPlatforms().map(p => getPlatformDisplayName(p)).join(', ')}
                    </p>
                  )}
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="video-title">Video Title</Label>
                  <Input
                    id="video-title"
                    placeholder="Enter a descriptive title for the video"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Creator Input */}
                <div className="space-y-2">
                  <Label htmlFor="video-creator">Creator Name</Label>
                  <Input
                    id="video-creator"
                    placeholder="Enter the creator's name or channel"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="video-category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isValidUrl || !title.trim() || !creator.trim() || !category || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? 'Embedding...' : 'Embed Video'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}