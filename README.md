# TravelStreamz 🌍✈️

**Stream the World, Win Rewards**

TravelStreamz is a TikTok-style vertical video streaming platform that combines viral travel content with blockchain-based rewards and slot machine mechanics. Built on Base Sepolia testnet with integrated wallet connectivity and payment processing.

## 🎯 Features

### 🎥 Video Streaming
- **Vertical Scroll Feed**: TikTok-style infinite scroll with real travel videos
- **Auto-Play System**: Videos auto-advance after 3-3.5 seconds
- **Multi-Input Scrolling**:
  - 🎮 Keyboard navigation (Arrow Up/Down)
  - 👆 Touch swipe gestures (mobile)
  - 🖱️ Mouse wheel scrolling
  - 🔘 Manual navigation buttons
  - ⏱️ Automatic progression
- **Visual Progress Bar**: Real-time video progress indicator

### 🎰 Slot Machine Betting
- **3-Reel Video Slots**: Bet on location token matches
- **Token Tickers**: Display symbols like $BALI, $VEGAS, $DUBAI
- **Center Match Line**: Clear alignment indicators for winning combinations
- **Live Stream Integration**: Videos play in slot reels
- **Win Notifications**: Instant feedback on matched tokens

### 💳 Blockchain Integration
- **Base Sepolia Testnet**: All transactions on Base L2
- **Wallet Connection**: RainbowKit with Coinbase Wallet support
- **Base Pay**: Native ETH payments for all transactions
- **Real-time Status**: Track payment confirmations on-chain

### 🎨 Modern UI/UX
- **Mobile-First Design**: Fully responsive across all devices
- **Burger Menu Navigation**: Clean left/right menu system
- **Floating Action Bar**: Expandable token info widget
- **Stream Filters**: Customize content by category and location
- **View Modes**: Classic feed, multi-stream, and slot machine views

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```sh
# Clone the repository
git clone https://github.com/tebogonong/travelstreamz.git

# Navigate to project directory
cd travelstreamz

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8081`

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 + TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17 + shadcn-ui components
- **Blockchain**: Wagmi v2 + Viem (Base Sepolia)
- **Wallet**: RainbowKit + Coinbase Wallet SDK
- **Social**: Farcaster Mini App SDK
- **Video**: HTML5 Video API + Pixabay CDN

## 💎 Blockchain Features

### Base Pay Integration
All payments are processed through **Base Sepolia testnet** using native ETH:

- **Wallet Connection**: Click "Connect Wallet" to get started
- **Supported Wallets**: Coinbase Wallet, MetaMask, and other injected wallets
- **Network**: Automatically prompts to switch to Base Sepolia
- **Get Test ETH**: Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

### How to Use
1. **Connect Your Wallet**: Top-right corner (desktop) or menu (mobile)
2. **Switch to Base Sepolia**: Follow the prompt if not already on the network
3. **Bet on Slots**: Place bets on video location token matches
4. **Submit Content**: Pay $0.10 ETH to submit your travel videos
5. **Trade Tokens**: Buy/sell location tokens like $BALI, $VEGAS, $DUBAI

### Transaction Types
- 🎰 **Slot Bets**: Wager on matching location tokens across 3 reels
- 📹 **Video Submissions**: Upload your own travel content
- 💰 **Token Trading**: Speculate on viral destination popularity
- 🎁 **Rewards**: Win ETH from successful bets and viral content

## 🎮 Usage Guide

### Navigation
- **Desktop**: Use Arrow Up/Down keys or mouse wheel to scroll videos
- **Mobile**: Swipe up/down to navigate between travel streams
- **Auto-Play**: Videos automatically advance every 3-3.5 seconds
- **Manual Controls**: Use on-screen up/down buttons anytime

### View Modes
1. **Classic Feed**: Single vertical video stream
2. **Multi-Stream**: Split screen with 2-3 simultaneous streams
3. **Slot Machine**: 3-reel gambling interface with video slots

### Betting on Slots
1. Select "Slots" view mode from the menu
2. Connect your wallet if not already connected
3. Choose your bet amount
4. Click "SPIN" to start the reels
5. Win when 3 matching location tokens align on the center line

## 📱 Screenshots

- 🎥 Vertical video feed with auto-scroll
- 🎰 Slot machine with $BALI, $VEGAS, $DUBAI tickers
- 📊 Token info and trading interface
- 🔗 Wallet connection with Base Sepolia

## 📄 License

This project is licensed under the **Ribbon Protocol Business Open Source License (RP-BOSL v1.0)**.

Licensed to: **Tebogo Nong**

See [LICENSE.md](./LICENSE.md) for full terms including revenue sharing and compliance requirements.

## 🤝 Contributing

This is a whitelabel licensed project. Please refer to the license terms before contributing.

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ by Ribbon Protocol**  
Licensed to Tebogo Nong under RP-BOSL v1.0
