import { useState } from 'react';
import { 
  ConnectionProvider, 
  WalletProvider 
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import '@solana/wallet-adapter-react-ui/styles.css';
import { DONATION_CONFIG } from './config/donation';

function App() {
  const network = DONATION_CONFIG.network === 'mainnet-beta' 
    ? WalletAdapterNetwork.Mainnet 
    : WalletAdapterNetwork.Devnet;
  
  const endpoint = DONATION_CONFIG.network === 'mainnet-beta' 
    ? 'https://mainnet.helius-rpc.com/?api-key=fcc672bb-d29e-4a0e-bc76-6575d71cbf97'
    : clusterApiUrl(network);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="relative min-h-screen bg-gray-50">
            {/* Fondo Woofi */}
            <div
              className="absolute inset-0 z-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: "url('/img/TEXTURAS-01.jpg')",
                backgroundRepeat: "repeat",
                backgroundSize: "300px",
              }}
            />

            {/* Contenido principal */}
            <Header />
            <Dashboard />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
