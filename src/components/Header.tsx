import React from 'react';
import { Wallet } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { DONATION_CONFIG } from '../config/donation';

export const Header: React.FC = () => {
  const isWalletConfigured = DONATION_CONFIG.recipientWallet !== 'YOUR_WALLET_ADDRESS_HERE';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* Imagen del logo circular */}
              <img
                src="/img/logo.png"
                alt="Woofi Logo"
                className="w-14 h-14 rounded-full object-cover"
              />

              <div>
                <h1 className="text-2xl font-bold text-gray-800">Woofi</h1>
                <p className="text-xs text-gray-600">Solana Shelter Network</p>
              </div>
            </div>

            {!isWalletConfigured && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-1">
                <p className="text-xs text-yellow-800 font-medium">⚠️ Configure donation wallet</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Wallet className="w-4 h-4" />
              <span>Connect to donate with SOL</span>
            </div>
            <WalletMultiButton className="!bg-orange-600 hover:!bg-orange-700 !text-sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
