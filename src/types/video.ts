export interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TokenMetrics {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  holders: number;
  marketCap: number;
}

export interface VideoContent {
  id: string;
  location: Location;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  viralityScore: number;
  token: TokenMetrics;
  bettingPool: number;
  createdAt: Date;
  paidToPost: number;
}
