import { useState } from 'react';
import { 
  ConnectionProvider, 
  WalletProvider 
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  BraveWalletAdapter,
  CoinbaseWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import '@solana/wallet-adapter-react-ui/styles.css';
import { DONATION_CONFIG } from './config/donation';

// Main App Component
function App() {
  const network = DONATION_CONFIG.network === 'mainnet-beta' 
    ? WalletAdapterNetwork.Mainnet 
    : WalletAdapterNetwork.Devnet;
  
  const endpoint = clusterApiUrl(network);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
    new BraveWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new SlopeWalletAdapter(),
    new TorusWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <Header />
            <Dashboard />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;