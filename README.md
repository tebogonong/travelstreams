# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1d317255-f4f0-4978-9056-eb5add1921cc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1d317255-f4f0-4978-9056-eb5add1921cc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Wagmi (Web3 React Hooks)
- Base Sepolia Testnet
- RainbowKit (Wallet Connection)

## Base Integration

This project integrates with Base blockchain for payments and wallet connectivity:

### Features
- **Base Pay Integration**: All payments are processed through Base Sepolia testnet
- **Wallet Connection**: Connect with Coinbase Wallet or any injected wallet
- **Native ETH Payments**: Uses ETH on Base Sepolia for all transactions
- **Real-time Transaction Status**: Track payment confirmations on-chain

### Setup Base Integration

1. **Install Dependencies**: Already included in package.json
2. **Connect Wallet**: Click "Connect Wallet" in the top-right corner
3. **Switch to Base Sepolia**: The app will prompt you to switch networks
4. **Get Test ETH**: Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

### Usage
- **Trading**: Connect wallet to bet on video virality or buy location tokens
- **Content Submission**: Pay $0.10 in ETH to submit videos to the stream
- **All transactions are processed on Base Sepolia testnet**

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1d317255-f4f0-4978-9056-eb5add1921cc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
