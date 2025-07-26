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
import { shelterDogs } from './data/dogs';
import { DONATION_CONFIG } from './config/donation';
import { Dog } from './types/dog';
import { DogCard } from './components/DogCard';
import { DonationForm } from './components/DonationForm';
import '@solana/wallet-adapter-react-ui/styles.css';

// Main App Component
function App() {
  // You can also provide a custom RPC endpoint
  const network = DONATION_CONFIG.network === 'mainnet-beta' 
    ? WalletAdapterNetwork.Mainnet 
    : WalletAdapterNetwork.Devnet;
  
  // You can also provide a custom RPC endpoint
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
          <DonationDashboard />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Donation Dashboard Component
function DonationDashboard() {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  
  const handleDogSelect = (dog: Dog) => {
    setSelectedDog(dog);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-5xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <img src="/img/logo.png" alt="Woofi Logo" className="h-24 mb-6" />
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Woofi Donation Dashboard</h1>
              <p className="text-xl text-gray-600 mb-8">Help our furry friends find their forever homes!</p>
              
              <div className="w-full flex justify-end mb-4">
                <WalletMultiButton />
              </div>

              {/* Dog Selection */}
              <div className="w-full mb-8">
                <h2 className="text-2xl font-bold mb-4">Select a Dog to Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shelterDogs.map((dog) => (
                    <DogCard 
                      key={dog.id}
                      dog={dog}
                      isSelected={selectedDog?.id === dog.id}
                      onSelect={handleDogSelect}
                    />
                  ))}
                </div>
              </div>

              {/* Donation Form */}
              {selectedDog && (
                <DonationForm selectedDog={selectedDog} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;