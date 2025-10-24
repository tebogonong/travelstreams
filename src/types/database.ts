import { ObjectId } from 'mongodb';

export interface VideoDocument {
  _id?: ObjectId;
  videoId: string;
  filename: string;
  gridfsFileId: ObjectId;
  locationId: string;
  locationName: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  creator: {
    id: string;
    username: string;
    avatar: string;
    xpPoints: number;
    totalEarnings: number;
  };
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  viralityScore: number;
  token: {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    holders: number;
    marketCap: number;
  };
  bettingPool: number;
  paidToPost: number;
  categories: string[];
  streamTags: string[];
  xpEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoResponse {
  id: string;
  videoUrl: string;
  location: {
    id: string;
    name: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  creator: {
    id: string;
    username: string;
    avatar: string;
    xpPoints: number;
    totalEarnings: number;
  };
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  viralityScore: number;
  token: {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    holders: number;
    marketCap: number;
  };
  bettingPool: number;
  paidToPost: number;
  categories: string[];
  streamTags: string[];
  xpEarned: number;
  createdAt: Date;
}
