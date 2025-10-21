import { VideoContent } from "@/types/video";

export const mockVideos: VideoContent[] = [
  {
    id: "1",
    location: {
      id: "gaborone",
      name: "Gaborone",
      country: "Botswana",
      coordinates: { lat: -24.6282, lng: 25.9231 }
    },
    creator: {
      id: "creator1",
      username: "@african_explorer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53",
    duration: 5,
    views: 125000,
    viralityScore: 87,
    token: {
      symbol: "GABO",
      price: 0.45,
      change24h: 23.5,
      volume: 89000,
      holders: 1250,
      marketCap: 562500
    },
    bettingPool: 12500,
    createdAt: new Date(),
    paidToPost: 0.10
  },
  {
    id: "2",
    location: {
      id: "lagos",
      name: "Lagos",
      country: "Nigeria",
      coordinates: { lat: 6.5244, lng: 3.3792 }
    },
    creator: {
      id: "creator2",
      username: "@naija_vibes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1581888227599-779811939961",
    duration: 4,
    views: 340000,
    viralityScore: 94,
    token: {
      symbol: "LAGO",
      price: 1.25,
      change24h: 67.8,
      volume: 425000,
      holders: 3400,
      marketCap: 4250000
    },
    bettingPool: 45000,
    createdAt: new Date(),
    paidToPost: 0.10
  },
  {
    id: "3",
    location: {
      id: "nairobi",
      name: "Nairobi",
      country: "Kenya",
      coordinates: { lat: -1.2921, lng: 36.8219 }
    },
    creator: {
      id: "creator3",
      username: "@kenyan_adventures",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper"
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6",
    duration: 3,
    views: 89000,
    viralityScore: 72,
    token: {
      symbol: "NAIR",
      price: 0.32,
      change24h: -8.2,
      volume: 28500,
      holders: 890,
      marketCap: 284800
    },
    bettingPool: 8900,
    createdAt: new Date(),
    paidToPost: 0.10
  },
  {
    id: "4",
    location: {
      id: "cape-town",
      name: "Cape Town",
      country: "South Africa",
      coordinates: { lat: -33.9249, lng: 18.4241 }
    },
    creator: {
      id: "creator4",
      username: "@cape_explorer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe"
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    duration: 5,
    views: 210000,
    viralityScore: 88,
    token: {
      symbol: "CAPE",
      price: 0.89,
      change24h: 34.2,
      volume: 187000,
      holders: 2100,
      marketCap: 1869000
    },
    bettingPool: 21000,
    createdAt: new Date(),
    paidToPost: 0.10
  },
  {
    id: "5",
    location: {
      id: "accra",
      name: "Accra",
      country: "Ghana",
      coordinates: { lat: 5.6037, lng: -0.1870 }
    },
    creator: {
      id: "creator5",
      username: "@ghana_scenes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie"
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e",
    duration: 4,
    views: 67000,
    viralityScore: 65,
    token: {
      symbol: "ACCR",
      price: 0.18,
      change24h: 12.4,
      volume: 12000,
      holders: 670,
      marketCap: 120600
    },
    bettingPool: 6700,
    createdAt: new Date(),
    paidToPost: 0.10
  }
];
