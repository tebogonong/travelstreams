import { VideoContent } from "@/types/video";
import { TrendingUp, TrendingDown, Users, DollarSign, Flame } from "lucide-react";

interface VideoCardProps {
  video: VideoContent;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const isPositiveChange = video.token.change24h >= 0;

  return (
    <div className="absolute inset-0">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black">
        <img
          src={video.thumbnailUrl}
          alt={video.location.name}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 pb-32">
        {/* Top Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={video.creator.avatar}
              alt={video.creator.username}
              className="w-12 h-12 rounded-full border-2 border-primary shadow-glow"
            />
            <div>
              <p className="font-bold text-foreground">{video.creator.username}</p>
              <p className="text-sm text-muted-foreground">
                {video.location.name}, {video.location.country}
              </p>
            </div>
          </div>

          {/* Virality Score */}
          <div className="flex items-center gap-2 bg-gradient-viral px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4" />
            <span className="font-bold text-sm">{video.viralityScore}</span>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="space-y-4">
          {/* Token Metrics */}
          <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-4 space-y-3 shadow-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Token</p>
                <p className="text-2xl font-bold text-foreground">${video.token.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-2xl font-bold text-foreground">${video.token.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                {isPositiveChange ? (
                  <TrendingUp className="w-4 h-4 text-crypto-green" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-crypto-red" />
                )}
                <span className={isPositiveChange ? "text-crypto-green" : "text-crypto-red"}>
                  {isPositiveChange ? "+" : ""}
                  {video.token.change24h.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Vol: ${formatNumber(video.token.volume)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{formatNumber(video.token.holders)}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Views</p>
              <p className="font-bold text-foreground">{formatNumber(video.views)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Betting Pool</p>
              <p className="font-bold text-foreground">${formatNumber(video.bettingPool)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Post Fee</p>
              <p className="font-bold text-crypto-green">${video.paidToPost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
