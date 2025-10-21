import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, Wallet } from "lucide-react";
import { useState } from "react";

interface ActionBarProps {
  tokenSymbol: string;
  tokenPrice: number;
}

export const ActionBar = ({ tokenSymbol, tokenPrice }: ActionBarProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [buyAmount, setBuyAmount] = useState(100);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-8 pb-6 px-6">
        {/* Quick Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="w-4 h-4" />
            <span>Balance: $1,250.00</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-crypto-green">
            <TrendingUp className="w-4 h-4" />
            <span>+$45.20 today</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="h-14 bg-gradient-viral hover:opacity-90 transition-opacity text-foreground font-bold text-lg rounded-2xl shadow-glow"
            onClick={() => console.log(`Bet $${betAmount} on virality`)}
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Bet ${betAmount}
          </Button>
          
          <Button
            className="h-14 bg-gradient-base hover:opacity-90 transition-opacity text-foreground font-bold text-lg rounded-2xl shadow-glow"
            onClick={() => console.log(`Buy $${buyAmount} of ${tokenSymbol}`)}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buy ${buyAmount}
          </Button>
        </div>

        {/* Quick Action Chips */}
        <div className="flex gap-2 mt-3">
          {[10, 25, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setBetAmount(amount);
                setBuyAmount(amount);
              }}
              className="flex-1 px-3 py-2 bg-muted/50 hover:bg-muted transition-colors rounded-lg text-sm font-medium text-foreground"
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Base Pay Badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-base-blue/20 rounded-full border border-base-blue">
            <div className="w-2 h-2 bg-base-blue rounded-full animate-pulse" />
            <span className="text-xs font-medium text-base-blue">Powered by Base Pay</span>
          </div>
        </div>
      </div>
    </div>
  );
};
